# Pushbullet

```
plugin:    Pushbullet push messages
author:    Bas van Dijk
category:  system
version:   0.0.1
website:   http://domusto.com
```

## Hardware needed
- none

## Tested with
 - RFXcom events
 
## Configuration

1. Add the section below to your `config.js`
2. Restart DOMUSTO

```js
{
    enabled: true,
    type: 'PUSHBULLET',
    settings: {
        apiKeys: [
            'APIKEY1',
            'APIKEY2'
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
}
```