import fs from 'node:fs';
import {officialMatches} from '../src/data.mjs';
const SOURCE='https://www.flamengo.com.br/';
const response=await fetch(SOURCE,{signal:AbortSignal.timeout(20000)});
if(!response.ok)throw new Error('Agenda HTTP '+response.status);
const matches=officialMatches(await response.text());
if(matches.length<3)throw new Error('Agenda retornou somente '+matches.length+' jogos');
fs.writeFileSync(new URL('../src/schedule-snapshot.json',import.meta.url),JSON.stringify({source:SOURCE,updatedAt:new Date().toISOString(),matches},null,2)+'\n');
console.log(JSON.stringify({matches:matches.length,first:matches[0].date,last:matches.at(-1).date}));
