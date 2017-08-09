## Klik-Aan-Klik-Uit switch

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

```js
{
    id: 'KAKU1',                        // string                          DOMUSTO wide unique device identifier (no spaces or special characers)
    enabled: true,                      // boolean                         enables or disables a device
    role: 'output',                     // input | output                  specify the role of the device
    name: 'modem',                      // string                          name of the device which is used in the frontend 
    type: 'switch',                     // switch | temperature | power    kind of device
    subtype: 'on/off',                  // on/off | up/down | momentary | temperature-humidity   subtype of switch
    protocol: {
        pluginId: 'RFXCOM',           // string   id of the hardware device
        type: 'Lighting2',              // string   protocol type
        subType: 'AC',                  // string   protocol subtype 

        // OUTPUTS
        // Code which is broadcasted when the button in DOMUSTO is pressed
        outputId: '0x0E24B7E/10',          // hex id / unit code - id and unit code separated with a slash /, is broadcasted when button in DOMUSTO is pressed

        // ALIAS INPUTS
        // ids where the button needs to listen to. Often hardware buttons which also switch the state of the device
        // or for example a remote which is not bound via hardware, but needs to control the device
        inputIds: [
            '0x010CE4C6/2',
            '0x010CE4C6/1'
        ]
    },
}
```