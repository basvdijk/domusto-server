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

