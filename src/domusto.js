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

    for (let i = 0; i < hardware.length; i++) {
        
        let component = hardware[i];

        switch (component.type) {
            case "RFXCOM":
                DomustoRfxCom.init(component, Domusto.configuration);
                break;
        
            default:
                break;
        }
        
    }

}

Domusto.loadConfiguration = function() {

    let configuration = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    Domusto.configuration = configuration;

}

Domusto.switchOn = function(deviceId) {
    util.debug('Switch on id ' + deviceId);
    DomustoRfxCom.switch(deviceId, 'switchOn');
}

Domusto.switchOff = function(deviceId) {
    util.debug('Switch off id ' + deviceId);
    DomustoRfxCom.switch(deviceId, 'switchOff');
}

module.exports = Domusto;