# Finger Lakes Reuse GameFrame - ideas for future revisions

## Rx () - external rom file ( as string ) format?

I was thinking that it would be nice to have a rom file format where everything is packaged as a string. This includes images, audio, and code. However I ran into problems.

Although I was able to get a rom to load in one of my test\_phaser repo projects. I was not able to get this working in a chrome extension, likely because of security concerns when it comes to code injection attacks. Still there should be a fair use way of doing something like this. Maybe there is a way to do this by using the chrome extension scripting api?

```
const rom_str = 'class Rom extends Phaser.Scene {constructor (scene) { super(scene);this.key = \'Rom\';}create ( ) {}draw () {}pull ( result, date_now ) {}update () {}};export { Rom };';

const LoadRomString = (rom_str='') => {
    const dataUrl = `data:text/javascript,${encodeURIComponent(rom_str)}`;
    return import(dataUrl)
    .then((module)=>{
        if(!module.Rom){
            return Promise.reject('No Rom export found in given rom string.');
        }
        return module.Rom;
    });
};
```

## RX () - avg daily dollar amount between stores

Have an average amount of money for a single day, between both stores.

```
RMC = 2769314.05 / 365 = 7587.16;
IRC = 1998875.80 / 365 = 5476.37;
( 7587.16 + 5476.37 ) / 2 = 6531.76;
```

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


