'use strict';
// =====================================================================
//  몬스터
// =====================================================================
function rmi(gi){const g=GROUNDS[gi];return ri(0,(g?g.mons.length:3)-1);}
const monIdx=gi=>GROUNDS[gi].mons.map((_,i)=>i);
function mkMon(gi,ti,boss){const g=GROUNDS[gi];const mi=boss?-1:(ti<0||ti>=g.mons.length?ri(0,g.mons.length-1):ti);const d=boss?g.boss:g.mons[mi];const surge=isSurge(gi);
 const aw=awk(gi)&&CUR&&!CUR.pd&&!CUR.raid&&CUR.gi===gi;const elite=!boss&&R()<(surge?0.15:aw?0.12:0.06);let lv=boss?g.lv+4:g.lv+ri(0,2)+(surge?1:0);if(aw)lv=Math.max(lv,P.lv+(boss?4:ri(-2,1)));const hp=Math.round((20+lv*14)*(boss?9:elite?2.3:1)*2.1);
 const el0=GEL(g);return{el:el0==='none'&&d[1]==='ghost'?'dark':el0,skCd:rnd(2,6),mi,name:(aw?'각성 ':'')+(elite?'정예 ':'')+d[0],shape:d[1],color:d[2],id:d[3],lv,hp,maxhp:hp,atk:(3+lv*2.6)*(boss?1.5:elite?1.3:1)*1.3,def:lv*1.2,
  vt:g.vt||0,spd:boss?55:rnd(50,74),r:(boss?24:elite?15:12)*(VT[g.vt||0].sc),sc:boss?0.62:0.44,boss,elite,ranged:d[1]==='ghost',x:0,y:0,hx:0,hy:0,t:rnd(0,2),face:-1,flash:0,kbx:0,kby:0,
  atkCd:rnd(.5,1.5),wind:0,target:null,aggroT:0,slamT:4,anim:R()*10,lunge:0,dead:false,deadT:0,respawn:0,wx:0,wy:0,wander:false,gi,awk:aw};}
function spawnMon(m,old){if(m.raid||m.kind==='town'){if(old)old.respawn=1e9;return;}let mon;if(m.pd){if(!old||old.pdi==null||!P.dun||!P.dun.mons[old.pdi]){if(old)old.respawn=999;return;}mon=pdMon(old.pdi);if(mon.boss&&m.bossPt){mon.x=mon.hx=m.bossPt.x;mon.y=mon.hy=m.bossPt.y;ents.mons[ents.mons.indexOf(old)]=mon;return;}}else mon=mkMon(m.gi,-1,false);let p=pick(m.spawns);for(let k=0;k<12;k++){if(Math.hypot(p[0]-P.x,p[1]-P.y)>260)break;p=pick(m.spawns);}
 mon.x=mon.hx=p[0];mon.y=mon.hy=p[1];if(old){const i=ents.mons.indexOf(old);ents.mons[i]=mon;}else ents.mons.push(mon);}
