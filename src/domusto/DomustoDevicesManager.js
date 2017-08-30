let config = require('../config');
let util = require('../util');
let DomustoInput = require('./DomustoInput');
let DomustoOutput = require('./DomustoOutput');
let DomustoTimer = require('./DomustoTimer');
let domustoEmitter = require('./DomustoEmitter');
let DomustoPluginsManager = require('./DomustoPluginsManager');
let DomustoSocketIO = require('./DomustoSocketIO');

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
                        let pluginInstance = DomustoPluginsManager.getPluginInstanceByPluginId(pluginId);

                        if (pluginInstance) {
                            pluginInstance.addRegisteredDevice(input);
                        } else {
                            util.debug('No plugin found for hardware id', input.protocol.pluginId);
                        }
                        break;
                    }
                    case 'output': {

                        let output = new DomustoOutput(Object.assign({}, device));
                        this.devices[output.id] = output;

                        // Initialise timers when specified
                        if (output.timers) {

                            // output.timers.forEach((timer) => {

                            //     new DomustoTimer(output, timer, (device, timer) => {
                            //         Domusto.outputCommand(device, timer);
                            //     });

                            //     output.hasTimers = true;

                            // });

                        }

                        let pluginId = output.protocol.pluginId;
                        let pluginInstance = DomustoPluginsManager.getPluginInstanceByPluginId(pluginId);

                        if (pluginInstance) {
                            pluginInstance.addRegisteredDevice(output);
                        } else {
                            util.debug('No plugin found for hardware id', output.protocol.pluginId);
                        }

                        break;
                    }

                }
            }
        }

        // Update the client with the latest known states / data
        DomustoSocketIO.emit('inputDeviceUpdate', this.getDevicesByRole('input'));
        DomustoSocketIO.emit('outputDeviceUpdate', this.getDevicesByRole('output'));

    }

    /**
     * Sends an output command to the hardware of an output device
     * @param {string} deviceId Id of the device
     * @param {string} command Command to send
     * @param {function} onSucces Fired when the command is successfully executed
     */
    outputCommand(deviceId, command, onSuccess) {

        let device = this.devices[deviceId];
        let pluginInstance = DomustoPluginsManager.getPluginInstanceByPluginId(device.protocol.pluginId);

        if (!device.busy) {

            device.busy = true;

            pluginInstance.outputCommand(device, command, response => {

                console.log('emit', device.id + command);
                domustoEmitter.emit(device.id + command);

                util.logSwitchToFile(device.name + ' (' + device.id + ') - ' + command);

                device.busy = false;
                device.state = response.state;
                device.lastUpdated = new Date();

                // check if a callback is provided
                if (onSuccess) {
                    onSuccess(device);
                }

                // outputDeviceUpdate channel only takes arrays
                let devices = [];
                devices.push(device);
                DomustoSocketIO.emit('outputDeviceUpdate', devices);

            });

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

let DomustoDevicesManagerInstance = new DomustoDevicesManager();

module.exports = DomustoDevicesManagerInstance;