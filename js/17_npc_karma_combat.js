'use strict';
// =====================================================================
//  NPC 성향 (착함/악함) · NPC와 전투
// =====================================================================
const karmaCol=k=>k<=-40?'#ff4a3a':k<-10?'#ffa35a':k<40?'#f0ece4':'#7fe07f';
const karmaName=k=>k<=-40?'악당':k<-10?'불량':k<40?'보통':'선량';
function wantsFight(a){const n=a.npc;if(!n||P.dead||CUR.kind==='town'||CUR.raid||n.party)return false;return n.karma<=-40||(P.karma<=-50&&n.karma>=40);}
function hitActor(a,mult,ang){if(a.remove||a.dead)return;const crit=R()<critCh();sfx(crit?'crit':'hit');const dmg=dmgCalc(pAtk(),a.def,mult*(crit?1.8:1));a.hp-=dmg;a.flash=1;a.kb=ang;
 burst(a.x,a.y-16,crit?14:8,'#ff6a5a',150);floatT(a.x+rnd(-6,6),a.y-50,(crit?'치명타 ':'')+dmg,crit?'#ffd23f':'#ffd0c0',crit?16:13);cam.shake=Math.max(cam.shake,crit?5:2);
 moveEnt(a,Math.cos(ang)*6,Math.sin(ang)*6);
 if(!a.hostile){a.hostile=true;a.leaving=false;a.path=null;const n=a.npc;if(n.karma>-40){P.karma-=4;a.bubble=pick(['뭐 하는 짓이야!','미쳤어?!','덤벼라!']);a.bubT=3;}}
 if(a.hp<=0)killActor(a);}
function killActor(a){const n=a.npc;a.dead=true;a.remove=true;burst(a.x,a.y-16,26,'#ff5a4a',220);burst(a.x,a.y-16,10,'#fff',160);
 const p0=ents.picks.length;const pk=(kind,o)=>ents.picks.push(Object.assign({x:a.x,y:a.y,vx:rnd(-60,60),vy:rnd(-40,40),z:0,vz:rnd(90,140),kind,t:0},o));
 const gold=Math.round(n.gold*0.3)+(n.karma<=-40?n.lv*8:0);n.gold-=Math.round(n.gold*0.3);if(gold>0)pk('gold',{amt:gold});
 const ids=Object.keys(n.bag);for(let i=0;i<Math.min(6,ids.length);i++){const id=pick(ids);if(n.bag[id]>0){n.bag[id]--;pk('mat',{id:+id});}}
 if(R()<(n.karma<=-40?0.3:0.12)){const k=pick(['w','a','h','b']);pk('gear',{item:makeItem(k,clamp(n[k]||n.w||0,0,5),n.karma<=-40?0.3:0.1)});}
 if(R()<0.03){const gi=clamp(lvTier(n.lv)*2,0,9);pk('egg',{gi,mi:rmi(gi)});}
 scatterPicks(p0);let msg;if(n.karma<=-40){P.karma=Math.min(100,P.karma+8);msg=`⚔️ 악당 ${n.name}(Lv${n.lv})을(를) 처치했다! 현상금 포함 ${fmt(gold)}G`;}
 else{P.karma=Math.max(-100,P.karma-15);msg=`🩸 ${karmaName(n.karma)} 사냥꾼 ${n.name}(Lv${n.lv})을(를) 죽였다… 악명이 오른다 (성향 ${P.karma})`;}
 news(msg,'me');toast(msg);
 if(NAMEPOOL.length<2)NAMEPOOL=makeNames();const nn=newHunter(Math.max(1,Math.round(n.lv*0.6)),0);nn.id=n.id;Object.keys(n).forEach(k=>delete n[k]);Object.assign(n,nn);}
function hostileStep(a,dt){if(P.dead||P.inv>5){a.hostile=false;return true;}const d=Math.hypot(P.x-a.x,P.y-a.y);a.face=P.x<a.x?-1:1;
 if(d>420){a.hostile=false;return false;}
 if(d>a.r+P.r+14){stepToward(a,P.x,P.y,a.spd*1.05,dt);a.moving=true;a.walk+=dt*10;}
 else if(a.atkCd<=0){a.atkCd=0.9;a.swing=1;const ang=Math.atan2(P.y-a.y,P.x-a.x);ents.slashes.push({x:a.x+Math.cos(ang)*16,y:a.y-14+Math.sin(ang)*12,ang,life:0,max:0.18,r:24,col:'#ff7a6a',w:3});playerHurt(a.atk*0.75);}
 return true;}

