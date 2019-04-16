const access = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const {permit} = require("../utils/utils")
const {admin, rh, com} = require("../consts/consts")

// Session secret
const { SESSION_SECRECT } = require("../config/net.cfg");

// ORM user model
const User = require('../models/User');

// Passport config
const authOptions = {
  successRedirect: "/",
  failureRedirect: "/access/login",
  session: false,
  failureFlash: "Invalid username or password.",
  successFlash: "Welcome!"
};

/**
 * @route POST /access/login
 * @desc Authenticate user
 */
access.post("/login", (req, res) => {
  // Passport authentication
  passport.authenticate("local", authOptions, (err, user, info) => {
    if (err || !user) {
      // User doesn't exist / Error
      res.statusMessage = info.message;
      return res.status(401).json({ message: info.message });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        // TODO: Add a custom logger
        console.log(err);
        return res.status(500).json({ message: "Internal error", err });
      }

      // Generate a signed web token with the contents
      // of user object and return it in the response
      // User exists => Send token
      const connectedUser = {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role
      };

      jwt.sign(
        connectedUser,
        SESSION_SECRECT,
        { expiresIn: "30h" },
        (err, token) => {
          if (err) {
            // TODO: Add a custom logger
            console.log(err);
            return res.status(500).json({ message: "Internal error" });
          }
          let username = connectedUser.username;
          let role = connectedUser.role;
          res.json({ token , username, role});
        }
      );
    });
  })(req, res);
});

/**
 * @route POST /access/register
 * @desc Register user
 */
access.post("/register", permit([admin]), (req, res) => {
  // Get form data
  const data = {
    fullname: req.sanitize(req.body.fullname),
    username: req.sanitize(req.body.username),
    password: req.sanitize(req.body.password),
    email: req.sanitize(req.body.email),
    role: req.sanitize(req.body.role),
  };

  // Check if user exists first
  User.findOne(
    { $or: [{ email: data.email }, { username: data.username }] },
    (err, user) => {
      if (err) {
        // TODO: Add a custom logger
        console.log(err);
        return res.status(500).json({ message: "Internal error" });
      }

      if (user) {
        res.statusMessage = "User already exists";
        return res.status(401).json({ message: "User already exists" });
      }

      // Create a new user
      let newUser = new User({
        fullname: data.fullname,
        username: data.username,
        password: data.password,
        email: data.email
      });

      // Store user secure password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          // TODO: Add a custom logger
          console.log(err);
          return res.status(500).json({ message: "Internal error" });
        }

        bcrypt.hash(newUser.password, salt, function(err, hash) {
          if (err) {
            // TODO: Add a custom logger
            console.log(err);
            return res.status(500).json({ message: "Internal error" });
          }

          newUser.password = hash;

          newUser.save(err => {
            if (err) {
              // TODO: Add a custom logger
              console.log(err);
              return res.status(500).json({ message: "Internal error" });
            }

            res.status(201).json(newUser);
          });
        });
      });
    }
  );
});

module.exports = access;
