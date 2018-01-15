import util from '../util';
import config from '../config';
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

            this.emit('inputDeviceUpdate', DomustoDevicesManager.getDevicesByRole('input'));
            this.emit('outputDeviceUpdate', DomustoDevicesManager.getDevicesByRole('output'));
            this.emit('screensSet', config.screens);

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