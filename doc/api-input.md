# List input devices
`http://192.168.178.10:3000/input`

## Example response

```json
[
    {
        "id": "TEMP1",
        "enabled": true,
        "name": "Study room",
        "type": "temperature",
        "subType": "temperature-humidity",
        "role": "input",
        "protocol": {
            "pluginId": "RFXCOM",
            "type": "temperaturehumidity1",
            "id": "0x4503"
        },
        "data": {
            "deviceTypeString": "Alecto WS1700 and compatibles",
            "temperature": 23.2,
            "humidity": 56,
            "humidityStatus": 1,
            "barometer": null,
            "batteryLevel": 9,
            "rssi": 7
        }
    },
    {
        "id": "TEMP2",
        "enabled": true,
        "name": "Garden",
        "type": "temperature",
        "subType": "temperature-humidity",
        "role": "input",
        "protocol": {
            "pluginId": "RFXCOM",
            "type": "temperaturehumidity1",
            "id": "0x1C03"
        },
        "data": {
            "deviceTypeString": "Alecto WS1700 and compatibles",
            "temperature": 12.7,
            "humidity": 84,
            "humidityStatus": 3,
            "barometer": null,
            "batteryLevel": 9,
            "rssi": 5
        }
    },
    {
        "id": "POWER1",
        "enabled": true,
        "name": "Power used",
        "type": "power",
        "role": "input",
        "protocol": {
            "pluginId": "P1",
            "id": "POWER1",
            "type": "received"
        },
        "data": {
            "electricity": {
                "received": {
                    "tariff1": {
                        "value": 1854.369,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "value": 1837.667,
                        "unit": "kWh"
                    },
                    "actual": {
                        "value": 1.605,
                        "unit": "kW"
                    }
                },
                "delivered": {
                    "tariff1": {
                        "value": 0,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "value": 0,
                        "unit": "kWh"
                    },
                    "actual": {
                        "value": 0,
                        "unit": "kW"
                    }
                }
            }
        }
    },
    {
        "id": "POWER2",
        "enabled": true,
        "name": "Power delivered",
        "type": "power",
        "role": "input",
        "protocol": {
            "pluginId": "P1",
            "id": "POWER2",
            "type": "delivered"
        },
        "data": {
            "electricity": {
                "received": {
                    "tariff1": {
                        "value": 1854.369,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "value": 1837.667,
                        "unit": "kWh"
                    },
                    "actual": {
                        "value": 1.605,
                        "unit": "kW"
                    }
                },
                "delivered": {
                    "tariff1": {
                        "value": 0,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "value": 0,
                        "unit": "kWh"
                    },
                    "actual": {
                        "value": 0,
                        "unit": "kW"
                    }
                }
            }
        }
    },
    {
        "id": "TEMP9",
        "enabled": true,
        "name": "NEFIT in house",
        "type": "temperature",
        "subType": "temperature",
        "role": "input",
        "protocol": {
            "pluginId": "NEFIT-EASY",
            "id": "inHouseTemp"
        },
        "data": {
            "deviceTypeString": "Nefit Easy in house temperature",
            "temperature": "21.2",
            "humidity": null,
            "humidityStatus": null,
            "barometer": null,
            "batteryLevel": null,
            "rssi": null
        }
    },
    {
        "id": "TEMP10",
        "enabled": true,
        "name": "NEFIT outdoor",
        "type": "temperature",
        "subType": "temperature",
        "role": "input",
        "protocol": {
            "pluginId": "NEFIT-EASY",
            "id": "outdoorTemp"
        },
        "data": {
            "deviceTypeString": "Nefit Easy outdoor temperature",
            "temperature": "13.7",
            "humidity": null,
            "humidityStatus": null,
            "barometer": null,
            "batteryLevel": null,
            "rssi": null
        }
    }
]
```