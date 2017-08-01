{
    "debug": true,
    "input": {
        "thermometers": [],
        "utility": []
    },
    "location": {
        "latitude": "51.490053",
        "longitude": "3.974129"
    },
    "hardware": [
        {
            "id": 0,
            "type": "RFXCOM",
            "port": "/dev/ttyUSB-RFX433"
        },
        {
            "id": 1,
            "type": "P1",
            "port": "/dev/ttyUSB-P1"
        }
    ],
    "devices": [
        {
            "id": "KAKU1",
            "enabled": true,
            "role": "output",
            "name": "modem",
            "type": "switch",
            "subtype": "on/off",
            "protocol": {
                "hardwareId": "RFXCOM",
                "type": "Lighting2",
                "subType": "AC",
                "output": {
                    "unit": 10,
                    "id": "0x0E24B7E"
                },
                "inputs": [
                    {
                        "unit": 2,
                        "id": "0x010CE4C6"
                    },
                    {
                        "unit": 1,
                        "id": "0x010CE4C6"
                    }
                ]  
            },         
            "timers": [
                {
                    "type": "time",
                    "enabled": false,
                    "state": "on",
                    "time": "10 * * * * *"
                },
                {
                    "type": "time",
                    "enabled": false,
                    "state": "off",
                    "time": "30 * * * * *"
                },
                {
                    "type": "sun",
                    "enabled": true,
                    "condition": "sunset",
                    "offset": "* * -1 * * *",
                    "state": "off"
                }
            ]
        },
        {
            "id": "KAKU2",
            "enabled": true,
            "role": "output",
            "name": "tuinverlichting",
            "type": "switch",
            "subtype": "on/off",
            "protocol": {
                "hardwareId": "RFXCOM",
                "type": "Lighting2",
                "subType": "AC",
                "unit": 11,
                "id": "0x10FC076"
            }
        },
        {
            "id": "TEMP1",
            "enabled": true,
            "role": "input",
            "name": "Studeerkamer",
            "type": "temperature",
            "subType": "temperature-humidity",
            "protocol": {
                "hardwareId": "RFXCOM",
                "type": "th",
                "subType": "13",
                "id": "0x7103"
            }
        },
        {
            "id": "TEMP2",
            "enabled": true,
            "role": "input",
            "name": "Achtertuin",
            "type": "temperature",
            "subType": "temperature-humidity",
            "protocol": {
                "hardwareId": "RFXCOM",
                "type": "th",
                "subType": "13",
                "id": "0xBC03"
            }
        },
        {
            "id": "POWER1",
            "enabled": true,
            "role": "input",
            "name": "Slimme meter",
            "type": "power",
            "protocol": {
                "hardwareId": "P1",
                "id": "POWER1",
                "type": "power-received"
            }     
        },
        {
            "id": "POWER2",
            "enabled": true,
            "role": "input",
            "name": "Slimme meter",
            "type": "power",
            "protocol": {
                "hardwareId": "P1",
                "id": "POWER2",
                "type": "power-delivered"
            }     
        }
    ]
}