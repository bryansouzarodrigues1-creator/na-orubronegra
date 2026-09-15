import fs from 'node:fs';
import {cnnItems,rssItems,rosterItems,mergeNews} from '../src/data.mjs';
const cnn=cnnItems(fs.readFileSync('/tmp/nrn-cnn.html','utf8'));
const news=mergeNews([cnn,rssItems(fs.readFileSync('/tmp/nrn-google.xml','utf8'))]);
const raw=JSON.parse(fs.readFileSync('/tmp/nrn-players.json','utf8'));
const players=rosterItems(raw,cnn);
// Portraits are matched to named photographs already supplied by the publisher.
const named={'179767':'Arrascaeta','268934':'Samuel Lino'};
for(const p of players){const term=named[p.id]||p.name;const match=cnn.find(x=>x.title.includes(term)&&x.imageAlt.toLowerCase().includes(term.toLowerCase()));if(match){p.photo=match.image;p.photoSource=match.link;}}
fs.mkdirSync('src',{recursive:true});fs.writeFileSync('src/snapshot.json',JSON.stringify({updatedAt:new Date().toISOString(),rosterUpdatedAt:raw.timestamp,news,players},null,2)+'\n');
console.log(JSON.stringify({news:news.length,players:players.length,photos:players.filter(x=>x.photo).map(x=>x.name)}));
