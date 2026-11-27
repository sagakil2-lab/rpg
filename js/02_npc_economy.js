'use strict';
// =====================================================================
//  NPC 경제 시뮬레이션 (백그라운드)
// =====================================================================
let G,P;
function evMat(t,m){let k=1;for(const e of G.events){if(e.t!==t)continue;
 if(e.k==='famine'&&m.cat==='plant')k*=2.5;if(e.k==='festival'&&(m.cat==='plant'||m.cat==='misc'))k*=1.6;
 if(e.k==='war'&&(m.cat==='ore'||m.cat==='hide'))k*=2;if(e.k==='collapse'&&m.cat==='ore')k*=1.5;if(e.k==='storm'&&m.cat==='sea')k*=1.5;}return k;}
function evCraft(t,c){let k=1;for(const e of G.events){if(e.t!==t)continue;if(e.k==='festival'&&c.type==='potion')k*=2.5;if(e.k==='war'&&c.type!=='potion')k*=2;}return k;}
const isSurge=gi=>G.events.some(e=>e.k==='surge'&&e.g===gi);
function startEvent(silent){const k=pick(['surge','surge','surge','famine','festival','war','collapse','storm']);let e;
 if(k==='surge'){const g=ri(0,9);e={k,g,text:`⚔️ ${GROUNDS[g].name}에 몬스터 대량 발생! (몬스터 증가·정예 출현↑)`,endText:`${GROUNDS[g].name}이(가) 잠잠해졌다`};}
 if(k==='famine'){const t=ri(0,4);e={k,t,text:`🌾 ${TOWNS[t].name} 흉년 — 식물 재료 수요 급증`,endText:`${TOWNS[t].name} 흉년이 끝났다`};}
 if(k==='festival'){const t=ri(0,4);e={k,t,text:`🎉 ${TOWNS[t].name} 축제 — 물약이 불티나게 팔린다`,endText:`${TOWNS[t].name} 축제가 끝났다`};}
 if(k==='war'){const t=pick([4,4,0,2]);e={k,t,text:`🚩 ${TOWNS[t].name} 전쟁 준비 — 무기·방어구 품귀`,endText:`${TOWNS[t].name} 전쟁 위기 해소`};}
 if(k==='collapse')e={k,t:2,text:`💥 카락 광산 붕괴 — 광석 재고 급감`,endText:`카락 광산 복구 완료`};
 if(k==='storm')e={k,t:3,text:`🌊 시엘라 폭풍 — 해산물 재고 급감`,endText:`시엘라 폭풍이 지나갔다`};
 if(G.events.some(x=>x.k===e.k&&x.t===e.t&&x.g===e.g))return;
 if(k==='collapse')MATS.forEach(m=>{if(m.cat==='ore')G.mk[2][m.id].stock*=0.3;});
 if(k==='storm')MATS.forEach(m=>{if(m.cat==='sea')G.mk[3][m.id].stock*=0.3;});
 e.until=G.hour+ri(24,60);G.events.push(e);if(!silent){news(e.text,'ev');toast(e.text);}}
function mPrice(t,mid,stock){const m=MATS[mid],s=G.mk[t][mid];const st=stock===undefined?s.stock:stock;const tg=s.target*evMat(t,m);
 return m.base*(TOWNS[t].mods[m.cat]||1)*clamp(Math.pow((tg+3)/(Math.max(0,st)+3),0.75),0.3,4);}
