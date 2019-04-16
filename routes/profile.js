const profile = require("express").Router();
const passport = require("passport");

const esSync = require('../utils/essync');

// ORM profile model
const Profile = require("../models/Profile");

const {
  permit
} = require("../utils/utils")
const _ = require('lodash')
const db = require('../config/db.cfg')();

const {
  admin,
  rh,
  com
} = require("../consts/consts")


// passport.authenticate("jwt", { session: false }), 


/**
 * @route GET /profiles/:id
 * @desc Get profile
 */
profile.get('/:id', passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  const {
    id
  } = req.params;
  Profile.findById(id, (err, p) => {
    if (err) {
      return res.sendStatus(500);
    }

    res.json({
      age: p.age,
      city: p.city,
      contract: p.contract,
      description: p.description,
      disponibility: p.disponibility,
      experience: p.experience,
      job: p.job,
      mail: p.mail,
      mobility: p.mobility.join(','),
      nom: p.name,
      network: p.network,
      phone: p.phone,
      salary: p.salary,
      secteur: p.secteur,
      seniority: p.seniority,
      technology: p.technology.join(','),
      tools: p.tools.join(','),
      _id: p._id,
      link: p.link,
      pdfid: p.pdfid,
      //edits
      status: p.status,
      experiences: p.experiences,
      langues: p.langues,
      educations: p.educations,
      competences: p.competences,
      scoring: p.scoring,
      created_by: p.created_by,
      number: p.number,
      notes: p.notes
    });
  });
});


/**
 * @route POST /profiles
 * @desc Add profile
 */
profile.post('/', permit([admin, rh]), (req, res) => {
  //console.log(req.body)
  const {
    nom,
    age,
    phone,
    mail,
    network,
    experience,
    seniority,
    job,
    tools,
    technology,
    disponibility,
    city,
    mobility,
    contract,
    secteur,
    salary,
    description,
    link,
    pdfid,
    text,
    //edits
    status,
    experiences,
    langues,
    educations,
    competences,
    username
  } = req.body;

  let scoring = []
  let obj = {}
  obj.scoreDev = req.body.scoreDev
  obj.scoreFront = req.body.scoreFront
  obj.scoreBack = req.body.scoreBack
  obj.scoreBI = req.body.scoreBI
  obj.scoreBigData = req.body.scoreBigData
  obj.scoreDB = req.body.scoreDB
  obj.scoreDesign = req.body.scoreDesign
  obj.scoreDevOps = req.body.scoreDevOps
  obj.scoreScrum = req.body.scoreScrum

  scoring[0] = obj


  db.collection("subscriptions").find({})
    .toArray(function (err, result) {
      if (err) {
        return res.sendStatus(500);
      } else {
        let a = 0
        _.forEach(result, function (value) {

          if (value.number > a)
            a = value.number
        });
        a = a + 1
        //console.log(a)
        const newProfile = new Profile({
          name: nom ? nom : "",
          age: age ? age : "",
          phone: phone ? phone : "",
          mail: mail ? mail : "",
          network: network ? network : "",
          experience: experience ? experience : "",
          seniority: seniority ? seniority : "",
          job: job ? job : "",
          tools: tools ? tools.split(',') : "",
          technology: technology ? technology.split(',') : "",
          disponibility: disponibility ? disponibility : "",
          city: city ? city : "",
          mobility: mobility ? mobility.split(',') : "",
          contract: contract ? contract : "",
          secteur: secteur ? secteur : "",
          salary: salary ? salary : "",
          description: description ? description : "",
          link: link ? link : "",
          pdfid: pdfid ? pdfid : "",
          text: text ? text : "",
          //edits
          status: status ? status : "",
          experiences: experiences ? experiences : [],
          langues: langues ? langues : [],
          educations: educations ? educations : [],
          competences: competences ? competences : [],
          number: a ? a : 1,
          scoring: scoring ? scoring : [],
          created_by: username ? username : ""
        });
        newProfile.save(err => {
          if (err) {
            console.log('error: ', err)
            return res.sendStatus(500)
          }
          res.statusMessage = "Profile added succesfully";
          return res.sendStatus(201)
        })
      }
    });
});


/**
 * @route PUT /profiles/:id
 * @desc Update profile
 */
profile.put('/:id', permit([admin, rh]), (req, res) => {
  const query = {
    _id: req.params.id
  };

  const update = {
    name,
    age,
    phone,
    mail,
    network,
    experience,
    seniority,
    job,
    tools,
    technology,
    disponibility,
    city,
    mobility,
    contract,
    secteur,
    salary,
    description,
    status,
    experiences,
    langues,
    educations,
    competences
  } = req.body;

  const options = {
    multi: false
  };

  Profile.updateOne(query, update, (err) => {
    if (err) {
      return res.sendStatus(500);
    }

    res.statusMessage = 'Profile updated succesfully';
    esSync(Profile);
    return res.sendStatus(201);
  });
});


/**
 * @route POST /profiles/:id/notes/
 * @desc Add a note
 */
profile.post('/:id/notes', permit([admin, rh]), (req, res) => {
  const query = {
    _id: req.params.id
  };
  let note = {}
  note.created_by = req.body.created_by
  note.comment = req.body.comment
  note.date = req.body.date
  note.updated_at = ""

  if (!note) {
    return res.sendStatus(500);
  } else {

    const update = {
      $push: {
        notes: {
          $each: [note]
        }
      }

    }

    Profile.updateOne(query, update, (err) => {
      if (err) {
        return res.sendStatus(500);
      }

      res.statusMessage = 'Note added succesfully';
      return res.sendStatus(201);
    });
  }
});


/**
 * @route PUT /profiles/:id/notes/:id
 * @desc Edit a note
 */
profile.put('/:id/notes/:idNote', permit([admin, rh]), (req, res) => {
  const query = {
    _id: req.params.id,
    "notes._id": req.params.idNote
  };

  let note = {}
  note.comment = req.body.comment
  note.updated_at = req.body.updated_at

  const update = {
    $set: {
      "notes.$.comment": note.comment,
      "notes.$.updated_at": note.updated_at
    }
  }

  Profile.updateOne(query, update, (err) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500);
    }
    res.statusMessage = 'Note updated succesfully';
    return res.sendStatus(201);
  });
});




/**
 * @route PUT /profiles/notes/:id
 * @desc Add a note
 */
profile.put('/singleNote/:id', permit([admin, rh]), (req, res) => {
  const query = {
    _id: req.params.id
  };

  let user = req.body.username

  const update = {
    notes
  } = req.body;

  if (user === req.body.created_by || req.body.role === admin) {
    Profile.updateOne(query, update, (err) => {
      if (err) {
        res.sendStatus(500);
      }

      res.statusMessage = 'Note altered succesfully';
      res.sendStatus(201);
    });
  } else {
    res.statusMessage = 'Unauthorized';
    res.sendStatus(401);
  }
});

module.exports = profile;