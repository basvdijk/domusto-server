# DOMUSTO server command line tool
DOMUSTO server is equipped with a command line tool for easy DOMUSTO management like upgrading, install plugins etc.

```bash
-------------------------------------------------------------------------------
      🔈 💡 🚨 ⛅ ️🌡 🔌 🏠   DOMUSTO Home Automation manager  🏠 🔌 🌡️ ⛅ 🚨 💡 🔈
-------------------------------------------------------------------------------

DOMUSTO
Use ctrl+c to stop server
 npm run start         start server
 npm run dev           start server with live refresh on .ts changes

./domusto.js upgrade   upgrade DOMUSTO

PLUGIN COMMANDS:
Example: ./domusto.js plugin add basvdijk/domusto-marantz

 ./domusto.js plugin add [REPO]      install plugin by Git repo name
 ./domusto.js plugin remove [REPO]   remove plugin by Git repo name
 ./domusto.js plugin upgrade         upgrade all installed DOMUSTO plugins
 ./domusto.js plugin install-deps    re-install all plugin dependencies
 ./domusto.js plugin list            list all available DOMUSTO plugins
 ./domusto.js plugin installed       list all installed DOMUSTO plugins

 -------------------------------------------------------------------------------
 ```
