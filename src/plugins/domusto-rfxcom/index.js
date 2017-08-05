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
            let rfxtrx = new rfxcom.RfxCom(pluginConfiguration.port, { debug: this.pluginConfiguration.debug });
            this.hardwareInstance = rfxtrx;

            this.hardwareInstance.on('status', function (status) {
                util.prettyJson(status);
                _self.statusData = status;
            });

            this.hardwareInstance.initialise(function onReady() {
                _self._initialisePlugin();
                // _self._listenAll();
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

        // Convert DOMUSTO command to RfxCom command
        switch (command) {
            case 'on':
                rfxCommand = 'switchOn';
                break;
            case 'off':
                rfxCommand = 'switchOff';
                break;
            case 'chime':
                rfxCommand = 'chime';
                break;
        }

        util.debug('Sending command:');
        util.prettyJson({
            id: protocol.outputId,
            command: rfxCommand
        });

        // Execute command
        rfxSwitch[rfxCommand](protocol.outputId, function () {
            onSucces({ state: rfxCommand === 'switchOn' ? 'on' : 'off' });
        });

    }

    _initialisePlugin() {
        this._checkEnabledModes();
        this._initialiseInputs();
    }


    /**
     * Checks if the enabled protocols on the device match the protocols defined in the config file
     * 
     * @memberof DomustoRfxCom
     */
    _checkEnabledModes() {

        let _self = this;

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

            this.hardwareInstance.enable(enabledProtocolArray, function onDone(response) {
                util.log('Enabling protocols finished, restarting plugin');
                _self._initialisePlugin();
            });

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

                let protocolEventName = null;
                let listenerId = null;
                let eventHandler = null;

                // Temp + Humidity
                if (device.role === 'input' && device.type === 'temperature') {
                    protocolEventName = device.protocol.type + device.protocol.subType;
                    listenerId = device.protocol.hardwareId + device.role + device.type;
                    eventHandler = _self._onInputTemperature;
                }
                else if (device.role === 'output' && device.type === 'switch') {
                    protocolEventName = device.protocol.type.toLowerCase();
                    listenerId = device.protocol.hardwareId + protocolEventName;
                    eventHandler = _self._onOutputSwitch;
                }

                // Check if an protocol event name, listener id and event handler is set
                if (protocolEventName && listenerId && eventHandler) {

                    // If protocol has no listener yet
                    if (protocolsWithListeners.indexOf(listenerId) == -1) {
                        this.hardwareInstance.on(protocolEventName, eventHandler.bind(this));
                        protocolsWithListeners.push(listenerId);
                    }

                    this.attachedInputDeviceIds.push(device);

                }
            }

        }, this);

    };

    _onOutputSwitch(receivedData) {
        util.debug('Hardware switch event detected', receivedData);

        this.onNewInputData({
            hardwareId: receivedData.id + '/' + receivedData.unitcode,
            command: receivedData.command.toLowerCase()
        });
    }


    /**
     * Sends an data update to DOMUSTO for temperature data
     * 
     * @param {any} sensorData Data received from the RfxCom
     * @memberof DomustoRfxCom
     */
    _onInputTemperature(sensorData) {

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
    _listenAllReceivedInput(type, data) {
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
        this.hardwareInstance.on('security1', (data) => {
            this._listenAllReceivedInput('security1', data);
        });
        
        // CHIME
        this.hardwareInstance.on('chime1', (data) => {
            this._listenAllReceivedInput('chime1', data);
        });

        // BBQ
        this.hardwareInstance.on('bbq1', (data) => {
            this._listenAllReceivedInput('bbq1', data);
        });

        // TEMPERATURE & RAIN
        this.hardwareInstance.on('temprain1', (data) => {
            this._listenAllReceivedInput('temprain1', data);
        });

        // TEMPERATURE
        this.hardwareInstance.on('temp1', (data) => {
            this._listenAllReceivedInput('temp1', data);
        });
        this.hardwareInstance.on('temp2', (data) => {
            this._listenAllReceivedInput('temp2', data);
        });
        this.hardwareInstance.on('temp3', (data) => {
            this._listenAllReceivedInput('temp3', data);
        });
        this.hardwareInstance.on('temp4', (data) => {
            this._listenAllReceivedInput('temp4', data);
        });
        this.hardwareInstance.on('temp5', (data) => {
            this._listenAllReceivedInput('temp5', data);
        });
        this.hardwareInstance.on('temp6', (data) => {
            this._listenAllReceivedInput('temp6', data);
        });
        this.hardwareInstance.on('temp7', (data) => {
            this._listenAllReceivedInput('temp7', data);
        });
        this.hardwareInstance.on('temp8', (data) => {
            this._listenAllReceivedInput('temp8', data);
        });
        this.hardwareInstance.on('temp9', (data) => {
            this._listenAllReceivedInput('temp9', data);
        });
        this.hardwareInstance.on('temp10', (data) => {
            this._listenAllReceivedInput('temp10', data);
        });
        this.hardwareInstance.on('temp11', (data) => {
            this._listenAllReceivedInput('temp11', data);
        });

        // HUMIDITY
        this.hardwareInstance.on('humidity1', (data) => {
            this._listenAllReceivedInput('humidity1', data);
        });

        // TEMERATURE & HUMIDITY
        this.hardwareInstance.on('th1', (data) => {
            this._listenAllReceivedInput('th1', data);
        });
        this.hardwareInstance.on('th2', (data) => {
            this._listenAllReceivedInput('th2', data);
        });
        this.hardwareInstance.on('th3', (data) => {
            this._listenAllReceivedInput('th3', data);
        });
        this.hardwareInstance.on('th4', (data) => {
            this._listenAllReceivedInput('th4', data);
        });
        this.hardwareInstance.on('th5', (data) => {
            this._listenAllReceivedInput('th5', data);
        });
        this.hardwareInstance.on('th6', (data) => {
            this._listenAllReceivedInput('th6', data);
        });
        this.hardwareInstance.on('th7', (data) => {
            this._listenAllReceivedInput('th7', data);
        });
        this.hardwareInstance.on('th8', (data) => {
            this._listenAllReceivedInput('th8', data);
        });
        this.hardwareInstance.on('th9', (data) => {
            this._listenAllReceivedInput('th9', data);
        });
        this.hardwareInstance.on('th10', (data) => {
            this._listenAllReceivedInput('th10', data);
        });
        this.hardwareInstance.on('th11', (data) => {
            this._listenAllReceivedInput('th11', data);
        });
        this.hardwareInstance.on('th12', (data) => {
            this._listenAllReceivedInput('th12', data);
        });
        this.hardwareInstance.on('th13', (data) => {
            this._listenAllReceivedInput('th13', data);
        });
        this.hardwareInstance.on('th14', (data) => {
            this._listenAllReceivedInput('th14', data);
        });

        // TEMPERATURE & HUMIDITY & BAROMETER
        this.hardwareInstance.on('thb1', (data) => {
            this._listenAllReceivedInput('thb1', data);
        });
        this.hardwareInstance.on('thb2', (data) => {
            this._listenAllReceivedInput('thb2', data);
        });

        // RAIN
        this.hardwareInstance.on('rain1', (data) => {
            this._listenAllReceivedInput('rain1', data);
        });
        this.hardwareInstance.on('rain2', (data) => {
            this._listenAllReceivedInput('rain2', data);
        });
        this.hardwareInstance.on('rain3', (data) => {
            this._listenAllReceivedInput('rain3', data);
        });
        this.hardwareInstance.on('rain4', (data) => {
            this._listenAllReceivedInput('rain4', data);
        });
        this.hardwareInstance.on('rain5', (data) => {
            this._listenAllReceivedInput('rain5', data);
        });
        this.hardwareInstance.on('rain6', (data) => {
            this._listenAllReceivedInput('rain6', data);
        });
        this.hardwareInstance.on('rain7', (data) => {
            this._listenAllReceivedInput('rain7', data);
        });

        // WIND
        this.hardwareInstance.on('wind1', (data) => {
            this._listenAllReceivedInput('wind1', data);
        });
        this.hardwareInstance.on('wind2', (data) => {
            this._listenAllReceivedInput('wind2', data);
        });
        this.hardwareInstance.on('wind3', (data) => {
            this._listenAllReceivedInput('wind3', data);
        });
        this.hardwareInstance.on('wind4', (data) => {
            this._listenAllReceivedInput('wind4', data);
        });
        this.hardwareInstance.on('wind5', (data) => {
            this._listenAllReceivedInput('wind5', data);
        });
        this.hardwareInstance.on('wind6', (data) => {
            this._listenAllReceivedInput('wind6', data);
        });
        this.hardwareInstance.on('wind7', (data) => {
            this._listenAllReceivedInput('wind7', data);
        });

        // UV
        this.hardwareInstance.on('uv1', (data) => {
            this._listenAllReceivedInput('uv1', data);
        });
        this.hardwareInstance.on('uv2', (data) => {
            this._listenAllReceivedInput('uv2', data);
        });
        this.hardwareInstance.on('uv3', (data) => {
            this._listenAllReceivedInput('uv3', data);
        });

        // WEIGHT
        this.hardwareInstance.on('weight1', (data) => {
            this._listenAllReceivedInput('weight1', data);
        });
        this.hardwareInstance.on('weight2', (data) => {
            this._listenAllReceivedInput('weight2', data);
        });

        // ELECTRICITY
        this.hardwareInstance.on('elec1', (data) => {
            this._listenAllReceivedInput('elec1', data);
        });
        this.hardwareInstance.on('elec2', (data) => {
            this._listenAllReceivedInput('elec2', data);
        });
        this.hardwareInstance.on('elec3', (data) => {
            this._listenAllReceivedInput('elec3', data);
        });
        this.hardwareInstance.on('elec4', (data) => {
            this._listenAllReceivedInput('elec4', data);
        });
        this.hardwareInstance.on('elec5', (data) => {
            this._listenAllReceivedInput('elec5', data);
        });

        // LIGHTING
        this.hardwareInstance.on('lighting1', (data) => {
            this._listenAllReceivedInput('lighting1', data);
        });
        this.hardwareInstance.on('lighting2', (data) => {
            this._listenAllReceivedInput('lighting2', data);
        });
        this.hardwareInstance.on('lighting3', (data) => {
            this._listenAllReceivedInput('lighting3', data);
        });
        this.hardwareInstance.on('lighting4', (data) => {
            this._listenAllReceivedInput('lighting4', data);
        });
        this.hardwareInstance.on('lighting5', (data) => {
            this._listenAllReceivedInput('lighting5', data);
        });
        this.hardwareInstance.on('lighting6', (data) => {
            this._listenAllReceivedInput('lighting6', data);
        });

        // RFX
        this.hardwareInstance.on('rfxmeter', (data) => {
            this._listenAllReceivedInput('rfxsensor', data);
        });

        this.hardwareInstance.on('rfxsensor', (data) => {
            this._listenAllReceivedInput('rfxsensor', data);
        });

    }

    // Descriptions from https://github.com/openhab/openhab2-addons/tree/master/addons/binding/org.openhab.binding.rfxcom
    _subTypeString(subType) {

        switch (subType) {

            // TEMPERATURE
            case 'temp1':
                return 'THR128/138, THC138';
            case 'temp2':
                return 'THC238/268,THN132,THWR288,THRN122,THN122,AW129/131';
            case 'temp3':
                return 'THWR800';
            case 'temp4':
                return 'RTHN318';
            case 'temp5':
                return 'La Crosse TX2, TX3, TX4, TX17';
            case 'temp6':
                return 'TS15C. UPM temp only';
            case 'temp7':
                return 'Viking 02811, Proove TSS330, 311346';
            case 'temp8':
                return 'La Crosse WS2300';
            case 'temp9':
                return 'Rubicson';
            case 'temp10':
                return ' TFA 30.3133';
            case 'temp11':
                return ' WT0122';

            // TEMPERATURE & HUMIDITY
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

            // TEMPERATURE & HUMIDITY & BAROMETER
            case 'thb1':
                return 'BTHR918, BTHGN129';
            case 'thb2':
                return 'BTHR918N, BTHR968';

            default:
                return 'Unknown device';

        }

    };

}

module.exports = DomustoRfxCom;