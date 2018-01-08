let prettyjson = require('prettyjson');
const fs = require('fs');

class Util {

    /**
     * Shows a debug message in the console
     *
     * @static
     * @param {any} args
     * @memberof Util
     */
    static debug(...args) {
        Array.prototype.unshift.call(args);
        console.log.apply(this, args);
    }

    static log(...args) {
        Array.prototype.unshift.call(args);
        console.log.apply(this, args);
    }

    static header(...args) {
        console.log('');
        Array.prototype.unshift.call(args, '\x1b[92m>>>');
        Array.prototype.push.call(args, '\x1b[0m');
        console.log.apply(this, args);
    }

    static warning(...args) {
        Array.prototype.unshift.call(args, '\x1b[33m' + args[0]);
        Array.prototype.splice.call(args, 1, 1);
        Array.prototype.push.call(args, '\x1b[0m');
        console.log.apply(this, args);
    }

    static error(...args) {
        Array.prototype.unshift.call(args, '\x1b[31m' + args[0]);
        Array.prototype.splice.call(args, 1, 1);
        Array.prototype.push.call(args, '\x1b[0m');
        console.log.apply(this, args);
    }

    static prettyJson(object: Object) {
        console.log(prettyjson.render(object, {
            keysColor: 'green',
            numberColor: 'yellow',
            stringColor: 'yellow'
        }));
    }

    static getLogDate() {

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

    static logSwitchToFile(data) {
        let logStream = fs.createWriteStream('./logs/switches.log', { 'flags': 'a' });
        // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
        logStream.end(this.getLogDate() + '   ' + data + '\n');
    }

    static logTimersToFile(data) {
        let logStream = fs.createWriteStream('./logs/timers.log', { 'flags': 'a' });
        logStream.end(this.getLogDate() + '   ' + data + '\n');
    }

    static logErrorToFile(data) {
        let logStream = fs.createWriteStream('./logs/errors.log', { 'flags': 'a' });
        logStream.end(this.getLogDate() + '   ' + data + '\n');
    }

    static randomWithinOffset(value, maxOffset) {

        let min = value - maxOffset;
        let max = value + maxOffset;

        return (Math.random() * (min - max) + max).toFixed(1);
    }
}

export default Util;