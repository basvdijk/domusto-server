# KaKu / CoCo APA2-2300R

## Hardware needed
- [RFXtrx433E tranceiver](http://www.rfxcom.com/) - € 109.95
- [KaKu / CoCo APA2-2300R](https://www.klikaanklikuit.nl/nl/apa2-2300r-2-kanaals-afstandsbediening-stekkerdoos-schakelaars.html) - € 19,95

## Configuration

The `KaKu / CoCo APA2-2300R` contains two plug-in sockets and a remote for two devices.

If you want to control the wall sockets with DOMUSTO you first need to learn the sockets new codes.

 1. Add the configuration as shown below to the `devices` section in your `config.js` file.
 2. Edit the name
 3. Edit the id with an unique value, preferred is to use capitals and numbers and nu special characters
 4. Edit the output id. Make sure you always use the format `0x0......./.` You can use Hexadecimal values
 5. Start DOMUSTO with the new device configuration
 6. When DOMUSTO is started power one plug-in socket, the red light will blink
 7. Now press the configured button in DOMUSTO, the KaKu device will confirm by clicking twice
 8. You can now control the device via DOMUSTO

 ## Optional
 Optionally you can add inputIds. These ids also trigger the switch. Here you can put the identifiers of your remote control so DOMUSTO stays in sync when you use your remote.

| Property | Type    | Description                                         |
|----------|---------|-----------------------------------------------------|
| id       | string  | name in capitals, no spaces or special characters   |
| enabled  | boolean | defines if switch is enabled                        |
| role     | string  | "output"                                            |
| name     | string  | name of the device as shown in the frond-end        |
| type     | string  | "switch"                                            |
| subtype  | string  | subtype of switch: "on/off", "up/down", "momentary" |
| protocol | object  | see protocol table                                  |

**Protocol**

| Property | Type     | Description                                                                  |
|----------|----------|------------------------------------------------------------------------------|
| pluginId | string   | id of the plugin which handles the switch e.g. RFXCOM                        |
| type     | string   | protocol type e.g. Lighting2                                                 |
| subType  | string   | protocol subtype e.g. AC                                                     |
| outputId | string   | hex id / unit code to send when button is pressed formatted as 0x0......./.. |
| inputIds | [string] | array of inputIds to listen to e.g. hardware button codes                    |

```js
{
    id: 'KAKU1',
    enabled: true,
    role: 'output',
    name: 'modem', 
    type: 'switch',
    subtype: 'on/off',
    protocol: {
        pluginId: 'RFXCOM',
        type: 'Lighting2',
        subType: 'AC',
        outputId: '0x0E24B7E/10',
        inputIds: [
            '0x010CE4C6/2',  // bedroom remote
            '0x010CE4C6/1'   // bedroom wall button
        ]
    },
}
```