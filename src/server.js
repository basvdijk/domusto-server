let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let Domusto = require('./domusto');
let util = require('./util');
let config = require('./config');
// let core = require('./core');


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// Routes
let switchRoutes = require('./switch/switchRoutes');
let inputRoutes = require('./input/inputRoutes');
let outputRoutes = require('./output/outputRoutes');
let coreRoutes = require('./core/coreRoutes');

new Domusto(io);


switchRoutes(app);
inputRoutes(app);
outputRoutes(app);
coreRoutes(app);

server.listen(config.server.port, function () {
    util.log('Domusto REST api server started on: ' + config.server.port);
});

// io.on('connection', function (socket) {
//     socket.emit('inputDevices', { hello: 'world' });
//     socket.on('my other event', function (data) {
//         console.log(data);
//     });

//     setInterval(function () {
//         socket.emit('inputDevices', { 'number': Math.random() });
//     }, 1000);

// });
