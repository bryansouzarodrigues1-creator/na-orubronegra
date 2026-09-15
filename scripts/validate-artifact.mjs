import fs from 'node:fs';
const entry='dist/server/index.js';
if(!fs.existsSync(entry)) throw new Error('Worker output não encontrado');
if(!fs.existsSync('dist/.openai/hosting.json')) throw new Error('Manifesto não encontrado');
