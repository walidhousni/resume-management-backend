const upload = require("express").Router();
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const utf8 = require('utf8');
const _ = require('lodash')
let {
    PythonShell
} = require('python-shell');

let options = {
    mode: 'text',
    pythonOptions: ['-u'],
};







// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, moment().format("YYYYMMDDHHmmssms") + ".pdf");
    }
});

// Init Upload
const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 10000000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}


upload.post('/', (req, res) => {
    uploadFile(req, res, (err) => {
        if (err) {
            res.json({
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.json({
                    msg: 'Error: No File Selected!'
                });
            } else {
                PythonShell.run('./utils/extract_script_NLP.py', options, function (error, results) {
                    if (error) {
                        console.log(error)
                    } else {
                        let imageDetected = '"scoreBack":" 1 ", "scoreBigData":" 1 ", "scoreBI":" 1 ", "scoreDevOps":" 1 ", "scoreScrum":" 1 ", "scoreDB":" 1 ", "scoreDesign":" 1 "'
                        if (results[0].indexOf(imageDetected) !== -1) {
                            res.json({
                                msg: 'CV Image'
                            });
                        } else {
                            results = JSON.parse(results[0])
                            results.langues = []
                            results.LanguesArray = results.LanguesArray.split(', ')

                            let i = 0
                            _.forEach(results.LanguesArray, (res, err) => {
                                results.langues[i] = {langue: res}
                                i++
                            })
                            delete results.LanguesArray
                            results.link = `attachements/${req.file.filename}`
                            res.json({
                                msg: 'File Uploaded!',
                                //link: `attachements/${req.file.filename}`,
                                results
                            });
                        }
                    }
                });
            }

        }

    });
});



module.exports = upload;