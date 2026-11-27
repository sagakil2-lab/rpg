'use strict';
// =====================================================================
//  플레이어
// =====================================================================
const input={keys:{},jx:0,jy:0,atk:false,sl:[false,false,false,false],pot:false,act:false};
function gainExp(e){if(P.lv>=MAXLV){P.exp=0;return;}if((P.expBoost||0)>Date.now())e*=2;if(HF('scholar'))e*=1.06;P.exp+=e;const old=P.lv;let spg=0;while(P.lv<MAXLV&&P.exp>=expNeed()){P.exp-=expNeed();P.lv++;const g=1+(P.lv%5===0?1:0);P.sp+=g;spg+=g;}
 if(P.lv>old){sfx('levelup');P.hp=maxHp();P.mp=maxMp();floatT(P.x,P.y-70,'LEVEL UP!','#ffd23f',22,2);for(let i=0;i<50;i++)ents.parts.push({x:P.x+rnd(-20,20),y:P.y,vx:rnd(-30,30),vy:rnd(-200,-60),gr:60,life:0,max:rnd(.8,1.4),col:pick(['#ffd23f','#fff','#ffe08a']),s:rnd(1.5,3)});
  news(`⭐ 레벨 업! Lv${P.lv} (스킬 포인트 +${spg} · 능력치 +${(P.lv-old)*STP_LV})`,'me');fx('fx_levelup',P.x,P.y-30,2.2,0.9);setTimeout(()=>toast(`⭐ Lv${P.lv}! 스킬 +${spg} · 능력치 +${(P.lv-old)*STP_LV} — 메뉴의 📊 능력치에서 분배`),200);
  TOWNS.forEach(t=>{if(t.unlock>old&&t.unlock<=P.lv){news(`🔓 ${t.name} 해금! 역마차 정류장에서 이동할 수 있다`,'me');setTimeout(()=>toast(`🔓 ${t.name} 해금! 역마차로 이동 가능`),900);}});
  GROUNDS.forEach(g=>{if(g.lv>old&&g.lv<=P.lv){news(`🔓 ${g.name} 입장 가능 (${TOWNS[g.town].name})`,'me');if(TOWNS[g.town].unlock<=P.lv)setTimeout(()=>toast(`🔓 ${g.name} 입장 가능`),1800);}});}}
