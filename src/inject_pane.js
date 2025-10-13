const inject_pane = ( id_prefix='ctf', label='Color Tag Fix', content='' ) => {
    const el_li = document.createElement('li');
    const id_pane = id_prefix + '-pane';
    el_li.innerText = label;
    el_li.setAttribute('id', id_prefix + '-nav-link');
    el_li.setAttribute('class', 'targetTabChange nav-link');
    el_li.setAttribute('style', 'cursor:pointer;');
    el_li.setAttribute('href', '#' + id_pane );
    el_li.setAttribute('data-toggle', 'tab');
    el_li.setAttribute('role', 'tab');
    el_li.setAttribute('aria-selected', 'false');
    const nav_parent = document.querySelectorAll('.nav-tabs')[0];
    nav_parent.appendChild(el_li);
    nav_parent.addEventListener('click', (el) => {
        if(el.target != el_li){
            el_li.className = 'targetTabChange nav-link';
            el_li.setAttribute('aria-selected', 'false');
        }
    });
    const el_div = document.createElement('div');
    if(typeof content === 'string'){
        el_div.innerText = content;
    }
    if(typeof content === 'object'){
        el_div.appendChild(content);
    }
    el_div.setAttribute('class', 'tab-pane');
    el_div.setAttribute('id', id_pane);
    el_div.setAttribute('role', 'tabpanel');
    document.querySelectorAll('.tab-content')[0].appendChild(el_div);
};
const remove_pane = ( id_prefix='ctf' ) => {
     [id_prefix + '-nav-link', id_prefix + '-pane'].forEach( (id) => {
         const el = document.getElementById(id);
         if(el){
             el.remove();
         }
     })
};
export { inject_pane, remove_pane };
