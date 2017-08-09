This project is pre-pre-pre-alpha, so don't expect a working solution.

# API docs

See [the API docs](API.MD)

# Plugins
- [RFXcom](src/plugins/domusto-rfxcom)
- [P1 smart meter](src/plugins/domusto-p1)
- [Shell executer](src/plugins/domusto-shell)

# Tested hardware
- RFXcom
  - Weather
    - 433MHz Wireless Remote Weather Station Digital Thermometer Humidity Sensor
  - Switch
    - Klik-Aan-Klik-Uit / KAKU
    - Click-On-Click-Off / COCO
- P1 (via P1 to usb converter)
  - Landis+Gyr E350

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
cd src
npm run start
```

Once the server runs you can install the DOMUSTO client from https://github.com/basvdijk/domusto-client-vuejs

## Fixed names for USB port devices

If you have multiple USB devices connected, sometimes the order of the USB assignmets change after a reboot e.g. ttyUSB0 is suddenly ttyUSB1 and vice versa.

These pages on the Domoticz wiki show how to solve this issue by assigning fixed ports:

- https://www.domoticz.com/wiki/Assign_fixed_device_name_to_USB_port
- https://www.domoticz.com/wiki/PersistentUSBDevices