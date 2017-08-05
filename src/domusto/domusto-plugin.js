let util = require('../util');


/**
 * Base class for DOMUSTO plugins
 * 
 * @class DomustoPlugin
 */
class DomustoPlugin {

    constructor(metaData) {
        util.debug('Initialising plugin for:');
        util.prettyJson(metaData);

        this._registeredDevices = [];
        this._metaData = metaData;
    }

    toString() {
        return this.metaData;
    }

    addRegisteredDevice(device) {
        this._registeredDevices.push(device);
    }

    get onNewInputData() {
        return this._onNewInputData;
    }
    set onNewInputData(onNewInputData) {
        this._onNewInputData = onNewInputData;
    }

    get metaData() {
        return this.metaData;
    }

    get hardwareInstance() {
        return this._hardwareInstance;
    }
    set hardwareInstance(hardwareInstance) {
        this._hardwareInstance = hardwareInstance;
    }

    get registeredDevices() {
        return this._registeredDevices;
    }

}

module.exports = DomustoPlugin;