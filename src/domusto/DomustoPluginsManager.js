let config = require('../config');
let util = require('../util');
let DomustoEmitter = require('./DomustoEmitter');


/**
 * Class to manage the plugins
 * 
 * @author Bas van Dijk 
 * @class DomustoPluginsManager
 */
class DomustoPluginsManager {

    constructor() {

        util.header('INITIALISING PLUGINS');

        this._pluginInstances = {};
        this._onNewInputData = function () { };

        let plugins = config.plugins;

        for (let plugin of plugins) {

            if (plugin.enabled) {

                util.log('    enabled ', plugin.type, 'plugin');

                try {
                    let pluginNodeModule = require('../plugins/domusto-' + plugin.type.toLowerCase());

                    let domustoPluginInstance = new pluginNodeModule(plugin);
                    domustoPluginInstance.pluginConfiguration = plugin;
                    this._pluginInstances[plugin.type] = domustoPluginInstance;

                    if (plugin.triggers) {

                        plugin.triggers.forEach(trigger => {

                            trigger.listenToEvent.events.forEach(triggerEvent => {

                                DomustoEmitter.on(trigger.listenToEvent.deviceId + triggerEvent, () => {
                                    domustoPluginInstance.trigger(trigger.execute.event, trigger.execute.parameters);
                                });

                            });

                        });
                    }

                } catch (error) {
                    util.error('!!! Error loading plugin ', plugin.type, error);
                }


            } else {
                util.warning('!!! disabled', plugin.type, 'plugin');
            }

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

module.exports = DomustoPluginsManagerInstance;