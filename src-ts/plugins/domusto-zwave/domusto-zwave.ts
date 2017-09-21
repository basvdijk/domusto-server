import util from '../../util';
import config from '../../config';

// DOMUSTO
import DomustoPlugin from '../../domusto/DomustoPlugin';

// INTERFACES
import { PluginCategories } from '../../domusto/interfaces/plugin/PluginMetaData';
import { PluginConfiguration } from '../../domusto/interfaces/plugin/PluginConfiguration';

// PLUGIN SPECIFIC
import * as ZWave from 'openzwave-shared';

/**
 * Z-wave plugin for DOMUSTO
 * @author Bas van Dijk
 * @version 0.0.1
 *
 * @class DomustoZWave
 * @extends {DomustoPlugin}
 */
class DomustoZWave extends DomustoPlugin {

    private attachedInputDeviceIds = [];
    private nodes = {};
    private zwave;

    /**
     * Creates an instance of Domustothis.zwave.
     * @param {any} Plugin configuration as defined in the config.js file
     * @memberof DomustoZWave
     */
    constructor(pluginConfiguration: PluginConfiguration) {

        super({
            plugin: 'Z-wave transceiver',
            author: 'Bas van Dijk',
            category: PluginCategories.radio,
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        this.pluginConfiguration = pluginConfiguration;


        this.zwave = new ZWave({
            Logging: false,     // disable file logging (OZWLog.txt)
            ConsoleOutput: pluginConfiguration.settings.port // enable console logging
        });

        try {

            this.zwave.on('driver ready', (homeid) => {
                console.log('scanning homeid=0x%s...', homeid.toString(16));
            });

            this.zwave.on('driver failed', () => {
                console.log('failed to start driver');
                this.zwave.disconnect();
                process.exit();
            });

            this.zwave.on('node added', (nodeid) => {

                console.log('NODE ADDED NODEID:', nodeid);

                this.nodes['node-' + nodeid] = {
                    manufacturer: '',
                    manufacturerid: '',
                    product: '',
                    producttype: '',
                    productid: '',
                    type: '',
                    name: '',
                    loc: '',
                    classes: {},
                    ready: false,
                };
            });

            this.zwave.on('value added', (nodeid, comclass, valueId) => {
                if (!this.nodes['node-' + nodeid]['classes'][comclass])
                    this.nodes['node-' + nodeid]['classes'][comclass] = {};
                this.nodes['node-' + nodeid]['classes'][comclass][valueId.index] = valueId;
            });

            this.zwave.on('value changed', (nodeid, comclass, value) => {
                if (this.nodes['node-' + nodeid]['ready']) {
                    console.log('node%d: changed: %d:%s:%s->%s', nodeid, comclass,
                        value['label'],
                        this.nodes['node-' + nodeid]['classes'][comclass][value.index]['value'],
                        value['value']);
                }
                this.nodes['node-' + nodeid]['classes'][comclass][value.index] = value;
            });

            this.zwave.on('value removed', (nodeid, comclass, index) => {
                if (this.nodes['node-' + nodeid]['classes'][comclass] &&
                    this.nodes['node-' + nodeid]['classes'][comclass][index])
                    delete this.nodes['node-' + nodeid]['classes'][comclass][index];
            });

            this.zwave.on('node ready', (nodeid, nodeinfo) => {
                this.nodes['node-' + nodeid]['manufacturer'] = nodeinfo.manufacturer;
                this.nodes['node-' + nodeid]['manufacturerid'] = nodeinfo.manufacturerid;
                this.nodes['node-' + nodeid]['product'] = nodeinfo.product;
                this.nodes['node-' + nodeid]['producttype'] = nodeinfo.producttype;
                this.nodes['node-' + nodeid]['productid'] = nodeinfo.productid;
                this.nodes['node-' + nodeid]['type'] = nodeinfo.type;
                this.nodes['node-' + nodeid]['name'] = nodeinfo.name;
                this.nodes['node-' + nodeid]['loc'] = nodeinfo.loc;
                this.nodes['node-' + nodeid]['ready'] = true;
                console.log('node%d: %s, %s', nodeid,
                    nodeinfo.manufacturer ? nodeinfo.manufacturer
                        : 'id=' + nodeinfo.manufacturerid,
                    nodeinfo.product ? nodeinfo.product
                        : 'product=' + nodeinfo.productid +
                        ', type=' + nodeinfo.producttype);
                console.log('node%d: name="%s", type="%s", location="%s"', nodeid,
                    nodeinfo.name,
                    nodeinfo.type,
                    nodeinfo.loc);
                for (let comclass in this.nodes['node-' + nodeid]['classes']) {
                    console.log('node%d: class %d', nodeid, comclass);
                    switch (comclass) {
                        case '0x25': // COMMAND_CLASS_SWITCH_BINARY
                        case '0x26': // COMMAND_CLASS_SWITCH_MULTILEVEL
                            let valueIds = this.nodes['node-' + nodeid]['classes'][comclass];
                            for (let valueId in valueIds) {
                                this.zwave.enablePoll(valueId);
                                break;
                            }
                            // console.log('node%d:   %s=%s', nodeid, values[idx]['label'], values[idx]['value']);
                    }
                }
            });

            this.zwave.on('notification', (nodeid, notif) => {
                switch (notif) {
                    case 0:
                        console.log('node%d: message complete', nodeid);
                        break;
                    case 1:
                        console.log('node%d: timeout', nodeid);
                        break;
                    case 2:
                        console.log('node%d: nop', nodeid);
                        break;
                    case 3:
                        console.log('node%d: node awake', nodeid);
                        break;
                    case 4:
                        console.log('node%d: node sleep', nodeid);
                        break;
                    case 5:
                        console.log('node%d: node dead', nodeid);
                        break;
                    case 6:
                        console.log('node%d: node alive', nodeid);
                        break;
                }
            });

            this.zwave.on('scan complete', () => {

                console.log('Scan complete');
                // set dimmer node 5 to 50%
                // this.zwave.setValue(5,38,1,0,50);
                // this.zwave.setValue( {node_id:5, class_id: 38, instance:1, index:0}, 50);

                if (pluginConfiguration.settings.pairingMode) {
                    util.log('Paring mode active');
                    this._enablePairingMode();
                }

            });

            this.zwave.on('controller command', (r, s) => {
                console.log('controller commmand feedback: r=%d, s=%d', r, s);
            });


            this.hardwareInstance = this.zwave;

            this.zwave.connect(pluginConfiguration.settings.port);

        } catch (error) {
            util.log('Initialisation of RfxCom plugin failed', error);
        }

    }

    _enablePairingMode() {
        // Add a new device to the ZWave controller
        if (this.zwave.hasOwnProperty('beginControllerCommand')) {
            // using legacy mode (OpenZWave version < 1.3) - no security
            this.zwave.beginControllerCommand('AddDevice', true);
        } else {
            // using new security API
            // set this to 'true' for secure devices eg. door locks
            this.zwave.addNode(false);
        }
    }

}

export default DomustoZWave;