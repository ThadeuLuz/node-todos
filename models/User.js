const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { type: String, lowercase: true, required: true, index: true, unique: true },
  name: { type: String, required: true },
  password: String,
});

module.exports = mongoose.model('User', userSchema);
