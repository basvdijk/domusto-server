import util from '../../util';
import config from '../../config';

// DOMUSTO
import DomustoPlugin from '../../domusto/DomustoPlugin';
import DomustoEmitter from '../../domusto/DomustoEmitter';

// INTERFACES
import { PluginCategories } from '../../domusto/interfaces/plugin/PluginMetaData';
import { PluginConfiguration } from '../../domusto/interfaces/plugin/PluginConfiguration';

// PLUGIN SPECIFIC
import * as childProcess from 'child_process';

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
    constructor(pluginConfiguration: PluginConfiguration) {

        super({
            plugin: 'Shell executer',
            author: 'Bas van Dijk',
            category: PluginCategories.system,
            version: '0.0.1',
            website: 'http://domusto.com'
        });

    }

    runCommand(shellCommand) {

        if (!this._busy) {

            this._busy = true;

            childProcess.exec(shellCommand, (error, stdout, stderr) => {
                util.debug('error', error);
                util.debug('stdout', stdout);
                util.debug('stderr', stderr);

                this._busy = false;

            });

        }

    }

    outputCommand(device, command, onSucces) {

        if (!this._busy) {

            let invertedState = device.state === 'off' ? 'on' : 'off';
            let shellCommand = device.protocol.actions[invertedState];

            this._busy = true;

            if (shellCommand) {

                childProcess.exec(shellCommand, (error, stdout, stderr) => {
                    util.debug('error', error);
                    util.debug('stdout', stdout);
                    util.debug('stderr', stderr);

                    this._busy = false;

                    if (onSucces) {
                        onSucces({ state: invertedState });
                    }
                });

            } else {
                util.error('No action defined for', device.name, device.state === 'off' ? 'on' : 'off');
            }
        }

    }

    toString() {
        return super.toString();
    }
}

export default DomustoShell;