const NCLS={assassin:['🗡️','암살자',['그림자 베기','독 칼날']],summoner:['🦊','소환사',['정령 여우','여우불']],warrior:['⚔️','전사',['회전베기','대지 강타']],archer:['🏹','궁수',['연발 사격','관통 화살']],mage:['🔮','마법사',['화염구','서리 폭풍']],priest:['✨','사제',['치유의 기도','부활','빛의 일격']],knight:['🛡️','기사',['도발','수호의 방패','방패 강타']]};
const NCLSD={assassin:'근접 암살자. 빠르게 파고들어 치명적인 그림자 베기와 독을 건다. 체력은 낮다.',summoner:'원거리 소환사. 정령 여우를 날려 적을 물고, 여우불로 주변을 태운다.',warrior:'근접 범위 공격. 회전베기로 주변을 쓸고 Lv15부터 대지 강타로 기절시킨다.',archer:'원거리 연사. 3발 연발 사격과 관통 화살.',mage:'원거리 폭발 마법. 화염구와 둔화 서리 폭풍.',priest:'힐러. HP가 낮은 동료와 나를 치유하고 쓰러진 동료를 즉시 부활시킨다.',knight:'탱커. 주변 몬스터를 도발해 자신을 노리게 하고, 동료에게 피해 감소 보호막을 건다.'};
const CLS6=['warrior','warrior','archer','mage','priest','knight'],CLS8=['warrior','assassin','archer','mage','priest','knight','warrior','summoner'];
const PROMO={warrior:['swordmaster','검성','빠른 이연격으로 적을 벤다'],mage:['archmage','대마법사','거대한 비전 구체를 날린다'],archer:['ranger','신궁','빛나는 화살 세 발을 부채꼴로 쏜다'],priest:['saint','대사제','빛의 기둥으로 동료를 지킨다'],knight:['paladin','성기사','망치로 땅을 내려쳐 충격파를 일으킨다']};
const PROMO_LV=50;function promoK(n){const c=n&&(n.cls||'warrior'),p=PROMO[c];return p&&n.role==='hunter'&&n.lv>=PROMO_LV&&IMG['npc_'+p[0]+'_sheet']?p[0]:null;}
function npcKey(n){const pk=promoK(n);if(pk)return'npc_'+pk;const c=n.cls||'warrior';
 if(c==='assassin'&&IMG.npc_assassin_sheet)return'npc_assassin';if(c==='summoner'&&IMG.npc_summoner_sheet)return'npc_summoner';
 if(c==='warrior')return IMG.npc_warrior_sheet?'npc_warrior':'npc_hunter';if(c==='archer')return'npc_archer';if(c==='mage')return IMG.npc_battlemage_sheet?'npc_battlemage':'npc_mage';
 if(c==='priest')return IMG.npc_healer_sheet?'npc_healer':'npc_priest';if(c==='knight')return IMG.npc_knight_sheet?'npc_knight':'npc_guard';return'npc_hunter';}
const NIMG={};function npcImg(n,sz){const k=npcKey(n),v=npcVar(n),im=tintSheet(k+'_sheet',v);if(!im)return`<span style="font-size:${sz*0.6}px">${NCLS[n.cls||'warrior'][0]}</span>`;
 const ck=k+'|'+sz+'|'+v;if(!NIMG[ck]){const cw=im.width/4,chh=im.height/2,cv=document.createElement('canvas');cv.width=cv.height=sz*2;const c=cv.getContext('2d');c.imageSmoothingQuality='high';
  const s=Math.min(sz*2/cw,sz*2/chh)*1.15;const fl=NATIVE_L[k];c.save();if(fl){c.translate(sz*2,0);c.scale(-1,1);}c.drawImage(im,0,0,cw,chh,(sz*2-cw*s)/2,sz*2-chh*s*0.98,cw*s,chh*s);c.restore();NIMG[ck]=cv.toDataURL();}
 return`<img src="${NIMG[ck]}" style="width:${sz}px;height:${sz}px">`;}
const NCC={assassin:'#b46aff',summoner:'#5ad8c8',warrior:'#e0604a',archer:'#6ac85a',mage:'#7a8aff',priest:'#ffd86a',knight:'#9ab8d8'};
function ncard(n,o){o=o||{};const c=n.cls||'warrior',st=npcStat(n),pr=promoK(n),col=pr?'#ffd24a':NCC[c]||'#c8962e',hp=o.hp!=null?o.hp:1;
 return`<div class="ncard${o.down?' dn':''}" style="--nc:${col}" onclick="npcCard(${n.id})">${o.top||''}<div class="nimg">${npcImg(n,72)}${pr?'<i class="npr">전직</i>':''}<i class="ncl">${NCLS[c][0]}</i></div>
 <b>${n.name}</b><div class="mut" style="font-size:10.5px">Lv${n.lv} ${clsNm(n)}</div>${o.hp!=null?`<div class="nhp"><b style="width:${Math.max(0,hp*100)}%"></b></div>`:`<div class="nst">❤${fmt(st.hp)} ⚔${st.atk}</div>`}${o.sub||''}${o.btm||''}</div>`;}
