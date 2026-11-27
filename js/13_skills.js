'use strict';
// =====================================================================
//  스킬 트리 (레벨업마다 SP 1, 5레벨마다 +1 / 액티브 스킬은 슬롯 1~4에 장착)
// =====================================================================
const dm=x=>`공격력×${x.toFixed(1)}`;
const SK={
 spin:{n:'회전베기',ic:'🌀',br:0,row:0,col:0,req:1,max:5,mp:12,cd:2.2,type:'a',d:r=>`주변 모든 적에게 ${dm(2+0.3*r)} 피해`},
 str:{n:'날카로운 검',ic:'🗡️',br:0,row:1,col:0,pre:'spin',req:3,max:5,type:'p',d:r=>`공격력 +${5*r}%`},
 dash:{n:'돌진베기',ic:'💨',br:0,row:2,col:0,pre:'str',req:4,max:5,mp:10,cd:3,type:'a',d:r=>`돌진하며 경로의 적에게 ${dm(1.8+0.3*r)} (무적)`},
 flurry:{n:'연속베기',ic:'⚔️',br:0,row:3,col:0,pre:'dash',req:8,max:5,mp:14,cd:4,type:'a',d:r=>`빠르게 3회 베기, 회당 ${dm(1+0.15*r)}`},
 crit:{n:'급소 찌르기',ic:'🎯',br:0,row:4,col:0,pre:'flurry',req:9,max:5,type:'p',d:r=>`치명타 확률 +${3*r}%`},
 wave:{n:'검기 발사',ic:'🌙',br:0,row:5,col:0,pre:'crit',req:12,max:5,mp:16,cd:3.5,type:'a',d:r=>`적을 관통하는 검기 ${dm(2.2+0.3*r)}`},
 split:{n:'대지 가르기',ic:'⛰️',br:0,row:6,col:0,pre:'wave',req:20,max:5,mp:30,cd:9,type:'a',d:r=>`전방 일직선 ${dm(4+0.6*r)} + 기절 1.5초`},
 bladestorm:{n:'검풍난무',ic:'🌪️',br:0,row:7,col:-1,pre:'split',ex:'b0a',req:32,max:5,mp:40,cd:14,type:'a',d:r=>`3초간 칼바람을 두르고 움직이며 0.25초마다 ${dm(0.7+0.1*r)}`},
 execute:{n:'처형',ic:'🪓',br:0,row:7,col:1,pre:'split',ex:'b0a',req:32,max:5,mp:28,cd:8,type:'a',d:r=>`앞의 적 하나에게 ${dm(2.5+0.3*r)}, HP 35% 이하면 ${dm(6+r)}`},
 bloodlust:{n:'피의 갈증',ic:'🩸',br:0,row:8,col:-1,pre:['bladestorm','execute'],ex:'b0b',req:38,max:5,type:'p',d:r=>`입힌 피해의 ${1.5*r}%만큼 HP 회복`},
 berserk:{n:'광전사',ic:'😤',br:0,row:8,col:1,pre:['bladestorm','execute'],ex:'b0b',req:38,max:5,type:'p',d:r=>`HP 50% 이하일 때 공격력 +${8*r}%`},
 vit:{n:'강인한 체력',ic:'❤️',br:1,row:0,col:0,req:2,max:5,type:'p',d:r=>`최대 HP +${8*r}%`},
 warcry:{n:'전투 함성',ic:'📯',br:1,row:1,col:0,pre:'vit',req:6,max:5,mp:20,cd:20,type:'a',d:r=>`10초간 공격력 +${20+5*r}%`},
 iron:{n:'철벽',ic:'🛡️',br:1,row:2,col:0,pre:'warcry',req:10,max:5,mp:18,cd:18,type:'a',d:r=>`6초간 받는 피해 -${Math.min(75,40+5*r)}%`},
 swift:{n:'질풍',ic:'👟',br:1,row:3,col:0,pre:'iron',req:13,max:5,type:'p',d:r=>`이동속도 +${5*r}%`},
 heal:{n:'치유의 빛',ic:'✨',br:1,row:4,col:0,pre:'swift',req:15,max:5,mp:30,cd:15,type:'a',d:r=>`최대 HP의 ${25+5*r}% 회복`},
 taunt:{n:'도발',ic:'😠',br:1,row:5,col:-1,pre:'heal',ex:'b1a',req:20,max:5,mp:20,cd:12,type:'a',d:r=>`주변 적을 끌어당기고 5초간 받는 피해 -${30+5*r}%`},
 aegis:{n:'수호의 방패',ic:'🔰',br:1,row:5,col:1,pre:'heal',ex:'b1a',req:20,max:5,mp:26,cd:16,type:'a',d:r=>`8초간 최대 HP의 ${20+5*r}% 피해를 흡수하는 보호막`},
 regen:{n:'재생',ic:'💚',br:1,row:6,col:-1,pre:['taunt','aegis'],ex:'b1b',req:27,max:5,type:'p',d:r=>`초당 최대 HP의 ${(0.4*r).toFixed(1)}% 회복`},
 thorns:{n:'가시 갑옷',ic:'🌵',br:1,row:6,col:1,pre:['taunt','aegis'],ex:'b1b',req:27,max:5,type:'p',d:r=>`맞을 때마다 주변 적에게 ${dm(0.4+0.2*r)} 반격`},
 quake:{n:'대지진',ic:'🌋',br:1,row:7,col:0,pre:['regen','thorns'],req:36,max:5,mp:45,cd:18,type:'a',d:r=>`땅을 세 번 내리쳐 넓은 범위 ${dm(2+0.4*r)}×3 + 기절 2초`},
 focus:{n:'마나 집중',ic:'🔷',br:2,row:0,col:0,req:5,max:5,type:'p',d:r=>`최대 MP +${10*r}%, MP 회복 +${25*r}%`},
 fireball:{n:'화염구',ic:'🔥',br:2,row:1,col:0,pre:'focus',req:7,max:5,mp:18,cd:4,type:'a',d:r=>`폭발하는 화염구 ${dm(2.5+0.4*r)} (범위)`},
 thunder:{n:'낙뢰',ic:'⚡',br:2,row:2,col:0,pre:'fireball',req:16,max:5,mp:26,cd:7,type:'a',d:r=>`가까운 적 ${3+Math.floor(r/2)}마리에게 번개 ${dm(2.8+0.4*r)}`},
 frost:{n:'서리 폭발',ic:'❄️',br:2,row:3,col:0,pre:'thunder',req:22,max:5,mp:24,cd:10,type:'a',d:r=>`주변 ${dm(1.5+0.3*r)} + 3초 둔화`},
 meteor:{n:'메테오',ic:'☄️',br:2,row:4,col:0,pre:'frost',req:28,max:5,mp:45,cd:16,type:'a',d:r=>`거대 운석 낙하 ${dm(7+r)} (넓은 범위)`},
 chain:{n:'연쇄 번개',ic:'🔗',br:2,row:5,col:-1,pre:'meteor',ex:'b2a',req:33,max:5,mp:32,cd:8,type:'a',d:r=>`적 사이를 ${4+r}번 튕기는 번개, 회당 ${dm(2.2+0.35*r)}`},
 blizzard:{n:'블리자드',ic:'🌨️',br:2,row:5,col:1,pre:'meteor',ex:'b2a',req:33,max:5,mp:38,cd:14,type:'a',d:r=>`4초간 눈보라 지대 — 0.4초마다 ${dm(0.6+0.1*r)} + 둔화`},
 pyro:{n:'원소 증폭',ic:'🔺',br:2,row:6,col:-1,pre:['chain','blizzard'],ex:'b2b',req:38,max:5,type:'p',d:r=>`원소 스킬 피해 +${8*r}%`},
 arcane:{n:'비전 가속',ic:'⏳',br:2,row:6,col:1,pre:['chain','blizzard'],ex:'b2b',req:38,max:5,type:'p',d:r=>`모든 스킬 쿨타임 -${6*r}%`},
 nova:{n:'원소 폭발',ic:'💥',br:2,row:7,col:0,pre:['pyro','arcane'],req:45,max:5,mp:60,cd:22,type:'a',d:r=>`나를 중심으로 세 겹의 원소 폭발, 각 ${dm(4+0.8*r)}`},
 agile:{n:'민첩',ic:'🐾',br:3,row:0,col:0,req:4,max:5,type:'p',d:r=>`치명타 피해 +${10*r}%`},
 shadowstep:{n:'그림자 걸음',ic:'👤',br:3,row:1,col:0,pre:'agile',req:9,max:5,mp:16,cd:6,type:'a',d:r=>`가까운 적 뒤로 순간이동해 ${dm(3+0.4*r)} + 기절 1초`},
 poison:{n:'독 단검',ic:'🗡',br:3,row:2,col:0,pre:'shadowstep',req:14,max:5,mp:18,cd:5,type:'a',d:r=>`단검 3개 투척 ${dm(1.2+0.2*r)} + 4초간 중독`},
 arrowrain:{n:'화살비',ic:'🏹',br:3,row:3,col:-1,pre:'poison',ex:'b3a',req:24,max:5,mp:34,cd:11,type:'a',d:r=>`목표 지점에 화살 14발, 발당 ${dm(0.8+0.12*r)}`},
 clone:{n:'그림자 분신',ic:'👥',br:3,row:3,col:1,pre:'poison',ex:'b3a',req:24,max:5,mp:30,cd:12,type:'a',d:r=>`2.5초간 분신이 주변 적을 연속 베기 ${dm(0.9+0.15*r)}`},
 evade:{n:'회피',ic:'🌫️',br:3,row:4,col:0,pre:['arrowrain','clone'],req:30,max:5,type:'p',d:r=>`${3*r}% 확률로 공격을 완전히 피한다`},
 assassin:{n:'암살',ic:'🗡️',br:3,row:5,col:0,pre:'evade',req:40,max:5,mp:50,cd:20,type:'a',d:r=>`대상 주위를 돌며 5연속 ${dm(2+0.4*r)}, 마지막 일격 2배`},
 faith:{n:'신앙',ic:'🕯️',br:4,row:0,col:0,req:6,max:5,type:'p',d:r=>`MP 회복 +${20*r}%, 회복량 +${6*r}%`},
 smite:{n:'신성 강타',ic:'🔆',br:4,row:1,col:0,pre:'faith',req:11,max:5,mp:20,cd:5,type:'a',d:r=>`빛의 기둥 ${dm(4+0.6*r)} (어둠 속성에 1.5배)`},
 sanct:{n:'성역',ic:'⛪',br:4,row:2,col:0,pre:'smite',req:18,max:5,mp:34,cd:16,type:'a',d:r=>`5초간 성역 — 안에서 나와 동료 회복, 적에게 ${dm(0.5+0.1*r)}`},
 judgment:{n:'심판의 빛',ic:'☀️',br:4,row:3,col:-1,pre:'sanct',ex:'b4a',req:26,max:5,mp:42,cd:14,type:'a',d:r=>`주변 적 ${6+r}명에게 차례로 빛기둥 ${dm(2.4+0.4*r)}`},
 angel:{n:'수호천사',ic:'👼',br:4,row:3,col:1,pre:'sanct',ex:'b4a',req:26,max:5,mp:40,cd:40,type:'a',d:r=>`${(3+0.4*r).toFixed(1)}초 무적 + HP 30% 회복`},
 revive:{n:'부활',ic:'🪽',br:4,row:4,col:0,pre:['judgment','angel'],req:35,max:5,type:'p',d:r=>`쓰러지면 그 자리에서 HP ${20+5*r}%로 부활 (재사용 ${300-30*r}초)`},
 bladeaura:{n:'검기 참격',ic:'🌙',br:0,row:3,col:1,pre:'dash',req:12,max:5,type:'p',proc:1,d:r=>`[발동] 일반 공격 시 ${15+5*r}% 확률로 검기가 날아간다 ${dm(1.2+0.2*r)}`},
 whirl:{n:'회오리 본능',ic:'🌀',br:0,row:4,col:-1,pre:'flurry',req:16,max:5,type:'p',proc:1,d:r=>`[발동] 일반 공격 ${9-r}번마다 회전베기가 저절로 나간다 ${dm(1.5+0.25*r)}`},
 counter:{n:'반격 파동',ic:'💥',br:1,row:2,col:1,pre:'warcry',req:8,max:5,type:'p',proc:1,d:r=>`[발동] 맞을 때 ${12+4*r}% 확률로 충격파 — 주변 적 ${dm(1.2+0.25*r)} + 기절`},
 barrier:{n:'보호의 오라',ic:'🔵',br:1,row:3,col:-1,pre:'iron',req:12,max:5,type:'p',proc:1,d:r=>`[발동] 전투 중 ${16-r}초마다 최대 HP ${6+2*r}% 보호막이 저절로 생긴다`},
 orbs:{n:'에너지 구체',ic:'🔮',br:2,row:2,col:1,pre:'fireball',req:8,max:5,type:'p',proc:1,d:r=>`[상시] 마력 구체 ${1+Math.ceil(r/2)}개가 내 주위를 돌며 닿는 적에게 ${dm(0.45+0.1*r)}`},
 spark:{n:'번개 연계',ic:'⚡',br:2,row:3,col:-1,pre:'thunder',req:12,max:5,type:'p',proc:1,d:r=>`[발동] 일반 공격 ${7-r}번마다 번개가 적 ${3+Math.ceil(r/2)}명에게 튄다 ${dm(1.3+0.2*r)}`},
 dagger:{n:'그림자 단검',ic:'🗡️',br:3,row:1,col:1,pre:'agile',req:6,max:5,type:'p',proc:1,d:r=>`[발동] 치명타가 터지면 단검 3개가 퍼져 나간다 ${dm(0.7+0.15*r)}`},
 shade:{n:'그림자 습격',ic:'👤',br:3,row:2,col:-1,pre:'shadowstep',req:10,max:5,type:'p',proc:1,d:r=>`[발동] 전투 중 ${10-r}초마다 그림자가 가까운 적 3명을 벤다 ${dm(1.4+0.25*r)}`},
 holybolt:{n:'신성 낙뢰',ic:'🌩️',br:4,row:1,col:1,pre:'faith',req:6,max:5,type:'p',proc:1,d:r=>`[발동] 전투 중 ${9-r}초마다 가장 가까운 적에게 빛기둥 ${dm(2+0.4*r)}`},
 bless:{n:'축복의 파동',ic:'💖',br:4,row:2,col:-1,pre:'smite',req:10,max:5,type:'p',proc:1,d:r=>`[발동] ${12-r}초마다 나·동료·펫의 HP ${3+r}% 회복`},
};
const PRC={dg:0};const inFight=()=>CUR&&!(CUR.kind==='town'&&!CUR.invaded)&&!P.dead;
function procTxt(n,col){floatT(P.x,P.y-78,n,col||'#9fdfff',11,0.9);}
function procAtk(){if(!inFight())return;P.atkN=(P.atkN||0)+1;const n=P.atkN;let r;
 if((r=rk('bladeaura'))&&R()<0.15+0.05*r){const a=aimAng(300);ents.pproj.push({kind:'wave',x:P.x+Math.cos(a)*16,y:P.y-16+Math.sin(a)*12,vx:Math.cos(a)*400,vy:Math.sin(a)*400,ang:a,life:0.6,mult:1.2+0.2*r,r:18,hit:new Set()});}
 if((r=rk('whirl'))&&n%(9-r)===0){procTxt('회오리 본능','#aff');P.spin=1;ents.rings.push({x:P.x,y:P.y-8,life:0,max:0.4,r:88,col:'160,255,255'});fx('fx_spin',P.x,P.y-16,2.6,0.4);for(let i=0;i<4;i++)ents.slashes.push({x:P.x,y:P.y-12,ang:i*Math.PI/2,life:-i*0.04,max:0.26,r:52,col:'#aff',w:7});hitArea(P.x,P.y,88,1.5+0.25*r);}
 if((r=rk('spark'))&&n%(7-r)===0){let from={x:P.x,y:P.y-30};const hit=new Set();for(let k=0;k<3+Math.ceil(r/2);k++){const m=nearMon(from.x,from.y+30,k?200:260,hit);if(!m)break;hit.add(m);const f={...from};later(k*0.08,()=>{if(m.dead)return;ents.bolts.push({x:m.x,y:m.y,x0:f.x,y0:f.y,life:0,max:0.25,seed:Math.floor(R()*1e6)});hitMon(m,1.3+0.2*r,0);});from={x:m.x,y:m.y-30};}if(hit.size)procTxt('번개 연계','#cfe8ff');}}
