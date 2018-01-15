require('source-map-support').install();

import * as http from 'http';
import * as sio from 'socket.io';

import config from './config';
import util from './util';

import { ExpressServer } from './expressServer';
import DomustoSocketIO from './domusto/DomustoSocketIO';

const app = new ExpressServer().app;
const httpServer = http.createServer(app);
const socketIO = sio(httpServer);

DomustoSocketIO.setIO(socketIO);

httpServer.listen(config.server.port, function () {
  util.header('DOMUSTO REST api server started on: ' + config.server.port);
});