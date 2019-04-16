const Schema = require('mongoose').Schema;
const db = require('../config/db.cfg')();

const UserSchema = new Schema({
    fullname:  { type: String, required: true, default: '' },
    username:  { type: String, required: true, default: '' },
    password:  { type: String, required: true, default: '' },
    email:  { type: String, required: true, default: '' },
    registerd: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    role: { type: String, required: true, default: '' },
    code_activation: {type: String, required: false, default: ''}
  }, {
    collection: 'users'
  });

  module.exports = db.model('User', UserSchema);