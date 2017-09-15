'use strict';

module.exports = function (app) {

    var input = require('./inputController');

    app.route('/input')
        .get(input.list)

};