# DOMUSTO plugin development

## How to start
Before deep diving into DOMUSTO plugin development it is recommended to look at the code of other plugins. The plugins below are listed from simple to complex.
- https://github.com/basvdijk/domusto-pushbullet
- https://github.com/basvdijk/domusto-shell
- https://github.com/basvdijk/domusto-marantz
- https://github.com/basvdijk/domusto-p1
- https://github.com/basvdijk/domusto-rfxcom

## Setup the plugin repository

Domusto plugins are loaded from Github. In order to make a compaitible plugin make sure:
 - Your repo name is lowercase, in the format: domusto-<PLUGIN NAME> e.g. domusto-gpio or domusto-marantz
 - Add the topics "domusto" and "domusto-plugin" to your repository

Checkout the repo locally in the `src/domusto-plugins` folder

## Recommended IDE

DOMUSTO is developed using [https://code.visualstudio.com/](Visual Studio Code). It is recommended to install the following plugins:
- Document This
- Path Intellisense
- TSlint
- TypeScript Hero

## Create the files needed

Open a terminal in your plugin folder and execute:

```
touch .gitignore
echo node_modules > .gitignore
touch README.MD
touch init.ts
npm init
```

## Writing documentation

We use a standard structure for the README.MD have a look at https://github.com/basvdijk/domusto-marantz/blob/master/README.MD for an example.

## Start developing
The easiest way to get started is to copy the code of an existing plugin e.g. https://github.com/basvdijk/domusto-marantz/blob/master/index.ts into your plugin's `index.ts` and modify it according your needs.

## Signals

DOMUSTO works with `Signals`. All sensors, swithes and plugins etc. communicates via these signals. For example, when a wireless button is pressed, the associated plugin broadcasts a signal which contains the device information. All signal communication is managed by the `DomustoSignalHub`.

Other plugins can subscribe to signals in order to execute a certain action.

The `DomustoPlugin` class already filters the signals for your plugin. The function:

```ts
onSignalReceivedForPlugin(signal: Domusto.Signal) {
    this.console.log(signal);
}
```

Is triggered when a signal for your plugin arrives. You might wonder why we use `this.console.log` instead of `console.log`. Using `this` automatically adds the plugin name to de log messages. You can also use `this.console.header`, `this.console.warning`, `this.console.error` and `this.console.prettyJson`

You might want to intercept all signals which are going through DOMUSTO for example when writing a custom event logger. This code is executed on every Signal broadcast.

```ts
DomustoSignalHub.subject.subscribe((signal: Domusto.Signal) => {
    this.console.log(signal);
}
```

A signal is send with the sender field being either `client` or `plugin`. `Client` signals are send from the frontend e.g. when a software button is pressed. The `plugin` signals are send by plugins e.g. button press, sensor value update. However plugins can also broadcast `client` signals in order to trigger other plugins.

By default signals from plugins are send as `plugin` signal. Below is an example which broadcasts the power is on.

```ts
this.broadcastSignal('power', {
    state: 'on'
});
```

## Using the DOMUSTO interfaces

DOMUSTO has several interfaces and enums defined. When you import `import { Domusto } from '../../domusto/DomustoInterfaces';` You can access these interfaces and enums via `Domusto.` VScode will list all possibilities automatically.

## Plugin settings in Config.ts

The plugin config uses the follwing structure:
|           |                                                             |
|-----------|-------------------------------------------------------------|
| plugin    | id in uppercase                                             |
| enabled   | used to turn on/off the plugin                              |
| dummyData | used to send fake data to test the plugin e.g. for sensors  |
| settings  | is the section where you can store plugin specific settings |


```js
{
    id: 'P1',
    enabled: true,
    dummyData: false,
    settings: {
        port: '/dev/ttyUSB-P1'
    }
},
``` 

## Plugin settings for devices

Some plugins need configuration on device level. For example the [https://github.com/basvdijk/domusto-timer](domusto-timer) plugin switches devices on a specific time. These timers are configured in the device section instead of the plugin section.

These settings are listed in the `pluginSettings` section of the device. It is best practice to store all your plugin settings under the plugin name. In this case the `timer` key points to the `domusto-timer` plugin. 

_Remember to only use this section when device specific settings are needed._
```js
{
    id: 'KAKU2',
    enabled: true,
    role: 'output',
    name: 'tuin',
    type: 'switch',
    subType: 'on/off',
    plugin: {
        id: 'RFXCOM',
        deviceId: 'Lighting2/AC-0x014DA076/11',
    },
    pluginSettings: {

        timer: [
            {
                type: 'sun',
                enabled: true,
                condition: 'sunset',
                state: 'on'
            },
            {
                type: 'time',
                enabled: true,
                time: '0 0 23 * * SUN-THU',
                state: 'off'
            },
        ]

    }
}
```

## External NPM packages
Store the instance of an external NPM module in `this.hardwareInstance`. In this example the `AVReceiver` is an external NPM module.

```ts
let receiver = new AVReceiver(pluginConfiguration.settings.ip);
this.hardwareInstance = receiver;
```