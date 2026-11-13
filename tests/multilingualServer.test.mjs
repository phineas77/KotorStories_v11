import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();
const dir = await mkdtemp(join(tmpdir(), 'kotor-multilang-test-'));
const port = 25000 + Math.floor(Math.random() * 5000);
const base = `http://127.0.0.1:${port}`;
const pin = `test-${randomUUID()}`;
const proc = spawn(process.execPath, ['scripts/serve_protected_packs.mjs'], {
  cwd: root,
  env: {...process.env, KOTOR_AUDIO_SOURCE:'qwen', KOTOR_QWEN_AUDIO_DIR:dir, KOTOR_PORT:String(port), KOTOR_DEV_PIN:pin},
  stdio:['ignore','pipe','pipe'],
});
let stderr = '';
proc.stderr.on('data', b=>stderr+=b.toString());
const ready = async () => {
  for(let i=0;i<80;i++) {
    try { if((await fetch(`${base}/health`)).ok) return; } catch {}
    await new Promise(resolve=>setTimeout(resolve,80));
  }
  throw new Error('Test server failed to start: '+stderr);
};
try {
  for(const lang of ['it','de']) {
    await mkdir(join(dir,lang),{recursive:true});
    await copyFile(join(root,'server_demo_source',`sea-gate-${lang}.mp3`),join(dir,lang,'01.mp3'));
  }
  await test('Qwen server serves separate encrypted audio language packs', async t=> {
    await ready();
    await t.test('Health endpoint remains available',async()=>{
      const h=await (await fetch(`${base}/health`)).json();
      assert.equal(h.audioSource,'qwen');
    });
    await t.test('Unauthorized download fails',async()=>{
      const r=await fetch(`${base}/audio/it/01.kse`);
      assert.equal(r.status,401);
    });
    const device=`ks-${randomUUID()}`;
    const unlock=await fetch(`${base}/dev/activate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId:device,code:pin})});
    assert.equal(unlock.status,200);
    const token=(await unlock.json()).token;
    const headers={Authorization:`Bearer ${token}`,'X-Kotor-Device-Id':device};
    await t.test('Italian and German independent, English missing',async()=>{
      for(const lang of ['it','de']) {
        const man=await (await fetch(`${base}/packs/${lang}.json`,{headers})).json();
        assert.deepEqual(man.entries.map(x=>x.chapter),[1]);
        const blob=await (await fetch(`${base}/audio/${lang}/01.kse`,{headers})).arrayBuffer();
        assert.ok(blob.byteLength>128);
      }
      const en=await (await fetch(`${base}/packs/en.json`,{headers})).json();
      assert.equal(en.entries.length,0);
      const me=await (await fetch(`${base}/packs/me.json`,{headers})).json();
      assert.equal(me.entries.length,0);
    });
  });
} finally {
  proc.kill();
  await rm(dir,{recursive:true,force:true});
}
