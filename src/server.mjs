import template from './page.html';
import css from './style.css';
import additions from './additions.css';
import client from './client.js';
import snapshot from './snapshot.json';
import officialRoster from './official-roster.json';
import scheduleSnapshot from './schedule-snapshot.json';
import {deliverImage} from './media.mjs';
import {ORIGIN,decorateHead,metadata,renderHero,renderCard,renderInfo,renderNewsPage,newsSlug,newsPath,pages} from './editorial.mjs';
import {CNN,RSS,cnnItems,rssItems,officialRosterItems,officialMatches,mergeNews} from './data.mjs';
import {memoryPaths,renderMemory} from './memory.mjs';
import {adminRoute} from './admin.mjs';
import {enrichMatches} from './match-enrichment.mjs';
import {upgradeHome} from './home-upgrade.mjs';
import {localizeHome} from './i18n.mjs';
import {decoratePortalRoute,portalAlternates,portalPaths,portalRouteMeta,resolvePortalRoute} from './portal-routes.mjs';
import liverpoolThumb from './assets/flamengo-liverpool-1981.webp';
import riverThumb from './assets/flamengo-river-2019.webp';
import santosThumb from './assets/santos-flamengo-2011.webp';
import categoryMatchday from './assets/category-matchday.webp';
import categoryDiscussion from './assets/category-discussion.webp';
import categoryVideos from './assets/category-videos.webp';
import categoryVotes from './assets/category-votes.webp';
import categoryGroups from './assets/category-groups.webp';
import categoryHistory from './assets/category-history.webp';
const POLLS=['melhor-2026-09','saida-2026-09'];
const OFFICIAL_TEAM='https://www.flamengo.com.br/futebol/elenco',OFFICIAL_HOME='https://www.flamengo.com.br/';
const FLATV_LIVE='https://www.youtube.com/@flamengo/live';
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'cache-control':'no-store',...headers}});
const socialCard=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Nação Rubro-Negra">
 <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050505"/><stop offset=".56" stop-color="#130006"/><stop offset="1" stop-color="#50000d"/></linearGradient><pattern id="stripes" width="86" height="86" patternUnits="userSpaceOnUse" patternTransform="rotate(-16)"><rect width="43" height="86" fill="#df001b" opacity=".08"/></pattern></defs>
 <rect width="1200" height="630" fill="url(#bg)"/><rect width="1200" height="630" fill="url(#stripes)"/>
 <circle cx="965" cy="310" r="230" fill="#df001b" opacity=".13"/><circle cx="965" cy="310" r="156" fill="none" stroke="#df001b" stroke-width="2" opacity=".45"/>
 <rect x="78" y="78" width="88" height="88" rx="8" fill="#df001b"/><text x="122" y="135" text-anchor="middle" fill="#fff" font-size="31" font-family="Arial,sans-serif" font-weight="900">NRN</text>
 <text x="78" y="252" fill="#ff263f" font-size="22" font-family="Arial,sans-serif" font-weight="800" letter-spacing="5">PORTAL INDEPENDENTE DA TORCIDA</text>
 <text x="72" y="354" fill="#fff" font-size="92" font-family="Arial,sans-serif" font-weight="900" letter-spacing="-5">NAÇÃO</text>
 <text x="72" y="447" fill="#fff" font-size="92" font-family="Arial,sans-serif" font-weight="900" letter-spacing="-5">RUBRO-NEGRA.</text>
 <text x="78" y="514" fill="#c9c1c4" font-size="25" font-family="Arial,sans-serif">Notícias · jogos · escalações · palpites · votação · comunidade</text>
 <g transform="translate(856 195)"><path d="M0 0h210v54c0 92-44 158-105 158S0 146 0 54z" fill="#df001b"/><path d="M20 62h170v24H20zm0 48h170v24H20z" fill="#090909"/><text x="105" y="181" text-anchor="middle" fill="#fff" font-size="42" font-family="Arial,sans-serif" font-weight="900">CRF</text></g>
