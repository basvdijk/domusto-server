export default {
    debug: true,

    server: {
        ip: '192.168.178.72',
        port: 3000
    },

    // LOCATION OF SERVER
    // used for weather information
    location: {
        latitude: '52.490053',
        longitude: '4.974129'
    },

    // PLUGINS
    // configuration of the DOMUSTO plugins used
    plugins: [
        {
            enabled: false,
            debug: true,
            type: 'RFXCOM',
            settings: {
                port: '/dev/ttyUSB-RFX433',
                listenOnly: false,
                enabledProtocols: [
                    'AC',       // KaKu
                    'BYRONSX',  // Doorbell
                    'RUBICSON'  // Temp + Humid
                ]
            }
        },
        {
            enabled: true,
            dummyData: false,
            type: 'P1',
            settings: {
                port: '/dev/ttyUSB-P1'
            }
        },
        {
            enabled: false,
            type: 'SHELL',
            triggers: [
                {
                    listenToEvent: {
                        deviceId: 'CHIME1',
                        events: ['trigger'],
                    },
                    execute: {
                        event: 'runCommand',
                        parameters: [
                            'aplay assets/audio/tiroler.wav'
                        ]
                    }
                },
            ],
        },
        {
            enabled: false,
            type: 'PUSHBULLET',
            settings: {
                apiKeys: [
                    'v1Klsy75MuWSVbmbVCaAGYMgfI6pwg7KrwujAyxEUQJS8',
                    'Rw2EjEU8vXjEVaniia0l98zIymodmuAX'
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
                            'Deurbel',    // Title
                            'Ding Dong!'  // Message
                        ]
                    }
                },
            ],
        },
        {
            enabled: false,
            debug: true,
            type: 'ZWAVE',
            settings: {
                port: '/dev/ttyACM0',
                pairingMode: false
            }
        },
    ],

    // DEVICES
    // devices connected to the defined hardware
    devices: [
        {
            id: 'KAKU1',                        // string  - DOMUSTO wide unique device identifier (no spaces or special characers)
            enabled: true,                      // boolean - enables or disables a device
            role: 'output',                     // output | input - specify the role of the device
            name: 'modem',                      // string  - name of the device which is used in the frontend
            type: 'switch',                     // switch | temperature | power - kind of device
            subType: 'on/off',                  // on/off | temperature-humidity - subType of switch
            protocol: {
                pluginId: 'RFXCOM',           // string  - id of the hardware device
                type: 'Lighting2',              // string  - protocol type
                subType: 'AC',                  // string  - protocol subType
                outputId: '0x02020504/1',       // hex id / unit code - id and unit code separated with a slash /, is broadcasted when button in DOMUSTO is pressed

                // ALIAS INPUTS
                // ids where the button needs to listen to. Often hardware buttons which also switch the state of the device
                // or for example a remote which is not bound via hardware, but needs to control the device
                inputIds: [
                    '0x010CE4C6/2',
                ]
            },

            // TIMERS
            // timers which control the device based on time or sun
            timers: [
                {
                    enabled: false,             // boolean - enables or disables a timer
                    type: 'time',               // time | sun - sets the type of timer
                    state: 'on',                // on | off - state to which the timer switched on timer hit
                    time: '10 * * * * *'        // cron notation - define the timer in the cron format seconds - minute - hours - day - month - year. Use * as wildcard
                },
                {
                    enabled: false,
                    type: 'time',
                    state: 'off',
                    time: '30 * * * * *'
                },
                {
                    enabled: true,
                    type: 'sun',
                    condition: 'sunset',
                    state: 'on'
                },
                {
                    enabled: true,
                    type: 'time',
                    time: '0 0 23 * * SUN-THU',
                    state: 'off'
                },
                {
                    enabled: true,
                    type: 'time',
                    time: '0 35 0 * * SAT',
                    state: 'off'
                },
                {
                    enabled: true,
                    type: 'time',
                    time: '0 21 0 * * SUN',
                    state: 'off'
                },
                {
                    enabled: false,
                    type: 'event',
                    offset: '5 * * * * *', // 5 seconds
                    event: 'on',
                    state: 'off'
                },
            ]
        },
        {
            id: 'KAKU2',
            enabled: true,
            role: 'output',
            name: 'tuin',
            type: 'switch',
            subType: 'on/off',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'Lighting2',
                subType: 'AC',
                outputId: '0x010EC076/11'
            },
            timers: [
                {
                    type: 'sun',
                    enabled: true,
                    condition: 'sunset',
                    state: 'on'
                },
                {
                    type: 'time',
                    enabled: true,
                    time: '0 0 23 * * SUN-THU',
                    state: 'off'
                },
                {
                    type: 'time',
                    enabled: true,
                    time: '0 30 0 * * SAT',
                    state: 'off'
                },
                {
                    type: 'time',
                    enabled: true,
                    time: '0 30 0 * * SUN',
                    state: 'off'
                }
            ]
        },
        {
            id: 'KAKU3',
            enabled: true,
            role: 'output',
            name: 'woonkamer',
            type: 'switch',
            subType: 'on/off',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'Lighting2',
                subType: 'AC',
                outputId: '0x020B0812/1'
            },
            timers: [
                {
                    type: 'sun',
                    enabled: true,
                    condition: 'sunset',
                    state: 'on'
                },
                {
                    type: 'time',
                    enabled: true,
                    time: '0 0 23 * * SUN-THU',
                    state: 'off'
                },
                {
                    type: 'time',
                    enabled: true,
                    time: '0 55 0 * * SAT',
                    state: 'off'
                },
                {
                    type: 'time',
                    enabled: true,
                    time: '0 55 0 * * SUN',
                    state: 'off'
                }
            ]
        },
        {
            id: 'KAKU4',
            enabled: true,
            role: 'output',
            name: 'bijkeuken',
            type: 'switch',
            subType: 'on/off',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'Lighting2',
                subType: 'AC',
                outputId: '0x00E298FE/10'
            }
        },
        {
            id: 'KAKU5',
            enabled: true,
            role: 'output',
            name: 'slaapkamer',
            type: 'switch',
            subType: 'on/off',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'Lighting2',
                subType: 'AC',
                outputId: '0x00E24B7E/10', // Wall switch
                inputIds: [
                    '0x010CE4C6/1', // Remote Bas
                    '0x01245F42/2', // Remote Nynke
                ]
            }
        },
        {
            id: 'KAKU6',
            enabled: true,
            role: 'output',
            name: 'bedlamp',
            type: 'switch',
            subType: 'on/off',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'Lighting2',
                subType: 'AC',
                outputId: '0x01245F42/1'
            }
        },
        {
            id: 'KAKU7',
            enabled: true,
            role: 'output',
            name: 'tv',
            type: 'switch',
            subType: 'on/off',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'Lighting2',
                subType: 'AC',
                outputId: '0x01AB23DF/1'
            }
        },
        {
            id: 'KAKU8',
            enabled: true,
            role: 'output',
            name: 'zonnescherm',
            type: 'switch',
            subType: 'up/down',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'Lighting2',
                subType: 'AC', // 0
                outputId: '0x01000000/1'
            }
        },
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
                }
            },
            triggers: [
                {
                    listenToEvent: {
                        deviceId: 'CHIME1',
                        events: ['trigger'],
                    },
                    execute: {
                        event: 'on'
                    }
                },
            ],
        },
        {
            id: 'CHIME1',
            enabled: true,
            role: 'output',
            name: 'deurbel',
            type: 'switch',
            subType: 'momentary',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'Chime1',
                subType: 'SELECT_PLUS',
                outputId: '0x0045EF'
            }
        },
        {
            id: 'TEMP1',
            enabled: true,
            role: 'input',
            name: 'Studeerkamer',
            type: 'temperature',
            subType: 'temperature-humidity',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'temperaturehumidity1',
                // subType: '13',
                id: '0x7003'
            }
        },
        {
            id: 'TEMP2',
            enabled: true,
            role: 'input',
            name: 'Achtertuin',
            type: 'temperature',
            subType: 'temperature-humidity',
            protocol: {
                pluginId: 'RFXCOM',
                type: 'temperaturehumidity1',
                // subType: '13',
                id: '0xBB03'
            }
        },
        {
            id: 'POWER1',
            enabled: true,
            role: 'input',
            name: 'Stroom gebruikt',
            type: 'power',
            protocol: {
                pluginId: 'P1',
                id: 'POWER1',
                type: 'received'
            }
        },
        {
            id: 'POWER2',
            enabled: true,
            role: 'input',
            name: 'Stroom geleverd',
            type: 'power',
            protocol: {
                pluginId: 'P1',
                id: 'POWER2',
                type: 'delivered'
            }
        },
    ]
};