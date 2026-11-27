'use strict';
// =====================================================================
//  알 개체값 — 같은 몬스터 알도 레벨·능력치가 제각각
// =====================================================================
const EGG_G=[{n:'C',c:'#b8b0a0'},{n:'B',c:'#6fb8ff'},{n:'A',c:'#c77dff'},{n:'S',c:'#ffa53a'},{n:'SS',c:'#ff3a3a'}];
function rollEgg(boost=0){const r=()=>+(rnd(0.82,1.15)+boost*0.06).toFixed(2);const e={lvb:ri(0,2)+(R()<0.2?ri(1,3):0)+boost,h:r(),a:r(),d:r()};
 const s=(e.h+e.a+e.d)/3+e.lvb*0.025;e.g=s>=1.25?4:s>=1.13?3:s>=1.05?2:s>=0.97?1:0;return e;}
function eggRolls(k){P.eggI=P.eggI||{};const n=P.eggs[k]||0,L=P.eggI[k]||(P.eggI[k]=[]);while(L.length<n)L.push(rollEgg());if(L.length>n)L.length=n;L.sort((a,b)=>b.g-a.g||b.lvb-a.lvb);return L;}
function eggSeen(k){P.eggSeen=P.eggSeen||{};if(!P.eggSeen[k]){P.eggSeen[k]=1;}}
function eggAdd(k,n=1,boost=0){eggSeen(k);P.eggs[k]=(P.eggs[k]||0)+n;const L=eggRolls(k);for(let i=0;i<n;i++){L.pop();}for(let i=0;i<n;i++)L.push(rollEgg(boost));eggRolls(k);return L[L.length-1];}
function eggTake(k,idx){const L=eggRolls(k);if(!L.length)return rollEgg();const i=idx==null?L.length-1:clamp(idx,0,L.length-1);const e=L.splice(i,1)[0];P.eggs[k]--;return e;}
const eggTag=e=>e?`<span style="color:${EGG_G[e.g].c};font-weight:800">[${EGG_G[e.g].n}]</span>`:'';
const eggStat=e=>e?`Lv+${e.lvb} · HP×${e.h} · 공×${e.a} · 방×${e.d}`:'';
