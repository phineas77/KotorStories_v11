import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { distanceMeters } from './src/geo';
import { emptyTriggerState, evaluateTrigger, Fix, TriggerState } from './src/gpsEngine';
import { loadProgress, saveProgress } from './src/progress';
import { languages, Language, stops } from './src/stops';
import { chaptersPlan } from './src/plan';
import { storiesContent } from './src/storiesContent';
import { englishNarrationStops } from './src/productionAudio';
import { englishChapterAudio } from './src/chapterAudio';
import { cleanupUnprotectedLegacyAudio, clearPlaybackFile, deleteProtectedPack, downloadSecurePack, fetchSecureManifest, playbackUri, securePackStatus, savedHost, saveHost, sizeMB, unlockDemo, type SecurePackStatus } from './src/securePacks';

/** v0.3: real and simulated progress never mix. Demo does NOT spoof the phone GPS. */
type Mode = 'demo' | 'live';
const C = {
  navy: '#0A2342', dark: '#153658', gold: '#D6A54E', goldLight: '#F2E1C0',
  cream: '#F7F4ED', white: '#FFFFFF', ink: '#182A3A', muted: '#66798A',
  border: '#DFE5E7', green: '#218068', lightBlue: '#E7F2F6', red: '#A83A36',
};
const overview = { latitude: 42.42472, longitude: 18.77202, latitudeDelta: 0.0032, longitudeDelta: 0.0043 };
const LABEL: Record<Language, {
  hero: string; intro: string; mode: string; demo: string; live: string; demoInfo: string;
  liveInfo: string; language: string; gpsStart: string; gpsStop: string;
  simulate: string; reset: string; next: string; player: string; none: string;
  listen: string; pause: string; resume: string; completed: string; preview: string;
  about: string; prepared: string; route: string; planned: string; mapHint: string;
  accuracy: string; location: string; testTitle: string; privacy: string;
  requiresCity: string; wrongGps: string; previewNote: string; audioNote: string;
}> = {
 en: {
  hero:'Discover Old Kotor', intro:'An audio walk through centuries of stories', mode:'TOUR MODE', demo:'DEMO AT HOME', live:'REAL GPS WALK',
  demoInfo:'Simulated arrival at each stop. You can test the full route from anywhere.', liveInfo:'Stories start at the next stop when your phone detects two reliable GPS fixes.',
  language:'AUDIO LANGUAGE', gpsStart:'START GPS TOUR', gpsStop:'STOP GPS TOUR', simulate:'SIMULATE ARRIVAL AT NEXT STOP', reset:'Reset progress', next:'NEXT STOP',
  player:'AUDIO PLAYER', none:'Choose a story below or simulate your arrival at the first stop.', listen:'Play again', pause:'Pause', resume:'Resume',
  completed:'Stops reached', preview:'PREVIEW ONLY', about:'ABOUT THIS PROTOTYPE', prepared:'29 EN/ME scripts • voice batch preview', route:'ROUTE & STORIES', planned:'View all 29 planned chapters',
  mapHint:'Approximate GPS pins; verify in the Old Town before launch.', accuracy:'GPS accuracy', location:'Location', testTitle:'TEST MODE – simulated positions',
  privacy:'Your GPS is processed on the phone, not uploaded.', requiresCity:'Live GPS will be tested in Kotor. Keep the app open for now.',
  wrongGps:'Test weak GPS', previewNote:'Manual listening does not mark a stop as reached.', audioNote:'Only licensed packs play offline. Encrypted packs play offline after activation and download. Map tiles still require internet.',
 },
 de: {
  hero:'Entdecke Alt-Kotor', intro:'Ein Hörspaziergang durch Jahrhunderte', mode:'TOUR-MODUS', demo:'DEMO ZU HAUSE', live:'ECHTE GPS-TOUR',
  demoInfo:'Simuliere jede Station von überall aus.', liveInfo:'Eine Geschichte startet nach zwei zuverlässigen GPS-Messungen.',
  language:'AUDIOSPRACHE', gpsStart:'GPS-TOUR STARTEN', gpsStop:'GPS-TOUR STOPPEN', simulate:'NÄCHSTE STATION SIMULIEREN', reset:'Fortschritt löschen', next:'NÄCHSTE STATION',
  player:'AUDIOPLAYER', none:'Wähle eine Geschichte oder simuliere die erste Station.', listen:'Noch einmal', pause:'Pause', resume:'Weiter',
  completed:'Erreichte Stationen', preview:'NUR VORSCHAU', about:'ÜBER DEN PROTOTYP', prepared:'29 EN/ME-Texte • 5 Demo-Aufnahmen', route:'ROUTE UND GESCHICHTEN', planned:'Alle 29 geplanten Kapitel',
  mapHint:'GPS-Punkte sind ungeprüft. Vor Ort testen.', accuracy:'GPS-Genauigkeit', location:'Standort', testTitle:'TESTMODUS – simulierte Positionen',
  privacy:'GPS-Daten bleiben auf deinem Telefon.', requiresCity:'GPS muss in Kotor getestet werden. App offen lassen.',
  wrongGps:'Schwaches GPS testen', previewNote:'Manuelles Anhören zählt nicht als Besuch.', audioNote:'Audio offline. Die Karte benötigt derzeit Internet.',
 },
 it: {
  hero:'Scopri Cattaro antica', intro:'Una passeggiata sonora attraverso i secoli', mode:'MODALITÀ TOUR', demo:'DEMO DA CASA', live:'GPS REALE',
  demoInfo:'Simula l’arrivo a ogni tappa ovunque ti trovi.', liveInfo:'Il racconto parte dopo due letture GPS affidabili.',
  language:'LINGUA AUDIO', gpsStart:'AVVIA TOUR GPS', gpsStop:'FERMA TOUR GPS', simulate:'SIMULA PROSSIMA TAPPA', reset:'Azzera progressi', next:'PROSSIMA TAPPA',
  player:'LETTORE AUDIO', none:'Scegli un racconto o simula la prima tappa.', listen:'Riascolta', pause:'Pausa', resume:'Riprendi',
  completed:'Tappe raggiunte', preview:'SOLO ANTEPRIMA', about:'INFORMAZIONI SUL PROTOTIPO', prepared:'29 testi EN/ME • 5 audio demo', route:'ITINERARIO E RACCONTI', planned:'Mostra i 29 capitoli previsti',
  mapHint:'Punti GPS approssimativi, da verificare sul posto.', accuracy:'Precisione GPS', location:'Posizione', testTitle:'MODALITÀ TEST – posizioni simulate',
  privacy:'La posizione resta sul telefono.', requiresCity:'Test GPS reale da fare a Cattaro. Tieni aperta l’app.',
  wrongGps:'Simula GPS debole', previewNote:'L’ascolto manuale non segna la tappa come visitata.', audioNote:'Audio offline; la mappa richiede internet.',
 },
 fr: {
  hero:'Découvrez le vieux Kotor', intro:'Une balade sonore à travers les siècles', mode:'MODE DE VISITE', demo:'DÉMO À DISTANCE', live:'VRAIE VISITE GPS',
  demoInfo:'Simulez chaque arrêt depuis n’importe où.', liveInfo:'Le récit démarre après deux mesures GPS fiables.',
  language:'LANGUE AUDIO', gpsStart:'DÉMARRER LA VISITE GPS', gpsStop:'ARRÊTER LE GPS', simulate:'SIMULER LE PROCHAIN ARRÊT', reset:'Effacer la progression', next:'PROCHAIN ARRÊT',
  player:'LECTEUR AUDIO', none:'Choisissez un récit ou simulez le premier arrêt.', listen:'Réécouter', pause:'Pause', resume:'Reprendre',
  completed:'Arrêts atteints', preview:'APERÇU SEULEMENT', about:'À PROPOS DU PROTOTYPE', prepared:'29 textes EN/ME • 5 audios démo', route:'PARCOURS ET RÉCITS', planned:'Voir les 29 chapitres prévus',
  mapHint:'Emplacements GPS approximatifs, à vérifier sur place.', accuracy:'Précision GPS', location:'Position', testTitle:'MODE TEST – positions simulées',
  privacy:'La position reste sur votre téléphone.', requiresCity:'Le vrai GPS doit être testé à Kotor. Gardez l’application ouverte.',
  wrongGps:'Tester un GPS imprécis', previewNote:'Écouter manuellement ne valide pas un arrêt.', audioNote:'Audio hors ligne ; carte connectée.',
 },
 es: {
  hero:'Descubre el viejo Kotor', intro:'Un paseo sonoro por siglos de historia', mode:'MODO DE TOUR', demo:'DEMO EN CASA', live:'PASEO GPS REAL',
  demoInfo:'Simula cada parada desde cualquier lugar.', liveInfo:'La historia comienza tras dos lecturas GPS fiables.',
  language:'IDIOMA DEL AUDIO', gpsStart:'INICIAR TOUR GPS', gpsStop:'DETENER TOUR GPS', simulate:'SIMULAR PRÓXIMA PARADA', reset:'Borrar progreso', next:'PRÓXIMA PARADA',
  player:'REPRODUCTOR', none:'Elige una historia o simula la primera parada.', listen:'Repetir', pause:'Pausa', resume:'Continuar',
  completed:'Paradas alcanzadas', preview:'SOLO VISTA PREVIA', about:'ACERCA DEL PROTOTIPO', prepared:'29 textos EN/ME • 5 audios de prueba', route:'RUTA E HISTORIAS', planned:'Ver los 29 capítulos previstos',
  mapHint:'Puntos GPS aproximados; verificar en la ciudad.', accuracy:'Precisión GPS', location:'Ubicación', testTitle:'MODO PRUEBA – posiciones simuladas',
  privacy:'Tu GPS permanece en el teléfono.', requiresCity:'El GPS real se probará en Kotor. Mantén la app abierta.',
  wrongGps:'Probar GPS débil', previewNote:'Escuchar manualmente no marca una visita.', audioNote:'Audio sin conexión; el mapa necesita internet.',
 },
 me: {
  hero:'Otkrij Stari Kotor', intro:'Audio-šetnja kroz vjekove istorije', mode:'NAČIN OBILASKA', demo:'PROBA OD KUĆE', live:'PRAVA GPS ŠETNJA',
  demoInfo:'Simuliraj dolazak na svaku stanicu, bez odlaska u Kotor.', liveInfo:'Priča počinje nakon dva pouzdana GPS očitavanja.',
  language:'JEZIK NARACIJE', gpsStart:'POKRENI GPS TURU', gpsStop:'ZAUSTAVI GPS TURU', simulate:'SIMULIRAJ NAREDNU STANICU', reset:'Obriši napredak', next:'SLJEDEĆA STANICA',
  player:'AUDIO-PLEJER', none:'Odaberi priču ili simuliraj dolazak na prvu stanicu.', listen:'Ponovi', pause:'Pauza', resume:'Nastavi',
  completed:'Obiđene stanice', preview:'SAMO PREGLED', about:'O OVOM PROTOTIPU', prepared:'29 EN/ME tekstova • 5 probnih snimaka', route:'RUTA I PRIČE', planned:'Prikaži svih 29 planiranih poglavlja',
  mapHint:'GPS tačke su približne i treba ih provjeriti na terenu.', accuracy:'GPS tačnost', location:'Lokacija', testTitle:'PROBNI REŽIM – simulirane lokacije',
  privacy:'Tvoja GPS lokacija se obrađuje na telefonu.', requiresCity:'Pravi GPS ćemo testirati u Kotoru. Aplikacija zasad mora ostati otvorena.',
  wrongGps:'Testiraj loš GPS', previewNote:'Ručno slušanje ne označava stanicu kao obiđenu.', audioNote:'Audio radi offline, mapa zasad zahtijeva internet.',
 },
};

