// Base64 codec runs on Hermes without requiring browser globals or Buffer.
const A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export function from64(base64:string):Uint8Array {
 const clean=base64.trim();
 if(clean.length%4!==0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(clean))throw new Error('Bad Base64');
 const padding=clean.endsWith('==')?2:clean.endsWith('=')?1:0;
 const out=new Uint8Array(clean.length/4*3-padding);
 let i=0;
 for(let n=0;n<clean.length;n+=4){
  const z=A.indexOf(clean[n]),y=A.indexOf(clean[n+1]),w=clean[n+2]==='='?0:A.indexOf(clean[n+2]),q=clean[n+3]==='='?0:A.indexOf(clean[n+3]);
  if(z<0||y<0||w<0||q<0)throw new Error('Bad Base64 data');
  const val=(z<<18)|(y<<12)|(w<<6)|q;
  if(i<out.length)out[i++]=(val>>>16)&255;
  if(i<out.length)out[i++]=(val>>>8)&255;
  if(i<out.length)out[i++]=val&255;
 }
 return out;
}
export function to64(input:Uint8Array):string {
 let out='';
 for(let i=0;i<input.length;i+=3){
  const x=input[i],y=i+1<input.length?input[i+1]:0,z=i+2<input.length?input[i+2]:0;
  const n=(x<<16)|(y<<8)|z;
  out+=A[(n>>>18)&63]+A[(n>>>12)&63]+(i+1<input.length?A[(n>>>6)&63]:'=')+(i+2<input.length?A[n&63]:'=');
 }
 return out;
}
