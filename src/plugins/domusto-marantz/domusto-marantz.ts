import util from '../../util';
import config from '../../config';

// DOMUSTO
import DomustoPlugin from '../../domusto/DomustoPlugin';
import DomustoEmitter from '../../domusto/DomustoEmitter';

// INTERFACES
import { PluginCategories } from '../../domusto/interfaces/plugin/PluginMetaData';
import { PluginConfiguration } from '../../domusto/interfaces/plugin/PluginConfiguration';

// PLUGIN SPECIFIC
let AVReceiver = require('marantz-avr');

/**
 * GPIO plugin for DOMUSTO
 * @author Bas van Dijk
 * @version 0.0.1
 *
 * @class DomustoMarantz
 * @extends {DomustoPlugin}
 */
class DomustoMarantz extends DomustoPlugin {

    /**
     * Creates an instance of DomustoMarantz.
     * @param {any} Plugin configuration as defined in the config.js file
     * @memberof DomustoMarantz
     */
    constructor(pluginConfiguration: PluginConfiguration) {

        super({
            plugin: 'Marantz-avr remote',
            author: 'Bas van Dijk',
            category: PluginCategories.audio,
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        this.pluginConfiguration = pluginConfiguration;

        let receiver = new AVReceiver(pluginConfiguration.settings.ip);
        this.hardwareInstance = receiver;

        receiver.getState().then(
            res => console.log(res),
            error => console.log(error)
        );

        // this.refreshReceiverStatus();


    }

    // refreshReceiverStatus() {

    //     this.onNewInputData({
    //         pluginId: this._pluginConfiguration.type,
    //         deviceId: 'mute',
    //         command: 'on'
    //     });

    // }

    outputCommand(device, command, onSucces) {

        console.log('Marantz output', command);

        switch (device.protocol.outputId) {

            case 'power':

                this.hardwareInstance.setPowerState(command === 'on').then(res => {
                    onSucces({ state: command === 'on' ? 'on' : 'off' });
                }, error => console.log(error));
                break;

            case 'source':

                this.hardwareInstance.setInputSource(device.protocol.subType).then(res => {
                    // onSucces();
                }, error => console.log(error));
                break;

            case 'mute':

                this.hardwareInstance.setMuteState(command === 'on').then(res => {
                    onSucces({ state: command === 'on' ? 'on' : 'off' });
                }, error => console.log(error));
                break;

            case 'volume':

                switch (command) {
                    case 'off':
                        this.hardwareInstance.volumeUp().then(res => {
                            onSucces({ state: command === 'on' ? 'on' : 'off' });
                        }, error => console.log(error));
                        break;
                    case 'on':
                        this.hardwareInstance.volumeDown().then(res => {
                            onSucces({ state: command === 'on' ? 'on' : 'off' });
                        }, error => console.log(error));
                        break;
                }

                break;

        }

    }

    toString() {
        return super.toString();
    }
}

export default DomustoMarantz;