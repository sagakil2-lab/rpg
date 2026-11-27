'use strict';
// =====================================================================
//  플레이어 던전 (몬스터 알·코어로 건설, NPC가 탐험)
// =====================================================================
const monOf=(gi,mi)=>mi<0?GROUNDS[gi].boss:GROUNDS[gi].mons[mi];


const DMAPS={
 basic:{n:'기본 동굴',ic:'🕳️',d:'특별한 효과 없음',price:0,theme:null,lv:0,stat:1,mult:1,gold:1,loot:1,death:1},
 nest:{n:'몬스터 둥지',ic:'🐣',d:'몬스터 수 ×2 · 입장료 ×1.3',price:3000,theme:'cave',lv:0,stat:1,mult:2,gold:1.3,loot:1,death:1.2},
 altar:{n:'피의 제단',ic:'🩸',d:'몬스터 능력치 +40% · 사망 유품 ×1.5',price:4500,theme:'grave',lv:0,stat:1.4,mult:1,gold:1,loot:1.5,death:1.5},
 ancient:{n:'고대 유적',ic:'🏛️',d:'몬스터 레벨 +6 · 입장료 ×1.5',price:6000,theme:'mine',lv:6,stat:1,mult:1,gold:1.5,loot:1,death:1.2},
 gold:{n:'황금 광맥',ic:'💰',d:'입장료 ×2.5 · 몬스터 -10%',price:8000,theme:'mine',lv:0,stat:0.9,mult:1,gold:2.5,loot:1,death:0.8},
 treasure:{n:'보물 동굴',ic:'🎁',d:'금고 재료·장비 획득 ×2',price:7000,theme:'cave',lv:0,stat:1,mult:1,gold:1,loot:2,death:1},
 lava:{n:'용암 요새',ic:'🌋',d:'레벨 +10 · 몬스터 ×1.5 · 능력치 +20%',price:15000,theme:'lava',lv:10,stat:1.2,mult:1.5,gold:1.8,loot:1.5,death:1.8},
};
const dmap=()=>DMAPS[(P.dun&&P.dun.map)||'basic'];
const DBANDS=[{n:'초급',lo:1,hi:25,ic:'🟢'},{n:'중급',lo:26,hi:55,ic:'🔵'},{n:'상급',lo:56,hi:95,ic:'🟣'},{n:'전설',lo:96,hi:200,ic:'🟠'}];
const dband=d=>DBANDS[(d||P.dun).band||0];
function withDun(d,fn){const s=P.dun;P.dun=d;try{return fn();}finally{P.dun=s;}}
function selDun(i){if(!P.duns[i])return;P.dsel=i;P.dun=P.duns[i];delete MAPS.PD;}
const eggLvAvg=()=>{const ms=P.dun.mons;return ms.length?ms.reduce((a,m)=>a+(m.lv||1),0)/ms.length:1;};
function pdMon(i){const pm=P.dun.mons[i];const M=dmap();const m=mkMon(pm.gi,pm.mi<0?-1:pm.mi,pm.mi<0);const ex=((pm.lv||1)-1)*2+M.lv;
 const E1=pm.e||{lvb:0,h:1,a:1,d:1};m.lv+=ex+E1.lvb;const k=(1+(ex+E1.lvb)*0.08)*M.stat*E1.h;m.hp=m.maxhp=Math.round(m.hp*k);m.atk*=(1+(ex+E1.lvb)*0.06)*M.stat*E1.a;m.def=(m.def+(ex+E1.lvb)*1.2)*E1.d;m.grade=pm.e?pm.e.g:null;m.pdi=i;if((pm.lv||1)>1)m.name=`${m.name}+${pm.lv-1}`;return m;}
function pdCount(pm){return pm.mi<0?1:Math.max(1,Math.round(dmap().mult));}
function eggUpCost(pm){const lv=pm.lv||1;return Math.round(120*Math.pow(lv,1.7)*(1+GROUNDS[pm.gi].lv/10)*(pm.mi<0?3:1));}
function eggUp(i){const pm=P.dun.mons[i];if(pm&&pm.uid!=null){if(monUpg(pm.uid)){delete MAPS.PD;openDungeon();}return;}const lv=pm.lv||1;if(lv>=10){toast('최대 레벨');return;}const key=pm.gi+'_'+pm.mi,has=P.eggs[key]>0;let cost=eggUpCost(pm);if(has)cost=Math.round(cost/2);
 if(P.gold<cost){toast(`골드 부족 (${fmt(cost)}G)`);return;}P.gold-=cost;if(has)eggTake(key);pm.lv=lv+1;const nm=monOf(pm.gi,pm.mi)[0];dlog(`⬆️ ${nm} Lv${pm.lv} 강화`);toast(`${nm} → +${pm.lv-1} 강화!`);delete MAPS.PD;openDungeon();}
