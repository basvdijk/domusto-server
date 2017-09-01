# RFXcom

```
plugin:    RfxCom transceiver
author:    Bas van Dijk
category:  radio
version:   0.0.1
website:   http://domusto.com
```

## Hardware needed
- Vision Z-Wave Plus USB Stick ZU1401EU - € 29.95

## Tested with
 - Fibaro Smoke Sensor 2 FGSD-002 - € 64.95
 
## Configuration

1. Connect the Vision USB stick to your usb port
2. Add the section below to your `config.js`
3. Set the correct com port where your have connected your Vision USB stick
4. Restart DOMUSTO

```js
{
    enabled: true,
    debug: true,
    type: 'ZWAVE',
    settings: {
        port: '/dev/ttyACM0'
    }
},
```
