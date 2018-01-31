# DOMUSTO server API guide

## Endpoints

DOMUSTO server comes with several API endpoints:

| Description                          | API endpoint                      |
|--------------------------------------|-----------------------------------|
| [List input devices](api-input.md)   | http://192.168.178.10:3000/input  |
| [List output devices](api-output.md) | http://192.168.178.10:3000/output |

## Socket.io
Updates of devices are broadcasted via a socket.io channel on the server address e.g. `http://192.168.178.72:3000`.