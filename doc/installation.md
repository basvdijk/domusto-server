# DOMUSTO server installation guide

## Installing and upgrading NPM / Nodejs on RPI

When installing on a Raspberry Pi you first need to ugprade node.js. By default the node package in Raspian is very old:

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
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs
```

The new versions should became: (or higher)
```bash
node -v
v9.4.0
```

```bash
npm -v
5.0.3
```

source: http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/

## Checkout DOMUSTO server from Github
```bash
git clone https://github.com/basvdijk/domusto-server.git
```

## Install npm packages
DOMUSTO server has some dependencies which needs to be installed.

```bash
npm install
```

## Setup configuration

Copy the config file template in the `src` folder to your own:

``` bash
cp src/config.example.ts src/config.ts
```

Edit this config file according your needs.

## Install Git
In order to use the DOMUSTO client `./domusto.js` you need to have Git installed
```bash
sudo apt-get install git
```

## Install DOMUSTO server plugins
[See the DOMUSTO plugin guide](../src/domusto-plugins/README.MD)

## Fixed names for USB port devices

If you have multiple USB devices connected, sometimes the order of the USB assignmets change after a reboot e.g. ttyUSB0 is suddenly ttyUSB1 and vice versa.

These pages on the Domoticz wiki show how to solve this issue by assigning fixed ports:

- https://www.domoticz.com/wiki/Assign_fixed_device_name_to_USB_port
- https://www.domoticz.com/wiki/PersistentUSBDevices


# Running the DOMUSTO server

## Running DOMUSTO server
```bash
npm run start
```

## Running DOMUSTO server with auto reload on changes
```bash
npm run dev
```

## Running DOMUSTO tests
```bash
npm test
```
