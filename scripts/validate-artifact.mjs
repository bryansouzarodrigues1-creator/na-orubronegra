import fs from 'node:fs';
const entry='dist/server/index.js';
if(!fs.existsSync(entry)) throw new Error('Worker output não encontrado');
if(!fs.existsSync('dist/.openai/hosting.json')) throw new Error('Manifesto não encontrado');

const bundle=fs.readFileSync(entry,'utf8');
const required=[
 ['social-card.svg','Card social não entrou no bundle'],
 ['summary_large_image','Metadados sociais regrediram'],
 ['nrn-local-engagement-v3','Fallback local de votos/palpites não entrou no bundle'],
 ['flamengo-visual-strip','Identidade visual da central de jogos não entrou no bundle'],
 ['Dois torcedores do Flamengo conversando','Ilustração da comunidade não entrou no bundle']
];
for(const [marker,message] of required)if(!bundle.includes(marker))throw new Error(message);

const preview=fs.readFileSync('vite.config.mjs','utf8');
for(const marker of ['category-matchday.webp','category-discussion.webp','category-videos.webp','category-votes.webp','category-groups.webp','category-history.webp']){
 if(!preview.includes(marker))throw new Error('A prévia do Lovable/Vite perdeu a capa '+marker);
}
if(!preview.includes("url.pathname==='/api/player-photo'"))throw new Error('A prévia não entrega as fotos das escalações');
if(!preview.includes("url.pathname==='/api/flamengo-live'"))throw new Error('A prévia não verifica a live da FlaTV');

if(bundle.includes('nacao-rubro-negra.bryansouzarodrigues0.chatgpt.site'))throw new Error('O domínio canônico antigo reapareceu no bundle');
console.log('Artifact integrity: ok');
