const passport      = require('passport');
const passportJWT   = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT    = passportJWT.ExtractJwt;
const bcrypt        = require('bcryptjs');
const User          = require('../models/User');

const { SESSION_SECRECT } = require('../config/net.cfg');


// Local Strategy
const localStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
      // This one is typically a DB call.
      // Look for user in the database
      return User.findOne({ username: username })
              .then( user => {
                if( !user ) {
                  // User doesn't exist
                  return done( null, false, { message: 'Incorrect username or password.' } );
                }

                bcrypt.compare(password, user.password, (err, success) => {
                  if( err ) {
                    // System error
                    return done(err);
                  }

                  if( !success ) {
                    return done( null, false, { message: 'Incorrect username or password.' } );
                  }

                  // User exists => Go and generate a token
                  return done( null, user, { message: 'Logged in successfully' } );
                });
              })
              .catch( err => {
                // DB error
                done(err);
              });
});


// JWT Strategy
const TokenStrategy = new JWTStrategy({
    jwtFromRequest  : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey     : SESSION_SECRECT
  },
  (payload, done) => {
    // Find the user in db if needed.
    // This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findById(payload.id)
      .then( user => {
        // Prepare connected user data
        const connectedUser = {
          id: user._id,
          fullname: user.fullname,
          username: user.username,
          email: user.email
        };

        return done(null, connectedUser);
      })
      .catch(err => {
        return done(err);
      });
});


// Configure passport to use our strategy
passport.use(localStrategy);
passport.use(TokenStrategy);
