const fs = require('fs');

import config from '../config';
import Util from '../util';

/**
 * DOMUSTO sytem logging
 *
 * @author Bas van Dijk
 * @class DomustoLogger
 */
class DomustoLogger {

    /**
     * Logs the specified data to the plugin activity log file
     *
     * @param {any} pluginName
     * @param {any} data
     * @memberof DomustoLogger
     */
    logPluginToFile(pluginName, ...data) {
        this.logToFile('activity', pluginName, data);
    }

    /**
     * Logs the specified errordata to the plugin error log file
     *
     * @param {any} pluginName
     * @param {any} data
     * @memberof DomustoLogger
     */
    logPluginErrorToFile(pluginName, ...data) {
        this.logToFile('error', pluginName, data);
    }

    /**
     * Logs given data to log file op type 'logType'
     *
     * @private
     * @param {any} logType Type of log e.g. activity | error
     * @param {any} pluginName Name of the plugin (will be slugified)
     * @param {any} data Data to write
     * @memberof DomustoLogger
     */
    private logToFile(logType, pluginName, ...data) {

        pluginName = Util.slugify(pluginName);

        if (config.logging) {
            let logStream = fs.createWriteStream(`./logs/plugin-${pluginName}-${logType}.log`, { 'flags': 'a' });
            // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
            logStream.end(Util.getLogDate() + '   ' + data.join(' ') + '\n');
        }
    }

}
let DomustoLoggerInstance = new DomustoLogger();
export default DomustoLoggerInstance;