function clsNm(n){const c=n.cls||'warrior';return promoK(n)?PROMO[c][1]:NCLS[c][1];}
function mkFighter(a,n){const c=n.cls||'warrior';a.fighter=true;a.cls=c;a.maxhp=a.hp=Math.round((90+n.lv*24+ADEF[n.a]*5+HHP[n.h||0])*(c==='warrior'?1.25:0.85));a.atk=(10+n.lv*3.2+WATK[n.w]*1.3)*(c==='mage'?1.15:1);a.def=3+n.lv*1.2+ADEF[n.a];
 a.atkCd=rnd(0,1);a.skCd=rnd(2,5);a.healCd=0;a.swing=0;a.spd=rnd(72,92);a.stuck=0;a.range=c==='warrior'||c==='knight'||c==='assassin'?0:175;if(c==='assassin'){a.atk*=1.25;a.maxhp=a.hp=Math.round(a.hp*1.0);a.spd*=1.15;}if(c==='summoner')a.atk*=1.08;
 if(c==='priest'){a.atk*=0.6;a.range=150;a.supCd=1;}if(c==='knight'){a.maxhp=a.hp=Math.round(a.hp*1.45);a.def*=1.6;a.atk*=0.8;a.supCd=3;}}
function hitAreaBy(x,y,rad,mult,by,fn){for(const m of ents.mons){if(m.dead)continue;if(Math.hypot(m.x-x,m.y-y)<rad+m.r){hitMon(m,mult,Math.atan2(m.y-y,m.x-x),by);fn&&fn(m);}}}
function allyShot(a,m,kind,mult,spread=0){sfxAt(kind==='arrow'?'arrow':'magic',a.x,a.y,0.7);const ang=Math.atan2(m.y-16-(a.y-18),m.x-a.x)+spread;const sp=kind==='arrow'?480:330;
 ents.aproj.push({kind,x:a.x+Math.cos(ang)*12,y:a.y-18,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,ang,life:1,mult,by:{atk:a.atk,name:a.name},r:kind==='fire'?10:7,col:kind==='fire'?'#ffb02a':kind==='frost'?'#9ae0ff':'#fff',pierce:kind==='pierce'});}
function supportStep(a,dt){a.supCd=(a.supCd||0)-dt;if(a.supCd>0)return false;const say=t=>{floatT(a.x,a.y-64,t+'!','#c8ffd0',11);a.bubble=t+'!';a.bubT=1.2;};const party=!!(CUR.raid||CUR.invaded);
 if(a.cls==='priest'){const dn=ents.actors.find(b=>b.down&&b!==a&&Math.hypot(b.x-a.x,b.y-a.y)<220);if(dn){a.supCd=8;dn.down=false;dn.hp=dn.maxhp*0.45;say('부활');sfxAt('revive',dn.x,dn.y);fx('fx_revive',dn.x,dn.y-30,1.3,0.9)||fx('fx_angel',dn.x,dn.y-36,1.2,0.8)||fx('fx_heal',dn.x,dn.y-20,1.2,0.6);burst(dn.x,dn.y-20,24,'#fff3b0',180);return true;}
  let best=null,br=0.6;for(const b of ents.actors){if(!b.fighter||b.down||b.leaving)continue;const r=b.hp/b.maxhp;if(r<br&&Math.hypot(b.x-a.x,b.y-a.y)<240){br=r;best=b;}}if(party)for(const b of ents.pets||[]){if(b.hp<=0)continue;const r=b.hp/b.maxhp;if(r<br&&Math.hypot(b.x-a.x,b.y-a.y)<240){br=r;best=b;}}
  if(party&&!P.dead&&P.hp/maxHp()<Math.min(br,0.6)&&Math.hypot(P.x-a.x,P.y-a.y)<240)best=P;
  if(best){a.supCd=3.5;const mx=best===P?maxHp():best.maxhp,h=Math.round(mx*0.22);if(best===P)P.hp=Math.min(mx,P.hp+h);else{best.hp=Math.min(mx,best.hp+h);if(best.pet)best.pet.php=best.hp;}say('치유의 기도');fx('fx_heal_npc',best.x,best.y-24,1,0.6)||fx('fx_heal',best.x,best.y-24,1,0.5);floatT(best.x,best.y-56,'+'+h,'#7dff9a',12);
   for(let i=0;i<12;i++)ents.parts.push({x:best.x+rnd(-12,12),y:best.y-rnd(0,10),vx:0,vy:rnd(-90,-40),gr:0,life:0,max:0.7,col:pick(['#7dff9a','#fff']),s:2});return true;}a.supCd=1;return false;}
 if(a.cls==='knight'){const near=ents.mons.filter(m=>!m.dead&&Math.hypot(m.x-a.x,m.y-a.y)<170);if(near.length>=2||near.some(m=>m.boss)){a.supCd=9;say('도발');ents.rings.push({x:a.x,y:a.y,life:0,max:0.5,r:170,col:'255,120,80'});fx('fx_taunt',a.x,a.y-24,1.2,0.5);
   for(const m of near){m.taunt={a,t:5};m.aggroT=6;}for(const b of ents.actors)if(b.fighter&&!b.down&&Math.hypot(b.x-a.x,b.y-a.y)<180)b.shieldT=5;sfxAt('shield',a.x,a.y);if(party&&Math.hypot(P.x-a.x,P.y-a.y)<180){P.buff.def=Math.max(P.buff.defT>0?P.buff.def:0,0.25);P.buff.defT=Math.max(P.buff.defT,5);}
   fx('fx_aegis',a.x,a.y-30,0.9,0.6);return true;}a.supCd=1.5;}
 return false;}
