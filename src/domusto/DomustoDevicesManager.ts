// APP
import DomustoPlugin from './DomustoPlugin';
import util from '../util';
import config from '../config';

// DOMUSTO
import DomustoDevice from './DomustoDevice';
import DomustoDeviceInput from './DomustoDeviceInput';
import DomustoDeviceOutput from './DomustoDeviceOutput';
import DomustoSocketIO from './DomustoSocketIO';
import DomustoPluginsManager from './DomustoPluginsManager';

// INTERFACES
import { Domusto } from '../domusto/DomustoTypes';
import DomustoSignalHub from './DomustoSignalHub';
/**
 * Class to mange the DOMUSTO devices
 *
 * @author Bas van Dijk
 * @class DomustoDevicesManager
 */
class DomustoDevicesManager {

    private devices: { [s: string]: DomustoDevice; } = {};

    constructor() { }

    /**
     * Initialises enabled devices defined in the config.ts file
     */
    init() {
        for (let device of config.devices) {

            if (device.enabled && this.isDeviceValid(device)) {

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

            }

        }

        DomustoSignalHub.subject.subscribe((signal: Domusto.Signal) => {

            // Make sure the sender is a plugin to avoid infinite signal loops
            if (signal.sender === Domusto.SignalSender.plugin) {

                let devices = this.getDevicesByPluginId(signal.pluginId);

                for (let device of devices) {

                    if (device.plugin.deviceId === signal.deviceId) {

                        device.data = signal.data;

                        device.lastUpdated = new Date();
                        DomustoSocketIO.emit(device.role === 'input' ? 'inputDeviceUpdate' : 'outputDeviceUpdate', [device]);

                        break;

                    }

                }

            } else {

                let devices = this.getDevicesByPluginId(signal.pluginId);

                for (let device of devices) {

                    for (let trigger of device.triggers) {

                        if (trigger.listenToEvents.indexOf(signal.data['state']) > -1) {

                            DomustoSignalHub.broadcastSignal({
                                sender: Domusto.SignalSender.client,
                                pluginId: trigger.pluginId,
                                deviceId: trigger.deviceId,
                                data: trigger.data
                            });

                        }

                    }

                }

            }
        });

    }

    /**
     * Valides the device configuration
     *
     * @param {any} device
     * @returns true when device is valid
     * @memberof DomustoDevicesManager
     */
    isDeviceValid(device) {

        if (!device['id']) {
            util.error(`No 'id' defined for device '${device.name}' found in config.ts`);
            return false;
        }

        if (!device['role']) {
            util.error(`No 'role' defined for device '${device.name}' found in config.ts`);
            return false;
        }

        if (!device['type']) {
            util.error(`No 'type' defined for device '${device.name}' found in config.ts`);
            return false;
        }

        if (device['inputIds'] && typeof device['inputIds'] !== 'object') {
            util.error(`'inputIds' for device '${device.name}' in config.ts is not defined as array`);
            return false;
        }

        if (!device.plugin['deviceId']) {
            util.error(`No 'plugin.deviceId' defined for device '${device.name}' found in config.ts`);
            return false;
        }

        return true;

    }

    /**
     * Sends an output command to the hardware of an output device
     * @param {string} deviceId Id of the device
     * @param {string} command Command to send
     * @param {function} onSucces Fired when the command is successfully executed
     */
    outputCommand(deviceId: string, command: Domusto.DeviceEvent, onSuccess?: Function) {

        let device = <DomustoDeviceOutput>this.devices[deviceId];

        let pluginInstance = <DomustoPlugin>DomustoPluginsManager.getPluginInstanceByPluginId(device.plugin.id);

        if (!pluginInstance) {
            console.error('WARNING! No plugin instance found for:', device.plugin.id);
            console.error('Make sure the plugin is enabled');

            util.logErrorToFile('WARNING! No plugin instance found for: ' + device.plugin.id);
            util.logErrorToFile('Make sure the plugin is enabled');
            return false;
        }

        DomustoSignalHub.broadcastSignal({
            sender: Domusto.SignalSender.client,
            pluginId: device.plugin.id,
            deviceId: device.plugin.deviceId,
            data: {
                state: command
            }
        });

        if (device.triggers) {

            for (let trigger of device.triggers) {

                console.log('HA23s', trigger.listenToEvents, command, trigger.listenToEvents.indexOf(command) > -1);

                if (trigger.listenToEvents.indexOf(command) > -1) {

                    DomustoSignalHub.broadcastSignal({
                        sender: Domusto.SignalSender.client,
                        pluginId: trigger.pluginId,
                        deviceId: trigger.deviceId,
                        data: trigger.data
                    });

                }

            }

        }

        // check if a callback is provided
        if (onSuccess) {
            onSuccess(device);
        }

    }


    /**
     * Initialises an input device. Binds the onNewInputData method to the plugin to process
     * new data when it arrives
     *
     * @param {any} device
     * @memberof DomustoDevicesManager
     */
    _initInput(device) {
        let input = new DomustoDeviceInput(device);
        this.devices[input.id] = input;

        let pluginId = input.plugin.id;
        let pluginInstance = DomustoPluginsManager.getPluginInstanceByPluginId(pluginId);

        if (pluginInstance) {
            pluginInstance.addRegisteredDevice(input);
            pluginInstance.onNewInputData = this._onNewInputData.bind(this);
        } else {
            util.warning('No plugin found for hardware id', input.plugin.id);
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
        let output = new DomustoDeviceOutput(device);

        this.devices[output.id] = output;

    }

    /**
     * Fired when a plugin broadcasts new data
     * @param {object} input Input device object
     */
    _onNewInputData(inputData) {

        util.header('RECEIVED NEW INPUT DATA');
        util.prettyJson(inputData);

        let devices = [];

        if (inputData.deviceId) {
            let devices = this.getDevicesByDeviceId(inputData.deviceId);

            if (devices.size > 0) {
                util.debug('No device found for:', inputData.deviceId);
            }

        } else {
            devices = this.getDevicesByPluginId(inputData.pluginId);
        }

        // Check if the updated data comes from a registered device
        if (devices.length > 0) {

            for (let i in devices) {

                let device = devices[i];

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

    }


    /**
     * Returns a device by its deviceId
     *
     * @param {any} deviceId
     * @returns
     * @memberof DomustoDevicesManager
     */
    getDevicesByDeviceId(deviceId): Set<DomustoDevice> {

        let devices: Set<DomustoDevice>;
        devices = new Set();

        for (let i in this.devices) {

            let device = this.devices[i];

            // Check if the id defined within a protocol matches deviceId

            if (device.plugin.deviceId && device.plugin.deviceId.indexOf(deviceId) > -1) {
                devices.add(device);
                break;
            }

            // Check if the inputId matches
            if (device.plugin.inputIds) {

                for (let j in device.plugin.inputIds) {

                    if (device.plugin.inputIds[j] === deviceId) {
                        devices.add(device);
                        break;
                    }

                }

            }

            // Check if the protocol outputId matches
            if (device.plugin.outputId && (device.plugin.outputId === deviceId)) {
                devices.add(device);
                break;
            }

        }

        return devices;

    }

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
    getDevicesByPluginId(pluginId) {

        let devices = [];

        for (let i in this.devices) {

            let device = this.devices[i];

            // Check if the protocol id matches
            if (device.plugin.id && (device.plugin.id === pluginId)) {
                devices.push(device);
            }

        }

        return devices;
    }

}

let DomustoDevicesManagerInstance = new DomustoDevicesManager();
export default DomustoDevicesManagerInstance;