function procCrit(m){const r=rk('dagger');if(!r||PRC.dg>performance.now())return;PRC.dg=performance.now()+350;const a=Math.atan2(m.y-P.y,m.x-P.x);for(const sp of[-0.35,0,0.35])ents.pproj.push({kind:'bolt',col:'#b48aff',x:P.x+Math.cos(a)*14,y:P.y-18+Math.sin(a)*10,vx:Math.cos(a+sp)*480,vy:Math.sin(a+sp)*480,ang:a+sp,life:0.55,mult:0.7+0.15*r,r:10,hit:new Set(),single:true});}
function procHurt(){const r=rk('counter');if(!r||!inFight()||R()>0.12+0.04*r)return;procTxt('반격 파동','#ffb08a');ents.rings.push({x:P.x,y:P.y-6,life:0,max:0.45,r:95,col:'255,170,120'});cam.shake=Math.max(cam.shake,6);hitArea(P.x,P.y,95,1.2+0.25*r,undefined,m=>{m.stun=Math.max(m.stun||0,0.6);});}
function procTick(dt){if(!P||!inFight())return;P.prT=P.prT||{};const T=P.prT,near=d=>ents.mons.filter(m=>!m.dead&&Math.hypot(m.x-P.x,m.y-P.y)<d).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y));let r;
 const fight=ents.mons.some(m=>!m.dead&&Math.hypot(m.x-P.x,m.y-P.y)<300);
 if((r=rk('barrier'))){T.bar=(T.bar||0)-dt;if(T.bar<=0&&fight){T.bar=16-r;const v=maxHp()*(0.06+0.02*r);if(!(P.shieldT>0&&P.shield>=v)){P.shield=Math.max(P.shield||0,v);P.shieldT=6;ents.rings.push({x:P.x,y:P.y-20,life:0,max:0.6,r:55,col:'140,200,255'});procTxt('보호의 오라','#9fdfff');}}}
 if((r=rk('shade'))){T.sh=(T.sh||0)-dt;if(T.sh<=0){const L=near(260).slice(0,3);if(L.length){T.sh=10-r;procTxt('그림자 습격','#b48aff');L.forEach((m,i)=>later(i*0.12,()=>{if(m.dead)return;ents.slashes.push({x:m.x,y:m.y-16,ang:R()*6.28,life:0,max:0.22,r:34,col:'#b48aff',w:6});burst(m.x,m.y-16,10,'#6a4a9a',150);hitMon(m,1.4+0.25*r,0);}));}else T.sh=0.5;}}
 if((r=rk('holybolt'))){T.hb=(T.hb||0)-dt;if(T.hb<=0){const m=near(300)[0];if(m){T.hb=9-r;pillar(m.x,m.y,'#ffe38a',12);fx('fx_smite',m.x,m.y-60,1.6,0.4)||fx('fx_lightning',m.x,m.y-60,1.6,0.3);hitMon(m,2+0.4*r,0);}else T.hb=0.5;}}
 if((r=rk('bless'))){T.bl=(T.bl||0)-dt;if(T.bl<=0){T.bl=12-r;const f=(3+r)/100;if(P.hp<maxHp()){P.hp=Math.min(maxHp(),P.hp+maxHp()*f);}for(const a of ents.actors)if(a.fighter&&!a.down&&!a.hostile&&Math.hypot(a.x-P.x,a.y-P.y)<220)a.hp=Math.min(a.maxhp,a.hp+a.maxhp*f);healPets(P.x,P.y,240,f);ents.rings.push({x:P.x,y:P.y-6,life:0,max:0.6,r:120,col:'255,170,210'});}}
 if((r=rk('orbs'))){P.orbA=(P.orbA||0)+dt*3.4;const k=1+Math.ceil(r/2),now=performance.now();for(let i=0;i<k;i++){const a=P.orbA+i*Math.PI*2/k,ox=P.x+Math.cos(a)*58,oy=P.y-16+Math.sin(a)*34;for(const m of ents.mons){if(m.dead||(m._orbT||0)>now)continue;if(Math.hypot(m.x-ox,m.y-16-oy)<16+m.r){m._orbT=now+550;hitMon(m,0.45+0.1*r,a+Math.PI/2);burst(ox,oy,6,'#c77dff',120);}}}}}
