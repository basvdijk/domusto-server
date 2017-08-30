const EventEmitter = require('events');

class DomustoEmitter extends EventEmitter {}

let domustoEmitter = new DomustoEmitter();

module.exports = domustoEmitter;