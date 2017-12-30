const fs = require('fs');
import DomustoLogger from '../../domusto/DomustoLogger';

/**
 * SocketIO broadcast handler
 *
 * @author Bas van Dijk
 * @class DomustoLogger
 */
class DomustoLoggerTxt {

    constructor() {}

    /**
     * Logs device event
     *
     * @param {any} device input/output device
     * @param {any} data data to log;
     * @memberof DomustoLogger
     */
    logOutput(device, data) {

        console.log('LOGOUTPUT', device, data);

        // let logStream = fs.createWriteStream('./logs/output.log', { 'flags': 'a' });
        // logStream.end(DomustoLogger.getLogDate() + '   ' + data + '\n');
    }

    // logInput(device, data) {
    //     let logStream = fs.createWriteStream('./logs/input.log', { 'flags': 'a' });
    //     logStream.end(DomustoLogger.getLogDate() + '   ' + data + '\n');
    // }

    // logOutput(device, data) {


    //     static logTimersToFile(data) {
    //         let logStream = fs.createWriteStream('./logs/timers.log', { 'flags': 'a' });
    //         logStream.end(this.getLogDate() + '   ' + data + '\n');
    //     }

    //     static logErrorToFile(data) {
    //         let logStream = fs.createWriteStream('./logs/errors.log', { 'flags': 'a' });
    //         logStream.end(this.getLogDate() + '   ' + data + '\n');
    //     }
    // }

    // private logToFile(file, device, data) {
    //     let logStream = fs.createWriteStream('./logs/output.log', { 'flags': 'a' });
    //     logStream.end(this.getLogDate() + '   ' + data + '\n');
    // }

}

export default DomustoLoggerTxt;