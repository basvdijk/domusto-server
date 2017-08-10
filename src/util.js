let prettyjson = require('prettyjson');

let Util = {};

Util.debug = function () {
    Array.prototype.unshift.call(arguments, '[DOMUSTO] ' + Util.getLogDate());
    console.log.apply(this, arguments)
}

Util.log = function () {
    Array.prototype.unshift.call(arguments, '[DOMUSTO] ' + Util.getLogDate());
    console.log.apply(this, arguments)
}
Util.error = function () {
    Array.prototype.unshift.call(arguments, '\x1b[31m[DOMUSTO] ' + Util.getLogDate());
    console.log.apply(this, arguments)
    console.log('\x1b[0m');
}

Util.prettyJson = function (object) {
    console.log(prettyjson.render(object, {
        keysColor: 'green',
        numberColor: 'yellow',
        stringColor: 'yellow'
    }));
}

Util.getLogDate = function () {
    let date = new Date();
    return '' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds()
}

/**
 * Offsets the given date with the specified offset in cron format
 * @param {string} cronData Date in the cron format e.g "* 10 * * * *" to offset 10 minutes
 */
Util.offsetDate = function (date, cronDateOffset) {

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

    return date;

}

module.exports = Util;