// Session handling middleware
const session = require('express-session');
const cookieParser = require('cookie-parser');

// CORS middleware
const cors = require('cors');

// Request parsing middleware
const bodyParser = require('body-parser');
const uncapitalize = require('express-uncapitalize');
const passport = require('passport');
const sanitizer = require('express-sanitizer');

// Passport.js configuration
require('../config/passport.cfg');

// Session secret
const { SESSION_SECRECT } = require('../config/net.cfg');

// Session expiration date
const expiryDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day

// Configure HTTP Server features
const network = (app) => {
  app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization']
  }));
  app.use(uncapitalize());
  app.use(bodyParser.urlencoded({ extended: false ,limit:'50mb'}));
  app.use(bodyParser.json({limit:'50mb'}));
  app.use(cookieParser());
  app.use(session({
    secret: SESSION_SECRECT,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: expiryDate
    }
  }));
  app.use(passport.initialize());
  app.use(sanitizer());
}

module.exports = network;
