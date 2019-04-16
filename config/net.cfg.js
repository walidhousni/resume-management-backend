/**
 * @desc Port which the server is started on
 */
const PORT = process.env.PORT || 4000;

/**
 * @desc Session secret
 * @todo Replace the key generator with a more
 * mature solution
 */
const SESSION_SECRECT = process.env.SESSION_SECRECT || 'GA6TQIBOuCMvV6Q9';


const BASEURL = '/api/v1';



module.exports = {
  PORT,
  SESSION_SECRECT,
  BASEURL
};
