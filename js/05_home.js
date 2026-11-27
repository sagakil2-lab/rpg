'use strict';
// =====================================================================
//  내 집 꾸미기
// =====================================================================
const FUR=[['bed','침대',2,2,1200,'🛏️','#8a4a3a'],['rug','양탄자',3,2,500,'🟥','#9a3a3a',1],['fire','벽난로',2,1,2000,'🔥','#6a5a4a'],['table','식탁',2,1,800,'🍽️','#8a6a3a'],['chair','의자',1,1,150,'🪑','#8a6a3a'],['lamp','등불',1,1,400,'🕯️','#c8a040'],
 ['shelf','책장',2,1,1000,'📚','#6a4a2a'],['desk','책상',2,1,900,'📜','#7a5a3a'],['globe','지구본',1,1,1500,'🌍','#4a7ab8'],['rack','무기 거치대',2,1,1800,'⚔️','#5a5a6a'],['armor','갑옷 스탠드',1,1,2200,'🛡️','#7a7a8a'],['dummy','훈련 인형',1,1,1200,'🎯','#b8a070'],
 ['plant','화분',1,1,250,'🪴','#4a8a3a'],['tree','실내 나무',1,1,900,'🌳','#3a7a2a'],['aquarium','수조',2,1,3000,'🐠','#3a8ac8'],['chest','보물 상자',1,1,700,'🧰','#8a5a2a'],['scale','황금 저울',1,1,2500,'⚖️','#d8b040'],['painting','그림 액자',1,1,800,'🖼️','#8a6a4a'],
 ['statue','여신상',1,1,6000,'🗽','#d8d0c0'],['barrel','술통',1,1,300,'🛢️','#7a4a2a'],['candle','촛대',1,1,300,'🕯️','#e8c070'],['sofa','소파',2,1,1400,'🛋️','#6a3a5a']].map(([id,n,w,h,c,ic,col,floor])=>({id,n,w,h,c,ic,col,floor:!!floor}));
const HSET={cozy:{n:'아늑한 휴식',need:['bed','rug','fire','table'],d:'최대 HP +6% · HP 자연 회복'},scholar:{n:'학자의 서재',need:['shelf','desk','globe','lamp'],d:'획득 경험치 +6%'},warrior:{n:'전사의 방',need:['rack','armor','dummy'],d:'공격력 +5%'},
 nature:{n:'숲속 정원',need:['plant','tree','aquarium'],d:'이동 속도 +5%'},merchant:{n:'상인의 금고',need:['chest','scale','painting'],d:'골드 획득 +8%'}};
function homeInit(){P.home=P.home||{own:{},placed:[],tro:{},fx:{}};return P.home;}
const HF=k=>!!(P&&P.home&&P.home.fx&&P.home.fx[k]);
const troB=()=>{const n=P&&P.home&&P.home.fx?P.home.fx.tro||0:0;return n>=10?0.15:n>=6?0.1:n>=3?0.05:0;};
function furOf(id){if(id[0]==='t'&&id[1]==='r'&&!isNaN(+id.slice(2))){const gi=+id.slice(2);return{id,n:GROUNDS[gi].boss[0]+' 박제',w:1,h:1,ic:'🏆',col:'#c8a040',tro:gi};}return FUR.find(f=>f.id===id);}
function homeFx(){const H=homeInit(),ids=H.placed.map(p=>p.id);H.fx={};for(const k in HSET)if(HSET[k].need.every(n=>ids.includes(n)))H.fx[k]=1;H.fx.tro=ids.filter(i=>furOf(i)&&furOf(i).tro!=null).length;}
function genHome(){const W=20,H=15,m=newMap('HOME','내 집','town',W,H,'town');m.ti=0;m.home=true;for(let y=0;y<H;y++)for(let x=0;x<W;x++)setT(m,x,y,(x>=1&&x<=18&&y>=3&&y<=13)||((x===9||x===10)&&y===14)?TL.FLOOR:TL.WALL);
 m.exits.push({x:9,y:14,w:2,h:1,to:'T0',side:'S'});m.entries.T0={x:10*TS,y:12*TS+20};m.entries.start=m.entries.T0;m.roadTiles=[[9,10]];m.solid=new Set();return m;}