function updMon(m,dt){
 if(m.dead){m.deadT+=dt;m.respawn-=dt;if(m.respawn<=0){if(m.raid){m.respawn=1e9;return;}if(m.boss&&!CUR.pd){const b=mkMon(m.gi,-1,true);b.x=b.hx=CUR.bossPt.x;b.y=b.hy=CUR.bossPt.y;ents.mons[ents.mons.indexOf(m)]=b;}else spawnMon(CUR,m);}return;}
 if(m.poison){m.poison.t-=dt;m.poison.a+=dt;if(m.poison.a>=0.5){m.poison.a=0;const dd=dmgCalc(pAtk(),m.def*0.5,m.poison.mult);m.hp-=dd;floatT(m.x+rnd(-6,6),m.y-40,''+dd,'#8aff5a',11);if(R()<0.5)burst(m.x,m.y-16,4,'#7dff5a',80);if(m.hp<=0){m.poison=null;killMon(m);return;}}if(m.poison&&m.poison.t<=0)m.poison=null;}
 if(m.taunt){m.taunt.t-=dt;if(m.taunt.t<=0||m.taunt.a.down||m.taunt.a.remove)m.taunt=null;}
 m.stun=(m.stun||0)-dt;m.slow=(m.slow||0)-dt;if(m.stun>0){m.wind=0;m.flash=Math.max(0,m.flash-dt*5);if(Math.abs(m.kbx)+Math.abs(m.kby)>0.3){moveEnt(m,m.kbx*dt*12,m.kby*dt*12);m.kbx*=0.82;m.kby*=0.82;}return;}
 const spd=m.slow>0?m.spd*0.4:m.spd;
 m.anim+=dt;m.flash=Math.max(0,m.flash-dt*5);m.atkCd-=dt;m.aggroT-=dt;m.lunge=Math.max(0,m.lunge-dt);
 if(Math.abs(m.kbx)+Math.abs(m.kby)>0.3){moveEnt(m,m.kbx*dt*12,m.kby*dt*12);m.kbx*=0.82;m.kby*=0.82;}
 if(m.wind>0){m.wind-=dt;if(m.wind<=0)monStrike(m);return;}
 let tgt=null,td=1e9;const ag=m.aggroT>0?420:(m.boss?240:150);
 const consider=e=>{if(e.down)return;const d=Math.hypot(e.x-m.x,e.y-m.y)*(m.taunt&&m.taunt.a===e&&m.taunt.t>0?0.05:1);if(d<ag&&d<td){td=d;tgt=e;}};
 if(!P.dead)consider(P);for(const a of ents.actors)if(a.fighter&&!a.leaving&&a.hp>0)consider(a);if(ents.pets&&!CUR.pd)for(const a of ents.pets)if(a.hp>0)consider(a);
 if(Math.hypot(m.hx-m.x,m.hy-m.y)>420&&!m.boss){tgt=null;m.aggroT=0;}
 if(m.charge){const ch=m.charge;ch.t-=dt;moveEnt(m,ch.vx*dt,ch.vy*dt);if(R()<0.6)ents.parts.push({x:m.x,y:m.y-10,vx:0,vy:0,gr:0,life:0,max:0.25,col:'rgba(255,255,255,.6)',s:3});
  if(!ch.hit&&tgt&&Math.hypot(tgt.x-m.x,tgt.y-m.y)<m.r+14){ch.hit=1;if(tgt===P)playerHurt(m.atk*1.3,m.el);else actorHurt(tgt,m.atk*1.3);cam.shake=Math.max(cam.shake,4);}if(ch.t<=0)m.charge=null;return;}
 m.skCd-=dt;if(tgt&&m.skCd<=0&&td<240&&!m.stun){monSkill(m,tgt,td);m.skCd=rnd(5,8)*(m.boss?0.6:m.elite||m.vt?0.75:1);if(m.charge)return;}
 if(m.boss){if(tgt&&bossAI(m,tgt,td,dt))return;m.slamT-=dt;if(tgt&&td<240&&m.slamT<=0){m.slamT=rnd(4.5,6.5);ents.tele.push({x:tgt.x,y:tgt.y,r:78,t:0,max:0.95,atk:m.atk*1.5});floatT(m.x,m.y-90,'!!','#ff5a3a',22);}}
 if(tgt){m.face=tgt.x<m.x?-1:1;const range=m.ranged?150:m.r+(tgt.r||10)+10;
  if(td>range)navTo(m,tgt.x,tgt.y,spd,dt);else if(m.ranged&&td<80)moveEnt(m,-(tgt.x-m.x)/td*spd*dt*0.7,-(tgt.y-m.y)/td*spd*dt*0.7);
  if(td<=range+6&&m.atkCd<=0){m.wind=m.boss?0.55:m.elite?0.4:0.45;m.target=tgt;m.atkCd=m.boss?1.4:rnd(1.1,1.6);}}
 else{m.t-=dt;if(m.t<=0){m.t=rnd(1.5,3.5);const a=R()*6.28,d=R()*80;m.wx=m.hx+Math.cos(a)*d;m.wy=m.hy+Math.sin(a)*d;m.wander=R()<0.6;}
  if(m.wander&&stepToward(m,m.wx,m.wy,spd*0.4,dt))m.wander=false;}}
