require('source-map-support').install();

import DomustoCore from './domusto/DomustoCore';
import * as http from 'http';
import * as io from 'socket.io';

import config from './config';
import util from './util';
import { Server } from './server';

const app = new Server().app;
const httpServer = http.createServer(app);
const socketIO = io(httpServer);

new DomustoCore(socketIO);

httpServer.listen(config.server.port, function () {
  util.header('DOMUSTO REST api server started on: ' + config.server.port);
});