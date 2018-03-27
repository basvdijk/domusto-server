import DomustoRouter from './DomustoRouter';

abstract class DomustoPluginApi {

    constructor() {

        // console.log('API constructor');

        DomustoRouter.addRoute('/plugin/domusto-shell/:deviceId').get((request, response) => {
            response.json(true);
        });

    }

    addRoute(route) {
        return DomustoRouter.addRoute(route);
    }

}

export default DomustoPluginApi;