import util from '../util';
import config from '../config';
import DomustoEmitter from './DomustoEmitter';

/**
 * Class to manage the plugins
 *
 * @author Bas van Dijk
 * @class DomustoPluginsManager
 */
class DomustoPluginsManager {

    private _pluginInstances = {};
    private _onNewInputData: Function;


    constructor() {}

    async init() {

        util.header('INITIALISING PLUGINS');

        this._onNewInputData = function () { };

        let plugins = config.plugins;


        for (let plugin of plugins) {

            if (plugin.enabled) {

                util.log('    enabled ', plugin.id, 'plugin');

                try {
                    await this.importPlugin(plugin);

                } catch (error) {
                    util.error('!!! Error loading plugin ', plugin.id, error);
                }


            } else {
                util.warning('!!! disabled', plugin.id, 'plugin');
            }

        }
    }

    async importPlugin(plugin) {

        // let pluginName = 'domusto-' + plugin.id.toLowerCase();
        // let pluginPath = '../plugins/' + pluginName + '/' + pluginName;
        // let pluginNodeModule = await import(pluginPath);

        let pluginName = 'domusto-' + plugin.id.toLowerCase();
        let pluginPath = '../domusto-plugins/' + pluginName + '/index';
        let pluginNodeModule = await import(pluginPath);

        let domustoPluginInstance = new pluginNodeModule.default(plugin);
        domustoPluginInstance.pluginConfiguration = plugin;

        // let domustoPluginInstance = new pluginNodeModule.default(plugin);
        this._pluginInstances[plugin.id] = domustoPluginInstance;

        // TODO
        if (plugin['triggers']) {

            plugin['triggers'].forEach(trigger => {

                trigger.listenToEvent.events.forEach(triggerEvent => {

                    DomustoEmitter.on(trigger.listenToEvent.deviceId + triggerEvent, () => {
                        domustoPluginInstance.trigger(trigger.execute.event, trigger.execute.parameters);
                    });

                });

            });
        }

    }

    /**
     * Get the hardware instance by device id
     *
     * @param {any} pluginId
     * @returns
     * @memberof DomustoPluginsManager
     */
    getPluginInstanceByPluginId(pluginId) {
        return this._pluginInstances[pluginId];
    }

    /**
     * Sets the handler for new input data
     *
     * @memberof DomustoPluginsManager
     */
    set onNewInputData(onNewInputData) {
        for (let i of Object.keys(this._pluginInstances)) {
            this._pluginInstances[i].onNewInputData = onNewInputData;
        }
    }

}

let DomustoPluginsManagerInstance = new DomustoPluginsManager();

export default DomustoPluginsManagerInstance;