function drawProc(c,t){if(P&&(P.confT||0)>0&&IMG.st_confuse){const s=20;c.drawImage(IMG.st_confuse,P.x-s/2,P.y-74+Math.sin(t*6)*2,s,s);}if(!P||!rk('orbs')||!inFight())return;const r=rk('orbs'),k=1+Math.ceil(r/2);for(let i=0;i<k;i++){const a=(P.orbA||0)+i*Math.PI*2/k,ox=P.x+Math.cos(a)*58,oy=P.y-16+Math.sin(a)*34;if(IMG.fx_orb){const s2=30;c.drawImage(IMG.fx_orb,ox-s2/2,oy-s2/2,s2,s2);continue;}const g=c.createRadialGradient(ox,oy,1,ox,oy,13);g.addColorStop(0,'#fff');g.addColorStop(0.35,'#d9a8ff');g.addColorStop(1,'rgba(150,80,255,0)');c.fillStyle=g;c.beginPath();c.arc(ox,oy,13,0,7);c.fill();for(let j=1;j<4;j++){const b=a-j*0.18;c.globalAlpha=0.25/j;c.fillStyle='#c77dff';c.beginPath();c.arc(P.x+Math.cos(b)*58,P.y-16+Math.sin(b)*34,6-j,0,7);c.fill();}c.globalAlpha=1;}}
const BRANCH=['⚔️ 검술','🛡️ 수호','🔮 원소','🌑 그림자','🔆 신성'];const BRC=['#ff9a4a','#6fb8ff','#c77dff','#8affc8','#ffe38a'];
const rk=id=>(P&&P.sk&&P.sk[id])||0;
const critCh=()=>0.12+0.03*rk('crit')+0.0012*SV('agi')+(eqv('w','crit')+eqv('r','crit')+eqv('h','crit'))/100;
function aimAng(range){let aim=null,ad=range;for(const m of ents.mons){if(m.dead)continue;const d=Math.hypot(m.x-P.x,m.y-P.y);if(d<ad){ad=d;aim=m;}}
 if(aim){P.face=aim.x<P.x?-1:1;return Math.atan2(aim.y-P.y,aim.x-P.x);}return Math.atan2(P.dir.y,P.dir.x);}
