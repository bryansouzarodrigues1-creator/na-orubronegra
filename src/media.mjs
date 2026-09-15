const HOSTS=new Set(['admin.cnnbrasil.com.br','a.espncdn.com','storage.googleapis.com']);
export function allowedMedia(value){try{const u=new URL(value);if(u.protocol!=='https:'||u.port||u.username||u.password||!HOSTS.has(u.hostname))return false;if(u.hostname==='admin.cnnbrasil.com.br')return u.pathname.startsWith('/wp-content/uploads/');if(u.hostname==='storage.googleapis.com')return u.pathname.startsWith('/crf-strapi-media-prd/');return u.pathname.startsWith('/i/');}catch{return false}}
export async function deliverImage(request){
 const source=new URL(request.url).searchParams.get('src');
 if(!allowedMedia(source))return new Response('Imagem inválida',{status:400});
 try{
  const upstream=await fetch(source,{redirect:'manual',signal:AbortSignal.timeout(12000)});
  if(!upstream.ok)return new Response('Imagem indisponível',{status:502,headers:{'cache-control':'no-store'}});
  const mime=(upstream.headers.get('content-type')||'').split(';')[0];
  if(!['image/jpeg','image/png','image/webp','image/gif','image/avif'].includes(mime))return new Response('Formato inválido',{status:415});
  const max=4*1024*1024;if(Number(upstream.headers.get('content-length'))>max){await upstream.body.cancel();return new Response('Imagem muito grande',{status:413});}
  const reader=upstream.body.getReader(),chunks=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();return new Response('Imagem muito grande',{status:413});}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  return new Response(bytes,{headers:{'content-type':mime,'content-length':String(size),'cache-control':'public, max-age=86400, stale-while-revalidate=604800','x-content-type-options':'nosniff'}});
 }catch{return new Response('Imagem indisponível',{status:504,headers:{'cache-control':'no-store'}});}
}
