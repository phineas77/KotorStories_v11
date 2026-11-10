import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes, createDecipheriv } from 'node:crypto';
import { mkdtemp, copyFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = await mkdtemp(join(tmpdir(),'kotor-qwen-test-'));
const audioDir = join(dir,'en'); await mkdir(audioDir,{recursive:true});
// Deliberate fixture from existing demo, NOT actual Qwen audio: verifies server routing only.
await copyFile(join(root,'server_demo_source','clock-tower-en.mp3'),join(audioDir,'01.mp3'));
const port = 26000+Math.floor(Math.random()*6000);
const host = `http://127.0.0.1:${port}`;
const pin='qwen-server-test-'+randomBytes(5).toString('hex');
const proc = spawn(process.execPath,['scripts/serve_protected_packs.mjs'],{
 cwd:root,env:{...process.env,KOTOR_AUDIO_SOURCE:'qwen',KOTOR_QWEN_AUDIO_DIR:dir,KOTOR_PORT:String(port),KOTOR_DEV_PIN:pin},
 stdio:['ignore','pipe','pipe']
});
let error='';proc.stderr.on('data',x=>error+=x.toString());
async function ready(){for(let i=0;i<65;i++){try{if((await fetch(host+'/health')).ok)return}catch{} await new Promise(resolve=>setTimeout(resolve,60));}throw Error('Not ready '+error)}
try{
 await test('Qwen-only protected manifest and encrypted playback',async t=>{
  await ready();
  await t.test('Health identifies qwen source',async()=>{
   const response = await fetch(host+'/health'); assert.equal((await response.json()).audioSource,'qwen');
  });
  await t.test('Unauthorized users cannot fetch audio',async()=>{
   assert.equal((await fetch(host+'/audio/en/01.kse')).status,401);
  });
  const device='ks-'+crypto.randomUUID();
  const unlock=await fetch(host+'/dev/activate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId:device,code:pin})});
  assert.equal(unlock.status,200);const token=(await unlock.json()).token;
  const headers={Authorization:'Bearer '+token,'X-Kotor-Device-Id':device};
  await t.test('Manifest includes only staged English track',async()=>{
   const resp=await fetch(host+'/packs/en.json',{headers});assert.equal(resp.status,200);
   const man=await resp.json();assert.equal(man.kind,'demo');assert.deepEqual(man.entries.map(x=>x.chapter),[1]);
   const other=await (await fetch(host+'/packs/me.json',{headers})).json();assert.equal(other.entries.length,0);
  });
  await t.test('Selected track is encrypted and decryptable',async()=>{
   const key=(await (await fetch(host+'/license/en',{headers})).json()).key;
   const blob=Buffer.from(await (await fetch(host+'/audio/en/01.kse',{headers})).arrayBuffer());
   const d=createDecipheriv('aes-256-gcm',Buffer.from(key,'base64'),blob.subarray(0,12));
   d.setAuthTag(blob.subarray(blob.length-16));
   const mp3=Buffer.concat([d.update(blob.subarray(12,-16)),d.final()]);
   assert.equal(mp3.subarray(0,3).toString(),'ID3');
   assert.equal((await fetch(host+'/audio/en/05.kse',{headers})).status,404);
  });
 });
}finally{proc.kill();await rm(dir,{recursive:true,force:true});}