function later(t,fn){ents.timers.push({t,fn});}
function castSlot(i){castId(P.slots[i]);}
const SKM_MAX=10,skmLv=id=>(P.skm&&P.skm[id]&&P.skm[id].lv)||0,skmNeed=l=>Math.round(25*Math.pow(l+1,1.4)),skmCost=l=>Math.round(400*Math.pow(l+1,2.2));
function skXp(id){P.skm=P.skm||{};const m=P.skm[id]||(P.skm[id]={lv:0,xp:0});if(m.lv>=SKM_MAX)return;const nd=skmNeed(m.lv);if(m.xp>=nd)return;m.xp++;if(m.xp>=nd){toast(`★ ${SK[id].n} 숙련 강화 가능! — 스킬창`);news(`★ ${SK[id].n} 숙련도가 가득 찼다 (강화 가능)`,'me');}}
function skMaster(id){const m=(P.skm||{})[id];if(!m||m.lv>=SKM_MAX||m.xp<skmNeed(m.lv))return;const c=skmCost(m.lv);if(P.gold<c){toast('골드 부족');return;}P.gold-=c;m.xp-=skmNeed(m.lv);m.lv++;sfx('promote');toast(`★ ${SK[id].n} 숙련 ${m.lv}단계! (피해 +${m.lv*4}%)`);openSkills();}
const AUTOMUL=1.5,autoN=()=>2+(P.lv>=40?1:0)+(P.lv>=80?1:0);
const AUTO_SELF={heal:1,angel:1,aegis:1,regen:1,iron:1,warcry:1,berserk:1,evade:1,bloodlust:1,swift:1,focus:1,clone:1,shadowstep:1};
function autoEquip(id,i){P.aslots=P.aslots||[];const j=P.aslots.indexOf(id);if(j===i)P.aslots[i]=null;else{if(j>=0)P.aslots[j]=null;P.aslots[i]=id;}const k=P.slots.indexOf(id);if(k>=0)P.slots[k]=null;openSkills();}
function autoTick(dt){if(!P||P.dead||P.dash||!CUR||(CUR.kind==='town'&&!CUR.invaded)||paused)return;P.aslots=P.aslots||[];P.autoT=(P.autoT||0)-dt;if(P.autoT>0)return;P.autoT=0.35;
 const n=autoN(),near=ents.mons.some(m=>!m.dead&&Math.hypot(m.x-P.x,m.y-P.y)<230);for(let i=0;i<n;i++){const id=P.aslots[i];if(!id||!SK[id]||!rk(id)||(P.cd[id]||0)>0||P.mp<SK[id].mp)continue;
  const self=AUTO_SELF[id];if(id==='heal'||id==='angel'){if(P.hp>maxHp()*0.55)continue;}else if(!near)continue;
  if(P.mp-SK[id].mp<maxMp()*0.15&&id!=='heal'&&id!=='angel')continue;castId(id,true);P.autoT=1.1;floatT(P.x,P.y-74,'⚙ '+SK[id].n,'#9fdfff',11);return;}}
function castId(id,auto){if(!id||P.dead||P.dash)return;if(CUR.kind==='town'&&!CUR.invaded){if(!auto)toast('마을에서는 스킬을 쓸 수 없다');return;}
 const s=SK[id],r=rk(id);if(!r)return;if((P.cd[id]||0)>0)return;if(P.mp<s.mp){if(!auto)toast('MP가 부족하다');return;}P.mp-=s.mp;const ml=skmLv(id);P.cd[id]=s.cd*(1-0.06*rk('arcane'))*(1-0.01*ml);P.skBoost=(s.br===2?1+0.08*rk('pyro'):1)*(1+0.04*ml)*(1+0.004*SV('int'));skXp(id);wkEv('cast');P.skBoostT=2.5;castFX(s.br);sfx(id==='fireball'||id==='meteor'?'fire':id==='thunder'?'thunder':id==='heal'?'heal':'skill');SKFN[id](r);}
function hitArea(x,y,rad,mult,ang,extra){for(const m of ents.mons){if(m.dead)continue;if(Math.hypot(m.x-x,m.y-y)<rad+m.r){hitMon(m,mult,ang===undefined?Math.atan2(m.y-y,m.x-x):ang);extra&&extra(m);}}
 for(const a of ents.actors){if(!a.hostile||a.remove)continue;if(Math.hypot(a.x-x,a.y-y)<rad+a.r)hitActor(a,mult,ang===undefined?Math.atan2(a.y-y,a.x-x):ang);}}
