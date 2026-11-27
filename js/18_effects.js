'use strict';
// =====================================================================
//  이펙트
// =====================================================================
function burst(x,y,n,col,sp){for(let i=0;i<n;i++){const a=R()*Math.PI*2,v=rnd(.3,1)*sp;ents.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.3,gr:300,life:0,max:rnd(.3,.7),col,s:rnd(1.5,3.5)});}}
function floatT(x,y,text,color,size,max=1){let off=0;for(const f of ents.floats)if(f.life<0.45&&Math.abs((f.x0??f.x)-x)<50&&Math.abs((f.y0??f.y)-y)<24)off++;ents.floats.push({x:x+(off%2?8:-8)*(off>0),y:y-off*15,x0:x,y0:y,text,color,size,life:0,max:max+off*0.12});}
const CHT=[{n:'나무 상자',c:'#8a5a2a',b:'#d4af37',k:1},{n:'은 상자',c:'#8a96a8',b:'#e8eef8',k:2.2},{n:'황금 상자',c:'#d4a020',b:'#fff2a8',k:5}];
function spawnChest(m){const p=pick(m.spawns);if(!p)return;const r=R(),tier=r<0.06?2:r<0.3?1:0;ents.chests.push({x:p[0],y:p[1],tier,t:R()*5});}
function nearChest(){if(!ents||!ents.chests)return null;for(const ch of ents.chests)if(Math.hypot(P.x-ch.x,P.y-ch.y)<34)return ch;return null;}
function openChest(ch){ents.chests.splice(ents.chests.indexOf(ch),1);const T=CHT[ch.tier],lv=CUR.pd?dunLv():CUR.gi!=null&&GROUNDS[CUR.gi]?GROUNDS[CUR.gi].lv:P.lv,g=CUR.gi!=null?GROUNDS[CUR.gi]:null;sfx('chest');
 burst(ch.x,ch.y-12,26,T.b,200);floatT(ch.x,ch.y-46,`🎁 ${T.n} 열림!`,T.b,14,1.6);
 if(ch.tier===0&&R()<0.08&&g){const mm=mkMon(CUR.gi,-1,false);mm.elite=true;mm.name='미믹';mm.hp=mm.maxhp=mm.maxhp*3;mm.x=mm.hx=ch.x;mm.y=mm.hy=ch.y;mm.aggroT=8;ents.mons.push(mm);toast('😱 미믹이었다!');return;}
 const p0=ents.picks.length,pk=(kind,o)=>ents.picks.push(Object.assign({x:ch.x,y:ch.y,vx:0,vy:0,z:0,vz:130,kind,t:0},o));
 pk('gold',{amt:Math.round(lv*rnd(15,35)*T.k)});if(R()<0.5)pk('gold',{amt:Math.round(lv*rnd(8,20)*T.k)});
 for(let i=0;i<ri(1,2)+ch.tier;i++)pk('pot',{id:lv>=20?'p3':lv>=10?'p2':'p1'});
 if(R()<0.35+ch.tier*0.3){const k=R()<0.2?pick(['r','n']):pick(['w','a','h','b']),tt=clamp(lvTier(lv)+(ch.tier>0?1:0),0,5);pk('gear',{item:plusItem(makeItem(k,k==='r'||k==='n'?Math.min(3,tt):tt,0.3+ch.tier*0.35),plusOf(lv)+(ch.tier===2?1:0))});}
 if(g&&R()<0.3+ch.tier*0.25)pk('mat',{id:g.sp});if(g&&R()<0.08+ch.tier*0.1)pk('egg',{gi:CUR.gi,mi:R()<0.2&&GROUNDS[CUR.gi].boss?-1:rmi(CUR.gi)});if(g&&R()<0.06+ch.tier*0.1)pk('core',{gi:CUR.gi});
 if(ch.tier===2)addDia(ri(3,6),'황금 상자');scatterPicks(p0);if(typeof questEv==='function')questEv('chest',1);news(`🎁 ${T.n}를 열었다`,'me');}