function npcSkill(a,m,d){if(a.cls==='knight'){if(d<70){a.bubble='방패 강타!';a.bubT=1;hitMon(m,1.6,Math.atan2(m.y-a.y,m.x-a.x),{atk:a.atk,name:a.name});m.stun=1;burst(m.x,m.y-16,10,'#cfe0ff',150);return true;}return false;}
 if(a.cls==='priest'){if(d<200){a.bubble='빛의 일격!';a.bubT=1;pillar(m.x,m.y,'#fff3b0',10);hitMon(m,1.8,0,{atk:a.atk,name:a.name});return true;}return false;}const by={atk:a.atk,name:a.name},say=t=>{floatT(a.x,a.y-64,t+'!','#ffe08a',11);a.bubble=t+'!';a.bubT=1.2;};
 if(a.cls==='warrior'){if(d<90){say('회전베기');ents.rings.push({x:a.x,y:a.y,life:0,max:0.3,r:80,col:'255,230,160'});fx('fx_spin',a.x,a.y-16,1.3,0.35);hitAreaBy(a.x,a.y,80,2.1,by);return true;}
  if(d<150&&a.lvl>=15){say('대지 강타');fx('fx_crack',m.x,m.y-6,1.2,0.4);ents.rings.push({x:m.x,y:m.y,life:0,max:0.35,r:70,col:'255,170,90'});hitAreaBy(m.x,m.y,70,2.6,by,x=>x.stun=1);return true;}}
 if(a.cls==='assassin'&&d<100){if(R()<0.55){say('그림자 베기');ents.slashes.push({x:m.x,y:m.y-16,ang:R()*6.28,life:0,max:0.22,r:36,col:'#b48aff',w:6});burst(m.x,m.y-16,12,'#6a4a9a',150);hitMon(m,3.2,0,by);}else{say('독 칼날');hitMon(m,1.6,0,by);m.poison={t:4,a:0,mult:0.5};burst(m.x,m.y-16,10,'#7dff5a',120);}return true;}
 if(a.cls==='summoner'&&d<220){if(R()<0.6){say('정령 여우');fx('fx_pet_skill',m.x,m.y-20,1.2,0.4)||burst(m.x,m.y-16,14,'#8affee',160);hitMon(m,2.5,0,by);}else{say('여우불');fx('fx_spin',m.x,m.y-10,1.1,0.4);ents.rings.push({x:m.x,y:m.y,life:0,max:0.35,r:70,col:'120,255,230'});hitAreaBy(m.x,m.y,70,1.7,by);}return true;}
 if(a.cls==='archer'&&d<220){if(R()<0.5){say('연발 사격');for(const s of [-0.18,0,0.18])allyShot(a,m,'arrow',1.2,s);}else{say('관통 화살');allyShot(a,m,'pierce',2.4);}return true;}
 if(a.cls==='mage'&&d<220){if(R()<0.6){say('화염구');allyShot(a,m,'fire',2.6);}else{say('서리 폭풍');fx('fx_frost',m.x,m.y-10,1.3,0.5);hitAreaBy(m.x,m.y,75,1.8,by,x=>x.slow=3);}return true;}
 return false;}
function ambient(a,dt){if(a.bubT>0||a.kind==='story'||a.leaving||a.down||R()>dt*0.05)return;const d=Math.hypot(P.x-a.x,P.y-a.y);if(d>320)return;
 if(a.fighter&&a.tgt){if(a.tgt.boss)bark(a,'boss',0.8);return;}
 const o=ents.actors.find(b=>b!==a&&!b.leaving&&b.kind!=='story'&&Math.hypot(b.x-a.x,b.y-a.y)<70&&b.bubT<=0);
 if(o&&R()<0.5){const q=pick(['요즘 어때?','그 소문 들었어?','오늘 장사는 좀 됐어?','균열 얘기 들었어?','어디 가는 길이야?','그거 진짜야?']);a.bubble=q;a.bubT=2.4;a.face=o.x<a.x?-1:1;later(1.4,()=>{if(o.remove)return;o.face=a.x<o.x?-1:1;o.bubble=talkLine(o).slice(0,46);o.bubT=3.2;});return;}
 a.bubble=talkLine(a).slice(0,46);a.bubT=3;}