const sellP=(t,mid,st)=>Math.max(1,Math.floor(mPrice(t,mid,st)*0.8));
const buyP=(t,mid,st)=>Math.max(2,Math.ceil(mPrice(t,mid,st)*1.15));
function cPrice(si,cid){const c=CB[cid],s=G.cs[si][cid];const tg=s.target*evCraft(SHOPS[si].town,c);return Math.ceil(c.base*clamp(Math.pow((tg+2)/(Math.max(0,s.stock)+2),0.6),0.6,3)*1.1);}
const lvTier=lv=>lv>=27?5:lv>=21?4:lv>=15?3:lv>=9?2:lv>=3?1:0;
let NAMEPOOL=[];
function makeNames(){const a='카리브세토엘마로하유제아루비오레시나도벨'.split(''),b=['일','안','람','린','렌','온','나','크','스','델','윈','론','엘','미'];const s=new Set();while(s.size<520)s.add(pick(a)+pick(b)+(R()<0.25?pick(['르','트','니','아']):''));return[...s];}
function rollKarma(){const r=R();return r<0.15?ri(-100,-40):r<0.45?ri(40,100):ri(-39,39);}
function newHunter(lv,node){return{karma:rollKarma(),name:NAMEPOOL.pop(),role:'hunter',lv,exp:0,gold:ri(30,80)+lv*25,node,state:'rest',timer:ri(0,5),bag:{},cap:25+lv,pot:2,w:lvTier(lv),a:lvTier(lv),h:lvTier(lv),b:lvTier(lv),kills:0,earned:0,injured:false,last:-1};}
function newSim(){NAMEPOOL=makeNames();
 G={hour:0,events:[],news:[],npcs:[]};
 G.mk=TOWNS.map(()=>MATS.map(m=>{const target=Math.max(3,(26-m.tier*1.8)*(m.rare?0.4:1));return{stock:target*rnd(.7,1.3),target};}));
 G.cs=SHOPS.map(s=>s.kind!=='craft'?null:Object.fromEntries(s.items.map(cid=>{const c=CB[cid];const target=c.type==='potion'?12:7-c.tier;return[cid,{stock:target*rnd(.5,1),target}];})));
 [...[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,22,24,25,26,28,30,31,33,36,40,44,48,52,58,64,70,78,86,95,105,118].flatMap(l=>[l,Math.max(1,l+ri(-2,2)),Math.max(1,l+ri(-3,3)),Math.max(1,l+ri(-2,3)),Math.max(1,l+ri(-4,2))])].forEach(lv=>{
  const cand=GROUNDS.map((g,i)=>i).filter(i=>GROUNDS[i].lv<=lv+2&&GROUNDS[i].lv>=lv-10);G.npcs.push(newHunter(lv,GROUNDS[cand.length?pick(cand):0].town));});
 for(let i=0;i<24;i++)G.npcs.push({name:NAMEPOOL.pop(),role:'trader',lv:ri(3,15),gold:ri(400,900),node:i%NT,state:'idle',timer:ri(0,4),bag:{},cap:ri(20,40),trips:0,profit:0,spent:0});
 [1,1,3,3,5,5,7,7,9,9,11,11,13,13,15,15,17,17,19,19,1,3,5,7,9,11,13,15,17,19].forEach(si=>G.npcs.push({name:NAMEPOOL.pop(),role:'crafter',lv:ri(5,20),shop:si,node:SHOPS[si].town,made:0,gold:ri(500,1200),status:'',state:'work'}));
 G.npcs.forEach((n,i)=>n.id=i);
 for(let i=0;i<120;i++)hourTick(true);
 G.hour=0;G.news=[];G.events=[];}
function news(text,kind=''){G.news.unshift({h:G.hour,text,kind});if(G.news.length>200)G.news.pop();const tk=$('#ticker');if(tk){tk.textContent=text;tk.style.opacity=1;clearTimeout(news._t);news._t=setTimeout(()=>tk.style.opacity=0.35,6000);}}
const timeStr=h=>{const x=h+8;return`${Math.floor(x/24)+1}일차 ${String(x%24).padStart(2,'0')}:00`;};
function awakeTick(silent){if(typeof P==='undefined'||!P||!P.lv)return;const day=Math.floor(G.hour/24);if(G.awake&&G.awake.day===day)return;
 const cand=GROUNDS.map((g,i)=>i).filter(i=>GROUNDS[i].lv<=P.lv-10&&P.lv>=TOWNS[GROUNDS[i].town].unlock);const L=[];while(L.length<Math.min(3,cand.length)){const x=pick(cand);if(!L.includes(x))L.push(x);}
 G.awake={day,list:L};if(L.length&&!silent){news(`⚡ 오늘의 각성 사냥터: ${L.map(i=>GROUNDS[i].name).join(', ')} — 몬스터가 내 레벨로 강해지고 각성의 정수가 나온다`,'ev');toast('⚡ 각성 사냥터가 바뀌었다!');}}