const MSK={bird:'shot',bat:'dive',wolf:'charge',rat:'charge',lizard:'charge',spider:'web',slime:'spit',toad:'spit',shroom:'spore',gob:'spear',fishman:'spear',skel:'spear',ogre:'slam',golem:'slam',ghost:'blink',dragon:'breath',crab:'charge',ghoul:'charge'};
const MSKN={shot:'깃털 날리기',dive:'급강하',charge:'돌진',web:'거미줄',spit:'독 뱉기',spore:'포자 구름',spear:'창 던지기',slam:'대지 강타',blink:'순간이동',breath:'화염 숨결'};
function mShot(m,t,o){const a=Math.atan2(t.y-14-(m.y-22),t.x-m.x)+(o.sp||0),v=o.v||200;ents.projs.push(Object.assign({x:m.x,y:m.y-22,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:2,atk:m.atk*(o.k||1),col:m.color,el:m.el},o));}
// ---------- 보스 패턴 ----------
const BPAT={summon:['소환',1],blink:['순간이동 강타',1],charge:['광폭 돌격',1],confuse:['혼란의 파동',2],invuln:['무적의 껍질',2],drain:['마나 흡수',1],clone:['분신술',2],meteor:['운석 낙하',1],nova:['파멸의 고리',1],pull:['끌어당기기',2]};
function bossSay(m,k,col){const n=BPAT[k][0];floatT(m.x,m.y-130,'⚠ '+n+'!',col||'#ff7a4a',18,1.3);if(Math.hypot(m.x-P.x,m.y-P.y)<520){toast(`${m.name.replace(/^👑 /,'')}: ${n}!`);cam.shake=Math.max(cam.shake,6);}}
function bossAI(m,t,d,dt){if(m.clone||m.summoned)return false;m.invT=Math.max(0,(m.invT||0)-dt);const low=m.hp<m.maxhp*0.5;
 if(low&&!m.enraged){m.enraged=true;m.atk*=1.25;m.spd*=1.2;floatT(m.x,m.y-140,'분노!','#ff3a2a',22,1.5);SFL.a=0.3;SFL.c='255,40,20';toast(`${m.name} 분노 상태!`);sfx('enrage');}
 if(m.drainT>0){m.drainT-=dt;if(Math.hypot(P.x-m.x,P.y-m.y)<300&&!P.dead){const x=Math.min(P.mp,24*dt);P.mp-=x;m.hp=Math.min(m.maxhp,m.hp+x*m.maxhp*0.002);if(R()<0.5)ents.parts.push({x:P.x,y:P.y-30,vx:(m.x-P.x)*1.6,vy:(m.y-60-P.y)*1.6,gr:0,life:0,max:0.6,col:'#6ab0ff',s:3});}return false;}
 m.bp=(m.bp==null?rnd(3,5):m.bp)-dt*(low?1.4:1);if(m.bp>0||d>420)return false;m.bp=rnd(6,9);
 const pool=['summon','blink','charge','meteor','nova','drain'];if(low||m.raidBoss||m.legBoss)pool.push('confuse','invuln','clone','pull');const k=pick(pool.filter(x=>x!==m.lastPat));m.lastPat=k;
 const col={confuse:'#d88aff',invuln:'#9fdfff',drain:'#6ab0ff',clone:'#b48aff',summon:'#8aff8a'}[k];bossSay(m,k,col);sfx('b_'+k);fx('fx_b_'+(k==='nova'?'ruin':k),k==='meteor'||k==='nova'||k==='confuse'?t.x:m.x,(k==='meteor'||k==='nova'||k==='confuse'?t.y:m.y)-40,k==='nova'||k==='invuln'?3:2.4,0.9);const a=Math.atan2(t.y-m.y,t.x-m.x),A=m.atk;
 if(k==='summon'){fx('fx_m_spore',m.x,m.y-30,2.4,0.8);for(let i=0;i<3+(low?2:0);i++){const s=mkMon(m.gi,-1,false),q=nearestOpen(CUR,m.x+Math.cos(i*2.1)*70,m.y+Math.sin(i*2.1)*40);s.lv=m.lv;s.maxhp=s.hp=Math.round(m.maxhp*0.04);s.atk=A*0.35;s.def=m.def*0.6;s.x=s.hx=q.x;s.y=s.hy=q.y;s.summoned=true;s.noloot=true;s.raid=true;s.aggroT=10;s.name='소환된 '+s.name;burst(q.x,q.y-16,16,'#8aff8a',160);ents.mons.push(s);}}
 else if(k==='blink'){burst(m.x,m.y-30,30,'#5a2a8a',220);fx('fx_m_blink',m.x,m.y-30,2,0.5);const q=nearestOpen(CUR,t.x-Math.cos(a)*60,t.y-Math.sin(a)*40);m.x=q.x;m.y=q.y;fx('fx_m_blink',m.x,m.y-30,2,0.5);ents.tele.push({x:m.x,y:m.y,r:100,t:0,max:0.6,atk:A*1.4,el:m.el});}
 else if(k==='charge'){const v=520;m.charge={t:Math.min(0.8,d/v+0.2),vx:Math.cos(a)*v,vy:Math.sin(a)*v};fx('fx_m_charge',m.x,m.y-20,2.2,0.6,a);for(let i=1;i<=5;i++)ents.tele.push({x:m.x+Math.cos(a)*i*60,y:m.y+Math.sin(a)*i*60,r:46,t:-0.15*i,max:1.1,atk:A*0.8,el:'fire'});}
 else if(k==='meteor'){for(let i=0;i<6+(low?4:0);i++){const x=t.x+rnd(-140,140),y=t.y+rnd(-90,90);ents.tele.push({x,y,r:56,t:-i*0.18,max:1.1,atk:A*1.2,el:'fire'});later(i*0.18+1.0,()=>fx('fx_explosion',x,y-10,1.6,0.4));}}
 else if(k==='nova'){[90,170,250].forEach((r,i)=>ents.tele.push({x:m.x,y:m.y,r,t:-i*0.45,max:0.9,atk:A*(1.3-i*0.2),el:m.el}));fx('fx_m_slam',m.x,m.y,3,1.8);}
 else if(k==='drain'){m.drainT=3.5;fx('fx_m_blink',m.x,m.y-40,1.6,3.5);}
 else if(k==='confuse'){ents.tele.push({x:m.x,y:m.y,r:220,t:0,max:1.0,atk:A*0.4,el:m.el});later(1.0,()=>{if(Math.hypot(P.x-m.x,P.y-m.y)<240&&!P.dead){P.confT=4;floatT(P.x,P.y-80,'혼란! 방향 반대','#d88aff',15,2);SFL.a=0.35;SFL.c='200,120,255';}});}
 else if(k==='invuln'){m.invT=4;fx('fx_aegis',m.x,m.y-50,2.6,4);for(let i=0;i<2;i++){const s=mkMon(m.gi,-1,false),q=nearestOpen(CUR,m.x+(i?80:-80),m.y+30);s.lv=m.lv;s.maxhp=s.hp=Math.round(m.maxhp*0.03);s.atk=A*0.3;s.x=s.hx=q.x;s.y=s.hy=q.y;s.summoned=true;s.noloot=true;s.raid=true;s.aggroT=10;s.name='수호 정령';s.vt=3;ents.mons.push(s);}}
 else if(k==='clone'){for(let i=0;i<2+(low?1:0);i++){const c2=Object.assign({},m,{clone:true,noloot:true,raid:true,boss:false,elite:true,raidBoss:false,legBoss:false,hp:Math.round(m.maxhp*0.05),maxhp:Math.round(m.maxhp*0.05),atk:A*0.45,charge:null,wind:0,invT:0,bp:99}),q=nearestOpen(CUR,m.x+rnd(-120,120),m.y+rnd(-70,70));c2.x=c2.hx=q.x;c2.y=c2.hy=q.y;c2.aggroT=10;burst(q.x,q.y-30,20,'#b48aff',200);ents.mons.push(c2);}
  const q=nearestOpen(CUR,m.x+rnd(-120,120),m.y+rnd(-70,70));m.x=q.x;m.y=q.y;}
 else if(k==='pull'){fx('fx_m_blink',m.x,m.y-30,2.6,0.8);later(0.5,()=>{const pp=[P,...ents.actors.filter(x=>x.fighter&&!x.down)];for(const e of pp){const dd=Math.hypot(e.x-m.x,e.y-m.y);if(dd<330&&dd>50){const q=nearestOpen(CUR,m.x+(e.x-m.x)/dd*60,m.y+(e.y-m.y)/dd*45);e.x=q.x;e.y=q.y;}}ents.tele.push({x:m.x,y:m.y,r:110,t:0,max:0.7,atk:A*1.3,el:m.el});});}
 return k==='charge';}