function updActor(a,dt){a.bubT-=dt;ambient(a,dt);a.flash=Math.max(0,(a.flash||0)-dt*5);a.moving=false;
 if(a.leaving){const dist=CUR.kind==='town'?CUR.gateDist:CUR.entDist;if(followDist(a,dist,dt)){a.remove=true;}return;}
 if(a.flee&&!a.fighter){if(!CUR.invaded){a.flee=false;}else{let nm=null,nd=230;for(const m of ents.mons){if(m.dead)continue;const d=Math.hypot(m.x-a.x,m.y-a.y);if(d<nd){nd=d;nm=m;}}
  if(nm){const dx=a.x-nm.x,dy=a.y-nm.y,d=Math.hypot(dx,dy)||1;const ox=a.x,oy=a.y;moveEnt(a,dx/d*a.spd*1.7*dt,dy/d*a.spd*1.7*dt);if(Math.hypot(a.x-ox,a.y-oy)<0.3)moveEnt(a,-dy/d*a.spd*1.7*dt,dx/d*a.spd*1.7*dt);a.face=dx<0?-1:1;a.moving=true;a.walk+=dt*14;a.path=null;if(a.bubT<=0&&R()<dt*0.5){a.bubble=pick(['살려줘요!','몬스터다!','도망쳐!','사냥꾼님, 도와주세요!','으아악!','문 잠가!']);a.bubT=1.6;}return;}}}
 if(a.down){a.reviveT-=dt;if(a.reviveT<=0){a.down=false;a.hp=a.maxhp*0.6;fx('fx_heal',a.x,a.y-20,1,0.5);a.bubble='다시 싸운다!';a.bubT=2;floatT(a.x,a.y-60,'부활!','#7dff9a',12);}return;}
 if(a.fighter){a.atkCd-=dt;a.swing=Math.max(0,a.swing-dt*5);a.hp=Math.min(a.maxhp,a.hp+a.maxhp*0.01*dt);
  if(!(CUR.invaded||CUR.raid)&&a.hp<a.maxhp*(a.hostile?0.12:0.3)){a.hostile=false;a.leaving=true;a.bubble=a.npc&&a.npc.karma<=-40?'두고 보자!':'으윽, 후퇴!';a.bubT=3;return;}
  if(!a.hostile&&wantsFight(a)&&Math.hypot(P.x-a.x,P.y-a.y)<190&&R()<dt*0.25*(a.npc.karma<=-40?-a.npc.karma/100:0.6)){a.hostile=true;a.bubble=a.npc.karma<=-40?pick(['네 장비, 내가 가져가지!','혼자 다니면 위험하다고~','지갑 두고 가라!']):'악당 놈, 각오해라!';a.bubT=3;}
  if(a.hostile&&hostileStep(a,dt))return;
  if((a.cls==='priest'||a.cls==='knight')&&supportStep(a,dt))return;a.shieldT=(a.shieldT||0)-dt;
  if(!a.tgt||a.tgt.dead){a.tgt=null;const shr=!(CUR.raid||CUR.invaded||CUR.pd);let bd=CUR.raid?5000:shr?260:340;const now=performance.now();for(const m of ents.mons){if(m.dead||(a.bad===m&&now<a.badT))continue;if(shr&&!P.dead&&(Math.hypot(m.x-P.x,m.y-P.y)<220||m.target===P))continue;const d=Math.hypot(m.x-a.x,m.y-a.y)*(CUR.raid&&m.raidBoss?0.2:1)*(los(a.x,a.y,m.x,m.y)?1:1.7);if(d<bd){bd=d;a.tgt=m;}}
   if(!a.tgt&&a.fighter&&CUR.kind!=='town'&&(a.seekT=(a.seekT||0)-dt)<=0){a.seekT=1.5;let bb=1e9;for(const m of ents.mons){if(m.dead||(a.bad===m&&now<a.badT)||m.pet)continue;if(shr&&!P.dead&&(Math.hypot(m.x-P.x,m.y-P.y)<220||m.target===P))continue;const d=Math.hypot(m.x-a.x,m.y-a.y);if(d<bb){bb=d;a.tgt=m;}}if(a.tgt){a.path=null;a.wait=0;}}}
  if(a.tgt){const m=a.tgt,d=Math.hypot(m.x-a.x,m.y-a.y);a.face=m.x<a.x?-1:1;
   a.skCd-=dt;a.healCd-=dt;a.lvl=a.npc?a.npc.lv:1;
   if(a.hp<a.maxhp*0.5&&a.healCd<=0&&a.lvl>=8){a.healCd=14;const h=Math.round(a.maxhp*0.3);a.hp=Math.min(a.maxhp,a.hp+h);fx('fx_heal',a.x,a.y-20,1,0.5);floatT(a.x,a.y-56,'+'+h,'#7dff9a',11);}
   if(a.skCd<=0&&npcSkill(a,m,d)){a.skCd=rnd(4.5,7);a.atkCd=Math.max(a.atkCd,0.5);a.swing=1;return;}
   const rng=a.range?a.range:a.r+m.r+14;if(d>rng||(a.range&&!los(a.x,a.y-10,m.x,m.y-10))){const ox=a.x,oy=a.y;navTo(a,m.x,m.y,a.spd*(CUR.raid?1.25:1),dt);a.moving=true;a.walk+=dt*10;if(Math.hypot(a.x-ox,a.y-oy)<0.25){a.stuck+=dt;if(a.stuck>0.9||(a.navFail||0)>2){a.bad=m;a.badT=performance.now()+6000;a.tgt=null;a.stuck=0;a.wait=0;a.path=null;a.nav=null;a.navFail=0;}}else a.stuck=Math.max(0,a.stuck-dt);}
   else if(a.atkCd<=0){a.atkCd=a.cls==='warrior'?0.75:0.95;a.swing=1;const ang=Math.atan2(m.y-a.y,m.x-a.x);
    if(a.cls==='archer')allyShot(a,m,'arrow',1);else if(a.cls==='mage')allyShot(a,m,'bolt',1.05);else if(a.cls==='priest')allyShot(a,m,'bolt',0.8);
    else{ents.slashes.push({x:a.x+Math.cos(ang)*16,y:a.y-14+Math.sin(ang)*12,ang,life:0,max:0.18,r:24,col:'#ffccaa',w:3});hitMon(m,1,ang,{atk:a.atk,name:a.name});}}
   return;}}
 if(a.path&&a.pi<a.path.length){const p=a.path[a.pi];const ox=a.x,oy=a.y;if(stepToward(a,p.x,p.y-4,a.spd,dt))a.pi++;a.moving=true;a.walk+=dt*9;if(Math.hypot(a.x-ox,a.y-oy)<0.1){a.stuck=(a.stuck||0)+dt;if(a.stuck>0.6){a.path=null;a.stuck=0;a.wait=0.2;const q=nearestOpen(CUR,a.x,a.y);if(Math.hypot(q.x-a.x,q.y-a.y)>4){a.x=q.x;a.y=q.y;}}}else a.stuck=0;return;}
 a.wait-=dt;if(a.wait>0)return;a.wait=rnd(1.5,5);
 const tx=Math.floor(a.x/TS),ty=Math.floor(a.y/TS);let dest;
 if(CUR.kind==='town'){if(a.npc&&a.npc.role==='crafter'){const b=CUR.buildings.find(b=>b.shop===a.npc.shop);dest=[b.front.x+ri(-2,2),b.front.y+ri(0,1)];}else dest=pick(CUR.roadTiles);}
 else{const p=pick(CUR.spawns);dest=[Math.floor(p[0]/TS),Math.floor(p[1]/TS)];if(Math.hypot(dest[0]-tx,dest[1]-ty)>14)dest=[tx+ri(-5,5),ty+ri(-5,5)];}
 if(blocked(CUR,dest[0],dest[1]))return;a.path=pathTo(CUR,tx,ty,dest[0],dest[1]);a.pi=0;}