const awk=gi=>!!(G&&G.awake&&G.awake.list.includes(gi));
function hourTick(silent){
 G.hour++;awakeTick(silent);if(P&&!silent){const tot=(P.duns||[]).reduce((a,d)=>a+(d.earned||0),0);if(P._dunLast!=null){const dl=Math.max(0,tot-P._dunLast);P.dunRate=(P.dunRate||0)*0.97+dl*0.03;}P._dunLast=tot;try{P._evb=evtBadge();}catch(e){}}if(P&&P.orders)orderDeliver(silent);
 G.events=G.events.filter(e=>{if(G.hour>=e.until){if(!silent)news('✔️ '+e.endText,'ev');return false;}return true;});
 if(G.events.length<3&&R()<1/24)startEvent(silent);
 riftTick(silent);
 for(let t=0;t<NT;t++)for(const m of MATS){const s=G.mk[t][m.id];const tg=s.target*evMat(t,m);s.stock+=(tg-s.stock)*0.03+(R()-0.5)*0.3;if(s.stock<0)s.stock=0;}
 SHOPS.forEach((sh,si)=>{if(sh.kind!=='craft')return;for(const cid in G.cs[si]){const s=G.cs[si][cid];const k=evCraft(sh.town,CB[cid]);s.stock=Math.max(0,s.stock-s.stock*0.02*k-(R()<0.04*k?1:0));}});
 for(const n of G.npcs)npcAct(n,silent);
}
const effLv=n=>n.lv+(WATK[n.w]+ADEF[n.a])/6;
function startTravel(n,to){n.from=n.node;n.to=to;n.tt=0;n.tTotal=hoursBetween(n.node,to);n.state='travel';n.node=-1;}
function npcAct(n,silent){if(n.role==='crafter')return crafterAct(n,silent);
 if(n.state==='travel'){n.tt++;if(n.tt>=n.tTotal){n.node=n.to;arrive(n,silent);}return;}
 if(n.role==='hunter')hunterAct(n,silent);else traderAct(n,silent);}
function hunterAct(n,silent){if(n.party)return;
 if(n.state==='rest'){if(--n.timer<=0)n.state='idle';return;}
 if(n.state==='idle'){const t=n.node;hunterShop(n,t,silent);if(dunWants(n)){n.last=-2;startTravel(n,DUN);return;}const g=chooseGround(n,t);n.last=g;startTravel(n,NT+g);return;}
 if(n.state==='hunt'&&n.node===DUN){dunHunt(n,silent);return;}
 if(n.state==='hunt'){const gi=n.node-NT,g=GROUNDS[gi],ratio=effLv(n)/(g.lv+1),surge=isSurge(gi);
  const kills=Math.round(clamp(ratio*2,0.3,3)*rnd(.6,1.4));
  for(let k=0;k<kills;k++){if(bagCount(n.bag)>=n.cap)break;addBag(n.bag,R()<0.015?g.sp:rollDrop(g),R()<0.3?2:1);n.exp+=g.lv*2+3;n.kills++;}
  while(n.exp>=120*Math.pow(n.lv,1.7)){n.exp-=120*Math.pow(n.lv,1.7);n.lv++;if(!silent&&n.lv%5===0&&!(n.lv===PROMO_LV&&promoK(n)))news(`⭐ 사냥꾼 ${n.name}이(가) Lv${n.lv}이 되었다`);if(!silent&&n.lv===PROMO_LV&&promoK(n))news(`🎖 ${n.name}이(가) ${PROMO[n.cls||'warrior'][1]}(으)로 전직했다!`);}
  const inj=clamp(0.22-ratio*0.18,0.01,0.4)+(surge?0.15:0);
  if(R()<inj){if(n.pot>0)n.pot--;else{n.injured=true;if(!silent)news(`🩸 사냥꾼 ${n.name}이(가) ${g.name}에서 부상을 입고 후퇴`);}}
  n.timer--;if(n.timer<=0||bagCount(n.bag)>=n.cap||n.injured)startTravel(n,chooseSellTown(n));}}
