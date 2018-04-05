import DomustoRouter from './DomustoRouter';
import DomustoPlugin from './DomustoPlugin';

abstract class DomustoPluginApi {

    pluginInstance: any;
    pluginName: string;

    /**
     * Creates an instance of DomustoPluginApi.
     * @param {any} pluginName Name of the plugin used for routing e.g. domusto-shell
     * @memberof DomustoPluginApi
     */
    constructor(pluginName) {
        this.pluginName = pluginName;
    }

    /**
     * Register the instance of the plugin to make api calls to
     *
     * @param {any} pluginInstance
     * @memberof DomustoPluginApi
     */
    setPluginInstance(pluginInstance) {
        this.pluginInstance = pluginInstance;
    }

    /**
     * Registeres an api route
     *
     * @param {any} route Route to use e.g. domusto-shell/:deviceId
     * @param {any} method callback for endpoint
     * @param {any} [description] optional description
     * @memberof DomustoPlugin
     */
    addApiRouteGet(route, method, description?) {
        DomustoRouter.addRouteGet(`/plugin/${this.pluginName}/${route}`, method);
    }

}

export default DomustoPluginApi;