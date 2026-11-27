'use strict';
// =====================================================================
//  다이아몬드 · 뽑기 · 상점
// =====================================================================
function addDia(n,why){if(!n)return;sfx('dia');P.dia=(P.dia||0)+n;floatT(P.x,P.y-80,`💎 +${n}`,'#7fe8ff',14,1.6);if(why)news(`💎 다이아 +${n} (${why})`,'me');}
const GACHA={
 gear:{n:'⚔️ 장비 뽑기',c1:30,c10:270,d:'무기·갑옷·투구·신발·반지·목걸이 중 하나. 내 레벨에 맞는 등급, 특수 장비·강화 장비도 나온다.',rates:[[0,40],[1,35],[2,18],[3,6],[4,1]]},
 egg:{n:'🥚 몬스터 뽑기',c1:40,c10:360,d:'내 레벨 근처 지역 몬스터의 알. 우수·정예 알은 개체값이 높고, 드물게 보스 알이 나온다.',rates:[[0,60],[1,28],[2,9],[3,3]]},
 map:{n:'🗺️ 던전 지도 뽑기',c1:50,c10:450,d:'내 던전에 적용하는 특수 지도. 이미 가진 지도가 나오면 다이아 15개로 돌려받는다.',rates:null},
};
const GRN=['일반','우수','정예','보스'],GRC=['#b8b0a0','#6fb8ff','#c77dff','#ffa53a'];
function wpick(rt){const tot=rt.reduce((a,x)=>a+x[1],0);let r=R()*tot;for(const[v,w]of rt){r-=w;if(r<0)return v;}return rt[0][0];}
function mapRates(){const ks=Object.keys(DMAPS).filter(k=>k!=='basic');return ks.map(k=>[k,Math.round(30000/DMAPS[k].price)]);}
function gachaOne(type,force){
 if(type==='gear'){let r=wpick(GACHA.gear.rates);if(force!=null)r=Math.max(r,force);const k=pick(['w','w','a','h','b','r','n']);let t=clamp(lvTier(P.lv)+(R()<0.3?1:0)+(r>=3?1:0),0,5);if(k==='r'||k==='n')t=Math.min(3,t);
  const v=(k!=='r'&&k!=='n'&&t>0&&R()<0.35)?pick(varsOf(k)):undefined;const it=plusItem(makeItem(k,t,0,r,v),plusOf(P.lv)+(r===4?2:r===3?1:0));gainItem(it,true);return{kind:'gear',r,it,label:it.name,col:RAR[r].c};}
 if(type==='egg'){let b=wpick(GACHA.egg.rates);if(force!=null)b=Math.max(b,force);const gs=GROUNDS.map((g,i)=>[g,i]).filter(([g])=>g.lv<=P.lv+5&&g.lv>=P.lv-20);const[g,gi]=gs.length?pick(gs):[GROUNDS[0],0];
  const boss=b===3&&g.boss,mi=boss?-1:rmi(gi),k=gi+'_'+mi,e=eggAdd(k,1,Math.min(b,2)+(boss?1:0));return{kind:'egg',r:b,gi,mi,e,label:`${monOf(gi,mi)[0]}의 알`,col:GRC[b]};}
 if(type==='map'){const k=wpick(mapRates()),M=DMAPS[k],dup=P.dmaps[k];if(dup)P.dia+=15;else P.dmaps[k]=1;const r=M.price>=8000?3:M.price>=6000?2:M.price>=4000?1:0;return{kind:'map',r,k,dup,label:M.n+(dup?' (중복 → 💎15)':''),col:GRC[r]};}}
function gachaRoll(type,n){const G1=GACHA[type],cost=n===10?G1.c10:G1.c1,free=n===1&&type==='gear'&&P.freeDay!==dayKey();
 if(!free&&(P.dia||0)<cost){openShop('charge');toast('💎 다이아가 부족하다');return;}if(free)P.freeDay=dayKey();else P.dia-=cost;
 const res=[];for(let i=0;i<n;i++)res.push(gachaOne(type));
 if(n===10&&!res.some(x=>x.r>=2)){res.pop();res.push(gachaOne(type,2));}
 P.gstat=P.gstat||{};P.gstat[type]=(P.gstat[type]||0)+n;sfx('gacha');saveGame(false);showPulls(type,res);}
