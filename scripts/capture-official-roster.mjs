import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import cachedRoster from '../src/official-roster.json' with {type:'json'};

const SOURCE='https://www.flamengo.com.br/futebol/elenco';
const ESPN='https://site.api.espn.com/apis/site/v2/sports/soccer/bra.1/teams/819/roster';
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const slug=value=>String(value||'jogador').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const aliases={'Rossi':'Agustín Rossi','Varela':'Guillermo Varela','Evertton Araujo':'Evertton','De Arrascaeta':'Giorgian de Arrascaeta','De La Cruz':'Nicolás de la Cruz','Saúl':'Saúl Ñíguez','Carrascal':'Jorge Carrascal','L. Paquetá':'Lucas Paquetá','G. Plata':'Gonzalo Plata'};
const broadPosition=value=>value==='Goleiro'?'Goleiro':/Zagueiro|Lateral/.test(value)?'Defensor':/Volante|Meio/.test(value)?'Meio-campista':'Atacante';

const [pageResponse,espnResponse]=await Promise.all([fetch(SOURCE,{signal:AbortSignal.timeout(20000)}),fetch(ESPN,{signal:AbortSignal.timeout(20000)})]);
if(!pageResponse.ok)throw new Error('Elenco oficial HTTP '+pageResponse.status);
let html=(await pageResponse.text()).replaceAll('\\"','"');
const re=/\{"name":"([^"]+)","lastname":[\s\S]{0,100}?"position":"([^"]+)",[\s\S]{0,200}?"number":(null|\d+),[\s\S]{0,160}?"slug":"([^"]+)",[\s\S]{0,180}?"photo":\{[\s\S]{0,150}?"url":"(https:[^"]+)/g;
const official=[...new Map([...html.matchAll(re)].map(match=>[match[1],{name:match[1],role:match[2],number:match[3]==='null'?'—':match[3],slug:match[4],remotePhoto:match[5]}])).values()].filter(player=>player.name!=='Everton Cebolinha');
if(official.length<20)throw new Error('A página oficial retornou somente '+official.length+' atletas');
const espn=espnResponse.ok?(await espnResponse.json()).athletes||[]:[];
const known=[...espn.map(player=>({id:String(player.id),name:player.displayName,age:player.age||null,country:player.citizenship||''})),...cachedRoster.players];

async function compactPhoto(url){
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
 if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw new Error('Foto inválida: '+url);
 const original=Buffer.from(await response.arrayBuffer());
 const converted=spawnSync('convert',['-','-resize','240x240^','-gravity','center','-extent','240x240','-strip','-quality','76','webp:-'],{input:original,maxBuffer:8*1024*1024});
 if(converted.status!==0||!converted.stdout.length)throw new Error('Falha ao otimizar foto');
 return 'data:image/webp;base64,'+converted.stdout.toString('base64');
}

const players=[];
for(let start=0;start<official.length;start+=4){
 const batch=official.slice(start,start+4);
 players.push(...await Promise.all(batch.map(async player=>{
  const target=aliases[player.name]||player.name,targetKey=normalize(target);
  const matched=known.find(candidate=>normalize(candidate.name)===targetKey)||known.find(candidate=>normalize(candidate.name).includes(targetKey)||targetKey.includes(normalize(candidate.name)));
  return {id:matched?.id||'crf-'+slug(player.name),name:player.name,number:player.number,position:broadPosition(player.role),role:player.role,age:matched?.age||null,country:matched?.country||'',photo:await compactPhoto(player.remotePhoto),photoSource:SOURCE,profile:'https://www.flamengo.com.br/futebol/atleta/'+player.slug};
 })));
}

fs.writeFileSync(new URL('../src/official-roster.json',import.meta.url),JSON.stringify({source:SOURCE,updatedAt:new Date().toISOString(),players},null,2)+'\n');
console.log(JSON.stringify({players:players.length,withPhotos:players.filter(player=>player.photo).length,bytes:fs.statSync(new URL('../src/official-roster.json',import.meta.url)).size}));
