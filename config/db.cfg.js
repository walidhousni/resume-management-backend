const mongoose = require('mongoose');


// Connection strings
const DB_URI  = `mongodb://datauser:0p3nLAB@ds145303.mlab.com:45303/maltem_cv`;

// Options
const options = {
    autoReconnect: true,
    reconnectInterval: 1000,
    reconnectTries: 3,
    useNewUrlParser: true
};

// Connection storage
let connection = null;

const createConnection = () => {
    if( connection === null ) {
        connection = mongoose.createConnection(DB_URI, options);
    }
    return connection;
};
  
module.exports = createConnection;