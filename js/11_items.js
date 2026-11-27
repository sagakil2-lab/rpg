'use strict';
// =====================================================================
//  장비 아이템 (개체마다 능력치·등급·속성이 다름)
// =====================================================================
const ELEM={none:{n:'',c:null,ic:''},fire:{n:'화염',c:'#ff6a2a',ic:'🔥'},ice:{n:'냉기',c:'#7fd8ff',ic:'❄️'},bolt:{n:'번개',c:'#ffe14a',ic:'⚡'},poison:{n:'맹독',c:'#8dff5a',ic:'☠️'},holy:{n:'신성',c:'#fff2a8',ic:'✨'},dark:{n:'암흑',c:'#b47aff',ic:'🌑'}};
const RAR=[{n:'일반',c:'#c8c0b0',m:[0.85,1.02],p:0.55},{n:'고급',c:'#6fb8ff',m:[1.0,1.12],p:0.28},{n:'희귀',c:'#c77dff',m:[1.1,1.25],p:0.13},{n:'영웅',c:'#ffa53a',m:[1.22,1.4],p:0.04},{n:'전설',c:'#ff3a3a',m:[1.38,1.6],p:0}];
const ACCN={r:['구리 반지','사파이어 은반지','루비 금반지','자수정 흑반지'],n:['늑대 이빨 목걸이','에메랄드 부적','태양 메달','용의 눈 펜던트']},ACCI={r:[1,2,5,7],n:[0,3,4,6]};
const BNAMEK={w:WNAME,a:ANAME,h:HNAME,b:BNAME,r:ACCN.r,n:ACCN.n};const EQK=['w','a','h','b','r','n'];
let UID=1;
// 특수 장비 10종 (같은 칸, 다른 성격) — 특수 재료로 제작하거나 드롭
const TPRE=['낡은','철','은빛','미스릴','흑철','용'];
const VARS={
 dagger:{k:'w',n:'쌍단검',atk:0.85,add:t=>({crit:10+t*2}),mat:0,d:'공격은 낮지만 치명타가 높다'},
 mace:{k:'w',n:'철퇴',atk:1.1,add:t=>({hp:15+t*12}),mat:1,d:'묵직하고 체력이 오른다'},
 spear:{k:'w',n:'장창',atk:1.05,add:t=>({crit:4,spd:3}),mat:2,d:'균형 잡힌 긴 무기'},
 staff:{k:'w',n:'마법 지팡이',atk:0.9,add:t=>({eb:15+t*3}),mat:3,el:true,d:'항상 속성이 붙고 속성 피해가 크다'},
 axe:{k:'w',n:'전투 도끼',atk:1.25,add:t=>({spd:-4}),mat:5,d:'가장 강한 일격, 조금 느려진다'},
 robe:{k:'a',n:'마법사 로브',def:0.7,add:t=>({hp:20+t*20,res:8}),mat:4,el:true,d:'방어는 낮고 체력·저항이 높다'},
 plate:{k:'a',n:'판금 갑옷',def:1.4,add:t=>({spd:-6}),mat:9,d:'최고의 방어, 무겁다'},
 circlet:{k:'h',n:'현자의 서클릿',def:0.5,add:t=>({hp:10+t*10,res:10}),mat:6,el:true,d:'가볍고 속성 저항이 높다'},
 hood:{k:'h',n:'그림자 두건',def:0.6,add:t=>({crit:5+t,spd:3}),mat:7,d:'치명타와 이동속도'},
 sandal:{k:'b',n:'바람의 샌들',def:0.5,add:t=>({spd:8+t*2}),mat:8,d:'아주 빠르다'},
 rapier:{k:'w',n:'레이피어',atk:0.95,add:t=>({crit:12+t*2,spd:4}),mat:0,d:'빠르고 치명타가 높다'},
 katana:{k:'w',n:'카타나',atk:1.08,add:t=>({crit:8+t}),mat:4,d:'날카롭고 균형 잡힌 곡도'},
 greatsword:{k:'w',n:'대검',atk:1.35,add:t=>({hp:10+t*10,spd:-6}),mat:6,d:'강력하지만 무겁다'},
 hammer:{k:'w',n:'전투 망치',atk:1.3,add:t=>({hp:20+t*15,spd:-5}),mat:5,d:'묵직한 일격, 체력 증가'},
 halberd:{k:'w',n:'할버드',atk:1.15,add:t=>({crit:5,hp:t*8}),mat:8,d:'창과 도끼의 장점'},
 scythe:{k:'w',n:'사신의 낫',atk:1.2,fel:'dark',add:t=>({crit:10+t*2}),mat:7,d:'항상 암흑 속성'},
 crystal:{k:'w',n:'수정검',atk:1.05,fel:'ice',add:t=>({eb:15+t*3}),mat:8,d:'항상 냉기 속성'},
 flame:{k:'w',n:'화염검',atk:1.05,fel:'fire',add:t=>({eb:15+t*3}),mat:9,d:'항상 화염 속성'},
 bone:{k:'w',n:'뼈 몽둥이',atk:1.1,add:t=>({hp:15+t*10}),mat:7,d:'야만적인 몽둥이'},
 scepter:{k:'w',n:'성홀',atk:0.95,fel:'holy',ranged:'bolt',add:t=>({eb:18+t*3,hp:10+t*8}),mat:6,d:'신성 마법탄 (원거리)'},
 wand:{k:'w',n:'숲의 완드',atk:0.9,fel:'poison',ranged:'bolt',add:t=>({eb:20+t*3}),mat:1,d:'맹독 마법탄 (원거리)'},
 cursed:{k:'w',n:'저주받은 검',atk:1.22,fel:'dark',add:t=>({crit:6+t,eb:10}),mat:7,d:'강하지만 저주받았다'},
 bow:{k:'w',n:'사냥 활',atk:0.95,add:t=>({crit:6+t}),mat:2,ranged:'arrow',d:'멀리서 화살을 쏜다 (원거리)'},
};
const rangedOf=()=>{const w=eqItem('w');return w&&w.v?(VARS[w.v].ranged||(w.v==='staff'?'bolt':null)):null;};
function mkBowImg(){const cv=document.createElement('canvas');cv.width=320;cv.height=96;const c=cv.getContext('2d');c.lineCap='round';
 c.strokeStyle='#2a180c';c.lineWidth=16;c.beginPath();c.moveTo(14,80);c.quadraticCurveTo(160,-40,306,80);c.stroke();c.strokeStyle='#a06a34';c.lineWidth=10;c.stroke();c.strokeStyle='#d8a060';c.lineWidth=3;c.beginPath();c.moveTo(30,68);c.quadraticCurveTo(160,-24,290,68);c.stroke();
 c.fillStyle='#5a3a1a';c.fillRect(146,10,28,22);c.strokeStyle='#eee';c.lineWidth=2.5;c.beginPath();c.moveTo(14,80);c.lineTo(306,80);c.stroke();const im=new Image();im.src=cv.toDataURL();im.onload=()=>IMG.var_bow=im;}
