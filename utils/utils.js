const {
    SESSION_SECRECT
} = require("../config/net.cfg");

const jwt = require("jsonwebtoken");
const _ = require("lodash")
const nodemailer = require('nodemailer')

function permit(role) {

    return (req, res, next) => {
        let token = req.headers.authorization || req.query.token || null
        if (token) {
            token = token.replace("Bearer ", "");
            //console.log(token)
            jwt.verify(token, SESSION_SECRECT, function (err, decoded) {
                if (err) {
                    console.log(err)
                    res.status(503).json({
                        success: false,
                        message: '503 Service Unavailable'
                    });
                    return
                } else {
                    //console.log(decoded.role)
                    if (_.find(role, function (o) {
                            return o == decoded.role
                        })) {
                        req.body.userInfo = res.data,
                            next()
                    } else {
                        res.status(401).json({
                            success: false,
                            message: 'Unauthorized'
                        });
                        return
                    }
                }
            });

        } else {
            res.status(401).json({
                message: 'Missing Token'
            });
            return
        }
    }
}


function sendEmail(object) {
    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "noreply.maltemseeker@gmail.com",
            pass: "Maltem%2018"
        }
    });

    smtpTransport.sendMail(object)
}

module.exports = {
    permit,
    sendEmail
}