'use strict';

module.exports = function (app) {

    var core = require('./coreController');

    app.route('/core')
        .get(core.list)

};