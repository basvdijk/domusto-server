/*
 *
 */

let P1Reader = require('p1-reader');
let util = require('../util');
let domusto = require('../domusto');

let DomustoP1 = {};

DomustoP1.init = function (device, configuration) {

    util.debug('Initialising P1');

    // DomustoP1.configuration = configuration;

    let p1Reader = new P1Reader({ serialPort: device.port });
    DomustoP1.hardwareInstance = p1Reader;

    p1Reader.on('reading', DomustoP1.updatePowerData);

}

DomustoP1.updatePowerData = function (data) {

    util.debug('Currently consuming: ' + data.electricity.received.actual.reading + data.electricity.received.actual.unit);

    DomustoP1.onNewInputData({
        hardwareId: 'POWER1',
        data: {
            electricity: {
                received: {
                    actual: {
                        value: data.electricity.received.actual.reading,
                        unit: data.electricity.received.actual.unit
                    }
                }
            }
        }
    });

}

module.exports = DomustoP1;