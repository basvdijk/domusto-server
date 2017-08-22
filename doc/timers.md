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