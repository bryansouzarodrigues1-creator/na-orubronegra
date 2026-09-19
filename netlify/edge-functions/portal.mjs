import portal from '../../dist/server/index.js';

const PRIMARY_ORIGIN='https://nacao-rubro-negra.bryansouzarodrigues0.chatgpt.site';
const statefulPaths=new Set([
  '/api/groups',
  '/api/match-opinions',
  '/api/match-prediction',
  '/api/player-rating',
  '/api/polls',
  '/api/vote'
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
 if(needsPersistentBackend(pathname))return securityHeaders(await proxyPersistentRequest(request,context));
 const execution={waitUntil(promise){context?.waitUntil?.(promise)}};
 return securityHeaders(await adaptOrigin(await portal.fetch(request,{},execution),request));
}
