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
                this._io.emit(message.channel, message.data);
            }
        });

    }

    emit(channel, data) {
        if(this._io) {
            this._io.emit(channel, data);
        } else {
            this._sendQueue.push({ channel: channel, data: data });
        }
    }

}

let DomustoSocketIO = new DomustSocketIO();

module.exports = DomustoSocketIO;