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

const stateful=await handler(new Request(origin+'/api/polls'),context);
assert.equal(stateful.status,503,'Rotas persistentes sem backend devem falhar de forma segura');
const statefulBody=await stateful.json();
assert.equal(statefulBody.code,'PERSISTENCE_UNCONFIGURED','A API precisa identificar a ausência do backend para o fallback local');
assert.equal(statefulBody.localFallback,true,'A API precisa sinalizar que a experiência local pode assumir');
assert.match(statefulBody.error,/configuração do banco de dados/,'A mensagem de configuração do backend mudou inesperadamente');

const community=await handler(new Request(origin+'/api/community?kind=unpopular'),context);
assert.equal(community.status,503,'A comunidade também precisa passar pelo adaptador persistente');
const communityBody=await community.json();
assert.equal(communityBody.code,'PERSISTENCE_UNCONFIGURED','A comunidade não está sendo interceptada pelo proxy persistente');
assert.equal(communityBody.localFallback,true,'A comunidade deve expor o mesmo contrato de indisponibilidade');

await Promise.allSettled(pending);
console.log('Netlify adapter: ok');
