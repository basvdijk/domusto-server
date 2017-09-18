import util from '../util';
import { PluginMetaData } from './interfaces/PluginMetaData';
import { PluginConfiguration } from './interfaces/PluginConfiguration';

/**
 * Base class for DOMUSTO plugins
 *
 * @author Bas van Dijk
 * @class DomustoPlugin
 */
class DomustoPlugin {

    protected _registeredDevices = [];
    protected _metaData;
    protected _self = this;
    protected _busy = false;
    protected _pluginConfiguration: PluginConfiguration;
    protected _onNewInputData: Function;
    protected _hardwareInstance: any;

    constructor(metaData: PluginMetaData) {

        util.prettyJson(metaData);

        this._metaData = metaData;
        this._self = this;

        this.onNewInputData = (data: any) => {
            // TODO
            util.warning('    No device configured to use plugin ', this._pluginConfiguration['type']);
            util.prettyJson(data);
        };
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

    set pluginConfiguration(config: PluginConfiguration) {
        this._pluginConfiguration = config;
    }
    get pluginConfiguration(): PluginConfiguration {
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