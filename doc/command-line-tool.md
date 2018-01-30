# DOMUSTO command line tool
DOMUSTO server is equipped with a command line tool for easy DOMUSTO management like upgrading, install plugins etc.

## DOMUSTO server
Upgrade DOMUSTO server to the lastest version

```bash
./domusto.js upgrade   upgrade DOMUSTO
```

## DOMUSTO server plugins
**Install plugin by Git repo name**
```
./domusto.js plugin add [REPO]
```
Example:
```bash
./domusto.js plugin add basvdijk/domusto-marantz
```

**Remove plugin by Git repo name**
```bash
./domusto.js plugin remove [REPO]
```
Example:
```bash
./domusto.js plugin remove basvdijk/domusto-marantz
```

**Upgrade all installed DOMUSTO plugins**
```bash
./domusto.js plugin upgrade
```

**Re-install all plugin dependencies**
```bash
./domusto.js plugin install-deps    
```

**List all available DOMUSTO plugins**
```bash
./domusto.js plugin list
```

**List all installed DOMUSTO plugins**
```bash
./domusto.js plugin installed
```