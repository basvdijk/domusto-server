import util from '../util';
import config from '../config';
import DomustoEmitter from './DomustoEmitter';
import DomustoDevicesManager from './DomustoDevicesManager';

/**
 * SocketIO broadcast handler
 *
 * @author Bas van Dijk
 * @class DomustoSocketIO
 */
class DomustoSocketIO {

    private _io;

    constructor() {}

    /**
     * Sets the socketIO instance to use
     *
     * @param {any} io
     * @memberof DomustoSocketIO
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
     * @memberof DomustoSocketIO
     */
    emit(channel, data) {
        this._io.emit(channel, data);
    }

}

let DomustoSocketIOInstance = new DomustoSocketIO();
export default DomustoSocketIOInstance;