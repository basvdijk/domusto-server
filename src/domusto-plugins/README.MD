# DOMUSTO plugin guide

Please make sure to re-install all plugin depencies after adding a new plugin:
```
./domusto.js plugin install-deps
```

## Available Plugins
| Plugin                                                         | Description                                                 |
|----------------------------------------------------------------|-------------------------------------------------------------|
| [Timer](https://github.com/basvdijk/domusto-timer)             | Switch based on specific time or sunset, sunrise etc.       |
| [GPIO Pins for RPI](https://github.com/basvdijk/domusto-gpio)  | Control the GPIO pins on a Raspberry Pi                     |
| [Marantz](https://github.com/basvdijk/domusto-marantz)         | Control your Marantz receiver                               |
| [Nefit Easy](https://github.com/basvdijk/domusto-nefit-easy)   | Read the temperature of Nefit Easy thermostat               |
| [P1 smart meter](https://github.com/basvdijk/domusto-p1)       | Read the electrical smartmeter with P1 protocol             |
| [Philips HUE](https://github.com/basvdijk/domusto-philips-hue) | Control Philips HUE lights                                  |
| [PushBullet](https://github.com/basvdijk/domusto-pushbullet)   | Sends push messages to devices with the Pushbullet.com API  |
| [RFXcom](https://github.com/basvdijk/domusto-rfxcom)           | Send and receive 433Mhz signals with RFXcom usb transceiver |
| [Shell executer](https://github.com/basvdijk/domusto-shell)    | Execute shell commands on an DOMUSTO signal                 |

## List available plugins
```sh
./domusto.js plugin list
```

## Install plugin example

```sh
$ domusto.js plugin add basvdijk/domusto-marantz
```

## Remove plugin example

```sh
$ domusto.js plugin remove basvdijk/domusto-marantz
```

## Update all plugins example

```sh
$ domusto.js plugin update
```

## Troubleshooting

**Error**
```
10:08:37 - Starting compilation in watch mode...
src/domusto-plugins/domusto-nefit-easy/index.ts(10,36): error TS2307: Cannot find module 'nefit-easy-commands'.
src/domusto-plugins/domusto-pushbullet/index.ts(10,29): error TS2307: Cannot find module 'pushbullet'.
src/domusto-plugins/domusto-timer/index.ts(12,26): error TS2307: Cannot find module 'suncalc'.
src/domusto-plugins/domusto-timer/index.ts(13,27): error TS2307: Cannot find module 'node-schedule'.
src/domusto-plugins/domusto-zwave/index.ts(10,24): error TS2307: Cannot find module 'openzwave-shared'.
10:08:48 - Compilation complete. Watching for file changes.
```

**Solution**
Reinstall plugin deps:
```
./domusto.js plugin install-deps
```