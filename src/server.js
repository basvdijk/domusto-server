let express = require('express');
let domusto = require('./domusto.js');
let util = require('./util.js');
let switchRoutes = require('./switch/switchRoutes');
let inputRoutes = require('./input/inputRoutes');

domusto.init();

let app = express();
let port = process.env.PORT || 3000;

switchRoutes(app);
inputRoutes(app);

app.listen(port);

util.log('Domusto REST api server started on: ' + port);