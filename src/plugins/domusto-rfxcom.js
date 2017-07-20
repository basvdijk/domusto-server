let rfxcom = require('rfxcom');
let util = require('../util');

let DomustoRfxCom = {};

DomustoRfxCom.inputData = {};
DomustoRfxCom.registeredInputDevices = [];

DomustoRfxCom.init = function (device, configuration) {

    util.debug('Initialising RFXtrx');

    DomustoRfxCom.configuration = configuration;

    let rfxtrx = new rfxcom.RfxCom(device.port, { debug: true });
    DomustoRfxCom.hardwareInstance = rfxtrx;
    rfxtrx.initialise();

    DomustoRfxCom.registerInputs(rfxtrx);

    // Listen all possibilities for debugging / scanning
    // DomustoRfxCom.ListenAll(rfxtrx);
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

DomustoRfxCom.registerInputs = function (rfxtrx) {

    let devices = DomustoRfxCom.configuration.devices;

    for (let i = 0; i < devices.length; i++) {

        let device = devices[i];

        // Temp + Humidity
        if (device.role === 'input' && device.protocol.type === 'th' && device.protocol.hardwareId === 0) {
            rfxtrx.on(device.protocol.type + device.protocol.subType, DomustoRfxCom.updateInputTempData);
            DomustoRfxCom.registeredInputDevices.push(device.protocol.id);
        }

    }
};

DomustoRfxCom.updateInputTempData = function (evt) {

    util.debug('Receiving input data ', evt);

    if (DomustoRfxCom.registeredInputDevices.includes(evt.id)) {
        DomustoRfxCom.inputData[evt.id] = evt;
    }

};

DomustoRfxCom.ReceivedInput = function (evt) {
    util.debug('Receiving input data ', evt);
    console.log(evt);
};




DomustoRfxCom.ListenAll = function (rfxtrx) {

    rfxtrx.on('security1', function (evt) {
        console.log('security1');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('bbq1', function (evt) {
        console.log('bbq1');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('temprain1', function (evt) {
        console.log('temprain1');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('temp1', function (evt) {
        console.log('temp1');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp2', function (evt) {
        console.log('temp2');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp3', function (evt) {
        console.log('temp3');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp4', function (evt) {
        console.log('temp4');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp5', function (evt) {
        console.log('temp5');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp6', function (evt) {
        console.log('temp6');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp7', function (evt) {
        console.log('temp7');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp8', function (evt) {
        console.log('temp8');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp9', function (evt) {
        console.log('temp9');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp10', function (evt) {
        console.log('temp10');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('temp11', function (evt) {
        console.log('temp11');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('humidity1', function (evt) {
        console.log('humidity1');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('th1', function (evt) {
        console.log('th1');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th2', function (evt) {
        console.log('th2');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th3', function (evt) {
        console.log('th3');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th4', function (evt) {
        console.log('th4');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th5', function (evt) {
        console.log('th5');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th6', function (evt) {
        console.log('th6');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th7', function (evt) {
        console.log('th7');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th8', function (evt) {
        console.log('th8');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th9', function (evt) {
        console.log('th9');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th10', function (evt) {
        console.log('th10');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th11', function (evt) {
        console.log('th11');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th12', function (evt) {
        console.log('th12');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th13', function (evt) {
        console.log('th13');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('th14', function (evt) {
        console.log('th14');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('thb1', function (evt) {
        console.log('thb1');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('thb2', function (evt) {
        console.log('thb2');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('rain1', function (evt) {
        console.log('rain1');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('rain2', function (evt) {
        console.log('rain2');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('rain3', function (evt) {
        console.log('rain3');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('rain4', function (evt) {
        console.log('rain4');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('rain5', function (evt) {
        console.log('rain5');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('rain6', function (evt) {
        console.log('rain6');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('rain7', function (evt) {
        console.log('rain7');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('wind1', function (evt) {
        console.log('wind1');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('wind2', function (evt) {
        console.log('wind2');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('wind3', function (evt) {
        console.log('wind3');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('wind4', function (evt) {
        console.log('wind4');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('wind5', function (evt) {
        console.log('wind5');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('wind6', function (evt) {
        console.log('wind6');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('wind7', function (evt) {
        console.log('wind7');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('uv1', function (evt) {
        console.log('uv1');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('uv2', function (evt) {
        console.log('uv2');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('uv3', function (evt) {
        console.log('uv3');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('weight1', function (evt) {
        console.log('weight1');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('weight2', function (evt) {
        console.log('weight2');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('elec1', function (evt) {
        console.log('elec1');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('elec2', function (evt) {
        console.log('elec2');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('elec3', function (evt) {
        console.log('elec3');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('elec4', function (evt) {
        console.log('elec4');
        DomustoRfxCom.ReceivedInput(evt);
    });
    rfxtrx.on('elec5', function (evt) {
        console.log('elec5');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('rfxmeter', function (evt) {
        console.log('rfxsensor');
        DomustoRfxCom.ReceivedInput(evt);
    });

    rfxtrx.on('rfxsensor', function (evt) {
        console.log('rfxsensor');
        DomustoRfxCom.ReceivedInput(evt);
    });

}

module.exports = DomustoRfxCom;