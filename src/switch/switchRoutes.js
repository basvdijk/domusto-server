'use strict';

module.exports = function (app) {

    var switches = require('./switchController');

    app.route('/switch/on')
        .get(switches.on)

    app.route('/switch/off')
        .get(switches.off)

};