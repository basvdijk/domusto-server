let rfxcom = require('rfxcom');
let util = require('../util');

let DomustoRfxCom = {};

DomustoRfxCom.init = function(device, configuration) {

    util.debug('Initialising RFXtrx');

    DomustoRfxCom.configuration = configuration;

    let rfxtrx = new rfxcom.RfxCom(device.port, { debug: true });
    DomustoRfxCom.hardwareInstances = rfxtrx;
    rfxtrx.initialise();

}

DomustoRfxCom.switch = function (deviceId, command) {

    let device = DomustoRfxCom.configuration.devices[deviceId];
    let hardware = device.hardware;

    let rfxSwitch = new rfxcom[hardware.type](DomustoRfxCom.hardwareInstances, rfxcom[hardware.type.toLowerCase()][hardware.subType]);
    rfxSwitch[command](hardware.id + '/' + hardware.unit);

}

module.exports = DomustoRfxCom;