function homeSolid(m){m=m||CUR;if(!m||!m.home)return;m.solid=new Set();for(const p of homeInit().placed){const F=furOf(p.id);if(!F||F.floor)continue;for(let y=0;y<F.h;y++)for(let x=0;x<F.w;x++)m.solid.add(p.x+x+(p.y+y)*m.w);}homeFx();}
function homeArt(c,m){const fl=IMG.home_floor,wl=IMG.home_wall;
 for(let y=3;y<=13;y++)for(let x=1;x<=18;x++){const px=x*TS,py=y*TS;if(fl){const q=fl.width/4;c.drawImage(fl,(x%4)*q,(y%4)*q,q,q,px,py,TS,TS);continue;}for(let k=0;k<4;k++){const h=((x*7+y*13+k*5)%5);c.fillStyle=['#a8784a','#9e6e42','#b08250','#a37346','#96683e'][h];c.fillRect(px,py+k*8,TS,8);c.fillStyle='rgba(50,25,8,.45)';c.fillRect(px,py+k*8+7,TS,1);if((x*3+y*5+k*7)%4===0)c.fillRect(px+((x+k)%3)*10+4,py+k*8,1,7);}}
 for(const x of[9,10]){c.fillStyle='#8a5a32';c.fillRect(x*TS,14*TS,TS,TS);}c.fillStyle='#7a2a2a';c.fillRect(9*TS+4,13*TS+12,TS*2-8,18);
 for(let x=1;x<=18;x++){const px=x*TS;if(wl){c.drawImage(wl,px,0,TS,TS*3);continue;}const g=c.createLinearGradient(0,0,0,TS*3);g.addColorStop(0,'#5a3a2a');g.addColorStop(1,'#d8b888');c.fillStyle=g;c.fillRect(px,0,TS,TS*3);c.fillStyle='rgba(120,60,40,.25)';for(let k=0;k<3;k++)c.fillRect(px+8+k*0,10+k*30,3,14);c.fillStyle='#6a4022';c.fillRect(px,TS*2.3,TS,TS*0.7);c.fillStyle='#3a2414';c.fillRect(px,TS*3-4,TS,4);}
 for(const wx of[4,15]){const px=wx*TS,py=TS*0.5;c.fillStyle='#3a2414';c.fillRect(px-4,py-4,TS*1.6+8,TS*1.3+8);const g=c.createLinearGradient(0,py,0,py+TS*1.3);g.addColorStop(0,'#bfe6ff');g.addColorStop(1,'#7ab0d8');c.fillStyle=g;c.fillRect(px,py,TS*1.6,TS*1.3);c.fillStyle='#3a2414';c.fillRect(px+TS*0.78,py,4,TS*1.3);c.fillRect(px,py+TS*0.62,TS*1.6,4);}
 c.fillStyle='#2a1a10';for(let y=0;y<15;y++){c.fillRect(0,y*TS,TS,TS);c.fillRect(19*TS,y*TS,TS,TS);}for(let x=0;x<20;x++)if(x!==9&&x!==10)c.fillRect(x*TS,14*TS,TS,TS);}
function drawFurImg(c,F,x,y,t,alpha){const px=x*TS,py=y*TS,w=F.w*TS,h=F.h*TS;c.globalAlpha=alpha==null?1:alpha;const im=IMG['fur_'+F.id];
 if(F.tro!=null){c.fillStyle='#5a4a3a';c.fillRect(px+4,py+h-12,w-8,12);c.fillStyle='#c8a040';c.fillRect(px+2,py+h-14,w-4,3);const mv=drawFur.mc[F.tro]||(drawFur.mc[F.tro]=monVis(F.tro,-1));drawMonAt(c,mv,px+w/2,py+h-12,48,t*0.6,'move',1);}
 else if(im){const ih=w*im.height/im.width*(F.floor?1:1);c.drawImage(im,px,F.floor?py:py+h-ih,w,F.floor?h:ih);}
 else{c.fillStyle=F.col;if(F.floor){c.globalAlpha*=0.85;rr(c,px+2,py+2,w-4,h-4,6);c.fill();c.strokeStyle='#e8c070';c.lineWidth=2;rr(c,px+6,py+6,w-12,h-12,4);c.stroke();}else{rr(c,px+2,py+h*0.25,w-4,h*0.75-2,6);c.fill();c.fillStyle='rgba(0,0,0,.25)';c.fillRect(px+2,py+h-6,w-4,4);c.font=`${Math.min(w,h)*0.55}px sans-serif`;c.textAlign='center';c.fillText(F.ic,px+w/2,py+h*0.72);}}
 c.globalAlpha=1;}
