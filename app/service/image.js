const Service = require('egg').Service;

class ImageService extends Service {
  async getOne(data) {
    return await this.ctx.model.Image.findOne(data);
  }

  async add(data) {
    return await this.ctx.model.Image.create(data);
  }

  async list(page, limit, data) {
    const count = await this.ctx.model.Image.find(data).countDocuments();
    const list = await this.ctx.model.Image.find(data).sort({ createAt : -1 }).skip((page - 1) * limit).limit(limit);

    return { count, list };
  }
  
}

module.exports = ImageService;