function showPulls(type,res){const best=Math.max(...res.map(x=>x.r));setTimeout(()=>sfx(best>=3?'gacha_legend':best>=2?'gacha_rare':'pickup'),450);
 const card=(x,i)=>{const ic=x.kind==='gear'?icv({t:'gear',it:x.it},64):x.kind==='egg'?icv({t:'egg',gi:x.gi,mi:x.mi},64):(IMG['dmap_'+x.k]?`<img src="${IMG['dmap_'+x.k].src}" style="width:64px;height:64px">`:`<span style="font-size:44px">${DMAPS[x.k].ic}</span>`);
  const sub=x.kind==='gear'?`[${RAR[x.r].n}] ${GEARK[x.it.k][1]}`:x.kind==='egg'?`${GRN[x.r]} 알 ${eggTag(x.e)}<br><span style="font-size:9.5px">${eggStat(x.e)}</span>`:`${['일반','고급','희귀','영웅'][x.r]} 지도`;
  return`<div class="gcard r${x.r}" style="--c:${x.col};animation-delay:${i*0.12}s"><div class="gin">${ic}<b style="color:${x.col}">${x.label}</b><span>${sub}</span></div></div>`;};
 openModal(`<h2>${GACHA[type].n} 결과 <span class="gold" style="float:right">💎 ${fmt(P.dia||0)}</span></h2><div class="gres">${res.map(card).join('')}</div>
 <div style="display:flex;gap:6px;margin-top:8px"><button class="btn" style="flex:1" onclick="gachaRoll('${type}',1)">1회 더 (💎${GACHA[type].c1})</button><button class="btn" style="flex:1" onclick="gachaRoll('${type}',10)">10회 더 (💎${GACHA[type].c10})</button></div>
 <button class="btn w g" onclick="openShop('gacha')">뽑기 화면으로</button>`,true);paintIcons($('#modal'));}
const dayKey=()=>new Date().toISOString().slice(0,10);
const PACKS=[{d:60,w:1200},{d:330,w:5900,b:'+10%'},{d:700,w:11000,b:'+17%'},{d:1500,w:22000,b:'+25%'},{d:4000,w:55000,b:'인기',hot:1},{d:8500,w:99000,b:'최고 효율'}];
const DSHOP=[
 {id:'bag',n:'🎒 가방 확장 +20칸',c:80,can:()=>P.cap<300,f:()=>{P.cap+=20;}},
 {id:'pot',n:'🧪 물약(중) 10개',c:30,f:()=>{P.pot.p2+=10;}},
 {id:'pot3',n:'🧪 물약(대) 10개',c:60,f:()=>{P.pot.p3+=10;}},
 {id:'exp',n:'⚡ 경험치 2배 (30분)',c:60,f:()=>{P.expBoost=Math.max(P.expBoost||0,Date.now())+1800000;}},
 {id:'core',n:'💠 내 레벨대 코어 1개',c:120,f:()=>{const gs=GROUNDS.map((g,i)=>i).filter(i=>GROUNDS[i].lv<=P.lv);const gi=gs.length?gs[gs.length-1]:0;P.cores[gi]=(P.cores[gi]||0)+1;}},
 {id:'sp',n:'🌟 스킬 초기화 (포인트 반환)',c:100,f:()=>{let n=0;for(const k in P.sk){n+=P.sk[k];}P.sp+=n-1;P.sk={spin:1};P.slots=['spin',null,null,null];}},
];
const SHOPT={v:'gacha'};
function openShop(tab){const atG=curBld&&curBld.type==='gacha';if(tab)SHOPT.v=tab;if(SHOPT.v==='gacha'&&!atG)SHOPT.v='charge';const T=SHOPT.v,boost=(P.expBoost||0)>Date.now();
 const tabs=[...(atG?[['gacha','🎰 소환']]:[]),['charge','💎 충전'],['dshop','🛍️ 다이아 상점']].map(([k,n])=>`<button class="tab ${T===k?'on':''}" onclick="openShop('${k}')">${n}</button>`).join('');
 let body='';
 if(T==='gacha')body=Object.entries(GACHA).map(([k,G1])=>{const free=k==='gear'&&P.freeDay!==dayKey();const rt=k==='map'?mapRates().map(([m,w])=>[DMAPS[m].n,w]):G1.rates.map(([v,w])=>[k==='gear'?RAR[v].n:GRN[v],w]);const tot=rt.reduce((a,x)=>a+x[1],0);
  return`<div class="gban gb-${k}"><div style="flex:1"><b style="font-size:16px">${G1.n}</b><div style="font-size:12px;margin:3px 0">${G1.d}</div>
  <div class="grate"><b style="font-size:11px">📊 확률 공개</b>${rt.map(([n,w])=>`<div class="gr"><span>${n}</span><i><b style="width:${Math.max(2,w/tot*100)}%"></b></i><span>${(w/tot*100).toFixed(k==='map'?2:1)}%</span></div>`).join('')}<div class="mut" style="font-size:10.5px">10회 뽑기 시 ${k==='gear'?'희귀':'정예'} 이상 1개 보장${k==='map'?' · 중복 시 💎15 환급':''}</div></div></div>
  <div style="display:flex;flex-direction:column;gap:4px;min-width:130px"><button class="btn s" onclick="gachaRoll('${k}',1)">${free?'🎁 오늘 무료 1회':`1회 💎${G1.c1}`}</button><button class="btn s" onclick="gachaRoll('${k}',10)">10회 💎${G1.c10}</button></div></div>`;}).join('');
 if(T==='charge')body=`${atG?'':'<p class="d">🔮 알·장비·지도 소환은 각 마을의 「소환의 집」에서 할 수 있다.</p>'}<p class="d">퀘스트·균열·출석으로도 얻는다.</p><div class="packs">${PACKS.map((p,i)=>`<div class="pack ${p.hot?'hot':''}"><div style="font-size:30px">💎</div><b style="font-size:17px">${fmt(p.d)}</b>${p.b?`<span class="pb">${p.b}</span>`:''}<button class="btn s" onclick="buyPack(${i})">₩${fmt(p.w)}</button></div>`).join('')}
  <div class="pack"><div style="font-size:30px">📅</div><b>월정액</b><span style="font-size:11px">30일간 매일 💎40</span>${P.pass&&P.pass>Date.now()?`<span class="pb">${Math.ceil((P.pass-Date.now())/864e5)}일 남음</span>`:''}<button class="btn s" onclick="buyPack(-1)">₩5,500</button></div></div>
  <p class="dn" style="font-size:13px;margin-top:8px;text-align:center">🔧 결제 기능은 준비 중입니다</p>`;
 if(T==='dshop')body=`${boost?`<p class="up">⚡ 경험치 2배 적용 중 — ${Math.ceil(((P.expBoost)-Date.now())/60000)}분 남음</p>`:''}<div class="mgrid">${DSHOP.map(it=>`<div class="mrow"><div style="flex:1"><b style="font-size:12.5px">${it.n}</b></div><button class="btn s" ${(P.dia||0)<it.c||(it.can&&!it.can())?'disabled':''} onclick="buyD('${it.id}')">💎${it.c}</button></div>`).join('')}</div>`;
 openModal(`<h2>${atG?'🔮 소환의 집':'💎 상점'} <span class="gold" style="float:right">💎 ${fmt(P.dia||0)} · 💰 ${fmt(P.gold)}G</span></h2><div class="tabs">${tabs}</div>${body}<button class="btn w g" onclick="closeModal()">닫기 (Y)</button>`,true);}