function setDMap(id){P.dun.map=id;delete MAPS.PD;dlog(`🗺️ 던전 지형을 「${DMAPS[id].n}」(으)로 바꿨다`);toast(`${DMAPS[id].ic} ${DMAPS[id].n} 적용`);openDungeon();}
function openMapShop(){P.dmaps=P.dmaps||{basic:1};
 openModal(`<h2>🗺️ 던전 지도 상점 <span class="gold" style="float:right">💰 ${fmt(P.gold)}G</span></h2><p class="d">던전 지형을 바꾸는 지도.</p>
 <div class="icards">${Object.entries(DMAPS).filter(([k])=>k!=='basic').map(([k,M])=>`<div class="icard" style="border-color:${P.dmaps[k]?'#7fdc7f':'#c8962e'}"><span style="font-size:34px">${M.ic}</span><div class="ib"><b style="color:#ffd98a">${M.n}</b><div style="font-size:11.5px">${M.d}</div><div class="mut" style="font-size:10.5px">지형: ${({cave:'동굴',mine:'광산',grave:'묘지',lava:'용암'})[M.theme]} · NPC 사망률 ×${M.death}</div>
 ${P.dmaps[k]?'<span class="up" style="font-size:12px">보유 중</span>':`<button class="btn s" style="margin-top:4px" ${P.gold<M.price?'disabled':''} onclick="buyDMap('${k}')">${fmt(M.price)}G 구입</button>`}</div></div>`).join('')}</div>
 <button class="btn w g" onclick="closeModal()">나가기</button>`,true);}
function buyDMap(k){const M=DMAPS[k];if(P.gold<M.price)return;P.gold-=M.price;P.dmaps[k]=1;news(`🗺️ 「${M.n}」 지도 구입`,'me');toast(`${M.ic} ${M.n} 지도 구입! 집에서 던전에 적용하자`);openMapShop();}
const STASH={tab:'m'};
function gOwn(){return P?P.gold:0;}
const ordGold=()=>P.gold+((P.stash&&P.stash.gold)||0);function ordPay(n){const a=Math.min(P.gold,n);P.gold-=a;n-=a;if(n>0){const S=stashOf();S.gold=Math.max(0,S.gold-n);}}
function instGold(){return;if(!P||P.__g)return;const own=+P.gold||0;Object.defineProperty(P,'__g',{value:{own},enumerable:false,writable:true,configurable:true});
 Object.defineProperty(P,'gold',{enumerable:true,configurable:true,get(){return this.__g.own+((this.stash&&this.stash.gold)||0);},set(v){v=+v||0;const S=stashOf(),tot=this.__g.own+(S.gold||0);if(v>=tot)this.__g.own+=v-tot;else{let d=tot-v;const t=Math.min(this.__g.own,d);this.__g.own-=t;d-=t;S.gold=Math.max(0,(S.gold||0)-d);}}});}
function matHave(id){const S=P&&P.stash;return(P.bag[id]||0)+((S&&S.bag[id])||0);}
function matUse(id,n){const b=Math.min(n,P.bag[id]||0);if(b)addBag(P.bag,id,-b);n-=b;if(n>0){const S=stashOf();S.bag[id]=Math.max(0,(S.bag[id]||0)-n);if(!S.bag[id])delete S.bag[id];}}
function stashOf(){if(!P.stash)P.stash={bag:{},items:[],gold:0};return P.stash;}
function stMat(id,n,dir){const S=stashOf();id=+id;if(dir>0){n=Math.min(n,P.bag[id]||0);if(n<=0)return;addBag(P.bag,id,-n);S.bag[id]=(S.bag[id]||0)+n;}else{n=Math.min(n,S.bag[id]||0,pFit(id));if(n<=0){toast('가방에 자리가 없다');return;}S.bag[id]-=n;if(!S.bag[id])delete S.bag[id];addBag(P.bag,id,n);}openStash();}
function stItem(uid,dir){const S=stashOf();if(dir>0){const i=P.items.findIndex(x=>x.uid===uid);if(i<0)return;if(P.eq[P.items[i].k]===uid){toast('장착 중인 장비는 맡길 수 없다');return;}if(S.items.length>=120){toast('창고가 가득 찼다');return;}S.items.push(P.items.splice(i,1)[0]);}
 else{const i=S.items.findIndex(x=>x.uid===uid);if(i<0)return;P.items.push(S.items.splice(i,1)[0]);}openStash();}
