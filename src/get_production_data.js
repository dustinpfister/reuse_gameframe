const format_date = ( date = new Date()) => {
    return date.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate();
};

const create_get_between_patt = (open='', close='') => {
    return new RegExp( '(?<=' + open + ').*?(?=' + close + ')','gs');
};

const get_tb_data = ( html='' ) => {
    const patt1 = create_get_between_patt('\<!--', '--\>');
    const patt2 = create_get_between_patt('\<h5 class=\"card-title\"\>', '\<\/h5');
    const patt3 = create_get_between_patt('\<h1 class\=\"display-5 mt-1 mb-3\"\>', '\<\/h1');
    const html_clean = html.replace( patt1, '' ); 
    const arr_desc = html_clean.match(patt2);
    const arr_value = html_clean.match(patt3);
    return arr_desc.filter( ( str ) => {
        return str != 'TBD';
    }).reduce((acc, str, i) => {
        let n = parseFloat( arr_value[i].replace('$', '') );
        n = String(n) === 'NaN' ? 0 : n;
        acc[ str ] = n;
        return acc;
    }, {});
};

const get_raw_html = ( store = 'RMC', date_start = new Date(), date_end = new Date() ) => {
    const str_start = format_date(date_start);
    const str_end = format_date(date_end);
    const url = 'https://data1.ithacareuse.org/pricing/stats/' + store + '/?start=' + str_start + '&end=' + str_end;
    return fetch(url)
    .then((result)=>{
        return result.text();
    })
    .then((html)=>{
        return html;
    });
};

const get_store_data = (store = 'RMC', date_start = new Date(), date_end = new Date()) => {
    const data = {
        store: store,
        tb: {}
    };
    return get_raw_html(store, date_start, date_end)
    .then((html)=>{
        data.tb = get_tb_data(html);
        return data;
    });
};

const get = ( date_start = new Date(), date_end = new Date() ) => {
    const data = {
        date_start: date_start,
        date_end : date_end
    };
    return get_store_data('RMC', date_start, date_end)
    .then(( result ) => {
        data['RMC'] = result;
        return get_store_data('IRC', date_start, date_end);
    })
    .then(( result ) => {
        data['IRC'] = result;
        return data;
    });
};

export { get };

