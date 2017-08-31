const EventEmitter = require('events');

/**
 * Custom event emitter for DOMUSTO events
 * 
 * @author Bas van Dijk 
 * @class DomustoEmitter
 * @extends {EventEmitter}
 */
class DomustoEmitter extends EventEmitter {}
module.exports = new DomustoEmitter();