let DomustoSocketIO = require('./DomustoSocketIO');

/**
 * Initialises the DOMUSTO system
 *
 * @author Bas van Dijk 
 * @class Domusto
 */
class Domusto {
    constructor(io) {
        DomustoSocketIO.setIO(io);
    }
}

module.exports = Domusto;