module.exports = {
    debug: true,

    // SERVER CONFIGURATION
    // Don't change the port to something other than 3000
    server: {
        ip: '192.168.178.72',
        port: 3000
    },

    // LOCATION OF SERVER
    // used for weather information
    location: {
        latitude: '51.490053',
        longitude: '3.974129'
    },

    // PLUGINS
    // configuration of the DOMUSTO plugins used
    plugins: [
        {
            enabled: true,
            debug: false,
            type: 'RFXCOM',
            settings: {
                port: '/dev/ttyUSB-RFX433',         // [string]  enabled protocols AC | ARC | ATI | BLINDST14 | BLYSS | BYRONSX | FINEOFFSET | FS20 | HIDEKI | HOMEEASY | LACROSSE | LIGHTING4 | LIGHTWAVERF | MEIANTECH | MERTIK | OREGON | PROGUARD | RFU6 | ROLLERTROL | RSL | RUBICSON | VISONIC | X10
                listenOnly: false,                  // set true to see all received data in the terminal
                enabledProtocols: [
                    'AC',       // KaKu
                    'BYRONSX',  // Doorbell
                    'RUBICSON'  // Temp + Humid
                ]
            }
        },
        {
            enabled: true,
            type: 'P1',
            settings: {
                port: '/dev/ttyUSB-P1'
            }
        },
        {
            enabled: true,
            type: 'SHELL',
            triggers: [

                // Play doorbell.wav when CHIME1 broadcasts it is being triggered
                {
                    listenToEvent: {
                        deviceId: 'CHIME1',
                        events: ['trigger'],
                    },
                    execute: {
                        event: 'runCommand',
                        parameters: [
                            'aplay assets/audio/doorbell.wav'
                        ]
                    }
                },
            ],
        },
        {
            enabled: true,
            type: 'PUSHBULLET',
            settings: {
                apiKeys: [
                    'SJDFKSDJFLSDJLSKFJIWI92340283020',
                ],
            },
            triggers: [
                {
                    listenToEvent: {
                        deviceId: 'CHIME1',
                        events: ['trigger'],
                    },
                    execute: {
                        event: 'sendMessageToAll',
                        parameters: [
                            'Doorbell',    // Title
                            'Ding Dong!'   // Message
                        ]
                    }
                },
            ],
        },
        {
            enabled: true,
            debug: true,
            type: 'ZWAVE',
            settings: {
                port: '/dev/ttyACM0',
                pairingMode: false
            }
        },
		{
            enabled: false,
            debug: true,
            type: 'NEFITEASY',
            settings: {
                serialNumber: 'SERIALNUMBER',
			    accessKey: 'ACCESSKEY',
			    password: 'PASSWORD'	
            }
        },
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
            subType: 'on/off',                  // on/off | up/down | momentary | temperature-humidity   subType of switch
            protocol: {
                pluginId: 'RFXCOM',           // string   id of the hardware device
                type: 'Lighting2',              // string   protocol type
                subType: 'AC',                  // string   protocol subType 

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

                // Switch on every 10 seconds
                {
                    enabled: false,         // boolean         enables or disables a timer
                    state: 'on',            // on | off        state to which the timer switched on timer hit
                    type: 'time',           // time | sun      sets the type of timer
                    time: '10 * * * * *'    // cron notation   define the timer in the cron format seconds - minute - hours - day - month - year. Use * as wildcard
                },

                // Switch off every day at 22:00h
                {
                    enabled: false,
                    state: 'off',
                    type: 'time',
                    time: '0 0 22 * * *'     // (make sure you don't use * * 22 * * * instead. Otherwise it will be triggered every second)
                },

                // Switch on every day 1h _before_ sunset
                {
                    enabled: true,
                    type: 'sun',
                    state: 'on',
                    condition: 'sunset',     // sunrise | sunset and more see https://www.npmjs.com/package/suncalc for all options
                    offset: '* * -1 * * *',  // One hour before sunset
                },

                // Switch off 2h after sunrise
                {
                    enabled: true,
                    state: 'off',
                    type: 'sun',
                    condition: 'sunrise',
                    offset: '* * 2 * * *',
                },

                // Switch on every day on sunset
                {
                    enabled: true,
                    type: 'sun',
                    condition: 'sunset',
                    state: 'on'
                },

                // Switch off every Sunday till Thursday at 23:00h
                {
                    enabled: true,
                    type: 'time',
                    time: '0 0 23 * * SUN-THU',
                    state: 'off'
                },

                // Switch off every Saturday and Sunday at 0:30h
                {
                    enabled: true,
                    type: 'time',
                    time: '0 30 0 * * SAT-SUN',
                    state: 'off'
                },

                // Execute off 5 seconds after on
                {
                    enabled: true,
                    type: 'event',
                    offset: '5 * * * * *',
                    event: 'on',
                    state: 'off'
                },
            ]
        },

        // BUTTON WHICH EXECUTES SHELL COMMANDS
        {
            id: 'SHELL1',
            enabled: true,
            role: 'output',
            name: 'shell test',
            type: 'switch',
            subType: 'on/off',
            protocol: {
                pluginId: 'SHELL',
                id: 'SHELL1',
                actions: {
                    on: 'ls -l',
                    off: 'pwd'
                }
            }
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
                pluginId: 'RFXCOM',
                type: 'th',
                subType: '13',
                id: '0x7103'
            }
        },

        // ELECTRICITY METER
        {
            id: 'POWER1',
            enabled: true,
            role: 'input',
            name: 'Power received',
            type: 'power',
            protocol: {
                pluginId: 'P1',
                id: 'POWER1',
                type: 'received'          // received | delivered    set the type of device
            }
        },
        {
            id: 'POWER2',
            enabled: true,
            role: 'input',
            name: 'Power delivered',
            type: 'power',
            protocol: {
                pluginId: 'P1',
                id: 'POWER2',
                type: 'delivered'
            }
        }
    ]
}