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

const stateful=await handler(new Request(origin+'/api/polls'),context);
assert.equal(stateful.status,503,'Rotas persistentes sem backend devem falhar de forma segura');
assert.match((await stateful.json()).error,/configuração do banco de dados/,'A mensagem de configuração do backend mudou inesperadamente');

await Promise.allSettled(pending);
console.log('Netlify adapter: ok');