function drawFur(c,e,t){drawFurImg(c,e.F,e.f.x,e.f.y,t);if(HM.edit){c.strokeStyle='#ffd23f';c.setLineDash([4,3]);c.strokeRect(e.f.x*TS+1,e.f.y*TS+1,e.F.w*TS-2,e.F.h*TS-2);c.setLineDash([]);}}
drawFur.mc={};
function drawFurs(c,t){for(const f of homeInit().placed){const F=furOf(f.id);if(F&&F.floor)drawFur(c,{f,F},t);}}
const HM={place:null,edit:false,mx:0,my:0};
function homeFree(F,x,y,skip){if(x<1||y<3||x+F.w-1>18||y+F.h-1>13)return false;if(!F.floor){for(let yy=0;yy<F.h;yy++)for(let xx=0;xx<F.w;xx++){if((x+xx===9||x+xx===10)&&y+yy===13)return false;}}
 for(const p of homeInit().placed){if(p===skip)continue;const G2=furOf(p.id);if(!G2||G2.floor!==F.floor)continue;if(x<p.x+G2.w&&x+F.w>p.x&&y<p.y+G2.h&&y+F.h>p.y)return false;}
 if(!F.floor){const px0=x*TS,py0=y*TS;if(P.x>px0-8&&P.x<px0+F.w*TS+8&&P.y>py0&&P.y<py0+F.h*TS+14)return false;}return true;}
function homeGhost(c,t){if(!HM.place)return;const F=furOf(HM.place);const x=Math.floor(HM.mx/TS-(F.w-1)/2),y=Math.floor(HM.my/TS-(F.h-1)/2),ok=homeFree(F,x,y);drawFurImg(c,F,x,y,t,0.6);c.strokeStyle=ok?'#7dff7d':'#ff5a4a';c.lineWidth=2;c.strokeRect(x*TS,y*TS,F.w*TS,F.h*TS);}
function homeClick(wx,wy){const H=homeInit();if(HM.place){const F=furOf(HM.place),x=Math.floor(wx/TS-(F.w-1)/2),y=Math.floor(wy/TS-(F.h-1)/2);if(!homeFree(F,x,y)){toast('여기엔 놓을 수 없다');return true;}H.placed.push({id:HM.place,x,y});sfx('buy');homeSolid();
  const left=furLeft(HM.place);if(left<=0)HM.place=null;showSetToast();return true;}
 if(HM.edit){const tx=Math.floor(wx/TS),ty=Math.floor(wy/TS);for(let i=H.placed.length-1;i>=0;i--){const p=H.placed[i],F=furOf(p.id);if(tx>=p.x&&tx<p.x+F.w&&ty>=p.y&&ty<p.y+F.h){H.placed.splice(i,1);homeSolid();HM.place=p.id;toast(`${F.n} — 새 자리를 누르자`);return true;}}}return false;}
function furLeft(id){const H=homeInit(),F=furOf(id),own=F.tro!=null?(H.tro[F.tro]?1:0):(H.own[id]||0);return own-H.placed.filter(p=>p.id===id).length;}
function showSetToast(){const H=homeInit(),prev=homeBar.prev||{};for(const k in HSET)if(H.fx[k]&&!prev[k]){toast(`✨ 세트 완성: ${HSET[k].n} — ${HSET[k].d}`);burst(P.x,P.y-30,40,'#ffd23f',220);}homeBar.prev=Object.assign({},H.fx);}
function homeBar(){const el=$('#hmbar');if(!el)return;const on=CUR&&CUR.home&&!paused;if(!on){if(el.style.display!=='none')el.style.display='none';return;}el.style.display='flex';
 const h=`<button onclick="openFur()">🪑 가구</button><button class="${HM.edit?'on':''}" onclick="HM.edit=!HM.edit;HM.place=null;">✋ 옮기기</button>${HM.place?`<button onclick="HM.place=null">✕ 그만 놓기</button>`:''}<button onclick="openStash()">📦 창고</button>`;if(el._h!==h){el.innerHTML=h;el._h=h;}}
