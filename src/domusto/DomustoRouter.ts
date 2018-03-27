import util from '../util';
import config from '../config';
import DomustoDevicesManager from './DomustoDevicesManager';

/**
 * SocketIO broadcast handler
 *
 * @author Bas van Dijk
 * @class DomustoSocketIO
 */
class DomustoRouter {

    private app;

    constructor() { }

    /**
     * Sets the socketIO instance to use
     *
     * @param {any} io
     * @memberof DomustoSocketIO
     */
    setApp(app) {
       this.app = app;
    }

    addRoute(route) {
        return this.app.route(route);
    }

}

let DomustoRouterInstance = new DomustoRouter();
export default DomustoRouterInstance;