function drawChests(c,t){for(const ch of ents.chests){const T=CHT[ch.tier],x=ch.x,y=ch.y,b=Math.sin(t*3+ch.t)*1.5;E(c,x,y+2,14,5,'rgba(0,0,0,.35)');
  const ci=IMG['chest_'+ch.tier]||(IMG.chest_0&&fimg(IMG.chest_0,ch.tier===1?'grayscale(1) brightness(1.35)':ch.tier===2?'sepia(1) saturate(3) brightness(1.15)':'none'));if(ci){if(ch.tier){const g=c.createRadialGradient(x,y-10,2,x,y-10,30);g.addColorStop(0,T.b+'aa');g.addColorStop(1,T.b+'00');c.fillStyle=g;c.beginPath();c.arc(x,y-10,30,0,7);c.fill();}const w=34,h=w*ci.height/ci.width;c.drawImage(ci,x-w/2,y-h+4+b,w,h);continue;}
  if(ch.tier){const g=c.createRadialGradient(x,y-10,2,x,y-10,30);g.addColorStop(0,T.b+'aa');g.addColorStop(1,T.b+'00');c.fillStyle=g;c.beginPath();c.arc(x,y-10,30,0,7);c.fill();}
  c.fillStyle=T.c;c.strokeStyle='#2a1808';c.lineWidth=2;rr(c,x-13,y-16+b,26,16,3);c.fill();c.stroke();c.beginPath();c.ellipse(x,y-16+b,13,7,0,Math.PI,0);c.fill();c.stroke();
  c.fillStyle=T.b;c.fillRect(x-13,y-12+b,26,3);c.fillRect(x-2.5,y-16+b,5,7);if(R()<0.05)ents.parts.push({x:x+rnd(-12,12),y:y-18+rnd(-6,6),vx:0,vy:-20,gr:0,life:0,max:0.6,col:'#fff8c0',s:2});}}
