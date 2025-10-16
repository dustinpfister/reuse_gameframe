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
const draw_meter = (ctx, result, store='RMC') => {
    const i = store === 'RMC' ? 0 : 1;
    const sy = 128 * i;
    const per = get_price_per(result, store);
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, sy, 256, 128);
    
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(128 - 50, sy + 96);
    ctx.arc(128, sy + 96, 50, Math.PI, Math.PI * 2.0, false);
    ctx.stroke();
    
    ctx.lineWidth = 8;
    let pro_color = 'red';
    if(per > 0.25){ pro_color = 'orange';}
    if(per > 0.50){ pro_color = 'lime';}
    ctx.strokeStyle = pro_color;
    ctx.beginPath();
    ctx.moveTo(128 - 50, sy + 96);
    ctx.arc(128, sy + 96, 50, Math.PI, Math.PI * (1 + per), false);
    ctx.stroke();
    
}
class Rom extends Phaser.Scene {

    constructor (scene) {
        super(scene);
        this.key = 'Rom';
    }

    create ( ) {
        const scene = this;
        const disp = scene.add.text(10, 10, '', {  });
        scene.game.registry.set('disp', disp);
        const texture = scene.textures.createCanvas('meter', 256, 256);
        scene.registry.set('texture', texture);
        texture.add(0, 0, 0,   0, 256, 128); // name, sourceIndex, x, y, w, h
        texture.add(1, 0, 0, 128, 256, 128);
        scene.add.sprite(128 + 320, 64 + 20, 'meter', 0);
        scene.add.sprite(128 + 320, 64 + 20 + 128 + 20, 'meter', 1);
    }
    
    draw () {
        const scene = this;
        const disp = scene.game.registry.get('disp');
        const result = scene.game.registry.get('pull_result');
        const texture = scene.registry.get('texture');
        const ctx = texture.context;
        if(!result){
            return
        }
        disp.text = '';
        push_text(disp, result, 'RMC');
        push_text(disp, result, 'IRC');

        draw_meter(ctx, result, 'RMC');
        draw_meter(ctx, result, 'IRC');
        texture.refresh();
    }
    
    pull ( result, date_now ) {
        const scene = this;
        console.log('new pull for: ' + date_now);
        console.log('RMC pricing: ' + result.RMC.tb['Total Pricing ($)']);
        console.log('IRC pricing: ' + result.IRC.tb['Total Pricing ($)']);
        console.log('');
    }
    
    update () {
        this.draw();
    }
    
};


class Boot extends Phaser.Scene {
    constructor (config) {
        super(config);
        this.key = 'Boot';
    }
    create () {
        const scene = this;
        const game = scene.game;
        scene.scene.add('Rom', Rom, false);
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
                    console.log(pull_result);
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