// ===== 대화 생성기: 성격 × 상황 × 기억 =====
const PERS=[
 {n:'쾌활',e:['!','~!',' 하하!','!'],hi:['안녕하세요!','반가워요!','오, 모험가님!']},
 {n:'무뚝뚝',e:['.','.','. 그뿐이다.','.'],hi:['…왔나.','무슨 일이지.','음.']},
 {n:'허세',e:['! 내가 누군지 알지?','. 뭐, 나라면 쉽지.','!','. 당연한 거 아냐?'],hi:['오, 내 팬인가?','소문 듣고 왔지?','이 몸에게 무슨 볼일이야?']},
 {n:'소심',e:['… 아마도요.','…','… 무섭지만요.','…요.'],hi:['아, 안녕하세요…','저, 저요?','깜짝이야…']},
 {n:'수다',e:['! 그거 알아요?','~ 근데 있잖아요,','! 진짜라니까요.','!'],hi:['어머, 마침 잘 왔어요!','들어봐요, 들어봐요!','오늘 얘기할 게 산더미예요!']},
 {n:'현자',e:['. 명심하게.','. 세상 이치가 그렇지.','.','. 허허.'],hi:['어서 오게, 젊은이.','바람이 자네를 이리로 데려왔군.','기다리고 있었네.']}];
const hsh=s=>{let h=7;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h;};
function persOf(a){const k=a.npc?a.npc.id+'_'+a.npc.name:a.name+a.look.img;return PERS[hsh(k)%PERS.length];}
const dayPart=()=>{const h=G.hour%24;return h<6?'새벽':h<11?'아침':h<17?'낮':h<21?'저녁':'밤';};
function sayV(a,cands){const P0=persOf(a);a.mem=a.mem||[];const pool=cands.filter(Boolean).filter(x=>!a.mem.includes(x));const line=pick(pool.length?pool:cands.filter(Boolean));a.mem.push(line);if(a.mem.length>6)a.mem.shift();
 let s=line;if(!/[!?.…~]$/.test(s))s+=pick(P0.e);return s;}