const fmt = (v: number) => {
  const n = Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
};

function Button({ label, onPress, secondary, disabled }:{label:string;onPress:()=>void;secondary?:boolean;disabled?:boolean}) {
 return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
  style={({ pressed }) => [styles.button,secondary && styles.buttonOutline, disabled && {opacity:.5},pressed && {opacity:.8}]}>
  <Text style={[styles.buttonText,secondary && {color:C.navy}]}>{label}</Text>
 </Pressable>;
}

function TourScreen() {
 const [language,setLanguage] = useState<Language>('en');
 const [mode,setMode] = useState<Mode>('demo');
 const [liveOn,setLiveOn] = useState(false);
 const [gps,setGps] = useState<Fix | null>(null);
 const [simulatedGps,setSimulatedGps] = useState<Fix | null>(null);
 const [liveCompleted,setLiveCompleted] = useState<string[]>([]);
 const [demoCompleted,setDemoCompleted] = useState<string[]>([]);
 const [heard,setHeard] = useState<string[]>([]);
 const [ready,setReady] = useState(false);
 const [active,setActive] = useState<number | null>(null);
 const [lastKind,setLastKind] = useState<'arrival'|'preview'|null>(null);
 const [diagnostic,setDiagnostic] = useState('');
 const [showPlan,setShowPlan] = useState(false);
 const [openTextChapter, setOpenTextChapter] = useState<number | null>(null);
 const [playingChapter, setPlayingChapter] = useState<number | null>(null);
 const [playbackSpeed,setPlaybackSpeed] = useState<1|1.25>(1);
 const playbackSpeedRef=useRef<1|1.25>(1);
 const [lockNotice,setLockNotice] = useState('');
 const [packHost,setPackHost] = useState('');
 const [devCode,setDevCode] = useState('');
 const [packBusy,setPackBusy] = useState(false);
 const [packProgress,setPackProgress] = useState('');
 const [packStatus,setPackStatus] = useState<SecurePackStatus>({language:'en',installed:0,expected:29,bytes:0,chapters:[]});
 const [packAvailable,setPackAvailable] = useState<number|null>(null);
 const playCounter=useRef(0);
 const watcher = useRef<Location.LocationSubscription | null>(null);
 const runningRef = useRef(false);
 const modeRef = useRef<Mode>('demo');
 const liveRef = useRef<string[]>([]);
 const demoRef = useRef<string[]>([]);
 const heardRef = useRef<string[]>([]);
 const languageRef = useRef<Language>('en');
 const engineRef = useRef<TriggerState>(emptyTriggerState());
 const occupiedRef = useRef(false);
 const map = useRef<MapView | null>(null);
 const player = useAudioPlayer(null, {updateInterval:300});
 const playback = useAudioPlayerStatus(player);
 const t = LABEL[language];
 const completed = mode === 'demo' ? demoCompleted : liveCompleted;
 const nextIndex = stops.findIndex(s => !completed.includes(s.id));
 const currentFix = mode === 'demo' ? simulatedGps : gps;
 const professionallyAvailable = Object.keys(englishChapterAudio).length;
 const stopToChapter:Record<string,number>={'sea-gate':1,'clock-tower':5,'st-tryphon':9,'maritime-museum':12,'st-luke':16};
 const narrativeText = (stopId: string, lang: Language): string => {
  // Production MP3s for these five GPS demo stops use chapters 1, 5 and 9.
  const mapped: Record<string,number> = {'sea-gate':1, 'clock-tower':5, 'st-tryphon':9};
  const chapterNumber = mapped[stopId];
  if (lang === 'en' && englishNarrationStops.includes(stopId) && chapterNumber) {
   return storiesContent[chapterNumber-1].en;
  }
  return stops.find(x=>x.id===stopId)?.text[lang] ?? '';
 };

 useEffect(() => {
  void setAudioModeAsync({playsInSilentMode:true, shouldPlayInBackground:true, interruptionMode:'doNotMix'}).catch(()=>{
   setLockNotice('Native background audio requires a development build.');
  });
  savedHost().then(setPackHost).catch(()=>{});
  void cleanupUnprotectedLegacyAudio().catch(()=>{});
  loadProgress(stops.map(s=>s.id)).then(state=>{
   languageRef.current=state.language; setLanguage(state.language);
   liveRef.current=state.liveCompleted; setLiveCompleted(state.liveCompleted);
   demoRef.current=state.demoCompleted; setDemoCompleted(state.demoCompleted);
   heardRef.current=state.heard; setHeard(state.heard);
   // Listening history is separate from physically reaching a stop.
   setReady(true);
  }).catch(()=>setReady(true));
  return () => { runningRef.current=false; watcher.current?.remove(); };
 }, []);
 useEffect(()=>{
  if (!ready) return;
  void saveProgress({language,liveCompleted,demoCompleted,heard}).catch(()=>setDiagnostic('Could not save progress locally.'));
 },[language,liveCompleted,demoCompleted,heard,ready]);
 useEffect(()=>{ if (playback.didJustFinish){occupiedRef.current=false;void clearPlaybackFile();} },[playback.didJustFinish]);
 useEffect(()=>{void securePackStatus(language).then(setPackStatus).catch(()=>{});setPackAvailable(null);},[language]);
 const refreshPack=async()=>{ const state=await securePackStatus(languageRef.current);setPackStatus(state);};
 const unlockAccess=async()=>{
   if(packBusy)return;setPackBusy(true);setPackProgress('Activating local development access…');
   try{const host=await unlockDemo(packHost,devCode);setPackHost(host);setDevCode('');setPackProgress('DEV ACCESS granted for this iPhone. This is NOT a real purchase.');}
   catch(err){setPackProgress(String(err));}finally{setPackBusy(false)}
 };
 const checkPack=async()=>{
   try{const manifest=await fetchSecureManifest(packHost, language);setPackAvailable(manifest.entries.length);setPackProgress(`Protected server OK: ${manifest.entries.length} encrypted chapters available (${manifest.kind}).`);}
   catch(err){setPackProgress(`Cannot check protected pack: ${String(err)}`);setPackAvailable(null)}
 };
 const installPack=async()=>{
   if(packBusy)return;setPackBusy(true);setPackProgress('Checking protected server…');
   try{const host=await saveHost(packHost);setPackHost(host);
      const result=await downloadSecurePack(host,language,p=>setPackProgress(`Encrypted download ${p.done}/${p.total} · chapter ${p.chapter}`));
      setPackStatus(result);setPackProgress(`Saved ${result.installed} ENCRYPTED chapters (${sizeMB(result.bytes)}) on this iPhone.`);
   }catch(err){setPackProgress(`Download stopped: ${String(err)}. Already finished encrypted files remain available offline.`)}
   finally{setPackBusy(false)}
 };
 const removePack=()=>Alert.alert('Delete protected audio',`Delete encrypted ${language.toUpperCase()} audio files and local key from this phone?`,[
   {text:'Cancel',style:'cancel'},
   {text:'Delete files',style:'destructive',onPress:()=>{playCounter.current++;player.pause();occupiedRef.current=false;void deleteProtectedPack(language).then(refreshPack).then(()=>setPackProgress('Encrypted audio and local license key deleted.')).catch(e=>setPackProgress(String(e)));}},
 ]);

 const setCompleted = (targetMode:Mode,id:string) => {
  if (targetMode === 'demo') {
   if (!demoRef.current.includes(id)) { demoRef.current=[...demoRef.current,id]; setDemoCompleted(demoRef.current); }
  } else {
   if (!liveRef.current.includes(id)) { liveRef.current=[...liveRef.current,id]; setLiveCompleted(liveRef.current); }
  }
 };
 const playStory = async (index:number,kind:'arrival'|'preview',lang:Language=languageRef.current) => {
  const stop=stops[index];if(!stop)return;
  const callId=++playCounter.current;
  try{
   const chapter=stopToChapter[stop.id];
   player.pause();await clearPlaybackFile();
   const uri=chapter?await playbackUri(lang,chapter):null;
   if(callId!==playCounter.current){await clearPlaybackFile();return;}
   if(!uri){setActive(null);setDiagnostic(`Chapter ${chapter??'?'} is not downloaded in ${lang.toUpperCase()}. Unlock and download an encrypted pack first.`);return;}
   player.replace({uri});player.setPlaybackRate(playbackSpeedRef.current);
   try{player.setActiveForLockScreen(true,{title:stop.titles[lang],artist:'Kotor Stories',albumTitle:'Discover Old Kotor'});}catch{setLockNotice('Lock-screen controls need a development build.');}
   player.play();occupiedRef.current=true;setPlayingChapter(null);setActive(index);setLastKind(kind);
   if(!heardRef.current.includes(stop.id)){heardRef.current=[...heardRef.current,stop.id];setHeard(heardRef.current);}
   setDiagnostic('Playing a decrypted TEMPORARY copy from an encrypted offline package.');
   map.current?.animateToRegion({latitude:stop.latitude,longitude:stop.longitude,latitudeDelta:.0018,longitudeDelta:.0022},350);
  }catch(err){occupiedRef.current=false;setDiagnostic(String(err));}
 };
 const playChapter = async (number:number) => {
  const chapter=storiesContent[number-1];if(!chapter)return;
  const lang=languageRef.current;const callId=++playCounter.current;
  try{
   player.pause();await clearPlaybackFile();
   const uri=await playbackUri(lang,number);
   if(callId!==playCounter.current){await clearPlaybackFile();return;}
   if(!uri){Alert.alert('Protected audio not downloaded',`Chapter ${number} is not yet available offline in ${lang.toUpperCase()}. Unlock and download an encrypted language pack.`);return;}
   player.replace({uri});player.setPlaybackRate(playbackSpeedRef.current);
   try{player.setActiveForLockScreen(true,{title:lang==='me'?chapter.title_me:chapter.title_en,artist:'Kotor Stories',albumTitle:'Discover Old Kotor'});}catch{}
   player.play();occupiedRef.current=true;setActive(null);setLastKind('preview');setPlayingChapter(number);setOpenTextChapter(number);
   setDiagnostic(`Protected offline playback of chapter ${number}. Temporary audio will be deleted after playback.`);
  }catch(err){occupiedRef.current=false;setDiagnostic(String(err));}
 };
 const processReading = (fix:Fix,fromMode:Mode) => {
  if (fromMode==='live') { setGps(fix); if (!runningRef.current || modeRef.current!=='live') return; }
  else setSimulatedGps(fix);
  const done=fromMode==='live'?liveRef.current:demoRef.current;
  const next=stops.findIndex(s=>!done.includes(s.id));
  if (next < 0 || occupiedRef.current) return;
  const result=evaluateTrigger(engineRef.current,fix,stops[next],Date.now());
  engineRef.current=result.state;
  if (result.triggered) {
   const neededChapter=stopToChapter[stops[next].id];
   if(packStatus.language!==languageRef.current || !packStatus.chapters.includes(neededChapter)){
    setDiagnostic('This chapter is not downloaded. Unlock and install the encrypted language pack first.');
    return;
   }
   setCompleted(fromMode,stops[next].id);
   setDiagnostic(fromMode==='demo' ? 'Simulated GPS arrival ✓' : 'GPS arrival confirmed ✓');
   playStory(next,'arrival');
  } else if (result.reason==='inaccurate') setDiagnostic('GPS signal not precise enough. Awaiting a better fix.');
  else if (result.reason==='stale') setDiagnostic('GPS reading is outdated.');
  else if (result.reason==='first-fix') setDiagnostic('First location confirmed. Waiting for a second fix…');
 };
 const stopLive = () => {
  runningRef.current=false; watcher.current?.remove(); watcher.current=null;
  setLiveOn(false); engineRef.current=emptyTriggerState();
 };
 const changeMode=(next:Mode)=>{
  if (next===modeRef.current) return;
  stopLive(); player.pause(); try {player.setActiveForLockScreen(false);} catch {} occupiedRef.current=false;
  setPlayingChapter(null);
  modeRef.current=next; setMode(next); engineRef.current=emptyTriggerState();setDiagnostic('');
  map.current?.animateToRegion(overview,350);
 };
 const startLive=async()=>{
  try {
   const {status}=await Location.requestForegroundPermissionsAsync();
   if (status!=='granted') {Alert.alert('Kotor Stories','Allow precise location in iPhone Settings to start the GPS tour.');return;}
   stopLive(); modeRef.current='live';setMode('live');engineRef.current=emptyTriggerState();
   runningRef.current=true;setLiveOn(true);setDiagnostic('Waiting for GPS position…');
   // Also fetch one reading immediately to show the current position; do not count it for trigger.
   void Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High}).then(p=>{
    setGps({latitude:p.coords.latitude,longitude:p.coords.longitude,accuracyMeters:p.coords.accuracy,timestamp:p.timestamp});
   }).catch(()=>{});
   watcher.current=await Location.watchPositionAsync(
    {accuracy:Location.Accuracy.High,distanceInterval:4,timeInterval:1500},p=>{
     processReading({latitude:p.coords.latitude,longitude:p.coords.longitude,accuracyMeters:p.coords.accuracy,timestamp:p.timestamp},'live');
    },err=>setDiagnostic(err));
   // Could be stopped while awaiting subscription creation.
   if (!runningRef.current) { watcher.current?.remove(); watcher.current=null; }
  } catch(err){stopLive();setDiagnostic(String(err));}
 };
 const demoNext=()=>{
  if (modeRef.current!=='demo') changeMode('demo');
  const next=stops.findIndex(s=>!demoRef.current.includes(s.id));
  if (next<0) {setDiagnostic('Demo completed. Reset demo progress to start again.');return;}
  const nextChapter=stopToChapter[stops[next].id];
  if(packStatus.language!==languageRef.current || !packStatus.chapters.includes(nextChapter)){
    setDiagnostic('Unlock and download this language first; encrypted audio is required for a GPS visit.');
    return;
  }
  // Cancel any manually previewed audio, then feed the SAME engine two distinct GPS readings.
  player.pause();occupiedRef.current=false; engineRef.current=emptyTriggerState();
  const stop=stops[next]; const now=Date.now();
  processReading({latitude:stop.latitude,longitude:stop.longitude,accuracyMeters:7,timestamp:now-1200},'demo');
  processReading({latitude:stop.latitude,longitude:stop.longitude,accuracyMeters:7,timestamp:now},'demo');
 };
 const simulateWeak=()=>{
  if(modeRef.current!=='demo') changeMode('demo');
  const next=stops.findIndex(s=>!demoRef.current.includes(s.id));
  if (next<0) return;
  const stop=stops[next];engineRef.current=emptyTriggerState();
  processReading({latitude:stop.latitude,longitude:stop.longitude,accuracyMeters:85,timestamp:Date.now()},'demo');
  setDiagnostic('TEST OK: inaccurate GPS was ignored; chapter not completed.');
 };
 const reset=()=>Alert.alert('Kotor Stories',`Reset ${modeRef.current==='demo'?'DEMO':'REAL GPS'} tour progress?`,[
  {text:'Cancel',style:'cancel'}, {text:'Reset',style:'destructive',onPress:()=>{
   player.pause();occupiedRef.current=false;engineRef.current=emptyTriggerState();
   if (modeRef.current==='demo'){demoRef.current=[];setDemoCompleted([]);setSimulatedGps(null);}
   else {liveRef.current=[];setLiveCompleted([]);}
   setActive(null);setPlayingChapter(null);setLastKind(null);setDiagnostic('');map.current?.animateToRegion(overview,350);
  }}
 ]);
 const changeLanguage=(lang:Language)=>{
  languageRef.current=lang;setLanguage(lang);
  if(playingChapter!==null) { void playChapter(playingChapter); }
  if(active!==null) playStory(active,lastKind??'preview',lang);
 };
 const seekRelative=(delta:number)=>{
  if((active===null && playingChapter===null) || !playback.isLoaded) return;
  const duration=Number.isFinite(playback.duration)?playback.duration:0;
  const target=Math.min(duration || Number.MAX_SAFE_INTEGER,Math.max(0,playback.currentTime+delta));
  void player.seekTo(target).catch(err=>setDiagnostic(String(err)));
 };
 const togglePlaybackSpeed=()=>{
  const next:1|1.25=playbackSpeed===1?1.25:1;
  playbackSpeedRef.current=next; setPlaybackSpeed(next); player.setPlaybackRate(next);
 };
 const resumeAudio=()=>{
  if(active===null && playingChapter===null)return;
  const title = playingChapter!==null ? storiesContent[playingChapter-1].title_en : stops[active!].titles[language];
  try {player.setActiveForLockScreen(true,{title,artist:'Kotor Stories',albumTitle:'Discover Old Kotor'});} catch {}
  player.play();
 };
 const center=()=>map.current?.animateToRegion(overview,350);
 const centerNext=()=>{const idx=Math.max(0,nextIndex);const s=stops[idx]; map.current?.animateToRegion({latitude:s.latitude,longitude:s.longitude,latitudeDelta:.0015,longitudeDelta:.0019},350);};

 return <SafeAreaView style={styles.safe} edges={['top','bottom']}>
  <StatusBar style="light" backgroundColor={C.navy}/>
  <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:38}}>
   <View style={styles.hero}>
    <Text style={styles.brand}>KOTOR <Text style={{color:C.gold}}>STORIES</Text></Text>
    <Text style={styles.kicker}>GPS AUDIO WALK · PROTECTED BETA 1.1</Text>
    <Text style={styles.heading}>{t.hero}</Text>
    <Text style={styles.heroText}>{t.intro}</Text>
    <View style={styles.chips}>
     <Text style={styles.chipGold}>≈ 60 MIN · GOAL</Text>
     <Text style={styles.chip}>5 GPS TEST STOPS · 29 STORIES</Text>
     <Text style={styles.chip}>{professionallyAvailable} / 29 EN AUDIO CHAPTERS</Text>
     <Text style={styles.chip}>6 LANGUAGES</Text>
    </View>
   </View>

   <View style={styles.content}>
    <Text style={styles.label}>{t.language}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:19,marginTop:9}}>
     {languages.map(l=><Pressable key={l.id} onPress={()=>changeLanguage(l.id)} style={[styles.lang,language===l.id&&styles.langOn]}>
      <Text style={[styles.langName,language===l.id&&{color:C.white}]}>{l.icon} · {l.label}</Text>
     </Pressable>)}
    </ScrollView>

    <View style={styles.packCard}>
     <Text style={styles.label}>OFFLINE AUDIO PACKS · {language.toUpperCase()}</Text>
     <Text style={styles.packTitle}>{packStatus.installed} / 29 ENCRYPTED chapters saved</Text>
     <Text style={styles.caption}>Local encrypted size: {sizeMB(packStatus.bytes)} · Only current language is downloaded.</Text>
     <Text style={styles.caption}>DEV ONLY: local HTTP server + test PIN. Not a payment system. Production will require HTTPS and verified purchase receipts.</Text>
     <TextInput accessibilityLabel="Audio pack server URL" autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholder="http://192.168.1.X:8787" placeholderTextColor={C.muted} value={packHost} onChangeText={setPackHost} style={styles.packInput} />
     <TextInput accessibilityLabel="Development unlock code" secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="Development PIN (local server)" placeholderTextColor={C.muted} value={devCode} onChangeText={setDevCode} style={styles.packInput}/>
     <Button label="DEV UNLOCK (TEST ONLY)" secondary disabled={packBusy} onPress={()=>void unlockAccess()}/>
     <View style={styles.pair}>
      <View style={{flex:1}}><Button label="CHECK PACK" secondary disabled={packBusy} onPress={()=>void checkPack()} /></View>
      <View style={{flex:1}}><Button label={packBusy?'DOWNLOADING…':'DOWNLOAD'} disabled={packBusy} onPress={()=>void installPack()} /></View>
     </View>
     <View style={{marginTop:8}}><Button label="DELETE ENCRYPTED LANGUAGE" secondary disabled={packBusy || packStatus.installed===0} onPress={removePack}/></View>
     {packAvailable!==null && <Text style={styles.caption}>{packAvailable}/29 chapters currently available on the server. Demo access only. Not licensed for sale.</Text>}
     {!!packProgress && <Text style={styles.packFeedback}>{packProgress}</Text>}
    </View>

    <Text style={styles.label}>{t.mode}</Text>
    <View style={styles.segment}>
     <Pressable accessibilityRole="button" style={[styles.segmentItem,mode==='demo'&&styles.segmentOn]} onPress={()=>changeMode('demo')}>
      <Text style={[styles.segmentText,mode==='demo'&&styles.segmentTextOn]}>{t.demo}</Text>
     </Pressable>
     <Pressable accessibilityRole="button" style={[styles.segmentItem,mode==='live'&&styles.segmentOn]} onPress={()=>changeMode('live')}>
      <Text style={[styles.segmentText,mode==='live'&&styles.segmentTextOn]}>{t.live}</Text>
     </Pressable>
    </View>
    <View style={[styles.notice,mode==='demo'?styles.noticeGold:styles.noticeBlue]}>
     <Text style={styles.noticeHeading}>{mode==='demo'?t.testTitle:t.live}</Text>
     <Text style={styles.noticeText}>{mode==='demo'?t.demoInfo:t.liveInfo}</Text>
    </View>

    <View style={styles.mapWrap}>
     <MapView ref={map} style={styles.map} initialRegion={overview} showsUserLocation={mode==='live'&&liveOn} showsCompass>
      {stops.map((s,i)=><React.Fragment key={s.id}>
       <Circle center={{latitude:s.latitude,longitude:s.longitude}} radius={s.radiusMeters} strokeColor="rgba(20,112,119,.3)" fillColor="rgba(40,150,130,.065)" />
       <Marker coordinate={{latitude:s.latitude,longitude:s.longitude}} title={`${i+1}. ${s.titles[language]}`} onPress={()=>playStory(i,'preview')}>
        <View style={[styles.mapPin,completed.includes(s.id)&&styles.mapPinDone,active===i&&{borderColor:C.gold,borderWidth:3}]}>
         <Text style={styles.mapPinText}>{completed.includes(s.id)?'✓':i+1}</Text>
        </View>
       </Marker>
      </React.Fragment>)}
      {mode==='demo'&&simulatedGps&&<Marker coordinate={{latitude:simulatedGps.latitude,longitude:simulatedGps.longitude}} title="SIMULATED GPS" pinColor="#2679D8" />}
     </MapView>
     <View style={styles.mapBadge}>
      <Text style={styles.mapBadgeTitle}>{mode==='demo'?'SIMULATION':liveOn?'GPS ACTIVE':'GPS READY'}</Text>
      <Text style={styles.mapBadgeSub}>{currentFix ? `${t.accuracy}: ±${Math.round(currentFix.accuracyMeters??0)}m` : `${t.location}: —`}</Text>
     </View>
     <View style={styles.mapControls}>
      <Pressable accessibilityLabel="Center Old Town" onPress={center} style={styles.mapMini}><Text style={styles.mapMiniText}>⌖</Text></Pressable>
      <Pressable accessibilityLabel="Center next stop" onPress={centerNext} style={styles.mapMini}><Text style={styles.mapMiniText}>➜</Text></Pressable>
     </View>
    </View>
    <Text style={styles.caption}>{t.mapHint}</Text>
    {!!diagnostic&&<Text style={styles.diagnostic}>{diagnostic}</Text>}

    <View style={styles.progressCard}>
     <View style={styles.progressHeader}><Text style={styles.label}>{t.completed}</Text><Text style={styles.progressCount}>{completed.length} / 5</Text></View>
     <View style={styles.track}><View style={[styles.progressFilled,{width:`${completed.length*20}%`}]} /></View>
     <Text style={styles.caption}>{mode==='demo'?'Demo progress is separate from real GPS progress.':t.previewNote}</Text>
    </View>

    {mode==='demo'?<View style={styles.tools}>
     <Button label={t.simulate} disabled={nextIndex<0} onPress={demoNext}/>
     <Button label={t.wrongGps} secondary disabled={nextIndex<0} onPress={simulateWeak}/>
    </View>:<View style={styles.tools}>
     <Button label={liveOn?t.gpsStop:t.gpsStart} onPress={()=>liveOn?stopLive():void startLive()}/>
     <Text style={styles.caption}>{t.requiresCity}</Text>
    </View>}

    <View style={styles.player}>
     <View style={styles.rowBetween}><Text style={styles.label}>{t.player}</Text>
      {(active!==null||playingChapter!==null)&&<Text style={styles.kind}>{playingChapter!==null?'EN CHAPTER PREVIEW':lastKind==='preview'?t.preview:'✓ '+t.completed}</Text>}
     </View>
     {active===null && playingChapter===null?<Text style={styles.emptyPlayer}>{t.none}</Text>:<>
      <Text style={styles.playerTitle}>{playingChapter!==null ? `${String(playingChapter).padStart(2,'0')}. ${storiesContent[playingChapter-1].title_en}` : stops[active!].titles[language]}</Text>
      <Text style={styles.playerText}>{playingChapter!==null ? storiesContent[playingChapter-1].en : narrativeText(stops[active!].id, language)}</Text>
      {playingChapter===null && active!==null && englishNarrationStops.includes(stops[active].id) && language === 'en' &&
       <Text style={styles.productionTag}>NEW EN NARRATION · REVIEW VOICE & PRONUNCIATION</Text>}
      <Text style={styles.playerClock}>{fmt(playback.currentTime)} / {fmt(playback.duration)}</Text>
      <View style={styles.track}><View style={[styles.audioFilled,{width:`${playback.duration?Math.min(100,100*playback.currentTime/playback.duration):0}%`}]} /></View>
      <View style={styles.miniAudioTools}>
       <Pressable accessibilityRole="button" accessibilityLabel="Go back 10 seconds" style={styles.miniAudioButton} onPress={()=>seekRelative(-10)}><Text style={styles.miniAudioText}>↶ 10s</Text></Pressable>
       <Pressable accessibilityRole="button" accessibilityLabel="Go forward 10 seconds" style={styles.miniAudioButton} onPress={()=>seekRelative(10)}><Text style={styles.miniAudioText}>10s ↷</Text></Pressable>
       <Pressable accessibilityRole="button" accessibilityLabel="Change audio speed" style={styles.miniAudioButton} onPress={togglePlaybackSpeed}><Text style={styles.miniAudioText}>{playbackSpeed}×</Text></Pressable>
      </View>
      <View style={styles.pair}>
       <View style={{flex:1}}><Button label={t.listen+' ↺'} secondary onPress={()=>playingChapter!==null?playChapter(playingChapter):active!==null?playStory(active,lastKind??'preview'):undefined}/></View>
       <View style={{flex:1}}><Button label={playback.playing?t.pause:t.resume} onPress={()=>playback.playing?player.pause():resumeAudio()}/></View>
      </View>
      {playingChapter!==null && playingChapter<29 && (
       <Button label={`▶ NEXT CHAPTER ${String(playingChapter+1).padStart(2,'0')}`} secondary
        disabled={false} onPress={()=>playChapter(playingChapter+1)}/>
      )}
     </>}
    </View>

    <View style={styles.rowBetween}>
     <Text style={styles.sectionTitle}>{t.route}</Text>
     <Pressable onPress={reset}><Text style={styles.reset}>{t.reset}</Text></Pressable>
    </View>
    {stops.map((s,i)=>{
     const done=completed.includes(s.id);const dist=currentFix?Math.round(distanceMeters(currentFix,s)):null;
     return <Pressable accessibilityRole="button" key={s.id} onPress={()=>playStory(i,'preview')} style={[styles.storyRow,active===i&&styles.storyCurrent]}>
      <View style={[styles.stopNumber,done&&{backgroundColor:C.green}]}><Text style={styles.stopNumberText}>{done?'✓':i+1}</Text></View>
      <View style={{flex:1}}><Text style={styles.stopHeading}>{s.titles[language]}</Text>
       <Text style={styles.stopSub}>{dist===null?'Encrypted offline audio':`${dist} m · offline audio`}{englishNarrationStops.includes(s.id) && language==='en' ? ' · EN voice test' : ' · demo'}{heard.includes(s.id) && !done ? ' · listened' : ''}</Text></View>
      <Text style={styles.playArrow}>▶</Text>
     </Pressable>;
    })}
    <Pressable style={styles.planToggle} onPress={()=>setShowPlan(s=>!s)}>
     <Text style={styles.planToggleText}>{t.planned} {showPlan?'⌃':'⌄'}</Text>
    </Pressable>
    {showPlan&&<View style={styles.planArea}>
     <Text style={styles.caption}>All 29 texts in EN / ME. Audio must be unlocked and downloaded as an encrypted pack. Chapter previews are separate from the 5 GPS demonstration stops. GPS still requires field testing.</Text>
     {chaptersPlan.map(c=>{ const chapter=storiesContent[c.number-1]; const open=openTextChapter===c.number;
      const translated = language==='me';
      return <View key={c.number}>
       <Pressable accessibilityRole="button" onPress={()=>setOpenTextChapter(open?null:c.number)} style={styles.planRow}>
        <Text style={styles.planNumber}>{String(c.number).padStart(2,'0')}</Text>
        <View style={{flex:1}}><Text style={styles.planTitle}>{translated?chapter.title_me:chapter.title_en} {open?'⌃':'⌄'}</Text>
         <Text style={styles.planStatus}>{c.zone} · {packStatus.language===language && packStatus.chapters.includes(c.number)?'✓ DOWNLOADED AUDIO':(language==='en'&&!!englishChapterAudio[c.number])?'✓ EN TEST AUDIO':'Audio pending'} · EN / ME text</Text></View>
       </Pressable>
       {open&&<View style={styles.scriptPreview}>
        <Text style={styles.scriptTag}>EDITORIAL TEXT • {translated?'CRNOGORSKI':'ENGLISH'}{!translated&&language!=='en'?' (EN fallback)':''}</Text>
        <Text style={styles.scriptBody}>{translated?chapter.me:chapter.en}</Text>
        <Button label={`▶ PLAY AUDIO ${String(c.number).padStart(2,'0')}`} onPress={()=>void playChapter(c.number)}/>
        <Text style={styles.scriptHint}>Chapter playback is a manual preview; GPS arrival tracking still has only five field-unverified demonstration zones.</Text>
       </View>}
      </View>;})}
    </View>}
    <View style={styles.footer}>
     <Text style={styles.label}>{t.about}</Text>
     <Text style={styles.footerText}>29 EN/ME scripts · NO commercial MP3 bundled · {packStatus.installed} encrypted tracks downloaded in {language.toUpperCase()}.{'\n'}{t.previewNote}{'\n'}{t.audioNote}{'\n'}{t.privacy}{'\n'}Lock-screen audio and GPS background behavior need separate native tests. New narration is not commercially cleared until the account license is checked.</Text>
     {!!lockNotice&&<Text style={styles.caption}>{lockNotice}</Text>}
    </View>
   </View>
  </ScrollView>
 </SafeAreaView>;
}
export default function App(){return <SafeAreaProvider><TourScreen/></SafeAreaProvider>;}

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.cream},
 packCard:{backgroundColor:C.white, borderWidth:1,borderColor:C.border,borderRadius:15,padding:14,marginBottom:20,gap:8},
 packTitle:{fontSize:17,fontWeight:'800',color:C.navy},
 packInput:{borderWidth:1,borderColor:C.border,borderRadius:10,backgroundColor:C.cream,color:C.navy,paddingHorizontal:12,paddingVertical:12,fontSize:14},
 packFeedback:{backgroundColor:C.lightBlue,borderRadius:8,padding:10,color:C.dark,fontSize:12},
 hero:{backgroundColor:C.navy,paddingTop:22,paddingBottom:26,paddingHorizontal:22},
 brand:{color:C.white,letterSpacing:3,fontSize:14,fontWeight:'900'},
 kicker:{fontSize:10,color:'#9DB8C7',marginTop:5,letterSpacing:1.6,fontWeight:'700'},
 heading:{color:C.white,fontWeight:'900',fontSize:33,lineHeight:38,marginTop:18},
 heroText:{color:'#D1DFE8',fontSize:14,lineHeight:22,marginTop:7},
 chips:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:17},
 chip:{color:C.white,backgroundColor:'#25415E',overflow:'hidden',borderRadius:7,paddingHorizontal:10,paddingVertical:7,fontSize:10,fontWeight:'800'},
 chipGold:{color:C.navy,backgroundColor:C.goldLight,overflow:'hidden',borderRadius:7,paddingHorizontal:10,paddingVertical:7,fontSize:10,fontWeight:'900'},
 content:{paddingHorizontal:17,paddingTop:20},label:{fontWeight:'900',letterSpacing:1.3,fontSize:11,color:C.navy},
 lang:{paddingVertical:10,paddingHorizontal:13,borderRadius:11,marginRight:8,backgroundColor:C.white,borderColor:C.border,borderWidth:1},
 langOn:{backgroundColor:C.navy,borderColor:C.navy},langName:{fontSize:12,fontWeight:'700',color:C.navy},
 segment:{flexDirection:'row',backgroundColor:'#E6EBEC',padding:4,borderRadius:13,marginTop:9},
 segmentItem:{flex:1,alignItems:'center',paddingVertical:12,borderRadius:9},segmentOn:{backgroundColor:C.navy},
 segmentText:{fontSize:11,fontWeight:'900',color:C.muted},segmentTextOn:{color:C.white},
 notice:{borderRadius:12,paddingVertical:12,paddingHorizontal:14,marginTop:11,marginBottom:17},noticeGold:{backgroundColor:C.goldLight},noticeBlue:{backgroundColor:C.lightBlue},
 noticeHeading:{color:C.navy,fontSize:11,letterSpacing:.6,fontWeight:'900'},noticeText:{color:C.ink,fontSize:12,lineHeight:18,marginTop:3},
 mapWrap:{height:300,borderRadius:18,overflow:'hidden',backgroundColor:'#DFE8EB'},map:{flex:1},
 mapBadge:{position:'absolute',top:12,left:12,backgroundColor:C.white,paddingVertical:8,paddingHorizontal:11,borderRadius:10,maxWidth:'70%'},
 mapBadgeTitle:{color:C.navy,fontWeight:'900',fontSize:11},mapBadgeSub:{fontSize:11,color:C.muted,marginTop:2},
 mapControls:{position:'absolute',right:11,top:12,gap:7},mapMini:{height:36,width:36,backgroundColor:C.white,borderRadius:10,alignItems:'center',justifyContent:'center'},mapMiniText:{fontSize:21,fontWeight:'900',color:C.navy},
 mapPin:{backgroundColor:C.navy,borderColor:'white',borderWidth:2,height:31,minWidth:31,borderRadius:16,alignItems:'center',justifyContent:'center',paddingHorizontal:4},
 mapPinDone:{backgroundColor:C.green},mapPinText:{fontWeight:'900',fontSize:12,color:C.white},
 caption:{color:C.muted,fontSize:11,lineHeight:17,marginTop:8},diagnostic:{color:C.navy,fontSize:12,marginTop:9,fontWeight:'700'},
 progressCard:{backgroundColor:C.white,borderRadius:13,borderColor:C.border,borderWidth:1,marginTop:15,padding:14},
 progressHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:9},progressCount:{fontSize:13,color:C.green,fontWeight:'900'},
 track:{height:6,backgroundColor:'#E1E7EA',borderRadius:9,overflow:'hidden'},progressFilled:{height:6,backgroundColor:C.green},audioFilled:{height:6,backgroundColor:C.gold},
 tools:{gap:9,marginTop:15},button:{backgroundColor:C.navy,alignItems:'center',justifyContent:'center',borderRadius:12,padding:15,minHeight:49},
 buttonOutline:{backgroundColor:C.white,borderWidth:1,borderColor:'#BFCED5'},buttonText:{color:C.white,fontWeight:'900',fontSize:12,letterSpacing:.2,textAlign:'center'},
 player:{marginTop:18,backgroundColor:C.white,borderRadius:15,borderWidth:1,borderColor:C.border,padding:17},
 rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10},kind:{color:C.green,fontSize:10,fontWeight:'900'},
 emptyPlayer:{fontSize:13,color:C.muted,lineHeight:20,marginTop:12},playerTitle:{fontSize:23,color:C.navy,fontWeight:'900',marginTop:10},
 playerText:{fontSize:14,lineHeight:23,color:C.ink,marginTop:11},
 productionTag:{color:C.green,fontSize:10,fontWeight:'800',letterSpacing:.5,marginTop:10},playerClock:{textAlign:'right',fontSize:12,color:C.muted,marginTop:16,marginBottom:8},
 miniAudioTools:{flexDirection:'row',gap:9,marginTop:12},miniAudioButton:{flex:1,borderRadius:10,paddingVertical:11,borderColor:C.border,borderWidth:1,alignItems:'center',backgroundColor:C.cream},miniAudioText:{color:C.navy,fontWeight:'900',fontSize:13},
 pair:{flexDirection:'row',gap:9,marginTop:16},sectionTitle:{fontSize:21,color:C.navy,fontWeight:'900',marginTop:23,marginBottom:12},reset:{color:C.muted,fontSize:11,fontWeight:'800'},
 storyRow:{backgroundColor:C.white,borderColor:C.border,borderWidth:1,marginBottom:9,padding:12,borderRadius:13,flexDirection:'row',alignItems:'center',gap:12},
 storyCurrent:{borderColor:C.gold,borderWidth:2},stopNumber:{backgroundColor:C.navy,width:34,height:34,borderRadius:11,alignItems:'center',justifyContent:'center'},
 stopNumberText:{color:C.white,fontWeight:'900'},stopHeading:{fontWeight:'900',color:C.navy,fontSize:14},stopSub:{color:C.muted,fontSize:11,marginTop:5},playArrow:{color:C.gold,fontSize:16,paddingHorizontal:5},
 planToggle:{marginTop:7,backgroundColor:C.white,borderColor:C.border,borderWidth:1,padding:14,borderRadius:12},planToggleText:{textAlign:'center',fontSize:12,fontWeight:'900',color:C.navy},
 planArea:{backgroundColor:C.white,paddingHorizontal:15,paddingBottom:15,borderRadius:12,marginTop:8},
 scriptPreview:{backgroundColor:C.cream,padding:13,borderRadius:10,marginBottom:10},scriptTag:{fontSize:10,color:C.gold,fontWeight:'900',letterSpacing:.8},scriptBody:{color:C.ink,fontSize:13,lineHeight:21,marginTop:8},scriptHint:{color:C.muted,fontSize:10,lineHeight:15,marginTop:8},planRow:{flexDirection:'row',borderBottomColor:C.border,borderBottomWidth:1,paddingVertical:9,gap:12},
 planNumber:{fontWeight:'900',color:C.gold,fontSize:12},planTitle:{fontSize:12,fontWeight:'700',color:C.navy},planStatus:{fontSize:10,color:C.muted,marginTop:3},
 footer:{padding:16,backgroundColor:C.lightBlue,borderRadius:13,marginTop:20},footerText:{fontSize:12,color:C.ink,lineHeight:22,marginTop:7},
});
