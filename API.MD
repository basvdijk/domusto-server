# Switches

**Turn switch on**
----
  Turns a switch on by device ID.

* **URL**

  `/switch/deviceId/on`

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

  `/switch/deviceId/off`

* **Method:**

  `GET`
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ state : off }`
 
* **Sample Call:**

  * http://127.0.0.1/1/off


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