const fs = require('fs');

import config from '../config';

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
        if (config.logging) {
            let logStream = fs.createWriteStream(`./logs/plugin-${pluginName}-activity.log`, { 'flags': 'a' });
            // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
            logStream.end(this.getLogDate() + '   ' + data.join(' ') + '\n');
        }
    }

    /**
     * Logs the specified errordata to the plugin error log file
     *
     * @param {any} pluginName
     * @param {any} data
     * @memberof DomustoLogger
     */
    logPluginErrorToFile(pluginName, ...data) {
        if (config.logging) {
            let logStream = fs.createWriteStream(`./logs/plugin-${pluginName}-error.log`, { 'flags': 'a' });
            // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
            logStream.end(this.getLogDate() + '   ' + data.join(' ') + '\n');
        }
    }
    /**
     * Creates a well formatted date string
     *
     * @private
     * @returns date string
     * @memberof DomustoLogger
     */
    private getLogDate() {

        function pad(n) { return n < 10 ? '0' + n : n; }

        let date = new Date();

        let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        let dayString = days[date.getDay()];

        return '' +
            dayString + ' '
            + date.getFullYear() + '-'
            + pad((date.getMonth() + 1)) + '-'
            + pad(date.getDate()) + ' '
            + pad(date.getHours()) + ':'
            + pad(date.getMinutes()) + ':'
            + pad(date.getSeconds()) + '.'
            + ('00' + date.getMilliseconds()).slice(-3);
    }

}
let DomustoLoggerInstance = new DomustoLogger();
export default DomustoLoggerInstance;