# DOMUSTO plugin api endpoint development

## How to start
Before deep diving into DOMUSTO plugin api development you have to create a plugin [See the DOMUSTO plugin guide](./development-plugin.md)

Creating endpoints is pretty straightforward. Basically you register an api route with its callback. In order to call plugin functions you have to register the plugin to the api.

## Setup the api

First create `api.ts` in your plugin folder and use the folowing skeleton:

```ts
import DomustoPluginApi from '../../domusto/DomustoPluginApi';

class DomustoShellApi extends DomustoPluginApi {

    constructor() {

        // Create api endpoint /plugin/domusto-shell
        super('domusto-shell');

        // Test route
        this.addApiRouteGet(':deviceId', (request, response) => {
            response.json(true);
        });

        // executes command specified
        this.addApiRouteGet('execute-command/:command', (request, response) => {

            this.pluginInstance.executeCommand(request.params.command, (stdOut) => {

                response.json({
                    command: request.params.command,
                    success: true,
                    output: stdOut
                });

            });

        });

    }


}

let DomustoShellApiInstance = new DomustoShellApi();
export default DomustoShellApiInstance;
```

As you can see you can access your plugin methods via `this.pluginInstance`.

The only thing left is to import the api module in your plugin module. In the plugin constructor register the plugin instance to your plugins' API module e.g. `DomustoShellApi.setPluginInstance(this);`

You can verify the registered routes by visiting `http://192.168.178.2:3000/api`.