import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes, createDecipheriv, createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const port=24000+Math.floor(Math.random()*10000),host=`http://127.0.0.1:${port}`;
const pin='local-test-secret-'+randomBytes(5).toString('hex');
const proc=spawn(process.execPath,['scripts/serve_protected_packs.mjs'],{cwd:root,env:{...process.env,KOTOR_PORT:String(port),KOTOR_DEV_PIN:pin},stdio:['ignore','pipe','pipe']});
let err='';proc.stderr.on('data',x=>err+=x.toString());
async function ready(){for(let i=0;i<50;i++){try{const r=await fetch(host+'/health');if(r.ok)return;}catch{}await new Promise(resolve=>setTimeout(resolve,80));}throw new Error('Server failed: '+err);}
const device='ks-'+crypto.randomUUID();
async function json(endpoint,options={}){return fetch(host+endpoint,options)}
let token='';
try {
 await test('protected pack dev workflow',async t=>{
  await ready();
  await t.test('Plain MP3 cannot be downloaded directly',async()=>{
   const r=await json('/audio/en/01.mp3');assert.equal(r.status,401);});
  await t.test('Manifest and keys require authentication',async()=>{
   assert.equal((await json('/packs/en.json')).status,401);
   assert.equal((await json('/license/en')).status,401);
  });
  await t.test('Wrong PIN is rejected',async()=>{
   const r=await json('/dev/activate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId:device,code:'bad-pin'})});assert.equal(r.status,403);
  });
  await t.test('Unlock token bound to device ID',async()=>{
   const r=await json('/dev/activate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId:device,code:pin})});assert.equal(r.status,200);token=(await r.json()).token;assert.match(token,/^[0-9a-f]{64}$/);
   assert.equal((await json('/packs/en.json',{headers:{Authorization:`Bearer ${token}`,'X-Kotor-Device-Id':'ks-'+crypto.randomUUID()}})).status,401);
  });
  const headers=()=>({Authorization:`Bearer ${token}`,'X-Kotor-Device-Id':device});
  await t.test('Manifest returns encrypted entries, never license key',async()=>{
   const r=await json('/packs/en.json',{headers:headers()});assert.equal(r.status,200);
   const m=await r.json();assert.equal(m.version,2);assert.equal(m.cipher,'AES-256-GCM');assert.ok(m.entries.length>=5);assert.equal(JSON.stringify(m).includes('key'),false);
  });
  await t.test('Audio encrypted with AES-256-GCM, tampering rejected',async()=>{
   const license=await (await json('/license/en',{headers:headers()})).json();
   const r=await json('/audio/en/01.kse',{headers:headers()});assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'application/octet-stream');
   const encrypted=Buffer.from(await r.arrayBuffer());
   const decrypt=(blob)=>{
    const nonce=blob.subarray(0,12),tag=blob.subarray(blob.length-16),ciphertext=blob.subarray(12,blob.length-16);
    const d=createDecipheriv('aes-256-gcm',Buffer.from(license.key,'base64'),nonce);d.setAuthTag(tag);
    return Buffer.concat([d.update(ciphertext),d.final()]);
   };
   const plain=decrypt(encrypted);assert.ok(plain.length>100);assert.equal(plain.subarray(0,3).toString(),'ID3');
   const copy=Buffer.from(encrypted);copy[25]^=1;
   assert.throws(()=>decrypt(copy),/auth|authenticate|unsupported state/i);
   const m=await (await json('/packs/en.json',{headers:headers()})).json();const entry=m.entries.find(e=>e.chapter===1);
   assert.equal(entry.md5,createHash('md5').update(encrypted).digest('hex'));
   assert.equal(entry.bytes,encrypted.length);
  });
  await t.test('No anonymous access to audio even with correct URL',async()=>{
   assert.equal((await json('/audio/en/01.kse')).status,401);
  });
 });
} finally {proc.kill();}