function buyPack(i){toast('💎 결제 기능은 준비 중입니다');sfx('error');return;const p=i<0?{d:0,w:5500}:PACKS[i];
 openModal(`<h2>💳 결제 확인</h2><p style="font-size:14px">${i<0?'월정액 (30일간 매일 💎40)':`💎 ${fmt(p.d)}`} — <b>₩${fmt(p.w)}</b></p><p class="mut" style="font-size:12px">테스트 모드: 실제 결제는 일어나지 않고 바로 지급됩니다.</p>
 <button class="btn w" onclick="payOK(${i})">결제하기</button><button class="btn w g" onclick="openShop('charge')">취소</button>`);}
function payOK(i){if(i<0){P.pass=Math.max(P.pass||0,Date.now())+30*864e5;P.passDay=null;dailyLogin();toast('📅 월정액 시작!');}else{addDia(PACKS[i].d);toast(`💎 ${fmt(PACKS[i].d)} 충전 완료`);}sfx('buy');saveGame(false);openShop('charge');}
function buyD(id){const it=DSHOP.find(x=>x.id===id);if(!it||(P.dia||0)<it.c||(it.can&&!it.can()))return;P.dia-=it.c;it.f();sfx('buy');toast(`${it.n} 구입`);openShop('dshop');}
function dailyLogin(){const d=dayKey();if(P.att&&P.att.last!==d||!P.att)setTimeout(()=>{if(!$('#modal').classList.contains('on')&&!CS.on&&!$('#cs'))openEvents('a');else toast('📅 오늘의 출석 보상을 받자 — 메뉴의 📅');},4200);if(P.loginDay!==d){P.loginDay=d;addDia(20,'매일 접속');setTimeout(()=>toast('🎁 매일 접속 보상 💎20 · 장비 뽑기 무료 1회'),1200);}
 if(P.pass&&P.pass>Date.now()&&P.passDay!==d){P.passDay=d;addDia(40,'월정액');}}