function monSkill(m,t,d){const k=MSK[m.shape]||'shot';{const a=Math.atan2(t.y-m.y,t.x-m.x),S=m.boss?2:1.2;if(k==='charge'||k==='dive')fx('fx_m_charge',m.x,m.y-12,S,0.5,a);else if(k==='web')fx('fx_m_web',m.x,m.y-20,S*0.8,0.4);else if(k==='spit')fx('fx_m_spit',m.x,m.y-20,S*0.8,0.4,a);else if(k==='spore')fx('fx_m_spore',m.x,m.y-20,S*1.4,0.8);else if(k==='slam')fx('fx_m_slam',t.x,t.y-6,S*1.3,0.85);else if(k==='blink')fx('fx_m_blink',m.x,m.y-24,S,0.4);else if(k==='breath')fx('fx_m_breath',m.x+Math.cos(a)*50,m.y-20+Math.sin(a)*30,S*1.4,0.6,a);}floatT(m.x,m.y-(m.boss?110:64),MSKN[k]+'!','#ffb07a',10,0.9);
 if(k==='charge'||k==='dive'){if(d<60)return;const a=Math.atan2(t.y-m.y,t.x-m.x),v=k==='dive'?380:320;m.charge={t:Math.min(0.55,d/v+0.08),vx:Math.cos(a)*v,vy:Math.sin(a)*v};m.face=t.x<m.x?-1:1;}
 else if(k==='shot')for(const s of [-0.15,0,0.15])mShot(m,t,{sp:s,k:0.7});
 else if(k==='web')mShot(m,t,{kind:'web',slow:2.5,k:0.5,v:180});
 else if(k==='spit')mShot(m,t,{poison:1,k:0.6,col:'#8dff5a',el:'poison'});
 else if(k==='spear')mShot(m,t,{kind:'spear',k:1.1,v:260});
 else if(k==='spore'){ents.tele.push({x:m.x,y:m.y,r:80,t:0,max:0.8,atk:m.atk*0.7,slow:2,el:m.el});}
 else if(k==='slam'){ents.tele.push({x:t.x,y:t.y,r:66,t:0,max:0.85,atk:m.atk*1.3,el:m.el});}
 else if(k==='blink'){const a=R()*6.28;moveEnt(m,(t.x+Math.cos(a)*70-m.x),(t.y+Math.sin(a)*50-m.y));burst(m.x,m.y-20,14,m.color,160);mShot(m,t,{k:0.9});}
 else if(k==='breath'){for(let s=-2;s<=2;s++)mShot(m,t,{sp:s*0.12,k:0.8,col:'#ff7a2a',el:'fire',v:230});}}
