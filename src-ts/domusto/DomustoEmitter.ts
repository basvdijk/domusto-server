import * as EventEmitter from 'events';

/**
 * Custom event emitter for DOMUSTO events
 *
 * @author Bas van Dijk
 * @class DomustoEmitter
 * @extends {EventEmitter}
 */
class DomustoEmitter extends EventEmitter {}
export default new DomustoEmitter();