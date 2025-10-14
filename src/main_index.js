import * as Phaser from './phaser.esm.js';
import { inject_pane } from './inject_pane';
import { get } from './get_production_data.js';
/********* **********
PHASER / CANVAS
********** *********/
const canvas = document.createElement('canvas');
canvas.setAttribute('style', 'display: block;margin-left: auto;margin-right: auto;');
canvas.width = 640;
canvas.height = 480;
/********* **********
ROM PROTOTYPE
********** *********/
const push_text = (disp, result, store='RMC') => {
    disp.text += 'store: ' + store + '\n';
    Object.keys( result[store].tb ).forEach((key) => {
        const n = result[store].tb[key];
        disp.text += key + ': ' + n + '\n' ;
    });
    disp.text += '\n\n';
};
const get_price_per = ( result, store='RMC', avg=6531.76) => {
    const pricing = result[store].tb['Total Pricing ($)'];
    let per = pricing / ( avg * 2 );
    per = per < 0 ? 0 : per;
    per = per > 1 ? 1 : per;
    return parseFloat( per.toFixed(2) );
};
const Rom = {

    create: ( Rom, scene ) => {
        const disp = scene.add.text(10, 10, '', {  });
        scene.game.registry.set('disp', disp);
        const texture = scene.textures.createCanvas('meter', 256, 256);
        scene.registry.set('texture', texture);
        // add frames
        // name, sourceIndex, x, y, w, h
        texture.add(0, 0, 0,   0, 256, 128);
        texture.add(1, 0, 0, 128, 256, 128);
        scene.add.sprite(128 + 320, 64 + 20, 'meter', 0);
        scene.add.sprite(128 + 320, 64 + 20 + 128 + 20, 'meter', 1);
        Rom.draw(Rom, scene);
    },
    
    draw: (Rom, scene) => {
        const texture = scene.registry.get('texture');
        const ctx = texture.context;
        let r = Math.floor( Math.random() * 3 );
        ctx.fillStyle = 'red,blue,green'.split(',').slice(r, r + 1);
        ctx.fillRect(0,   0, 256, 128);
        r = Math.floor( Math.random() * 3 );
        ctx.fillStyle = 'yellow,white,orange'.split(',').slice(r, r + 1);
        ctx.fillRect(0, 128, 256, 128);
        texture.refresh();
    },
    
    pull: (Rom, scene, result, date_now) => {
    
        const disp = scene.game.registry.get('disp');    
        disp.text = '';
        push_text(disp, result, 'RMC');
        push_text(disp, result, 'IRC');
                    
        console.log('new pull for: ' + date_now);
        console.log('RMC pricing: ' + result.RMC.tb['Total Pricing ($)']);
        console.log('IRC pricing: ' + result.IRC.tb['Total Pricing ($)']);
        console.log('RMC per: ' + get_price_per(result, 'RMC') + ', IRC per: ' + get_price_per(result, 'IRC') );
        console.log('');
        Rom.draw(Rom, scene);
    }

}


class Boot extends Phaser.Scene {
    constructor (config) {
        super(config);
        this.key = 'Boot';
    }
    create () {
        const scene = this;
        const game = scene.game;
        
        Rom.create(Rom, scene);
        
  

        
        
        game.registry.set('PULL_LT', new Date(0) );
        game.registry.set('PULL_DELAY', 15000 );
        
        game.events.on('step', function() {
            const scenes = game.scene.getScenes(true, false) || [] ;
            const scene_current = scenes[0];
            const date_lp = game.registry.get('PULL_LT');
            const date_now = new Date();
            const ms = date_now - date_lp;
            if(scene_current && ms >= game.registry.get('PULL_DELAY') ){
                game.registry.set('PULL_LT', date_now);        
                get()
                .then((result)=>{
                    
                    Rom.pull(Rom, scene, result, date_now);
                    
                });
                
            }
        }, scene);
        
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

