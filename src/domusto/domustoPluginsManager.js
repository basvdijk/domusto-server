let config = require('../config');
let util = require('../util');

class DomustoPluginsManager {

    constructor() {

        util.debug('Initialising plugins');

        this._pluginInstances = {};
        this._onNewInputData = function () { };

        let plugins = config.plugins;

        for (let plugin of plugins) {

            if (plugin.enabled) {

                try {
                    let pluginNodeModule = require('../plugins/domusto-' + plugin.type.toLowerCase());

                    let domustoPluginInstance = new pluginNodeModule(plugin);
                    this._pluginInstances[plugin.type] = domustoPluginInstance;

                    // if (plugin.triggers) {
                    //     domustoTriggers.initPluginTriggers(domustoPluginInstance, plugin);
                    // }

                } catch (error) {
                    util.error('Error loading plugin ', plugin.type, error);
                }
            }

        }

    }

    // Get the hardware instance by device id
    getPluginInstanceByPluginId (pluginId) {
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

let domustoPluginsManager = new DomustoPluginsManager();

module.exports = domustoPluginsManager;