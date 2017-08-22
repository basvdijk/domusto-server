# Timers

Timers switch on or off on a certain time. There are two types of timers `time` and `sun`. `Time` is time related and uses cron notation, while the `sun` is sun related e.g. sunset, sunrise etc.

## Example timer 1

### Conditions
- We want the lights to turn on at sunset every day.
- During the normal days we want to turn off the lights at 23:00h. 
- On Friday and Saturday we are going to sleep late around 0:30h, therefore we want to have the garden lights to be turned off later. 

One thing is very important to note here. The mentioned 0:30h is actually already in the next day. So to turn off our lights correctly we have to turn them off late on *Saturday and Sunday morning*.

At first sight the timers defined below look weird, Sunday is defined twice and Monday is missing. Actually this is correct. On Sunday morning at 0:30h the light goes off which we switched on after sunset on Saturday evening. However on this same Sunday the go on at sunset and off on 23:00h.

```js
{
    enabled: true,
    type: 'sun',
    condition: 'sunset',
    state: 'on'
},

{
    enabled: true,
    type: 'time',
    time: '0 0 23 * * SUN-THU',
    state: 'off'
},

{
    enabled: true,
    type: 'time',
    time: '0 30 0 * * SAT-SUN',
    state: 'off'
}
```

## Sun timer options

| Property        | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| `sunrise`       | sunrise (top edge of the sun appears on the horizon)                     |
| `sunriseEnd`    | sunrise ends (bottom edge of the sun touches the horizon)                |
| `goldenHourEnd` | morning golden hour (soft light, best time for photography) ends         |
| `solarNoon`     | solar noon (sun is in the highest position)                              |
| `goldenHour`    | evening golden hour starts                                               |
| `sunsetStart`   | sunset starts (bottom edge of the sun touches the horizon)               |
| `sunset`        | sunset (sun disappears below the horizon, evening civil twilight starts) |
| `dusk`          | dusk (evening nautical twilight starts)                                  |
| `nauticalDusk`  | nautical dusk (evening astronomical twilight starts)                     |
| `night`         | night starts (dark enough for astronomical observations)                 |
| `nadir`         | nadir (darkest moment of the night, sun is in the lowest position)       |
| `nightEnd`      | night ends (morning astronomical twilight starts)                        |
| `nauticalDawn`  | nautical dawn (morning nautical twilight starts)                         |
| `dawn`          | dawn (morning nautical twilight ends, morning civil twilight starts)     |

Source: https://raw.githubusercontent.com/mourner/suncalc/master/README.md