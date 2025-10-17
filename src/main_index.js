import * as Phaser from './phaser.esm.js';
import { inject_pane } from './inject_pane';
import { get } from './get_production_data.js';

import { Rom } from './rom_meter.js';

/********* **********
PHASER / CANVAS
********** *********/
const canvas = document.createElement('canvas');
canvas.setAttribute('style', 'display: block;margin-left: auto;margin-right: auto;');
canvas.width = 640;
canvas.height = 480;

class Boot extends Phaser.Scene {
    constructor (config) {
        super(config);
        this.key = 'Boot';
    }
    create () {
        const scene = this;
        const game = scene.game;
        const scenePlugin = scene.scene;
        const sceneManager = scenePlugin.manager;
        scenePlugin.add('Rom', Rom, false);
        game.registry.set('PULL_LT', new Date(0) );
        game.registry.set('PULL_DELAY', 15000 );
        game.registry.set('pull_result', null);
        game.events.on('step', function() {
            const scenes = game.scene.getScenes(true, false) || [] ;
            const scene_current = scenes[0];
            const date_lp = game.registry.get('PULL_LT');
            const date_now = new Date();
            const ms = date_now - date_lp;
            if(scene_current && ms >= game.registry.get('PULL_DELAY') ){
                game.registry.set('PULL_LT', date_now);        
                get()
                .then((pull_result)=>{
                    const rom = scene.scene.get('Rom');
                    game.registry.set('pull_result', pull_result);
                    rom.pull(pull_result, date_now);
                });
            }
        }, scene);
        scene.scene.start('Rom');
    }
};
const config = {
    parent: 'container_flr',
    canvas: canvas,
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#000000',
    scene: Boot,
    zoom: 1,
    render: { pixelArt: true  },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 }
        }
    }
};
const game = window.game = new Phaser.Game(config);
/********* **********
INJECT GF PANE
********** *********/
inject_pane('gf', 'GameFrame', canvas);

