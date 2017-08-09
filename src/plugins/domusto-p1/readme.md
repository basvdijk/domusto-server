# P1 meter

```
plugin:    P1 smartmeter for Landys Gyr E350
author:    Bas van Dijk
category:  utility
version:   0.0.1
website:   http://domusto.com
```

## Hardware needed
- [P1 smart meter serial to USB cable](https://www.sossolutions.nl/slimme-meter-kabel) - € 19,95

## Tested with
 - Kaifa and Landis+Gyr Smart Meters

## Configuration

1. Connect the P1 smart meter cable to your usb port
2. Add the section below to your `config.js`
3. Set the correct com port where your have connected your P1 smart meter cable
5. Restart DOMUSTO

```js
{
    enabled: true,
    type: 'P1',
    port: '/dev/ttyUSB-P1'
},
```