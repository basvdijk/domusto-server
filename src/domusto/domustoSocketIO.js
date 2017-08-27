let util = require('../util');

class DomustSocketIO {

    constructor() {
        this._sendQueue = [];

    }

    setIO(io) {
        this._io = io;

        this._io.on('connection', socket => {

            util.debug('DOMUSTO client connected from:', socket.handshake.headers.referer);

            // // send data to client
            // setInterval(function () {
            //     console.log('emit');
            //     Domusto.io.emit('deviceUpdate', { 'id': 'input-2', 'number': Math.random() });
            // }, 10000);

            for(let message of this._sendQueue) {
                this._io.emit(message[0], message[1]);
            }
        });

        console.log(this._sendQueue.length);

    }

    emit() {

        // console.log('emitttt', arguments[1]);
        if(this._io) {
            this._io.emit(arguments);
        } else {
            console.log('no emitter');
            this._sendQueue.push(arguments);
        }
    }

}

let domustoSocketIO = new DomustSocketIO();

module.exports = domustoSocketIO;