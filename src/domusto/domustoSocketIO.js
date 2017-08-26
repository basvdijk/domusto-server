let devicesManager = require('domustoDevicesManager');

class DomustSocketIO {

    constructor() {

        io.on('connection', function (socket) {

            util.debug('DOMUSTO client connected from:', socket.handshake.headers.referer);

            // Update the client with the latest known states / data
            socket.emit('inputDeviceUpdate', devicesManager.getDevicesByRole('input'));
            socket.emit('outputDeviceUpdate', devicesManager.getDevicesByRole('output'));

            // // send data to client
            // setInterval(function () {
            //     console.log('emit');
            //     Domusto.io.emit('deviceUpdate', { 'id': 'input-2', 'number': Math.random() });
            // }, 10000);

        });
    }
    
}

let domustoSocketIO = new DomustSocketIO();

module.exports = domustoSocketIO;