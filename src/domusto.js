let fs = require('fs');
let util = require('./util');
let core = require('./core.js');

let io;

let Domusto = {};

Domusto.outputDevices = [];
Domusto.inputDevices = [];
Domusto.hardwareInstances = {};
Domusto.devices = {};
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

    Domusto.initDevices();

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

Domusto.initDevices = function() {

    for (let i = 0; i < Domusto.configuration.devices.length; i++) {

        let device = Domusto.configuration.devices[i];

        switch (device.role) {
          case 'input': {
            let input = Domusto.initInput(Object.assign({}, device));
            Domusto.inputDevices.push(input);
            break
          }  
          case 'output': {
            let output = Domusto.initOutput(Object.assign({}, device));
            Domusto.outputDevices.push(output);
            break
          }  
        }
    }

}

Domusto.initInput = function(input) {
    return input;
}

Domusto.initOutput = function(output) {

    output.state = 'off';
    output.lastUpdated = new Date();
    output.actions = {
        on: core.data.serverAddress + 'output/command/' + output.id + '/on',
        off: core.data.serverAddress +'output/command/' + output.id + '/off'
    }

    return output;
}

Domusto.outputCommand = function(deviceId, command, onSuccess) {
    console.log(deviceId, command);

    let hardware = Domusto.hardwareByDeviceId(deviceId);
    let device = Domusto.outputDevices[deviceId];

    hardware.outputCommand(deviceId, command, function(response) {
        device.state = response.state;
        onSuccess(device);
    });

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
        device.status = 'ON';
        callback(err, res, sequenceNumber);
    });
}

Domusto.switchOff = function (deviceId, callback) {
    let device = Domusto.configuration.devices[deviceId];
    Domusto.hardwareByDeviceId(deviceId).switch(deviceId, 'switchOff', function (err, res, sequenceNumber) {
        util.debug('#' + sequenceNumber + ' Switching ' + device.name + ' with device id ' + deviceId + ' OFF');
        device.status = 'OFF';
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