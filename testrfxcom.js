var rfxcom = require('rfxcom');

var rfxtrx = new rfxcom.RfxCom("/dev/ttyUSB-RFX433", { debug: true });

rfxtrx.on("th13", function (evt) {
    console.log('th13', evt);    
});

rfxtrx.on("temperature1", function (evt) {
    console.log('temperature1', evt);    
});

rfxtrx.on("temperaturehumidity1", function (evt) {
    console.log('temperaturehumidity1', evt);    
});

rfxtrx.initialise(function () {
    console.log("Device initialised");
});