/*
 *
 */

let P1Reader = require('p1-reader');
let util = require('../util');

let DomustoP1 = {};

DomustoP1.registerDevices = [];

DomustoP1.init = function (hardwareComponent, configuration) {

    util.debug('Initialising P1');

    // DomustoP1.configuration = configuration;

    DomustoP1.hardware = hardwareComponent;

    let p1Reader = new P1Reader({ serialPort: hardwareComponent.port });
    DomustoP1.hardwareInstance = p1Reader;

    p1Reader.on('reading', DomustoP1.updatePowerData);

}

DomustoP1.registerDevice = function (device) {
    DomustoP1.registerDevices.push(device);
}

DomustoP1.updatePowerData = function (data) {

    // util.debug('Currently consuming: ' + data.electricity.received.actual.reading + data.electricity.received.actual.unit);

    // console.log(DomustoP1.registerDevices);

    DomustoP1.registerDevices.forEach(function(device) {

        DomustoP1.onNewInputData({
            hardwareId: device.id,
            data: {
                electricity: {
                    received: {
                        tariff1: {
                            value: data.electricity.received.tariff1.reading,
                            unit: data.electricity.received.tariff1.unit
                        },
                        tariff2: {
                            value: data.electricity.received.tariff2.reading,
                            unit: data.electricity.received.tariff2.unit
                        },
                        actual: {
                            value: data.electricity.received.actual.reading,
                            unit: data.electricity.received.actual.unit
                        }
                    }
                }
            }
        });

    });


}

module.exports = DomustoP1;