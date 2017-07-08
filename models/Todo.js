const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const todoSchema = mongoose.Schema({
  owner: ObjectId,
  items: { type: [], default: [] },
});

module.exports = mongoose.model('Todo', todoSchema);