function ctxLines(a){const L=[],tn=CUR.kind==='town'?TOWNS[CUR.ti]:null,dp=dayPart(),r=G.rift,ev=G.events.length?pick(G.events):null,oh=pick(G.npcs.filter(n=>n.role==='hunter'));
 L.push(dp==='밤'?'밤엔 바깥에 나가지 않는 게 좋아요':dp==='아침'?'아침 공기가 상쾌하네요':dp==='저녁'?'벌써 해가 지네':dp==='새벽'?'이 시간까지 안 자고 뭐 해요':'오늘 날씨 참 좋다');
 if(r)L.push(r.state==='invade'?`${TOWNS[r.town].name}에 괴물이 쏟아지고 있대요`:`${TOWNS[r.town].name}에 균열이 열렸다던데, 균열 Lv${r.lv}이래요`,r.evil?'이번 균열은 기운이 심상치 않아요. 악한 균열이래':`균열 보스를 잡으면 다이아를 준다던데`);
 if(ev)L.push(ev.text.replace(/^[^\s]+\s/,'')+'래요');
 if(oh)L.push(`사냥꾼 ${oh.name} 말인데, 벌써 Lv${oh.lv}이래`,oh.kills>50?`${oh.name}은(는) 몬스터를 ${oh.kills}마리나 잡았대`:`${oh.name}은(는) 요즘 통 안 보이네`);
 if(P.lv>=10)L.push(`요즘 Lv${P.lv} 모험가 얘기가 자주 들려요. 혹시 당신?`);
 if(P.karma<=-40)L.push('당신… 눈빛이 좀 무섭네요','악명이 자자하던데, 조심하는 게 좋을걸');else if(P.karma>=40)L.push('악당을 혼내준 모험가가 당신이죠? 고마워요');
 if(P.kills>300)L.push(`처치 수가 ${P.kills}이라니, 대단해요`);
 if(tn)L.push(`${tn.name}은(는) ${tn.desc.replace(/\.$/,'')}`);
 return L;}
function chatLine(a){const n=a.npc,P0=persOf(a),fresh=!(a.met|| (n&&n.met));if(n)n.met=(n.met||0)+1;else a.met=(a.met||0)+1;const C=ctxLines(a);let L=[];
 const hi=fresh?pick(P0.hi)+' ':'';
 if(!n){const tn=CUR.kind==='town'?TOWNS[CUR.ti].name:'';
  L=[...C,'우리 애가 커서 모험가가 되겠다고 난리예요','장보러 나왔는데 물가가 또 올랐네',`${tn} 우물물은 언제 마셔도 시원해요`,'여관 수프가 오늘 특히 맛있대요','어젯밤에 이상한 빛이 하늘을 가르는 걸 봤어요','대장간 망치 소리가 자장가 같아요','사냥꾼들이 재료를 많이 팔아야 물약값이 내려요',
   'B급 알이 S급으로 바뀌는 비법이 있대요. 소문이지만요','보물상자 안에 미믹이 숨어 있을 때도 있대요','옆집 할머니가 고양이를 또 주워 왔어요','요즘 밤마다 늑대 울음소리가 들려요','이 길 끝에 맛있는 빵집이 있었는데 문을 닫았어요'];
  return hi+sayV(a,L);}
 if(n.role==='hunter'){const g=n.last>=0?GROUNDS[n.last]:null,here=CUR.kind!=='town'&&GROUNDS[CUR.gi]?GROUNDS[CUR.gi]:null,cls=clsNm(n);
  if(n.karma<=-40)L.push('혼자 다니면 위험하다고~ 특히 지갑 두둑한 사람은',`이 ${here?here.name:'동네'}에서 내 눈에 띄지 마`,'좋은 장비 들었네? 탐나는데');
  if(a.fighter&&here){const mn=pick(here.mons)[0];L.push(`${mn} 놈들, 오늘따라 많네`,`여기 보스 ${here.boss?here.boss[0]:'놈'} 본 적 있어?`,`${cls}는 ${n.cls==='mage'?'뒤에서 한 방':n.cls==='archer'?'거리 유지가 생명':'앞에서 버티는 게 일'}이지`,
   a.hp<a.maxhp*0.5?'물약이 간당간당해…':'컨디션 최고다',`오늘 벌써 ${ri(3,20)}마리째야`,`Lv${n.lv}이면 여기선 할 만하지`,P.lv>n.lv+10?'선배님, 여긴 너무 쉬운 데 아니에요?':P.lv<n.lv-5?'여긴 너한텐 좀 위험할 텐데':'같이 사냥할래? 경험치는 각자!',
   '몬스터 뺏지 마, 내 거야','방금 그 재료 내가 먼저 봤는데','가방이 차면 바로 마을로 간다');}
  else L.push(g?`${g.name}에 다녀왔어. ${MATS[g.matIds[0]].name}이(가) 꽤 나오더라`:'어디로 사냥을 갈까',`지금 쓰는 건 ${WNAME[n.w]}. 돈 모이면 바꿀 거야`,`물약이 ${n.pot}개 남았어`,`이번에 번 돈이 ${fmt(n.earned||0)}G야`,
   `다음엔 ${GROUNDS[chooseGround(n,n.node>=0&&n.node<NT?n.node:0)].name} 쪽으로 가볼까 해`,'균열 원정대 모집하면 불러줘. 몸값은 싸게 해줄게','요즘 정예 몬스터가 자주 보여',`${cls} 생활 ${ri(2,15)}년째다`);
  return hi+sayV(a,[...L,...C.slice(0,3)]);}
 if(n.role==='trader'){let best=null,br=1;const here=CUR.ti;for(let i=0;i<12;i++){const m=pick(MATS),u=ri(0,NT-1);if(u===here)continue;const rr=sellP(u,m.id)/Math.max(1,sellP(here,m.id));if(rr>br){br=rr;best=[m,u];}}
  if(best)L.push(`${TOWNS[best[1]].name}에선 ${best[0].name}을(를) ${sellP(best[1],best[0].id)}G에 사준다더군. 여기선 ${sellP(here,best[0].id)}G인데 말이야`);
  L.push(`장사 ${n.trips||0}번째 길이야`,`이번 장사로 ${fmt(Math.max(0,n.profit||0))}G 남겼지`,'역마차 바퀴가 또 빠졌어','길에서 산적을 만날 뻔했지 뭐야','싸게 사서 비싸게 판다, 그게 전부야','희귀 재료는 늘 부르는 게 값이지');
  return hi+sayV(a,[...L,...C]);}
 L.push(n.miss?`${n.status}. 재료상에 재료가 들어와야 만들지`:n.status||'오늘도 망치질이다',`이번 달에만 ${n.made||0}개를 만들었어`,'좋은 재료가 좋은 장비를 만든다','불 조절이 제일 어려워','손님, 장비는 아껴 써야 오래 가요');
 return hi+sayV(a,[...L,...C.slice(0,2)]);}
