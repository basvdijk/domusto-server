# OpenZWave

```
plugin:    OpenZWave controller
author:    Bas van Dijk
category:  radio
version:   0.0.1
website:   http://domusto.com
```

## Hardware needed
- Vision Z-Wave Plus USB Stick ZU1401EU - € 29.95

## Tested with
 - Fibaro Smoke Sensor 2 FGSD-002 - € 64.95

## Installing

DOMUSTO uses the [`node-openzwave-shared`](https://github.com/OpenZWave/node-openzwave-shared) library. This library need you to have OpenZWave installed:


### Raspbian

Install OpenZWave manually with:

```
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/openzwave_1.4.79.gfaea7dd_armhf.deb"
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/libopenzwave1.3_1.4.79.gfaea7dd_armhf.deb"
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/libopenzwave1.3-dev_1.4.79.gfaea7dd_armhf.deb"
sudo dpkg -i *openzwave*.deb
```

More info: https://github.com/OpenZWave/node-openzwave-shared/blob/master/README-raspbian.md

### Ubuntu

More info: https://github.com/OpenZWave/node-openzwave-shared/blob/master/README-ubuntu.md
 
## Configuration

1. Connect the Vision USB stick to your usb port
2. Add the section below to your `config.ts`
3. Set the correct com port where your have connected your Vision USB stick
4. Restart DOMUSTO

```js
{
    enabled: true,
    debug: true,
    type: 'ZWAVE',
    settings: {
        port: '/dev/ttyACM0',
        pairingMode: false
    }
},
```

## Paring mode
When you enable `pairingMode` the plugin listens for new devices to pair.

## Paring devices

# Fibaro Smoke Sensor 2 FGSD-002
- Make sure you have `pairing mode` enabled
- Wait till discovering is complete and *Paring mode active* is shown in the terminal
- Hold the button on the smoke detector, release when you hear a beep.
- Press 3x shortly on the button on the smoke detector
