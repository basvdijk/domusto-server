let rfxcom = require('rfxcom');
let util = require('../util');

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

DomustoRfxCom.registerDevice = function (device) { }

DomustoRfxCom.outputCommand = function (device, command, onSucces) {

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

    console.log(protocol.output.id + '/' + protocol.output.unit, rfxCommand);

    // Format the hardware id and into the 0x2020504/1 format
    rfxSwitch[rfxCommand](protocol.output.id + '/' + protocol.output.unit, function () {
        onSucces({ state: rfxCommand === 'switchOn' ? 'on' : 'off' });
    });

}

DomustoRfxCom.registerInputs = function (rfxtrx) {

    let devices = DomustoRfxCom.configuration.devices;

    let protocolsWithListeners = [];

    for (let i = 0; i < devices.length; i++) {

        let device = devices[i];

        if (device.enabled) {

            let protocolHasListener = protocolsWithListeners.indexOf(device.role + device.type + device.protocol.hardwareId) > -1;
            // Temp + Humidity
            if (device.role === 'input' && device.type === 'temperature' && device.protocol.hardwareId === 'RFXCOM') {

                if (!protocolHasListener) {

                    rfxtrx.on(device.protocol.type + device.protocol.subType, function (sensorData) {
                        DomustoRfxCom.updateInputTempData(sensorData);
                    });

                    protocolsWithListeners.push(device.role + device.type + device.protocol.hardwareId);
                }

                DomustoRfxCom.registeredInputDeviceIds.push(device.protocol.id);

            }

            if (device.role === 'output' && device.type === 'switch' && device.protocol.hardwareId === 'RFXCOM') {

                // rfxtrx.on(device.protocol.type + device.protocol.subType, function (sensorData) {
                //     DomustoRfxCom.updateInputTempData(sensorData);
                // });

                // { subtype: 0,
                // seqnbr: 4,
                // id: '0x010CE4C6',
                // unitcode: 1,
                // commandNumber: 1,
                // command: 'On',
                // level: 15,
                // rssi: 6 }

                DomustoRfxCom.outputDevices[device.protocol.output.id] = device;

                let protocolHasListener = protocolsWithListeners.indexOf(device.protocol.type.toLowerCase() + device.protocol.hardwareId) > -1;

                if (!protocolHasListener) {

                    rfxtrx.on(device.protocol.type.toLowerCase(), function (receivedData) {
                        console.log('Hardware switch detected', receivedData);

                        DomustoRfxCom.onNewInputData({
                            hardwareId: receivedData.id,
                            command: receivedData.command.toLowerCase()
                        });

                    });

                    protocolsWithListeners.push(device.protocol.type.toLowerCase() + device.protocol.hardwareId);

                }

                DomustoRfxCom.registeredInputDeviceIds.push(device.protocol.output.id);
            }

        }

    }
};

