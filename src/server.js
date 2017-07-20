let express = require('express');
let domusto = require('./domusto.js');
let switchRoutes = require('./switch/switchRoutes');

domusto.init();

let app = express();
let port = process.env.PORT || 3000;

switchRoutes(app);

app.listen(port);

domusto.log('Domusto REST api server started on: ' + port);