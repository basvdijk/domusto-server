let util = require('../util');


/**
 * Base class for DOMUSTO plugins
 * 
 * @class DomustoPlugin
 */
class DomustoPlugin {

    constructor(metaData, self) {
        util.debug('Initialising plugin for:');
        util.prettyJson(metaData);

        this._registeredDevices = [];
        this._metaData = metaData;
        this._self = this;
        this._busy = false;
    }

    toString() {
        return this.metaData;
    }

    addRegisteredDevice(device) {
        this._registeredDevices.push(device);
    }

    /**
     * Executes a trigger command
     * 
     * @param {any} command Function of class to call
     * @param {any} parameters Parameters to send to called function
     * @memberof DomustoPlugin
     */
    trigger(command, parameters) {

        let functionToTrigger = this[command];

        // Check if the class has the function defined
        if (typeof functionToTrigger === 'function') {

            // Call the function with the plugin scope instead of the DomustoPlugin scope
            functionToTrigger.apply(this._self, parameters);

        } else {
            util.error('No function defined for ', command, parameters);
        }
        
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