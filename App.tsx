import React, { useEffect, useRef, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Storage from 'expo-sqlite/kv-store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { languages, type Language } from './src/stops';
import { storiesContent } from './src/storiesContent';
import { tourZones, type TourZone } from './src/poiMap';
import { cleanupUnprotectedLegacyAudio, clearPlaybackFile, deleteProtectedPack, downloadSecurePack, fetchSecureManifest, playbackUri, securePackStatus, savedHost, saveHost, sizeMB, unlockDemo, type SecurePackStatus } from './src/securePacks';

const navy='#102E46', cream='#F6F3EC', gold='#CA9D4C', ink='#243545', muted='#667987', border='#DDE4E5', green='#24745C';
const region={latitude:42.42425,longitude:18.7719,latitudeDelta:0.0058,longitudeDelta:0.0060};
const STORE_KEY='kotor-stories-manual-listening-v12';
const googleEmbedded = Platform.OS === 'android' || (Platform.OS === 'ios' && Constants.appOwnership !== 'expo' && Constants.expoConfig?.extra?.googleMapsIosReady === true);
type Saved = {language:Language; listened:number[]};
const configureBackgroundAudio = () => setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'doNotMix',
});
const fmt=(seconds:number)=>{const n=Number.isFinite(seconds)?Math.max(0,Math.floor(seconds)):0;return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;};

