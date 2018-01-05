import util from '../util';
import { Domusto } from '../domusto/DomustoInterfaces';
import DomustoSignalHub from './DomustoSignalHub';

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

    constructor(metaData: Domusto.PluginMetaData) {

        util.prettyJson(metaData);

        this._metaData = metaData;
        this._self = this;

        this.onNewInputData = (data: Domusto.InputData) => {
            // TODO
            util.warning('    No device configured to use plugin ', this._pluginConfiguration['type']);
            util.prettyJson(data);
        };

        DomustoSignalHub.subject.subscribe((signal: Domusto.Signal) => {
            if (signal.sender === Domusto.SignalSender.client && signal.pluginId === this.pluginConfiguration.id) {
                this.onSignalReceivedForPlugin(signal);
            }
        });
    }

    /**
     * Triggered when a signal from the client for this plugin is received
     *
     * @abstract
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
    broadcastSignal(pluginType, data, sender = Domusto.SignalSender.plugin) {

        DomustoSignalHub.broadcastSignal({
            sender: sender,
            pluginId: this.pluginConfiguration.id,
            type: pluginType,
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