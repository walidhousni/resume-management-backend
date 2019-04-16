const search = require("express").Router();
const passport = require("passport");
const esSync = require('../utils/essync');
const Profile = require('../models/Profile');


// Elasticsearch Client
const esClient = require('../config/es.cfg');


/**
* @route GET /profiles
* @desc Get user profiles list
*/
// passport.authenticate("jwt", { session: false }), 
search.get('/', passport.authenticate("jwt", { session: false }), (req, res) => {
  const { term, tech, tool, sen, number } = req.query;
  esSync(Profile);
  const query = {
    "bool": {
      "must": [
        ...(term && [{
          "multi_match": {
            query: term,
            fields: ['job', 'text', 'name', 'tools', 'technology', 'seniority']
          }
        }]),
        ...(tech && [{ "match": { "technology": tech } }]),
        ...(tool && [{ "match": { "tools": tool } }]),
        ...(sen && [{ "match": { "seniority": sen } }]),
        ...(number && [{ "match": { "number": number } }])
      ]
    }
  }

  esClient.search({
    index: 'profiles',
    body: {
      size: 50,
      from: 0,
      query
    }
  })
    .then(results => {
      res.json(results.hits.hits)
    })
    .catch(console.error);
});

module.exports = search;
