/* Quran Player — MP3Quran API v3 adapter. No private keys are required. */
const API = "https://mp3quran.net/api/v3";
const $ = (id) => document.getElementById(id);
const state = { reciters: [], surahs: [], selectedRead: null, timing: [], audioUrl: "", repeatPass: 0, ayahPass: 0, repeatCount: 2, repeatMode: "none", rangeStart: 1, rangeEnd: 7, currentAyah: null, lang: "ar", saved: [] };

const translations = {
 ar:{appName:"مشغل القرآن الكريم",tagline:"رفيق تلاوتك أينما كنت",online:"متصل",offline:"دون اتصال",welcomeEyebrow:"مساحتك القرآنية",welcomeTitle:"أنصت بقلبك، وتدبّر بطمأنينة",welcomeText:"اختر قارئك وسورتك، وحدد موضع التلاوة والتكرار الذي يناسبك.",listenSetup:"إعداد التلاوة",listenSetupSub:"حدد القارئ والرواية والمقطع",reciter:"القارئ",riwaya:"الرواية / المصحف",surah:"السورة",fromAyah:"من الآية",toAyah:"إلى الآية",repeatSettings:"إعدادات التكرار",repeatMode:"نمط التكرار",repeatNone:"بدون تكرار",repeatAyah:"تكرار كل آية",repeatRange:"تكرار المقطع كاملاً",repeatCount:"عدد مرات التكرار",playSelection:"تشغيل التحديد",nowPlaying:"التلاوة الحالية",speed:"السرعة",saveOffline:"حفظ للاستماع دون إنترنت",ayahRange:"نطاق الآيات",ayahRangeSub:"بيانات التوقيت متاحة لبعض التلاوات فقط",timingHint:"سيتم استخدام توقيت الآيات عند توفره من المصدر.",chooseRange:"اختر السورة والقارئ لعرض نطاق الآيات.",offlineLibrary:"المكتبة دون إنترنت",offlineSub:"التلاوات التي حفظتها على هذا الجهاز",nothingSaved:"لا توجد ملفات محفوظة بعد.",footer:"مشغل القرآن الكريم",rights:"احترام شروط مصادر الصوت",loading:"جارٍ التحميل...",chooseReciter:"اختر القارئ",chooseRead:"اختر الرواية",chooseSurah:"اختر السورة",noAudio:"لا يوجد رابط صوتي متاح لهذا الاختيار.",timingUnavailable:"لا تتوفر توقيتات آيات لهذا المصحف؛ يمكنك الاستماع إلى السورة كاملة.",saved:"تم حفظ التلاوة على هذا الجهاز إذا سمح المصدر والمتصفح.",saveFailed:"تعذر الحفظ. تحقق من الاتصال ومساحة التخزين.",invalidRange:"تحقق من نطاق الآيات.",apiError:"تعذر تحميل البيانات من المصدر. أعد المحاولة لاحقاً.",playing:"جارٍ التشغيل",paused:"متوقف",removed:"تم حذف الملف المحفوظ.",offlineOnly:"حفظ التطبيق لا يعني امتلاك حق إعادة توزيع الصوت."},
 fr:{appName:"Lecteur du Coran",tagline:"Votre compagnon de récitation",online:"En ligne",offline:"Hors ligne",welcomeEyebrow:"Votre espace coranique",welcomeTitle:"Écoutez avec le cœur et méditez en paix",welcomeText:"Choisissez un récitateur, une sourate et vos répétitions.",listenSetup:"Paramètres de récitation",listenSetupSub:"Choisissez le récitateur et le passage",reciter:"Récitateur",riwaya:"Riwaya / Mushaf",surah:"Sourate",fromAyah:"Du verset",toAyah:"Au verset",repeatSettings:"Répétition",repeatMode:"Mode",repeatNone:"Aucune",repeatAyah:"Chaque verset",repeatRange:"Tout le passage",repeatCount:"Nombre de répétitions",playSelection:"Lire la sélection",nowPlaying:"Lecture actuelle",speed:"Vitesse",saveOffline:"Enregistrer hors ligne",ayahRange:"Plage de versets",ayahRangeSub:"Le minutage dépend de la récitation",timingHint:"Le minutage sera utilisé s'il est fourni par la source.",chooseRange:"Choisissez une sourate et un récitateur.",offlineLibrary:"Bibliothèque hors ligne",offlineSub:"Fichiers enregistrés sur cet appareil",nothingSaved:"Aucun fichier enregistré.",footer:"Lecteur du Coran",rights:"Respect des conditions des sources audio",loading:"Chargement...",chooseReciter:"Choisir un récitateur",chooseRead:"Choisir une riwaya",chooseSurah:"Choisir une sourate",noAudio:"Aucun audio disponible pour ce choix.",timingUnavailable:"Aucun minutage disponible pour ce mushaf.",saved:"Récitation enregistrée si la source et le navigateur l'autorisent.",saveFailed:"Enregistrement impossible. Vérifiez la connexion et le stockage.",invalidRange:"Vérifiez la plage de versets.",apiError:"Impossible de charger les données. Réessayez plus tard.",playing:"Lecture",paused:"En pause",removed:"Fichier supprimé.",offlineOnly:"L'enregistrement local n'autorise pas la redistribution."},
 en:{appName:"Quran Player",tagline:"Your companion for recitation",online:"Online",offline:"Offline",welcomeEyebrow:"Your Quran space",welcomeTitle:"Listen with your heart and reflect in peace",welcomeText:"Choose a reciter, surah, and the repetition that suits you.",listenSetup:"Recitation setup",listenSetupSub:"Choose reciter, riwayah and passage",reciter:"Reciter",riwaya:"Riwayah / Mushaf",surah:"Surah",fromAyah:"From ayah",toAyah:"To ayah",repeatSettings:"Repeat settings",repeatMode:"Repeat mode",repeatNone:"No repeat",repeatAyah:"Repeat each ayah",repeatRange:"Repeat full range",repeatCount:"Number of repeats",playSelection:"Play selection",nowPlaying:"Now playing",speed:"Speed",saveOffline:"Save for offline listening",ayahRange:"Ayah range",ayahRangeSub:"Timing is available for selected recitations",timingHint:"Ayah timings are used when provided by the source.",chooseRange:"Choose a reciter and surah to view the range.",offlineLibrary:"Offline library",offlineSub:"Recitations saved on this device",nothingSaved:"No saved files yet.",footer:"Quran Player",rights:"Respect audio source terms",loading:"Loading...",chooseReciter:"Choose reciter",chooseRead:"Choose riwayah",chooseSurah:"Choose surah",noAudio:"No audio URL for this selection.",timingUnavailable:"No ayah timings are available for this mushaf.",saved:"Saved on this device if allowed by the source and browser.",saveFailed:"Could not save. Check connection and storage.",invalidRange:"Check the ayah range.",apiError:"Could not load source data. Try again later.",playing:"Playing",paused:"Paused",removed:"Saved file removed.",offlineOnly:"Local saving does not grant redistribution rights."}
};
const t = key => translations[state.lang][key] || key;
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function apiUrl(path, params={}){const u=new URL(API+path);Object.entries(params).forEach(([k,v])=>v!==undefined&&v!==null&&v!==""&&u.searchParams.set(k,v));return u}
async function api(path,params){const r=await fetch(apiUrl(path,params),{headers:{Accept:"application/json"}});if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}
function arrayFrom(obj,...keys){for(const k of keys){if(Array.isArray(obj?.[k]))return obj[k]}return []}
function textOf(item){return item?.name||item?.reciter_name||item?.moshaf_name||item?.sura_name_ar||item?.name_ar||item?.name_en||item?.title||""}
function applyLanguage(){document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(translations[state.lang][key])el.textContent=translations[state.lang][key]});$("connectionState").querySelector("span").textContent=navigator.onLine?t("online"):t("offline")}
function populateSelect(select,items,placeholder,labelFn){select.innerHTML="";const first=document.createElement("option");first.value="";first.textContent=placeholder;select.append(first);items.forEach((item,i)=>{const o=document.createElement("option");o.value=String(i);o.textContent=labelFn(item);select.append(o)})}
let catalogRequest=0,timingRequest=0;
async function loadCatalog(){
 const request=++catalogRequest;
 const oldReciter=selectedReciter()?.id,oldRead=state.selectedRead?.id,oldSurah=selectedSurah()?.id;
 try{
  const [recitersData,surahsData]=await Promise.all([api("/reciters",{language:state.lang}),api("/suwar",{language:state.lang})]);
  if(request!==catalogRequest)return;
  state.reciters=arrayFrom(recitersData,"reciters");state.surahs=arrayFrom(surahsData,"suwar","surahs");
  if(!state.reciters.length||!state.surahs.length)throw new Error("Unexpected API response");
  populateSelect($("reciterSelect"),state.reciters,t("chooseReciter"),r=>r.name||r.reciter_name||"Reciter");
  populateSelect($("surahSelect"),state.surahs,t("chooseSurah"),s=>s.name||s.sura_name_ar||s.name_ar||`Surah ${s.id}`);
  const ri=state.reciters.findIndex(x=>String(x.id)===String(oldReciter));
  const si=state.surahs.findIndex(x=>String(x.id||x.sura_id)===String(oldSurah));
  if(ri>=0){$("reciterSelect").value=String(ri);await chooseReciter();const reads=readList(state.reciters[ri]);const rdi=reads.findIndex(x=>String(x.id)===String(oldRead));if(rdi>=0){$("riwayaSelect").value=String(rdi);await chooseRead()}}
  if(si>=0)$("surahSelect").value=String(si);
  if(state.selectedRead&&selectedSurah())await refreshSelection();
 }catch(e){if(request===catalogRequest){console.error(e);$("selectionMessage").textContent=t("apiError")}}
}
function readList(reciter){return arrayFrom(reciter,"moshaf","reads")}
function selectedSurah(){const v=$("surahSelect").value;return v===""?null:state.surahs[Number(v)]}
function selectedReciter(){const v=$("reciterSelect").value;return v===""?null:state.reciters[Number(v)]}
function getAudioUrl(read,surah){
 const server=read?.server||read?.audio_url||read?.url;
 if(!server)return "";
 const ids=String(read?.surah_list||"").split(",").map(x=>x.trim());
 if(read?.surah_list && !ids.includes(String(surah)))return "";
 const base=server.endsWith("/")?server:server+"/";
 return base+String(surah).padStart(3,"0")+".mp3";
}
async function loadTiming(read,surah){
 const request=++timingRequest;state.timing=[];
 try{
  const data=await api("/ayat_timing",{surah,read:read.id});
  if(request!==timingRequest)return;
  const rows=Array.isArray(data)?data:arrayFrom(data,"ayat_timing","timings","data");
  const zeroBased=rows.some(row=>Number(row.ayah??row.aya??row.number)===0);
  state.timing=rows.map(row=>timingFields(row,zeroBased)).filter(x=>Number.isInteger(x.ayah)&&x.ayah>0&&Number.isFinite(x.start)&&Number.isFinite(x.end)&&x.end>x.start).sort((a,b)=>a.ayah-b.ayah);
  if(!state.timing.length)throw new Error("No valid timing rows");
  $("timingStatus").textContent=`${state.timing.length} ${state.lang==="ar"?"توقيتاً متاحاً":state.lang==="fr"?"repères disponibles":"timing entries available"}`;
 }catch(e){if(request===timingRequest){state.timing=[];$("timingStatus").textContent=t("timingUnavailable")}}
 renderAyahList();
}
function timingFields(row,zeroBased=false){
 const ayah=Number(row.ayah??row.aya??row.number);
 const rawStart=Number(row.start_time??row.start_ms??row.start),rawEnd=Number(row.end_time??row.end_ms??row.end);
 const startMs=row.start_time!==undefined||row.start_ms!==undefined;
 const endMs=row.end_time!==undefined||row.end_ms!==undefined;
 return {ayah:ayah+(zeroBased?1:0),start:rawStart/(startMs?1000:1),end:rawEnd/(endMs?1000:1)};
}
function renderAyahList(){
 const box=$("ayahList");box.innerHTML="";
 const rows=state.timing.map(timingFields).filter(x=>Number.isFinite(x.ayah)&&x.ayah>0);
 if(!rows.length){const p=document.createElement("p");p.className="muted";p.textContent=t("chooseRange");box.append(p);return}
 rows.filter(x=>x.ayah>=state.rangeStart&&x.ayah<=state.rangeEnd).forEach(x=>{const row=document.createElement("div");row.className="ayah-row";row.dataset.ayah=x.ayah;const name=document.createElement("span");name.textContent=(state.lang==="ar"?"الآية ":"Ayah ")+x.ayah;const btn=document.createElement("button");btn.textContent="▶";btn.title=t("playing");btn.onclick=()=>{const audio=$("audio");audio.currentTime=x.start;audio.play();state.currentAyah=x.ayah};row.append(name,btn);box.append(row)});
}
async function chooseReciter(){
 const reciter=selectedReciter(),reads=readList(reciter);state.selectedRead=null;
 populateSelect($("riwayaSelect"),reads,t("chooseRead"),r=>r.name||r.moshaf_name||r.rewaya_name||"Riwayah");
 $("riwayaSelect").disabled=!reads.length;
 if(!reads.length)$("selectionMessage").textContent=t("noAudio");
}
async function chooseRead(){
 const reads=readList(selectedReciter());state.selectedRead=reads[Number($("riwayaSelect").value)]||null;
 await refreshSelection();
}
async function refreshSelection(){
 const read=state.selectedRead,surah=selectedSurah();if(!read||!surah)return;
 const surahNo=Number(surah.id||surah.sura_id);
 state.audioUrl=getAudioUrl(read,surahNo);
 if(!state.audioUrl){$("selectionMessage").textContent=t("noAudio");return}
 $("audio").src=state.audioUrl;$("nowSurah").textContent=textOf(surah)||`Surah ${surahNo}`;$("nowReciter").textContent=(selectedReciter()?.name||"")+" · "+(read.name||read.moshaf_name||"");
 await loadTiming(read,surahNo);
}
function validateRange(){
 const s=selectedSurah(),max=Number(s?.count||s?.ayah_count||s?.sura_ayah||s?.verses_count||0);
 if(!s||!Number.isInteger(max)||max<1){toast(t("invalidRange"));return false}
 state.rangeStart=Math.max(1,Number($("startAyah").value)||1);state.rangeEnd=Math.min(max,Number($("endAyah").value)||max);
 if(state.rangeStart>state.rangeEnd){toast(t("invalidRange"));return false}
 $("startAyah").value=state.rangeStart;$("endAyah").value=state.rangeEnd;return true;
}
function getTiming(ayah){return state.timing.map(timingFields).find(x=>x.ayah===ayah)}
function startSelection(){
 if(!validateRange()||!state.audioUrl)return;
 state.repeatMode=$("repeatMode").value;state.repeatCount=Math.max(1,Math.min(99,Number($("repeatCount").value)||1));state.repeatPass=0;state.ayahPass=0;state.currentAyah=null;
 const rows=state.timing.map(timingFields).filter(x=>x.ayah>=state.rangeStart&&x.ayah<=state.rangeEnd);
 if(!rows.length){state.repeatMode="none";$("repeatMode").value="none";toast(t("timingUnavailable"))}
 else $("audio").currentTime=rows[0].start;
 $("audio").play().catch(e=>{console.warn(e);toast(t("apiError"))});
}
function formatTime(s){if(!Number.isFinite(s))return"00:00";return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`}
function updateProgress(){const a=$("audio");$("currentTime").textContent=formatTime(a.currentTime);$("duration").textContent=formatTime(a.duration);$("seekBar").value=a.duration?Math.round(a.currentTime/a.duration*1000):0}
function onTimeUpdate(){
 updateProgress();if(!state.audioUrl||!state.selectedRead)return;
 const rows=state.timing.map(timingFields).filter(x=>x.ayah>=state.rangeStart&&x.ayah<=state.rangeEnd).sort((a,b)=>a.ayah-b.ayah);
 if(!rows.length)return;
 const audio=$("audio"),now=audio.currentTime,last=rows[rows.length-1];
 const current=rows.find(x=>now>=x.start&&now<x.end);
 if(current&&state.currentAyah!==current.ayah){state.currentAyah=current.ayah;state.ayahPass=0}
 if(current)document.querySelectorAll(".ayah-row").forEach(el=>el.classList.toggle("active",Number(el.dataset.ayah)===current.ayah));
 const active=rows.find(x=>x.ayah===state.currentAyah);
 if(state.repeatMode==="ayah"&&active&&now>=active.end-0.08){
  if(state.ayahPass+1<state.repeatCount){state.ayahPass++;audio.currentTime=active.start;return}
  state.ayahPass=0;state.currentAyah=null;
  if(active.ayah!==last.ayah)return;
 }
 if(now>=last.end-0.08){
  if(state.repeatMode==="range"&&state.repeatPass+1<state.repeatCount){state.repeatPass++;state.currentAyah=null;audio.currentTime=rows[0].start;return}
  audio.pause();
 }
}
function aTime(){return $("audio").currentTime}
function onEnded(){
 const audio=$("audio");
 if(state.repeatMode==="range"&&state.repeatPass+1<state.repeatCount){const first=getTiming(state.rangeStart);if(first){state.repeatPass++;state.currentAyah=null;audio.currentTime=first.start;audio.play().catch(console.warn)}}
}
function readSaved(){
 try{const value=JSON.parse(localStorage.getItem("quranSaved")||"[]");return Array.isArray(value)?value.filter(x=>x&&typeof x.url==="string"):[]}
 catch(e){console.warn("Invalid saved library metadata",e);localStorage.removeItem("quranSaved");return []}
}
async function saveOffline(){
 if(!state.audioUrl)return toast(t("noAudio"));
 if(!("caches"in window))return toast(t("saveFailed"));
 const url=state.audioUrl,key=String(selectedSurah()?.id||"")+"-"+(selectedReciter()?.name||"");
 try{
  const response=await fetch(url,{mode:"cors"});
  if(!response.ok||response.type==="opaque")throw new Error("Audio cannot be cached");
  const cache=await caches.open("quran-audio-v1");await cache.put(url,response.clone());
  const meta=readSaved();
  if(!meta.some(x=>x.url===url))meta.push({url,key,title:$("nowSurah").textContent,reciter:$("nowReciter").textContent});
  localStorage.setItem("quranSaved",JSON.stringify(meta));renderOffline();toast(t("saved"));
 }catch(e){console.warn(e);toast(t("saveFailed"))}
}
function renderOffline(){
 const box=$("offlineList"),items=readSaved();box.innerHTML="";
 if(!items.length){const p=document.createElement("p");p.className="muted";p.textContent=t("nothingSaved");box.append(p);return}
 items.forEach((item,i)=>{
  const row=document.createElement("div");row.className="offline-item";const name=document.createElement("span");name.textContent=`${item.title||"Quran"} — ${item.reciter||""}`;
  const actions=document.createElement("span"),play=document.createElement("button");play.textContent="▶";
  play.onclick=async()=>{try{const cache=await caches.open("quran-audio-v1"),r=await cache.match(item.url);if(!r)throw new Error("Cache entry missing");const blob=await r.blob();if(state.objectUrl)URL.revokeObjectURL(state.objectUrl);state.objectUrl=URL.createObjectURL(blob);$("audio").src=state.objectUrl;$("audio").play().catch(console.warn)}catch(e){console.warn(e);toast(t("saveFailed"))}};
  const del=document.createElement("button");del.textContent="×";del.onclick=async()=>{try{const cache=await caches.open("quran-audio-v1");await cache.delete(item.url);const latest=readSaved().filter(x=>x.url!==item.url);localStorage.setItem("quranSaved",JSON.stringify(latest));renderOffline();toast(t("removed"))}catch(e){console.warn(e);toast(t("saveFailed"))}};
  actions.append(play,del);row.append(name,actions);box.append(row);
 });
}
function updateConnection(){const el=$("connectionState");el.classList.toggle("offline",!navigator.onLine);el.querySelector("span").textContent=navigator.onLine?t("online"):t("offline")}
$("languageSelect").addEventListener("change",async e=>{state.lang=e.target.value;applyLanguage();await loadCatalog();renderOffline()});
$("reciterSelect").addEventListener("change",chooseReciter);
$("riwayaSelect").addEventListener("change",chooseRead);
$("surahSelect").addEventListener("change",async()=>{const s=selectedSurah(),max=Number(s?.count||s?.ayah_count||s?.sura_ayah||s?.verses_count||7);$("startAyah").value=1;$("endAyah").value=Math.max(1,max);state.rangeStart=1;state.rangeEnd=Math.max(1,max);await refreshSelection();});
$("playSelection").addEventListener("click",startSelection);
$("playBtn").addEventListener("click",()=>{$("audio").paused? $("audio").play():$("audio").pause()});
$("restartBtn").addEventListener("click",()=>{$("audio").currentTime=0;$("audio").play()});
$("stopBtn").addEventListener("click",()=>{$("audio").pause();$("audio").currentTime=0});
$("speedSelect").addEventListener("change",e=>$("audio").playbackRate=Number(e.target.value));
$("seekBar").addEventListener("input",e=>{const a=$("audio");if(a.duration)a.currentTime=a.duration*Number(e.target.value)/1000});
$("downloadBtn").addEventListener("click",saveOffline);
$("audio").addEventListener("timeupdate",onTimeUpdate);$("audio").addEventListener("loadedmetadata",updateProgress);$("audio").addEventListener("timeupdate",updateProgress);$("audio").addEventListener("ended",onEnded);$("audio").addEventListener("play",()=>{$("playBtn").textContent="Ⅱ"});$("audio").addEventListener("pause",()=>{$("playBtn").textContent="▶"});$("audio").addEventListener("error",()=>{$("selectionMessage").textContent=t("apiError")});
window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);
(async()=>{applyLanguage();updateConnection();renderOffline();await loadCatalog();if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(console.warn)})();
