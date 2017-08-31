let config = require('../config');
let util = require('../util');
let DomustoInput = require('./DomustoInput');
let DomustoOutput = require('./DomustoOutput');
let DomustoTimer = require('./DomustoTimer');
let DomustoEmitter = require('./DomustoEmitter');
let DomustoPluginsManager = require('./DomustoPluginsManager');
let DomustoSocketIO = require('./DomustoSocketIO');


/**
 * Class to mange the DOMUSTO devices
 * 
 * @author Bas van Dijk 
 * @class DomustoDevicesManager
 */
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
                        this._initInput(device);
                        break;
                    }
                    case 'output': {
                        this._initOutput(device);
                        break;
                    }

                }

                if (device.triggers) {
                    this._initTriggers(device);
                }

            }

        }

        // Broadcasts the input- and output devices when the SocketIO module has a new client connected
        DomustoEmitter.on('socketOnConnection', () => {
            DomustoSocketIO.emit('inputDeviceUpdate', this.getDevicesByRole('input'));
            DomustoSocketIO.emit('outputDeviceUpdate', this.getDevicesByRole('output'));
        });

    }


    /**
     * Initialises the triggers configured for a device. Binds the listeners which
     * triggers the outputCommand of a device
     * 
     * @param {any} device 
     * @memberof DomustoDevicesManager
     */
    _initTriggers(device) {
        device.triggers.forEach(trigger => {

            trigger.listenToEvent.events.forEach(triggerEvent => {

                DomustoEmitter.on(trigger.listenToEvent.deviceId + triggerEvent, () => {
                    this.outputCommand(device.id, trigger.execute.event);
                });

            });

        });
    }


    /**
     * Initialises an input device. Binds the onNewInputData method to the plugin to process
     * new data when it arrives
     * 
     * @param {any} device 
     * @memberof DomustoDevicesManager
     */
    _initInput(device) {
        let input = new DomustoInput(device);
        this.devices[input.id] = input;

        let pluginId = input.protocol.pluginId;
        let pluginInstance = DomustoPluginsManager.getPluginInstanceByPluginId(pluginId);

        if (pluginInstance) {
            pluginInstance.addRegisteredDevice(input);
            pluginInstance.onNewInputData = this._onNewInputData.bind(this);
        } else {
            util.debug('No plugin found for hardware id', input.protocol.pluginId);
        }
    }


    /**
     * Initialises output devices. Checks for timers and adds the device to the plugin;
     * 
     * @param {any} device 
     * @memberof DomustoDevicesManager
     */
    _initOutput(device) {
        // let output = new DomustoOutput(Object.assign({}, device));
        let output = new DomustoOutput(device);
        this.devices[output.id] = output;

        // Initialise timers when specified
        if (output.timers) {

            output.timers.forEach((timer) => {

                new DomustoTimer(output, timer, (device, timer) => {
                    this.outputCommand(device, timer);
                });

                output.hasTimers = true;

            });

        }

        let pluginId = output.protocol.pluginId;
        let pluginInstance = DomustoPluginsManager.getPluginInstanceByPluginId(pluginId);

        if (pluginInstance) {
            pluginInstance.addRegisteredDevice(output);
        } else {
            util.debug('No plugin found for hardware id', output.protocol.pluginId);
        }
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
                DomustoEmitter.emit(device.id + command);

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
     * Fired when a plugin broadcasts new data
     * @param {object} input Input device object
     */
    _onNewInputData(inputData) {

        util.log('Received new input data:');
        util.prettyJson(inputData);

        let device = this.getDeviceByPluginId(inputData.pluginId);

        // Check if the updated data comes from a registered device
        if (device) {

            switch (device.type) {
                case 'switch': {
                    this.outputCommand(device.id, inputData.command);
                    break;
                }
                default:

                    // Merge the current device data with the new input data
                    Object.assign(device.data, inputData.data);

                    device.lastUpdated = new Date();

                    // inputDeviceUpdate channel only takes arrays
                    let devices = [];

                    devices.push(device);
                    DomustoSocketIO.emit('inputDeviceUpdate', devices);

                    break;
            }

        }

    }


    /**
     * Returns a device by its deviceId
     * 
     * @param {any} deviceId 
     * @returns 
     * @memberof DomustoDevicesManager
     */
    getDeviceById(deviceId) {

        for (let i in this.devices) {

            let device = this.devices[i];

            let isTargetDevice = device.protocol.output ? device.protocol.outputId === deviceId : device.protocol.id === deviceId;

            if (isTargetDevice) {
                return device;
            }

        }

    };

    /**
     * Returns a device by its role
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
     * Returns a device by its pluginId
     * 
     * @param {any} pluginId 
     * @returns 
     * @memberof DomustoDevicesManager
     */
    getDeviceByPluginId(pluginId) {

        for (let i in this.devices) {

            let device = this.devices[i];

            // Check if the protcol id matches
            if (device.protocol.id && (device.protocol.id === pluginId)) {
                return device;
            }

            // Check if the protocol outputId matches
            if (device.protocol.outputId && (device.protocol.outputId === pluginId)) {
                return device;
            }

            // check if the inputId mathces
            if (device.protocol.inputIds) {

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