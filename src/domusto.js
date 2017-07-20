let fs = require('fs');
let util = require('./util');

let Domusto = {};

Domusto.hardwareInstances = {};

Domusto.init = function() {

    Domusto.loadConfiguration();

    if (!Domusto.configuration.debug) {
        util.debug = function() {};
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
        }
        
    }

}

Domusto.loadConfiguration = function() {
    let configuration = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    Domusto.configuration = configuration;
}

Domusto.switchOn = function(deviceId, callback) {
    let device = Domusto.configuration.devices[deviceId];
    Domusto.hardwareByDeviceId(deviceId).switch(deviceId, 'switchOn', function(err, res, sequenceNumber) {       
        util.debug('#' + sequenceNumber + ' Switching ' + device.name + ' with device id ' + deviceId + ' ON');
        callback(err, res, sequenceNumber);
    });
}

Domusto.switchOff = function(deviceId, callback) {
    let device = Domusto.configuration.devices[deviceId];
    Domusto.hardwareByDeviceId(deviceId).switch(deviceId, 'switchOff', function(err, res, sequenceNumber) {       
        util.debug('#' + sequenceNumber + ' Switching ' + device.name + ' with device id ' + deviceId + ' OFF');
        callback(err, res, sequenceNumber);
    });
}


Domusto.hardwareByDeviceId = function(deviceId) {
    let device = Domusto.configuration.devices[deviceId];
    let hardwareId = device.protocol.hardwareId;
    let hardwareType = Domusto.configuration.hardware[hardwareId].type;
    return Domusto.hardwareInstances[hardwareType];
}

module.exports = Domusto;