function explode(x,y,rad,mult){burst(x,y,30,'#ff8a2a',240);burst(x,y,14,'#ffe14a',180);ents.rings.push({x,y,life:0,max:0.35,r:rad,col:'255,150,60'});fx('fx_explosion',x,y-10,rad/30,0.45);cam.shake=Math.max(cam.shake,7);hitArea(x,y,rad,mult);}
const SKFN={
 spin(r){P.spin=1;cam.shake=8;ents.rings.push({x:P.x,y:P.y-8,life:0,max:0.4,r:88,col:'160,255,255'});fx('fx_spin',P.x,P.y-16,2.8,0.4);
  for(let i=0;i<4;i++)ents.slashes.push({x:P.x,y:P.y-12,ang:i*Math.PI/2,life:-i*0.04,max:0.26,r:52,col:'#aff',w:7});hitArea(P.x,P.y,88,2+0.3*r);},
 dash(r){const a=aimAng(220);P.dash={vx:Math.cos(a)*720,vy:Math.sin(a)*720,t:0.2,hit:new Set(),mult:1.8+0.3*r,ang:a};P.inv=0.35;if(Math.abs(Math.cos(a))>0.2)P.face=Math.cos(a)<0?-1:1;fx('fx_dash',P.x,P.y-16,1.8,0.3,a);},
 flurry(r){const a=aimAng(130);for(let k=0;k<3;k++)later(k*0.12,()=>{P.swing=1;const aa=a+(k-1)*0.35;
   ents.slashes.push({x:P.x+Math.cos(a)*22,y:P.y-14+Math.sin(a)*16,ang:aa+(k%2?Math.PI:0),life:0,max:0.18,r:34,col:'#fff',w:6});fx('fx_slash',P.x+Math.cos(a)*30,P.y-16+Math.sin(a)*20,1.3,0.2,aa);
   for(const m of ents.mons){if(m.dead)continue;const dx=m.x-P.x,dy=m.y-P.y,d=Math.hypot(dx,dy);if(d>66+m.r)continue;const da=Math.abs(((Math.atan2(dy,dx)-a)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI);if(da>1.3&&d>m.r+10)continue;hitMon(m,1+0.15*r,a);}});},
 wave(r){const a=aimAng(300);P.swing=1;ents.pproj.push({kind:'wave',x:P.x+Math.cos(a)*16,y:P.y-16+Math.sin(a)*12,vx:Math.cos(a)*380,vy:Math.sin(a)*380,ang:a,life:0.85,mult:2.2+0.3*r,r:22,hit:new Set()});},
 split(r){const a=aimAng(240);P.castT=0.4;later(0.22,()=>{cam.shake=12;const L=240;
   for(let d=20;d<=L;d+=14){const x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d;later(d/L*0.18,()=>{burst(x,y,6,'#a08060',160);burst(x,y,3,'#ffd080',120);fx('fx_crack',x,y-10,1,0.4);});}
   for(const m of ents.mons){if(m.dead)continue;const dx=m.x-P.x,dy=m.y-P.y,pr=dx*Math.cos(a)+dy*Math.sin(a);if(pr<0||pr>L+m.r)continue;if(Math.abs(-dx*Math.sin(a)+dy*Math.cos(a))<34+m.r){hitMon(m,4+0.6*r,a);m.stun=1.5;}}});},
 warcry(r){P.castT=0.4;P.buff.atk=0.2+0.05*r;P.buff.atkT=10;ents.rings.push({x:P.x,y:P.y-8,life:0,max:0.6,r:110,col:'255,200,60'});fx('fx_buff',P.x,P.y-24,1.8,0.6);floatT(P.x,P.y-64,'공격력 UP!','#ffb84a',14);},
 iron(r){P.castT=0.4;P.buff.def=Math.min(0.75,0.4+0.05*r);P.buff.defT=6;ents.rings.push({x:P.x,y:P.y-8,life:0,max:0.5,r:70,col:'120,180,255'});fx('fx_shield',P.x,P.y-26,1.6,0.5);floatT(P.x,P.y-64,'철벽!','#9ad0ff',14);},
 heal(r){P.castT=0.4;const h=Math.round(maxHp()*(0.25+0.05*r));P.hp=Math.min(maxHp(),P.hp+h);healPets(P.x,P.y,240,0.25+0.05*r,true);for(const a of ents.actors)if(a.fighter&&a.npc&&a.npc.party&&!a.down&&Math.hypot(a.x-P.x,a.y-P.y)<240)a.hp=Math.min(a.maxhp,a.hp+a.maxhp*(0.15+0.03*r));floatT(P.x,P.y-60,'+'+h,'#6fff8a',16);fx('fx_heal',P.x,P.y-30,1.8,0.7);
  for(let i=0;i<30;i++)ents.parts.push({x:P.x+rnd(-18,18),y:P.y-rnd(0,10),vx:rnd(-8,8),vy:rnd(-120,-50),gr:0,life:0,max:rnd(.6,1),col:pick(['#7dff9a','#eaffd0','#fff']),s:rnd(1.5,3)});},
 fireball(r){const a=aimAng(320);P.castT=0.3;ents.pproj.push({kind:'fire',x:P.x+Math.cos(a)*14,y:P.y-18+Math.sin(a)*10,vx:Math.cos(a)*300,vy:Math.sin(a)*300,ang:a,life:1.3,mult:2.5+0.4*r,r:10,hit:new Set()});},
 thunder(r){P.castT=0.4;const n=3+Math.floor(r/2);const ts=ents.mons.filter(m=>!m.dead&&Math.hypot(m.x-P.x,m.y-P.y)<300).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y)).slice(0,n);
  if(!ts.length){floatT(P.x,P.y-60,'대상 없음','#ccc',12);P.cd.thunder=0.5;P.mp+=SK.thunder.mp;return;}
  ts.forEach((m,i)=>later(i*0.08,()=>{if(m.dead)return;ents.bolts.push({x:m.x,y:m.y,life:0,max:0.3,seed:Math.floor(R()*1e6)});fx('fx_lightning',m.x,m.y-60,2,0.3);hitMon(m,2.8+0.4*r,Math.atan2(m.y-P.y,m.x-P.x));m.stun=Math.max(m.stun||0,0.4);cam.shake=Math.max(cam.shake,5);}));},
 frost(r){P.castT=0.4;ents.rings.push({x:P.x,y:P.y-6,life:0,max:0.5,r:120,col:'160,220,255'});fx('fx_frost',P.x,P.y-16,3.4,0.5);
  for(let i=0;i<40;i++){const a=R()*6.28,v=rnd(80,220);ents.parts.push({x:P.x,y:P.y-10,vx:Math.cos(a)*v,vy:Math.sin(a)*v*0.6,gr:0,life:0,max:rnd(.4,.7),col:pick(['#cfefff','#fff','#8fd8ff']),s:rnd(1.5,3)});}
  hitArea(P.x,P.y,120,1.5+0.3*r,undefined,m=>m.slow=3);},
 bladestorm(r){P.storm={t:3,k:0,m:0.7+0.1*r};fx('fx_bladestorm',P.x,P.y-16,3,0.6)||fx('fx_spin',P.x,P.y-16,3,0.6);cam.shake=8;},
 execute(r){const a=aimAng(140),m=nearMon(P.x+Math.cos(a)*40,P.y+Math.sin(a)*30,130);P.swing=1;if(!m){P.cd.execute=0.5;P.mp+=SK.execute.mp;floatT(P.x,P.y-60,'대상 없음','#ccc',12);return;}
  const low=m.hp<m.maxhp*0.35;later(0.12,()=>{hitMon(m,low?6+r:2.5+0.3*r,a);cam.shake=low?16:8;SFL.a=low?0.45:0.2;SFL.c='255,60,40';burst(m.x,m.y-20,low?50:20,'#ff3a2a',260);fx('fx_execute',m.x,m.y-24,2,0.4)||fx('fx_slash',m.x,m.y-24,2.4,0.3,a);if(low)floatT(m.x,m.y-80,'처형!','#ff4a3a',22,1.2);});},
 taunt(r){P.castT=0.4;P.buff.def=0.3+0.05*r;P.buff.defT=5;ents.rings.push({x:P.x,y:P.y-8,life:0,max:0.6,r:220,col:'255,90,60'});fx('fx_taunt',P.x,P.y-30,2.2,0.6);floatT(P.x,P.y-70,'덤벼라!','#ff8a6a',16);
  for(const m of ents.mons){if(m.dead||m.boss)continue;const d=Math.hypot(m.x-P.x,m.y-P.y);if(d<220){m.aggroT=8;m.kbx=(P.x-m.x)/d*10;m.kby=(P.y-m.y)/d*10;}}},
 aegis(r){P.castT=0.4;P.shield=maxHp()*(0.2+0.05*r);P.shieldT=8;fx('fx_aegis',P.x,P.y-28,1.8,0.7)||fx('fx_shield',P.x,P.y-28,1.8,0.7);sfx('shield');ents.rings.push({x:P.x,y:P.y-20,life:0,max:0.6,r:60,col:'140,220,255'});floatT(P.x,P.y-70,'보호막','#9fdfff',15);},
 quake(r){P.castT=0.5;for(let k=0;k<3;k++)later(k*0.35,()=>{cam.shake=18;SFL.a=0.15;SFL.c='200,150,90';ents.rings.push({x:P.x,y:P.y,life:0,max:0.5,r:170,col:'220,170,100'});fx('fx_quake',P.x,P.y-10,3.4,0.5)||fx('fx_crack',P.x,P.y-10,3,0.5);
   for(let i=0;i<30;i++){const a=R()*6.28,d=rnd(20,170);burst(P.x+Math.cos(a)*d,P.y+Math.sin(a)*d*0.6,2,'#a08060',120);}hitArea(P.x,P.y,170,2+0.4*r,undefined,m=>m.stun=2);});},
 chain(r){P.castT=0.35;let from={x:P.x,y:P.y-30};const hit=new Set();for(let k=0;k<4+r;k++){const m=nearMon(from.x,from.y+30,k?220:300,hit);if(!m)break;hit.add(m);const f={...from};later(k*0.09,()=>{if(m.dead)return;ents.bolts.push({x:m.x,y:m.y,x0:f.x,y0:f.y,life:0,max:0.3,seed:Math.floor(R()*1e6)});fx('fx_chain',m.x,m.y-30,1.4,0.3)||fx('fx_lightning',m.x,m.y-60,1.6,0.3);hitMon(m,2.2+0.35*r,0);m.stun=Math.max(m.stun||0,0.3);});from={x:m.x,y:m.y-30};}
  if(!hit.size){P.cd.chain=0.5;P.mp+=SK.chain.mp;floatT(P.x,P.y-60,'대상 없음','#ccc',12);}},
 blizzard(r){const m=nearMon(P.x,P.y,320),x=m?m.x:P.x+P.face*120,y=m?m.y:P.y;P.castT=0.4;for(let k=0;k<10;k++)later(k*0.4,()=>{ents.rings.push({x,y,life:0,max:0.4,r:110,col:'190,230,255'});if(k%3===0)fx('fx_blizzard',x,y-30,2.6,0.8)||fx('fx_frost',x,y-20,2.4,0.6);
   for(let i=0;i<18;i++)ents.parts.push({x:x+rnd(-110,110),y:y-rnd(60,140),vx:rnd(30,70),vy:rnd(120,220),gr:0,life:0,max:rnd(.4,.7),col:pick(['#fff','#cfefff','#9fd8ff']),s:rnd(1.5,3)});hitArea(x,y,110,0.6+0.1*r,undefined,mm=>mm.slow=1.5);});},
 nova(r){P.castT=0.5;SFL.a=0.5;SFL.c='220,160,255';[60,130,200].forEach((rad,k)=>later(k*0.22,()=>{const cols=['#ff7a2a','#7fd8ff','#ffe14a'];for(let i=0;i<10;i++){const a=i/10*6.28;burst(P.x+Math.cos(a)*rad,P.y+Math.sin(a)*rad*0.6,6,cols[k],200);}
   ents.rings.push({x:P.x,y:P.y,life:0,max:0.5,r:rad+30,col:['255,140,60','140,210,255','255,230,90'][k]});fx('fx_nova',P.x,P.y-20,1.4+k,0.5)||fx('fx_explosion',P.x,P.y-20,1.4+k,0.5);cam.shake=14;hitArea(P.x,P.y,rad+30,4+0.8*r);}));},
 shadowstep(r){const m=nearMon(P.x,P.y,280);if(!m){P.cd.shadowstep=0.5;P.mp+=SK.shadowstep.mp;floatT(P.x,P.y-60,'대상 없음','#ccc',12);return;}burst(P.x,P.y-20,24,'#5a3a8a',200);
  const side=m.x<P.x?-1:1,q=nearestOpen(CUR,m.x+side*34,m.y+2);P.x=q.x;P.y=q.y;P.face=-side;P.inv=Math.max(P.inv,0.3);fx('fx_shadow',P.x,P.y-24,1.6,0.4);burst(P.x,P.y-20,24,'#8a5aff',220);P.swing=1;hitMon(m,3+0.4*r,Math.atan2(m.y-P.y,m.x-P.x));m.stun=1;},
 poison(r){const a=aimAng(260);P.swing=1;for(const sp of[-0.22,0,0.22])ents.pproj.push({kind:'bolt',col:'#7dff5a',x:P.x+Math.cos(a)*14,y:P.y-18+Math.sin(a)*10,vx:Math.cos(a+sp)*460,vy:Math.sin(a+sp)*460,ang:a+sp,life:0.7,mult:1.2+0.2*r,r:10,hit:new Set(),single:true,onHit:m=>{m.poison={t:4,a:0,mult:0.35+0.07*r};}});},
 arrowrain(r){const m=nearMon(P.x,P.y,340),x=m?m.x:P.x+P.face*140,y=m?m.y:P.y;P.castT=0.35;fx('fx_arrowrain',x,y-40,2.4,1.3);for(let k=0;k<14;k++)later(0.1+k*0.08,()=>{const ax=x+rnd(-70,70),ay=y+rnd(-40,40);ents.slashes.push({x:ax,y:ay-26,ang:Math.PI/2,life:0,max:0.12,r:18,col:'#ffe9b0',w:2});burst(ax,ay,4,'#d8c09a',100);hitArea(ax,ay,38,0.8+0.12*r);});},
 clone(r){P.castT=0.3;fx('fx_clone',P.x,P.y-24,1.6,0.6);for(let k=0;k<8;k++)later(k*0.3,()=>{const m=nearMon(P.x,P.y,170);if(!m)return;const a=R()*6.28;ents.slashes.push({x:m.x+Math.cos(a)*10,y:m.y-16,ang:a,life:0,max:0.2,r:34,col:'#b48aff',w:6});burst(m.x+Math.cos(a)*24,m.y-20,10,'#6a4aaa',160);hitMon(m,0.9+0.15*r,a);});},
 assassin(r){const m=nearMon(P.x,P.y,300);if(!m){P.cd.assassin=0.5;P.mp+=SK.assassin.mp;floatT(P.x,P.y-60,'대상 없음','#ccc',12);return;}P.inv=Math.max(P.inv,1);SFL.a=0.35;SFL.c='60,20,90';
  for(let k=0;k<5;k++)later(k*0.11,()=>{if(m.dead)return;const a=k/5*6.28+R(),q=nearestOpen(CUR,m.x+Math.cos(a)*32,m.y+Math.sin(a)*20);P.x=q.x;P.y=q.y;P.face=m.x<P.x?-1:1;P.swing=1;ents.slashes.push({x:m.x,y:m.y-16,ang:a+Math.PI,life:0,max:0.16,r:40,col:'#e0c0ff',w:7});burst(m.x,m.y-18,14,'#8a5aff',220);hitMon(m,(2+0.4*r)*(k===4?2:1),a+Math.PI);cam.shake=k===4?14:5;});},
 smite(r){const m=nearMon(P.x,P.y,280);if(!m){P.cd.smite=0.5;P.mp+=SK.smite.mp;floatT(P.x,P.y-60,'대상 없음','#ccc',12);return;}P.castT=0.4;later(0.15,()=>{pillar(m.x,m.y,'#ffe38a',18);fx('fx_smite',m.x,m.y-60,2.2,0.5)||fx('fx_lightning',m.x,m.y-60,2,0.4);SFL.a=0.25;SFL.c='255,240,180';hitMon(m,(4+0.6*r)*(m.el==='dark'?1.5:1),0);m.stun=Math.max(m.stun||0,0.8);cam.shake=10;});},
 sanct(r){const x=P.x,y=P.y;P.castT=0.4;fx('fx_sanct',x,y-10,2.6,5);for(let k=0;k<10;k++)later(k*0.5,()=>{ents.rings.push({x,y,life:0,max:0.5,r:110,col:'255,235,150'});for(let i=0;i<10;i++)ents.parts.push({x:x+rnd(-100,100),y:y+rnd(-50,40),vx:0,vy:rnd(-70,-30),gr:0,life:0,max:rnd(.5,.9),col:pick(['#ffe38a','#fff']),s:rnd(1.5,3)});
   if(Math.hypot(P.x-x,P.y-y)<110){const h=Math.round(maxHp()*0.02*(1+0.2*r)*(1+0.06*rk('faith')));P.hp=Math.min(maxHp(),P.hp+h);}for(const a of ents.actors)if(a.fighter&&!a.down&&Math.hypot(a.x-x,a.y-y)<110)a.hp=Math.min(a.maxhp,a.hp+a.maxhp*0.03);healPets(x,y,110,0.04*(1+0.2*r));hitArea(x,y,110,0.5+0.1*r);});},
 judgment(r){const ts=ents.mons.filter(m=>!m.dead&&Math.hypot(m.x-P.x,m.y-P.y)<320).sort(()=>R()-0.5).slice(0,6+r);P.castT=0.4;if(!ts.length){P.cd.judgment=0.5;P.mp+=SK.judgment.mp;floatT(P.x,P.y-60,'대상 없음','#ccc',12);return;}
  ts.forEach((m,i)=>later(i*0.12,()=>{if(m.dead)return;pillar(m.x,m.y,'#fff3b0',14);fx('fx_judgment',m.x,m.y-70,1.8,0.45)||fx('fx_lightning',m.x,m.y-60,1.8,0.3);hitMon(m,(2.4+0.4*r)*(m.el==='dark'?1.5:1),0);cam.shake=Math.max(cam.shake,6);}));SFL.a=0.3;SFL.c='255,245,200';},
 angel(r){P.castT=0.5;P.inv=3+0.4*r;const h=Math.round(maxHp()*0.3*(1+0.06*rk('faith')));P.hp=Math.min(maxHp(),P.hp+h);healPets(P.x,P.y,220,0.3,true);floatT(P.x,P.y-70,'수호천사 +'+h,'#fff3b0',16,1.6);SFL.a=0.45;SFL.c='255,250,220';fx('fx_angel',P.x,P.y-40,2.4,1.2)||fx('fx_heal',P.x,P.y-30,2.4,1);
  for(let i=0;i<60;i++){const a=R()*6.28;ents.parts.push({x:P.x+Math.cos(a)*30,y:P.y-30+Math.sin(a)*20,vx:Math.cos(a)*rnd(20,90),vy:-rnd(40,120),gr:0,life:0,max:rnd(.6,1.2),col:pick(['#fff','#fff3b0','#ffe38a']),s:rnd(1.5,3.5)});}},
 meteor(r){P.castT=0.4;const fa=Math.atan2(P.dir.y,P.dir.x);let tx=P.x+Math.cos(fa)*140,ty=P.y+Math.sin(fa)*140,bd=320;
  for(const m of ents.mons){if(m.dead)continue;const d=Math.hypot(m.x-P.x,m.y-P.y);if(d<bd){bd=d;tx=m.x;ty=m.y;}}ents.meteors.push({x:tx,y:ty,t:0,max:0.9,r:120,mult:7+r});},
};
function dashStep(dt){const D=P.dash;D.t-=dt;const ox=P.x,oy=P.y;moveEnt(P,D.vx*dt,D.vy*dt);if(R()<0.5)ents.ghosts.push({x:P.x,y:P.y,face:P.face,life:0,max:0.25});
 for(const m of ents.mons){if(m.dead||D.hit.has(m))continue;if(Math.hypot(m.x-P.x,m.y-P.y)<m.r+26){D.hit.add(m);hitMon(m,D.mult,D.ang);}}
 if(D.t<=0||Math.hypot(P.x-ox,P.y-oy)<0.3){P.dash=null;ents.slashes.push({x:P.x+Math.cos(D.ang)*14,y:P.y-14,ang:D.ang,life:0,max:0.2,r:34,col:'#bff',w:6});}}