function stGold(v){const S=stashOf();S.gold=S.gold||0;v=Math.floor(v);if(v>0){v=Math.min(v,P.gold);if(v<=0){toast('맡길 골드가 없다');return;}P.gold-=v;S.gold+=v;sfx('coin');toast(`💰 ${fmt(v)}G 맡겼다`);}else{v=Math.min(-v,S.gold);if(v<=0){toast('찾을 골드가 없다');return;}S.gold-=v;P.gold+=v;sfx('coin');toast(`💰 ${fmt(v)}G 찾았다`);}openStash();}
function stAllMats(){const S=stashOf();for(const id in P.bag){S.bag[id]=(S.bag[id]||0)+P.bag[id];}P.bag={};openStash();}
function openStash(){const S=stashOf(),t=STASH.tab;const mine=Object.keys(P.bag).map(Number),theirs=Object.keys(S.bag).map(Number);
 const mcell=(id,n,dir)=>`<div class="bi" title="${MATS[id].name}" onclick="stMat(${id},${dir>0?n:n},${dir})">${icv({t:'mat',id},40)}<span class="e">${n}</span></div>`;
 const icell=(it,dir)=>{ICACHE[it.uid]=it;return`<div class="bi" data-r="${it.r}" style="border-color:${RAR[it.r].c}" title="${it.name}" onclick="stItem(${it.uid},${dir})">${icv({t:'gear',it},44)}${P.eq[it.k]===it.uid?'<span class="e">E</span>':''}</div>`;};
 const body=t==='m'?`<div class="stc"><div><h3>가방 <span class="mut">${pBag()}/${P.cap}칸</span> ${mine.length?`<button class="btn s" style="float:right" onclick="stAllMats()">전부 맡기기</button>`:''}</h3><div class="bgrid">${mine.map(id=>mcell(id,P.bag[id],1)).join('')||'<span class="mut" style="grid-column:1/-1">비어 있음</span>'}</div></div>
  <div><h3>창고</h3><div class="bgrid">${theirs.map(id=>mcell(id,S.bag[id],-1)).join('')||'<span class="mut" style="grid-column:1/-1">비어 있음</span>'}</div></div></div>`
 :t==='e'?`<div class="stc"><div><h3>가방 장비</h3><div class="bgrid">${P.items.filter(it=>P.eq[it.k]!==it.uid).map(it=>icell(it,1)).join('')||'<span class="mut" style="grid-column:1/-1">없음</span>'}</div></div><div><h3>창고 <span class="mut">${S.items.length}/120</span></h3><div class="bgrid">${S.items.map(it=>icell(it,-1)).join('')||'<span class="mut" style="grid-column:1/-1">비어 있음</span>'}</div></div></div>`
 :`<div class="eqst"><div>소지금<b>${fmt(gOwn())}G</b></div><div>창고<b>${fmt(S.gold)}G</b></div></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button class="btn s" onclick="stGold(Math.floor(gOwn()/2))">절반 맡기기</button><button class="btn s" onclick="stGold(gOwn())">전부 맡기기</button><button class="btn s g" onclick="stGold(-${S.gold})">전부 찾기</button><button class="btn s g" onclick="stGold(-1000)">1,000G 찾기</button></div><p class="d" style="margin-top:6px">창고에 둔 골드·재료는 쓰러져도 잃지 않는다.</p>`;
 openModal(`<h2>📦 창고</h2><div class="tabs">${[['m','재료'],['e','장비'],['g','골드']].map(([k,n])=>`<button class="tab ${t===k?'on':''}" onclick="STASH.tab='${k}';openStash()">${n}</button>`).join('')}</div><p class="d">눌러서 옮긴다.</p>${body}<button class="btn w g" onclick="openHome()">돌아가기</button>`,true);paintIcons($('#modal'));}
