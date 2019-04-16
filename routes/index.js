const accessRouter    = require('./access');
const profileRouter    = require('./profile');
const searchRouter    = require('./search');
const uploadRouter    = require('./upload');
const userRouter    = require('./user');

// Exporting routing modules
module.exports = {
  access: accessRouter,
  profiles: profileRouter,
  search: searchRouter,
  upload: uploadRouter,
  user: userRouter,
}
