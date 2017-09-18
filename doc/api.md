|Description | API endpoint |
|--------------------------------------|-----------------------------------------
| [List input devices](api-input.md)   | `http://192.168.178.10:3000/input`     |
| [List output devices](api-output.md) | `http://192.168.178.10:3000/output`    |


# Switches

**Turn switch on**
----
  Turns a switch on by device ID.

* **URL**

  `/output/command/:deviceId/on`

* **Method:**

  `GET`
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ state : on }`
 
* **Sample Call:**

  * http://127.0.0.1/1/on



**Turn switch off**
----
  Turns a switch off by device ID.

* **URL**

  `/output/command/:deviceId/on`

* **Method:**

  `GET`
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ state : off }`
 
* **Sample Call:**

  * http://127.0.0.1/1/off



**Trigger switch**
----
  Trigger momentary switch by device ID.

* **URL**

  `/output/command/:deviceId/trigger`

* **Method:**

  `GET`
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ state : off }`
 
* **Sample Call:**

  * http://127.0.0.1/1/trigger


# Inputs

**List all input data**
----
  Turns a switch on by device ID.

* **URL**

  `/input

* **Method:**

  `GET`
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"0x7003":{"subtype":13,"id":"0x7003","seqnbr":0,"temperature":26.2,"humidity":51,"humidityStatus":1,"batteryLevel":0,"rssi":6}}`
 
* **Sample Call:**

  * http://127.0.0.1/input