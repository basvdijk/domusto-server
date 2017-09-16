import util from '../../util';
import config from '../../config';
import DomustoPlugin from '../../domusto/DomustoPlugin';

import * as P1Reader from 'p1-reader';

/**
 * P1 plugin for DOMUSTO
 * @author Bas van Dijk
 * @version 0.0.1
 *
 * @class DomustoP1
 * @extends {DomustoPlugin}
 */
class DomustoP1 extends DomustoPlugin {

    /**
     * Creates an instance of DomustoP1.
     * @param {any} Plugin configuration as defined in the config.js file
     * @memberof DomustoP1
     */
    constructor(pluginConfiguration) {

        super({
            plugin: 'P1 smartmeter for Landys Gyr E350',
            author: 'Bas van Dijk',
            category: 'utility',
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        try {
            let p1Reader = new P1Reader({
                serialPort: pluginConfiguration.settings.port,
                emulator: pluginConfiguration.dummyData,
            });
            this.hardwareInstance = p1Reader;
            this.hardwareInstance.on('reading', this._updatePowerData.bind(this));
        } catch (error) {
            util.log('Initialisation of P1 plugin failed', error);
        }

    }

    /**
     *
     * Trigged when the P1 device broadcasts new data
     * Explanation of the Dutch Smart Meter Requirements (DSRM 4.2.2) standard data layout found on:
     * http://www.netbeheernederland.nl/_upload/Files/Slimme_meter_15_32ffe3cc38.pdf
     *
     * @param {any} data Data broadcasted by the device
     * @memberof DomustoP1
     */
    _updatePowerData(data) {

        // util.prettyJson(data);

        this.onNewInputData({
            pluginId: this._pluginConfiguration.type,
            data: {
                electricity: {
                    received: {
                        tariff1: {
                            value: data.electricity.received.tariff1.reading,    // Amount of electricity received for tariff1 (LOW)
                            unit: data.electricity.received.tariff1.unit         // Unit of the electricity reading e.g. kWh
                        },
                        tariff2: {
                            value: data.electricity.received.tariff2.reading,    // Amount of electricity received for tariff2 (NORMAL / HIGH)
                            unit: data.electricity.received.tariff2.unit         // Unit of the electricity reading e.g. kWh
                        },
                        actual: {
                            value: data.electricity.received.actual.reading,     // Amount of electricity currently consumed
                            unit: data.electricity.received.actual.unit          // Unit of the electricity reading e.g. kWh
                        }
                    },
                    delivered: {
                        tariff1: {
                            value: data.electricity.delivered.tariff1.reading,    // Amount of electricity delivered for tariff1 (LOW)
                            unit: data.electricity.delivered.tariff1.unit         // Unit of the electricity reading e.g. kWh
                        },
                        tariff2: {
                            value: data.electricity.delivered.tariff2.reading,    // Amount of electricity delivered for tariff2 (NORMAL / HIGH)
                            unit: data.electricity.delivered.tariff2.unit         // Unit of the electricity reading e.g. kWh
                        },
                        actual: {
                            value: data.electricity.delivered.actual.reading,     // Amount of electricity currently consumed
                            unit: data.electricity.delivered.actual.unit          // Unit of the electricity reading e.g. kWh
                        }
                    }
                }
            }
        });


    }

    toString() {
        return super.toString();
    }
}

export default DomustoP1;