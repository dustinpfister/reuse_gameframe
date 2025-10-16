import { readFile } from 'fs/promises';
const packageJSON = JSON.parse( await readFile( new URL('./package.json', import.meta.url) ) );
/********* **********
GENERATE MANIFEST ROLLUP PLUGIN
********** *********/
const manifest = function( data={} ) {
    data = Object.assign({}, {
        manifest_version: 3,
        version : packageJSON.version.split('.').slice(0, 2).join('.')
    }, data);
    return {
        name: 'update_manifest',
        resolveId ( source ) {
            if (source === 'update_manifest') {
                return source;
            }
            return null;
        },
        async generateBundle(output, bundle) {
            const file = {
                type: 'asset',
                source: JSON.stringify(data, null, 2), 
                name: 'Rollup manifest Asset',
                fileName: 'manifest.json'
            };
            this.emitFile(file);
        }
    };
};
/********* **********
EXPORT
********** *********/
const DATA_MANIFEST = {
    name: 'Reuse Data1 GameFrame',
    description: 'A Game FrameWork for data1 at Finger Lakes Reuse',
    content_scripts: [
        {
            js: [ 'index.js' ], 
            matches: [ 
                'https://data1.ithacareuse.org/pricing/portal/RMC/',
                'https://data1.ithacareuse.org/pricing/portal/IRC/'
            ]
        }
    ],
    permissions: ['scripting', 'storage', 'activeTab']
};
export default [
    {
	    input: 'src/main_index.js',
	    plugins: [ manifest( DATA_MANIFEST ) ],
	    output: {
	        file: 'dist/index.js',
	        format: 'iife'
	    }
    }
    /*
    {
	    input: 'src/rom_meter.js',
	    output: {
	        file: 'dist/roms/meter.rom.js',
	        name: 'Rom',
	        format: 'iife'
	    }
    }
    */
];
