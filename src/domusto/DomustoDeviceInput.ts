import DomustoDevice from './DomustoDevice';

/**
 * Model class for an input device
 *
 * @author Bas van Dijk
 * @class DomustoInput
 * @extends {DomustoDevice}
 */
class DomustoDeviceInput extends DomustoDevice {

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
                };
                this._lastUpdated = new Date();
                break;
            }
            case 'power': {

                this._data = {

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

                };
                this._lastUpdated = new Date();
                break;
            }
        }
    }

}

export default DomustoDeviceInput;