const FURT={v:'o'};
function buyFur(id){const F=furOf(id);if(P.gold<F.c){toast('골드 부족');return;}P.gold-=F.c;const H=homeInit();H.own[id]=(H.own[id]||0)+1;sfx('buy');toast(`${F.n} 구입 — 보유 탭에서 배치`);openFur();}
function openFur(){const H=homeInit();homeFx();const t=FURT.v;let body='';const cell=(F,badge,on)=>`<div class="bi" style="width:70px;height:70px" title="${F.n}" onclick="${on}"><canvas class="fcv" width="64" height="64" data-id="${F.id}"></canvas>${badge!=null?`<span class="e">${badge}</span>`:''}</div>`;
 if(t==='o'){const ids=[...FUR.map(f=>f.id),...Object.keys(H.tro).map(g=>'tr'+g)].filter(id=>furLeft(id)>0);body=`<p class="d">눌러서 집 안에 배치한다. 「옮기기」를 켜고 가구를 누르면 다시 옮길 수 있다.</p><div class="bgrid" style="grid-template-columns:repeat(auto-fill,70px)">${ids.map(id=>cell(furOf(id),furLeft(id),`HM.place='${id}';HM.edit=false;closeModal();toast('놓을 자리를 누르자')`)).join('')||'<span class="mut" style="grid-column:1/-1">배치할 가구가 없다. 상점 탭에서 사자</span>'}</div>`;}
 else if(t==='s')body=`<div class="icards">${FUR.map(F=>`<div class="icard"><canvas class="fcv" width="56" height="56" data-id="${F.id}"></canvas><div class="ib"><b>${F.n}</b> <span class="mut">${F.w}×${F.h}${F.floor?' · 바닥':''} · 보유 ${H.own[F.id]||0}</span><div class="mut" style="font-size:11px">${Object.values(HSET).filter(s=>s.need.includes(F.id)).map(s=>'세트: '+s.n).join(' · ')}</div><button class="btn s" style="margin-top:4px" ${P.gold<F.c?'disabled':''} onclick="buyFur('${F.id}')">${fmt(F.c)}G</button></div></div>`).join('')}</div>`;
 else{const ids=H.placed.map(p=>p.id);body=Object.entries(HSET).map(([k,s])=>`<div class="news"><b style="color:${H.fx[k]?'#ffd23f':'#e8dcc6'}">${H.fx[k]?'✅':'⬜'} ${s.n}</b> — ${s.d}<br><span class="mut">${s.need.map(n=>`<span class="${ids.includes(n)?'up':''}">${furOf(n).n}</span>`).join(' · ')}</span></div>`).join('')+`<div class="news"><b style="color:${(H.fx.tro||0)>=3?'#ffd23f':'#e8dcc6'}">🏆 트로피 진열 ${H.fx.tro||0}개</b> — 3개 보스 피해 +5% · 6개 +10% · 10개 +15%<br><span class="mut">보스를 처음 잡으면 박제 트로피를 얻는다 (보유 ${Object.keys(H.tro).length})</span></div>`;}
 openModal(`<h2>🏠 집 꾸미기 <span class="gold" style="float:right">💰 ${fmt(P.gold)}G</span></h2><div class="tabs">${[['o','보유'],['s','가구 상점'],['x','세트 효과']].map(([k,n])=>`<button class="tab ${t===k?'on':''}" onclick="FURT.v='${k}';openFur()">${n}</button>`).join('')}</div>${body}<button class="btn w g" onclick="closeModal()">닫기</button>`,true);
 document.querySelectorAll('#modal canvas.fcv').forEach(cv=>{const F=furOf(cv.dataset.id),c=cv.getContext('2d'),s=Math.min(cv.width/(F.w*TS),cv.height/(F.h*TS+ (F.tro!=null?20:0)));c.save();c.translate((cv.width-F.w*TS*s)/2-0,(cv.height-F.h*TS*s)/2);c.scale(s,s);drawFurImg(c,F,0,0,0.3);c.restore();});}
