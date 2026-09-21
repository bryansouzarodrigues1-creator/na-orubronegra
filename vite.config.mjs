import fs from 'node:fs';
import path from 'node:path';
import {defineConfig} from 'vite';
import {upgradeHome} from './src/home-upgrade.mjs';
import {localizeHome} from './src/i18n.mjs';
import {deliverImage} from './src/media.mjs';

const root=process.cwd();
const json=(response,value,status=200)=>{
 response.statusCode=status;
 response.setHeader('content-type','application/json; charset=utf-8');
 response.end(JSON.stringify(value));
};
const file=name=>fs.readFileSync(path.join(root,name),'utf8');
const dataImage=name=>'data:image/webp;base64,'+fs.readFileSync(path.join(root,name)).toString('base64');
const categoryCovers={
 matchday:dataImage('src/assets/category-matchday.webp'),
 discussion:dataImage('src/assets/category-discussion.webp'),
 videos:dataImage('src/assets/category-videos.webp'),
 votes:dataImage('src/assets/category-votes.webp'),
 groups:dataImage('src/assets/category-groups.webp'),
 history:dataImage('src/assets/category-history.webp')
};
const foldName=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const roster=()=>JSON.parse(file('src/official-roster.json'));
function previewMatches(){
 const players=roster().players;
 const schedule=JSON.parse(file('src/schedule-snapshot.json'));
 schedule.matches=schedule.matches.map(match=>({...match,lineups:(match.lineups||[]).map(group=>{
  const flamengo=String(group.teamId)==='819'||foldName(group.team).includes('flamengo');
  return {...group,starters:(group.starters||[]).map(player=>{
   if(player.photo)return player;
   const name=foldName(player.name),official=flamengo?players.find(row=>{
    const candidate=foldName(row.name);
    return String(row.id)===String(player.id)||candidate===name||candidate.includes(name)||name.includes(candidate);
   }):null;
   if(official?.photo)return {...player,id:official.id||player.id,photo:'/api/player-photo?id='+encodeURIComponent(official.id),photoSource:official.photoSource};
   return player.fallbackPhoto?{...player,photo:player.fallbackPhoto}:player;
  })};
 })}));
 return schedule;
}
function sendBuffer(response,body,type,cache='public, max-age=3600'){
 response.statusCode=200;response.setHeader('content-type',type);response.setHeader('cache-control',cache);response.end(body);
}
async function bridgeResponse(response,webResponse){
 response.statusCode=webResponse.status;
 for(const [key,value] of webResponse.headers)response.setHeader(key,value);
 response.end(Buffer.from(await webResponse.arrayBuffer()));
}

function previewHtml(code='pt'){
 const snapshot=JSON.parse(file('src/snapshot.json'));
 const initial=JSON.stringify({items:snapshot.news,updatedAt:snapshot.updatedAt,stale:true,sources:[{name:'Prévia local',available:true}]}).replace(/</g,'\\u003c');
 const html=upgradeHome(file('src/page.html')
  .replace('/*CSS*/',()=>file('src/style.css')+'\n'+file('src/additions.css'))
  .replace('/*JS*/',()=>file('src/client.js'))
  .replace('/*GOAL_LIVERPOOL*/',()=>dataImage('src/assets/flamengo-liverpool-1981.webp'))
  .replace('/*GOAL_RIVER*/',()=>dataImage('src/assets/flamengo-river-2019.webp'))
  .replace('/*GOAL_SANTOS*/',()=>dataImage('src/assets/santos-flamengo-2011.webp')),categoryCovers);
 return localizeHome(html,code).replace('<script>','<script id="nrn-initial-data" type="application/json">'+initial+'</script><script>');
}

function previewApi(){
 return {name:'nacao-preview',configureServer(server){
  server.middlewares.use(async(request,response,next)=>{
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
   if(request.method==='GET'&&url.pathname==='/api/matches'){json(response,previewMatches());return}
   if(request.method==='GET'&&url.pathname==='/api/players'){json(response,roster());return}
   if(request.method==='GET'&&url.pathname==='/api/player-photo'){
    const player=roster().players.find(row=>String(row.id)===String(url.searchParams.get('id')||''));
    const match=player?.photo?.match(/^data:([^;,]+);base64,(.+)$/);
    if(!match){response.statusCode=404;response.end();return}
    sendBuffer(response,Buffer.from(match[2],'base64'),match[1],'public, max-age=31536000, immutable');return;
   }
   if(request.method==='GET'&&url.pathname==='/media'){
    await bridgeResponse(response,await deliverImage(new Request('http://terminal.local'+request.url)));return;
   }
   if(request.method==='GET'&&url.pathname==='/api/flamengo-live'){
    try{
     const channel=await fetch('https://www.youtube.com/@flamengo/live',{headers:{'user-agent':'Mozilla/5.0'},signal:AbortSignal.timeout(6500)}),html=await channel.text(),marker=html.indexOf('"isLiveNow":true'),area=marker<0?'':html.slice(Math.max(0,marker-12000),marker+2500),ids=[...area.matchAll(/"videoId":"([\w-]{11})"/g)],videoId=ids.at(-1)?.[1]||null;
     json(response,{live:Boolean(videoId),videoId,checkedAt:new Date().toISOString(),available:channel.ok});
    }catch{json(response,{live:false,videoId:null,checkedAt:new Date().toISOString(),available:false})}
    return;
   }
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