function monStrike(m){const t=m.target;if(!t||m.dead)return;
 if(m.ranged){const a=Math.atan2(t.y-12-(m.y-22),t.x-m.x);ents.projs.push({x:m.x,y:m.y-22,vx:Math.cos(a)*170,vy:Math.sin(a)*170,life:2.2,atk:m.atk*0.9,col:m.color,el:m.el});return;}
 m.lunge=0.25;if(Math.hypot(t.x-m.x,t.y-m.y)<=m.r+(t.r||10)+24){if(t===P)playerHurt(m.atk,m.el);else actorHurt(t,m.atk);}}
function hitMon(m,mult,ang,by){if(m.dead)return;if(m.invT>0){if(!m._invF||performance.now()-m._invF>300){m._invF=performance.now();floatT(m.x,m.y-(m.boss?90:50),'무적!','#cfe8ff',13,0.6);burst(m.x,m.y-30,6,'#cfe8ff',120);}return;}const crit=!by&&R()<critCh();if(crit)try{procCrit(m);}catch(e){}if(!by)fx('fx_hit',m.x,m.y-20,0.9,0.2,R()*6);const wi=!by&&eqItem('w'),ec=wi&&wi.el!=='none'?ELEM[wi.el].c:null;if(!by)sfx(crit?'crit':'hit');const em=wi?elMul(wi.el,m.el):1;const dmg=dmgCalc(by?by.atk:pAtk(),m.def,mult*(crit?1.8+0.1*rk('agile')+0.004*SV('agi'):1)*(ec?1+wi.eb/100:1)*em*(!by&&P.skBoostT>0?P.skBoost:1)*(m.boss&&(!by||by.own)?1+troB():1));if(!by&&rk('bloodlust')&&!P.dead)P.hp=Math.min(maxHp(),P.hp+dmg*0.015*rk('bloodlust'));if(ec)burst(m.x,m.y-20,8,ec,170);if(em>1)floatT(m.x,m.y-62,'약점! '+ELEM[m.el].ic,'#ffe14a',11,0.8);else if(em<1)floatT(m.x,m.y-62,'내성 '+ELEM[m.el].ic,'#9ab',10,0.8);
 m.hp-=dmg;m.flash=1;m.aggroT=6;const kb=m.boss?1.5:7;m.kbx=Math.cos(ang)*kb;m.kby=Math.sin(ang)*kb;if(m.wind>0&&!m.boss&&crit)m.wind=0;
 burst(m.x,m.y-16,crit?18:by?5:9,crit?'#ffd23f':m.color,crit?220:150);
 floatT(m.x+rnd(-8,8),m.y-(m.boss?80:44),(crit?'치명타 ':'')+dmg,by?'#ffb0a0':crit?'#ffd23f':'#fff',by?11:crit?18:14);
 if(!by)cam.shake=Math.max(cam.shake,crit?6:2.5);if(m.hp<=0)killMon(m,by);}