function openHome(){const d=P.dun;
 openModal(`<h2>🏠 유부장의 집</h2><p class="d"></p>
 ${P.duns.length?P.duns.map((dd,i)=>withDun(dd,()=>`<button class="btn w" ${dd.mons.length?'':'disabled'} onclick="enterPD(${i})">🕳️ ${dband(dd).ic} ${dd.name} 내려가기 ${dd.mons.length?`(Lv${dunLv()} · ${dmap().ic}${dmap().n})`:'— 몬스터를 먼저 배치하자'}</button>`)).join(''):'<button class="btn w" disabled>🕳️ 던전이 아직 없다</button>'}
 <button class="btn w" onclick="closeModal();transition('HOME','T0')">🚪 집 안으로 들어가기</button><button class="btn w" onclick="openStash()">📦 창고</button><button class="btn w" onclick="openMons('a')">🏟️ 몬스터 투기장</button><button class="btn w g" onclick="openDungeon()">🏰 던전 관리${d?'':' / 건설'}</button>
 <button class="btn w g" onclick="P.hp=maxHp();P.mp=maxMp();closeModal();toast('집에서 푹 쉬었다')">🛏️ 내 침대에서 쉬기 (무료)</button>
 <button class="btn w g" onclick="closeModal()">나가기</button>`);}

function dunLv0(){const d=P.dun;if(!d||!d.cores.length)return 0;const B=dband(d);return clamp(Math.round(d.cores.reduce((a,gi)=>a+GROUNDS[gi].lv,0)/d.cores.length)+Math.max(0,d.cores.length-3),B.lo,B.hi);}
function dunLv(){if(!P.dun||!P.dun.cores.length)return 0;return dunLv0()+dmap().lv+Math.round((eggLvAvg()-1)*2);}
const dunSlots=()=>P.dun?Math.min(12,P.dun.cores.length*2):0;
function dunPower(){const d=P.dun,L=dunLv();return d.mons.reduce((a,m)=>a+(m.mi<0?3:1),0)*0.12+L*0;}
function dunWants(n){if(typeof P==='undefined'||!P||!P.duns||!P.duns.length)return false;
 for(let i=0;i<P.duns.length;i++){const d=P.duns[i];if(!d.mons.length)continue;const ok=withDun(d,()=>{const L=dunLv();return n.lv>=L-5&&n.lv<=L+8&&R()<Math.min(0.5,0.05+0.05*d.mons.length);});if(ok){n.dunI=i;return true;}}return false;}
function dunHunt(n,silent){const dd=P.duns&&P.duns[n.dunI|0];if(!dd){n.timer=0;startTravel(n,chooseSellTown(n));return;}withDun(dd,()=>dunHunt0(n,silent));}
function dunHunt0(n,silent){const d=P.dun;if(!d||!d.mons.length){n.timer=0;startTravel(n,chooseSellTown(n));return;}
 const DM=dmap(),L=dunLv(),ratio=effLv(n)/(L+1)/Math.sqrt(DM.stat),M=d.mons.reduce((a,m)=>a+pdCount(m),0),boss=d.mons.some(m=>m.mi<0);d.visits=(d.visits||0)+1;
 const kills=Math.round(clamp(ratio*2,0.3,3)*rnd(.7,1.3)*Math.sqrt(DM.mult));
 for(let k=0;k<kills;k++){const m=pick(d.mons);const g=GROUNDS[m.gi];if(bagCount(n.bag)<n.cap)addBag(n.bag,rollDrop(g),1);n.exp+=L*2+3;
  const fee=Math.max(1,Math.round(L*rnd(0.06,0.12)*(m.mi<0?3:1)*DM.gold*(1+((m.lv||1)-1)*0.1)));d.tr.gold+=fee;d.earned+=fee;if(R()<0.05*DM.loot)addBag(d.tr.mats,rollDrop(g),1);}
 const death=clamp((0.012+(1/ratio-1)*0.12+M*0.003+(boss?0.03:0))*DM.death,0.005,0.25);
 if(R()<death&&!(n.pot>0&&R()<0.5)){dunDeath(n,silent);return;}
 if(R()<death)n.pot=Math.max(0,n.pot-1);
 n.timer--;if(n.timer<=0||bagCount(n.bag)>=n.cap){dlog(`${n.name}(Lv${n.lv})이(가) 탐험을 마치고 돌아갔다`);startTravel(n,chooseSellTown(n));}}
