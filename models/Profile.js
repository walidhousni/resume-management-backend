const Schema = require('mongoose').Schema;
const mongoosastic = require('mongoosastic');
const db = require('../config/db.cfg')();
const esClient = require('../config/es.cfg')

const ProfileSchema = new Schema({
    name: { type: String, required: true, default: '' },
    age: { type: String, required: false, default: true },
    phone: { type: String, required: false, default: true },
    mail: { type: String, required: false, default: true },
    network: { type: String, required: false, default: true },
    experience: { type: String, required: false, default: true },
    seniority: { type: String, required: false, default: true },
    job: { type: String, required: false, default: true },
    tools: { type: Array, required: false, default: true },
    technology: { type: Array, required: false, default: true },
    disponibility: { type: String, required: false, default: true },
    city: { type: String, required: false, default: true },
    mobility: { type: Array, required: false, default: true },
    contract: { type: String, required: false, default: true },
    secteur: { type: String, required: false, default: true },
    salary: { type: String, required: false, default: true },
    description: { type: String, required: false, default: true },
    text: { type: String, required: false, default: '' },
    link: { type: String, required: false, default: '' },
    pdfid: { type: String, required: false, default: '' },
    //edits
    number: { type: Number, required: false, default: '' },
    status: { type: String, required: false, default: '' },
    experiences: [
        {
            annee: { type: String, required: false, default: '' },
            entreprise: { type: String, required: false, default: '' },
            fonction: { type: String, required: false, default: '' },
            environnement: { type: String, required: false, default: '' },
            missions: [
                {
                    titre: { type: String, required: false, default: '' },
                    description: { type: String, required: false, default: '' },
                    taches: [
                        {
                            titre: { type: String, required: false, default: '' }
                        }
                    ]
                }
            ]
        }
    ],
    langues: [
        {
            langue: { type: String, required: false, default: '' },
            niveau: { type: String, required: false, default: '' }
        }
    ],
    educations: [
        {
            annee: { type: String, required: false, default: '' },
            description: { type: String, required: false, default: '' }
        }
    ],
    competences: [
        {
            titre: { type: String, required: false, default: '' },
            description: { type: String, required: false, default: '' }
        }
    ],
    scoring: [
        {
            scoreDev: { type: String, required: false, default: '' },
            scoreFront: { type: String, required: false, default: '' },
            scoreBack: { type: String, required: false, default: '' },
            scoreBI: { type: String, required: false, default: '' },
            scoreBigData: { type: String, required: false, default: '' },
            scoreDB: { type: String, required: false, default: '' },
            scoreDesign: { type: String, required: false, default: '' },
            scoreDevOps: { type: String, required: false, default: '' },
            scoreScrum: { type: String, required: false, default: '' }
        }
    ],
    created_by: {type: String, required: false, default: ''},
    notes: [
        {
            comment:{ type: String, required: false, default: '' },
            date:{ type: String, required: false, default: '' },
            updated_at:{ type: String, required: false, default: '' },
            created_by:{ type: String, required: false, default: '' }
        }
    ]
},{
    collection: 'subscriptions'
});

ProfileSchema.plugin(mongoosastic, {esClient});

module.exports =  db.model('Profile', ProfileSchema);
