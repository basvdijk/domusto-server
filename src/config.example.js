module.exports = {
    debug: true,

    // LOCATION OF SERVER
    // used for weather information
    location: {
        latitude: '51.490053',
        longitude: '3.974129'
    },

    // HARDWARE
    // definitions of hardware devices e.g. receivers and serial converters
    hardware: [
        {
            type: 'RFXCOM',
            port: '/dev/ttyUSB-RFX433',
            enabledProtocols: ['AC', 'BYRONSX', 'LIGHTING4', 'OREGON', 'RUBICSON', 'X10']     // [string]  enabled protocols AC | ARC | ATI | BLINDST14 | BLYSS | BYRONSX | FINEOFFSET | FS20 | HIDEKI | HOMEEASY | LACROSSE | LIGHTING4 | LIGHTWAVERF | MEIANTECH | MERTIK | OREGON | PROGUARD | RFU6 | ROLLERTROL | RSL | RUBICSON | VISONIC | X10
        },
        {
            type: 'P1',
            port: '/dev/ttyUSB-P1'
        }
    ],

    // DEVICES
    // devices connected to the defined hardware
    devices: [

        // COCO / KAKU DEVICE
        {
            id: 'KAKU1',                        // string                          DOMUSTO wide unique device identifier (no spaces or special characers)
            enabled: true,                      // boolean                         enables or disables a device
            role: 'output',                     // input | output                  specify the role of the device
            name: 'modem',                      // string                          name of the device which is used in the frontend 
            type: 'switch',                     // switch | temperature | power    kind of device
            subtype: 'on/off',                  // on/off | temperature-humidity   subtype of switch
            protocol: {
                hardwareId: 'RFXCOM',           // string   id of the hardware device
                type: 'Lighting2',              // string   protocol type
                subType: 'AC',                  // string   protocol subtype 

                // OUTPUTS
                // Code which is broadcasted when the button in DOMUSTO is pressed
                outputId: '0x0E24B7E/10',          // hex id / unit code - id and unit code separated with a slash /, is broadcasted when button in DOMUSTO is pressed

                // ALIAS INPUTS
                // ids where the button needs to listen to. Often hardware buttons which also switch the state of the device
                // or for example a remote which is not bound via hardware, but needs to control the device
                inputIds: [
                    '0x010CE4C6/2',
                    '0x010CE4C6/1'
                ]
            },

            // TIMERS
            // timers which control the device based on time or sun      
            timers: [
                {
                    enabled: false,         // boolean         enables or disables a timer
                    state: 'on',            // on | off        state to which the timer switched on timer hit
                    type: 'time',           // time | sun      sets the type of timer
                    time: '10 * * * * *'    // cron notation   define the timer in the cron format seconds - minute - hours - day - month - year. Use * as wildcard
                },
                {
                    enabled: false,
                    state: 'off',
                    type: 'time',
                    time: '30 * * * * *'
                },
                {
                    enabled: true,
                    type: 'sun',
                    state: 'on',
                    condition: 'sunset',     // sunrise | sunset and more see https://www.npmjs.com/package/suncalc for all options
                    offset: '* * -1 * * *',  // One hour before sunset
                },
                {
                    enabled: true,
                    state: 'off',
                    type: 'sun',
                    condition: 'sunrise',
                    offset: '* * 2 * * *',   // Two hours after sunrise
                }
            ]
        },

        // TEMPERATURE SENSOR
        {
            id: 'TEMP1',
            enabled: true,
            role: 'input',
            name: 'Studeerkamer',
            type: 'temperature',
            subType: 'temperature-humidity',
            protocol: {
                hardwareId: 'RFXCOM',
                type: 'th',
                subType: '13',
                id: '0x7103'
            }
        },
        {
            id: 'POWER1',
            enabled: true,
            role: 'input',
            name: 'Slimme meter',
            type: 'power',
            protocol: {
                hardwareId: 'P1',
                id: 'POWER1',
                type: 'power-received'          // power-received | power-delivered    set the type of device
            }
        },
        {
            id: 'POWER2',
            enabled: true,
            role: 'input',
            name: 'Slimme meter',
            type: 'power',
            protocol: {
                hardwareId: 'P1',
                id: 'POWER2',
                type: 'power-delivered'
            }
        }
    ]
}