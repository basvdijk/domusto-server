let exec = require('child_process').exec;
let util = require('../../util');
let config = require('../../config');

let DomustoPlugin = require('../../domusto/domusto-plugin');

let PushBullet = require('pushbullet');

/**
 * Shell plugin for DOMUSTO
 * @author Bas van Dijk
 * @version 0.0.1
 * 
 * @class DomustoPushBullet
 * @extends {DomustoPlugin}
 */
class DomustoPushBullet extends DomustoPlugin {

    /**
     * Creates an instance of DomustoPushBullet.
     * @param {any} Plugin configuration as defined in the config.js file 
     * @memberof DomustoPushBullet
     */
    constructor(pluginConfiguration) {

        super({
            plugin: 'Pushbullet executer',
            author: 'Bas van Dijk',
            category: 'system',
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        this.pushBulletInstances = [];

        pluginConfiguration.settings.apiKeys.forEach(key => {
            this.pushBulletInstances.push(new PushBullet(key));
        });

    }

    sendMessageToAll(title, message) {

        this.pushBulletInstances.forEach(instance => {
            instance.note('', title, message);
        });

    }
}

module.exports = DomustoPushBullet;