let prettyjson = require('prettyjson');
const fs = require('fs');

export default {

    debug: function () {
        Array.prototype.unshift.call(arguments);
        console.log.apply(this, arguments)
    },

    log: function () {
        Array.prototype.unshift.call(arguments);
        console.log.apply(this, arguments)
    },

    header: function (...args) {
        console.log('');
        Array.prototype.unshift.call(args, '\x1b[92m>>>');
        Array.prototype.push.call(args, '\x1b[0m');
        console.log.apply(this, args)
    },

    warning: function () {
        Array.prototype.unshift.call(arguments, '\x1b[33m' + arguments[0]);
        Array.prototype.splice.call(arguments, 1, 1);
        Array.prototype.push.call(arguments, '\x1b[0m');
        console.log.apply(this, arguments)
    },

    error: function () {
        Array.prototype.unshift.call(arguments, '\x1b[31m' + arguments[0]);
        Array.prototype.splice.call(arguments, 1, 1);
        Array.prototype.push.call(arguments, '\x1b[0m');
        console.log.apply(this, arguments)
    },

    prettyJson: function (object) {
        console.log(prettyjson.render(object, {
            keysColor: 'green',
            numberColor: 'yellow',
            stringColor: 'yellow'
        }));
    },

    getLogDate: function () {

        return;

        // function pad(n) { return n < 10 ? '0' + n : n }

        // let date = new Date();

        // let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        // let dayString = days[date.getDay()];

        // return '' + 
        // dayString + ' ' 
        // + date.getFullYear() + '-' 
        // + pad((date.getMonth() + 1)) + '-' 
        // + pad(date.getDate()) + ' ' 
        // + pad(date.getHours()) + ':' 
        // + pad(date.getMinutes()) + ':' 
        // + pad(date.getSeconds()) + '.' 
        // + ('00' + date.getMilliseconds()).slice(-3);
    },

    logSwitchToFile: function (data) {
        var logStream = fs.createWriteStream('../logs/switches.log', { 'flags': 'a' });
        // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
        logStream.end(this.getLogDate() + '   ' + data + '\n');
    },

    logTimersToFile: function (data) {
        var logStream = fs.createWriteStream('../logs/timers.log', { 'flags': 'a' });
        logStream.end(this.getLogDate() + '   ' + data + '\n');
    },

    logErrorToFile: function (data) {
        var logStream = fs.createWriteStream('../logs/errors.log', { 'flags': 'a' });
        logStream.end(this.getLogDate() + '   ' + data + '\n');
    },

    /**
     * Offsets the given date with the specified offset in cron format
     * @param {string} cronData Date in the cron format e.g "* 10 * * * *" to offset 10 minutes
     */
    offsetDate: function (date, cronDateOffset) {

        if (cronDateOffset) {

            let cronDateSplitted = cronDateOffset.split(' ');

            if (cronDateSplitted.length !== 6) {
                console.error('invalid cron formatted date pattern');
            }

            let secondsOffset = parseInt(cronDateSplitted[0]) || 0;
            date.setSeconds(date.getSeconds() + secondsOffset);

            let minuteOffset = parseInt(cronDateSplitted[1]) || 0;
            date.setMinutes(date.getMinutes() + minuteOffset);

            let hourOffset = parseInt(cronDateSplitted[2]) || 0;
            date.setHours(date.getHours() + hourOffset);

            let dayOffset = parseInt(cronDateSplitted[3]) || 0;
            date.setDate(date.getDate() + dayOffset);

            let monthOffset = parseInt(cronDateSplitted[4]) || 0;
            date.setMonth(date.getMonth() + monthOffset);

            let yearOffset = parseInt(cronDateSplitted[5]) || 0;
            date.setFullYear(date.getFullYear() + yearOffset);
        }

        return date;

    }

}

// export default Util;