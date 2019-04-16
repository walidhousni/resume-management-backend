const express = require('express');
const cors = require('cors')
// Loading config & utils
const esSync = require('./utils/essync');
const db = require('./config/db.cfg')();
const Profile = require('./models/Profile');

// Loading controllers
const { access, profiles, search, upload, user } = require("./routes/index");

const middleware = require("./middleware/index");
const { PORT } = require("./config/net.cfg");

const app = express();

// Configure middleware
middleware(app);

app.use(express.static('public'))
//DB synchronisation
esSync(Profile);


db.on('open', () => console.log("DB Connected"));
db.on('error', () => console.log("Error connecting to database"));

//Server APIs
app.use('/api/v1/access', access);
app.use('/api/v1/upload', upload);
app.use('/api/v1/search', search);
app.use('/api/v1/user', user);
app.use('/api/v1/profiles', profiles);
app.use('/api/v1', (req, res) => res.json({ msg: "Welcome to seeker API v1" }))
app.use('/', (req, res) => res.redirect('/api/v1'));


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

