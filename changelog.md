# Finger Lakes Reuse GameFrame

RMC = 2769314.05 / 365 = 7587.16;
IRC = 1998875.80 / 365 = 5476.37;
( 7587.16 + 5476.37 ) / 2 = 6531.76;

## RX () - String Compression

I would like to encode image assets, and data in general, into a single text ROM file. However doing so will
result in a large volume of text. Unless I add code that will help to reduce this such as lz-string compression.

```js
// LZString works well
// https://raw.githubusercontent.com/pieroxy/lz-string/4a94308c1e684fb98866f7ba1288f3db6d9f8801/libs/lz-string.js
const compressed = '㎇뀄ˠᘊ恶銁ⶆᖀ똄脱줸ܳ#Ŝੀ臜逆\uD9B1餄Ƭ쁦⒈Ĳ\x00';
console.log( compressed.length );               // 26
console.log( LZString.decompress(compressed) ); // 'so then this is my test string but it will look weird'
```

```
// atob is browser built in, but will not work as well as it is just a simple base64 encoding
const compressed = 'c28gdGhlbiB0aGlzIGlzIG15IHRlc3Qgc3RyaW5nIGJ1dCBpdCB3aWxsIGxvb2sgd2VpcmQ=';
console.log( compressed.length );  // 72
console.log( atob(compressed) );   // 'so then this is my test string but it will look weird'
```

## RX () - pull history
* have a pull history array rather than just a single object.
* a pull result contains data for the current logged in user.

## RX () - external file format
* external rom file format for starting 'meter' rom
* rollup script builds external meter.rom.js in a rom folder that is a child of dist

## pending changes

## R0 () - Core Idea of Project working
* have a starting form of a 'ROM'
* A Rom extends Phaser.Scene
* A Rom has an update method that can be used to update things on a frame by frame basis
* The latest pull result is part of the phaser game registry
* automate the process of getting up to date stats from data1
* get\_production\_data.js module started that can be used to get current production data
* added Phaser 3.90 as part of the over all source code of the framework
* using rollup to build the final state of the index.js file of the chrome extension