function Action({title,onPress,outline=false,disabled=false}:{title:string;onPress:()=>void;outline?:boolean;disabled?:boolean}){
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[s.action,outline&&s.outline,disabled&&{opacity:.45}]}>
    <Text style={[s.actionText,outline&&{color:navy}]}>{title}</Text>
  </Pressable>;
}
function Tour(){
  const [language,setLanguage]=useState<Language>('en');
  const [ready,setReady]=useState(false);
  const [listened,setListened]=useState<number[]>([]);
  const [selectedZone,setSelectedZone]=useState<string|null>(null);
  const [selectedChapter,setSelectedChapter]=useState<number|null>(null);
  const [playingChapter,setPlayingChapter]=useState<number|null>(null);
  const [packHost,setPackHost]=useState('');
  const [devCode,setDevCode]=useState('');
  const [packBusy,setPackBusy]=useState(false);
  const [packProgress,setPackProgress]=useState('');
  const [packStatus,setPackStatus]=useState<SecurePackStatus>({language:'en',installed:0,expected:29,bytes:0,chapters:[]});
  const [packAvailable,setPackAvailable]=useState<number|null>(null);
  const [playerError,setPlayerError]=useState('');
  const [speed,setSpeed]=useState<1|1.25>(1);
  const map=useRef<MapView|null>(null);
  const requestId=useRef(0);
  const player=useAudioPlayer(null,{updateInterval:300});
  const playback=useAudioPlayerStatus(player);
  const chapter=selectedChapter ? storiesContent[selectedChapter-1] : null;
  const displayTitle=(n:number)=>{const c=storiesContent[n-1];return language==='me'?c.title_me:c.title_en;};
  const displayText=(n:number)=>{const c=storiesContent[n-1];return language==='me'?c.me:c.en;};
  const selectedPin=tourZones.find(z=>z.id===selectedZone);
  const visibleChapters=selectedZone?storiesContent.filter(c=>c.zone===selectedZone):storiesContent;
  const currentZone=selectedPin||tourZones[0];

  useEffect(()=>{
    void configureBackgroundAudio().catch(err=>setPlayerError(`Audio session initialization failed: ${String(err)}`));
    void savedHost().then(setPackHost).catch(()=>{});
    void cleanupUnprotectedLegacyAudio().catch(()=>{});
    void Storage.getItem(STORE_KEY).then(raw=>{
      if(!raw)return;
      const parsed=JSON.parse(raw) as Saved;
      if(languages.some(l=>l.id===parsed.language))setLanguage(parsed.language);
      if(Array.isArray(parsed.listened))setListened(parsed.listened.filter(n=>Number.isInteger(n)&&n>=1&&n<=29));
    }).catch(()=>{}).finally(()=>setReady(true));
    return ()=>{requestId.current++;player.pause();void clearPlaybackFile();};
  },[]);
  useEffect(()=>{if(ready)void Storage.setItem(STORE_KEY,JSON.stringify({language,listened})).catch(()=>{});},[ready,language,listened]);
  useEffect(()=>{void securePackStatus(language).then(setPackStatus).catch(()=>{});setPackAvailable(null);},[language]);
  useEffect(()=>{if(playback.didJustFinish){try{player.setActiveForLockScreen(false);}catch{};void clearPlaybackFile();}},[playback.didJustFinish]);

  const refreshPack=async()=>setPackStatus(await securePackStatus(language));
  const unlockAccess=async()=>{
    if(packBusy)return;setPackBusy(true);setPackProgress('Contacting local development server…');
    try{const host=await unlockDemo(packHost,devCode);setPackHost(host);setDevCode('');setPackProgress('Development access granted. This is not a purchase.');}
    catch(err){setPackProgress(String(err));}finally{setPackBusy(false);}
  };
  const checkPack=async()=>{
    if(packBusy)return;
    try{const m=await fetchSecureManifest(packHost,language);setPackAvailable(m.entries.length);setPackProgress(`Available: ${m.entries.length} encrypted chapters (${m.kind}).`);}
    catch(err){setPackAvailable(null);setPackProgress(String(err));}
  };
  const download=async()=>{
    if(packBusy)return;setPackBusy(true);setPackProgress('Checking server…');
    try{const host=await saveHost(packHost);setPackHost(host);const p=await downloadSecurePack(host,language,e=>setPackProgress(`Downloading ${e.done}/${e.total} · chapter ${e.chapter}`));setPackStatus(p);setPackProgress(`${p.installed}/29 encrypted audio chapters saved (${sizeMB(p.bytes)}).`);}
    catch(err){setPackProgress(`Download error: ${String(err)}`);}finally{setPackBusy(false);}
  };
  const deletePack=()=>Alert.alert('Remove offline audio',`Delete the encrypted ${language.toUpperCase()} package and its local key?`,[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:()=>{requestId.current++;player.pause();setPlayingChapter(null);void deleteProtectedPack(language).then(refreshPack).then(()=>setPackProgress('Encrypted audio deleted.')).catch(e=>setPackProgress(String(e)));}},
  ]);
  const playChapter=async(number:number)=>{
    const id=++requestId.current;setSelectedChapter(number);setPlayerError('');
    try{
      player.pause();await configureBackgroundAudio();await clearPlaybackFile();
      const uri=await playbackUri(language,number);
      if(id!==requestId.current){await clearPlaybackFile();return;}
      if(!uri){setPlayingChapter(null);Alert.alert('Audio not downloaded',`Chapter ${number} is not available offline in ${language.toUpperCase()}. Download its encrypted language pack first.`);return;}
      player.replace({uri});player.setPlaybackRate(speed);
      try{player.setActiveForLockScreen(true,{title:displayTitle(number),artist:'Kotor Stories',albumTitle:'Old Town Kotor'},
        {showSeekBackward:true,showSeekForward:true});}catch{setPlayerError('Lock-screen controls need a native development build.');}
      player.play();setPlayingChapter(number);setListened(old=>old.includes(number)?old:[...old,number]);
    }catch(err){setPlayerError(String(err));}
  };
  const selectZone=(zone:TourZone)=>{
    setSelectedZone(zone.id);
    map.current?.animateToRegion({latitude:zone.latitude,longitude:zone.longitude,latitudeDelta:.0018,longitudeDelta:.0022},350);
  };
  const openInGoogleMaps=()=>{
    const q=`${currentZone.latitude},${currentZone.longitude}`;
    void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`).catch(err=>setPlayerError(String(err)));
  };
  const seek=(delta:number)=>{
    if(!playback.isLoaded)return;
    const position=Math.max(0,Math.min(playback.duration||Number.MAX_SAFE_INTEGER,playback.currentTime+delta));
    void player.seekTo(position).catch(err=>setPlayerError(String(err)));
  };
  const updateSpeed=()=>{const next=speed===1?1.25:1;setSpeed(next);player.setPlaybackRate(next);};
  const resume=async()=>{
    if(playingChapter===null)return;
    if(playback.didJustFinish || (playback.duration>0 && playback.currentTime>=playback.duration-0.2)){await playChapter(playingChapter);return;}
    try{
      await configureBackgroundAudio();
      player.setActiveForLockScreen(true,{title:displayTitle(playingChapter),artist:'Kotor Stories',albumTitle:'Old Town Kotor'});
      player.play();
    }catch(err){setPlayerError(`Cannot resume playback: ${String(err)}`);}
  };

  return <SafeAreaView style={s.safe} edges={['top','bottom']}>
    <StatusBar style="light" backgroundColor={navy}/>
    <ScrollView contentContainerStyle={{paddingBottom:45}} keyboardShouldPersistTaps="handled">
      <View style={s.hero}>
        <Text style={s.brand}>KOTOR <Text style={{color:gold}}>STORIES</Text></Text>
        <Text style={s.kicker}>MANUAL MAP TOUR · PROTECTED AUDIO · DEV 1.2.1 EAS</Text>
        <Text style={s.headline}>Discover Old Kotor</Text>
        <Text style={s.heroSubtitle}>29 stories · approx. 60-minute walking tour</Text>
        <Text style={s.heroSubtitle}>Choose a place on the map, then start its story yourself.</Text>
      </View>
      <View style={s.main}>
        <Text style={s.section}>LISTENING LANGUAGE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:18}}>
          {languages.map(l=><Pressable key={l.id} onPress={()=>{requestId.current++;player.pause();try{player.setActiveForLockScreen(false);}catch{}void clearPlaybackFile();setPlayingChapter(null);setSelectedChapter(null);setLanguage(l.id);}} style={[s.lang,language===l.id&&s.langOn]}>
            <Text style={[s.langText,language===l.id&&{color:'white'}]}>{l.label}</Text>
          </Pressable>)}
        </ScrollView>
        {language!=='en'&&language!=='me'&&<Text style={s.hint}>Original texts are currently available in English and Montenegrin. Additional translations and narration are pending.</Text>}
        <View style={s.mapHeader}>
          <Text style={s.section}>EXPLORE THE OLD TOWN</Text>
          <Text style={s.small}>{tourZones.length} mapped areas · 29 stories</Text>
        </View>
        <View style={s.mapWrap}>
          <MapView ref={map} style={s.map} initialRegion={region} provider={googleEmbedded?PROVIDER_GOOGLE:undefined} showsCompass showsPointsOfInterest>
            {tourZones.map((z,i)=><Marker key={z.id} coordinate={{latitude:z.latitude,longitude:z.longitude}} title={z.label} description={`${storiesContent.filter(c=>c.zone===z.id).length} stories · Tap to browse`}
              onPress={()=>selectZone(z)}>
              <View style={[s.pin,selectedZone===z.id&&s.pinActive]}><Text style={s.pinText}>{i+1}</Text></View>
            </Marker>)}
          </MapView>
          <Pressable onPress={()=>map.current?.animateToRegion(region,350)} style={s.centerButton}><Text style={s.centerLabel}>⌖</Text></Pressable>
        </View>
        <Text style={s.hint}>{googleEmbedded?'Google Maps map provider available.':'On iPhone Expo Go the embedded map uses Apple Maps. Google Maps inside iOS requires an API key and a native build.'} All locations are visible; no automatic GPS playback. Some area markers still need on-site verification.</Text>
        <View style={s.row}>
          <View style={{flex:1}}><Action title="OPEN IN GOOGLE MAPS" outline onPress={openInGoogleMaps}/></View>
          <View style={{flex:1}}><Action title="SHOW ALL 29" onPress={()=>{setSelectedZone(null);map.current?.animateToRegion(region,300);}}/></View>
        </View>
        {selectedZone!==null && <View style={s.selectedArea}>
          <Text style={s.selectedTitle}>{selectedPin?.label??selectedZone}</Text>
          <Text style={s.small}>Showing stories for this area. Tap a chapter below to listen.</Text>
          {selectedPin?.accuracy==='approximate-area'&&<Text style={s.hint}>Approximate area point — verify its exact position before publishing.</Text>}
        </View>}

        <View style={s.player}>
          <Text style={s.section}>AUDIO PLAYER</Text>
          {chapter ? <>
            <Text style={s.playerTitle}>{String(chapter.number).padStart(2,'0')}. {displayTitle(chapter.number)}</Text>
            <Text style={s.body}>{displayText(chapter.number)}</Text>
            <Text style={s.timing}>{fmt(playback.currentTime)} / {fmt(playback.duration)}</Text>
            <View style={s.track}><View style={[s.progress,{width:`${playback.duration?Math.min(100,playback.currentTime/playback.duration*100):0}%`}]} /></View>
            <View style={s.row}>
              <View style={{flex:1}}><Action outline title="−10 sec" onPress={()=>seek(-10)}/></View>
              <View style={{flex:1}}><Action outline title="+10 sec" onPress={()=>seek(10)}/></View>
              <View style={{flex:1}}><Action outline title={`${speed}×`} onPress={updateSpeed}/></View>
            </View>
            <View style={s.row}>
              <View style={{flex:1}}><Action outline title="PLAY AGAIN" onPress={()=>void playChapter(chapter.number)}/></View>
              <View style={{flex:1}}><Action title={playback.playing?'PAUSE':'PLAY / RESUME'} onPress={()=>{if(playback.playing){player.pause();}else{void resume();}}}/></View>
            </View>
            {chapter.number<29&&<Action title={`NEXT STORY ${String(chapter.number+1).padStart(2,'0')} ▶`} outline onPress={()=>void playChapter(chapter.number+1)}/>}
          </> : <Text style={s.hint}>Tap a chapter above to see its full text and listen. Nothing starts automatically when you walk.</Text>}
          {!!playerError&&<Text style={s.error}>{playerError}</Text>}
        </View>

        <View style={s.mapHeader}>
          <Text style={s.section}>{selectedZone?'STORIES IN THIS AREA':'ALL 29 STORIES'}</Text>
          <Text style={s.small}>Listened: {listened.length}/29</Text>
        </View>
        {visibleChapters.map(c=><Pressable key={c.number} accessibilityRole="button" onPress={()=>void playChapter(c.number)} style={[s.story,selectedChapter===c.number&&s.storyActive]}>
          <View style={[s.number,listened.includes(c.number)&&{backgroundColor:green}]}><Text style={s.numberText}>{listened.includes(c.number)?'✓':String(c.number).padStart(2,'0')}</Text></View>
          <View style={{flex:1}}>
            <Text style={s.storyTitle}>{displayTitle(c.number)}</Text>
            <Text style={s.small}>{c.zone} · {packStatus.language===language&&packStatus.chapters.includes(c.number)?'Offline audio ready':'Audio not downloaded'}</Text>
          </View>
          <Text style={s.playIcon}>▶</Text>
        </Pressable>)}

        <View style={s.packCard}>
          <Text style={s.section}>OFFLINE AUDIO PACKS · DEV</Text>
          <Text style={s.packTitle}>{packStatus.installed}/29 encrypted chapters · {language.toUpperCase()}</Text>
          <Text style={s.hint}>{sizeMB(packStatus.bytes)} stored. This test server uses a local PIN, not actual purchases.</Text>
          <TextInput autoCapitalize="none" autoCorrect={false} placeholder="http://192.168.x.x:8787" value={packHost} onChangeText={setPackHost} style={s.input}/>
          <TextInput autoCapitalize="none" autoCorrect={false} secureTextEntry placeholder="Development PIN" value={devCode} onChangeText={setDevCode} style={s.input}/>
          <Action title="DEV UNLOCK (TEST ONLY)" outline disabled={packBusy} onPress={()=>void unlockAccess()}/>
          <View style={s.row}>
            <View style={{flex:1}}><Action title="CHECK PACK" outline disabled={packBusy} onPress={()=>void checkPack()}/></View>
            <View style={{flex:1}}><Action title={packBusy?'DOWNLOADING…':'DOWNLOAD'} disabled={packBusy} onPress={()=>void download()}/></View>
          </View>
          <Action title="DELETE ENCRYPTED LANGUAGE" outline disabled={packBusy||packStatus.installed===0} onPress={deletePack}/>
          {packAvailable!==null&&<Text style={s.small}>{packAvailable} chapters available from this server.</Text>}
          {!!packProgress&&<Text style={s.feedback}>{packProgress}</Text>}
        </View>
        <Text style={s.footer}>Kotor Stories · manual map navigation · encrypted offline audio. Map imagery requires internet. Lock-screen audio is enabled for an EAS development build; confirm it on your iPhone. Public release also requires purchase verification, licensing and final map review.</Text>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
export default function App(){return <SafeAreaProvider><Tour/></SafeAreaProvider>;}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:cream},hero:{padding:23,backgroundColor:navy},brand:{fontSize:14,fontWeight:'900',letterSpacing:2,color:'white'},kicker:{color:'#B1C6D2',fontSize:10,letterSpacing:1.4,marginTop:8},headline:{fontSize:30,fontWeight:'900',color:'white',marginTop:17},heroSubtitle:{color:'#D7E3EA',fontSize:13,lineHeight:20,marginTop:7},main:{padding:16},section:{color:navy,fontSize:12,letterSpacing:1.1,fontWeight:'900',marginBottom:12},lang:{padding:11,borderWidth:1,borderColor:border,borderRadius:11,marginRight:8,backgroundColor:'white'},langOn:{backgroundColor:navy},langText:{fontSize:12,fontWeight:'700',color:navy},hint:{fontSize:12,color:muted,lineHeight:19,marginTop:9,marginBottom:10},mapHeader:{marginTop:17,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:6},small:{fontSize:11,color:muted,lineHeight:16},mapWrap:{height:330,borderRadius:17,overflow:'hidden',backgroundColor:'#DEE6E9'},map:{flex:1},pin:{borderRadius:20,minWidth:32,height:32,paddingHorizontal:5,alignItems:'center',justifyContent:'center',backgroundColor:navy,borderWidth:2,borderColor:'white'},pinActive:{backgroundColor:gold},pinText:{fontSize:12,fontWeight:'900',color:'white'},centerButton:{position:'absolute',right:12,top:12,borderRadius:10,backgroundColor:'white',width:40,height:40,justifyContent:'center',alignItems:'center'},centerLabel:{fontSize:24,fontWeight:'900',color:navy},row:{flexDirection:'row',gap:8,marginTop:10},action:{backgroundColor:navy,borderRadius:10,minHeight:44,paddingVertical:12,paddingHorizontal:9,justifyContent:'center',alignItems:'center'},outline:{backgroundColor:'white',borderWidth:1,borderColor:'#B9C8D0'},actionText:{color:'white',fontSize:11,fontWeight:'900',textAlign:'center'},selectedArea:{backgroundColor:'#F5E8CA',borderRadius:13,padding:12,marginTop:11},selectedTitle:{color:navy,fontWeight:'900',fontSize:16,marginBottom:3},story:{borderRadius:13,borderWidth:1,borderColor:border,backgroundColor:'white',marginTop:8,padding:12,flexDirection:'row',alignItems:'center',gap:11},storyActive:{borderColor:gold,borderWidth:2},number:{backgroundColor:navy,width:37,height:37,borderRadius:10,alignItems:'center',justifyContent:'center'},numberText:{color:'white',fontSize:12,fontWeight:'900'},storyTitle:{fontWeight:'800',fontSize:14,color:navy,marginBottom:4},playIcon:{fontSize:16,color:gold},player:{marginTop:21,borderRadius:14,padding:15,borderWidth:1,borderColor:border,backgroundColor:'white',gap:5},playerTitle:{color:navy,fontSize:20,fontWeight:'900',marginTop:4},body:{fontSize:14,lineHeight:22,color:ink,marginTop:9},timing:{marginTop:10,textAlign:'right',fontSize:11,color:muted},track:{height:6,borderRadius:6,backgroundColor:'#E4EAED',overflow:'hidden'},progress:{height:6,backgroundColor:gold},error:{fontSize:12,color:'#A73831'},packCard:{marginTop:22,padding:14,borderRadius:14,backgroundColor:'white',borderColor:border,borderWidth:1,gap:8},packTitle:{fontSize:17,fontWeight:'800',color:navy},input:{borderRadius:9,backgroundColor:cream,borderWidth:1,borderColor:border,padding:12,fontSize:13,color:ink},feedback:{backgroundColor:'#E5F1F1',padding:10,color:navy,fontSize:12,borderRadius:8},footer:{marginTop:20,color:muted,fontSize:11,lineHeight:19},
});