function fx(key,x,y,s,dur,rot){const img=IMG[key];if(!img||!ents)return false;ents.fxs.push({img,x,y,s,dur,rot:rot||0,t:0});return true;}
function skPreOk(id){const p=SK[id].pre;if(!p)return true;return Array.isArray(p)?p.some(x=>rk(x)>0):rk(p)>0;}
function skExBy(id){const e=SK[id].ex;if(!e)return null;return Object.keys(SK).find(k=>k!==id&&SK[k].ex===e&&rk(k)>0)||null;}
function learn(id){const s=SK[id],r=rk(id);if(P.sp<=0||r>=s.max||P.lv<s.req+r*2||!skPreOk(id)||skExBy(id))return;P.sp--;P.sk[id]=r+1;
 if(s.type==='a'&&r===0){const e=P.slots.indexOf(null);if(e>=0)P.slots[e]=id;}castFX(s.br);sfx('levelup');toast(`${s.ic} ${s.n} ${r?'강화':'습득'}! (${r+1}/${s.max})`);openSkills();}
function skReset(){const tot=Object.values(P.sk).reduce((a,b)=>a+b,0)-1,cost=Math.max(20,P.lv*2);if(tot<=0){toast('되돌릴 스킬이 없다');return;}if((P.dia||0)<cost){toast(`다이아 ${cost}개가 필요하다`);return;}
 P.dia-=cost;P.sk={spin:1};P.slots=['spin',null,null,null];P.sp+=tot;toast(`스킬 초기화! SP ${tot} 반환`);openSkills();}
