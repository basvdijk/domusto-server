const fs = require('fs');
import DomustoLogger from '../../domusto/DomustoLogger';
import DomustoDevice from '../../domusto/DomustoDevice';
import EventType from '../../domusto/interfaces/events/EventType';

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
     * @memberof DomustoLoggerTxt
     */
    log(eventType: EventType, device: any, data: any) {

        console.log('LOGOUTPUT', eventType, device, data);

        let logStream = fs.createWriteStream(`./logs/${eventType}.log`, { 'flags': 'a' });
        logStream.end(DomustoLogger.getLogDate() + '   ' + device.name + ' (' + device.id + ') - ' + data + '\n');
    }

}

export default DomustoLoggerTxt;