const varsOf=k=>Object.keys(VARS).filter(v=>VARS[v].k===k);

function makeItem(k,t,luck=0,rf,vv){const v=vv!==undefined?vv:(t>0&&R()<0.25?pick(varsOf(k)):null);let r=0;if(rf!=null)r=rf;else{let x=R()*(1-luck*0.5);for(let i=RAR.length-1;i>=0;i--){const cum=RAR.slice(i).reduce((a,q)=>a+q.p,0);if(x<cum*(1+luck)){r=i;break;}}}
 const q=RAR[r],mul=rnd(q.m[0],q.m[1]);const elKeys=Object.keys(ELEM).filter(e=>e!=='none');
 const op=r>=2;const el=!op||t<=0?'none':v&&VARS[v].fel?VARS[v].fel:((v&&VARS[v].el)||(k==='w'?R()<0.3+r*0.15:R()<0.18+r*0.12))?pick(elKeys):'none';
 const it={uid:UID++,k,t,r,el,atk:0,def:0,hp:0,spd:0,crit:0,eb:0,res:0};
 if(k==='w'){it.atk=Math.max(1,Math.round(WATK[t]*mul+ri(0,r)));if(op)it.crit=ri(1,2+r*2);if(el!=='none')it.eb=ri(6,10)+r*4;}
 if(k==='a'){it.def=Math.round(ADEF[t]*mul+(r?ri(0,r):0));if(op)it.hp=ri(4,10)*(t+1);if(el!=='none')it.res=ri(3,6)+r*2;}
 if(k==='h'){it.def=Math.round(HDEF[t]*mul);it.hp=Math.round(HHP[t]*mul);if(el!=='none')it.res=ri(2,4)+r*2;}
 if(k==='b'){it.def=Math.round(BDEF[t]*mul);it.spd=BSPD[t]+(op?ri(0,r*2):0);if(el!=='none')it.res=ri(2,4)+r;}
 if(k==='r'){t=Math.min(t,3);it.t=t;it.ai=ACCI.r[t];it.atk=Math.round((3+t*6)*mul);if(op)it.crit=ri(1,3)+t*2+r;if(el!=='none')it.eb=ri(4,8)+r*2;}
 if(k==='n'){t=Math.min(t,3);it.t=t;it.ai=ACCI.n[t];it.hp=Math.round((20+t*45)*mul);it.def=1+t*2+r;if(op)it.res=ri(2,5)+t*3;}
 if(v){const V=VARS[v];it.v=v;if(V.atk)it.atk=Math.max(1,Math.round(it.atk*V.atk));if(V.def!=null)it.def=Math.max(0,Math.round(it.def*V.def));const ad=op?V.add(t):{};for(const f in ad)it[f]=(it[f]||0)+ad[f];if(el!=='none'&&k!=='w'&&!it.res)it.res=ri(3,6);if(el!=='none'&&k==='w'&&!it.eb)it.eb=ri(6,10);}
 it.name=(el!=='none'&&k!=='n'?ELEM[el].n+'의 ':'')+(v?TPRE[t]+' '+VARS[v].n:BNAMEK[k][t]);return it;}
