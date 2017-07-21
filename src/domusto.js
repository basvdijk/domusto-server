let fs = require('fs');
let util = require('./util');

let io;

let Domusto = {};

Domusto.hardwareInstances = {};
Domusto.socket = null;

Domusto.initSocketIo = function (io) {

    io.on('connection', function (socket) {

        Domusto.socket = socket;

        //send data to client
        // setInterval(function () {
        //     Domusto.socket.emit('stream', { 'number': Math.random() });
        // }, 1000);

    });

}

Domusto.init = function (io) {

    // Domusto.http = http;

    Domusto.initSocketIo(io);

    Domusto.loadConfiguration();

    if (!Domusto.configuration.debug) {
        util.debug = function () { };
    } else {
        util.log('Debug messages enabled')
    }

    util.debug('Initialising hardware');

    let hardware = Domusto.configuration.hardware;
    let hardwareInstance = null;

    // Loading hardware plugins
    for (let i = 0; i < hardware.length; i++) {

        let component = hardware[i];

        switch (component.type) {
            case "RFXCOM":
                hardwareInstance = require('./plugins/domusto-rfxcom');
                break;

            default:
                break;
        }

        if (hardwareInstance) {
            hardwareInstance.init(component, Domusto.configuration);
            Domusto.hardwareInstances[component.type] = hardwareInstance;

            // Subscribe to the new input data function
            hardwareInstance.onNewInputData = Domusto.onNewInputData;
        }

    }

}

// Fired when a plugin broadcasts new data
Domusto.onNewInputData = function (inputData) {
    Domusto.socket.emit('stream', inputData);
}

// Load the app / input / output configuration file
Domusto.loadConfiguration = function () {
    let configuration = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    Domusto.configuration = configuration;
}

Domusto.switchOn = function (deviceId, callback) {
    let device = Domusto.configuration.devices[deviceId];
    Domusto.hardwareByDeviceId(deviceId).switch(deviceId, 'switchOn', function (err, res, sequenceNumber) {
        util.debug('#' + sequenceNumber + ' Switching ' + device.name + ' with device id ' + deviceId + ' ON');
        callback(err, res, sequenceNumber);
    });
}

Domusto.switchOff = function (deviceId, callback) {
    let device = Domusto.configuration.devices[deviceId];
    Domusto.hardwareByDeviceId(deviceId).switch(deviceId, 'switchOff', function (err, res, sequenceNumber) {
        util.debug('#' + sequenceNumber + ' Switching ' + device.name + ' with device id ' + deviceId + ' OFF');
        callback(err, res, sequenceNumber);
    });
}

// Get the hardware instance by device id
Domusto.hardwareByDeviceId = function (deviceId) {
    let device = Domusto.configuration.devices[deviceId];
    let hardwareId = device.protocol.hardwareId;
    let hardwareType = Domusto.configuration.hardware[hardwareId].type;
    return Domusto.hardwareInstances[hardwareType];
}

module.exports = Domusto;