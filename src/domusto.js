let fs = require('fs');
let rfxcom = require('rfxcom');
let Domusto = {};

Domusto.hardwareInstances = {};

Domusto.debug = function(message) {
    console.log('[domusto] ' + message);
}

Domusto.log = function(message) {
    console.log('[domusto] ' + message);
}

Domusto.init = function() {
    
    let configuration = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    if (!configuration.debug) {
        Domusto.debug = function() {};
    } else {
        Domusto.log('Debug messages enabled')
    }

    Domusto.configuration = configuration;

    Domusto.debug('Initialising hardware');
    
    let hardware = configuration.hardware;

    for (let i = 0; i < hardware.length; i++) {
        
        let component = hardware[i];

        switch (component.type) {
            case "RFXCOM":
                Domusto.initRfxcom(component);
                break;
        
            default:
                break;
        }
        
    }

}

Domusto.initRfxcom = function(device) {

    Domusto.debug('Initialising RFXtrx');

    let rfxtrx = new rfxcom.RfxCom(device.port, { debug: true });
    Domusto.hardwareInstances.rfxcom = rfxtrx;
    rfxtrx.initialise();
}

Domusto.switchOn = function(deviceId) {
    Domusto.debug('Switch on id ' + deviceId);
    Domusto.Rfx.switch(deviceId, 'switchOn');
}

Domusto.switchOff = function(deviceId) {
    Domusto.debug('Switch off id ' + deviceId);
    Domusto.Rfx.switch(deviceId, 'switchOff');
}

Domusto.Rfx = {
    switch: function(deviceId, command) {

        let device = Domusto.configuration.devices[deviceId];
        let hardware = device.hardware;

        let rfxSwitch = new rfxcom[hardware.type](Domusto.hardwareInstances.rfxcom, rfxcom[hardware.type.toLowerCase()][hardware.subType]);
        rfxSwitch[command](hardware.id + '/' + hardware.unit);

    }
}

module.exports = Domusto;