</svg>`;
const categoryAssets={
 '/assets/category-matchday.webp':categoryMatchday,
 '/assets/category-discussion.webp':categoryDiscussion,
 '/assets/category-videos.webp':categoryVideos,
 '/assets/category-votes.webp':categoryVotes,
 '/assets/category-groups.webp':categoryGroups,
 '/assets/category-history.webp':categoryHistory
};
const page=upgradeHome(template.replace('/*CSS*/',()=>css+'\n'+additions).replace('/*JS*/',()=>client).replace('/*GOAL_LIVERPOOL*/',()=>liverpoolThumb).replace('/*GOAL_RIVER*/',()=>riverThumb).replace('/*GOAL_SANTOS*/',()=>santosThumb),{
 matchday:'/assets/category-matchday.webp',discussion:'/assets/category-discussion.webp',videos:'/assets/category-videos.webp',votes:'/assets/category-votes.webp',groups:'/assets/category-groups.webp',history:'/assets/category-history.webp'
});
function embeddedImage(dataUrl){const value=String(dataUrl),encoded=value.split(',')[1]||'',type=value.match(/^data:([^;,]+)/)?.[1]||'image/webp',binary=atob(encoded),bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));return new Response(bytes,{headers:{'content-type':type,'cache-control':'public, max-age=31536000, immutable','x-content-type-options':'nosniff'}});}
async function fetchText(url,timeout=9000){const response=await fetch(url,{headers:{accept:'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.7','user-agent':'Mozilla/5.0 (compatible; NacaoRubroNegra/1.0; +https://nacao-rubro-negra.netlify.app/)'},signal:AbortSignal.timeout(timeout)});if(!response.ok)throw new Error('Fonte HTTP '+response.status);return response.text();}
let current={items:mergeNews([snapshot.news]),updatedAt:snapshot.updatedAt,stale:true,sources:[]},until=0,inflight;
let roster={players:officialRoster.players,updatedAt:officialRoster.updatedAt,stale:true,source:officialRoster.source},rosterUntil=0;
let matchCache={matches:lineupPhotos(scheduleSnapshot.matches,officialRoster.players),updatedAt:scheduleSnapshot.updatedAt,stale:true,source:scheduleSnapshot.source},matchUntil=0,matchInflight;
let flatvCache={live:false,videoId:null,checkedAt:null,available:false},flatvUntil=0;
function foldName(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');}
function lineupPhotos(matches,players){return matches.map(match=>({...match,lineups:(match.lineups||[]).map(group=>{const flamengo=String(group.teamId)==='819'||foldName(group.team).includes('flamengo');return {...group,starters:(group.starters||[]).map(player=>{if(player.photo)return player;const name=foldName(player.name),last=name.slice(-Math.min(8,name.length)),official=flamengo?players.find(row=>{const candidate=foldName(row.name);return String(row.id)===String(player.id)||candidate===name||candidate.includes(name)||name.includes(candidate)||(last.length>4&&candidate.endsWith(last));}):null;if(official?.photo)return {...player,id:official.id||player.id,photo:'/api/player-photo?id='+encodeURIComponent(official.id),photoSource:official.photoSource};return player.fallbackPhoto?{...player,photo:player.fallbackPhoto}:player;})};})}));}
function liveVideoId(html){const marker=html.indexOf('"isLiveNow":true');if(marker<0)return null;const area=html.slice(Math.max(0,marker-12000),marker+2500),ids=[...area.matchAll(/"videoId":"([\w-]{11})"/g)];return ids.at(-1)?.[1]||null;}
async function flatvLive(){if(Date.now()<flatvUntil)return flatvCache;try{const html=await fetchText(FLATV_LIVE,7000),videoId=liveVideoId(html);flatvCache={live:Boolean(videoId),videoId,checkedAt:new Date().toISOString(),available:true};flatvUntil=Date.now()+(videoId?30000:180000);}catch{flatvCache={...flatvCache,live:false,videoId:null,checkedAt:new Date().toISOString(),available:false};flatvUntil=Date.now()+60000;}return flatvCache;}
async function matches(){
 if(Date.now()<matchUntil)return matchCache;
 if(matchInflight)return matchInflight;
 matchInflight=(async()=>{let rows=matchCache.matches,officialAvailable=false;
  try{const official=officialMatches(await fetchText(OFFICIAL_HOME,12000));if(official.length<3)throw new Error('Agenda incompleta');rows=official;officialAvailable=true;}catch{}
  try{const enriched=lineupPhotos(await enrichMatches(rows),roster.players);matchCache={matches:enriched,updatedAt:new Date().toISOString(),stale:!officialAvailable,source:officialAvailable?OFFICIAL_HOME:'ESPN'};const next=enriched.find(match=>match.state==='pre'&&Date.parse(match.date)>=Date.now()-7200000),near=next&&Math.abs(Date.parse(next.date)-Date.now())<7200000;matchUntil=Date.now()+(enriched.some(match=>match.state==='in')?12000:near?30000:300000);}
  catch{matchCache={...matchCache,matches:matchCache.matches.map(match=>({...match,venue:match.venue||match.status})),stale:true};matchUntil=Date.now()+60000;}
  return matchCache;
 })().finally(()=>matchInflight=null);
 return matchInflight;
}
async function news(){if(Date.now()<until)return current;if(inflight)return inflight;inflight=(async()=>{const result=await Promise.allSettled([fetchText(CNN,6500),fetchText(RSS,6500)]),groups=result.map((r,i)=>r.status==='fulfilled'?(i?rssItems(r.value):cnnItems(r.value)):[]),items=mergeNews(groups);if(items.length){current={items,updatedAt:new Date().toISOString(),stale:groups.some(g=>!g.length),sources:groups.map((g,i)=>({name:i?'Google Notícias':'CNN Brasil',available:!!g.length}))};until=Date.now()+300000;}else{current={...current,items:mergeNews([current.items]),stale:true};until=Date.now()+60000;}return current;})().finally(()=>inflight=null);return inflight;}
async function players(){if(Date.now()<rosterUntil)return roster;try{const mapped=officialRosterItems(await fetchText(OFFICIAL_TEAM,15000),officialRoster.players);if(mapped.length<20)throw new Error('Elenco oficial incompleto');roster={players:mapped,updatedAt:new Date().toISOString(),stale:false,source:OFFICIAL_TEAM};rosterUntil=Date.now()+3600000;}catch{roster={...roster,stale:true};rosterUntil=Date.now()+60000;}return roster;}
function getDb(env){if(!env.DB)throw new Error('Base de votação indisponível');return env.DB;}
function voter(request){const token=request.headers.get('cookie')?.match(/(?:^|;\s*)nrn_voter=([a-f0-9-]{36})(?:;|$)/)?.[1];return token||null;}
const cookie=id=>'nrn_voter='+id+'; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax';
const sameOrigin=(request,url)=>request.headers.get('origin')===url.origin;
const nickname=value=>String(value||'').replace(/\s+/g,' ').trim().slice(0,24);
const fanText=(value,max)=>String(value||'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const containsLink=value=>/(?:https?:\/\/|www\.|chat\.whatsapp\.com|t\.me\/)/i.test(value);
async function latestPost(db,table,id){const row=await db.prepare('SELECT created FROM '+table+' WHERE voter = ? ORDER BY created DESC LIMIT 1').bind(id).first();return Number(row?.created)||0;}
export default {async fetch(request,env,ctx){const u=new URL(request.url);
 const admin=await adminRoute(request,env,u);if(admin)return admin;
 if(categoryAssets[u.pathname])return embeddedImage(categoryAssets[u.pathname]);
 if(u.pathname==='/api/player-photo'&&request.method==='GET'){
  const id=String(u.searchParams.get('id')||''),player=roster.players.find(row=>String(row.id)===id)||officialRoster.players.find(row=>String(row.id)===id);
  return player?.photo?.startsWith('data:image/')?embeddedImage(player.photo):new Response(null,{status:404,headers:{'cache-control':'public, max-age=300'}});
 }
 if(u.pathname==='/media'&&request.method==='GET')return deliverImage(request);
 if(u.pathname==='/social-card.svg'&&request.method==='GET')return new Response(socialCard,{headers:{'content-type':'image/svg+xml; charset=utf-8','cache-control':'public, max-age=86400, stale-while-revalidate=604800','x-content-type-options':'nosniff'}});
 if(u.pathname==='/favicon.ico')return Response.redirect('https://a.espncdn.com/i/teamlogos/soccer/500/819.png',302);
 if(u.pathname==='/manifest.webmanifest')return json({name:'Nação Rubro-Negra',short_name:'NRN',description:'Portal independente da torcida do Flamengo',start_url:'/',display:'standalone',background_color:'#080406',theme_color:'#df001b',lang:'pt-BR',icons:[{src:'https://a.espncdn.com/i/teamlogos/soccer/500/819.png',sizes:'500x500',type:'image/png',purpose:'any maskable'}]},200,{'content-type':'application/manifest+json','cache-control':'public, max-age=86400'});
 if(u.pathname==='/robots.txt')return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nSitemap: '+ORIGIN+'/sitemap.xml',{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'public, max-age=3600'}});
 if(u.pathname==='/sitemap.xml'){const updated=Number.isFinite(Date.parse(current.updatedAt))?new Date(current.updatedAt).toISOString() : new Date().toISOString(),paths=[...portalPaths,'/sobre','/privacidade','/historia',...current.items.map(newsPath)];return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>'<url><loc>'+ORIGIN+path+'</loc><lastmod>'+updated+'</lastmod></url>').join('')+'</urlset>',{headers:{'content-type':'application/xml; charset=utf-8','cache-control':'public, max-age=900'}});}
 if(pages[u.pathname])return new Response(renderInfo(u.pathname,css+'\n'+additions),{headers:{'content-type':'text/html; charset=utf-8'}});
 if(memoryPaths.includes(u.pathname))return new Response(renderMemory(u.pathname),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300'}});
 if(u.pathname.startsWith('/noticia/')){let article=current.items.find(n=>newsSlug(n)===u.pathname.slice(9));if(!article){const fresh=await news();article=fresh.items.find(n=>newsSlug(n)===u.pathname.slice(9));}return article?new Response(renderNewsPage(article,css+'\n'+additions),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300'}}):new Response(renderInfo('/sobre',css+'\n'+additions),{status:404,headers:{'content-type':'text/html; charset=utf-8'}});}
 const portalRoute=resolvePortalRoute(u.pathname);
 if(portalRoute){
  if(ctx?.waitUntil)ctx.waitUntil(news());
  const code=portalRoute.locale,routeMeta=portalRouteMeta(portalRoute),snapshotFresh=Date.now()-(Date.parse(current.updatedAt)||0)<36*3600000,initialState=snapshotFresh?current:{...current,items:[]},initial=JSON.stringify(initialState).replace(/</g,'\\u003c');
  let body=page;if(initialState.items.length)body=body.replace('<div class="loading">Preparando as manchetes…</div>',()=>renderHero(initialState.items.find(n=>n.image)||initialState.items[0])).replace('<div class="loading">Buscando publicações…</div>',()=>initialState.items.slice(0,6).map(renderCard).join(''));
  const html=decorateHead(decoratePortalRoute(localizeHome(body,code),portalRoute),metadata(portalRoute.path,routeMeta.title,routeMeta.description,code,portalAlternates(portalRoute.view))).replace('<script>','<script id="nrn-initial-data" type="application/json">'+initial+'</script><script>');
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-cache','x-content-type-options':'nosniff'}});
 }
 if(u.pathname==='/sw.js')return new Response("self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(ws=>{if(ws[0])return ws[0].focus();return clients.openWindow('/noticias')}))});",{headers:{'content-type':'text/javascript','cache-control':'no-cache'}});
 if(u.pathname==='/api/news'&&request.method==='GET'){
  if(Date.now()>=until&&ctx?.waitUntil){
   const refresh=news();ctx.waitUntil(refresh);
   const quick=await Promise.race([refresh,new Promise(resolve=>setTimeout(()=>resolve(null),1800))]);
   return json(quick||{...current,refreshing:true});
  }
  return json(await news());
 }
 if(u.pathname==='/api/matches'&&request.method==='GET'){
  if(ctx?.waitUntil&&Date.now()>=matchUntil){ctx.waitUntil(matches());return json({...matchCache,refreshing:true});}
  return json(await matches());
 }
 if(u.pathname==='/api/flamengo-live'&&request.method==='GET')return json(await flatvLive(),200,{'cache-control':'public, max-age=30, stale-while-revalidate=120'});
 if(u.pathname==='/api/match-opinions'&&request.method==='GET'){
  try{
   const db=getDb(env),id=voter(request)||crypto.randomUUID();
   const [predictions,minePredictions,ratings,mineRatings]=await Promise.all([
    db.prepare('SELECT match, choice, home_score AS homeScore, away_score AS awayScore, COUNT(*) AS votes FROM match_predictions GROUP BY match, choice, home_score, away_score').all(),
    db.prepare('SELECT match, choice, home_score AS homeScore, away_score AS awayScore FROM match_predictions WHERE voter = ?').bind(id).all(),
    db.prepare('SELECT match, player, AVG(rating) AS average, COUNT(*) AS ratings FROM player_ratings GROUP BY match, player').all(),
    db.prepare('SELECT match, player, rating FROM player_ratings WHERE voter = ?').bind(id).all()
   ]);
   const matchIds=[...new Set([...predictions.results.map(x=>x.match),...minePredictions.results.map(x=>x.match)])];
   return json({predictions:matchIds.map(match=>{const options=predictions.results.filter(x=>x.match===match),mine=minePredictions.results.find(x=>x.match===match);return {match,total:options.reduce((sum,x)=>sum+Number(x.votes),0),options,mine:mine?.choice||null,mineHome:mine?.homeScore??null,mineAway:mine?.awayScore??null}}),ratings:ratings.results.map(row=>({...row,mine:mineRatings.results.find(x=>x.match===row.match&&x.player===row.player)?.rating||null}))},200,{'set-cookie':cookie(id)});
  }catch(e){console.error('match_opinions_read',e.message);return json({error:'Palpites e notas indisponíveis.'},503);}
 }
 if(u.pathname==='/api/match-prediction'&&request.method==='POST'){
  if(request.headers.get('origin')!==u.origin)return json({error:'Origem inválida.'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);
  try{
   const raw=await request.text();if(raw.length>1024)return json({error:'Pedido muito grande.'},413);
   const {match,homeScore,awayScore}=JSON.parse(raw),id=voter(request),home=Number(homeScore),away=Number(awayScore);
   if(!id)return json({error:'Abra a central de palpites antes de votar.'},400);
   const list=await matches(),target=list.matches.find(x=>x.id===match);
   if(!target||target.state!=='pre'||Date.now()>=Date.parse(target.date))return json({error:'Os palpites deste jogo já foram encerrados.'},409);
   if(!Number.isInteger(home)||!Number.isInteger(away)||home<0||away<0||home>15||away>15)return json({error:'Escolha um placar entre 0 e 15 gols para cada time.'},400);
   const choice=home===away?'draw':home>away?'home':'away';
   await getDb(env).prepare('INSERT INTO match_predictions (match,voter,choice,home_score,away_score,created) VALUES (?,?,?,?,?,?) ON CONFLICT(match,voter) DO UPDATE SET choice = excluded.choice, home_score = excluded.home_score, away_score = excluded.away_score, created = excluded.created').bind(match,id,choice,home,away,Date.now()).run();
   return json({message:'Placar salvo. Você pode mudar o palpite até a bola rolar.'});
  }catch(e){console.error('match_prediction_write',e.message);return json({error:'Não foi possível salvar o palpite.'},503);}
 }
 if(u.pathname==='/api/player-rating'&&request.method==='POST'){if(request.headers.get('origin')!==u.origin)return json({error:'Origem inválida.'},403);if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);try{const raw=await request.text();if(raw.length>1024)return json({error:'Pedido muito grande.'},413);const {match,player,rating}=JSON.parse(raw),id=voter(request),score=Number(rating);if(!id)return json({error:'Abra as notas da torcida antes de avaliar.'},400);const [games,squad]=await Promise.all([matches(),players()]),target=games.matches.find(x=>x.id===match);if(!target||target.state!=='post')return json({error:'As notas abrem somente depois do jogo.'},409);if(!Number.isInteger(score)||score<1||score>10||!squad.players.some(x=>x.id===player))return json({error:'Jogador ou nota inválida.'},400);await getDb(env).prepare('INSERT INTO player_ratings (match,voter,player,rating,created) VALUES (?,?,?,?,?) ON CONFLICT(match,voter,player) DO UPDATE SET rating = excluded.rating, created = excluded.created').bind(match,id,player,score,Date.now()).run();return json({message:'Nota registrada na média da Nação.'});}catch(e){console.error('player_rating_write',e.message);return json({error:'Não foi possível salvar a nota.'},503);}}
 if(u.pathname==='/api/players'&&request.method==='GET'){if(ctx?.waitUntil&&Date.now()>=rosterUntil){ctx.waitUntil(players());return json(roster);}return json(await players());}
 if(u.pathname==='/api/groups'&&request.method==='GET'){try{const limit=Math.max(1,Math.min(48,Number(u.searchParams.get('limit'))||24)),cursor=Number(u.searchParams.get('cursor'))||null,q=String(u.searchParams.get('q')||'').trim().slice(0,60),category=String(u.searchParams.get('category')||'').trim(),conditions=["status = 'approved'"],binds=[];if(cursor){conditions.push('created < ?');binds.push(cursor)}if(category){conditions.push('category = ?');binds.push(category)}if(q.length>=2){conditions.push('(name LIKE ? OR region LIKE ?)');binds.push('%'+q+'%','%'+q+'%')}const query='SELECT id,name,region,category,url,description,created FROM groups WHERE '+conditions.join(' AND ')+' ORDER BY created DESC LIMIT ?',rows=await getDb(env).prepare(query).bind(...binds,limit+1).all(),slice=rows.results.slice(0,limit),nextCursor=rows.results.length>limit?String(slice.at(-1).created):null;return json({groups:slice.map(({created,...group})=>group),nextCursor});}catch(e){console.error('groups_read',e.message);return json({error:'Diretório indisponível.'},503);}}
 if(u.pathname==='/api/groups'&&request.method==='POST'){if(request.headers.get('origin')!==u.origin)return json({error:'Origem inválida.'},403);if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);try{const raw=await request.text();if(raw.length>4096)return json({error:'Pedido muito grande.'},413);const body=JSON.parse(raw),name=String(body.name||'').trim(),region=String(body.region||'').trim(),category=String(body.category||'').trim(),description=String(body.description||'').trim(),url=String(body.url||'').trim();const categories=['Torcida local','Debate e notícias','Caravana','Futebol feminino','Exterior'];let parsed;try{parsed=new URL(url)}catch{}if(name.length<3||name.length>60||region.length<2||region.length>60||description.length<10||description.length>180||!categories.includes(category)||parsed?.protocol!=='https:'||parsed?.hostname!=='chat.whatsapp.com')return json({error:'Confira os campos e use um link de convite chat.whatsapp.com válido.'},400);await getDb(env).prepare('INSERT INTO groups (id,name,region,category,url,description,status,created) VALUES (?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),name,region,category,url,description,'pending',Date.now()).run();return json({message:'Recebemos o grupo. Ele aparecerá após análise.'},201);}catch(e){console.error('groups_submit',e.message);return json({error:'Não foi possível enviar agora.'},503);}}
 if(u.pathname==='/api/community'&&request.method==='GET'){
  try{
   const db=getDb(env),id=voter(request)||crypto.randomUUID(),kind=u.searchParams.get('kind')==='lineup'?'lineup':'unpopular',sort=u.searchParams.get('sort')==='new'?'new':'hot';
   const rows=await db.prepare("SELECT o.id,o.kind,o.nickname,o.body,o.player,o.created,COALESCE(SUM(CASE WHEN v.choice = 'agree' THEN 1 ELSE 0 END),0) AS agree,COALESCE(SUM(CASE WHEN v.choice = 'disagree' THEN 1 ELSE 0 END),0) AS disagree,MAX(CASE WHEN v.voter = ? THEN v.choice ELSE NULL END) AS mine FROM fan_opinions o LEFT JOIN fan_opinion_votes v ON v.opinion = o.id WHERE o.kind = ? AND o.status = 'visible' GROUP BY o.id ORDER BY o.created DESC LIMIT 80").bind(id,kind).all();
   const opinions=rows.results.map(row=>({...row,agree:Number(row.agree)||0,disagree:Number(row.disagree)||0}));
   if(sort==='hot')opinions.sort((a,b)=>{const totalA=a.agree+a.disagree,totalB=b.agree+b.disagree,heatA=totalA+Math.min(a.agree,a.disagree)*3,heatB=totalB+Math.min(b.agree,b.disagree)*3;return heatB-heatA||Number(b.created)-Number(a.created)});
   const visible=opinions.slice(0,40),votes=visible.reduce((sum,row)=>sum+row.agree+row.disagree,0);
   return json({kind,sort,opinions:visible,stats:{opinions:visible.length,votes}},200,{'set-cookie':cookie(id)});
  }catch(e){console.error('community_read',e.message);return json({error:'A arquibancada está temporariamente indisponível.'},503);}
 }
 if(u.pathname==='/api/community/opinion'&&request.method==='POST'){
  if(!sameOrigin(request,u))return json({error:'Origem inválida.'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);
  try{
   const raw=await request.text();if(raw.length>2048)return json({error:'Mensagem muito grande.'},413);
   const data=JSON.parse(raw),kind=data.kind==='lineup'?'lineup':data.kind==='unpopular'?'unpopular':null,name=nickname(data.nickname),body=fanText(data.body,kind==='lineup'?180:220),player=kind==='lineup'?String(data.player||'').trim():null,id=voter(request)||crypto.randomUUID(),db=getDb(env);
   if(!kind||name.length<2||name.length>24)return json({error:'Confira seu apelido e tente novamente.'},400);
   if(kind==='unpopular'&&body.length<8)return json({error:'Escreva uma opinião com pelo menos 8 caracteres.'},400);
   if(kind==='lineup'&&body.length>180)return json({error:'Resuma sua ideia em até 180 caracteres.'},400);
   if(containsLink(body)||containsLink(name))return json({error:'Links não são permitidos nesta área.'},400);
   if(kind==='lineup'){const squad=await players();if(!squad.players.some(row=>row.id===player))return json({error:'Escolha um jogador do elenco atual.'},400);}
   if(Date.now()-await latestPost(db,'fan_opinions',id)<12000)return json({error:'Espere alguns segundos antes de publicar outra opinião.'},429);
   const opinionId=crypto.randomUUID();
   await db.prepare('INSERT INTO fan_opinions (id,kind,voter,nickname,body,player,status,created) VALUES (?,?,?,?,?,?,?,?)').bind(opinionId,kind,id,name,body,player,'visible',Date.now()).run();
   return json({id:opinionId,message:kind==='lineup'?'Sua escolha entrou no debate.':'Sua opinião entrou na arquibancada.'},201,{'set-cookie':cookie(id)});
  }catch(e){console.error('community_write',e.message);return json({error:'Não foi possível publicar agora.'},503);}
 }
 if(u.pathname==='/api/community/vote'&&request.method==='POST'){
  if(!sameOrigin(request,u))return json({error:'Origem inválida.'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);
  try{
   const raw=await request.text();if(raw.length>1024)return json({error:'Pedido muito grande.'},413);
   const data=JSON.parse(raw),opinion=String(data.opinion||''),choice=['agree','disagree'].includes(data.choice)?data.choice:null,id=voter(request)||crypto.randomUUID(),db=getDb(env);
   if(!/^[a-f0-9-]{36}$/.test(opinion)||!choice)return json({error:'Voto inválido.'},400);
   const target=await db.prepare("SELECT id FROM fan_opinions WHERE id = ? AND status = 'visible'").bind(opinion).first();if(!target)return json({error:'Essa opinião não está mais disponível.'},404);
   await db.prepare('INSERT INTO fan_opinion_votes (opinion,voter,choice,created) VALUES (?,?,?,?) ON CONFLICT(opinion,voter) DO UPDATE SET choice = excluded.choice, created = excluded.created').bind(opinion,id,choice,Date.now()).run();
   return json({message:'Seu voto entrou no placar.'},200,{'set-cookie':cookie(id)});
  }catch(e){console.error('community_vote',e.message);return json({error:'Não foi possível registrar o voto.'},503);}
 }
 if(u.pathname==='/api/community/chat'&&request.method==='GET'){
  try{
   const db=getDb(env),id=voter(request)||crypto.randomUUID(),after=Math.max(0,Number(u.searchParams.get('after'))||0);let rows;
   if(after)rows=await db.prepare("SELECT id,nickname,body,created FROM fan_chat_messages WHERE status = 'visible' AND created > ? ORDER BY created ASC LIMIT 80").bind(after).all();
   else rows=await db.prepare("SELECT id,nickname,body,created FROM fan_chat_messages WHERE status = 'visible' ORDER BY created DESC LIMIT 60").all();
   const messages=after?rows.results:[...rows.results].reverse();
   return json({messages,updatedAt:new Date().toISOString()},200,{'set-cookie':cookie(id)});
  }catch(e){console.error('chat_read',e.message);return json({error:'O bate-papo está temporariamente indisponível.'},503);}
 }
 if(u.pathname==='/api/community/chat'&&request.method==='POST'){
  if(!sameOrigin(request,u))return json({error:'Origem inválida.'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);
  try{
   const raw=await request.text();if(raw.length>2048)return json({error:'Mensagem muito grande.'},413);
   const data=JSON.parse(raw),name=nickname(data.nickname),body=fanText(data.body,240),id=voter(request)||crypto.randomUUID(),db=getDb(env);
   if(name.length<2||body.length<2)return json({error:'Escreva uma mensagem antes de enviar.'},400);
   if(containsLink(body)||containsLink(name))return json({error:'Links não são permitidos no bate-papo.'},400);
   if(Date.now()-await latestPost(db,'fan_chat_messages',id)<3000)return json({error:'Espere um instante antes da próxima mensagem.'},429);
   const messageId=crypto.randomUUID(),created=Date.now();
   await db.prepare('INSERT INTO fan_chat_messages (id,voter,nickname,body,status,created) VALUES (?,?,?,?,?,?)').bind(messageId,id,name,body,'visible',created).run();
   return json({message:{id:messageId,nickname:name,body,created}},201,{'set-cookie':cookie(id)});
  }catch(e){console.error('chat_write',e.message);return json({error:'Não foi possível enviar a mensagem.'},503);}
 }
 if(u.pathname==='/api/community/report'&&request.method==='POST'){
  if(!sameOrigin(request,u))return json({error:'Origem inválida.'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);
  try{
   const raw=await request.text();if(raw.length>1024)return json({error:'Pedido muito grande.'},413);
   const data=JSON.parse(raw),kind=['opinion','chat'].includes(data.kind)?data.kind:null,content=String(data.content||''),id=voter(request)||crypto.randomUUID(),db=getDb(env);
   if(!kind||!/^[a-f0-9-]{36}$/.test(content))return json({error:'Denúncia inválida.'},400);
   await db.prepare('INSERT INTO fan_reports (kind,content,voter,created) VALUES (?,?,?,?) ON CONFLICT(kind,content,voter) DO NOTHING').bind(kind,content,id,Date.now()).run();
   const count=await db.prepare('SELECT COUNT(*) AS total FROM fan_reports WHERE kind = ? AND content = ?').bind(kind,content).first();
   if(Number(count?.total)>=3){const table=kind==='chat'?'fan_chat_messages':'fan_opinions';await db.prepare("UPDATE "+table+" SET status = 'review' WHERE id = ? AND status = 'visible'").bind(content).run();}
   return json({message:'Denúncia recebida. Obrigado por ajudar a manter o respeito.'},200,{'set-cookie':cookie(id)});
  }catch(e){console.error('community_report',e.message);return json({error:'Não foi possível enviar a denúncia.'},503);}
 }
 if(u.pathname==='/api/polls'&&request.method==='GET'){try{const db=getDb(env),id=voter(request)||crypto.randomUUID();const counts=await db.prepare('SELECT poll, player, COUNT(*) AS votes FROM votes GROUP BY poll, player').all();const mine=await db.prepare('SELECT poll, player FROM votes WHERE voter = ?').bind(id).all();return json({polls:POLLS.map(poll=>{const options=counts.results.filter(r=>r.poll===poll);return {id:poll,total:options.reduce((s,x)=>s+x.votes,0),options,mine:mine.results.find(r=>r.poll===poll)?.player||null};})},200,{'set-cookie':cookie(id)});}catch(e){console.error('poll_read',e.message);return json({error:'Os resultados estão indisponíveis. Tente novamente.'},503);}}
 if(u.pathname==='/api/vote'&&request.method==='POST'){if(request.headers.get('origin')!==u.origin)return json({error:'Origem inválida.'},403);if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido.'},415);if(+(request.headers.get('content-length')||0)>2048)return json({error:'Pedido muito grande.'},413);try{const raw=await request.text();if(raw.length>2048)return json({error:'Pedido muito grande.'},413);const {poll,player}=JSON.parse(raw),id=voter(request);if(!id)return json({error:'Abra os resultados antes de votar.'},400);if(!POLLS.includes(poll))return json({error:'Enquete inválida.'},400);const list=await players();if(!list.players.some(p=>p.id===player)&&!(poll.startsWith('saida')&&player==='ninguem'))return json({error:'Escolha um jogador do elenco.'},400);const result=await getDb(env).prepare('INSERT INTO votes (poll,voter,player,created) VALUES (?,?,?,?) ON CONFLICT(poll,voter) DO NOTHING').bind(poll,id,player,Date.now()).run();return json({accepted:result.meta.changes===1,message:result.meta.changes?'Voto registrado.':'Seu voto já foi registrado nesta enquete.'});}catch(e){console.error('poll_vote',e.message);return json({error:'Não foi possível registrar. Seu voto continua selecionado; tente novamente.'},503);}}
 return json({error:'Página não encontrada.'},404);
}};
