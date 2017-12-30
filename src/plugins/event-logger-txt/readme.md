# TXT logger

```
plugin:    Logger to txt files
author:    Bas van Dijk
category:  logger
version:   0.0.1
website:   http://domusto.com
```

## Description
Logs all DOMUSTO events to txt files in the `log` folder:
- input.txt for input events
- output.txt for output events
- timers.txt for timer events
- error.txt for errors

## Configuration

1. Add the section below to your `config.ts`
2. Restart DOMUSTO

```js
    loggerPlugins: [
        'domusto-logger-txt'
    ],
```