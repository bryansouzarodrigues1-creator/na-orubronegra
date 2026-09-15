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

function needsPersistentBackend(pathname){
 return statefulPaths.has(pathname)||pathname.startsWith('/api/admin/');
}

async function proxyPersistentRequest(request,context){
 const configured=envValue(context,'PORTAL_BACKEND_ORIGIN');
 if(!configured)return Response.json({error:'Os recursos da comunidade aguardam a configuração do banco de dados neste ambiente.'},{status:503,headers:{'cache-control':'no-store'}});
 let backend;
 try{backend=new URL(configured)}catch{return Response.json({error:'PORTAL_BACKEND_ORIGIN inválida.'},{status:503})}
 if(!['https:','http:'].includes(backend.protocol))return Response.json({error:'PORTAL_BACKEND_ORIGIN precisa usar HTTP ou HTTPS.'},{status:503});
 const incoming=new URL(request.url),target=new URL(incoming.pathname+incoming.search,backend),headers=new Headers(request.headers);
 headers.delete('host');
 headers.set('origin',backend.origin);
 headers.set('x-forwarded-host',incoming.host);
 headers.set('x-forwarded-proto',incoming.protocol.slice(0,-1));
 const init={method:request.method,headers,redirect:'manual'};
 if(!['GET','HEAD'].includes(request.method))init.body=request.body;
 return fetch(target,init);
}

async function adaptOrigin(response,request){
 const destination=new URL(request.url).origin;
 if(destination===PRIMARY_ORIGIN)return response;
 const type=response.headers.get('content-type')||'';
 if(!/(text\/html|application\/xml|text\/plain)/i.test(type))return response;
 const headers=new Headers(response.headers),body=(await response.text()).replaceAll(PRIMARY_ORIGIN,destination);
 headers.delete('content-length');
 return new Response(body,{status:response.status,statusText:response.statusText,headers});
}

export default async function handler(request,context){
 const pathname=new URL(request.url).pathname;
 if(needsPersistentBackend(pathname))return proxyPersistentRequest(request,context);
 const execution={waitUntil(promise){context?.waitUntil?.(promise)}};
 return adaptOrigin(await portal.fetch(request,{},execution),request);
}

