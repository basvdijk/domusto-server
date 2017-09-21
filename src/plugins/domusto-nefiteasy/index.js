let NefitEasyClient = require('nefit-easy-commands');
let util = require('../../util');
let config = require('../../config');

let DomustoPlugin = require('../../domusto/DomustoPlugin');

/**
 * Nefit Easy plugin for DOMUSTO
 * @author Marthijn van den Heuvel
 * @version 0.0.1
 * 
 * @class DomustoNefitEasy
 * @extends {DomustoPlugin}
 */
class DomustoNefitEasy extends DomustoPlugin {

    /**
     * Creates an instance of DomustoNefitEasy.
     * @param {any} Plugin configuration as defined in the config.js file 
     * @memberof DomustoNefitEasy
     */
    constructor(pluginConfiguration) {
		
        super({
            plugin: 'Nefit Easy',
            author: 'Marthijn van den Heuvel',
            category: 'heating',
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        this.pluginConfiguration = pluginConfiguration;
		
		this._client = NefitEasyClient({
			  serialNumber: pluginConfiguration.settings.serialNumber,
			  accessKey: pluginConfiguration.settings.accessKey,
			  password: pluginConfiguration.settings.password			
			});
			
		this._getStatus();
    }

    _getStatus() {
		// Nefit Easy commands documentation: https://github.com/robertklep/nefit-easy-commands
		
		this._client.connect().then( () => {
		  return [ this._client.status(), this._client.pressure(), this._client.location() ];
		}).spread((status, pressure, location) => {
		    if (this.pluginConfiguration.debug) {
			    util.prettyJson(status);
			    util.prettyJson(pressure);
			    util.prettyJson(location);
		    }
		}).catch((e) => {
		  util.error('Nefit Easy error', e)
		}).finally(() => {
		  this._client.end();
		});
	}
}

module.exports = DomustoNefitEasy;