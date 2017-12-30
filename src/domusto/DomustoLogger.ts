import config from '../config';
import { EventType } from './interfaces/events/EventType';
import DomustoDevice from './DomustoDevice';

/**
 * Logging handler
 *
 * @author Bas van Dijk
 * @class DomustoLogger
 */
class DomustoLogger {

    domustoLoggerInstances = [];

    constructor() { }

    async init() {
        let plugins = config.loggerPlugins;

        for (let plugin of plugins) {
            await this.importLogPlugin(plugin);
        }

    }

    async importLogPlugin(plugin) {

        let loggerPath = '../plugins/' + plugin + '/' + plugin;
        let loggerNodeModule = await import(loggerPath);

        this.domustoLoggerInstances.push(new loggerNodeModule.default());

    }

    newEvent(eventType: EventType, device: any, data: any) {

        for (let logger of this.domustoLoggerInstances) {
            logger.newEvent(EventType[eventType], device, data);
        }
    }

    getLogDate() {

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