'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async getOne() {
    const { id } = this.ctx.query;

    try {
      const res = await this.ctx.service.project.getOne({ _id: id });
  
      this.ctx.body = {
        code: 0,
        data: res,
      };
    } catch {
      this.ctx.body = {
        code: 1005,
        msg: '未找到此作品',
      };
    }
  }

  async list() {
    const { page, limit, name } = this.ctx.query;

    const filterData = {};

    if (name) {
      const reg = new RegExp(name, 'i');
      Object.assign(filterData, {
        name: { $regex: reg }
      });
    }

    const res = await this.ctx.service.project.list(+page, +limit, filterData);

    const { count, list } = res;
    

    const resList = list.map((item) => {
      return {
        id: item._id,
        name: item.name,
        createUser: item.createUser,
        coverImg: item.data.pages[0].coverImg,
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

  async save() {
    const body = this.ctx.request.body;

    const data = {
      name: body.name,
      data: body.data,
      createUser: body.createUser || '热心网友',
      updateAt: Date.now(),
    };


    let res;

    if (!body.id) {
      data.createAt= Date.now();
      data.socialShare = {
        title: '',
        image: '',
        remark: '',
      };

      res = await this.ctx.service.project.add(data)
      if (res._id) {
        this.ctx.body = {
          code: 0,
          data: res._id,
        };
        return
      }
    } else {
      res = await this.ctx.service.project.edit(data, { _id: body.id })
      if (res.ok) {
        this.ctx.body = {
          code: 0,
        };
        return
      }
    }

    // const res = await this.ctx.service.project[body.id ? 'edit' : 'add'](data, { _id: body.id })

    console.log('res', res);

    // if (res._id) {
    //   this.ctx.body = {
    //     code: 0,
    //     data: res._id,
    //   };
    //   return
    // }

    this.ctx.body = {
      code: 1004,
      msg: '操作失败',
    };
  }  

  async edit() {
    const body = this.ctx.request.body;

    const data = {
      socialShare: body.socialShare,
      updateAt: Date.now(),
    };


    const res = await this.ctx.service.project.edit(data, { _id: body.id })

    if (res.ok) {
      this.ctx.body = {
        code: 0,
      };
      return
    }

    this.ctx.body = {
      code: 1004,
      msg: '操作失败',
    };
  }  

}

module.exports = ProjectController;
