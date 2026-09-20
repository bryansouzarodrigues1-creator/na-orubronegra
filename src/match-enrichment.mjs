const ESPN_LEAGUES=['bra.1','conmebol.libertadores'];
const LEAGUE_NAMES={'bra.1':'Campeonato Brasileiro','conmebol.libertadores':'Copa Libertadores'};
const FLAMENGO_ID='819';
const safeNumber=value=>{const n=Number(String(value??'').replace(',','.'));return Number.isFinite(n)?n:null};
const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const TEAM_IDS=new Map([
 ['flamengo','819'],['corinthians','874'],['fluminense','3445'],['santos','2674'],['redbullbragantino','6079'],['bragantino','6079'],['remo','4936'],['independientedelvalle','17086'],['independentevalle','17086'],
 ['palmeiras','2029'],['saopaulo','2026'],['vascodagama','3454'],['vasco','3454'],['botafogo','6086'],['internacional','1936'],['bahia','9967'],['cruzeiro','2022'],['gremio','6273']
]);
function logoFor(team){if(team?.logo)return team.logo;const name=fold(team?.name),entry=[...TEAM_IDS].find(([key])=>name===key||name.includes(key)||key.includes(name));return entry?'https://a.espncdn.com/i/teamlogos/soccer/500/'+entry[1]+'.png':'';}
function withLogos(match){return {...match,home:{...match.home,logo:logoFor(match.home)},away:{...match.away,logo:logoFor(match.away)}};}
async function mapLimit(items,limit,fn){const output=new Array(items.length);let cursor=0;async function worker(){while(cursor<items.length){const index=cursor++;output[index]=await fn(items[index],index);}}await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));return output;}

async function getJson(url,timeout=12000){
 const response=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout(timeout)});
 if(!response.ok)throw new Error('Dados de jogo HTTP '+response.status);
 return response.json();
}

function competitor(rows,side){
 const item=rows.find(row=>row.homeAway===side);
 return item?{
  id:String(item.id||item.team?.id||''),
  name:item.team?.displayName||item.team?.name||'',
  short:item.team?.abbreviation||'',
  logo:item.team?.logo||'',
  score:String(item.score??'')
 }:null;
}

function projections(comp){
 const predictor=comp?.predictor;
 if(!predictor)return null;
 const home=safeNumber(predictor.homeTeam?.gameProjection),away=safeNumber(predictor.awayTeam?.gameProjection);
 if(home===null||away===null)return null;
 const draw=Math.max(0,Math.round((100-home-away)*10)/10);
 return {home:Math.round(home*10)/10,draw,away:Math.round(away*10)/10,source:'ESPN'};
}

function broadcastNames(...sources){
 const names=sources.flatMap(source=>(source?.broadcasts||[]).flatMap(row=>Array.isArray(row.names)?row.names:row.name?[row.name]:[]));
 return [...new Set(names.map(name=>String(name).trim()).filter(Boolean))];
}

function coverageLink(event){
 const links=[...(event?.links||[]),...(event?.competitions?.[0]?.links||[])];
 return links.find(link=>/summary|gamecast|match|partida/i.test(String(link.rel||link.text||'')))?.href||links[0]?.href||'';
}

function lineups(summary){
 const groups=Array.isArray(summary?.rosters)?summary.rosters:[];
 return groups.map(group=>({
  teamId:String(group.team?.id||''),
  team:group.team?.displayName||group.team?.name||'',
  formation:group.formation||'',
  starters:(group.roster||[]).filter(row=>row.starter===true).slice(0,11).map(row=>({
   id:String(row.athlete?.id||''),
   name:row.athlete?.displayName||row.athlete?.shortName||'',
   number:row.jersey||'',
   position:row.position?.abbreviation||row.position?.displayName||'',
   photo:row.athlete?.headshot?.href||'',
   fallbackPhoto:row.athlete?.jerseyImages?.find(image=>image.rel?.includes('default'))?.href||row.athlete?.jerseyImages?.[0]?.href||''
  }))
 })).filter(group=>group.starters.length);
}

