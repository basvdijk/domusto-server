let fs = require('fs');
let rfxcom = require('rfxcom');
let Domusto = {};
let hardwareInstances = {};

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
    }
    
    let hardware = configuration.hardware;

    Domusto.debug('test');

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
    let rfxtrx = new rfxcom.RfxCom(device.port, { debug: true });
    hardwareInstances.rfxcom = rfxtrx;
    rfxtrx.initialise();
}

Domusto.switchOn = function(idx) {
    lightning2 = new rfxcom.Lighting2(hardwareInstances.rfxcom, rfxcom.lighting2.AC);
    lightning2.switchOn('0x02020504/1');
}

Domusto.switchOff = function(idx) {
    lightning2 = new rfxcom.Lighting2(hardwareInstances.rfxcom, rfxcom.lighting2.AC);
    lightning2.switchOff('0x02020504/1');
}

module.exports = Domusto;