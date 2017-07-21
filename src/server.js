let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let domusto = require('./domusto.js');
let util = require('./util.js');

// Routes
let switchRoutes = require('./switch/switchRoutes');
let inputRoutes = require('./input/inputRoutes');

domusto.init(io);

let port = process.env.PORT || 3000;

switchRoutes(app);
inputRoutes(app);

server.listen(port, function () {
    util.log('Domusto REST api server started on: ' + port);
});

// io.on('connection', function (socket) {
//     socket.emit('stream', { hello: 'world' });
//     socket.on('my other event', function (data) {
//         console.log(data);
//     });

//     setInterval(function () {
//         socket.emit('stream', { 'number': Math.random() });
//     }, 1000);

// });
