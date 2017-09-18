# List output devices
`http://192.168.178.10:3000/output`

## Example response

```json
[
    {
        "id": "KAKU1",
        "enabled": true,
        "name": "Living room",
        "type": "switch",
        "subType": "on/off",
        "role": "output",
        "protocol": {
            "pluginId": "RFXCOM",
            "type": "Lighting2",
            "subType": "AC",
            "outputId": "0x02345504/1",
            "inputIds": [
                "0x01AA34C6/2"
            ]
        },
        "state": "off",
        "busy": false,
        "hasTimers": true,
        "timers": [
            {
                "enabled": false,
                "type": "time",
                "state": "on",
                "time": "10 * * * * *"
            },
            {
                "enabled": false,
                "type": "time",
                "state": "off",
                "time": "30 * * * * *"
            },
            {
                "enabled": true,
                "type": "sun",
                "condition": "sunset",
                "state": "on"
            },
            {
                "enabled": true,
                "type": "time",
                "time": "0 0 23 * * SUN-THU",
                "state": "off"
            },
            {
                "enabled": true,
                "type": "time",
                "time": "0 35 0 * * SAT",
                "state": "off"
            },
            {
                "enabled": true,
                "type": "time",
                "time": "0 21 0 * * SUN",
                "state": "off"
            },
            {
                "enabled": false,
                "type": "event",
                "offset": "5 * * * * *",
                "event": "on",
                "state": "off"
            }
        ],
        "actions": {
            "on": "http://192.168.178.10:3000/output/command/KAKU1/on",
            "off": "http://192.168.178.10:3000/output/command/KAKU1/off"
        }
    },
    {
        "id": "CHIME1",
        "enabled": true,
        "name": "Doorbell",
        "type": "switch",
        "subType": "momentary",
        "role": "output",
        "protocol": {
            "pluginId": "RFXCOM",
            "type": "Chime1",
            "subType": "SELECT_PLUS",
            "outputId": "0x0CAA1F"
        },
        "state": "off",
        "busy": false,
        "hasTimers": false,
        "timers": null,
        "actions": {
            "trigger": "http://192.168.178.10:3000/output/command/CHIME1/trigger"
        }
    }
]
```