'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const pump = require('pump');


class MusicController extends Controller {
  async list() {
    const { page, limit, name } = this.ctx.query;
    const host = `${this.ctx.req.headers['x-forwarded-proto']}://${this.ctx.req.headers.host}`;

    const filterData = {};

    if (name) {
      const reg = new RegExp(name, 'i');
      Object.assign(filterData, {
        name: { $regex: reg }
      });
    }

    const res = await this.ctx.service.music.list(+page, +limit, filterData);

    const { count, list } = res;

    const resList = list.map((item) => {
      return {
        id: item._id,
        name: item.name,
        url: item.url,
        duration: item.duration,
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

  // async all() {
  //   const hostName = `${this.ctx.protocol}://${this.ctx.host}`
  //   const { page, limit, name } = this.ctx.query;

  //   const filterData = {};

  //   if (name) {
  //     const reg = new RegExp(name, 'i');
  //     Object.assign(filterData, {
  //       name: { $regex: reg }
  //     });
  //   }

  //   const res = await this.ctx.service.music.list(1, 100000);

  //   const { count, list } = res;

  //   const resList = list.map((item) => {
  //     return {
  //       id: item._id,
  //       name: item.name,
  //       url: item.url,
  //       duration: item.duration,
  //       createUser: item.createUser,
  //       remark: item.remark,
  //       createAt: item.createAt,
  //       updateAt: item.updateAt,
  //     }
  //   })

  //   this.ctx.body = {
  //     code: 0,
  //     data: resList,
  //   };
  // }

  async add() {
    const body = this.ctx.request.body;

    if (!this.ctx.request.files.length) {
      this.ctx.body = {
        code: 1001,
        msg: 'file字段是必填'
      };
      return
    }

    const upFile = this.ctx.request.files[0];

    const nameSplit = upFile.filename.split('.');
    const fileType = nameSplit[nameSplit.length - 1];
    const fileId = `${Date.now()}${Math.floor(Math.random() * Math.floor(10000))}`;
    const fileName = `${fileId}.${fileType}`;

    const name = 'egg-oss-upload-music/' + fileName;
    let result;
    try {
      result = await this.ctx.oss.put(name, upFile.filepath);
    } finally {
      await fs.unlink(upFile.filepath, () => {});
    }

    if (result.res && result.res.status === 200) {
      const res = await this.ctx.service.music.add({
        name: body.name,
        duration: body.duration,
        url: result.url,
        createUser: body.createUser || '热心网友',
        remark: body.remark,
        createAt: Date.now(),
        updateAt: Date.now(),
      })

      if (res._id) {
        this.ctx.body = {
          code: 0,
          msg: '创建成功',
        };
        return
      }

    }

    if (res._id) {
      this.ctx.body = {
        code: 1004,
        msg: '创建失败',
      };
    }
  }

}

module.exports = MusicController;