function updPlayer(dt){
 let ix=0,iy=0;const k=input.keys;if(k.arrowleft||k.a)ix--;if(k.arrowright||k.d)ix++;if(k.arrowup||k.w)iy--;if(k.arrowdown||k.s)iy++;
 if(input.jx||input.jy){ix=input.jx;iy=input.jy;}if((P.confT||0)>0){P.confT-=dt;ix=-ix;iy=-iy;}const l=Math.hypot(ix,iy);
 if(P.recall){P.recall.t-=dt;if(R()<0.6)ents.parts.push({x:P.x+rnd(-16,16),y:P.y-rnd(0,8),vx:0,vy:rnd(-90,-40),gr:0,life:0,max:0.6,col:pick(['#9fe8ff','#fff','#6ac8ff']),s:rnd(1.5,3)});
  if(l>0.1&&!P.recall.mv){P.recall=null;toast('귀환이 취소되었다');}else if(P.recall.t<=0){const to=P.recall.to;P.recall=null;P.scroll--;sfx('heal');transition('T'+to,'start');toast('마을로 귀환했다');}}
 P.skBoostT=(P.skBoostT||0)-dt;P.shieldT=(P.shieldT||0)-dt;if(P.storm){P.storm.t-=dt;P.storm.k-=dt;P.spin=1;if(P.storm.k<=0){P.storm.k=0.25;hitArea(P.x,P.y,82,P.storm.m);for(let i=0;i<3;i++)ents.slashes.push({x:P.x,y:P.y-12,ang:R()*6.28,life:0,max:0.2,r:56,col:'#dff',w:5});ents.rings.push({x:P.x,y:P.y-6,life:0,max:0.25,r:82,col:'200,255,255'});}if(P.storm.t<=0)P.storm=null;}
 P.atkCd-=dt;P.skillCd-=dt;P.inv-=dt;P.flash=Math.max(0,P.flash-dt*5);P.swing=Math.max(0,P.swing-dt*5);P.spin=Math.max(0,P.spin-dt*2.8);
 P.mp=Math.min(maxMp(),P.mp+dt*(1.5+P.lv*0.08)*(1+0.25*rk('focus')+0.2*rk('faith')));if(HF('cozy')&&!P.dead)P.hp=Math.min(maxHp(),P.hp+maxHp()*0.003*dt);if(rk('regen')&&!P.dead)P.hp=Math.min(maxHp(),P.hp+maxHp()*0.004*rk('regen')*dt);P.revCd=(P.revCd||0)-dt;SFL.a=Math.max(0,SFL.a-dt*2.2);if(CUR.kind==='town'&&!CUR.invaded)P.hp=Math.min(maxHp(),P.hp+maxHp()*0.05*dt);
 for(const k in P.cd)P.cd[k]-=dt;P.slowT=(P.slowT||0)-dt;if((P.poisonT||0)>0&&!P.dead){P.poisonT-=dt;P.poisonAcc=(P.poisonAcc||0)+dt;if(P.poisonAcc>=1){P.poisonAcc=0;const d=Math.max(1,Math.round(P.poisonD||1));P.hp-=d;floatT(P.x,P.y-50,'☠-'+d,'#8dff5a',11);if(P.hp<=0){P.hp=0;playerDie();}}}P.buff.atkT-=dt;P.buff.defT-=dt;P.castT=Math.max(0,P.castT-dt);if(P.dead){P.deadT+=dt;return;}
 if(P.dash){for(let i=0;i<3;i++)if(P.dash)dashStep(dt/3);checkExit();return;}
 if(l>0.15){const s=135*(1+0.05*rk('swift')+(HF('nature')?0.05:0)+eqv('b','spd')/100)*((P.slowT||0)>0?0.55:1)*Math.min(1,l);moveEnt(P,ix/l*s*dt,iy/l*s*dt);P.walk+=dt*12;P.dir={x:ix/l,y:iy/l};if(Math.abs(ix)>0.2)P.face=ix<0?-1:1;P.moving=true;}else P.moving=false;
 if(input.atk&&P.atkCd<=0){if(CUR.kind==='town'&&(!CUR.invaded||nearBuilding()||nearRift())){input.atk=false;interact();}else doAttack();}
 for(let i=0;i<4;i++)if(input.sl[i]){input.sl[i]=false;castSlot(i);}if(input.pot){input.pot=false;quaff();}if(input.act){input.act=false;interact();}
 checkExit();}