function killMon(m,by){sfxAt('mondie',m.x,m.y);m.dead=true;m.deadT=0;m.respawn=m.boss?120:rnd(12,20);if(m.noloot){m.respawn=1e9;burst(m.x,m.y-16,16,m.clone?'#b48aff':m.color,180);if(!by||by.own)gainExp(Math.round((5+m.lv*4)*0.3));return;}burst(m.x,m.y-16,m.boss?60:22,m.color,m.boss?300:200);burst(m.x,m.y-16,10,'#fff',160);
 if(m.raidBoss)riftVictory(m);if(m.legBoss)legVictory(m);if(!by||by.own){wkEv('kill');if(m.boss)wkEv('boss');if(!m.pdi){const q=R();if(m.boss){if(q<0.35)addEsc(m.lv>=40?2:1,1,1);if(m.lv>=60&&R()<0.08)addEsc(3,1,1);}else if(m.elite){if(q<0.04)addEsc(1,1,1);}else if(q<0.004)addEsc(1,1,1);}}
 if(m.raid&&!m.raidBoss&&G.rift&&G.rift.state==='invade'){G.rift.killed++;if(G.rift.killed>=G.rift.need){const r=G.rift;P.gold+=r.lv*40;addDia(r.evil?40:20,'균열 방어 성공');toast(`🛡️ 마을을 지켜냈다! 보상 ${fmt(r.lv*40)}G`);questEv('rift');riftEnd(true,'player');}}
 if(by&&!by.own){floatT(m.x,m.y-60,`${by.name} 처치`,'#ffb0a0',11);const ka=ents.actors.find(x=>x.name===by.name);bark(ka,m.boss?'boss':'kill',m.boss?1:0.3);return;}
 const g=GROUNDS[m.gi];P.kills++;const p0=ents.picks.length;if(m.pdi==null&&!m.raid)questEv('kill',m.gi,!!m.boss);sfx(m.boss?'boss':'coin');
 let n=(R()<0.55?1:0)+(R()<0.08?1:0)+(m.elite?1:0)+(m.boss?1:0)+(isSurge(m.gi)&&R()<0.25?1:0);if(CUR.pd)n=R()<0.4?1:0;const drops=[];if((m.boss&&R()<0.5)||m.elite&&R()<0.3)drops.push(g.matIds[4]);while(drops.length<n)drops.push(rollDrop(g));if(R()<(m.boss?0.25:m.elite?0.1:0.025))drops.push(g.sp);
 if(m.awk){if(R()<(m.boss?1:m.elite?0.4:0.15))drops.push(AWM[0]);if(R()<0.08)drops.push(g.sp);}
 if(m.raid&&!m.raidBoss&&!m.legBoss){if(R()<0.65)drops.push(RIFTM[0]);if(R()<0.08)drops.push(RIFTM[1]);}
 drops.forEach(id=>ents.picks.push({x:m.x,y:m.y,vx:rnd(-60,60),vy:rnd(-40,40),z:0,vz:rnd(80,140),kind:'mat',id,t:0}));
 const gold=Math.round(m.lv*rnd(.6,1.3)*(m.boss?4:m.elite?2:1));ents.picks.push({x:m.x,y:m.y,vx:rnd(-40,40),vy:rnd(-30,30),z:0,vz:110,kind:'gold',amt:gold,t:0});
 if(m.boss&&R()<0.3)ents.picks.push({x:m.x,y:m.y,vx:rnd(-40,40),vy:rnd(-30,30),z:0,vz:120,kind:'pot',id:g.lv>=20?'p3':g.lv>=10?'p2':'p1',t:0});
 const pk=(kind,o)=>ents.picks.push(Object.assign({x:m.x,y:m.y,vx:rnd(-50,50),vy:rnd(-35,35),z:0,vz:130,kind,t:0},o));
 if(!CUR.pd&&m.pdi==null&&R()<(m.boss?0.2:m.elite?0.07:0.012))pk('egg',{gi:m.gi,mi:m.boss&&R()<0.35?-1:(m.mi<0?rmi(m.gi):m.mi),boost:m.boss?1:m.vt?1:0});
 if(R()<(m.boss?0.5:m.elite?0.08:0.018))pk('core',{gi:m.gi});
 if(R()<(m.boss?0.4:m.elite?0.08:0.014)){const tt=clamp(lvTier(m.lv)+(R()<0.3?1:0),0,5);const gk=R()<(m.boss?0.3:0.12)?pick(['r','n']):pick(['w','a','h','b']);ents.picks.push({x:m.x,y:m.y,vx:rnd(-40,40),vy:rnd(-30,30),z:0,vz:130,kind:'gear',item:plusItem(makeItem(gk,gk==='r'||gk==='n'?Math.floor(tt*0.7):tt,m.boss?0.6:m.elite?0.25:0),plusOf(m.lv)),t:0});}
 scatterPicks(p0);let exp=Math.round((5+m.lv*4)*(m.boss?12:m.elite?2.5:1)*(m.lv<P.lv-6?0.3:1));gainExp(exp);if(by&&by.pet)monExp(by.pet,Math.round(exp*0.5));floatT(P.x,P.y-56,`+${exp} EXP`,'#7fe0ff',12);
 if(m.boss){if(!CUR.pd&&!m.raid&&m.pdi==null){const H=homeInit();if(!H.tro[m.gi]){H.tro[m.gi]=1;toast(`🏆 트로피 획득 — ${m.name} 박제 (내 집에 장식)`);}}addDia(3);news(`👑 보스 ${m.name} 처치!`,'me');toast(`👑 ${m.name} 처치!`);}}
