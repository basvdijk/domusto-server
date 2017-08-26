let config = require('../config');
let util = require('../util');
let DomustoInput = require('./DomustoInput');
let domustoPluginsManager = require('./domustoPluginsManager');

class DomustoDevicesManager {

    constructor() {

        this.devices = {};

        /**
         * Initialises configured devices
         */
        for (let device of config.devices) {

            if (device.enabled) {

                switch (device.role) {
                    case 'input': {
                        let input = new DomustoInput(Object.assign({}, device));
                        this.devices[input.id] = input;

                        let pluginId = input.protocol.pluginId;
                        let pluginInstance = domustoPluginsManager.getPluginInstanceByPluginId(pluginId);

                        if (pluginInstance) {
                            pluginInstance.addRegisteredDevice(input);
                        } else {
                            util.debug('No plugin found for hardware id', input.protocol.pluginId);
                        }
                        break;
                    }
                    // case 'output': {
                    //     let output = Domusto.initOutput(Object.assign({}, device));
                    //     this.devices[output.id] = output;

                    //     // Initialise timers when specified
                    //     if (output.timers) {

                    //         output.timers.forEach((timer) => {

                    //             new DomustoTimer(output, timer, (device, timer) => {
                    //                 Domusto.outputCommand(device, timer);
                    //             });

                    //             output.hasTimers = true;

                    //         });

                    //     }

                    //     let pluginId = output.protocol.pluginId;
                    //     let pluginInstance = Domusto.pluginInstanceByPluginId(pluginId);

                    //     if (pluginInstance) {
                    //         pluginInstance.addRegisteredDevice(output);
                    //     } else {
                    //         util.debug('No plugin found for hardware id', output.protocol.pluginId);
                    //     }

                    //     break;
                    // }

                }
            }
        }




    }

    /**
     * 
     * 
     * @param {any} role 
     * @returns 
     * @memberof DomustoDevicesManager
     */
    getDevicesByRole(role) {

        let devices = [];

        for (let i in this.devices) {
            
            let device = this.devices[i];

            if (device.role === role) {
                devices.push(device);
            }
        }

        return devices;

    }


    /**
     * 
     * 
     * @param {any} pluginId 
     * @returns 
     * @memberof DomustoDevicesManager
     */
    getDeviceByPluginId(pluginId) {

        for (let i in this.devices) {

            let device = this.devices[i];

            if (device.protocol.id && (device.protocol.id === pluginId)) {
                return device;
            }
        }

        for (let i in this.devices) {

            let device = this.devices[i];

            if (device.protocol.outputId && (device.protocol.outputId === pluginId)) {
                return device;
            }
        }

        for (let i in this.devices) {

            let device = this.devices[i];

            if (device.protocol.inputIds) {

                let device = this.devices[i];

                for (let j in device.protocol.inputIds) {

                    if (device.protocol.inputIds[j] === pluginId) {
                        return device;
                    }

                }

            }
        }

        return null;
    };

}

let domustoDevicesManager = new DomustoDevicesManager();

module.exports = domustoDevicesManager;