function plusItem(it,p){if(!p||p<1)return it;const f=1+p*0.22;for(const s of ['atk','def','hp'])if(it[s])it[s]=Math.round(it[s]*f);if(it.eb)it.eb=Math.round(it.eb*(1+p*0.1));it.p=p;it.name=it.name+' +'+p;return it;}
const ENH_RATE=[0,.95,.9,.85,.8,.75,.65,.58,.5,.43,.36,.3,.25,.2,.15,.1],ENH_BRK=[0,0,0,0,0,0,0,0,.03,.05,.07,.1,.12,.15,.18,.22],ESCN=['','하급','중급','상급'],ESCC=['','#9ad0ff','#c77dff','#ffa53a'];
const escG=n=>n<=5?1:n<=10?2:3,enhGold=it=>{const n=(it.p||0)+1;return Math.round(60*(it.t+1)*Math.pow(n,1.6));},escCost=g=>[0,300+P.lv*10,2000+P.lv*40,10000+P.lv*150][g];
const escIc=(g,sz)=>IMG['itm_esc'+g]?`<img src="${IMG['itm_esc'+g].src}" style="width:${sz}px;height:${sz}px;vertical-align:middle">`:'📜';
function setPlus(it,n){const p0=it.p||0;if(!it.base){const f=1+p0*0.22;it.base={atk:it.atk/f,def:it.def/f,hp:it.hp/f,eb:it.eb/(1+p0*0.1)};}const f=1+n*0.22;for(const s of['atk','def','hp'])if(it.base[s])it[s]=Math.round(it.base[s]*f);if(it.base.eb)it.eb=Math.round(it.base.eb*(1+n*0.1));it.p=n;it.name=it.name.replace(/ \+\d+$/,'')+(n?' +'+n:'');}
function buyEsc(g,n){const c=escCost(g)*n;if(P.gold<c){toast('골드 부족');return;}P.gold-=c;P.esc=P.esc||{};P.esc[g]=(P.esc[g]||0)+n;sfx('buy');toast(`${ESCN[g]} 강화 주문서 +${n}`);openBuilding(curBld);}
function addEsc(g,n,src){P.esc=P.esc||{};P.esc[g]=(P.esc[g]||0)+n;if(src)floatT(P.x,P.y-60,`📜 ${ESCN[g]} 강화 주문서 +${n}`,ESCC[g],12,1.4);}
function openEnhance(uid,res){const it=itemById(uid);if(!it){openEquip();return;}ICACHE[it.uid]=it;P.esc=P.esc||{};const p=it.p||0,n=p+1,g=escG(n),max=p>=15;const rate=ENH_RATE[n]||0,brk=ENH_BRK[n]||0,gold=enhGold(it),have=P.esc[g]||0,ok=!max&&have>0&&P.gold>=gold;
 openModal(`<h2>⚒️ 장비 강화</h2><div class="skdh">${icv({t:'gear',it},64)}<div><b style="font-size:15px;color:${RAR[it.r].c}">${it.name}</b><div class="mut">${GEARK[it.k][1]} · 현재 +${p} / +15</div></div></div>
 ${res?`<div class="news" style="font-size:14px;text-align:center;${res.c}">${res.t}</div>`:''}
 ${max?'<p class="gold" style="text-align:center">최대 강화 (+15)</p>':`<div class="eqst"><div>다음<b>+${n}</b></div><div>성공<b style="color:#7dff9a">${Math.round(rate*100)}%</b></div><div>파괴<b style="color:${brk?'#ff6a5a':'#9ab'}">${Math.round(brk*100)}%</b></div><div>실패(유지)<b>${Math.round((1-rate-brk)*100)}%</b></div></div>
 <p class="d">필요: ${escIc(g,22)} <b style="color:${ESCC[g]}">${ESCN[g]} 강화 주문서</b> 1장 (보유 ${have}) · 💰 ${fmt(gold)}G · 강화 1단계마다 기본 능력치 +22%</p>
 <button class="btn w" ${ok?'':'disabled'} onclick="doEnhance(${it.uid})">⚒️ +${n} 강화하기</button>${have?'':'<p class="dn" style="font-size:12px">주문서가 없다 — 여관에서 사거나, 몬스터·출석·미션·시즌 패스에서 얻는다</p>'}`}
 <div class="mut" style="font-size:11px;margin-top:6px">+1~5 하급 · +6~10 중급 · +11~15 상급 주문서 · +8부터 실패 시 파괴될 수 있다 · 보유 주문서 하급 ${P.esc[1]||0} / 중급 ${P.esc[2]||0} / 상급 ${P.esc[3]||0}</div>
 <button class="btn w g" onclick="EQSEL.v=${it.uid};openEquip()">장비창으로</button>`);}
