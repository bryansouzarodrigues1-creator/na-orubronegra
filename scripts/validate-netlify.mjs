import assert from 'node:assert/strict';
import handler from '../netlify/edge-functions/portal.mjs';

const pending=[];
const context={waitUntil(promise){pending.push(Promise.resolve(promise))},env:{get(){return ''}}};
const origin='https://nacao-rubro-negra.netlify.app';

const home=await handler(new Request(origin+'/'),context);
assert.equal(home.status,200,'A página inicial precisa responder no Netlify');
assert.match(home.headers.get('content-type')||'',/text\/html/,'A página inicial precisa entregar HTML');
assert.equal(home.headers.get('x-nrn-runtime'),'netlify-edge','Os cabeçalhos do adaptador não foram aplicados');
const html=await home.text();
assert.ok(html.includes(origin),'Metadados ainda apontam para o domínio antigo');
assert.ok(!html.includes('nacao-rubro-negra.bryansouzarodrigues0.chatgpt.site'),'O domínio antigo ainda aparece no HTML');

const manifest=await handler(new Request(origin+'/manifest.webmanifest'),context);
assert.equal(manifest.status,200,'O manifesto PWA precisa responder');
assert.match(manifest.headers.get('content-type')||'',/manifest|json/,'O manifesto PWA precisa manter o tipo correto');

const social=await handler(new Request(origin+'/social-card.svg'),context);
assert.equal(social.status,200,'O card social precisa responder');
assert.match(social.headers.get('content-type')||'',/image\/svg\+xml/,'O card social precisa manter o tipo SVG');
const socialBody=await social.text();
assert.match(socialBody,/NAÇÃO/,'O card social perdeu a identidade do portal');
assert.match(html,/property="og:image" content="https:\/\/nacao-rubro-negra\.netlify\.app\/social-card\.svg"/,'O Open Graph precisa usar o card social canônico');
assert.match(html,/name="twitter:card" content="summary_large_image"/,'O Twitter Card precisa usar o formato grande');

const blobMemory=new Map();
globalThis.__NRN_BLOB_STORE__={
 async get(key){return blobMemory.has(key)?blobMemory.get(key):null},
 async set(key,value,options={}){if(options.onlyIfNew&&blobMemory.has(key))return {modified:false};blobMemory.set(key,String(value));return {modified:true,etag:'"mock-'+blobMemory.size+'"'}},
 async list({prefix=''}={}){return {blobs:[...blobMemory.keys()].filter(key=>key.startsWith(prefix)).map(key=>({key,etag:'"mock"'})),directories:[]}}
};

const rosterResponse=await handler(new Request(origin+'/api/players'),context);
assert.equal(rosterResponse.status,200,'O elenco precisa estar disponível para validar votos');
const rosterBody=await rosterResponse.json();
const testPlayer=String(rosterBody.players?.[0]?.id||'');
assert.ok(testPlayer,'O teste de votação precisa de um jogador válido');

const pollsBefore=await handler(new Request(origin+'/api/polls'),context);
assert.equal(pollsBefore.status,200,'A votação global deve usar Netlify Blobs sem backend externo');
const cookie=(pollsBefore.headers.get('set-cookie')||'').split(';')[0];
assert.match(cookie,/^nrn_voter=/,'A votação precisa criar o identificador anônimo do navegador');
const initialPolls=await pollsBefore.json();
assert.equal(initialPolls.storage,'netlify-blobs','A votação global precisa declarar o armazenamento nativo');
assert.equal(initialPolls.polls.find(row=>row.id==='melhor-2026-09')?.total,0,'A enquete de teste deve iniciar vazia');

const voteResponse=await handler(new Request(origin+'/api/vote',{method:'POST',headers:{origin,'content-type':'application/json',cookie},body:JSON.stringify({poll:'melhor-2026-09',player:testPlayer})}),context);
assert.equal(voteResponse.status,200,'Um voto válido precisa ser aceito');
const voteBody=await voteResponse.json();
assert.equal(voteBody.accepted,true,'O primeiro voto do navegador precisa entrar no placar');
assert.equal(voteBody.storage,'netlify-blobs','O voto precisa ser persistido no armazenamento nativo');

const pollsAfter=await handler(new Request(origin+'/api/polls',{headers:{cookie}}),context);
const afterBody=await pollsAfter.json(),mainPoll=afterBody.polls.find(row=>row.id==='melhor-2026-09');
assert.equal(mainPoll.total,1,'O placar global precisa contar o voto persistido');
assert.equal(mainPoll.mine,testPlayer,'O navegador precisa reconhecer o próprio voto');
assert.equal(mainPoll.options.find(row=>row.player===testPlayer)?.votes,1,'O jogador votado precisa receber um voto');

const duplicateResponse=await handler(new Request(origin+'/api/vote',{method:'POST',headers:{origin,'content-type':'application/json',cookie},body:JSON.stringify({poll:'melhor-2026-09',player:testPlayer})}),context);
assert.equal((await duplicateResponse.json()).accepted,false,'O mesmo navegador não pode contar duas vezes na mesma enquete');

const stateful=await handler(new Request(origin+'/api/match-opinions'),context);
assert.equal(stateful.status,503,'Recursos estruturados sem backend devem falhar de forma segura');
const statefulBody=await stateful.json();
assert.equal(statefulBody.code,'PERSISTENCE_UNCONFIGURED','A API precisa identificar a ausência do backend para o fallback local');
assert.equal(statefulBody.localFallback,true,'A API precisa sinalizar que a experiência local pode assumir');
assert.match(statefulBody.error,/configuração do banco de dados/,'A mensagem de configuração do backend mudou inesperadamente');

const community=await handler(new Request(origin+'/api/community?kind=unpopular'),context);
assert.equal(community.status,503,'A comunidade também precisa passar pelo adaptador persistente');
const communityBody=await community.json();
assert.equal(communityBody.code,'PERSISTENCE_UNCONFIGURED','A comunidade não está sendo interceptada pelo proxy persistente');
assert.equal(communityBody.localFallback,true,'A comunidade deve expor o mesmo contrato de indisponibilidade');

delete globalThis.__NRN_BLOB_STORE__;
await Promise.allSettled(pending);
console.log('Netlify adapter: ok');
