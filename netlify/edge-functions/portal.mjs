import portal from '../../dist/server/index.js';

const PRIMARY_ORIGIN='https://nacao-rubro-negra.netlify.app';
const POLLS=['melhor-2026-09','saida-2026-09'];
const statefulPaths=new Set([
  '/api/groups',
  '/api/match-opinions',
  '/api/match-prediction',
  '/api/player-rating'
]);

function envValue(context,name){
 try{return context?.env?.get?.(name)||globalThis.Netlify?.env?.get?.(name)||globalThis.Deno?.env?.get?.(name)||''}catch{return ''}
}

function securityHeaders(response){
 const headers=new Headers(response.headers);
 headers.set('x-content-type-options','nosniff');
 headers.set('referrer-policy','strict-origin-when-cross-origin');
 headers.set('permissions-policy','camera=(), microphone=(), geolocation=()');
 headers.set('x-frame-options','SAMEORIGIN');
 headers.set('cross-origin-opener-policy','same-origin-allow-popups');
 headers.set('x-nrn-runtime','netlify-edge');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}

function needsPersistentBackend(pathname){
 return statefulPaths.has(pathname)||pathname.startsWith('/api/community')||pathname.startsWith('/api/admin/');
}

function persistenceError(error,code,status=503){
 return Response.json({error,code,localFallback:true},{status,headers:{'cache-control':'no-store'}});
}

const pollVoter=request=>request.headers.get('cookie')?.match(/(?:^|;\s*)nrn_voter=([a-f0-9-]{36})(?:;|$)/)?.[1]||null;
const pollCookie=id=>'nrn_voter='+id+'; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax';
const pollJSON=(data,status=200,headers={})=>Response.json(data,{status,headers:{'cache-control':'no-store',...headers}});
async function getPollStore(){
 if(globalThis.__NRN_BLOB_STORE__)return globalThis.__NRN_BLOB_STORE__;
 const {getStore}=await import('https://esm.sh/@netlify/blobs@11.1.0?target=deno');
 return getStore({name:'nrn-polls',consistency:'strong'});
}
async function allowedPollPlayer(request,context,poll,player){
 if(poll.startsWith('saida')&&player==='ninguem')return true;
 if(!/^[a-z0-9-]{2,64}$/i.test(player))return false;
 try{
  const url=new URL('/api/players',request.url),execution={waitUntil(promise){context?.waitUntil?.(promise)}};
  const response=await portal.fetch(new Request(url,{headers:{accept:'application/json'}}),{},execution);
  if(!response.ok)return false;
  const data=await response.json();
  return (data.players||[]).some(row=>String(row.id)===player);
 }catch{return false}
}
async function nativePollRequest(request,context){
 const url=new URL(request.url);
 try{
  const store=await getPollStore();
  if(url.pathname==='/api/polls'&&request.method==='GET'){
   const id=pollVoter(request)||crypto.randomUUID();
   const polls=await Promise.all(POLLS.map(async poll=>{
    const [{blobs},mine]=await Promise.all([
     store.list({prefix:'votes/'+poll+'/'}),
     store.get('voters/'+poll+'/'+id,{consistency:'strong'})
    ]);
    const counts=new Map();
    for(const blob of blobs||[]){
     const parts=String(blob.key||'').split('/');
     if(parts.length!==4||parts[0]!=='votes'||parts[1]!==poll)continue;
     counts.set(parts[2],(counts.get(parts[2])||0)+1);
    }
    const options=[...counts].map(([player,votes])=>({player,votes})).sort((a,b)=>b.votes-a.votes||a.player.localeCompare(b.player));
    return {id:poll,total:options.reduce((sum,row)=>sum+row.votes,0),options,mine:mine||null};
   }));
   return pollJSON({polls,storage:'netlify-blobs'},200,{'set-cookie':pollCookie(id)});
  }
  if(url.pathname==='/api/vote'&&request.method==='POST'){
   if(request.headers.get('origin')!==url.origin)return pollJSON({error:'Origem inválida.'},403);
   if(!request.headers.get('content-type')?.startsWith('application/json'))return pollJSON({error:'Formato inválido.'},415);
   if(+(request.headers.get('content-length')||0)>2048)return pollJSON({error:'Pedido muito grande.'},413);
   const raw=await request.text();if(raw.length>2048)return pollJSON({error:'Pedido muito grande.'},413);
   let body;try{body=JSON.parse(raw)}catch{return pollJSON({error:'JSON inválido.'},400)}
   const {poll,player}=body,id=pollVoter(request),choice=String(player||'');
   if(!id)return pollJSON({error:'Abra os resultados antes de votar.'},400);
   if(!POLLS.includes(poll))return pollJSON({error:'Enquete inválida.'},400);
   if(!await allowedPollPlayer(request,context,poll,choice))return pollJSON({error:'Escolha um jogador do elenco.'},400);
   const lockKey='voters/'+poll+'/'+id,lock=await store.set(lockKey,choice,{onlyIfNew:true}),saved=lock.modified?choice:await store.get(lockKey,{consistency:'strong'});
   if(saved)await store.set('votes/'+poll+'/'+saved+'/'+id,'1',{onlyIfNew:true});
   const accepted=Boolean(lock.modified);
   return pollJSON({accepted,message:accepted?'Voto registrado no placar da Nação.':'Seu voto já foi registrado nesta enquete.',storage:'netlify-blobs'});
  }
  return pollJSON({error:'Método não permitido.'},405,{allow:url.pathname==='/api/polls'?'GET':'POST'});
 }catch(error){
  console.error('native_poll_storage',error?.message||error);
  return persistenceError('O placar global está temporariamente indisponível. Seu voto pode continuar salvo neste aparelho.','POLL_STORE_UNAVAILABLE');
 }
}

