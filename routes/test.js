
let {PythonShell} = require('python-shell');
 
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
  };
   
  PythonShell.run('../utils/extract_script_NLP.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
  });