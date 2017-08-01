module.exports = {
    debug: true,
    input: {
        thermometers: [],
        utility: []
    },
    location: {
        latitude: "52.490053",
        longitude: "4.974129"
    },
    hardware: [
        {
            id: 0,
            type: "RFXCOM",
            port: "/dev/ttyUSB-RFX433"
        },
        {
            id: 1,
            type: "P1",
            port: "/dev/ttyUSB-P1"
        }
    ],
    devices: [
        {
            id: "KAKU1",
            enabled: true,
            role: "output",
            name: "modem",
            type: "switch",
            subtype: "on/off",
            protocol: {
                hardwareId: "RFXCOM",
                type: "Lighting2",
                subType: "AC",
                output: {
                    unit: 1,
                    id: "0x2020504"
                }
            },
            timers: [
                {
                    type: "time",
                    enabled: false,
                    state: "on",
                    time: "10 * * * * *"
                },
                {
                    type: "time",
                    enabled: false,
                    state: "off",
                    time: "30 * * * * *"
                },
                {
                    type: "sun",
                    enabled: true,
                    condition: "sunset",
                    offset: "* * -1 * * *",
                    state: "off"
                }
            ]
        },
        {
            id: "KAKU2",
            enabled: true,
            role: "output",
            name: "tuinverlichting",
            type: "switch",
            subtype: "on/off",
            protocol: {
                hardwareId: "RFXCOM",
                type: "Lighting2",
                subType: "AC",
                output: {
                    unit: 11,
                    id: "0x10EC076"
                }
            }
        },
        {
            id: "KAKU3",
            enabled: true,
            role: "output",
            name: "woonkamer",
            type: "switch",
            subtype: "on/off",
            protocol: {
                hardwareId: "RFXCOM",
                type: "Lighting2",
                subType: "AC",
                output: {
                    unit: 1,
                    id: "0x20B0812"
                }
            }
        },
        {
            id: "KAKU4",
            enabled: true,
            role: "output",
            name: "bijkeuken",
            type: "switch",
            subtype: "on/off",
            protocol: {
                hardwareId: "RFXCOM",
                type: "Lighting2",
                subType: "AC",
                output: {
                    unit: 10,
                    id: "0x0E298FE"
                }
            }
        },
        {
            id: "KAKU5",
            enabled: true,
            role: "output",
            name: "slaapkamer",
            type: "switch",
            subtype: "on/off",
            protocol: {
                hardwareId: "RFXCOM",
                type: "Lighting2",
                subType: "AC",
                output: {
                    unit: 10,
                    id: "0x0E24B7E"
                },
                inputs: [
                    {
                        unit: 2,
                        id: "0x010CE4C6",
                        note: ""
                    },
                    {
                        unit: 1,
                        id: "0x010CE4C6",
                        note: ""
                    },
                    {
                        unit: 2,
                        id: "0x01245F42",
                        note: ""
                    }
                ]
            }
        },
        {
            id: "KAKU6",
            enabled: true,
            role: "output",
            name: "bedlamp",
            type: "switch",
            subtype: "on/off",
            protocol: {
                hardwareId: "RFXCOM",
                type: "Lighting2",
                subType: "AC",
                output: {
                    unit: 1,
                    id: "0x1245F42"
                }
            }
        },
        {
            id: "KAKU7",
            enabled: true,
            role: "output",
            name: "zonnescherm",
            type: "switch",
            subtype: "up/down",
            protocol: {
                hardwareId: "RFXCOM",
                type: "Lighting2",
                subType: "AC",
                output: {
                    unit: 1,
                    id: "0x1000000"
                }
            }
        },
        {
            id: "TEMP1",
            enabled: true,
            role: "input",
            name: "Studeerkamer",
            type: "temperature",
            subType: "temperature-humidity",
            protocol: {
                hardwareId: "RFXCOM",
                type: "th",
                subType: "13",
                id: "0x7003"
            }
        },
        {
            id: "TEMP2",
            enabled: true,
            role: "input",
            name: "Achtertuin",
            type: "temperature",
            subType: "temperature-humidity",
            protocol: {
                hardwareId: "RFXCOM",
                type: "th",
                subType: "13",
                id: "0xBB03"
            }
        },
        {
            id: "POWER1",
            enabled: true,
            role: "input",
            name: "Slimme meter",
            type: "power",
            protocol: {
                hardwareId: "P1",
                id: "POWER1",
                type: "power-received"
            }
        },
        {
            id: "POWER2",
            enabled: false,
            role: "input",
            name: "Slimme meter",
            type: "power",
            protocol: {
                hardwareId: "P1",
                id: "POWER2",
                type: "power-delivered"
            }
        }
    ]
};