function doAttack(){{const rg=rangedOf&&rangedOf();sfx(rg?(rg==='arrow'?'arrow':'magic'):'swing');}{const ch=nearChest();if(ch){openChest(ch);P.atkCd=0.3;return;}}const rg=rangedOf();if(rg){P.atkCd=rg==='arrow'?0.42:0.5;P.swing=1;const a=aimAng(400),w=eqItem('w'),ec=w.el!=='none'?ELEM[w.el].c:null;
  ents.pproj.push({kind:rg,x:P.x+Math.cos(a)*14,y:P.y-18+Math.sin(a)*10,vx:Math.cos(a)*(rg==='arrow'?520:380),vy:Math.sin(a)*(rg==='arrow'?520:380),ang:a,life:0.85,mult:rg==='arrow'?0.95:1.05,r:9,hit:new Set(),single:true,col:ec||(rg==='bolt'?'#9ad0ff':'#fff')});
  for(const ac of ents.actors){if(!ac.fighter||ac.remove||!(ac.hostile||(ac.npc&&ac.npc.karma<=-40)))continue;const d=Math.hypot(ac.x-P.x,ac.y-P.y);if(d<380&&Math.abs(Math.atan2(ac.y-P.y,ac.x-P.x)-a)<0.15){hitActor(ac,0.9,a);break;}}return;}
 P.atkCd=0.34;P.swing=1;let aim=null,ad=95;
 for(const m of ents.mons){if(m.dead)continue;const d=Math.hypot(m.x-P.x,m.y-P.y);if(d<ad){ad=d;aim=m;}}
 for(const a of ents.actors){if(!a.hostile||a.remove)continue;const d=Math.hypot(a.x-P.x,a.y-P.y);if(d<ad){ad=d;aim=a;}}
 const ang=aim?Math.atan2(aim.y-P.y,aim.x-P.x):Math.atan2(P.dir.y,P.dir.x);if(aim)P.face=aim.x<P.x?-1:1;
 fx('fx_slash',P.x+Math.cos(ang)*28,P.y-16+Math.sin(ang)*18,1.2,0.2,ang);ents.slashes.push({x:P.x+Math.cos(ang)*20,y:P.y-14+Math.sin(ang)*16,ang,life:0,max:0.2,r:30,col:WCOL[P.w]==='#555a66'?'#c0a0ff':'#fff',w:5});
 for(const m of ents.mons){if(m.dead)continue;const dx=m.x-P.x,dy=m.y-P.y,d=Math.hypot(dx,dy);if(d>58+m.r)continue;
  const da=Math.abs(((Math.atan2(dy,dx)-ang)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI);if(da>1.25&&d>m.r+10)continue;hitMon(m,1,ang);}
 for(const a of ents.actors){if(!a.fighter||a.remove)continue;if(!(a.hostile||(a.npc&&a.npc.karma<=-40)))continue;const dx=a.x-P.x,dy=a.y-P.y,d=Math.hypot(dx,dy);if(d>58+a.r)continue;
  const da=Math.abs(((Math.atan2(dy,dx)-ang)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI);if(da>1.1)continue;hitActor(a,1,ang);}}
function doSkill(){if(CUR.kind==='town')return;if(P.skillCd>0)return;if(P.mp<12){toast('MP가 부족하다');return;}
 P.mp-=12;P.skillCd=2.2;P.spin=1;cam.shake=8;ents.rings.push({x:P.x,y:P.y-8,life:0,max:0.4,r:86,col:'160,255,255'});
 for(let i=0;i<4;i++)ents.slashes.push({x:P.x,y:P.y-12,ang:i*Math.PI/2,life:-i*0.04,max:0.26,r:52,col:'#aff',w:7});
 for(const m of ents.mons){if(m.dead)continue;const d=Math.hypot(m.x-P.x,m.y-P.y);if(d<86+m.r)hitMon(m,2.0,Math.atan2(m.y-P.y,m.x-P.x));}}
function bestPotion(){const miss=maxHp()-P.hp;const order=miss>300?['p3','p2','p1']:miss>110?['p2','p1','p3']:['p1','p2','p3'];return order.find(p=>P.pot[p]>0);}
function quaff(){quaffId(bestPotion());}
function quaffId(pid){if(P.dead)return;if(P.hp>=maxHp()){sfx('error');toast('HP가 가득하다');return;}if(!pid||!P.pot[pid]){sfx('error');toast('물약이 없다');return;}P.pot[pid]--;sfx('heal');const h=CB[pid].heal;P.hp=Math.min(maxHp(),P.hp+h);
 floatT(P.x,P.y-50,'+'+h,'#6fff8a',15);for(let i=0;i<16;i++)ents.parts.push({x:P.x+rnd(-12,12),y:P.y-rnd(0,30),vx:rnd(-10,10),vy:rnd(-70,-30),gr:0,life:0,max:rnd(.5,.9),col:'#7dff9a',s:rnd(1.5,3)});}
function elRes(el){if(!el||el==='none')return 0;let r=0;for(const k of EQK){const it=eqItem(k);if(it&&it.el===el)r+=it.res||0;}return Math.min(0.6,r/100);}
function playerHurt(atk,el){if(P.inv>0||P.dead)return;if(rk('evade')&&R()<0.03*rk('evade')){floatT(P.x,P.y-50,'회피!','#cfe',13);P.inv=0.2;return;}procHurt();if(rk('thorns'))hitArea(P.x,P.y,70,0.4+0.2*rk('thorns'));if(P.shield>0&&P.shieldT>0){const ab=Math.min(P.shield,atk*0.8);P.shield-=ab;atk-=ab;floatT(P.x,P.y-56,'흡수','#9fdfff',11);if(atk<=1)return;}if(P.recall){P.recall=null;toast('공격받아 귀환이 끊겼다');}sfx('hurt');const dmg=Math.max(1,Math.round(dmgCalc(atk,pDef(),1)*(P.buff.defT>0?1-P.buff.def:1)*(1-elRes(el))));P.hp-=dmg;P.inv=0.45;P.flash=1;cam.shake=Math.max(cam.shake,5);
 burst(P.x,P.y-16,8,'#ff5555',140);floatT(P.x,P.y-48,'-'+dmg,'#ff6b6b',14);if(P.hp<=0){P.hp=0;playerDie();}}
function actorHurt(a,atk){if(a.pet){petHurt(a,atk);return;}actorHurt0(a,atk);if(!a.down&&a.hp<a.maxhp*0.4)bark(a,'hurt',0.08);}
function actorHurt0(a,atk){if(a.down)return;const dmg=Math.round(dmgCalc(atk,a.def,1)*((a.shieldT||0)>0?0.65:1));a.hp-=dmg;a.flash=1;floatT(a.x,a.y-46,'-'+dmg,'#ffaaaa',10);
 if(a.hp<=0&&CUR&&(CUR.invaded||CUR.raid)){a.hp=0;a.down=true;a.reviveT=20;a.tgt=null;a.path=null;burst(a.x,a.y-16,14,'#ff6a5a',150);floatT(a.x,a.y-60,'쓰러짐!','#ff8a7a',12);}}
function playerDie(){if(rk('revive')&&(P.revCd||0)<=0){P.revCd=300-30*rk('revive');P.hp=maxHp()*(0.2+0.05*rk('revive'));P.inv=2.5;SFL.a=0.8;SFL.c='255,240,190';burst(P.x,P.y-20,50,'#ffe38a',260);fx('fx_angel',P.x,P.y-30,2.4,0.9)||fx('fx_heal',P.x,P.y-30,2.4,0.9);floatT(P.x,P.y-80,'부활!','#ffe38a',20,2);return;}P.dead=true;sfx('die');const gl=Math.floor(gOwn()*0.1);if(P.__g)P.__g.own-=gl;else P.gold-=gl;let lost=0;for(const id in P.bag){const l=Math.floor(P.bag[id]/4);lost+=l;addBag(P.bag,+id,-l);}
 const ti=CUR.kind==='town'?CUR.ti:GROUNDS[CUR.gi].town;news(`💀 ${CUR.name}에서 쓰러졌다 (-${fmt(gl)}G, 재료 ${lost}개 분실)`,'me');
 setTimeout(()=>openModal(`<h2 class="dn">💀 쓰러졌다</h2><p class="d">${fmt(gl)}G와 재료 ${lost}개를 잃었다.<br>${TOWNS[ti].name}에서 정신을 차린다.</p><button class="btn w" onclick="closeModal();revive(${ti})">확인</button>`),900);}
function revive(ti){P.dead=false;P.deadT=0;P.hp=maxHp()*0.4;P.inv=2;transition('T'+ti,'start');}
function checkExit(){const tx=Math.floor(P.x/TS),ty=Math.floor(P.y/TS);
 for(const e of CUR.exits){if(tx>=e.x&&tx<e.x+e.w&&ty>=e.y&&ty<e.y+e.h){
  if(e.to[0]==='G'){const g=GROUNDS[e.gi];if(P.lv<g.lv){const push={E:[-1,0],W:[1,0],N:[0,1],S:[0,-1]}[e.side];P.x+=push[0]*18;P.y+=push[1]*18;toast(`🔒 ${g.name} — Lv${g.lv} 이상 입장 가능`);return;}}
  transition(e.to,CUR.key);return;}}}
function nearBuilding(){if(CUR.kind!=='town')return null;for(const b of CUR.buildings){if(!b.label&&b.type!=='house')continue;
 const fx=b.front.x*TS+16,fy=b.front.y*TS+10;if(Math.abs(P.x-fx)<26&&P.y>fy-14&&P.y<fy+30)return b;}return null;}
function nearActor(){let best=null,bd=40;for(const a of ents.actors){const d=Math.hypot(a.x-P.x,a.y-P.y);if(d<bd){bd=d;best=a;}}return best;}
function interact(){if(nearRift()){openRift();return;}{const ch=nearChest();if(ch){openChest(ch);return;}}const b=nearBuilding();if(b){if(b.type==='house'){toast('문이 잠겨 있다');return;}openBuilding(b);return;}
 const a=nearActor();if(a&&a.kind==='story'){a.face=P.x<a.x?-1:1;openStory(a.sid);return;}if(a){sfx('talk');a.bubble=talkLine(a);a.bubT=4.5;a.face=P.x<a.x?-1:1;a.wait=Math.max(a.wait,3);a.path=null;}}
