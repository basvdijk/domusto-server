# DOMUSTO server installation

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
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
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

## Install DOMUSTO server plugins

To show all available DOMUSTO server plugins, run:
```
./domusto.js plugin list
```

For more information about plugin installation run
```
./domusto.js
```

## Fixed names for USB port devices

If you have multiple USB devices connected, sometimes the order of the USB assignmets change after a reboot e.g. ttyUSB0 is suddenly ttyUSB1 and vice versa.

These pages on the Domoticz wiki show how to solve this issue by assigning fixed ports:

- https://www.domoticz.com/wiki/Assign_fixed_device_name_to_USB_port
- https://www.domoticz.com/wiki/PersistentUSBDevices