const BARK={kill:['하나 끝!','다음!','쉽네','이 정도야 뭐','처리 완료!','봤지?','하나 더!'],hurt:['큭!','아프잖아!','물약 어딨지…','버텨야 해!','이 녀석 세다!'],boss:['보스다! 다들 붙어!','저 덩치 좀 봐!','지금이 기회야!','한꺼번에 몰아쳐!'],idle:['흠흠~','어디 재료 없나','오늘은 운이 좋을 것 같아','배고프다…','슬슬 쉬고 싶네']};
function bark(a,k,p){if(!a||a.bubT>0.3||R()>(p||0.35))return;a.bubble=sayV(a,BARK[k]);a.bubT=1.6;}
function talkLine(a){return chatLine(a);}
function talkLine0(a){const nextT=TOWNS.filter(t=>t.unlock>P.lv).sort((x,y)=>x.unlock-y.unlock)[0];
 if(!a.npc){const lines=[`이 마을 대장간 물건은 장인들이 재료가 들어와야 만들 수 있대요.`,`사냥꾼들이 재료를 팔아야 물약도 채워진다니까요.`,`밤이 되면 바깥이 꽤 어두워져요. 조심하세요.`,`${CUR.name}은(는) 좋은 곳이에요. 천천히 둘러보세요.`,
  nextT?`레벨 ${nextT.unlock}이 되면 ${nextT.name}행 역마차를 탈 수 있대요.`:`이제 어디든 갈 수 있겠네요, 모험가님!`];
  const lockG=CUR.exits.find(e=>e.gi!==undefined&&GROUNDS[e.gi].lv>P.lv);if(lockG)lines.push(`${GROUNDS[lockG.gi].name}은(는) 레벨 ${GROUNDS[lockG.gi].lv}은 돼야 들어갈 수 있어요.`);return pick(lines);}
 const n=a.npc;
 if(n.role==='hunter'){if(a.fighter)return pick([`${CUR.name}은(는) 내 구역이야. 몬스터 뺏지 마!`,`Lv${n.lv}이면 여기선 할 만하지.`,`가방이 차면 바로 마을로 간다.`]);
  const g=n.last>=0?GROUNDS[n.last]:null;return pick([g?`${g.name}에 다녀왔어. ${MATS[g.matIds[0]].name}이(가) 꽤 나오더라.`:`어디로 사냥을 갈까…`,`지금 쓰는 건 ${WNAME[n.w]}. 대장간에 새 물건 들어오면 바로 살 거야.`,`물약이 ${n.pot}개 남았어. 넉넉하진 않네.`]);}
 if(n.role==='trader'){let best=null,br=1;const here=CUR.ti;for(let i=0;i<12;i++){const m=pick(MATS),u=ri(0,4);if(u===here)continue;const r=sellP(u,m.id)/Math.max(1,sellP(here,m.id));if(r>br){br=r;best=[m,u];}}
  return best?`${TOWNS[best[1]].name}에선 ${best[0].name}을(를) ${sellP(best[1],best[0].id)}G에 사준다더군. 여기선 ${sellP(here,best[0].id)}G인데 말이야.`:`요즘은 남는 장사가 없어.`;}
 return n.miss?`${n.status}. 누가 재료상에 좀 팔아주면 좋겠는데…`:n.status||'오늘도 망치질이다.';}
