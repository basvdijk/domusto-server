let rfxcom = require('rfxcom');
let util = require('../util');
let domusto = require('../domusto');

let DomustoRfxCom = {};

DomustoRfxCom.inputData = {};
DomustoRfxCom.registeredInputDeviceIds = [];
DomustoRfxCom.onNewInputData = null;

DomustoRfxCom.outputDevices = {};

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

DomustoRfxCom.outputCommand = function (deviceId, command, onSucces) {
    let device = DomustoRfxCom.configuration.devices[deviceId];
    let protocol = device.protocol;

    // e.g. rfxcom.Lighting2, rfxcom.Lighting3 etc.
    let rfxConstructor = rfxcom[protocol.type];
    let rfxProtocolType = rfxcom[protocol.type.toLowerCase()];

    let rfxSwitch = new rfxConstructor(DomustoRfxCom.hardwareInstance, rfxProtocolType[protocol.subType]);

    let rfxCommand = null;

    console.log(command);

    switch (command) {
        case 'on':
            rfxCommand = 'switchOn';
            break;
        case 'off':
            rfxCommand = 'switchOff';
            break;
    }

    console.log(protocol.id + '/' + protocol.unit, rfxCommand);

    // Format the hardware id and into the 0x2020504/1 format
    rfxSwitch[rfxCommand](protocol.id + '/' + protocol.unit, function() {
        onSucces({ state: rfxCommand === 'switchOn' ? 'on' : 'off' });
    });

}

DomustoRfxCom.registerInputs = function (rfxtrx) {

    let devices = DomustoRfxCom.configuration.devices;

    let protocolsWithListeners = [];

    for (let i = 0; i < devices.length; i++) {

        let device = devices[i];

        let protocolHasListener = protocolsWithListeners.indexOf(device.role + device.type + device.protocol.hardwareId) > -1;

        // Temp + Humidity
        if (device.role === 'input' && device.type === 'temperature' && device.protocol.hardwareId === 0) {

            if (!protocolHasListener) {

                rfxtrx.on(device.protocol.type + device.protocol.subType, function (sensorData) {
                    DomustoRfxCom.updateInputTempData(sensorData);
                    protocolsWithListeners.push(device.role + device.type + device.protocol.hardwareId);
                });

            }

            DomustoRfxCom.registeredInputDeviceIds.push(device.protocol.id);

        }

        if (device.role === 'output' && device.type === 'switch' && device.protocol.hardwareId === 0) {

            // rfxtrx.on(device.protocol.type + device.protocol.subType, function (sensorData) {
            //     DomustoRfxCom.updateInputTempData(sensorData);
            // });

            DomustoRfxCom.outputDevices[device.protocol.id] = device;

            DomustoRfxCom.registeredInputDeviceIds.push(device.protocol.id);
        }

    }
};

DomustoRfxCom.updateInputTempData = function (sensorData) {

    // console.log(sensorData);

    let device = DomustoRfxCom.getDeviceById(sensorData.id);

    util.debug('Receiving input data ', sensorData);

    if (DomustoRfxCom.registeredInputDeviceIds.includes(sensorData.id)) {
        sensorData.typeString = DomustoRfxCom.subTypeString(device.protocol.type + device.protocol.subType);

        // let device = DomustoRfxCom.inputData[sensorData.id];

        // device.data.temperature = sensorData.temperature;

        // DomustoRfxCom.inputData[sensorData.id] = {
        //     device: device,
        //     data: {
        //         temperature: sensorData.temperature,
        //         humidity: sensorData.humidity,
        //         humidityStatus: sensorData.humidityStatus,
        //         batteryLevel: sensorData.batteryLevel,
        //         rssi: sensorData.rssi
        //     }
        // };

        // console.log(DomustoRfxCom.inputData);

        DomustoRfxCom.onNewInputData({
            hardwareId: sensorData.id,
            data: {
                deviceTypeString: DomustoRfxCom.subTypeString(device.protocol.type + device.protocol.subType),
                temperature: sensorData.temperature,
                humidity: sensorData.humidity,
                humidityStatus: sensorData.humidityStatus,
                batteryLevel: sensorData.batteryLevel,
                rssi: sensorData.rssi
            }
        });
    }

};

DomustoRfxCom.getDeviceById = function (deviceId) {
    return DomustoRfxCom.configuration.devices.find(function(device) {
        return device.protocol.id === deviceId;
    });
};

DomustoRfxCom.ReceivedInput = function (sensorData) {
    util.debug('Receiving input data ', sensorData);
};

// Descriptions from https://github.com/openhab/openhab2-addons/tree/master/addons/binding/org.openhab.binding.rfxcom
DomustoRfxCom.subTypeString = function (subType) {

    switch (subType) {

        case 'th1':
            retVal = 'THGN122/123, THGN132, THGR122/228/238/268';
            break;
        case 'th2':
            retVal = 'THGR810, THGN800';
            break;
        case 'th3':
            retVal = 'RTGR328';
            break;
        case 'th4':
            retVal = 'THGR328';
            break;
        case 'th5':
            retVal = 'WTGR800';
            break;
        case 'th6':
            retVal = 'THGR918/928, THGRN228, THGN500';
            break;
        case 'th7':
            retVal = 'TFA TS34C, Cresta';
            break;
        case 'th8':
            retVal = 'WT260, WT260H, WT440H, WT450, WT450H';
            break;
        case 'th9':
            retVal = 'Viking 02035, 02038 (02035 has no humidity), Proove TSS320, 311501';
            break;
        case 'th10':
            retVal = 'Rubicson';
            break;
        case 'th11':
            retVal = 'EW109';
            break;
        case 'th12':
            retVal = 'Imagintronix/Opus XT300 Soil sensor';
            break;
        case 'th13':
            retVal = 'Alecto WS1700 and compatibles';
            break;

    }

    return retVal;
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