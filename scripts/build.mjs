import fs from 'node:fs';
import {build} from 'esbuild';
fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});
await build({entryPoints:['src/server.mjs'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',loader:{'.html':'text','.css':'text','.webp':'dataurl'},plugins:[{name:'client-as-text',setup(b){b.onLoad({filter:/client\.js$/},async args=>({contents:fs.readFileSync(args.path,'utf8'),loader:'text'}))}}]});
fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
fs.cpSync('drizzle','dist/.openai/drizzle',{recursive:true});
