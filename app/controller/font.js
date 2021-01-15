'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const pump = require('pump');

const fontExtract = require('../utils/fontExtract');

class FontController extends Controller {
  async list() {
    const { page, limit, name } = this.ctx.query;
    const hostName = `${this.ctx.protocol}://${this.ctx.host}${this.ctx.request.header.prefix || '' }`

    const filterData = {};

    if (name) {
      const reg = new RegExp(name, 'i');
      Object.assign(filterData, {
        name: { $regex: reg }
      });
    }

    const res = await this.ctx.service.font.list(+page, +limit, filterData);

    const { count, list } = res;

    const resList = list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        url: `${hostName}/public/fontsExt/preview/${item.id}.${item.type}`,
        type: item.type,
        createUser: item.createUser,
        remark: item.remark,
        createAt: item.createAt,
        updateAt: item.updateAt,
      }
    })

    this.ctx.body = {
      code: 0,
      data: {
        list: resList,
        total: count,
      },
    };
  }

  async all() {
    const hostName = `${this.ctx.protocol}://${this.ctx.host}${this.ctx.request.header.prefix || '' }`;

    const res = await this.ctx.service.font.list(1, 100000);

    const { count, list } = res;

    const resList = list.map((item) => {
      return {
        id: item.id,
        name: item.name,
        url: `${hostName}/public/fontsExt/preview/${item.id}.${item.type}`,
        type: item.type,
        createUser: item.createUser,
        remark: item.remark,
        createAt: item.createAt,
        updateAt: item.updateAt,
      }
    })

    this.ctx.body = {
      code: 0,
      data: resList,
    };
  }

  async add() {
    const body = this.ctx.request.body;

    if (!this.ctx.request.files.length) {
      this.ctx.body = {
        code: 500,
        msg: 'file字段是必填'
      };
      return
    }

    const upFile = this.ctx.request.files[0];

    const file = fs.readFileSync(upFile.filepath);

    const nameSplit = upFile.filename.split('.');
    const fontType = nameSplit[nameSplit.length - 1];
    const fileId = `${Date.now()}${Math.floor(Math.random() * Math.floor(10000))}`;
    const fileName = `${fileId}.${fontType}`;


    const fontDirPath = path.join(__dirname, '../public/fonts');

    if (!fs.existsSync(fontDirPath)) {
      fs.mkdirSync(fontDirPath);
    }

    const filePath = path.join(fontDirPath, fileName);

    fs.writeFileSync(filePath, file);

    const fontRes = await fontExtract({fontPath: filePath, text: body.name, isAddFont: true});

    if (!fontRes) {
      this.ctx.body = {
        code: 501,
        msg: '不支持此字体',
      }
      return
    }

    const res = await this.ctx.service.font.add({
      id: fileId,
      name: body.name,
      createUser: body.createUser || '热心网友',
      remark: body.remark,
      type: fontType,
      createAt: Date.now(),
      updateAt: Date.now(),
    })

    if (res._id) {
      this.ctx.body = {
        code: 0,
        msg: '创建成功',
      };
    }
  }

  async extract() {
    const { id, content, type, fontFamily } = this.ctx.request.body;
    const font = await this.ctx.service.font.getOne({ id });

    if (!font) {
      this.ctx.body = {
        code: 1002,
        msg: '字体不存在',
      };
      return;
    }

    const fontPath = path.join(__dirname, '..', `public/fonts/${id}.${type}`)
    
    const fontExtractRes = await fontExtract({fontPath, text: content, fontFamily, toCss: true})

    this.ctx.body = {
      code: 0,
      data: fontExtractRes,
    };
  }

  async extractBatch() {
    const hostName = `${this.ctx.protocol}://${this.ctx.host}${this.ctx.request.header.prefix || '' }`

    console.log('arr', this.ctx.request.body)
    const arr = this.ctx.request.body;
    const p = [];
    arr.forEach(item => {
      const { fontId, content, fontType } = item

      const fontPath = path.join(__dirname, '..', `public/fonts/${fontId}.${fontType}`)
      p.push(fontExtract({fontPath, text: content}))
    })
    let res = await Promise.all(p)
    const extRes = [];

    res.forEach((item, index) => {
      extRes.push({
        url: `${hostName}${item}`,
        fontId: arr[index].fontId,
      });
    })
    
    this.ctx.body = {
      code: 0,
      data: extRes,
    }
  }
}

module.exports = FontController;
