# DOMUSTO server maintenance guide

## Upgrading DOMUSTO server
You can use the DOMUSTO server command-line tool to upgrade DOMUSTO server to the lastest version:
```bash
./domusto.js upgrade
```

## Upgrading Nodejs after DOMUSTO installation

First set the package source to the latest version and upgrade nodejs.

```bash
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt install nodejs
```

When updating nodejs after you installed DOMUSTO server. You need to remove the `node_modules` folder, install the DOMUSTO depencencies and plugin dependencies again:

```bash
rm -rf node_modules && npm install && ./domusto.js plugin install-deps
```