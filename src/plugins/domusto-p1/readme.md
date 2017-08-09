# P1 meter

```
plugin:    P1 smartmeter for Landys Gyr E350
author:    Bas van Dijk
category:  utility
version:   0.0.1
website:   http://domusto.com
```

## Hardware needed
- [RFXtrx433E tranceiver](http://www.rfxcom.com/) - € 109.95
- [P1 smart meter serial to USB cable](https://www.sossolutions.nl/slimme-meter-kabel) - € 19,95

## Tested with
 - Kaifa and Landis+Gyr Smart Meters

## Configuration

1. Connect the P1 smart meter cable to your usb port
2. Add the section below to your `config.js`
3. Set the correct com port where your have connected your P1 smart meter cable
4. Set the protocols you wish to receive data for
5. Restart DOMUSTO

```js
{
    enabled: true,
    debug: true,
    type: 'RFXCOM',
    port: '/dev/ttyUSB-RFX433',
    enabledProtocols: ['AC', 'BYRONSX', 'LIGHTING4', 'OREGON', 'RUBICSON']
},
```

## Procols supported:
- AC
- ARC
- ATI
- BLINDST14
- BLYSS
- BYRONSX
- FINEOFFSET
- FS20
- HIDEKI
- HOMEEASY
- LACROSSE
- LIGHTING4
- LIGHTWAVERF
- MEIANTECH
- MERTIK
- OREGON
- PROGUARD
- RFU6
- ROLLERTROL
- RSL
- RUBICSON
- VISONIC
- X10