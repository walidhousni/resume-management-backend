const user = require("express").Router();
const passport = require("passport");

const _ = require('lodash')
const db = require('../config/db.cfg')();
const User = require("../models/User");

let {
    sendEmail,
    permit
} = require('../utils/utils')
const crypto = require("crypto");
const ejs = require('ejs');
const fs = require('fs');
const bcrypt = require('bcrypt');

const {
    admin,
    rh,
    com,
    platform_url,
    salt_password,
    userApi
} = require("../consts/consts")


/**
 * @route GET user/params
 * @desc Get params
 */
user.get('/params', permit([admin]), (req, res) => {

    res.json({
        params: {
            admin,
            rh,
            com
        }
    });
});


/**
 * @route POST /user
 * @desc Add user
 */
user.post('/', permit([admin]), (req, res) => {
    let {
        fullname,
        username,
        email,
        role
    } = req.body;

    const id = crypto.randomBytes(16).toString("hex");
    let code_activation = id;
    let password = id

    db.collection("users").find({})
        .toArray(function (err, result) {
            if (err) {
                return res.sendStatus(500);
            } else {

                const newUser = new User({
                    fullname: fullname ? fullname : "",
                    username: username ? username : "",
                    password: password ? password : "",
                    email: email ? email : "",
                    role: role ? role : "",
                    code_activation: code_activation ? code_activation : ""
                });
                newUser.save(err => {
                    if (err) {
                        console.log('error: ', err)
                        return res.sendStatus(500)
                    } else {
                        let userToSend = newUser
                        userToSend.link = platform_url + '/verifyuser/' + userToSend.code_activation
                        let compiled = ejs.compile(fs.readFileSync('./templates/activationEmail.html', 'utf8'));
                        let html = compiled({
                            userToSend
                        });
                        mailOptions = {
                            to: userToSend.email,
                            subject: "Activation du compte",
                            html
                        }
                        sendEmail(mailOptions)
                        res.statusMessage = "Mail sent succesfully";
                        return res.sendStatus(201)
                    }
                })
            }
        });
});


/**
 * @route PUT /user/:id
 * @desc Update user
 */
user.put('/:id', permit([admin]), (req, res) => {
    const query = {
        _id: req.params.id
    };

    const update = {
        fullname,
        username,
        email,
        role
    } = req.body;


    User.updateOne(query, update, (err) => {
        if (err) {
            return res.sendStatus(500);
        }

        res.statusMessage = 'User updated succesfully';
        return res.sendStatus(201);
    });
});


/**
 * @route DELETE /user/:id
 * @desc Delete user
 */
user.delete('/:id', permit([admin]), (req, res) => {
    const query = {
        _id: req.params.id
    };

    User.deleteOne(query, (err) => {
        if (err) {
            return res.sendStatus(500);
        }

        res.statusMessage = 'User deleted succesfully';
        return res.sendStatus(201);
    });
});


/**
 * @route GET /user/all
 * @desc Get all users
 */
user.get('/all', permit([admin]), (req, res) => {

    User.find((err, u) => {
        if (err) {
            return res.sendStatus(500);
        }

        res.json({
            allUsers: u
        });
    });
});




user.put('/verifyuser/:password', (req, res) => {

    let salt = bcrypt.genSaltSync(salt_password);
    let newPassword = bcrypt.hashSync(req.body.password1, salt);
    if (req.body.password1 !== req.body.password2) {
        res.statusMessage = 'Passwords not identical';
        return res.sendStatus(400)
    } else {
        const query = {
            code_activation: req.params.password
        };

        const update = {
            $set: {
                password: newPassword
            }
        }
        

        User.findOneAndUpdate(query, update, {new: true}, (err, userFound) => {
            if (err) {
                return res.sendStatus(404);
            } else {
                if(userFound){
                res.statusMessage = 'Password set succesfully';
                return res.sendStatus(200);
            }
                else {
                    res.statusMessage = 'Wrong code';
                    return res.sendStatus(400);
                }
            }
        });
    }

});


user.post('/reset/:id', permit([admin]), (req, res) => {
    const {
        username
    } = req.body.username;
    console.log(req.body)
    User.findOne(username, (err, p) => {
        if (err) {
            console.log("error : ", err)
            return res.sendStatus(400);
        } else {
            bcrypt.compare(req.body.password, p.password, function (err, success) {
                if (success) {
                    const code = crypto.randomBytes(16).toString("hex");
                    const query = {
                        _id: req.params.id
                    };

                    const update = {
                        $set: {
                            code_activation: code
                        }
                    }
                    User.updateOne(query, update, (err) => {
                        if (err) {
                            return res.sendStatus(404);
                        } else {
                            const query = {
                                code_activation: code
                            }
                            User.findOne(query, (err, userReset) => {
                                if (err) {
                                    console.log('here ', err)
                                    return res.sendStatus(400);
                                } else {
                                    let userToSend = userReset
                                    userToSend.link = platform_url + '/verifyuser/' + userToSend.code_activation
                                    let compiled = ejs.compile(fs.readFileSync('./templates/resetPassword.html', 'utf8'));
                                    let html = compiled({
                                        userToSend
                                    });

                                    mailOptions = {
                                        to: userToSend.email,
                                        subject: "Réinitialisation du mot de passe",
                                        html
                                    }
                                    sendEmail(mailOptions)
                                    res.statusMessage = "Mail sent succesfully";
                                    return res.sendStatus(201)
                                }
                            })
                        }
                    });

                } else {
                    res.statusMessage = "Mot de passe incorrect";
                    return res.sendStatus(403)
                }
            });
        }
    })
});



module.exports = user;