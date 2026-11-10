/** Protected offline audio, DEVELOPMENT VERSION. No Apple/Google purchase verification yet.
 * Files in Documents are AES-256-GCM encrypted. SecureStore keeps a per-language key.
 * Playback temporarily decrypts a single file to private Cache and removes it afterward.
 * This raises the difficulty of copying; it is NOT unbreakable DRM.
 */
import * as FS from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import Storage from 'expo-sqlite/kv-store';
import { gcm } from '@noble/ciphers/aes.js';
import { from64, to64 } from './base64Codec';
import type { Language } from './stops';
const ROOT = `${FS.documentDirectory ?? ''}kotor-stories-protected/v2/`;
const TEMP = `${FS.cacheDirectory ?? ''}kotor-stories-playback/`;
const OLD_ROOT = `${FS.documentDirectory ?? ''}kotor-stories-audio/v1/`;
const HOST_KEY='kotor-protected-host';
const TOKEN_KEY='kotor-dev-access-token-v2';
const DEVICE_KEY='kotor-device-id-v2';
const allLanguages: Language[]=['en','de','it','fr','es','me'];
export type SecurePackStatus = {language:Language;installed:number;expected:number;bytes:number;chapters:number[]};
export type SecureManifestEntry = {chapter:number;filename:string;bytes:number;md5:string};
export type SecureManifest = {version:2;language:Language;kind:'demo'|'full';cipher:'AES-256-GCM';entries:SecureManifestEntry[]};
export type SecurePackProgress = {done:number;total:number;chapter:number};

