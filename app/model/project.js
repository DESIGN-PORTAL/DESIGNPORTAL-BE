module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const schema = new Schema({
    name: { type: String },
    data: { type: Object },
    socialShare: { type: Object },
    createUser: { type: String },
    createAt: { type: Date },
    updateAt: { type: Date },
  });

  return app.mongoose.model('Project', schema);
}
