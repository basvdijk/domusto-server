import util from '../util';
import { Domusto } from '../domusto/DomustoTypes';
import DomustoSignalHub from './DomustoSignalHub';
import DomustoPluginApi from './DomustoPluginApi';
import DomustoRouter from './DomustoRouter';
import DomustoLogger from './DomustoLogger';

/**
 * Base class for DOMUSTO plugins
 *
 * @author Bas van Dijk
 * @class DomustoPlugin
 */
abstract class DomustoPlugin {

    protected _registeredDevices = [];
    protected _metaData;
    protected _self = this;
    protected _busy = false;
    protected _pluginConfiguration: Domusto.PluginConfiguration;
    protected _onNewInputData: Function;
    protected _hardwareInstance: any;
    protected _api: DomustoPluginApi;

    constructor(metaData: Domusto.PluginMetaData) {

        util.prettyJson(metaData);
        util.log('');

        this._metaData = metaData;
        this._self = this;

        this.onNewInputData = (data: Domusto.InputData) => {
            // TODO
            util.warning('    No device configured to use plugin ', this._pluginConfiguration['deviceId']);
            util.prettyJson(data);
        };

        DomustoSignalHub.subject.subscribe((signal: Domusto.Signal) => {
            if (signal.sender === Domusto.SignalSender.client && signal.pluginId === this.pluginConfiguration.id) {
                this.onSignalReceivedForPlugin(signal);
            }
        });
    }

    getMetaData() {
        return this._metaData;
    }

    /**
     * Logs the specified data to a plugin specific log file
     *
     * @param {any} data Data to log
     * @memberof DomustoPlugin
     */
    logToFile(...data) {
        DomustoLogger.logPluginToFile(this.metaData.plugin, ...data);
    }

    /**
     * Logs the specified data to both the console and log file
     *
     * @param {any} data Data to log
     * @memberof DomustoPlugin
     */
    logToFileAndConsole(...data) {
        console.log.apply(this, data);
        this.logToFile(...data);
    }

    /**
     * Logs the specified error data to a plugin specific error log file
     *
     * @param {any} data Data to log
     * @memberof DomustoPlugin
     */
    logToErrorFile(...data) {
        DomustoLogger.logPluginErrorToFile(this.metaData.plugin, ...data);
    }

    /**
     * Logs the specified error data to both the console and error log file
     *
     * @param {any} data Data to log
     * @memberof DomustoPlugin
     */
    logToErrorFileAndConsole(...data) {
        console.error.apply(this, data);
        this.logToErrorFile(...data);
    }

    /**
     * Triggered when a signal from the client for this plugin is received
     *
     * @param {Domusto.Signal} signal
     * @memberof DomustoPlugin
     */
    onSignalReceivedForPlugin(signal: Domusto.Signal) {

    }

    /**
     *
     *
     * @param {any} pluginType
     * @param {any} data
     * @memberof DomustoPlugin
     */
    broadcastSignal(pluginDeviceId, data, sender = Domusto.SignalSender.plugin, pluginId = this.pluginConfiguration.id) {

        DomustoSignalHub.broadcastSignal({
            sender: sender,
            pluginId: pluginId,
            deviceId: pluginDeviceId,
            data: data
        });

    }

    /**
     * Convert the plugin to a string
     *
     * @returns
     * @memberof DomustoPlugin
     */
    toString(): string {
        return this.metaData.toString();
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
    trigger(command: string, parameters) {

        let functionToTrigger = this[command];

        // Check if the class has the function defined
        if (typeof functionToTrigger === 'function') {

            // Call the function with the plugin scope instead of the DomustoPlugin scope
            functionToTrigger.apply(this._self, parameters);

        } else {
            util.error('No function defined for ', command, parameters);
        }

    }

    /**
     * Validates configuration fields
     *
     * @param {any} configuration
     * @param {any} attributes
     * @returns true when configuration field is valid
     * @memberof DomustoPlugin
     */
    validateConfigurationAttributes(configuration, attributes: Domusto.PluginConfigurationFieldValidator[]) {

        for (let a of attributes) {

            // Check if attribute is defined
            if (typeof configuration[a.attribute] === 'undefined') {
                this.console.error(`Configuration has undefined or missing attribute '${a.attribute}'`, configuration);
                return false;
            }

            // Determine type used by user RegEx / boolean / string / number
            if (a.type instanceof RegExp) {

                if (!a.type.test(configuration[a.attribute])) {
                    this.console.error(`Configuration has wrong type for attribute '${a.attribute}' expected: ${a.type}`, configuration);
                    return false;
                }

            } else {

                if (typeof configuration[a.attribute] !== a.type) {
                    this.console.error(`Configuration has wrong type for attribute '${a.attribute}' expected: ${a.type}`, configuration);
                    return false;
                }
            }

            // Check if the attribute is found in the configuration
            if (a.validValues && (a.validValues.indexOf(configuration[a.attribute]) === -1)) {
                this.console.error(`Configuration has invalid value for attribute '${a.attribute}' expected: ${a.validValues.join(' | ')}`, configuration);
                return false;
            }
        }

        return true;

    }

    /**
     * Adds the plugin name in front of all console messages
     *
     * @memberof DomustoPlugin
     */
    console = {

        log: (...args) => {
            if (this.pluginConfiguration && this.pluginConfiguration.id) {
                args.unshift(`[${this.pluginConfiguration.id}]`);
            }
            util.log.apply(this, args);
        },

        debug: (...args) => {
            if (this.pluginConfiguration && this.pluginConfiguration.id) {
                args.unshift(`[${this.pluginConfiguration.id}]`);
            }
            util.debug.apply(this, args);
        },

        warning: (...args) => {
            if (this.pluginConfiguration && this.pluginConfiguration.id) {
                args.unshift(`[${this.pluginConfiguration.id}]`);
            }
            util.warning.apply(this, args);
        },

        error: (...args) => {
            if (this.pluginConfiguration && this.pluginConfiguration.id) {
                args.unshift(`[${this.pluginConfiguration.id}]`);
            }
            util.error.apply(this, args);
        },

        header: (...args) => {
            if (this.pluginConfiguration && this.pluginConfiguration.id) {
                args.unshift(`[${this.pluginConfiguration.id}]`);
            }
            util.header.apply(this, args);
        },

        prettyJson: (args) => {
            // if (this.pluginConfiguration && this.pluginConfiguration.id) {
            //     args.unshift(`[${this.pluginConfiguration.id}]`);
            // }
            util.prettyJson(args);
        }

    };

    set api(api: DomustoPluginApi) {
        this._api = api;
    }

    get api() {
        return this._api;
    }

    set pluginConfiguration(config: Domusto.PluginConfiguration) {
        this._pluginConfiguration = config;
    }
    get pluginConfiguration(): Domusto.PluginConfiguration {
        return this._pluginConfiguration;
    }

    get onNewInputData(): Function {
        return this._onNewInputData;
    }
    set onNewInputData(onNewInputData: Function) {
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

export default DomustoPlugin;