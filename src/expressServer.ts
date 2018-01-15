import * as express from 'express';

// DOMUSTO
import DomustoDevicesManager from './domusto/DomustoDevicesManager';
import DomustoPluginsManager from './domusto/DomustoPluginsManager';

export class ExpressServer {

  public app: express.Application;

  constructor() {

    // Make sure the plugins are ready before the devices initialise to avoid race conditions
    DomustoPluginsManager.init().then(() => {
      DomustoDevicesManager.init();
    });

    this.app = express();
    this.setResponseHeaders();
    this.initRoutes();
  }

  /**
   * Set the reponse headers for all requests
   *
   * @private
   * @memberof ExpressServer
   */
  private setResponseHeaders() {

    this.app.use(function (req, res, next) {

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Pass to next layer of middleware
      next();
    });

  }

  /**
   * Set the routes for the DOMUSTO server API
   *
   * @private
   * @memberof ExpressServer
   */
  private initRoutes() {

    const router = express.Router();

    // use router middleware
    this.app.use(router);

    // INPUTS ROUTES
    this.app.route('/input').get((req, res) => {
      res.json(DomustoDevicesManager.getDevicesByRole('input'));
    });

    // OUTPUTS ROUTES
    this.app.route('/output').get((req, res) => {
      res.json(DomustoDevicesManager.getDevicesByRole('output'));
    });

    this.app.route('/output/command/:deviceId/:state').get((req, res) => {
      DomustoDevicesManager.outputCommand(req.params.deviceId, req.params.state, result => {
        res.json(result);
      });
    });
  }

}