function eventKind(row){
 const value=fold([row.type?.text,row.type?.abbreviation,row.shortText,row.text,row.play?.text].filter(Boolean).join(' '));
 if(value.includes('goal kick')||value.includes('tiro de meta'))return 'goal_kick';
 if(value.includes('corner')||value.includes('escanteio'))return 'corner';
 if(value.includes('yellow')||value.includes('cartao amarelo'))return 'yellow_card';
 if(value.includes('red card')||value.includes('cartao vermelho'))return 'red_card';
 if(value.includes('substitut')||value.includes('substituicao'))return 'substitution';
 if(value.includes('offside')||value.includes('impedimento'))return 'offside';
 if(value.includes('blocked')||value.includes('bloquead'))return 'shot_blocked';
 if(value.includes('off target')||value.includes('missed')||value.includes('wide')||value.includes('para fora'))return 'shot_off';
 if(value.includes('saved')||value.includes('on target')||value.includes('defesa'))return 'shot_on';
 if((value.includes('goal')||value.includes('gol'))&&!value.includes('disallowed')&&!value.includes('anulado'))return 'goal';
 if(value.includes('shot')||value.includes('attempt')||value.includes('finaliza')||value.includes('remate'))return 'shot';
 if(value.includes('foul')||value.includes('falta'))return 'foul';
 if(value.includes('half time')||value.includes('intervalo'))return 'halftime';
 if(value.includes('full time')||value.includes('fim de jogo'))return 'fulltime';
 if(value.includes('kickoff')||value.includes('inicio de jogo'))return 'kickoff';
 return 'update';
}

function eventMinute(clock){
 const value=String(clock||'');
 const parts=value.match(/(\d+)(?:\D+(\d+))?/);
 return parts?Number(parts[1])+(Number(parts[2])||0):0;
}

function matchEvents(summary){
 const pools=[summary?.commentary,summary?.plays,summary?.keyEvents,summary?.details].filter(Array.isArray);
 const seen=new Set(),rows=[];
 for(const row of pools.flat()){
  const text=String(row.text||row.shortText||row.play?.text||row.type?.text||'').trim();
  const clock=String(row.clock?.displayValue||row.time?.displayValue||row.time||row.clock||'').trim();
  if(!text&&!clock)continue;
  const id=String(row.id||row.sequenceNumber||row.order||clock+'-'+text);
  const key=id+'-'+text;if(seen.has(key))continue;seen.add(key);
  const coordinate=row.coordinate||row.coordinates?.[0]||row.play?.coordinate||{};
  const x=safeNumber(coordinate.x),y=safeNumber(coordinate.y);
  rows.push({
   id,
   clock:clock||'—',
   minute:eventMinute(clock),
   type:eventKind(row),
   text:text.slice(0,220),
   teamId:String(row.team?.id||row.competitor?.id||row.play?.team?.id||''),
   homeScore:safeNumber(row.homeScore),
   awayScore:safeNumber(row.awayScore),
   coordinate:x!==null&&y!==null&&x>=0&&x<=100&&y>=0&&y<=100?{x,y}:null
  });
 }
 return rows.sort((a,b)=>b.minute-a.minute||String(b.id).localeCompare(String(a.id),undefined,{numeric:true})).slice(0,18);
}

function eventMatch(event,league){
 const comp=event.competitions?.[0]||{},rows=comp.competitors||[];
 const home=competitor(rows,'home'),away=competitor(rows,'away');
 if(!home||!away)return null;
 const state=event.status?.type?.state||'pre';
 return {
  id:'espn-'+event.id,
  providerEventId:String(event.id),
  providerLeague:league,
  date:event.date,
  name:home.name+' x '+away.name,
  competition:event.league?.name||event.seasonType?.name||comp.type?.text||LEAGUE_NAMES[league]||'Futebol',
  status:event.status?.type?.shortDetail||(state==='post'?'Encerrado':state==='in'?'Ao vivo':'Agendado'),
  state,
  venue:comp.venue?.fullName||'',
  home,
  away,
  probabilities:projections(comp),
  broadcasts:broadcastNames(comp,event),
  coverageUrl:coverageLink(event),
  dataSource:'ESPN'
 };
}

async function schedule(){
 const season=new Date().getUTCFullYear();
 const settled=await Promise.allSettled(ESPN_LEAGUES.map(async league=>({
  league,
  data:await getJson('https://site.api.espn.com/apis/site/v2/sports/soccer/'+league+'/teams/'+FLAMENGO_ID+'/schedule?season='+season)
 })));
 const all=settled.flatMap(result=>result.status==='fulfilled'?(result.value.data.events||[]).map(event=>eventMatch(event,result.value.league)).filter(Boolean):[]);
 return [...new Map(all.map(match=>[match.providerEventId,match])).values()];
}

function sameGame(a,b){
 const gap=Math.abs(Date.parse(a.date)-Date.parse(b.date));
 if(!Number.isFinite(gap)||gap>64800000)return false;
 const aHome=fold(a.home?.name),bHome=fold(b.home?.name),aAway=fold(a.away?.name),bAway=fold(b.away?.name);
 return (aHome.includes('flamengo')&&bHome.includes('flamengo'))||(aAway.includes('flamengo')&&bAway.includes('flamengo'));
}

