import util from '../../util';
import config from '../../config';

// DOMUSTO
import DomustoPlugin from '../../domusto/DomustoPlugin';

// INTERFACES
import { PluginCategories } from '../../domusto/interfaces/plugin/PluginMetaData';
import { PluginConfiguration } from '../../domusto/interfaces/plugin/PluginConfiguration';
import { TemperatureHumidity } from '../../domusto/interfaces/inputData/InputDataTemperatureHumidity';

// PLUGIN SPECIFIC
import * as rfxcom from 'rfxcom';

/**
 * RFXcom plugin for DOMUSTO
 * @author Bas van Dijk
 * @version 0.0.1
 *
 * @class DomustoRfxCom
 * @extends {DomustoPlugin}
 */
class DomustoRfxCom extends DomustoPlugin {

    private attachedInputDeviceIds = [];
    private statusData: { enabledProtocols: any };

    /**
     * Creates an instance of DomustoRfxCom.
     * @param {any} Plugin configuration as defined in the config.js file
     * @memberof DomustoRfxCom
     */
    constructor(pluginConfiguration: PluginConfiguration) {

        super({
            plugin: 'RfxCom transceiver',
            author: 'Bas van Dijk',
            category: PluginCategories.radio,
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        this.pluginConfiguration = pluginConfiguration;
        this.attachedInputDeviceIds = [];

        try {
            let rfxtrx = new rfxcom.RfxCom(pluginConfiguration.settings.port, { debug: this.pluginConfiguration.debug });
            this.hardwareInstance = rfxtrx;

            this.hardwareInstance.on('status', status => {
                util.prettyJson(status);
                this.statusData = status;
            });

            this.hardwareInstance.initialise(() => {

                if (pluginConfiguration.settings.listenOnly) {
                    this._listenAll();
                    util.log('Listen mode active');
                } else {
                    this._initialisePlugin();
                }
                util.header('RFXcom ready for sending / receiving data');
            });

        } catch (error) {
            util.log('Initialisation of RfxCom plugin failed', error);
        }

    }

    outputCommand(device, command, onSucces) {

        if (!this.pluginConfiguration.settings.listenOnly) {

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
                case 'trigger':
                    rfxCommand = 'chime';
                    break;
            }

            util.debug('Sending command:');
            util.prettyJson({
                id: protocol.outputId,
                command: rfxCommand
            });

            // Execute command
            rfxSwitch[rfxCommand](protocol.outputId, (res) => {
                onSucces({ state: rfxCommand === 'switchOn' ? 'on' : 'off' });
            });

        }
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

        let hardwareEnabledProtocols = this.statusData.enabledProtocols.sort();
        let configuredEnabledProtocols = this.pluginConfiguration.settings.enabledProtocols.sort();

        util.header('CHECKING ENABLED PROTOCOLS ON RFXCOM DEVICE');

        // check if the enabled protocols are the same as the once on the device
        if (JSON.stringify(hardwareEnabledProtocols) === JSON.stringify(configuredEnabledProtocols)) {
            util.log('Enabled protocols in config are the same as on hardware. Skipping setting protocols');
        } else {
            util.log('Enabled protocols in config are NOT the same as on hardware.');

            util.log('Enabling protocols in RFXcom device according to config...');

            let enabledProtocolArray = [];

            configuredEnabledProtocols.forEach(protocol => {
                enabledProtocolArray.push(rfxcom.protocols[protocol]);
            }, this);

            this.hardwareInstance.enable(enabledProtocolArray, () => {
                util.log('Enabling protocols finished, restarting plugin');
                this._initialisePlugin();
            });

        }
    }


    /**
     * Initialise the input devices which use the RfxCom hardware
     *
     * @memberof DomustoRfxCom
     */
    _initialiseInputs() {

        let devices = config.devices;
        let protocolsWithListeners = [];

        devices.forEach(device => {

            if (device.protocol.pluginId === 'RFXCOM' && device.enabled) {

                let protocolEventName = null;
                let listenerId = null;
                let eventHandler = null;

                // Temp + Humidity
                if (device.role === 'input' && device.type === 'temperature') {
                    // TODO
                    protocolEventName = device.protocol['type'];
                    listenerId = device.protocol.pluginId + device.role + device.type;
                    eventHandler = this._onInputTemperature;
                }
                else if (device.role === 'output' && device.type === 'switch') {
                    // TODO
                    protocolEventName = device.protocol['type'].toLowerCase();
                    listenerId = device.protocol.pluginId + protocolEventName;
                    eventHandler = this._onOutputSwitch;
                }

                // Check if an protocol event name, listener id and event handler is set
                if (protocolEventName && listenerId && eventHandler) {

                    // If protocol has no listener yet
                    if (protocolsWithListeners.indexOf(listenerId) === -1) {
                        this.hardwareInstance.on(protocolEventName, eventHandler.bind(this));
                        protocolsWithListeners.push(listenerId);
                    }

                    this.attachedInputDeviceIds.push(device);

                }
            }

        }, this);

    }

    _onOutputSwitch(receivedData) {
        util.debug('Hardware switch event detected', receivedData);

        this.onNewInputData({
            pluginId: this._pluginConfiguration.type,
            deviceId: receivedData.unitCode ? receivedData.id + '/' + receivedData.unitCode : receivedData.id,
            command: receivedData.command ? receivedData.command.toLowerCase() : 'trigger'
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

            let typeString = this._subTypeString(device.protocol.type + '-' + sensorData.subtype);

            let temperatureHumidityData: TemperatureHumidity = {
                pluginId: this._pluginConfiguration.type,
                deviceId: sensorData.id,
                data: {
                    deviceTypeString: typeString,                 // Name of device type
                    temperature: sensorData.temperature,          // Temperature
                    humidity: sensorData.humidity,                // Humidity
                    humidityStatus: sensorData.humidityStatus,    // Humidity status: 0: dry, 1: comfort, 2: normal, 3: wet etc.
                    batteryLevel: sensorData.batteryLevel,        // Battery level
                    rssi: sensorData.rssi                         // Radio Signal Strength Indication
                }
            };

            this.onNewInputData(temperatureHumidityData);

        }

    }

    /**
     * Get a device by the protocol id or output id
     *
     * @param {any} deviceId
     * @returns Device when found
     * @memberof DomustoRfxCom
     */
    _getDeviceById(deviceId) {
        return this.attachedInputDeviceIds.find(device => {
            // Switches have a master/slave, inputs don't
            return device.protocol.output ? device.protocol.outputId === deviceId : device.protocol.deviceId === deviceId;
        });
    }


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
    }


    /**
     * Listen to all possible protocols
     *
     * @memberof DomustoRfxCom
     */
    _listenAll() {

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
            case 'temperaturehumidity1-1':
                return 'THGN122/123, THGN132, THGR122/228/238/268';
            case 'temperaturehumidity1-2':
                return 'THGR810, THGN800';
            case 'temperaturehumidity1-3':
                return 'RTGR328';
            case 'temperaturehumidity1-4':
                return 'THGR328';
            case 'temperaturehumidity1-5':
                return 'WTGR800';
            case 'temperaturehumidity1-6':
                return 'THGR918/928, THGRN228, THGN500';
            case 'temperaturehumidity1-7':
                return 'TFA TS34C, Cresta';
            case 'temperaturehumidity1-8':
                return 'WT260, WT260H, WT440H, WT450, WT450H';
            case 'temperaturehumidity1-9':
                return 'Viking 02035, 02038 (02035 has no humidity), Proove TSS320, 311501';
            case 'temperaturehumidity1-10':
                return 'Rubicson';
            case 'temperaturehumidity1-11':
                return 'EW109';
            case 'temperaturehumidity1-12':
                return 'Imagintronix/Opus XT300 Soil sensor';
            case 'temperaturehumidity1-13':
                return 'Alecto WS1700 and compatibles';

            // TEMPERATURE & HUMIDITY & BAROMETER
            case 'temperaturehumidity1-b1':
                return 'BTHR918, BTHGN129';
            case 'temperaturehumidity1-b2':
                return 'BTHR918N, BTHR968';

            default:
                return 'Unknown device';

        }

    }

}

export default DomustoRfxCom;