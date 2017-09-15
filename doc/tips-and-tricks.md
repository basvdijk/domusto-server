# Tips & Tricks

## Comments in config

It is a good practice to comment your config in order to remember device ids. For example:

```js
{
    id: 'KAKU1',
    enabled: true,
    role: 'output',
    name: 'modem', 
    type: 'switch',
    subtype: 'on/off',
    protocol: {
        pluginId: 'RFXCOM',
        type: 'Lighting2',
        subType: 'AC',
        outputId: '0x0E24B7E/10',
        inputIds: [
            '0x010CE4C6/2',  // bedroom remote
            '0x010CE4C6/1'   // bedroom wall button
        ]
    },
}
```

The `inputIds` are commented. This makes it easy understand where the codes come from.