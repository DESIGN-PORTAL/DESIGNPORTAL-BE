module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const schema = new Schema({
    name: { type: String },
    url: { type: String },
    duration: { type: String },
    createUser: { type: String },
    remark: { type: String },
    type: { type: String },
    createAt: { type: Date },
    updateAt: { type: Date },
  });

  return app.mongoose.model('Music', schema);
}
