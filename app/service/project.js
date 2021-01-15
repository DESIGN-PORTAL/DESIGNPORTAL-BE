const Service = require('egg').Service;

class ProjectService extends Service {
  async getOne(data) {
    return await this.ctx.model.Project.findOne(data);
  }

  async add(data) {
    return await this.ctx.model.Project.create(data);
  }

  async edit(data, filter) {
    return await this.ctx.model.Project.updateOne(filter, data);
  }

  async list(page, limit, data) {
    const count = await this.ctx.model.Project.find(data).countDocuments();
    const list = await this.ctx.model.Project.find(data).sort({ createAt : -1 }).skip((page - 1) * limit).limit(limit);

    return { count, list };
  }
}

module.exports = ProjectService;