function doEnhance(uid){const it=itemById(uid);if(!it)return;const p=it.p||0,n=p+1;if(n>15)return;const g=escG(n),gold=enhGold(it);P.esc=P.esc||{};if(!(P.esc[g]>0)||P.gold<gold)return;P.esc[g]--;P.gold-=gold;wkEv('enh');
 const x=R();let res;if(x<ENH_RATE[n]){setPlus(it,n);syncEq();sfx(n>=10?'gacha_rare':'levelup');burst(P.x,P.y-30,30,'#ffd23f',200);fx('fx_enh_ok',P.x,P.y-30,2.2,0.9)||fx('fx_levelup',P.x,P.y-30,2,0.8);res={t:`✨ 강화 성공! +${n}`,c:'color:#ffd23f;border-color:#ffd23f'};news(`⚒️ ${it.name} 강화 성공`,'me');}
 else if(x<ENH_RATE[n]+ENH_BRK[n]){const k=it.k,eq=P.eq[k]===it.uid;P.items=P.items.filter(z=>z!==it);if(P.stash)P.stash.items=P.stash.items.filter(z=>z!==it);if(eq){P.eq[k]=null;const alt=P.items.filter(z=>z.k===k).sort((a,b)=>(b.atk+b.def+b.hp)-(a.atk+a.def+a.hp))[0];if(alt)P.eq[k]=alt.uid;else if(k==='w'||k==='a'){const nb=makeItem(k,0,0,0);P.items.push(nb);P.eq[k]=nb.uid;}}syncEq();sfx('defeat');cam.shake=10;fx('fx_enh_break',P.x,P.y-30,2.2,0.9);news(`💥 ${it.name} 강화 실패 — 파괴되었다`,'me');openModal(`<h2>💥 파괴</h2><p class="d" style="font-size:14px">${it.name}이(가) 강화에 실패해 부서졌다…</p><button class="btn w" onclick="openEquip()">장비창으로</button>`);return;}
 else{sfx('error');fx('fx_enh_fail',P.x,P.y-30,1.8,0.7);res={t:`강화 실패 — +${p} 유지 (주문서 소모)`,c:'color:#ff9a8a'};}
 openEnhance(uid,res);}
const plusOf=lv=>lv>32?Math.floor((lv-28)/12):0;
const ROTS={on:false},RW=()=>document.documentElement.clientWidth||screen.width,RH=()=>document.documentElement.clientHeight||screen.height;
try{Object.defineProperty(window,'innerWidth',{configurable:true,get(){return ROTS.on?RH():RW();}});Object.defineProperty(window,'innerHeight',{configurable:true,get(){return ROTS.on?RW():RH();}});}catch(e){}
const LX=e=>ROTS.on?e.clientY:e.clientX,LY=e=>ROTS.on?RW()-e.clientX:e.clientY;
function lrect(el){const r=el.getBoundingClientRect();if(!ROTS.on)return r;const L=r.top,T=RW()-r.right;return{left:L,top:T,width:r.height,height:r.width,right:L+r.height,bottom:T+r.width};}
function rotPref(){try{return localStorage.getItem('arpg_rot')!=='0';}catch(e){return true;}}
function applyRot(noResize){const coarse=matchMedia('(pointer:coarse)').matches,want=coarse&&rotPref()&&RH()>RW()*1.05;const b=document.body,st=b.style;
 if(want){st.position='fixed';st.left='0';st.top='0';st.width=RH()+'px';st.height=RW()+'px';st.transformOrigin='0 0';st.transform=`translateX(${RW()}px) rotate(90deg)`;}
 else if(ROTS.on){st.position='';st.left='';st.top='';st.width='';st.height='';st.transformOrigin='';st.transform='';}
 const ch=ROTS.on!==want;ROTS.on=want;const W=innerWidth,H=innerHeight,de=document.documentElement;de.classList.toggle('rot',want);de.classList.toggle('narrow',W<=560);de.classList.toggle('land',W>=H);de.style.setProperty('--vw',W/100+'px');de.style.setProperty('--vh',H/100+'px');
 if(ch&&!noResize&&typeof resize==='function')resize();}
