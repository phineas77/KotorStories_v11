/**
 * KOTOR STORIES LOCAL PROTECTED-PACK DEMO. NEVER DEPLOY THIS SERVER PUBLICLY.
 * Uses developer PIN in a local network; NOT Apple/Google receipt verification.
 * Encrypted at rest in app, but playback briefly creates a plaintext cache file.
 */
import { createServer } from 'node:http';
import { createCipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, existsSync, writeFileSync, chmodSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const secureRoot = join(root,'server-private');
const audioRoot = join(root,'server_demo_source');
const qwenRoot = process.env.KOTOR_QWEN_AUDIO_DIR || join(root,'server_qwen_audio');
const audioSource = process.env.KOTOR_AUDIO_SOURCE === 'qwen' ? 'qwen' : 'demo';
const privateKeysPath = join(secureRoot,'pack-keys.json');
const port = Number(process.env.KOTOR_PORT || 8787);
const devPin = process.env.KOTOR_DEV_PIN;
if (!devPin || devPin.length < 4) { console.error('Set KOTOR_DEV_PIN (at least 4 characters) in the server terminal before starting.');process.exit(1); }
const langs = ['en','de','it','fr','es','me'];
const stops = [[1,'sea-gate'],[5,'clock-tower'],[9,'st-tryphon'],[12,'maritime-museum'],[16,'st-luke']];
const productionChapters = Array.from({length:29},(_,i)=>[i+1,'']);
mkdirSync(secureRoot,{recursive:true,mode:0o700});
let keys;
if(existsSync(privateKeysPath)){keys=JSON.parse(readFileSync(privateKeysPath,'utf8'));}
else {keys=Object.fromEntries(langs.map(l=>[l,randomBytes(32).toString('base64')]));writeFileSync(privateKeysPath,JSON.stringify(keys),{mode:0o600});}
try{chmodSync(privateKeysPath,0o600)}catch{}
const sessions = new Map();
const attempts = new Map();
function hash(x){return createHash('md5').update(x).digest('hex');}
function reply(res,code,data,type='application/json') {
 res.writeHead(code,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
 res.end(type==='application/json'?JSON.stringify(data):data);
}
function comparePin(a,b){const ah=createHash('sha256').update(a).digest(),bh=createHash('sha256').update(b).digest();return timingSafeEqual(ah,bh)}
function auth(req){
 const m=/^Bearer ([0-9a-f]{64})$/.exec(req.headers.authorization||'');
 if(!m) return false;
 const found=sessions.get(m[1]);
 return !!found && found.expires>Date.now() && found.device===req.headers['x-kotor-device-id'];
}
const encrypted = new Map();
for(const lang of langs){
 const key=Buffer.from(keys[lang]||'', 'base64');
 if(key.length!==32) throw new Error('Invalid persisted encryption key for '+lang);
 const entries=[];
 for(const [chapter,slug] of (audioSource === 'qwen' ? productionChapters : stops)){
  const source = audioSource === 'qwen' ? join(qwenRoot,lang,`${String(chapter).padStart(2,'0')}.mp3`) : join(audioRoot,`${slug}-${lang}.mp3`);
  if(!existsSync(source)) continue;
  const nonce=randomBytes(12), cipher=createCipheriv('aes-256-gcm',key,nonce);
  const ciphertext=Buffer.concat([cipher.update(readFileSync(source)),cipher.final()]);
  // Compatible with @noble/ciphers gcm().decrypt(ciphertext + 16-byte auth tag)
  const blob=Buffer.concat([nonce,ciphertext,cipher.getAuthTag()]);
  const filename=String(chapter).padStart(2,'0')+'.kse';
  encrypted.set(`${lang}/${filename}`,blob);
  entries.push({chapter,filename,bytes:blob.length,md5:hash(blob)});
 }
 encrypted.set(`manifest/${lang}`,{version:2,language:lang,kind:entries.length===29?'full':'demo',cipher:'AES-256-GCM',entries});
}
const server=createServer(async(req,res)=>{
 const path=(req.url||'').split('?')[0];
 if(path==='/health' && req.method==='GET') return reply(res,200,{status:'development-only',protected:true,audioSource});
 if(path==='/dev/activate' && req.method==='POST'){
  const ip=req.socket.remoteAddress||'unknown', attempt=attempts.get(ip)||{n:0,until:Date.now()+60000};
  if(Date.now()>attempt.until){attempt.n=0;attempt.until=Date.now()+60000}
  attempt.n++;attempts.set(ip,attempt);
  if(attempt.n>8)return reply(res,429,{error:'Too many tries; retry later'});
  const buffers=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>2048)return reply(res,413,{error:'Too large'});buffers.push(chunk)}
  let input;try{input=JSON.parse(Buffer.concat(buffers).toString('utf8'))}catch{return reply(res,400,{error:'Invalid JSON'})}
  if(typeof input.deviceId!=='string'||!/^ks-[0-9a-f-]{36}$/.test(input.deviceId)||typeof input.code!=='string')return reply(res,400,{error:'Bad request'});
  if(!comparePin(input.code,devPin))return reply(res,403,{error:'Invalid development code'});
  const token=randomBytes(32).toString('hex');const expires=Date.now()+8*3600*1000;
  sessions.set(token,{device:input.deviceId,expires});
  return reply(res,200,{token,expires});
 }
 if(!auth(req))return reply(res,401,{error:'Not unlocked. Use DEV UNLOCK before downloading.'});
 const man=path.match(/^\/packs\/(en|de|it|fr|es|me)\.json$/);
 if(man)return reply(res,200,encrypted.get(`manifest/${man[1]}`));
 const license=path.match(/^\/license\/(en|de|it|fr|es|me)$/);
 if(license)return reply(res,200,{language:license[1],key:keys[license[1]],keyId:'v2-demo-'+license[1]});
 const file=path.match(/^\/audio\/(en|de|it|fr|es|me)\/(0[1-9]|1\d|2\d)\.kse$/);
 if(file){const content=encrypted.get(`${file[1]}/${file[2]}.kse`);return content?reply(res,200,content,'application/octet-stream'):reply(res,404,{error:'Missing chapter'});}
 return reply(res,404,{error:'Unknown resource'});
});
server.listen(port,'0.0.0.0',()=>{
 console.log('Kotor Stories · ENCRYPTED LOCAL DEMO · NEVER EXPOSE TO PUBLIC INTERNET');
 console.log('Source mode: ' + audioSource + (audioSource === 'qwen' ? ' (staged local audio per language; no ElevenLabs fallback)' : ' (original test audio)'));
 for(const nets of Object.values(networkInterfaces()))for(const n of nets||[])if(n.family==='IPv4'&&!n.internal)console.log(`URL for iPhone: http://${n.address}:${port}`);
 console.log('Audio served: ENCRYPTED .kse only, auth required. Offline AES keys persisted in server-private/.');
});
export {server};
