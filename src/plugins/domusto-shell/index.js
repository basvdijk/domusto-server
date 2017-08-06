let exec = require('child_process').exec;
let util = require('../../util');
let config = require('../../config');

let DomustoPlugin = require('../../domusto/domusto-plugin');

/**
 * Shell plugin for DOMUSTO
 * @author Bas van Dijk
 * @version 0.0.1
 * 
 * @class DomustoShell
 * @extends {DomustoPlugin}
 */
class DomustoShell extends DomustoPlugin {

    /**
     * Creates an instance of DomustoShell.
     * @param {any} Plugin configuration as defined in the config.js file 
     * @memberof DomustoShell
     */
    constructor(pluginConfiguration) {

        super({
            plugin: 'Shell executer',
            author: 'Bas van Dijk',
            category: 'system',
            version: '0.0.1',
            website: 'http://domusto.com'
        });

    }

    outputCommand(device, command, onSucces) {

        let invertedState = device.state === 'off' ? 'on' : 'off';    
        let shellCommand = device.protocol.actions[invertedState];
       
        exec(shellCommand, (error, stdout, stderr) => {
            util.debug('error', error);
            util.debug('stdout', stdout);
            util.debug('stderr', stderr);
        });

        onSucces({ state: device.state === 'off' ? 'on' : 'off' });

    }

    toString() {
        return super.toString();
    }
}

module.exports = DomustoShell;