// Loding middleware modules
const network = require('./net.middleware');

// Main middleware entry point
const middleware = (app) => {
  // Configure HTTP middleware
  network(app);
}

module.exports = middleware;
