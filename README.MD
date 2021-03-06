DOMUSTO website: https://domusto.com/

⚠️ _This project in alpha-state, so things might not work as expected._ ⚠️

# Introduction
DOMUSTO is versatile, extensible, plugin driven home automation software written in NodeJS. DOMUSTO is developed to run on a Raspberry Pi, but other Linux based systems should work as well.

The [command line tool](doc/command-line-tool.md) covers easy maintenance and plugin management. [Screenshots](https://github.com/basvdijk/domusto-client) can be found on the DOMUSTO client Github page.

# Documentation
- [Installation guide](doc/installation.md)
- [Plugin guide](doc/development-plugin.md)
- [Maintenance guide](doc/maintenance.md)
- [Command line tool](doc/command-line-tool.md)
- [API guide](doc/api.md)

# Frontend
Once the DOMUSTO server runs you can install the DOMUSTO client from https://github.com/basvdijk/domusto-client

# Plugins
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

# Tested hardware
- RFXcom
  - Weather
    - 433MHz Wireless Remote Weather Station Digital Thermometer Humidity Sensor
  - Switch
    - Klik-Aan-Klik-Uit / KAKU
    - Click-On-Click-Off / COCO
  - Select Plus Chime Doorbell

- P1 (via P1 to usb converter)
  - Landis+Gyr E350

- Marantz
  - SR6010 Receiver

# Cost overview
| Item                                  | Model                                                                                                                                                                                   |    Price | Store      |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------:|------------|
| RFXcom 433mhz tranceiver              | [RFXtrx433E](http://www.rfxcom.com/epages/78165469.sf/nl_NL/?ObjectPath=/Shops/78165469/Categories/Transceivers)                                                                        | € 109,95 | online     |
| Smart meter cable                     | [P1 Smart meter cable](https://www.sossolutions.nl/slimme-meter-kabel)                                                                                                                  |  € 19,95 | online     |
| RPI, power adapter, sd card           | [RPI3B starter kit](https://www.sossolutions.nl/raspberry-pi-3b-starterkit)                                                                                                             |  € 58,95 | online     |
| RPI, power adapter, sd card, RFXcom** | [RPI3B starter kit + RFXtrx433E](https://www.sossolutions.nl/rfxcom-e-domoticz-starter-met-raspberry-pi3b)                                                                              | € 145,95 | online     |
| Wireless doorbell                     | [Select Plus 433mhz wireless doorbell](https://www.action.com/nl-nl/p/select-plus-draadloze-deurbel/)                                                                                   |   € 5,95 | Action     |
| 2x wall plug + remote                 | [KaKu APA2-2300R](https://www.klikaanklikuit.nl/nl/apa2-2300r-2-kanaals-afstandsbediening-stekkerdoos-schakelaars.html)                                                                 |  € 24,99 | DIY store* |
| 3x wall plug + remote                 | [KaKu APA3-1500R](https://www.klikaanklikuit.nl/nl/apa3-1500r-starterset.html)                                                                                                          |  € 29,99 | DIY store* |
| Sunscreen controller                  | [KaKu ASUN-650](https://www.klikaanklikuit.nl/nl/asun-650-schakelaar-voor-zonwering.html)                                                                                               |  € 41,99 | DIY store* |
| Wall push button                      | [KaKu AWST-8800](https://www.klikaanklikuit.nl/nl/awst-8800-draadloze-wandschakelaar.html)                                                                                              |  € 20,99 | DIY store* |
| Wall dual push button                 | [KaKu AWST-8802](https://www.klikaanklikuit.nl/nl/awst-8802-dubbele-draadloze-wandschakelaar.html)                                                                                      |  € 22,99 | DIY store* |
| Build-in TL-light switch***           | [KaKu AWMR-300](https://www.klikaanklikuit.nl/nl/awmr-300-mini-inbouw-schakelaar.html)                                                                                                  |  € 31,99 | DIY store* |
| Build-in switch                       | [KaKu AMU-500](https://www.klikaanklikuit.nl/nl/amu-500-universele-schakelaar.html)                                                                                                     |  € 34,99 | DIY store* |
| Temp + Humidity sensor                | [433MHz Weather Humidity](https://www.banggood.com/custlink/mDGDAzNTS1) |   € 6,77 | Banggood       |

```
*   Dutch DIY stores like Gamma and Karwei reguarly have discounts on KaKu devices
**  The kit comes without a SD card, make sure you order it when you don't have one
*** For TL-light make sure you use the AWMR-300 and NOT the AWMR-230
```
