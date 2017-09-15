let util = require('../util');

/**
 * Base class for DOMUSTO plugins
 * 
 * @author Bas van Dijk 
 * @class DomustoPlugin
 */
class DomustoPlugin {

    constructor(metaData) {

        // util.prettyJson(metaData);

        this._registeredDevices = [];
        this._metaData = metaData;
        this._self = this;
        this._busy = false;
    }

    /**
     * Convert the plugin to a string
     * 
     * @returns 
     * @memberof DomustoPlugin
     */
    toString() {
        return this.metaData;
    }

    /**
     * Registers a device to the plugin
     * 
     * @param {any} device 
     * @memberof DomustoPlugin
     */
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

    set pluginConfiguration(config) {
        this._pluginConfiguration = config;
    }
    get pluginConfiguration() {
        return this._pluginConfiguration;
    }

    get onNewInputData() {
        return this._onNewInputData;
    }
    set onNewInputData(onNewInputData) {
        this._onNewInputData = onNewInputData;
    }

    get metaData() {
        return this._metaData;
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