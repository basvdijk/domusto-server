# RFXcom

```
plugin:    RfxCom transceiver
author:    Bas van Dijk
category:  radio
version:   0.0.1
website:   http://domusto.com
```

## Hardware needed
- [RFXtrx433E tranceiver](http://www.rfxcom.com/) - € 109.95

## Tested with
 - KaKu / CoCo APA2-2300R (AC protocol)
 - Kaku / CoCo ASUN-650 (AC protocol)
 - Thermometer / Humidity (OREGON protocol)
 - Doorbell (BYRONSX protocol, subtype SELECT_PLUS)

## Configuration

1. Connect the P1 smart meter cable to your usb port
2. Add the section below to your `config.ts`
3. Set the correct com port where your have connected your P1 smart meter cable
4. Set the protocols you wish to receive data for
5. Restart DOMUSTO

```js
    enabled: true,
    debug: false,
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
```

## ListenOnly
When you enable `listenOnly` the plugin listens to all possible events for the enabled protocols. When new data is received, this data is shown in the terminal.

## Procols supported (not tested):
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