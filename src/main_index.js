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
        const disp = this.add.text(10, 10, '', {  });
        const push_text = (disp, result, store='RMC') => {
            disp.text += 'store: ' + store + '\n';
            Object.keys( result[store].tb ).forEach((key) => {
                const n = result[store].tb[key];
                disp.text += key + ': ' + n + '\n' ;
            });
            disp.text += '\n\n';
        }
        get()
        .then((result)=>{
            console.log( result );
            push_text(disp, result, 'RMC');
            push_text(disp, result, 'IRC');
        });
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

