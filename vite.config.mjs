import fs from 'node:fs';
import path from 'node:path';
import {defineConfig} from 'vite';
import {upgradeHome} from './src/home-upgrade.mjs';
import {localizeHome} from './src/i18n.mjs';

const root=process.cwd();
const json=(response,value,status=200)=>{
 response.statusCode=status;
 response.setHeader('content-type','application/json; charset=utf-8');
 response.end(JSON.stringify(value));
};
const file=name=>fs.readFileSync(path.join(root,name),'utf8');
const dataImage=name=>'data:image/webp;base64,'+fs.readFileSync(path.join(root,name)).toString('base64');

function previewHtml(code='pt'){
 const snapshot=JSON.parse(file('src/snapshot.json'));
 const initial=JSON.stringify({items:snapshot.news,updatedAt:snapshot.updatedAt,stale:true,sources:[{name:'Prévia local',available:true}]}).replace(/</g,'\\u003c');
 const html=upgradeHome(file('src/page.html')
  .replace('/*CSS*/',()=>file('src/style.css')+'\n'+file('src/additions.css'))
  .replace('/*JS*/',()=>file('src/client.js'))
  .replace('/*GOAL_LIVERPOOL*/',()=>dataImage('src/assets/flamengo-liverpool-1981.webp'))
  .replace('/*GOAL_RIVER*/',()=>dataImage('src/assets/flamengo-river-2019.webp'))
  .replace('/*GOAL_SANTOS*/',()=>dataImage('src/assets/santos-flamengo-2011.webp')));
 return localizeHome(html,code).replace('<script>','<script id="nrn-initial-data" type="application/json">'+initial+'</script><script>');
}

function previewApi(){
 return {name:'nacao-preview',configureServer(server){
  server.middlewares.use((request,response,next)=>{
   const url=new URL(request.url,'http://terminal.local');
   if(request.method==='GET'&&url.pathname.startsWith('/__mobile/')){
    const width=Math.max(320,Math.min(480,Number(url.pathname.split('/').at(-1))||390));
    const lang=['en','es'].includes(url.searchParams.get('lang'))?url.searchParams.get('lang'):'';
    response.statusCode=200;
    response.setHeader('content-type','text/html; charset=utf-8');
    response.end('<!doctype html><meta charset="utf-8"><title>Mobile QA '+width+'</title><style>*{box-sizing:border-box}html,body{margin:0;background:#29282b}body{display:grid;place-items:start center;padding:18px}iframe{display:block;width:'+width+'px;height:844px;border:0;background:#070305;box-shadow:0 16px 55px #000;border-radius:12px}</style><iframe title="Prévia mobile" src="/'+lang+'?qa='+width+'"></iframe>');
    return;
   }
   if(request.method==='GET'&&['/','/en','/es'].includes(url.pathname)){
    response.statusCode=200;
    response.setHeader('content-type','text/html; charset=utf-8');
    response.end(previewHtml(url.pathname==='/en'?'en':url.pathname==='/es'?'es':'pt'));
    return;
   }
   if(request.method==='GET'&&url.pathname==='/api/news'){
    const data=JSON.parse(file('src/snapshot.json'));
    json(response,{items:data.news,updatedAt:data.updatedAt,stale:true,sources:[{name:'Prévia local',available:true}]});return;
   }
   if(request.method==='GET'&&url.pathname==='/api/matches'){json(response,JSON.parse(file('src/schedule-snapshot.json')));return}
   if(request.method==='GET'&&url.pathname==='/api/players'){json(response,JSON.parse(file('src/official-roster.json')));return}
   if(request.method==='GET'&&url.pathname==='/api/polls'){json(response,{polls:[{id:'melhor-2026-09',total:0,options:[],mine:null},{id:'saida-2026-09',total:0,options:[],mine:null}]});return}
   if(request.method==='GET'&&url.pathname==='/api/match-opinions'){json(response,{predictions:[],ratings:[]});return}
   if(request.method==='GET'&&url.pathname==='/api/groups'){json(response,{groups:[],nextCursor:null});return}
   if(url.pathname==='/sw.js'){response.statusCode=200;response.setHeader('content-type','text/javascript');response.end('');return}
   next();
  });
 }};
}

export default defineConfig({
 server:{host:'0.0.0.0',allowedHosts:['terminal.local']},
 plugins:[previewApi()]
});