DomustoRfxCom.updateInputTempData = function (sensorData) {

    console.log('sensor data: ', sensorData);

    let device = DomustoRfxCom.getDeviceById(sensorData.id);

    util.debug('Receiving input data ', sensorData);

    // If the sensorData is from a registered input device
    if (DomustoRfxCom.registeredInputDeviceIds.includes(sensorData.id)) {

        sensorData.typeString = DomustoRfxCom.subTypeString(device.protocol.type + device.protocol.subType);

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
    return DomustoRfxCom.configuration.devices.find(function (device) {
        // Switches have a master/slave, inputs don't
        return device.protocol.output ? device.protocol.output.id === deviceId : device.protocol.id === deviceId;
    });
};

DomustoRfxCom.ReceivedInput = function (type, sensorData) {
    util.debug('Receiving input data ', type, sensorData);
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
        DomustoRfxCom.ReceivedInput('security1', evt);
    });

    rfxtrx.on('bbq1', function (evt) {
        console.log('bbq1');
        DomustoRfxCom.ReceivedInput('bbq1', evt);
    });

    rfxtrx.on('temprain1', function (evt) {
        console.log('temprain1');
        DomustoRfxCom.ReceivedInput('temprain1', evt);
    });

    rfxtrx.on('temp1', function (evt) {
        console.log('temp1');
        DomustoRfxCom.ReceivedInput('temp1', evt);
    });
    rfxtrx.on('temp2', function (evt) {
        console.log('temp2');
        DomustoRfxCom.ReceivedInput('temp2', evt);
    });
    rfxtrx.on('temp3', function (evt) {
        console.log('temp3');
        DomustoRfxCom.ReceivedInput('temp3', evt);
    });
    rfxtrx.on('temp4', function (evt) {
        console.log('temp4');
        DomustoRfxCom.ReceivedInput('temp4', evt);
    });
    rfxtrx.on('temp5', function (evt) {
        console.log('temp5');
        DomustoRfxCom.ReceivedInput('temp5', evt);
    });
    rfxtrx.on('temp6', function (evt) {
        console.log('temp6');
        DomustoRfxCom.ReceivedInput('temp6', evt);
    });
    rfxtrx.on('temp7', function (evt) {
        console.log('temp7');
        DomustoRfxCom.ReceivedInput('temp7', evt);
    });
    rfxtrx.on('temp8', function (evt) {
        console.log('temp8');
        DomustoRfxCom.ReceivedInput('temp8', evt);
    });
    rfxtrx.on('temp9', function (evt) {
        console.log('temp9');
        DomustoRfxCom.ReceivedInput('temp9', evt);
    });
    rfxtrx.on('temp10', function (evt) {
        console.log('temp10');
        DomustoRfxCom.ReceivedInput('temp10', evt);
    });
    rfxtrx.on('temp11', function (evt) {
        console.log('temp11');
        DomustoRfxCom.ReceivedInput('temp11', evt);
    });

    rfxtrx.on('humidity1', function (evt) {
        console.log('humidity1');
        DomustoRfxCom.ReceivedInput('humidity1', evt);
    });

    rfxtrx.on('th1', function (evt) {
        console.log('th1');
        DomustoRfxCom.ReceivedInput('th1', evt);
    });
    rfxtrx.on('th2', function (evt) {
        console.log('th2');
        DomustoRfxCom.ReceivedInput('th2', evt);
    });
    rfxtrx.on('th3', function (evt) {
        console.log('th3');
        DomustoRfxCom.ReceivedInput('th3', evt);
    });
    rfxtrx.on('th4', function (evt) {
        console.log('th4');
        DomustoRfxCom.ReceivedInput('th4', evt);
    });
    rfxtrx.on('th5', function (evt) {
        console.log('th5');
        DomustoRfxCom.ReceivedInput('th5', evt);
    });
    rfxtrx.on('th6', function (evt) {
        console.log('th6');
        DomustoRfxCom.ReceivedInput('th6', evt);
    });
    rfxtrx.on('th7', function (evt) {
        console.log('th7');
        DomustoRfxCom.ReceivedInput('th7', evt);
    });
    rfxtrx.on('th8', function (evt) {
        console.log('th8');
        DomustoRfxCom.ReceivedInput('th8', evt);
    });
    rfxtrx.on('th9', function (evt) {
        console.log('th9');
        DomustoRfxCom.ReceivedInput('th9', evt);
    });
    rfxtrx.on('th10', function (evt) {
        console.log('th10');
        DomustoRfxCom.ReceivedInput('th10', evt);
    });
    rfxtrx.on('th11', function (evt) {
        console.log('th11');
        DomustoRfxCom.ReceivedInput('th11', evt);
    });
    rfxtrx.on('th12', function (evt) {
        console.log('th12');
        DomustoRfxCom.ReceivedInput('th12', evt);
    });
    rfxtrx.on('th13', function (evt) {
        console.log('th13');
        DomustoRfxCom.ReceivedInput('th13', evt);
    });
    rfxtrx.on('th14', function (evt) {
        console.log('th14');
        DomustoRfxCom.ReceivedInput('th14', evt);
    });

    rfxtrx.on('thb1', function (evt) {
        console.log('thb1');
        DomustoRfxCom.ReceivedInput('thb1', evt);
    });
    rfxtrx.on('thb2', function (evt) {
        console.log('thb2');
        DomustoRfxCom.ReceivedInput('thb2', evt);
    });

    rfxtrx.on('rain1', function (evt) {
        console.log('rain1');
        DomustoRfxCom.ReceivedInput('rain1', evt);
    });
    rfxtrx.on('rain2', function (evt) {
        console.log('rain2');
        DomustoRfxCom.ReceivedInput('rain2', evt);
    });
    rfxtrx.on('rain3', function (evt) {
        console.log('rain3');
        DomustoRfxCom.ReceivedInput('rain3', evt);
    });
    rfxtrx.on('rain4', function (evt) {
        console.log('rain4');
        DomustoRfxCom.ReceivedInput('rain4', evt);
    });
    rfxtrx.on('rain5', function (evt) {
        console.log('rain5');
        DomustoRfxCom.ReceivedInput('rain5', evt);
    });
    rfxtrx.on('rain6', function (evt) {
        console.log('rain6');
        DomustoRfxCom.ReceivedInput('rain6', evt);
    });
    rfxtrx.on('rain7', function (evt) {
        console.log('rain7');
        DomustoRfxCom.ReceivedInput('rain7', evt);
    });

    rfxtrx.on('wind1', function (evt) {
        console.log('wind1');
        DomustoRfxCom.ReceivedInput('wind1', evt);
    });
    rfxtrx.on('wind2', function (evt) {
        console.log('wind2');
        DomustoRfxCom.ReceivedInput('wind2', evt);
    });
    rfxtrx.on('wind3', function (evt) {
        console.log('wind3');
        DomustoRfxCom.ReceivedInput('wind3', evt);
    });
    rfxtrx.on('wind4', function (evt) {
        console.log('wind4');
        DomustoRfxCom.ReceivedInput('wind4', evt);
    });
    rfxtrx.on('wind5', function (evt) {
        console.log('wind5');
        DomustoRfxCom.ReceivedInput('wind5', evt);
    });
    rfxtrx.on('wind6', function (evt) {
        console.log('wind6');
        DomustoRfxCom.ReceivedInput('wind6', evt);
    });
    rfxtrx.on('wind7', function (evt) {
        console.log('wind7');
        DomustoRfxCom.ReceivedInput('wind7', evt);
    });

    rfxtrx.on('uv1', function (evt) {
        console.log('uv1');
        DomustoRfxCom.ReceivedInput('uv1', evt);
    });
    rfxtrx.on('uv2', function (evt) {
        console.log('uv2');
        DomustoRfxCom.ReceivedInput('uv2', evt);
    });
    rfxtrx.on('uv3', function (evt) {
        console.log('uv3');
        DomustoRfxCom.ReceivedInput('uv3', evt);
    });

    rfxtrx.on('weight1', function (evt) {
        console.log('weight1');
        DomustoRfxCom.ReceivedInput('weight1', evt);
    });
    rfxtrx.on('weight2', function (evt) {
        console.log('weight2');
        DomustoRfxCom.ReceivedInput('weight2', evt);
    });

    rfxtrx.on('elec1', function (evt) {
        console.log('elec1');
        DomustoRfxCom.ReceivedInput('elec1', evt);
    });
    rfxtrx.on('elec2', function (evt) {
        console.log('elec2');
        DomustoRfxCom.ReceivedInput('elec2', evt);
    });
    rfxtrx.on('elec3', function (evt) {
        console.log('elec3');
        DomustoRfxCom.ReceivedInput('elec3', evt);
    });
    rfxtrx.on('elec4', function (evt) {
        console.log('elec4');
        DomustoRfxCom.ReceivedInput('elec4', evt);
    });
    rfxtrx.on('elec5', function (evt) {
        console.log('elec5');
        DomustoRfxCom.ReceivedInput('elec5', evt);
    });

    rfxtrx.on('lighting1', function (evt) {
        console.log('lighting1');
        DomustoRfxCom.ReceivedInput('lighting1', evt);
    });
    rfxtrx.on('lighting2', function (evt) {
        console.log('lighting2');
        DomustoRfxCom.ReceivedInput('lighting2', evt);
    });
    rfxtrx.on('lighting3', function (evt) {
        console.log('lighting3');
        DomustoRfxCom.ReceivedInput('lighting3', evt);
    });
    rfxtrx.on('lighting4', function (evt) {
        console.log('lighting4');
        DomustoRfxCom.ReceivedInput('lighting4', evt);
    });
    rfxtrx.on('lighting5', function (evt) {
        console.log('lighting5');
        DomustoRfxCom.ReceivedInput('lighting5', evt);
    });
    rfxtrx.on('lighting6', function (evt) {
        console.log('lighting6');
        DomustoRfxCom.ReceivedInput('lighting6', evt);
    });

    rfxtrx.on('rfxmeter', function (evt) {
        console.log('rfxsensor');
        DomustoRfxCom.ReceivedInput('rfxsensor', evt);
    });

    rfxtrx.on('rfxsensor', function (evt) {
        console.log('rfxsensor');
        DomustoRfxCom.ReceivedInput('rfxsensor', evt);
    });

}

module.exports = DomustoRfxCom;