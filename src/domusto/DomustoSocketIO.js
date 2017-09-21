let util = require('../util');
let DomustoEmitter = require('./DomustoEmitter');

/**
 * SocketIO broadcast handler
 * 
 * @author Bas van Dijk 
 * @class DomustSocketIO
 */
class DomustSocketIO {

    constructor() {}

    /**
     * Sets the socketIO instance to use
     * 
     * @param {any} io 
     * @memberof DomustSocketIO
     */
    setIO(io) {
        this._io = io;

        this._io.on('connection', socket => {

            util.debug('DOMUSTO client connected from:', socket.handshake.headers.referer);

            // // send data to client
            // setInterval(function () {
            //     console.log('emit');
            //     Domusto.io.emit('deviceUpdate', { 'id': 'input-2', 'number': Math.random() });
            // }, 10000);

            DomustoEmitter.emit('socketOnConnection');

        });

    }


    /**
     * Emits an object on a broadcast channel
     * 
     * @param {any} channel 
     * @param {any} data 
     * @memberof DomustSocketIO
     */
    emit(channel, data) {
        this._io.emit(channel, data);
    }

}

let DomustoSocketIO = new DomustSocketIO();

module.exports = DomustoSocketIO;