async function proxyPersistentRequest(request,context){
 const configured=envValue(context,'PORTAL_BACKEND_ORIGIN');
 if(!configured)return persistenceError('Os recursos interativos aguardam a configuração do banco de dados neste ambiente.','PERSISTENCE_UNCONFIGURED');
 let backend;
 try{backend=new URL(configured)}catch{return persistenceError('PORTAL_BACKEND_ORIGIN inválida.','PERSISTENCE_CONFIG_INVALID')}
 if(!['https:','http:'].includes(backend.protocol)||backend.username||backend.password)return persistenceError('PORTAL_BACKEND_ORIGIN precisa ser uma origem HTTP ou HTTPS válida.','PERSISTENCE_CONFIG_INVALID');
 const incoming=new URL(request.url),target=new URL(incoming.pathname+incoming.search,backend),headers=new Headers(request.headers);
 headers.delete('host');
 headers.delete('authorization');
 headers.set('origin',backend.origin);
 headers.set('x-forwarded-host',incoming.host);
 headers.set('x-forwarded-proto',incoming.protocol.slice(0,-1));
 const token=envValue(context,'PORTAL_BACKEND_TOKEN');
 if(token)headers.set('authorization','Bearer '+token);
 const init={method:request.method,headers,redirect:'manual'};
 if(!['GET','HEAD'].includes(request.method))init.body=request.body;
 try{return await fetch(target,init)}catch{return persistenceError('O serviço de votos e comunidade está temporariamente indisponível.','PERSISTENCE_UPSTREAM_UNAVAILABLE',502)}
}

async function adaptOrigin(response,request){
 const destination=new URL(request.url).origin;
 if(destination===PRIMARY_ORIGIN)return response;
 const type=response.headers.get('content-type')||'',headers=new Headers(response.headers),location=headers.get('location');
 if(location?.startsWith(PRIMARY_ORIGIN))headers.set('location',location.replace(PRIMARY_ORIGIN,destination));
 if(!/(text\/html|application\/xml|text\/plain)/i.test(type))return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
 const body=(await response.text()).replaceAll(PRIMARY_ORIGIN,destination);
 headers.delete('content-length');
 return new Response(body,{status:response.status,statusText:response.statusText,headers});
}

export default async function handler(request,context){
 const pathname=new URL(request.url).pathname;
 if(pathname==='/api/polls'||pathname==='/api/vote')return securityHeaders(await nativePollRequest(request,context));
 if(needsPersistentBackend(pathname))return securityHeaders(await proxyPersistentRequest(request,context));
 const execution={waitUntil(promise){context?.waitUntil?.(promise)}};
 return securityHeaders(await adaptOrigin(await portal.fetch(request,{},execution),request));
}
