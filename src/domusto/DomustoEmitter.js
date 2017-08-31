const EventEmitter = require('events');

class DomustoEmitter extends EventEmitter {}

module.exports = new DomustoEmitter();