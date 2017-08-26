let util = require('../util');

class DomustSocketIO {

    constructor() {

    }

    setIO(io) {
        this._io = io;

        this._io.on('connection', function (socket) {

            util.debug('DOMUSTO client connected from:', socket.handshake.headers.referer);



            // // send data to client
            // setInterval(function () {
            //     console.log('emit');
            //     Domusto.io.emit('deviceUpdate', { 'id': 'input-2', 'number': Math.random() });
            // }, 10000);

        });
    }

    emit() {
        if(this._io) {
            this._io.emit(arguments);
        }
    }

}

let domustoSocketIO = new DomustSocketIO();

module.exports = domustoSocketIO;