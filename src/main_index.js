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
class Boot extends Phaser.Scene {
    constructor (config) {
        super(config);
        this.key = 'Boot';
    }
    create () {
        const scene = this;
        const disp = this.add.text(10, 10, '', {  });
        
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
                    disp.text = '';
                    push_text(disp, result, 'RMC');
                    push_text(disp, result, 'IRC');
                    
                    console.log('new pull for: ' + date_now);
                    console.log('RMC pricing: ' + result.RMC.tb['Total Pricing ($)']);
                    console.log('IRC pricing: ' + result.IRC.tb['Total Pricing ($)']);
                    console.log('RMC per: ' + get_price_per(result, 'RMC') + ', IRC per: ' + get_price_per(result, 'IRC') );
                    console.log('');
                    
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

