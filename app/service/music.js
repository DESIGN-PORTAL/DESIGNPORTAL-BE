const Service = require('egg').Service;

class MusicService extends Service {
  async add(data) {
    return await this.ctx.model.Music.create(data);
  }

  async list(page, limit, data) {
    const count = await this.ctx.model.Music.find(data).countDocuments();
    const list = await this.ctx.model.Music.find(data).sort({ createAt : -1 }).skip((page - 1) * limit).limit(limit);

    return { count, list };
  }
  
}

module.exports = MusicService;