function dlog(t){const d=P.dun;d.log.unshift({h:G.hour,t});if(d.log.length>60)d.log.pop();}
function dunDeath(n,silent){const d=P.dun;d.deaths=(d.deaths||0)+1;const L=dunLv();
 for(const id in n.bag){const h=Math.floor(n.bag[id]*0.35);if(h)addBag(d.tr.mats,+id,h);}n.bag={};const gl=Math.round(n.gold*0.25);n.gold-=gl;d.tr.gold+=gl;let extra='';
 if(R()<0.22*dmap().loot){const k=pick(['w','a','h','b']),it=makeItem(k,clamp(n[k]||n.w||0,0,5),0.15);d.tr.items.push(it);extra+=` · 🎁${it.name}`;}
 if(R()<0.06){const m=pick(d.mons);if(m.mi>=0){const key=m.gi+'_'+m.mi;d.tr.eggs[key]=(d.tr.eggs[key]||0)+1;extra+=' · 🥚알';}}
 if(R()<0.04){const gi=pick(d.cores);d.tr.cores[gi]=(d.tr.cores[gi]||0)+1;extra+=' · 💠코어';}
 const t=`💀 ${n.name}(Lv${n.lv})이(가) 던전에서 쓰러졌다 — 유품 회수 ${fmt(gl)}G${extra}`;dlog(t);if(!silent)news(t,'ev');
 if(NAMEPOOL.length<2)NAMEPOOL=makeNames();const nn=newHunter(Math.max(1,Math.round(n.lv*0.6)),0);nn.id=n.id;Object.keys(n).forEach(k=>delete n[k]);Object.assign(n,nn);}

function chooseGround(n,t){let best=-1,bs=-1e9;const crowd={};for(const x of G.npcs)if(x!==n&&x.role==='hunter'){const k=x.state==='travel'?x.to:x.state==='hunt'?x.node:-1;if(k>=NT)crowd[k-NT]=(crowd[k-NT]||0)+1;}
 GROUNDS.forEach((g,gi)=>{if(g.lv>n.lv+2||g.lv<n.lv-10)return;const ratio=effLv(n)/(g.lv+1),kph=clamp(ratio*2,.3,3);
  const ev=g.matIds.reduce((s,mid,k)=>s+W5[k]*sellP(t,mid),0)/WS*1.3;const tr=hoursBetween(t,NT+gi);
  let sc=kph*ev*6/(6+tr*2)*(1-clamp(0.22-ratio*0.18,0.01,0.4));if(isSurge(gi))sc*=0.3;sc/=1+Math.max(0,(crowd[gi]||0)-2)*0.45;sc*=rnd(.7,1.3);if(sc>bs){bs=sc;best=gi;}});
 return best<0?0:best;}
function chooseSellTown(n){const from=n.node;let best=0,bs=-1e9;
 for(let t=0;t<NT;t++){let v=0;for(const id in n.bag)v+=n.bag[id]*sellP(t,+id)*0.85;const sc=(v-hoursBetween(from,t)*(n.lv*1.2+3)*(n.injured?5:1))*rnd(.9,1.1);if(sc>bs){bs=sc;best=t;}}return best;}
function hunterShop(n,t,silent){SHOPS.forEach((sh,si)=>{if(sh.town!==t||sh.kind!=='craft')return;
 for(const cid of sh.items){const c=CB[cid],s=G.cs[si][cid];if(s.stock<1)continue;const p=cPrice(si,cid);
  if(c.type==='potion'){const want=n.lv<10?'p1':n.lv<22?'p2':'p3';if(cid===want)while(n.pot<3&&s.stock>=1&&n.gold>=p*2){n.pot++;s.stock--;n.gold-=p;}}
  else{const k=SLOTK[c.type],cur=n[k]||0;if(c.tier>cur&&c.lvReq<=n.lv&&n.gold>=p*1.2){s.stock--;n.gold-=p;n[k]=c.tier;
   if(!silent)news(`🛒 사냥꾼 ${n.name}(Lv${n.lv})이(가) ${sh.name}에서 ${c.name} 구입`);}}}});}