function scatterPicks(from){const ps=ents.picks.slice(from),n=ps.length;if(n<2)return;const a0=R()*6.28,sp=55+Math.min(60,n*7);ps.forEach((p,i)=>{const a=a0+i/n*6.283+rnd(-0.2,0.2);p.vx=Math.cos(a)*sp*rnd(0.8,1.15);p.vy=Math.sin(a)*sp*0.75*rnd(0.8,1.15);p.vz=rnd(120,150);p.t=-0.15*i/n;});}
function updFx(dt){
 ents.parts=ents.parts.filter(p=>{p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gr*dt;return p.life<p.max;});
 ents.floats=ents.floats.filter(f=>{f.life+=dt;f.y-=30*dt;return f.life<f.max;});
 ents.slashes=ents.slashes.filter(s=>{s.life+=dt;return s.life<s.max;});ents.rings=ents.rings.filter(r=>{r.life+=dt;return r.life<r.max;});
 ents.projs=ents.projs.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(blocked(CUR,Math.floor(p.x/TS),Math.floor((p.y+16)/TS)))return false;
  for(const a of [...ents.actors,...(ents.pets||[])])if((a.fighter||a.pet)&&!a.down&&a.hp>0&&Math.hypot(p.x-a.x,p.y-(a.y-14))<14){actorHurt(a,p.atk);p.life=0;}if(p.life<=0)return false;
  if(!P.dead&&Math.hypot(p.x-P.x,p.y-(P.y-14))<16){playerHurt(p.atk,p.el);if(p.slow)P.slowT=Math.max(P.slowT||0,p.slow);if(p.poison){P.poisonT=4;P.poisonD=p.atk*0.08;}burst(p.x,p.y,8,p.col,120);return false;}return p.life>0;});
 ents.tele=ents.tele.filter(t=>{t.t+=dt;if(t.t>=t.max){cam.shake=10;ents.rings.push({x:t.x,y:t.y,life:0,max:0.4,r:t.r,col:'255,120,60'});burst(t.x,t.y,26,'#ff8a4a',220);
  if(Math.hypot(P.x-t.x,P.y-t.y)<t.r){playerHurt(t.atk,t.el);if(t.slow)P.slowT=Math.max(P.slowT||0,t.slow);}for(const a of [...ents.actors,...(ents.pets||[])])if((a.fighter||a.pet)&&!a.down&&Math.hypot(a.x-t.x,a.y-t.y)<t.r)actorHurt(a,t.atk);return false;}return true;});
 {const cur=ents.timers;ents.timers=[];for(const tm of cur){tm.t-=dt;if(tm.t<=0)tm.fn();else ents.timers.push(tm);}}
 ents.pproj=ents.pproj.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
  if(p.kind==='fire'&&R()<0.8)ents.parts.push({x:p.x,y:p.y,vx:rnd(-20,20),vy:rnd(-30,0),gr:0,life:0,max:0.3,col:pick(['#ff8a2a','#ffd04a']),s:rnd(2,4)});
  if(p.kind==='wave'&&R()<0.6)ents.parts.push({x:p.x,y:p.y,vx:0,vy:0,gr:0,life:0,max:0.2,col:'#bff',s:2});
  if(blocked(CUR,Math.floor(p.x/TS),Math.floor((p.y+16)/TS))){if(p.kind==='fire')explode(p.x,p.y+10,64,p.mult);return false;}
  for(const m of ents.mons){if(m.dead||p.hit.has(m))continue;if(Math.hypot(m.x-p.x,(m.y-16)-p.y)<p.r+m.r){if(p.kind==='fire'){explode(p.x,p.y+10,64,p.mult);return false;}p.hit.add(m);hitMon(m,p.mult,p.ang);if(p.onHit)p.onHit(m);if(p.single){burst(p.x,p.y,8,p.col||'#fff',140);return false;}}}
  if(p.life<=0){if(p.kind==='fire')explode(p.x,p.y+10,64,p.mult);return false;}return true;});
 ents.aproj=ents.aproj.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.kind==='fire'&&R()<0.6)ents.parts.push({x:p.x,y:p.y,vx:rnd(-20,20),vy:rnd(-30,0),gr:0,life:0,max:0.3,col:pick(['#ff8a2a','#ffd04a']),s:rnd(2,4)});
  const boom=()=>{burst(p.x,p.y,20,'#ff8a2a',200);ents.rings.push({x:p.x,y:p.y+10,life:0,max:0.3,r:58,col:'255,150,60'});fx('fx_explosion',p.x,p.y,1.4,0.4);hitAreaBy(p.x,p.y+10,58,p.mult,p.by);};
  if(blocked(CUR,Math.floor(p.x/TS),Math.floor((p.y+16)/TS))){if(p.kind==='fire')boom();return false;}
  p.hit=p.hit||new Set();for(const m of ents.mons){if(m.dead||p.hit.has(m))continue;if(Math.hypot(m.x-p.x,(m.y-16)-p.y)<p.r+m.r){if(p.kind==='fire'){boom();return false;}p.hit.add(m);hitMon(m,p.mult,p.ang,p.by);if(!p.pierce){burst(p.x,p.y,5,p.col,120);return false;}}}
  if(p.life<=0&&p.kind==='fire')boom();return p.life>0;});
 ents.ghosts=ents.ghosts.filter(g=>(g.life+=dt)<g.max);ents.bolts=ents.bolts.filter(b=>(b.life+=dt)<b.max);ents.fxs=ents.fxs.filter(f=>(f.t+=dt)<f.dur);
 ents.meteors=ents.meteors.filter(mt=>{mt.t+=dt;if(mt.t>=mt.max){explode(mt.x,mt.y,mt.r,mt.mult);fx('fx_meteor',mt.x,mt.y-30,4,0.6);cam.shake=14;return false;}return true;});
 ents.picks=ents.picks.filter(p=>{p.t+=dt;if(p.vz||p.z>0){p.z+=p.vz*dt;p.vz-=400*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.z<=0){p.z=0;p.vz=0;p.vx=p.vy=0;}}
  if(p.t>60)return false;if(p.t<0.4||P.dead)return true;const d=Math.hypot(P.x-p.x,P.y-p.y);
  if(d<75){const full=p.kind==='mat'&&pFit(p.id)<=0;if(full){if(!p.warned){p.warned=1;toast('가방이 가득 찼다! 마을에서 팔자');}return true;}p.x+=(P.x-p.x)*Math.min(1,dt*8);p.y+=(P.y-p.y)*Math.min(1,dt*8);}
  if(d<16){sfx(p.kind==='gold'?'coin':'pickup');if(p.kind==='gold'){if(HF('merchant'))p.amt=Math.round(p.amt*1.08);P.gold+=p.amt;floatT(P.x,P.y-40,`+${p.amt}G`,'#ffd23f',12);}else if(p.kind==='gear'){gainItem(p.item);}else if(p.kind==='egg'){const k=p.gi+'_'+p.mi,e=eggAdd(k,1,p.boost||0);const nm=monOf(p.gi,p.mi)[0];floatT(P.x,P.y-60,`🥚 ${nm}의 알 [${EGG_G[e.g].n}]`,EGG_G[e.g].c,14,1.6);news(`🥚 ${nm}의 알 [${EGG_G[e.g].n}등급 · ${eggStat(e)}] 획득`,'me');}else if(p.kind==='core'){P.cores[p.gi]=(P.cores[p.gi]||0)+1;floatT(P.x,P.y-60,`💠 ${GROUNDS[p.gi].name} 코어!`,'#c77dff',14,1.6);news(`💠 ${GROUNDS[p.gi].name} 몬스터 코어 획득`,'me');}else if(p.kind==='pot'){P.pot[p.id]++;floatT(P.x,P.y-40,`+${CB[p.id].name}`,'#7dff9a',12);}
   else{addBag(P.bag,p.id);floatT(P.x,P.y-40,`+${MATS[p.id].name}`,MATS[p.id].rare?'#ff9aff':'#ffe2a8',12);}return false;}return true;});}
