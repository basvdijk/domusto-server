let util = require('../util');
let config = require('../config');

let DomustoDevicesManager = require('./DomustoDevicesManager');
let DomustoPluginsManager = require('./DomustoPluginsManager');
let DomustoSocketIO = require('./DomustoSocketIO');

class Domusto {

    constructor(io) {
        DomustoSocketIO.setIO(io);
    }
}

module.exports = Domusto;