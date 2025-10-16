/********* **********
'meter' ROM file for Reuse GameFrame project
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
const Rom = {
    create: function( ) {
        const scene = this;
        const disp = scene.add.text(10, 10, '', {  });
        scene.game.registry.set('disp', disp);
        const texture = scene.textures.createCanvas('meter', 256, 256);
        scene.registry.set('texture', texture);
        texture.add(0, 0, 0,   0, 256, 128); // name, sourceIndex, x, y, w, h
        texture.add(1, 0, 0, 128, 256, 128);
        scene.add.sprite(128 + 320, 64 + 20, 'meter', 0);
        scene.add.sprite(128 + 320, 64 + 20 + 128 + 20, 'meter', 1);
    },
    draw: function( ) {
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
    },
    pull: function( result, date_now ) {
        const scene = this;
        console.log('new pull for: ' + date_now);
        console.log('RMC pricing: ' + result.RMC.tb['Total Pricing ($)']);
        console.log('IRC pricing: ' + result.IRC.tb['Total Pricing ($)']);
        console.log('');
    },
    update: function( ) {
        this.draw();
    }
};

export { Rom }
