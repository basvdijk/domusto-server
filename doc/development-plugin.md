# DOMUSTO plugin development

## How to start
Before deep diving into DOMUSTO plugin development it is recommended to look at the code of other plugins. The plugins below are listed from simple to complex.
- https://github.com/basvdijk/domusto-pushbullet
- https://github.com/basvdijk/domusto-shell
- https://github.com/basvdijk/domusto-p1
- https://github.com/basvdijk/domusto-marantz
- https://github.com/basvdijk/domusto-rfxcom

## Setup the plugin repository

Domusto plugins are loaded from Github. In order to make a compaitible plugin make sure:
 - Your repo name is lowercase, in the format: domusto-<PLUGIN NAME> e.g. domusto-gpio or domusto-marantz
 - If your plugin is suitable for other DOMUSTO users, add the topics `domusto` and `domusto-plugin` to your repository.

Checkout your plugin repo locally in the `src/domusto-plugins` folder

## Recommended IDE

DOMUSTO is developed using [Visual Studio Code](https://code.visualstudio.com/). It is recommended to install the following plugins:
- Document This
- Path Intellisense
- TSlint
- TypeScript Hero

In order to keep your code consistent with all other DOMUSTO code.

## Create the files needed

Open a terminal in your plugin folder and execute (or copy the files from an existing plugin):

```
touch .gitignore
touch README.MD
touch init.ts
npm init
```

Add the following to your `.gitignore`:
```
node_modules
package-lock.json
```

## Writing documentation
DOMUSTO uses a standard structure for the README.MD have a look at https://github.com/basvdijk/domusto-marantz/blob/master/README.MD for an example.

You can store documentation resources like screenshots, design files etc. in the `doc` folder of your plugin. See https://github.com/basvdijk/domusto-gpio for an example use case.

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

is triggered when a signal for your plugin arrives. You might wonder why we use `this.console.log` instead of `console.log`. Using `this` automatically adds the plugin name to de log messages. You can also use `this.console.header`, `this.console.warning`, `this.console.error` and `this.console.prettyJson`

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

DOMUSTO has several interfaces and enums defined. When you import 
```ts
import { Domusto } from '../../domusto/DomustoTypes';
```
You can access these interfaces and enums via `Domusto.` VScode will list all possibilities automatically.

## Plugin settings in Config.ts

The plugin config uses the follwing structure:

| field     | description                                                 |
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
                enabled: true,
                time: 'sunset',
                state: 'on'
            },
            {
                enabled: true,
                time: '0 0 23 * * SUN-THU',
                state: 'off'
            },
        ]

    }
}
```

## Validate configuration fields
Make sure you validate the plugin configuration fields in the constructor of your plugin in order to make sure the users have provided the correct fields in their `Config.ts`.

### Config.ts
```js
settings: {
  ip: '192.168.178.61',
  pollInterval: 5 * 1000
}
```

### Plugin constructor (basvdijk/marantz)
```typescript
let isConfigurationValid = this.validateConfigurationAttributes(pluginConfiguration.settings, [
    {
        attribute: 'ip',
        // regex to validate ip addresses
        type: /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
    }
]);
```

### Config.ts
```js
pluginSettings: {

    timer: [
        {
            enabled: true,
            time: '0 41 17 * * *',
            state: 'on'
        },
    ]
}
```

### Plugin constructor (basvdijk/timer)
```ts
let isConfigurationValid = this.validateConfigurationAttributes(timer, [
    {
        attribute: 'enabled',
        type: 'boolean'
    },
    {
        attribute: 'time',
        type: 'string'
    },
    {
        attribute: 'state',
        type: 'string',
        validValues: ['on', 'off', 'trigger']
    },
]);
```

## External NPM packages
When you need external NPM packages you can add them to your package.json as dependency. You can use `npm install` in your plugin directory, but keep in mind never check in the `package-lock.json` of your plugin. Yes, this is need according to npm, because the way DOMUSTO installs new plugins it will fail if this file is committed.

All server dependencies need to be installed in the `node_modules` in the root of the domusto-server folder instead of the plugin folder. To allow easy development the `domusto.js` client tool checkouts your repo, looks in your `package.json` for dependencies, and installs these automatically.

Store the instance of an external NPM module in `this.hardwareInstance`. In this example the `AVReceiver` is an external NPM module.

```ts
let receiver = new AVReceiver(pluginConfiguration.settings.ip);
this.hardwareInstance = receiver;
```

## Coding conventions

- Device id's are written in Kebab case e.g.  `temperaturehumidity1/TH13-0x1203` and `in-house-temperature`
- Plugin class starts with Domusto e.g. DomustoShell, DomustoMarantz etc.
- Do not use `console.log` but use `this.console.log` instead. DOMUSTO will then prefix your console message with the plugin name