function equip(id,i){if(P.aslots){const a=P.aslots.indexOf(id);if(a>=0)P.aslots[a]=null;}const j=P.slots.indexOf(id);if(j===i)P.slots[i]=null;else{if(j>=0)P.slots[j]=P.slots[i];P.slots[i]=id;}openSkills();}
const SKSEL={v:"spin",pop:0};
const skIc=(id,sz)=>IMG['sk_'+id]?`<img src="${IMG['sk_'+id].src}" style="width:${sz}px;height:${sz}px;vertical-align:middle;pointer-events:none;border-radius:6px">`:SK[id].ic;
const SKB={v:0};
function openSkills(){const b=SKB.v,col=BRC[b],ids=Object.keys(SK).filter(k=>SK[k].br===b);
 const W=Math.min(640,innerWidth-60),gy=96,top=34,rows=Math.max(...ids.map(k=>SK[k].row))+1,H=top+rows*gy+10;
 const pos={};ids.forEach(id=>pos[id]={x:W/2+SK[id].col*W*0.27,y:top+SK[id].row*gy+20});
 const state=id=>{const s=SK[id],r=rk(id),nr=s.req+r*2,pre=skPreOk(id),exb=skExBy(id);return{r,nr,pre,exb,can:P.sp>0&&r<s.max&&P.lv>=nr&&pre&&!exb,lock:P.lv<s.req||!pre||!!exb};};
 let lines='';for(const id of ids){const p=SK[id].pre;if(!p)continue;for(const q of [].concat(p)){if(!pos[q])continue;const a=pos[q],c=pos[id],on=rk(q)>0&&rk(id)>0,half=rk(q)>0;
  lines+=`<path d="M${a.x} ${a.y+30} C${a.x} ${(a.y+c.y)/2},${c.x} ${(a.y+c.y)/2},${c.x} ${c.y-31}" fill="none" stroke="${on?col:half?'#8a7a62':'#3a3026'}" stroke-width="${on?5:3}" ${half&&!on?'stroke-dasharray="6 6" class="flow"':''} ${on?`style="filter:drop-shadow(0 0 6px ${col})"`:''}/>`;}}
 const exr={};ids.forEach(id=>{const e=SK[id].ex;if(e)(exr[e]=exr[e]||[]).push(id);});
 const vs=Object.values(exr).map(g=>{const y=pos[g[0]].y;return`<div class="skvs" style="left:${W/2}px;top:${y}px">택1</div>`;}).join('');
 if(!SKSEL.v||!SK[SKSEL.v]||SK[SKSEL.v].br!==b)SKSEL.v=ids[0];
 const nodes=ids.map(id=>{const s=SK[id],st=state(id),p=pos[id];
  return`<div class="sn ${s.type==='p'?'p':''} ${st.r?'on':''} ${st.can?'can':''} ${st.lock?'lock':''} ${SKSEL.v===id?'sel':''}" style="left:${p.x}px;top:${p.y}px;--bc:${col}" onclick="event.stopPropagation();SKSEL.v='${id}';SKSEL.pop=1;openSkills()">${skIc(id,44)}<span class="rk">${st.r}/${s.max}</span>${skmLv(id)?`<span style="position:absolute;left:-4px;top:-8px;font-size:10px;color:#ffd23f;text-shadow:0 0 3px #000">★${skmLv(id)}</span>`:''}<span class="lv">${s.n}</span>${st.lock&&P.lv<s.req?`<span class="rq">Lv${s.req}</span>`:''}</div>`;}).join('');
 const id=SKSEL.v,s=SK[id],st=state(id);
 const why=st.r>=s.max?'':!st.can?(st.exb?`「${SK[st.exb].n}」과(와) 함께 배울 수 없다`:!st.pre?`먼저 「${[].concat(s.pre).map(x=>SK[x].n).join('」 또는 「')}」`:P.lv<st.nr?`Lv${st.nr}에 ${st.r?'강화':'습득'} 가능`:'스킬 포인트 부족'):'';
 const det=`<div class="skd" style="--bc:${col}"><span class="x" style="float:right;cursor:pointer;color:#ff9a8a;font-size:18px;line-height:1" onclick="event.stopPropagation();SKSEL.pop=0;openSkills()">✕</span><div class="skdh"><div class="skdi">${skIc(id,56)}</div><div><b style="font-size:16px">${s.n}</b><div class="mut" style="font-size:11.5px">${s.type==='a'?'액티브':'패시브'} · ${BRANCH[s.br]}${s.ex?' · 택1':''}</div><div class="gold">${st.r}/${s.max}</div></div></div>
  <div class="nd" style="font-size:13px">${s.d(Math.max(1,st.r))}</div>${s.type==='a'?`<div class="mut" style="font-size:11.5px">MP ${s.mp} · 쿨타임 ${s.cd}초</div>`:''}${s.type==='a'&&st.r?(()=>{const m=(P.skm||{})[id]||{lv:0,xp:0},nd=skmNeed(m.lv),full=m.lv<SKM_MAX&&m.xp>=nd;return`<div class="nd" style="margin-top:5px"><b style="color:#ffd23f">숙련 ${'★'.repeat(m.lv)}${'☆'.repeat(SKM_MAX-m.lv)}</b> <span class="mut" style="font-size:11px">피해 +${m.lv*4}% · 쿨타임 -${m.lv}%</span>${m.lv<SKM_MAX?`<div style="height:6px;background:#0008;border-radius:3px;margin-top:3px;overflow:hidden"><div style="width:${Math.min(100,m.xp/nd*100)}%;height:100%;background:${full?'#ffd23f':'#7a9aff'}"></div></div><span class="mut" style="font-size:10.5px">사용 ${m.xp}/${nd}회 — 가득 차면 강화</span> ${full?`<button class="btn s" ${P.gold<skmCost(m.lv)?'disabled':''} onclick="skMaster('${id}')">★ 숙련 강화 ${fmt(skmCost(m.lv))}G</button>`:''}`:''}</div>`;})():''}
  ${st.r&&st.r<s.max?`<div class="nd mut">다음: ${s.d(st.r+1)}</div>`:''}${why?`<div class="nd dn">${why}</div>`:''}
  <div class="nb">${st.r<s.max?`<button class="btn" ${st.can?'':'disabled'} onclick="learn('${id}')">${st.r?'강화 '+st.r+'→'+(st.r+1):'배우기'} (SP 1)</button>`:'<span class="gold">마스터</span>'}</div>
  ${s.type==='a'&&st.r?`<div class="nb"><span class="mut" style="align-self:center">슬롯</span>${[0,1,2,3].map(i=>`<button class="btn s ${P.slots[i]===id?'':'g'}" onclick="equip('${id}',${i})">${i+1}</button>`).join('')}</div>`:''}</div>`;
 const pts=k=>Object.keys(SK).filter(x=>SK[x].br===k).reduce((a,x)=>a+rk(x),0);
 openModal(`<h2>🌟 스킬 <span class="gold" style="float:right">SP ${P.sp} · Lv${P.lv}</span></h2>
 <div class="slots">${P.slots.map((x,i)=>`<div class="slot"><b>${i+1}</b> ${x?skIc(x,22)+' '+SK[x].n:'<span class="mut">비어 있음</span>'}</div>`).join('')}</div>
 <div class="tabs">${BRANCH.map((n,k)=>`<button class="tab sktab ${b===k?'on':''}" style="--bc:${BRC[k]}" onclick="SKB.v=${k};SKSEL.v=null;openSkills()">${n} <span class="mut">${pts(k)}</span></button>`).join('')}</div>
 <div class="skw"><div class="sktree" style="--bc:${col}" onclick="if(SKSEL.pop){SKSEL.pop=0;openSkills();}"><div class="stree" style="width:${W}px;height:${H+(SKSEL.pop?150:0)}px"><svg width="${W}" height="${H}">${lines}</svg>${vs}${nodes}${SKSEL.pop?(()=>{const p=pos[id],nw=W<520,pw=nw?W-8:270,lx=nw?4:(p.x<W/2?p.x+42:p.x-42-pw),ty=nw?p.y+48:Math.max(4,p.y-46);return`<div class="spop2" style="left:${clamp(lx,4,W-pw-4)}px;top:${ty}px;width:${pw}px" onclick="event.stopPropagation()">${det}</div>`;})():''}</div></div></div>
 <div style="display:flex;gap:6px;margin-top:8px"><button class="btn g" style="flex:1" onclick="closeModal()">닫기</button><button class="btn g s" onclick="skReset()">초기화 💎${Math.max(20,P.lv*2)}</button></div>`,true);}
