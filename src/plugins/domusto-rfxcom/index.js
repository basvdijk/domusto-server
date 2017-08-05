let rfxcom = require('rfxcom');
let util = require('../../util');
let config = require('../../config');

let DomustoPlugin = require('../../domusto/domusto-plugin');

/**
 * RFXcom plugin for DOMUSTO
 * @author Bas van Dijk
 * @version 0.0.1
 * 
 * @class DomustoRfxCom
 * @extends {DomustoPlugin}
 */
class DomustoRfxCom extends DomustoPlugin {

    /**
     * Creates an instance of DomustoRfxCom.
     * @param {any} Plugin configuration as defined in the config.js file 
     * @memberof DomustoRfxCom
     */
    constructor(pluginConfiguration) {

        super({
            plugin: 'RfxCom transceiver',
            author: 'Bas van Dijk',
            category: 'radio',
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        let _self = this;

        this.pluginConfiguration = pluginConfiguration;
        this.attachedInputDeviceIds = [];

        try {
            let rfxtrx = new rfxcom.RfxCom(pluginConfiguration.port, { debug: config.debug });
            this.hardwareInstance = rfxtrx;

            this.hardwareInstance.on('status', function (status) {
                util.prettyJson(status);
                _self.statusData = status;
            });

            this.hardwareInstance.initialise(function onReady() {
                _self._checkEnabledModes();
                _self._initialiseInputs();
                util.debug('RFXtrx ready');
            });

        } catch (error) {
            util.log('Initialisation of RfxCom plugin failed', error);
        }

    }

    outputCommand(device, command, onSucces) {

        let protocol = device.protocol;

        // e.g. rfxcom.Lighting2, rfxcom.Lighting3 etc.
        let rfxConstructor = rfxcom[protocol.type];
        let rfxProtocolType = rfxcom[protocol.type.toLowerCase()];

        let rfxSwitch = new rfxConstructor(this.hardwareInstance, rfxProtocolType[protocol.subType]);

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

        console.log(protocol.outputId, rfxCommand);

        // Format the hardware id and into the 0x2020504/1 format
        rfxSwitch[rfxCommand](protocol.outputId, function () {
            onSucces({ state: rfxCommand === 'switchOn' ? 'on' : 'off' });
        });

    }


    /**
     * Checks if the enabled protocols on the device match the protocols defined in the config file
     * 
     * @memberof DomustoRfxCom
     */
    _checkEnabledModes() {

        let hardwareEnabledProtocols = this.statusData.enabledProtocols.sort();
        let configuredEnabledProtocols = this.pluginConfiguration.enabledProtocols.sort();

        // check if the enabled protocols are the same as the once on the device
        if (JSON.stringify(hardwareEnabledProtocols) === JSON.stringify(configuredEnabledProtocols)) {
            util.log('Enabled protocols in config are the same as on hardware. Skipping setting protocols');
        } else {
            util.log('Enabled protocols in config are NOT the same as on hardware.');

            util.log('Enabling protocols in RFXcom device according to config...');

            let enabledProtocolArray = [];

            configuredEnabledProtocols.forEach(function (protocol) {
                enabledProtocolArray.push(rfxcom.protocols[protocol]);
            }, this);

            console.log(enabledProtocolArray);

            // DomustoRfxCom.hardwareInstance.enable(enabledProtocolArray, function onDone(response) {
            //     console.log(response);
            // });

        }
    }


    /**
     * Initialise the input devices which use the RfxCom hardware
     * 
     * @memberof DomustoRfxCom
     */
    _initialiseInputs() {

        let _self = this;

        let devices = config.devices;
        let protocolsWithListeners = [];

        devices.forEach(function (device) {

            if (device.protocol.hardwareId === 'RFXCOM' && device.enabled) {

                // Temp + Humidity
                if (device.role === 'input' && device.type === 'temperature') {

                    let protocolHasListener = protocolsWithListeners.indexOf(device.protocol.hardwareId + device.role + device.type) > -1;
                    if (!protocolHasListener) {

                        _self.hardwareInstance.on(device.protocol.type + device.protocol.subType, function receivedData(data) {
                            _self._updateInputTemperatureData(data);
                        });

                        protocolsWithListeners.push(device.protocol.hardwareId + device.role + device.type);
                    }

                    // _self.attachedInputDeviceIds.push(device.protocol.id);
                    _self.attachedInputDeviceIds.push(device);

                }

                if (device.role === 'output' && device.type === 'switch') {

                    let protocolHasListener = protocolsWithListeners.indexOf(device.protocol.type.toLowerCase() + device.protocol.hardwareId) > -1;
                    if (!protocolHasListener) {

                        _self.hardwareInstance.on(device.protocol.type.toLowerCase(), function (receivedData) {
                            util.debug('Hardware switch event detected', receivedData);

                            _self.onNewInputData({
                                hardwareId: receivedData.id + '/' + receivedData.unitcode,
                                command: receivedData.command.toLowerCase()
                            });

                        });

                        protocolsWithListeners.push(device.protocol.type.toLowerCase() + device.protocol.hardwareId);

                    }

                    // _self.attachedInputDeviceIds.push(device.protocol.outputId);
                    _self.attachedInputDeviceIds.push(device);
                }

            }

        }, this);
    };


    /**
     * Sends an data update to DOMUSTO for temperature data
     * 
     * @param {any} sensorData Data received from the RfxCom
     * @memberof DomustoRfxCom
     */
    _updateInputTemperatureData(sensorData) {

        let device = this._getDeviceById(sensorData.id);

        // If the sensorData is from a registered input device
        if (device) {

            let typeString = this._subTypeString(device.protocol.type + device.protocol.subType);

            this.onNewInputData({
                hardwareId: sensorData.id,
                data: {
                    deviceTypeString: typeString,                 // Name of device type
                    temperature: sensorData.temperature,          // Temperature
                    humidity: sensorData.humidity,                // Humidity
                    humidityStatus: sensorData.humidityStatus,    // Humidity status: 0: dry, 1: comfort, 2: normal, 3: wet etc.
                    batteryLevel: sensorData.batteryLevel,        // Battery level
                    rssi: sensorData.rssi                         // Radio Signal Strength Indication
                }
            });

        };

    };

    /**
     * Get a device by the protocol id or output id
     * 
     * @param {any} deviceId 
     * @returns Device when found
     * @memberof DomustoRfxCom
     */
    _getDeviceById(deviceId) {
        return this.attachedInputDeviceIds.find(function (device) {
            // Switches have a master/slave, inputs don't
            return device.protocol.output ? device.protocol.outputId === deviceId : device.protocol.id === deviceId;
        });
    };


    /**
     * Triggered when the listenAll received data
     * 
     * @param {any} type Protocol type
     * @param {any} data Data send by the RfxCom
     * @memberof DomustoRfxCom
     */
    listenAllReceivedInput(type, data) {
        util.debug('Receiving input data for', type);
        util.prettyJson(data);
    };


    /**
     * Listen to all possible protocols
     * 
     * @memberof DomustoRfxCom
     */
    _listenAll() {

        let _self = this;

        // SECURITY
        this.hardwareInstance.on('security1', function (data) {
            _self._listenAllReceivedInput('security1', data);
        });

        // BBQ
        this.hardwareInstance.on('bbq1', function (data) {
            _self._listenAllReceivedInput('bbq1', data);
        });

        // TEMPERATURE & RAIN
        this.hardwareInstance.on('temprain1', function (data) {
            _self._listenAllReceivedInput('temprain1', data);
        });

        // TEMPERATURE
        this.hardwareInstance.on('temp1', function (data) {
            _self._listenAllReceivedInput('temp1', data);
        });
        this.hardwareInstance.on('temp2', function (data) {
            _self._listenAllReceivedInput('temp2', data);
        });
        this.hardwareInstance.on('temp3', function (data) {
            _self._listenAllReceivedInput('temp3', data);
        });
        this.hardwareInstance.on('temp4', function (data) {
            _self._listenAllReceivedInput('temp4', data);
        });
        this.hardwareInstance.on('temp5', function (data) {
            _self._listenAllReceivedInput('temp5', data);
        });
        this.hardwareInstance.on('temp6', function (data) {
            _self._listenAllReceivedInput('temp6', data);
        });
        this.hardwareInstance.on('temp7', function (data) {
            _self._listenAllReceivedInput('temp7', data);
        });
        this.hardwareInstance.on('temp8', function (data) {
            _self._listenAllReceivedInput('temp8', data);
        });
        this.hardwareInstance.on('temp9', function (data) {
            _self._listenAllReceivedInput('temp9', data);
        });
        this.hardwareInstance.on('temp10', function (data) {
            _self._listenAllReceivedInput('temp10', data);
        });
        this.hardwareInstance.on('temp11', function (data) {
            _self._listenAllReceivedInput('temp11', data);
        });

        // HUMIDITY
        this.hardwareInstance.on('humidity1', function (data) {
            _self._listenAllReceivedInput('humidity1', data);
        });

        // TEMERATURE & HUMIDITY
        this.hardwareInstance.on('th1', function (data) {
            _self._listenAllReceivedInput('th1', data);
        });
        this.hardwareInstance.on('th2', function (data) {
            _self._listenAllReceivedInput('th2', data);
        });
        this.hardwareInstance.on('th3', function (data) {
            _self._listenAllReceivedInput('th3', data);
        });
        this.hardwareInstance.on('th4', function (data) {
            _self._listenAllReceivedInput('th4', data);
        });
        this.hardwareInstance.on('th5', function (data) {
            _self._listenAllReceivedInput('th5', data);
        });
        this.hardwareInstance.on('th6', function (data) {
            _self._listenAllReceivedInput('th6', data);
        });
        this.hardwareInstance.on('th7', function (data) {
            _self._listenAllReceivedInput('th7', data);
        });
        this.hardwareInstance.on('th8', function (data) {
            _self._listenAllReceivedInput('th8', data);
        });
        this.hardwareInstance.on('th9', function (data) {
            _self._listenAllReceivedInput('th9', data);
        });
        this.hardwareInstance.on('th10', function (data) {
            _self._listenAllReceivedInput('th10', data);
        });
        this.hardwareInstance.on('th11', function (data) {
            _self._listenAllReceivedInput('th11', data);
        });
        this.hardwareInstance.on('th12', function (data) {
            _self._listenAllReceivedInput('th12', data);
        });
        this.hardwareInstance.on('th13', function (data) {
            _self._listenAllReceivedInput('th13', data);
        });
        this.hardwareInstance.on('th14', function (data) {
            _self._listenAllReceivedInput('th14', data);
        });

        // TEMPERATURE & HUMIDITY & BAROMETER
        this.hardwareInstance.on('thb1', function (data) {
            _self._listenAllReceivedInput('thb1', data);
        });
        this.hardwareInstance.on('thb2', function (data) {
            _self._listenAllReceivedInput('thb2', data);
        });

        // RAIN
        this.hardwareInstance.on('rain1', function (data) {
            _self._listenAllReceivedInput('rain1', data);
        });
        this.hardwareInstance.on('rain2', function (data) {
            _self._listenAllReceivedInput('rain2', data);
        });
        this.hardwareInstance.on('rain3', function (data) {
            _self._listenAllReceivedInput('rain3', data);
        });
        this.hardwareInstance.on('rain4', function (data) {
            _self._listenAllReceivedInput('rain4', data);
        });
        this.hardwareInstance.on('rain5', function (data) {
            _self._listenAllReceivedInput('rain5', data);
        });
        this.hardwareInstance.on('rain6', function (data) {
            _self._listenAllReceivedInput('rain6', data);
        });
        this.hardwareInstance.on('rain7', function (data) {
            _self._listenAllReceivedInput('rain7', data);
        });

        // WIND
        this.hardwareInstance.on('wind1', function (data) {
            _self._listenAllReceivedInput('wind1', data);
        });
        this.hardwareInstance.on('wind2', function (data) {
            _self._listenAllReceivedInput('wind2', data);
        });
        this.hardwareInstance.on('wind3', function (data) {
            _self._listenAllReceivedInput('wind3', data);
        });
        this.hardwareInstance.on('wind4', function (data) {
            _self._listenAllReceivedInput('wind4', data);
        });
        this.hardwareInstance.on('wind5', function (data) {
            _self._listenAllReceivedInput('wind5', data);
        });
        this.hardwareInstance.on('wind6', function (data) {
            _self._listenAllReceivedInput('wind6', data);
        });
        this.hardwareInstance.on('wind7', function (data) {
            _self._listenAllReceivedInput('wind7', data);
        });

        // UV
        this.hardwareInstance.on('uv1', function (data) {
            _self._listenAllReceivedInput('uv1', data);
        });
        this.hardwareInstance.on('uv2', function (data) {
            _self._listenAllReceivedInput('uv2', data);
        });
        this.hardwareInstance.on('uv3', function (data) {
            _self._listenAllReceivedInput('uv3', data);
        });

        // WEIGHT
        this.hardwareInstance.on('weight1', function (data) {
            _self._listenAllReceivedInput('weight1', data);
        });
        this.hardwareInstance.on('weight2', function (data) {
            _self._listenAllReceivedInput('weight2', data);
        });

        // ELECTRICITY
        this.hardwareInstance.on('elec1', function (data) {
            _self._listenAllReceivedInput('elec1', data);
        });
        this.hardwareInstance.on('elec2', function (data) {
            _self._listenAllReceivedInput('elec2', data);
        });
        this.hardwareInstance.on('elec3', function (data) {
            _self._listenAllReceivedInput('elec3', data);
        });
        this.hardwareInstance.on('elec4', function (data) {
            _self._listenAllReceivedInput('elec4', data);
        });
        this.hardwareInstance.on('elec5', function (data) {
            _self._listenAllReceivedInput('elec5', data);
        });

        // LIGHTING
        this.hardwareInstance.on('lighting1', function (data) {
            _self._listenAllReceivedInput('lighting1', data);
        });
        this.hardwareInstance.on('lighting2', function (data) {
            _self._listenAllReceivedInput('lighting2', data);
        });
        this.hardwareInstance.on('lighting3', function (data) {
            _self._listenAllReceivedInput('lighting3', data);
        });
        this.hardwareInstance.on('lighting4', function (data) {
            _self._listenAllReceivedInput('lighting4', data);
        });
        this.hardwareInstance.on('lighting5', function (data) {
            _self._listenAllReceivedInput('lighting5', data);
        });
        this.hardwareInstance.on('lighting6', function (data) {
            _self._listenAllReceivedInput('lighting6', data);
        });

        // RFX
        this.hardwareInstance.on('rfxmeter', function (data) {
            _self._listenAllReceivedInput('rfxsensor', data);
        });

        this.hardwareInstance.on('rfxsensor', function (data) {
            _self._listenAllReceivedInput('rfxsensor', data);
        });

    }

    // Descriptions from https://github.com/openhab/openhab2-addons/tree/master/addons/binding/org.openhab.binding.rfxcom
    _subTypeString(subType) {

        switch (subType) {

            // TEMPERATURE
            case 'th1':
                return 'THGN122/123, THGN132, THGR122/228/238/268';
            case 'th2':
                return 'THGR810, THGN800';
            case 'th3':
                return 'RTGR328';
            case 'th4':
                return 'THGR328';
            case 'th5':
                return 'WTGR800';
            case 'th6':
                return 'THGR918/928, THGRN228, THGN500';
            case 'th7':
                return 'TFA TS34C, Cresta';
            case 'th8':
                return 'WT260, WT260H, WT440H, WT450, WT450H';
            case 'th9':
                return 'Viking 02035, 02038 (02035 has no humidity), Proove TSS320, 311501';
            case 'th10':
                return 'Rubicson';
            case 'th11':
                return 'EW109';
            case 'th12':
                return 'Imagintronix/Opus XT300 Soil sensor';
            case 'th13':
                return 'Alecto WS1700 and compatibles';

        }

        return retVal;
    };

}

module.exports = DomustoRfxCom;