addEventListener('orientationchange',()=>setTimeout(()=>{applyRot();try{layoutHud();}catch(e){}},250));
addEventListener('pointerdown',function fsTry(){removeEventListener('pointerdown',fsTry,true);if(!matchMedia('(pointer:coarse)').matches||!rotPref())return;try{const de=document.documentElement,rq=de.requestFullscreen||de.webkitRequestFullscreen;if(rq){const p=rq.call(de,{navigationUI:'hide'});if(p&&p.then)p.then(()=>{try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{});}catch(e){}}).catch(()=>{});}}catch(e){}},true);
const itemById=u=>P.items.find(i=>i.uid===u)||(P.stash&&P.stash.items.find(i=>i.uid===u));const inStash=u=>!!(P.stash&&P.stash.items.some(i=>i.uid===u));
const eqItem=k=>P.eq[k]!=null?itemById(P.eq[k]):null;
const eqv=(k,f)=>{const i=eqItem(k);return i?i[f]:0;};
const eqSum=f=>EQK.reduce((a,k)=>a+eqv(k,f),0);
const eqGlow=()=>{const i=eqItem('w');if(!i)return null;if(i.r>=4)return rainbow();if(i.el!=='none')return ELEM[i.el].c;return i.r>=2?RAR[i.r].c:null;};
const rainbow=()=>['#ff3a3a','#ffd23f','#ff6af0','#ff3a3a'][Math.floor(performance.now()/400)%3];
const topRar=()=>Math.max(-1,...EQK.map(k=>eqItem(k)?eqItem(k).r:-1));
function syncEq(){for(const k of ['w','a','h','b']){const i=eqItem(k);P[k]=i?i.t:0;}}
function itemStats(it){const L=[];if(it.atk)L.push(`공격 +${it.atk}`);if(it.def)L.push(`방어 +${it.def}`);if(it.hp)L.push(`HP +${it.hp}`);if(it.spd)L.push(`이동 ${it.spd>0?'+':''}${it.spd}%`);
 if(it.crit)L.push(`치명타 +${it.crit}%`);if(it.eb&&it.el!=='none')L.push(`<span style="color:${ELEM[it.el].c}">${ELEM[it.el].ic}${ELEM[it.el].n} 추가피해 +${it.eb}%</span>`);
 if(it.res&&it.el==='none'&&it.k==='n')L.push(`속성 피해 -${it.res}%`);if(it.res&&it.el!=='none')L.push(`<span style="color:${ELEM[it.el].c}">${ELEM[it.el].ic}${ELEM[it.el].n}의 가호 피해 -${it.res}%</span>`);return L.join(' · ');}
const GCV=new Map();
function glowed(im,col){const k=(im.src||'').slice(-40)+col;let cv=GCV.get(k);if(cv)return cv;cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const x=cv.getContext('2d');
 x.drawImage(im,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,cv.width,cv.height);GCV.set(k,cv);return cv;}
function gainItem(it,silent){P.items.push(it);if(!silent&&it.r>=2){sfx(it.r>=3?'levelup':'chest');floatT(P.x,P.y-84,`✦ ${RAR[it.r].n} 장비! ✦`,RAR[it.r].c,it.r>=3?20:16,2);}if(!silent){floatT(P.x,P.y-60,`+ ${it.name}`,RAR[it.r].c,13,1.6);news(`🎁 [${RAR[it.r].n}] ${it.name} 획득 — ${itemStats(it).replace(/<[^>]+>/g,'')}`,'me');}
 const k=it.k,cur=eqItem(k),score=x=>x?(x.atk*3+x.def*2+x.hp*0.3+x.spd+x.crit+x.eb*0.5+x.res):-1;
 if(LVREQ[it.t]<=P.lv&&!cur&&score(it)>score(cur)){P.eq[k]=it.uid;syncEq();if(!silent)toast(`${it.name} 장착!`);}}
