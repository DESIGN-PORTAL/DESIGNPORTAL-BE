'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const pump = require('pump');

class FilesController extends Controller {
  async list() {
    const { page, limit, name } = this.ctx.query;

    const filterData = {};

    if (name) {
      const reg = new RegExp(name, 'i');
      Object.assign(filterData, {
        name: { $regex: reg }
      });
    }

    const res = await this.ctx.service.image.list(+page, +limit, filterData);

    const { count, list } = res;

    const resList = list.map((item) => {
      return {
        id: item._id,
        name: item.name,
        url: item.url,
        type: item.type,
        createUser: item.createUser,
        remark: item.remark,
        createAt: item.createAt,
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


  // 上传图片 并保存到素材库
  async uploadResource() {
    const ctx = this.ctx;

    const file = ctx.request.files[0];

    const nameSplit = file.filename.split('.');
    const fileType = nameSplit[nameSplit.length - 1];
    const fileId = `${Date.now()}${Math.floor(Math.random() * Math.floor(10000))}`;
    const fileName = `${fileId}.${fileType}`;

    const name = 'egg-oss-upload-resource/' + fileName;
    let result;
    try {
      result = await ctx.oss.put(name, file.filepath);
    } finally {
      await fs.unlink(file.filepath, () => {});
    }

    if (result.res && result.res.status === 200) {
      // 如果保存到数据库
      const data = {
        name: fileName,
        url: result.url,
        type: 'image',
        createUser: 'net',
        remark: '',
        createAt: Date.now(),
        updateAt: Date.now(),
      }
      const res = await this.ctx.service.image.add(data)

      if (res._id) {
        ctx.body = {
          code: 0,
          data: result.url,
        };
        return
      }

      ctx.body = {
        code: 1003,
        data: '文件上传失败',
      };
      return
    }

    ctx.body = {
      code: 1003,
      msg: '文件上传失败',
    };
  }

  async upload() {
    const ctx = this.ctx;

    const file = ctx.request.files[0];

    const nameSplit = file.filename.split('.');
    const fileType = nameSplit[nameSplit.length - 1];
    const fileId = `${Date.now()}${Math.floor(Math.random() * Math.floor(10000))}`;
    const fileName = `${fileId}.${fileType}`;

    const name = 'egg-oss-upload-common/' + fileName;
    let result;
    try {
      result = await ctx.oss.put(name, file.filepath);
    } finally {
      await fs.unlink(file.filepath, () => {});
    }

    if (result.res && result.res.status === 200) {
      ctx.body = {
        code: 0,
        data: result.url,
      };
      return
    }

    ctx.body = {
      code: 1003,
      msg: '上传失败',
    };
  }

  /**
   * 上传文件到oss
   */
  async uploadImg2Oss() {
    const ctx = this.ctx;
    
    
    // console.log('file', ctx.request.files)
    const file = ctx.request.files[0];
    const name = 'egg-oss-upload/' + path.basename(file.filename);
    let result;
    try {
      result = await ctx.oss.put(name, file.filepath);
    } finally {
      await fs.unlink(file.filepath);
    }

    if (result.res && result.res.status === 200) {
      this.ctx.body = {
        success: true,
        file_names: result.res.requestUrls,
      };
      return
    }

    this.ctx.body = {
      code: 1003,
      msg: '上传失败',
    };
  }
}

module.exports = FilesController;

