// NODE MODULES
import DomustoSocketIO from './DomustoSocketIO';

/**
 * Initialises the DOMUSTO system
 *
 * @author Bas van Dijk
 * @class Domusto
 */
class DomustoCore {

    constructor(socketIoInstance) {
        DomustoSocketIO.setIO(socketIoInstance);
    }

}

export default DomustoCore;