function surrounding(official,espn){
 const now=Date.now();
 const past=espn.filter(match=>match.state==='post'||Date.parse(match.date)<now-10800000).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).slice(0,4);
 const future=espn.filter(match=>match.state!=='post'&&Date.parse(match.date)>=now-10800000).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)).slice(0,8);
 const candidates=[...past,...future],used=new Set();
 const merged=official.map(match=>{
  const found=candidates.find(row=>!used.has(row.providerEventId)&&sameGame(match,row));
  if(!found)return match;
  used.add(found.providerEventId);
  return {...match,...found,id:match.id,competition:match.competition||found.competition,venue:found.venue||match.status||found.status};
 });
 for(const match of candidates)if(!used.has(match.providerEventId))merged.push(match);
 const unique=[...new Map(merged.map(match=>[match.id,match])).values()].sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
 const old=unique.filter(match=>match.state==='post'||Date.parse(match.date)<now-10800000).slice(-4);
 const next=unique.filter(match=>match.state!=='post'&&Date.parse(match.date)>=now-10800000).slice(0,8);
 return [...old,...next];
}

async function eventFor(match){
 if(match.providerEventId&&match.providerLeague)return {event:{id:match.providerEventId},league:match.providerLeague};
 const day=String(match.date).slice(0,10).replaceAll('-','');
 for(const league of ESPN_LEAGUES){try{const data=await getJson('https://site.api.espn.com/apis/site/v2/sports/soccer/'+league+'/scoreboard?dates='+day),event=(data.events||[]).find(row=>(row.competitions?.[0]?.competitors||[]).some(team=>String(team.id||team.team?.id)===FLAMENGO_ID));if(event)return {event,league};}catch{}}
 return null;
}

async function enrich(match){
 try{
  const found=await eventFor(match);
  if(!found)return withLogos({...match,venue:match.venue||match.status,lineupStatus:'unavailable'});
  const event=found.event;
  let squads=[],summary=null;
  try{
   summary=await getJson('https://site.api.espn.com/apis/site/v2/sports/soccer/'+found.league+'/summary?event='+event.id,12000);
   squads=lineups(summary);
  }catch{}
  const header=summary?.header||event,comp=event.competitions?.[0]||header.competitions?.[0]||{},rows=comp.competitors||[],home=competitor(rows,'home'),away=competitor(rows,'away');
  const eventDate=event.date||header.date||match.date,reportedState=header.status?.type?.state||event.status?.type?.state||match.state;
  const stateNow=reportedState==='pre'&&Date.parse(eventDate)<Date.now()-21600000?'post':reportedState;
  const lineupStatus=squads.length?(stateNow==='post'?'historical':stateNow==='in'?'confirmed':'probable'):'unavailable';
  return withLogos({
   ...match,
   providerEventId:String(event.id),
   providerLeague:found.league,
   date:eventDate,
   state:stateNow,
   status:stateNow==='post'?'Encerrado':header.status?.type?.shortDetail||event.status?.type?.shortDetail||match.status,
   venue:comp.venue?.fullName||match.venue||match.status,
   home:home||match.home,
   away:away||match.away,
   probabilities:projections(comp)||match.probabilities,
   broadcasts:broadcastNames(comp,event,header),
   coverageUrl:coverageLink(event)||match.coverageUrl,
   events:matchEvents(summary),
   lineups:squads,
   lineupStatus,
   dataSource:'ESPN'
  });
 }catch{return withLogos({...match,venue:match.venue||match.status,lineupStatus:'unavailable'});}
}

function addProbableLineups(matches){
 const historical=[...matches].filter(match=>match.state==='post'&&(match.lineups||[]).some(group=>group.teamId===FLAMENGO_ID||fold(group.team).includes('flamengo'))).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
 const basis=historical[0],flamengo=basis?.lineups?.find(group=>group.teamId===FLAMENGO_ID||fold(group.team).includes('flamengo'));
 if(!basis||!flamengo)return matches;
 return matches.map(match=>{
  if(match.state!=='pre'||(match.lineups||[]).length)return match;
  return {...match,lineups:[{...flamengo,team:'Flamengo',probable:true}],lineupStatus:'probable',lineupBasis:{id:basis.id,date:basis.date,game:basis.home.name+' × '+basis.away.name},dataSource:'ESPN'};
 });
}

export async function enrichMatches(rows){
 let extended=rows;
 try{extended=surrounding(rows,await schedule());}catch{}
 return addProbableLineups(await mapLimit(extended,4,enrich));
}
