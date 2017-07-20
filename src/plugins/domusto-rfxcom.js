let rfxcom = require('rfxcom');
let util = require('../util');

let DomustoRfxCom = {};

DomustoRfxCom.init = function(device, configuration) {

    util.debug('Initialising RFXtrx');

    DomustoRfxCom.configuration = configuration;

    let rfxtrx = new rfxcom.RfxCom(device.port, { debug: true });
    DomustoRfxCom.hardwareInstance = rfxtrx;
    rfxtrx.initialise();

}

DomustoRfxCom.switch = function (deviceId, command, callback) {

    let device = DomustoRfxCom.configuration.devices[deviceId];
    let protocol = device.protocol;

    // e.g. rfxcom.Lighting2, rfxcom.Lighting3 etc.
    let rfxConstructor = rfxcom[protocol.type];
    let rfxProtocolType = rfxcom[protocol.type.toLowerCase()];

    let rfxSwitch = new rfxConstructor(DomustoRfxCom.hardwareInstance, rfxProtocolType[protocol.subType]);
    
    // Format the hardware id and into the 0x2020504/1 format
    rfxSwitch[command](protocol.id + '/' + protocol.unit, callback);
    

}

module.exports = DomustoRfxCom;