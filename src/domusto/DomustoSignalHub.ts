import { Domusto } from './DomustoTypes';

let Rx = require('rxjs/Rx');
let Observable = require('rxjs/Observable').Observable;

/**
 * Hub to manage all signals
 *
 * @author Bas van Dijk
 * @class DomustoSignalHub
 */
class DomustoSignalHub {

    subject;

    constructor() {
        this.subject = new Rx.Subject();
    }

    subscribe() {
        return this.subject;
    }
    // subscribe(key, action) {
    //     return this.subject
    //         .filter(event => event.key === key)
    //         .map(event => event.value)
    //         .subscribe(action);
    // }

    broadcastSignal(signal: Domusto.Signal) {
        this.subject.next(signal);
    }

}

let DomustoSignalHubInstance = new DomustoSignalHub();
export default DomustoSignalHubInstance;