# Finger Lakes Reuse GameFrame

## pending changes

* a pull result contains data for the current logged in user.
* handle requests when offline
* see about adressing 'loss of context' problem
* external rom file format for starting 'meter' rom
* rollup script builds external meter.rom.js in a rom folder that is a child of dist

## R1 ( ) - User data in result object 

## R0 ( done 10/17/2025 ) - Core Idea of Project working
* have a starting form of a 'ROM'
* A Rom extends Phaser.Scene
* A Rom has an update method that can be used to update things on a frame by frame basis
* The latest pull result is part of the phaser game registry
* automate the process of getting up to date stats from data1
* get\_production\_data.js module started that can be used to get current production data
* added Phaser 3.90 as part of the over all source code of the framework
* using rollup to build the final state of the index.js file of the chrome extension

