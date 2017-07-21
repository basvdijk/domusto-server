let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let domusto = require('./domusto.js');
let util = require('./util.js');

// Routes
let switchRoutes = require('./switch/switchRoutes');
let inputRoutes = require('./input/inputRoutes');

domusto.init(http);

let port = process.env.PORT || 3000;

switchRoutes(app);
inputRoutes(app);

http.listen(port, function () {
    util.log('Domusto REST api server started on: ' + port);
});