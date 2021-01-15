module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const schema = new Schema({
    id: { type: String },
    name: { type: String },
    url: { type: String },
    type: { type: String }, // 类型  图片，矢量图，图表
    createUser: { type: String },
    remark: { type: String },
    createAt: { type: Date },
    updateAt: { type: Date },
  });

  return app.mongoose.model('Image', schema);
}
