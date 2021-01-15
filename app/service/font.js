const Service = require('egg').Service;

class FontService extends Service {
  async getOne(data) {
    return await this.ctx.model.Font.findOne(data);
  }

  async add(data) {
    return await this.ctx.model.Font.create(data);
  }

  async list(page, limit, data) {
    const count = await this.ctx.model.Font.find(data).countDocuments();
    const list = await this.ctx.model.Font.find(data).sort({ createAt : -1 }).skip((page - 1) * limit).limit(limit);

    return { count, list };
  }
  
}

module.exports = FontService;
