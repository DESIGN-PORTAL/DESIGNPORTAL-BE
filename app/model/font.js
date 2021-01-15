module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const schema = new Schema({
    id: { type: String },
    name: { type: String },
    createUser: { type: String },
    remark: { type: String },
    type: { type: String },
    createAt: { type: Date },
    updateAt: { type: Date },
  });

  return app.mongoose.model('Font', schema);
}
