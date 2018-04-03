import util from '../util';
import config from '../config';
import DomustoDevicesManager from './DomustoDevicesManager';

/**
 * SocketIO broadcast handler
 *
 * @author Bas van Dijk
 * @class DomustoSocketIO
 */
class DomustoRouter {

    private app;

    constructor() { }

    /**
     * Sets the socketIO instance to use
     *
     * @param {any} io
     * @memberof DomustoSocketIO
     */
    setApp(app) {
        this.app = app;

        this.addRouteGet('/api', (request, response) => {
            response.json(this.listRoutes(this.app));
        });
    }

    addRouteGet(route, method) {
        return this.app.route(route).get(method);
    }

    // from: https://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express
    listRoutes(app) {
        let apiRoutes = [];
        const entryPoint = app._router && app._router.stack;
        const routes = this.getRoutes(entryPoint);

        const info = routes
            .reduce((result, it) => {
                const [method, path] = it;

                apiRoutes.push({
                    method: method,
                    path: path
                });

            }, '');

        return apiRoutes;
    }

    // from: https://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express
    private getRoutes(stack) {
        const routes = (stack || [])
            // We are interested only in endpoints and router middleware.
            .filter(it => it.route || it.name === 'router')
            // The magic recursive conversion.
            .reduce((result, it) => {
                if (!it.route) {
                    // We are handling a router middleware.
                    const stack = it.handle.stack;
                    const routes = this.getRoutes(stack);

                    return result.concat(routes);
                }

                // We are handling an endpoint.
                const methods = it.route.methods;
                const path = it.route.path;

                const routes = Object
                    .keys(methods)
                    .map(m => [m.toUpperCase(), path]);

                return result.concat(routes);
            }, [])
            // We sort the data structure by route path.
            .sort((prev, next) => {
                const [prevMethod, prevPath] = prev;
                const [nextMethod, nextPath] = next;

                if (prevPath < nextPath) {
                    return -1;
                }

                if (prevPath > nextPath) {
                    return 1;
                }

                return 0;
            });

        return routes;
    }

}

let DomustoRouterInstance = new DomustoRouter();
export default DomustoRouterInstance;