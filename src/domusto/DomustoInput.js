let DomustoDevice = require('./DomustoDevice');

/**
 * Model class for an input device
 *
 * @author Bas van Dijk 
 * @class DomustoInput
 * @extends {DomustoDevice}
 */
class DomustoInput extends DomustoDevice {

    constructor(input) {

        super(input);

        switch (input.type) {
            case 'temperature': {

                this._data = {
                    deviceTypeString: null,
                    temperature: null,
                    humidity: null,
                    humidityStatus: null,
                    barometer: null,
                    batteryLevel: null,
                    rssi: null,
                }
                this._lastUpdated = new Date()
                break;
            }
            case 'power': {

                this._data = {
                    electricity: {
                        received: {
                            tariff1: {
                                value: null,
                                unit: 'kW'
                            },
                            tariff2: {
                                value: null,
                                unit: 'kWh'
                            },
                            actual: {
                                value: null,
                                unit: 'kWh'
                            }
                        }
                    }
                }
                this._lastUpdated = new Date()
                break;
            }
        }
    }

}

module.exports = DomustoInput;