function sellAll(n,t){let total=0,cnt=0,top=null,topq=0;for(const id in n.bag){const q=n.bag[id];for(let i=0;i<q;i++){total+=sellP(t,+id);G.mk[t][id].stock+=1;}cnt+=q;if(q>topq){topq=q;top=+id;}}n.bag={};return{total,cnt,top,topq};}
function arrive(n,silent){const t=n.node;
 if(t>=NT){n.state='hunt';n.timer=ri(9,16);return;}
 if(n.role==='hunter'){
  if(bagCount(n.bag)){const r=sellAll(n,t);n.gold+=r.total;n.earned+=r.total;if(!silent&&r.cnt>=10)news(`💰 사냥꾼 ${n.name} — ${TOWNS[t].name}에 ${MATS[r.top].name} 등 ${r.cnt}개 판매`);}
  n.state='rest';n.timer=n.injured?8:ri(1,3);n.injured=false;
  if(n.lv>=130){if(!silent)news(`🎖️ 베테랑 사냥꾼 ${n.name} 은퇴. 신참이 들어왔다.`);if(NAMEPOOL.length<2)NAMEPOOL=makeNames();const nn=newHunter(1,t);nn.id=n.id;Object.keys(n).forEach(k=>delete n[k]);Object.assign(n,nn);}
 }else{const r=sellAll(n,t);n.gold+=r.total;const pr=r.total-n.spent;n.profit+=pr;n.trips++;
  if(!silent&&r.cnt)news(`🐪 상인 ${n.name} — ${NODES[n.from].name}→${TOWNS[t].name} ${MATS[r.top].name} 등 ${r.cnt}개 운송`,'tr');
  n.state='idle';n.timer=ri(1,3);n.spent=0;}}
function traderAct(n){if(n.state!=='idle')return;if(n.timer>0){n.timer--;return;}
 const t=n.node;let best=null;
 for(let u=0;u<NT;u++){if(u===t)continue;const h=hoursBetween(t,u);const off={};let cargo=0,gold=n.gold,profit=0;
  while(cargo<n.cap){let bm=-1,bv=0,bb=0;
   for(const m of MATS){const o=off[m.id]||0;const sh=G.mk[t][m.id].stock-o;if(sh<1)continue;const b=buyP(t,m.id,sh);if(b>gold)continue;
    const s=sellP(u,m.id,G.mk[u][m.id].stock+o);const mg=s-b;if(mg>bv&&mg>=Math.max(2,b*0.15)){bv=mg;bm=m.id;bb=b;}}
   if(bm<0)break;off[bm]=(off[bm]||0)+1;cargo++;gold-=bb;profit+=bv;}
  profit-=h*4;if(cargo&&(!best||profit>best.profit))best={u,off,profit};}
 if(best&&best.profit>20){n.spent=0;for(const id in best.off){for(let i=0;i<best.off[id];i++){const p=buyP(t,+id);n.gold-=p;n.spent+=p;G.mk[t][id].stock-=1;}addBag(n.bag,+id,best.off[id]);}startTravel(n,best.u);}
 else{n.timer=ri(2,4);if(R()<0.2){n.spent=0;let u=ri(0,4);if(u===t)u=(u+1)%5;startTravel(n,u);}}}
function crafterAct(n,silent){const si=n.shop,sh=SHOPS[si],t=sh.town;if(R()>0.55)return;
 const list=sh.items.filter(cid=>G.cs[si][cid].stock<G.cs[si][cid].target*evCraft(t,CB[cid])).sort((a,b)=>G.cs[si][a].stock/G.cs[si][a].target-G.cs[si][b].stock/G.cs[si][b].target);
 if(!list.length){n.status='재고가 넉넉하다';n.miss=null;return;}
 for(const cid of list){const c=CB[cid];if(c.recIds.every(([mid,q])=>G.mk[t][mid].stock>=q)){let cost=0;
   for(const[mid,q]of c.recIds)for(let i=0;i<q;i++){cost+=buyP(t,mid);G.mk[t][mid].stock-=1;}
   G.cs[si][cid].stock+=1;n.made++;n.gold-=cost;n.status=`방금 ${c.name}을(를) 만들었다`;n.miss=null;
   if(!silent&&c.type!=='potion'&&R()<0.4)news(`🔨 장인 ${n.name} — ${c.name} 제작 (${TOWNS[t].name})`);return;}}
 const c=CB[list[0]];n.miss=c.recIds.filter(([mid,q])=>G.mk[t][mid].stock<q).map(([mid])=>MATS[mid].name);n.status=`${c.name} 만들 재료가 없다 (${n.miss.join(', ')})`;}
