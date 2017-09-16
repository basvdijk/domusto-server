_This project is pre-pre-pre-alpha, so don't expect a working solution._

This project is just the DOMUSTO server. You'll find the graphical interface at https://github.com/basvdijk/domusto-client

# API docs

See [the API docs](API.MD)

# Plugins
- [RFXcom](src/plugins/domusto-rfxcom)
- [Z-Wave](src/plugins/domusto-zwave)
- [P1 smart meter](src/plugins/domusto-p1)
- [Shell executer](src/plugins/domusto-shell)

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

# Cost overview
| Item                                  | Model                                                                                                                                                                                   |    Price | Store      |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------:|------------|
| RFXcom 433mhz tranceiver              | [RFXtrx433E](http://www.rfxcom.com/epages/78165469.sf/nl_NL/?ObjectPath=/Shops/78165469/Categories/Transceivers)                                                                        | € 109,95 | online     |
| Smart meter cable                     | [P1 Smart meter cable](https://www.sossolutions.nl/slimme-meter-kabel)                                                                                                                  |  € 16,95 | online     |
| RPI, power adapter, sd card           | [RPI3B starter kit](https://www.sossolutions.nl/raspberry-pi-3b-starterkit)                                                                                                             |  € 52,95 | online     |
| RPI, power adapter, sd card, RFXcom** | [RPI3B starter kit + RFXtrx433E](https://www.sossolutions.nl/rfxcom-e-domoticz-starter-met-raspberry-pi3b)                                                                              | € 145,95 | online     |
| Wireless doorbell                     | [Select Plus 433mhz wireless doorbell](https://www.action.com/nl-nl/p/select-plus-draadloze-deurbel/)                                                                                   |   € 5,95 | Action     |
| 2x wall plug + remote                 | [KaKu APA2-2300R](https://www.klikaanklikuit.nl/nl/apa2-2300r-2-kanaals-afstandsbediening-stekkerdoos-schakelaars.html)                                                                 |  € 19,95 | DIY store* |
| 3x wall plug + remote                 | [KaKu APA3-1500R](https://www.klikaanklikuit.nl/nl/apa3-1500r-starterset.html)                                                                                                          |  € 29,99 | DIY store* |
| Sunscreen controller                  | [KaKu ASUN-650](https://www.klikaanklikuit.nl/nl/asun-650-schakelaar-voor-zonwering.html)                                                                                               |  € 41,99 | DIY store* |
| Wall push button                      | [KaKu AWST-8800](https://www.klikaanklikuit.nl/nl/awst-8800-draadloze-wandschakelaar.html)                                                                                              |  € 20,99 | DIY store* |
| Wall dual push button                 | [KaKu AWST-8802](https://www.klikaanklikuit.nl/nl/awst-8802-dubbele-draadloze-wandschakelaar.html)                                                                                      |  € 22,99 | DIY store* |
| Build-in TL-light switch***           | [KaKu AWMR-300](https://www.klikaanklikuit.nl/nl/awmr-300-mini-inbouw-schakelaar.html)                                                                                                  |  € 31,99 | DIY store* |
| Build-in switch                       | [KaKu AMU-500](https://www.klikaanklikuit.nl/nl/amu-500-universele-schakelaar.html)                                                                                                     |  € 29,99 | DIY store* |
| Temp + Humidity sensor                | [433MHz Weather Humidity](http://www.ebay.nl/itm/Wireless-Temp-Alert-Thermometer-Hygrometer-Meter-433MHz-Temperature-Humidity-NEW-/182558019276?hash=item2a814e4ecc:g:W7cAAOSwdGFY2hlG) |   € 7,17 | eBay       |

```
*   Dutch DIY stores like Gamma and Karwei reguarly have discounts on KaKu devices
**  The kit comes without a SD card, make sure you order it when you don't have one
*** For TL-light make sure you use the AWMR-300 and NOT the AWMR-230
```

# Running the DOMUSTO server

## Normal

```bash
cd src
npm run start
```

## Running DOMUSTO server with auto reload on changes
```bash
cd src
../node_modules/.bin/nodemon server.js
```

## Running DOMUSTO tests
```bash
npm test
```

# Setup

## Installing and upgrading NPM / Nodejs on RPI

By default the node package in Raspian is very old:

```bash
npm -v
1.4.21
```

```bash
node -v
v0.10.29
```

To upgrade the RPI to the latest node / npm:

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs
apt-get install nodejs
```

The new versions should became: (or higher)
```bash
node -v
v8.1.4
```

```bash
npm -v
5.0.3
```

source: http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/

## Install npm packages

```bash
npm install
```

## Setup configuration

Copy the config file template in the `src` folder to your own:

``` bash
cp src/config.example.js src/config.js
```

Edit the config file according to your setup.

## Run server

You can now run the server with
```bash
npm start
```

Once the server runs you can install the DOMUSTO client from https://github.com/basvdijk/domusto-client-vuejs

## Fixed names for USB port devices

If you have multiple USB devices connected, sometimes the order of the USB assignmets change after a reboot e.g. ttyUSB0 is suddenly ttyUSB1 and vice versa.

These pages on the Domoticz wiki show how to solve this issue by assigning fixed ports:

- https://www.domoticz.com/wiki/Assign_fixed_device_name_to_USB_port
- https://www.domoticz.com/wiki/PersistentUSBDevices
