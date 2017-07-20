'use strict';

module.exports = function (app) {

    var switches = require('./switchController');

    app.route('/switch/on/:deviceId')
        .get(switches.on)

    app.route('/switch/off/:deviceId')
        .get(switches.off)

};