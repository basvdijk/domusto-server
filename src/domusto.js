let fs = require('fs');
let util = require('./util');

// PLUGINS
let DomustoRfxCom = require('./plugins/domusto-rfxcom');

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

Domusto.switchOn = function(deviceId) {
    util.debug('Switch on id ' + deviceId);
    Domusto.hardwareByDeviceId(deviceId).switch(deviceId, 'switchOn');
}

Domusto.switchOff = function(deviceId) {
    util.debug('Switch off id ' + deviceId);
    Domusto.hardwareByDeviceId(deviceId).switch(deviceId, 'switchOff');
}

Domusto.hardwareByDeviceId = function(deviceId) {
    let device = Domusto.configuration.devices[deviceId];
    let hardwareId = device.protocol.hardwareId;
    let hardwareType = Domusto.configuration.hardware[hardwareId].type;
    return Domusto.hardwareInstances[hardwareType];
}

module.exports = Domusto;