function validChapter(n:number){return Number.isInteger(n)&&n>=1&&n<=29;}
function packDir(lang:Language){return `${ROOT}${lang}/`;}
function localPath(lang:Language,chapter:number){return `${packDir(lang)}${String(chapter).padStart(2,'0')}.kse`;}
function keyName(lang:Language){return `kotor-key-v2-${lang}`;}
async function dir(path:string){if(!(await FS.getInfoAsync(path)).exists)await FS.makeDirectoryAsync(path,{intermediates:true});}
export function normalizeHost(value:string):string {
 const host=value.trim().replace(/\/+$/,'');
 // HTTP allowed ONLY on private LAN for demo. Never for a production purchase/license server.
 const dev=/^http:\/\/(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|localhost|127\.0\.0\.1)(?::\d+)?$/.test(host);
 const https=/^https:\/\/[a-zA-Z0-9.-]+(?::\d+)?$/.test(host);
 if(!dev&&!https)throw new Error('Use http://192.168.x.x:8787 for LAN demo or an HTTPS production host.');
 return host;
}
export async function savedHost(){return await Storage.getItem(HOST_KEY)||'';}
export async function saveHost(value:string){const h=normalizeHost(value);await Storage.setItem(HOST_KEY,h);return h;}
async function deviceId(){let value=await SecureStore.getItemAsync(DEVICE_KEY);
 if(!value){value='ks-'+Crypto.randomUUID();await SecureStore.setItemAsync(DEVICE_KEY,value);}
 return value;
}
async function authHeaders(){const token=await SecureStore.getItemAsync(TOKEN_KEY);
 if(!token)throw new Error('First tap DEV UNLOCK. Demo code is required.');
 return {Authorization:`Bearer ${token}`,'X-Kotor-Device-Id':await deviceId()};
}
async function authorizedJson(url:string){const res=await fetch(url,{headers:await authHeaders()});
 if(res.status===401)throw new Error('Demo access expired. Tap DEV UNLOCK again.');
 if(!res.ok)throw new Error(`Server HTTP ${res.status}`);
 return res.json();
}
export async function unlockDemo(host:string,code:string){const h=await saveHost(host);
 if(code.trim().length<4)throw new Error('Enter the development test code.');
 const res=await fetch(`${h}/dev/activate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId:await deviceId(),code})});
 if(!res.ok)throw new Error(`Unlock rejected (HTTP ${res.status}).`);
 const data=await res.json();
 if(!/^[0-9a-f]{64}$/.test(data.token))throw new Error('Invalid server response.');
 await SecureStore.setItemAsync(TOKEN_KEY,data.token);
 return h;
}
export async function fetchSecureManifest(host:string,language:Language):Promise<SecureManifest>{
 const base=normalizeHost(host);const input=await authorizedJson(`${base}/packs/${language}.json`);
 if(input.version!==2||input.language!==language||input.cipher!=='AES-256-GCM'||!['full','demo'].includes(input.kind)||!Array.isArray(input.entries)||input.entries.length>29)throw new Error('Invalid encrypted audio manifest.');
 const used=new Set<number>();
 for(const entry of input.entries){
  if(!validChapter(entry.chapter)||entry.filename!==String(entry.chapter).padStart(2,'0')+'.kse'||!Number.isInteger(entry.bytes)||entry.bytes<30||!/^[a-f0-9]{32}$/.test(entry.md5)||used.has(entry.chapter))throw new Error('Corrupt manifest entry.');
  used.add(entry.chapter);
 }
 if(input.kind==='full'&&used.size!==29)throw new Error('A full pack must include 29 tracks.');
 return input;
}
async function ensureLicense(host:string,language:Language){
 const keyData=await authorizedJson(`${normalizeHost(host)}/license/${language}`);
 if(keyData.language!==language||typeof keyData.key!=='string'||from64(keyData.key).length!==32)throw new Error('Invalid audio license key.');
 // Key is deliberately kept out of plaintext KV storage, JS bundles and the manifest.
 await SecureStore.setItemAsync(keyName(language),keyData.key);
}
export async function securePackStatus(language:Language):Promise<SecurePackStatus>{
 let bytes=0;const chapters:number[]=[];
 for(let chapter=1;chapter<=29;chapter++){
  const info=await FS.getInfoAsync(localPath(language,chapter));
  if(info.exists&&'size'in info&&typeof info.size==='number'&&info.size>30){bytes+=info.size;chapters.push(chapter)}
 }
 return {language,installed:chapters.length,expected:29,bytes,chapters};
}
export async function downloadSecurePack(host:string,language:Language,progress:(p:SecurePackProgress)=>void):Promise<SecurePackStatus>{
 const base=normalizeHost(host);const manifest=await fetchSecureManifest(base,language);
 await ensureLicense(base,language);await dir(packDir(language));
 for(let i=0;i<manifest.entries.length;i++){
  const entry=manifest.entries[i];const dest=localPath(language,entry.chapter);
  const current=await FS.getInfoAsync(dest,{md5:true});
  if(current.exists&&current.size===entry.bytes&&current.md5?.toLowerCase()===entry.md5){progress({done:i+1,total:manifest.entries.length,chapter:entry.chapter});continue;}
  const temp=dest+'.part';await FS.deleteAsync(temp,{idempotent:true});
  try{
   const result=await FS.downloadAsync(`${base}/audio/${language}/${entry.filename}`,temp,{headers:await authHeaders(),md5:true});
   const chk=await FS.getInfoAsync(temp,{md5:true});
   if(result.status!==200||!chk.exists||chk.size!==entry.bytes||chk.md5?.toLowerCase()!==entry.md5)throw new Error(`Download invalid for chapter ${entry.chapter}`);
   await FS.deleteAsync(dest,{idempotent:true});await FS.moveAsync({from:temp,to:dest});
  }catch(err){await FS.deleteAsync(temp,{idempotent:true});throw err;}
  progress({done:i+1,total:manifest.entries.length,chapter:entry.chapter});
 }
 return securePackStatus(language);
}
// Expo Audio needs an ordinary file:// URI. Decrypt ONE track into short-lived private Cache.
let currentTemp:string|null=null;
export async function clearPlaybackFile(){if(currentTemp){const old=currentTemp;currentTemp=null;await FS.deleteAsync(old,{idempotent:true}).catch(()=>{});}}
export async function playbackUri(language:Language,chapter:number):Promise<string|null>{
 if(!validChapter(chapter)||!allLanguages.includes(language))return null;
 const encryptedPath=localPath(language,chapter);
 if(!(await FS.getInfoAsync(encryptedPath)).exists)return null;
 const storedKey=await SecureStore.getItemAsync(keyName(language));
 if(!storedKey)throw new Error('Audio key unavailable: unlock and download this language again.');
 await clearPlaybackFile();await dir(TEMP);
 try{
  const blob=from64(await FS.readAsStringAsync(encryptedPath,{encoding:'base64'}));
  if(blob.length<29)throw new Error('Encrypted audio is incomplete.');
  const plain=gcm(from64(storedKey),blob.slice(0,12)).decrypt(blob.slice(12));
  const destination=`${TEMP}playing-${language}-${String(chapter).padStart(2,'0')}.mp3`;
  await FS.writeAsStringAsync(destination,to64(plain),{encoding:'base64'});
  plain.fill(0); // best effort only; JS memory and OS playback buffers may retain copies
  currentTemp=destination;
  return destination;
 }catch(err){
  throw new Error(`Cannot unlock chapter ${chapter}. Please download the pack again. ${String(err)}`);
 }
}
export async function deleteProtectedPack(language:Language){await clearPlaybackFile();await FS.deleteAsync(packDir(language),{idempotent:true});await SecureStore.deleteItemAsync(keyName(language));}
export async function cleanupUnprotectedLegacyAudio(){
 // Existing v0.9 downloads were plain MP3. Remove them during the protected migration.
 await FS.deleteAsync(OLD_ROOT,{idempotent:true}).catch(()=>{});
 await clearPlaybackFile();
 // Clean stale tmp files from crashes or previous sessions.
 await FS.deleteAsync(TEMP,{idempotent:true}).catch(()=>{});
}
export function sizeMB(bytes:number){return (bytes/(1024*1024)).toFixed(1)+' MB';}
