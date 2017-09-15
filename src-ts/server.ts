// let app = require('express')();
// let server = require('http').Server(app);
// let io = require('socket.io')(server);

// let Domusto = require('./domusto');
// let util = require('./util');
// let config = require('./config');

import * as express from 'express';
import * as http from 'http'; 
import util from './util';
import config from './config';
// import * as config from 'config';


// let server = require('http').Server(app);


/**
 * The server.
 *
 * @class Server
 */
export class Server {

  test: string;

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    // create expressjs application
    this.app = express();

    this.setHeaders();


  }

  setHeaders() {
    // Add headers
    this.app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);

      // Pass to next layer of middleware
      next();
    });

  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    // IndexRoute
    // IndexRoute.create(router);

    // use router middleware
    this.app.use(router);

    this.app.route('/output')
      .get((req, res) => {
        // res.json(Domusto.getDevicesByRole('output'));
        res.json(true);
      });
  }


  // this.app.route('/input').get((req, res) => {
  //   res.json(Domusto.getDevicesByRole('input'));
  // });

  // this.app.route('/output/command/:deviceId/:state')
  //   .get((req, res) => {
  //     DomustoDevicesManager.outputCommand(req.params.deviceId, req.params.state, result => {
  //       res.json(result);
  //     });
  //   });

}

let app = new Server().app;
let httpServer = http.createServer(app);

httpServer.listen(config.server.port, function () {
    util.header('DOMUSTO REST api server started on: ' + config.server.port);
});

// // Add headers
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });


// // Routes
// let switchRoutes = require('./switch/switchRoutes');
// let inputRoutes = require('./input/inputRoutes');
// let outputRoutes = require('./output/outputRoutes');
// let coreRoutes = require('./core/coreRoutes');

// new Domusto(io);


// switchRoutes(app);
// inputRoutes(app);
// outputRoutes(app);
// coreRoutes(app);

// server.listen(config.server.port, function () {
//     util.header('DOMUSTO REST api server started on: ' + config.server.port);
// });

// // io.on('connection', function (socket) {
// //     socket.emit('inputDevices', { hello: 'world' });
// //     socket.on('my other event', function (data) {
// //         console.log(data);
// //     });

// //     setInterval(function () {
// //         socket.emit('inputDevices', { 'number': Math.random() });
// //     }, 1000);

// // });
