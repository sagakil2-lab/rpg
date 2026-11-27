'use strict';
// =====================================================================
//  내 몬스터 — 부화 · 강화 · 펫 · 알 합성 · 투기장
// =====================================================================
function monsInit(){P.mons=P.mons||[];P.monU=P.monU||1;P.pets=P.pets||[];P.petX=P.petX||0;P.arena=P.arena||{slots:[null],open:1,f:[],rest:[],nt:[],log:[],earn:0,w:0,l:0};return P.mons;}
function drawMonCvs(root){(root||document).querySelectorAll('canvas.mcv').forEach(cv=>{const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);const m=monVis(+cv.dataset.gi,+cv.dataset.mi);drawMonAt(c,m,cv.width/2,cv.height-2,cv.height*(+cv.dataset.mi<0?0.95:0.82),0.3,'move',1);});}
const monById=u=>monsInit().find(r=>r.uid===u);
function monStat(r){const g=GROUNDS[r.gi],boss=r.mi<0,e=r.e||{lvb:0,h:1,a:1,d:1},L=g.lv+(boss?4:0)+e.lvb+(r.lv-1);
 return{L,hp:Math.round((20+L*14)*(boss?3:1)*e.h*2.2),atk:Math.round((3+L*2.6)*(boss?1.4:1)*e.a*1.5),def:Math.round(L*1.2*e.d)};}
const monName=r=>monOf(r.gi,r.mi)[0]+(r.lv>1?' +'+(r.lv-1):'');
const MONMAX=30;
function monExp(r,x){if(!r||r.lv>=MONMAX)return;r.exp=(r.exp||0)+x;const need=()=>Math.round(40*Math.pow(r.lv,1.6)*(1+GROUNDS[r.gi].lv/20));let up=0;while(r.lv<MONMAX&&r.exp>=need()){r.exp-=need();r.lv++;up=1;}
 if(up){floatT(P.x,P.y-90,`🐾 ${monOf(r.gi,r.mi)[0]} 레벨 업! (+${r.lv-1})`,'#9fef9f',13,1.6);if(ents)ents.petSig=null;}}
function petSlots(){return Math.min(5,1+(P.lv>=30?1:0)+(P.lv>=60?1:0)+(P.petX||0));}
const PETX=[{d:60,g:30000},{d:150,g:120000}];
function drawMonAt(c,m,x,y,H,t,an,face){const msh=m.vt&&IMG[m.id+'_sheet']?vtSheet(m.id+'_sheet',m.vt):IMG[m.id+'_sheet'];
 if(msh){drawSheet(c,msh,SHEETS.mon,an||'move',null,x,y,H,face||1,false,t);return;}const img=IMG[m.id];if(img){const W=H*img.width/img.height;c.save();c.translate(x,y);if((face||1)<0)c.scale(-1,1);c.drawImage(img,-W/2,-H+4,W,H);c.restore();return;}
 c.save();c.translate(x,y);c.scale(H/60*(face>0?-1:1),H/60);drawMon(c,{shape:m.shape,color:m.color,boss:m.boss},0,0,t,false);c.restore();}
function monVis(gi,mi){const m=mkMon(gi,mi<0?-1:mi,mi<0);m.awk=false;return m;}
// ---------- 부화 연출 ----------
function hatchAnim(gi,mi,e,cb,mode){const ov=document.createElement('div');ov.id='hatch';ov.innerHTML='<canvas></canvas>';document.body.appendChild(ov);const cv2=ov.querySelector('canvas');const W=innerWidth,H=innerHeight;cv2.width=W*DPR;cv2.height=H*DPR;
 const c=cv2.getContext('2d');c.scale(DPR,DPR);const eg=document.createElement('canvas');eg.width=eg.height=180;drawIcon(eg,{t:'egg',gi,mi});const mv=monVis(gi,mi),G0=EGG_G[e?e.g:0];
 const ps=[];let t0=performance.now(),done=false,s1=0,s2=0;const cx=W/2,cy=H*0.55,fin=()=>{if(done)return;done=true;ov.classList.add('out');setTimeout(()=>{ov.remove();cb&&cb();},300);};
 ov.addEventListener('pointerdown',()=>{if((performance.now()-t0)/1000>1.9)fin();});
 const cracks=[[[0,-40],[8,-20],[-6,-4],[10,14]],[[-30,-10],[-14,-2],[-22,16]],[[26,-24],[14,-8],[24,8],[12,26]]];
 const loop=()=>{if(done)return;const T=(performance.now()-t0)/1000;c.clearRect(0,0,W,H);c.fillStyle=`rgba(8,5,15,${Math.min(0.93,T*2)})`;c.fillRect(0,0,W,H);
  const burst=1.45;
  if(T>burst){const k=Math.min(1,(T-burst)/0.6);c.save();c.translate(cx,cy-40);c.rotate(T*0.4);for(let i=0;i<14;i++){c.rotate(Math.PI/7);const g=c.createLinearGradient(0,0,0,-H);g.addColorStop(0,G0.c+'cc');g.addColorStop(1,G0.c+'00');c.fillStyle=g;c.globalAlpha=0.35*k;c.beginPath();c.moveTo(-18,0);c.lineTo(18,0);c.lineTo(60,-H);c.lineTo(-60,-H);c.fill();}c.restore();c.globalAlpha=1;}
  if(T<burst+0.05){const amp=T<0.3?0:Math.min(1,(T-0.3)/1.1),sh=Math.sin(T*(30+amp*30))*amp*0.28,j=amp*6;c.save();c.translate(cx+rnd(-j,j)*0.4,cy+20);c.rotate(sh);c.translate(0,-90);const sz=180*(1+amp*0.08);c.drawImage(eg,-sz/2,-sz/2,sz,sz);
   c.strokeStyle='#2a1a10';c.lineWidth=3;c.lineJoin='round';cracks.forEach((cr,i)=>{const on=T>0.55+i*0.3;if(!on)return;if(i===0&&!s1){s1=1;sfx('hit');}c.beginPath();cr.forEach(([x,y],k)=>k?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#fff8';c.lineWidth=1;c.stroke();c.strokeStyle='#2a1a10';c.lineWidth=3;});
   if(amp>0.5){c.globalCompositeOperation='lighter';c.globalAlpha=(amp-0.5)*0.9;c.fillStyle=G0.c;c.beginPath();c.arc(0,0,70,0,7);c.fill();c.globalAlpha=1;c.globalCompositeOperation='source-over';}c.restore();}
  if(T>=burst&&!s2){s2=1;sfx('levelup');for(let i=0;i<60;i++){const a=R()*6.28,v=rnd(150,520);ps.push({x:cx,y:cy-70,vx:Math.cos(a)*v,vy:Math.sin(a)*v-120,l:0,m:rnd(.6,1.3),s:rnd(3,8),col:i<24?'#f3ead8':pick([G0.c,'#fff','#ffe38a'])});}}
  if(T>=burst){const k=Math.min(1,(T-burst)/0.45),bo=1+Math.sin(Math.min(1,k)*Math.PI)*0.18,HH=(mode==='egg'?150:mi<0?190:150)*k*bo;
   if(T<burst+0.25){c.fillStyle=`rgba(255,255,255,${1-(T-burst)/0.25})`;c.fillRect(0,0,W,H);}
   c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(cx,cy+20,70*k,16*k,0,0,7);c.fill();
   if(mode==='egg'){c.drawImage(eg,cx-HH/2,cy+20-HH,HH,HH);}else{if(IMG.egg_shell){const sw=130*k,sh=sw*IMG.egg_shell.height/IMG.egg_shell.width;c.drawImage(IMG.egg_shell,cx-sw/2,cy+28-sh,sw,sh);}drawMonAt(c,mv,cx,cy+20,HH,T,'move',1);}
   if(T>burst+0.4){c.textAlign='center';c.font='900 30px sans-serif';c.lineWidth=6;c.strokeStyle='#000';const tt=mode==='egg'?`[${G0.n}] ${monOf(gi,mi)[0]}의 알`:`[${G0.n}] ${monOf(gi,mi)[0]} 탄생!`;c.strokeText(tt,cx,cy+80);c.fillStyle=G0.c;c.fillText(tt,cx,cy+80);
    c.font='bold 14px sans-serif';c.fillStyle='#e8dcc6';c.fillText('화면을 누르면 계속',cx,cy+110);}}
  for(const p of ps){p.l+=1/60;p.x+=p.vx/60;p.y+=p.vy/60;p.vy+=600/60;if(p.l>p.m)continue;c.globalAlpha=1-p.l/p.m;c.fillStyle=p.col;c.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s*0.7);}c.globalAlpha=1;
  if(T>5)fin();requestAnimationFrame(loop);};loop();}
// ---------- 펫 ----------
const PRANGED=['ghost','bird','dragon','slime','toad','shroom','bat'];
const petAlive=r=>!r.dead||Date.now()>=r.dead;
function healPets(x,y,rad,frac,show){let n=0;for(const m of ents.pets||[]){if(m.hp<=0||Math.hypot(m.x-x,m.y-y)>rad)continue;const h=Math.round(m.maxhp*frac);m.hp=Math.min(m.maxhp,m.hp+h);m.pet.php=m.hp;n++;if(show)floatT(m.x,m.y-40,'+'+h,'#7dff9a',11);}return n;}
function petHurt(m,atk){if(m.hp<=0)return;const dmg=Math.max(1,Math.round(dmgCalc(atk,m.pdef,1)));m.hp-=dmg;m.flash=1;m.pet.php=m.hp;floatT(m.x,m.y-40,'-'+dmg,'#ffd0a0',10);
 if(m.hp<=0){m.hp=0;m.pet.php=null;m.pet.dead=Date.now()+90000;burst(m.x,m.y-16,20,'#9fef9f',160);floatT(m.x,m.y-60,`🐾 ${monOf(m.pet.gi,m.pet.mi)[0]} 쓰러짐!`,'#ff9a8a',13,1.6);toast(`🐾 ${monOf(m.pet.gi,m.pet.mi)[0]}이(가) 쓰러졌다 — 90초 뒤 회복`);ents.petSig=null;}}
function updPets(dt){if(!P)return;monsInit();const sig=P.pets.join(',')+'|'+P.pets.map(u=>{const r=monById(u)||{};return r.lv+(petAlive(r)?'a':'d');}).join(',');
 P.trail=P.trail||[];const lt=P.trail[P.trail.length-1];if(lt&&Math.hypot(lt.x-P.x,lt.y-P.y)>120){P.trail=[];if(ents.pets)ents.pets.forEach((m,i)=>{const q=nearestOpen(CUR,P.x-20-i*16,P.y+10);m.x=q.x;m.y=q.y;m.tgt=null;});}if(!lt||Math.hypot(lt.x-P.x,lt.y-P.y)>7){P.trail.push({x:P.x,y:P.y});if(P.trail.length>90)P.trail.shift();}
 if(!ents.pets||ents.petSig!==sig){ents.petSig=sig;ents.pets=P.pets.slice(0,petSlots()).map(u=>monById(u)).filter(r=>r&&petAlive(r)).map((r,i)=>{if(r.dead){r.dead=0;r.php=null;}const m=monVis(r.gi,r.mi),st=monStat(r);m.boss=false;m.elite=false;m.r=11;m.pet=r;m.name='🐾'+monOf(r.gi,r.mi)[0];m.lv=st.L;m.maxhp=Math.round(st.hp*0.6);m.hp=r.php!=null?Math.min(m.maxhp,r.php):m.maxhp;m.maxmp=40;m.mp=r.pmp!=null?r.pmp:40;m.pdef=st.def;m.prange=PRANGED.includes(m.shape)?170:0;m.patk=st.atk*0.38;m.spd=150;
   const q=nearestOpen(CUR,P.x-20-i*16,P.y+10);m.x=q.x;m.y=q.y;m.atkCd=rnd(0.3,1);return m;});}
 if(!P._petChk||P._petChk<performance.now()){P._petChk=performance.now()+1000;if(P.pets.some(u=>{const r=monById(u);return r&&r.dead&&Date.now()>=r.dead;}))ents.petSig=null;}
 ents.pets.forEach((m,i)=>{m.anim+=dt;m.lunge=Math.max(0,m.lunge-dt);m.atkCd-=dt;m.flash=Math.max(0,m.flash-dt*5);m.skCd=(m.skCd||3)-dt;
  const town=CUR.kind==='town'&&!CUR.invaded;m.hp=Math.min(m.maxhp,m.hp+m.maxhp*(town?0.1:m.tgt?0.004:0.015)*dt);m.mp=Math.min(m.maxmp,m.mp+(town?10:3)*dt);m.pet.php=m.hp;m.pet.pmp=m.mp;
  if(Math.hypot(m.x-P.x,m.y-P.y)>380){const q=nearestOpen(CUR,P.x-20,P.y+12);m.x=q.x;m.y=q.y;m.tgt=null;}
  const fight=CUR.kind!=='town'||CUR.invaded;if(fight&&!P.dead){if(!m.tgt||m.tgt.dead||Math.hypot(m.tgt.x-P.x,m.tgt.y-P.y)>280){m.tgt=null;let bd=230;for(const mo of ents.mons){if(mo.dead)continue;const d=Math.hypot(mo.x-P.x,mo.y-P.y);if(d<bd){bd=d;m.tgt=mo;}}}}else m.tgt=null;
  if(m.tgt){const t=m.tgt,d=Math.hypot(t.x-m.x,t.y-m.y),by={atk:m.patk,name:m.name,own:true,pet:m.pet},ang=Math.atan2(t.y-m.y,t.x-m.x);m.face=t.x<m.x?-1:1;
   const shoot=(k,sp,col)=>ents.aproj.push({kind:'bolt',x:m.x,y:m.y-20,vx:Math.cos(Math.atan2(t.y-16-(m.y-20),t.x-m.x)+sp)*340,vy:Math.sin(Math.atan2(t.y-16-(m.y-20),t.x-m.x)+sp)*340,ang,life:1,mult:k,by,r:8,col});
   if(m.skCd<=0&&m.mp>=20&&d<(m.prange||60)+20){m.mp-=20;m.skCd=rnd(5,8);m.lunge=0.25;floatT(m.x,m.y-50,m.prange?'연속 발사!':'강타!','#9fef9f',11);fx('fx_pet_skill',m.prange?m.x:t.x,(m.prange?m.y:t.y)-20,1,0.45);
    if(m.prange){for(const sp of[-0.2,0,0.2])shoot(1.3,sp,'#9fef9f');}else{ents.rings.push({x:t.x,y:t.y,life:0,max:0.3,r:50,col:'160,255,160'});hitMon(t,2.4,ang,by);t.stun=Math.max(t.stun||0,0.6);}return;}
   if(m.prange){if(d>m.prange||!los(m.x,m.y-10,t.x,t.y-10))navTo(m,t.x,t.y,m.spd,dt);else if(m.atkCd<=0){m.atkCd=1.2;m.lunge=0.2;shoot(1,0,'#c8ffb0');}}
   else if(d>m.r+t.r+10)navTo(m,t.x,t.y,m.spd,dt);else if(m.atkCd<=0){m.atkCd=1.05;m.lunge=0.25;burst(t.x,t.y-14,6,'#9fef9f',120);hitMon(t,1,ang,by);}return;}
  const tr=P.trail,idx=Math.max(0,tr.length-1-(i+1)*5),p=tr[idx]||{x:P.x,y:P.y};if(Math.hypot(p.x-m.x,p.y-m.y)>10){stepToward(m,p.x,p.y,Math.max(m.spd,Math.hypot(p.x-m.x,p.y-m.y)*3),dt);m.face=p.x<m.x?-1:1;}});}
// ---------- 투기장 ----------
function arenaTick(dt){const A=P.arena;if(!A)return;for(let i=0;i<A.open;i++){const u=A.slots[i],r=u&&monById(u);A.rest[i]=(A.rest[i]||0)-dt;let f=A.f[i];
  if(!r){A.f[i]=null;continue;}
  if(!f){if(A.rest[i]>0)continue;A.nt[i]=(A.nt[i]==null?rnd(3,8):A.nt[i])-dt;if(A.nt[i]>0)continue;A.nt[i]=rnd(5,12);const st=monStat(r);
   const cand=G.npcs.filter(n=>n.role==='hunter'&&n.state!=='travel'&&!n.party&&Math.abs(n.lv-st.L)<=12);if(!cand.length)continue;const n=pick(cand),ns=npcStat(n);
   A.f[i]=f={nid:n.id,name:n.name,cls:n.cls||'warrior',nlv:n.lv,nhp:ns.hp,nmax:ns.hp,natk:ns.atk,ndef:ns.def,mhp:st.hp,mmax:st.hp,matk:st.atk,mdef:st.def,t:0,k:0,hm:0,hn:0,fx:[],end:0,res:null};continue;}
  f.hm=Math.max(0,f.hm-dt);f.hn=Math.max(0,f.hn-dt);f.fx=f.fx.filter(q=>(q.l+=dt)<1);
  if(f.res){f.end+=dt;if(f.end>2.2)A.f[i]=null;continue;}
  f.t+=dt;f.k-=dt;if(f.k<=0){f.k=0.85;const crit=R()<0.12;const d1=Math.round(dmgCalc(f.matk,f.ndef,crit?1.7:1)),d2=Math.round(dmgCalc(f.natk,f.mdef,R()<0.1?1.7:1));
   f.nhp-=d1;f.hm=0.3;f.fx.push({s:'-'+d1,x:1,l:0,c:crit?'#ffd23f':'#fff'});if(f.nhp>0){f.mhp-=d2;f.hn=0.3;f.fx.push({s:'-'+d2,x:0,l:0,c:'#ffaaaa'});}
   const fee=Math.round(20+f.nlv*6);
   if(f.nhp<=0){f.res='w',sfx('arena_win'),wkEv('arena');A.w++;P.gold+=fee*2;A.earn+=fee*2;monExp(r,12+f.nlv*2);r.aw=(r.aw||0)+1;const n=G.npcs.find(x=>x.id===f.nid);if(n)n.gold=Math.max(0,n.gold-fee);A.log.unshift(`🏆 ${monName(r)} 승리 — ${f.name}(Lv${f.nlv}) · +${fmt(fee*2)}G`);}
   else if(f.mhp<=0){f.res='l',sfx('arena_lose');A.l++;P.gold+=fee;A.earn+=fee;monExp(r,4+f.nlv);r.al=(r.al||0)+1;A.rest[i]=20;A.log.unshift(`💀 ${monName(r)} 패배 — ${f.name}(Lv${f.nlv}) · 입장료 +${fmt(fee)}G`);}
   if(A.log.length>30)A.log.length=30;}}}
const ARV={v:0};
function drawArena(){const cv=$('#arc');if(!cv)return;const c=cv.getContext('2d'),W=cv.width,H=cv.height,t=performance.now()/1000,A=P.arena,i=ARV.v,f=A.f[i],r=monById(A.slots[i]);
 if(IMG.arena_bg){const im=IMG.arena_bg,s=Math.max(W/im.width,H/im.height);c.drawImage(im,(W-im.width*s)/2,(H-im.height*s)/2,im.width*s,im.height*s);}else{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3a2a1e');g.addColorStop(0.45,'#5a4228');g.addColorStop(0.46,'#c8a46a');g.addColorStop(1,'#8a6a3a');c.fillStyle=g;c.fillRect(0,0,W,H);}
 if(!IMG.arena_bg)for(let k=0;k<70;k++){const x=(k*97)%W,y=18+((k*37)%60);c.fillStyle=['#a86a4a','#6a8ac8','#c8a84a','#8a5ac8','#d88a3a'][k%5];c.beginPath();c.arc(x+Math.sin(t*3+k)*1.5,y+Math.abs(Math.sin(t*4+k))*-3,6,0,7);c.fill();}
 if(!IMG.arena_bg){c.strokeStyle='#e8d0a0';c.lineWidth=3;c.beginPath();c.ellipse(W/2,H*0.74,W*0.42,H*0.18,0,0,7);c.stroke();}
 if(!r){c.fillStyle='#fff';c.font='bold 16px sans-serif';c.textAlign='center';c.fillText('이 칸에 몬스터를 배치하자',W/2,H*0.7);}
 else{const mv=drawArena.mv&&drawArena.mu===r.uid?drawArena.mv:(drawArena.mu=r.uid,drawArena.mv=monVis(r.gi,r.mi));const mx=W*0.28+(f&&f.hm>0?Math.sin((0.3-f.hm)/0.3*Math.PI)*40:0);
  drawMonAt(c,mv,mx,H*0.8,r.mi<0?130:100,t,f&&f.hm>0?'attack':'move',1);
  if(f){const n=G.npcs.find(x=>x.id===f.nid);if(n){if(!f.act||f.act.npc!==n){f.act=mkSimActor(n);f.act.fighter=false;}const a=f.act;a.x=W*0.72-(f.hn>0?Math.sin((0.3-f.hn)/0.3*Math.PI)*36:0);a.y=H*0.8;a.face=-1;a.swing=f.hn>0?1:0;a.walk=t*4;
    const sv=LBL.splice(0);c.save();c.translate(a.x,a.y);c.scale(1.7,1.7);c.translate(-a.x,-a.y);drawActor(c,a,t);c.restore();LBL.length=0;LBL.push(...sv);}
   const bar=(x,v,mx2,col,nm)=>{c.fillStyle='rgba(0,0,0,.6)';c.fillRect(x-90,98,180,30);c.fillStyle='#300';c.fillRect(x-84,116,168,8);c.fillStyle=col;c.fillRect(x-84,116,168*Math.max(0,v)/mx2,8);c.fillStyle='#fff';c.font='bold 12px sans-serif';c.textAlign='center';c.fillText(nm,x,112);};
   bar(W*0.28,f.mhp,f.mmax,'#7dff9a',monName(r));bar(W*0.72,f.nhp,f.nmax,'#ff6a5a',`${NCLS[f.cls][0]}${f.name} Lv${f.nlv}`);
   for(const q of f.fx){c.globalAlpha=1-q.l;c.font='900 20px sans-serif';c.fillStyle=q.c;c.strokeStyle='#000';c.lineWidth=4;const x=(q.x?W*0.72:W*0.28)+30,y=H*0.6-q.l*40;c.strokeText(q.s,x,y);c.fillText(q.s,x,y);}c.globalAlpha=1;
   if(f.res&&IMG[f.res==='w'?'arena_win':'arena_lose']){const im=IMG[f.res==='w'?'arena_win':'arena_lose'],w=Math.min(300,W*0.5),h=w*im.height/im.width,k=Math.min(1,f.end*4);c.save();c.translate(W/2,H*0.4);c.scale(0.6+k*0.4,0.6+k*0.4);c.drawImage(im,-w/2,-h/2,w,h);c.restore();}
   else if(f.res){c.font='900 40px sans-serif';c.textAlign='center';c.lineWidth=7;c.strokeStyle='#000';const s2=f.res==='w'?'승리!':'패배…';c.strokeText(s2,W/2,H*0.42);c.fillStyle=f.res==='w'?'#ffd23f':'#9ab';c.fillText(s2,W/2,H*0.42);}
   else if(IMG.arena_vs){const im=IMG.arena_vs,w=90,h=w*im.height/im.width,p=1+Math.sin(t*6)*0.05;c.drawImage(im,W/2-w*p/2,H*0.6-h*p/2,w*p,h*p);}else{c.font='900 26px sans-serif';c.fillStyle='#ffe38a';c.textAlign='center';c.fillText('VS',W/2,H*0.62);}}
  else{c.font='bold 15px sans-serif';c.fillStyle='#fff';c.textAlign='center';c.fillText(A.rest[i]>0?`휴식 중… ${Math.ceil(A.rest[i])}초`:'도전자를 기다리는 중…',W/2,H*0.45);}}
 const st=$('#arst');if(st){const h=`전적 ${A.w}승 ${A.l}패 · 누적 수입 ${fmt(A.earn)}G`;if(st.textContent!==h)st.textContent=h;}
 const lg=$('#arlog');if(lg){const h=A.log.slice(0,6).map(l=>`<div class="news">${l}</div>`).join('');if(lg._h!==h){lg.innerHTML=h;lg._h=h;}}
 requestAnimationFrame(drawArena);}
// ---------- 알 합성 ----------
const FUS={sel:{}};const COLL={v:null};
function eggPut(k,e){eggSeen(k);eggRolls(k);P.eggs[k]=(P.eggs[k]||0)+1;P.eggI[k].push(e);eggRolls(k);}
function fusRecipe(){const ks=Object.keys(FUS.sel).filter(k=>FUS.sel[k]>0),n=ks.reduce((a,k)=>a+FUS.sel[k],0);if(!n)return null;const gs=ks.map(k=>k.split('_').map(Number));
 if(ks.length===1&&n===3){const[gi,mi]=gs[0];return{t:'grade',n,txt:`같은 알 3개 → 등급이 한 단계 높은 ${monOf(gi,mi)[0]}의 알`,k:ks[0]};}
 if(n===5&&gs.every(([gi,mi])=>gi===gs[0][0]&&mi>=0)&&GROUNDS[gs[0][0]].boss)return{t:'boss',n,txt:`같은 사냥터 일반 알 5개 → 보스 「${GROUNDS[gs[0][0]].boss[0]}」의 알`,k:gs[0][0]+'_-1'};
 if(n===4){const avg=ks.reduce((a,k)=>a+GROUNDS[+k.split('_')[0]].lv*FUS.sel[k],0)/4;return{t:'up',n,txt:`알 4개 → 평균 Lv${Math.round(avg)}보다 높은 사냥터(Lv${Math.round(avg+4)}~${Math.round(avg+14)})의 알`,avg};}
 return{t:null,n,txt:'같은 알 3개 (등급↑) · 같은 사냥터 알 5개 (보스 알) · 아무 알 4개 (상위 사냥터 알)'};}
function fusAdd(k,d){const have=P.eggs[k]||0;FUS.sel[k]=clamp((FUS.sel[k]||0)+d,0,have);if(!FUS.sel[k])delete FUS.sel[k];openMons('f');}
function fusDo(){const rc=fusRecipe();if(!rc||!rc.t)return;let gsum=0;const took=[];for(const k in FUS.sel)for(let i=0;i<FUS.sel[k];i++){const e=eggTake(k);gsum+=e.g;took.push(e);}const mg=Math.max(...took.map(e=>e.g));
 let k,e;if(rc.t==='grade'){k=rc.k;const tg=Math.min(4,mg+1);e=rollEgg(1);for(let i=0;i<500&&e.g<tg;i++)e=rollEgg(1+Math.floor(i/80));if(e.g<tg)e.g=tg;}
 else if(rc.t==='boss'){k=rc.k;e=rollEgg(Math.round(gsum/5)>=2?1:0);}
 else{const c=GROUNDS.map((g,i)=>i).filter(i=>GROUNDS[i].lv>=rc.avg+4&&GROUNDS[i].lv<=rc.avg+14);const gi=c.length?pick(c):GROUNDS.reduce((b,g,i)=>g.lv>GROUNDS[b].lv?i:b,0);k=gi+'_'+rmi(gi);e=rollEgg(Math.round(gsum/4)>=2?1:0);}
 eggPut(k,e);FUS.sel={};const[gi,mi]=k.split('_').map(Number);news(`🔮 알 합성 — [${EGG_G[e.g].n}] ${monOf(gi,mi)[0]}의 알`,'me');hatchAnim(gi,mi,e,()=>openMons('f'),'egg');}
// ---------- 창 ----------
const MONT={v:'r',sel:null};
function hatchEgg(k,back){monsInit();if(!P.eggs[k])return;if(P.mons.length>=40){toast('몬스터는 40마리까지 — 놓아주거나 먹여서 자리를 만들자');return;}wkEv('hatch');const[gi,mi]=k.split('_').map(Number);const e=eggTake(k,0);const r={uid:P.monU++,gi,mi,e,lv:1,exp:0};P.mons.push(r);MONT.sel=r.uid;news(`🐣 ${monOf(gi,mi)[0]} 부화!`,'me');if(back){DINFO.k='rmon';DINFO.v=r.uid;}hatchAnim(gi,mi,e,()=>back?back():openMons('r'));}
const monUpCost=r=>Math.round(100*Math.pow(r.lv,1.6)*(1+GROUNDS[r.gi].lv/12)*(r.mi<0?2.5:1));
function monUpg(u){const r=monById(u);if(!r||r.lv>=MONMAX)return false;const c=monUpCost(r);if(P.gold<c){toast(`골드 부족 (${fmt(c)}G)`);return false;}P.gold-=c;r.lv++;ents.petSig=null;burst(P.x,P.y-30,20,'#9fef9f',160);toast(`${monName(r)} 강화!`);pdSync();return true;}
function monUp(u){if(monUpg(u))openMons();}
function unDun(u){const i=monDun(u);if(i<0)return;const d=P.duns[i],k=d.mons.findIndex(m=>m.uid===u);if(k>=0)d.mons.splice(k,1);if(d===P.dun)delete MAPS.PD;toast('던전 배치에서 뺐다');openMons();}
function monDun(u){if(!P.duns)return -1;for(let i=0;i<P.duns.length;i++)if(P.duns[i].mons.some(m=>m.uid===u))return i;return -1;}
const dlvOf=r=>clamp(1+Math.floor((r.lv-1)/3),1,10);
function pdSync(){monsInit();if(!P.duns)return;if(!P.dunMig){P.dunMig=1;for(const d of P.duns)for(const pm of d.mons)if(pm.uid==null){const r={uid:P.monU++,gi:pm.gi,mi:pm.mi,e:pm.e||rollEgg(),lv:Math.min(MONMAX,1+((pm.lv||1)-1)*3),exp:0};P.mons.push(r);pm.uid=r.uid;}}
 for(const d of P.duns){const n0=d.mons.length;d.mons=d.mons.filter(pm=>monById(pm.uid));for(const pm of d.mons){const r=monById(pm.uid),nl=dlvOf(r);if(pm.lv!==nl||pm.e!==r.e){pm.lv=nl;pm.e=r.e;if(d===P.dun)delete MAPS.PD;}}if(d.mons.length!==n0&&d===P.dun)delete MAPS.PD;}}
function placeMon(u){const d=P.dun,r=monById(u);if(!d||!r)return;if(!eggFit(r.gi,d)){toast(`이 던전은 Lv${dband(d).lo}~${dband(d).hi} 몬스터만 배치할 수 있다`);return;}if(P.pets.includes(u)||P.arena.slots.includes(u)){toast('펫·투기장에서 먼저 빼자');return;}if(monDun(u)>=0){toast('이미 던전에 배치돼 있다');return;}
 if(d.mons.length>=dunSlots()){toast('배치 칸이 가득 찼다. 코어를 추가하자');return;}d.mons.push({uid:u,gi:r.gi,mi:r.mi,lv:dlvOf(r),e:r.e});delete MAPS.PD;dlog(`🐾 ${monName(r)} 배치`);toast(`${monName(r)} 던전 배치!`);DINFO.k='mon';DINFO.v=d.mons.length-1;openDungeon();}
function monFeed(u){const r=monById(u),k=r.gi+'_'+r.mi;if(!P.eggs[k]){toast('같은 종류의 알이 없다');return;}if(r.lv>=MONMAX)return;eggTake(k);r.lv=Math.min(MONMAX,r.lv+2);ents.petSig=null;toast(`알을 먹였다! ${monName(r)}`);openMons();}
function monPet(u){monsInit();const i=P.pets.indexOf(u);if(i>=0)P.pets.splice(i,1);else{if(monDun(u)>=0){toast('던전 배치에서 먼저 빼자');return;}if(P.pets.length>=petSlots()){toast('펫 칸이 가득 찼다');return;}if(P.arena.slots.includes(u)){toast('투기장에서 먼저 빼자');return;}P.pets.push(u);}ents.petSig=null;openMons();}
function monArena(u){monsInit();const A=P.arena,i=A.slots.indexOf(u);if(i>=0){A.slots[i]=null;A.f[i]=null;}else{if(P.pets.includes(u)){toast('펫에서 먼저 빼자');return;}if(monDun(u)>=0){toast('던전 배치에서 먼저 빼자');return;}const j=A.slots.findIndex((x,k)=>k<A.open&&!x);if(j<0){toast('투기장 칸이 가득 찼다');return;}A.slots[j]=u;A.nt[j]=rnd(2,5);ARV.v=j;}openMons();}
function monFree(u){const r=monById(u);if(!r)return;if(P.pets.includes(u)||P.arena.slots.includes(u)||monDun(u)>=0){toast('펫·투기장·던전에서 먼저 빼자');return;}const g=Math.round(monUpCost(r)*0.3+GROUNDS[r.gi].lv*20);P.mons=P.mons.filter(x=>x!==r);P.gold+=g;MONT.sel=null;toast(`${monOf(r.gi,r.mi)[0]}을(를) 놓아주었다 +${fmt(g)}G`);openMons();}
function unlockPet(pay){const x=PETX[P.petX||0];if(!x)return;if(pay==='d'){if((P.dia||0)<x.d){toast('다이아 부족');return;}P.dia-=x.d;}else{if(P.gold<x.g){toast('골드 부족');return;}P.gold-=x.g;}P.petX=(P.petX||0)+1;toast('펫 칸 해금!');openMons('p');}
const ARX=[null,{d:40,g:20000},{d:100,g:80000}];
function unlockArena(pay){const A=P.arena,x=ARX[A.open];if(!x)return;if(pay==='d'){if((P.dia||0)<x.d){toast('다이아 부족');return;}P.dia-=x.d;}else{if(P.gold<x.g){toast('골드 부족');return;}P.gold-=x.g;}A.open++;A.slots.push(null);toast('투기장 칸 해금!');openMons('a');}
function monCell(r){const used=P.pets.includes(r.uid)?'<span class="t">펫</span>':P.arena.slots.includes(r.uid)?'<span class="t">투기</span>':monDun(r.uid)>=0?'<span class="t">던전</span>':'';return`<div class="bi ${MONT.sel===r.uid?'sel':''}" style="width:64px;height:64px;border-color:${EGG_G[r.e?r.e.g:0].c}" onclick="MONT.sel=${r.uid};openMons()"><canvas class="mcv" width="60" height="60" data-gi="${r.gi}" data-mi="${r.mi}"></canvas>${used}<span class="e">${r.lv>1?'+'+(r.lv-1):''}</span></div>`;}
function monDetail(r){if(!r)return'<span class="mut">몬스터를 누르면 정보가 보인다</span>';const st=monStat(r),pet=P.pets.includes(r.uid),ar=P.arena.slots.includes(r.uid),k=r.gi+'_'+r.mi;
 return`<div class="skdh"><canvas class="mcv" width="72" height="72" data-gi="${r.gi}" data-mi="${r.mi}"></canvas><div><b style="font-size:15px">${eggTag(r.e)} ${monName(r)}</b><div class="mut" style="font-size:11.5px">${GROUNDS[r.gi].name} · 전투 Lv${st.L}${r.aw||r.al?` · 투기장 ${r.aw||0}승 ${r.al||0}패`:''}</div></div></div>
 <div class="eqst"><div>HP<b>${fmt(st.hp)}</b></div><div>공격<b>${st.atk}</b></div><div>방어<b>${st.def}</b></div><div>강화<b>+${r.lv-1}/${MONMAX-1}</b></div></div>
 <div class="nb" style="margin-top:8px"><button class="btn s" ${r.lv>=MONMAX?'disabled':''} onclick="monUp(${r.uid})">강화 ${fmt(monUpCost(r))}G</button><button class="btn s" ${P.eggs[k]?'':'disabled'} onclick="monFeed(${r.uid})">같은 알 먹이기 (+2) · ${P.eggs[k]||0}개</button>
 ${monDun(r.uid)>=0?`<button class="btn s" style="background:#6a4a2a" onclick="unDun(${r.uid})">🏰 던전에서 빼기</button>`:''}<button class="btn s ${pet?'':'g'}" onclick="monPet(${r.uid})">${pet?'펫 해제':'펫 장착'}</button><button class="btn s ${ar?'':'g'}" onclick="monArena(${r.uid})">${ar?'투기장에서 빼기':'투기장 배치'}</button><button class="btn s g" onclick="monFree(${r.uid})">놓아주기</button></div>`;}
function openMons(tab){monsInit();if(tab)MONT.v=tab;const t=MONT.v,eggs=Object.entries(P.eggs).filter(([,v])=>v>0);let body='';
 if(t==='r'){body=`<h3>내 몬스터 <span class="mut">${P.mons.length}/40</span></h3><div class="bgrid" style="grid-template-columns:repeat(auto-fill,64px)">${P.mons.map(monCell).join('')||'<span class="mut" style="grid-column:1/-1">아직 없다. 아래 알을 부화시키자</span>'}</div>
  <div class="skd" style="margin-top:8px;--bc:#6ad08a">${monDetail(monById(MONT.sel))}</div>
  <h3>🥚 부화할 알</h3><div class="bgrid">${eggs.map(([k,v])=>{const[gi,mi]=k.split('_').map(Number);return`<div class="bi" title="${monOf(gi,mi)[0]}의 알 — 눌러서 부화" onclick="hatchEgg('${k}')">${icv({t:'egg',gi,mi},42)}<span class="e">${v}</span><span class="t">${eggTag(eggRolls(k)[0]).replace(/<[^>]+>/g,'')}</span></div>`;}).join('')||'<span class="mut" style="grid-column:1/-1">알이 없다</span>'}</div>`;}
 else if(t==='p'){const n=petSlots();body=`<p class="d">펫은 뒤를 따라다니며 함께 싸운다. 펫이 잡은 몬스터의 보상은 내 것, 펫도 경험치를 얻는다.</p><div class="slots">${[0,1,2,3,4].map(i=>{const r=i<n&&monById(P.pets[i]);
   if(i<n)return`<div class="slot" style="min-height:92px">${r?`<canvas class="mcv" width="56" height="56" data-gi="${r.gi}" data-mi="${r.mi}"></canvas><br><b>${monName(r)}</b><br>${petAlive(r)?`<span class="mut" style="font-size:10.5px">${PRANGED.includes(monVis(r.gi,r.mi).shape)?'원거리':'근접'}</span>`:`<span class="dn" style="font-size:10.5px">회복 중 ${Math.ceil((r.dead-Date.now())/1000)}초</span>`}<br><button class="btn s g" onclick="monPet(${r.uid})">해제</button>`:'<span class="mut">빈 칸<br>몬스터 탭에서 장착</span>'}</div>`;
   const base=1+(P.lv>=30?1:0)+(P.lv>=60?1:0);if(i<base+ (P.petX||0)+1&&i>=base&&PETX[P.petX||0]&&i===n)return`<div class="slot">🔒<br><button class="btn s" onclick="unlockPet('d')">💎${PETX[P.petX||0].d}</button><br><button class="btn s g" onclick="unlockPet('g')">${fmt(PETX[P.petX||0].g)}G</button></div>`;
   return`<div class="slot mut">🔒<br>${i===1?'Lv30':i===2?'Lv60':'해금 필요'}</div>`;}).join('')}</div>
   <h3>장착할 몬스터</h3><div class="bgrid" style="grid-template-columns:repeat(auto-fill,64px)">${P.mons.filter(r=>!P.arena.slots.includes(r.uid)).map(r=>monCell(r).replace(`onclick="MONT.sel=${r.uid};openMons()"`,`onclick="monPet(${r.uid});"`)).join('')||'<span class="mut" style="grid-column:1/-1">부화한 몬스터가 없다</span>'}</div>`;}
 else if(t==='c'){P.eggSeen=P.eggSeen||{};Object.keys(P.eggs).forEach(eggSeen);(P.mons||[]).forEach(r=>eggSeen(r.gi+'_'+r.mi));(P.duns||[]).forEach(d=>d.mons.forEach(m=>eggSeen(m.gi+'_'+m.mi)));
  const all=[];GROUNDS.forEach((g,gi)=>{monIdx(gi).forEach(mi=>all.push(gi+'_'+mi));if(g.boss)all.push(gi+'_-1');});const got=all.filter(k=>P.eggSeen[k]).length,sel=COLL.v;
  const cell=k=>{const[gi,mi]=k.split('_').map(Number),s=P.eggSeen[k];return`<div class="bi ${sel===k?'sel':''}" style="${mi<0?'border-color:#ffa53a;':''}${s?'':'background:#14100c;'}" title="${s?monOf(gi,mi)[0]+'의 알':'???'}" onclick="COLL.v='${k}';openMons('c')">${s?icv({t:'egg',gi,mi},40):'<span style="font-size:24px;color:#5a4a36;font-weight:900">?</span>'}${(P.eggs[k]||0)?`<span class="e">${P.eggs[k]}</span>`:''}<span class="t">Lv${GROUNDS[gi].lv}</span></div>`;};
  let det='<span class="mut">알을 누르면 얻는 방법과 합성 레시피가 보인다</span>';
  if(sel){const[gi,mi]=sel.split('_').map(Number),g=GROUNDS[gi],s=P.eggSeen[sel],nm=s?monOf(gi,mi)[0]:'???',have=P.eggs[sel]||0;const ing=k=>{const[a,b]=k.split('_').map(Number),q=P.eggs[k]||0;return`<span class="chip" style="${q?'border:1px solid #6ad08a':''}">${P.eggSeen[k]?monOf(a,b)[0]:'???'} ${q}개</span>`;};
   const R1=`<div class="news">🔮 <b>등급 상승</b> — 같은 알 3개 → 한 단계 높은 등급 ${ing(sel)} ${have>=3?'<span class="up">가능!</span>':''}</div>`;
   const R2=mi<0?`<div class="news">👑 <b>보스 알 합성</b> — 이 사냥터 일반 알 아무거나 5개 → 이 보스 알<br>${monIdx(gi).map(m=>ing(gi+'_'+m)).join(' ')} ${monIdx(gi).reduce((a,m)=>a+(P.eggs[gi+'_'+m]||0),0)>=5?'<span class="up">가능!</span>':''}</div>`:`<div class="news">⬆️ <b>보스 알 재료</b> — 이 알 포함 같은 사냥터 일반 알 5개 → ${g.boss?(P.eggSeen[gi+'_-1']?g.boss[0]:'???')+'의 알':'(보스 없음)'}</div>`;
   const lo=Math.max(1,g.lv-14),hi=g.lv-4;const R3=mi>=0&&hi>=1?`<div class="news">🎲 <b>상위 알 합성</b> — 평균 Lv${lo}~${hi} 알 4개를 합치면 이 사냥터(Lv${g.lv}) 알이 나올 수 있다</div>`:'';
   const src=`<div class="news">📍 <b>얻는 곳</b> — ${g.name} (Lv${g.lv}, ${TOWNS[g.town].name} 지역)${mi<0?' 보스 처치 · 전설의 둥지':' 몬스터 처치'} · 소환의 집 몬스터 뽑기</div>`;
   det=`<div class="skdh">${s?icv({t:'egg',gi,mi},48):'<span style="font-size:34px;color:#5a4a36;font-weight:900;width:48px;text-align:center">?</span>'}<div><b style="font-size:15px">${nm}의 알</b>${mi<0?' <span class="chip" style="background:#ffa53a;color:#1a1208">보스</span>':''}<div class="mut" style="font-size:11.5px">${g.name} · Lv${g.lv} · 보유 ${have}</div></div></div>${src}${R1}${R2}${R3}`;}
  body=`<div class="eqst"><div>수집<b>${got}/${all.length}</b></div><div>보스 알<b>${all.filter(k=>k.endsWith('_-1')&&P.eggSeen[k]).length}</b></div><div>달성률<b>${Math.round(got/all.length*100)}%</b></div><div>보유 알<b>${Object.values(P.eggs).reduce((a,b)=>a+b,0)}</b></div></div>
  <div class="skd" style="margin:8px 0;--bc:#6ad08a">${det}</div>
  <div style="max-height:44vh;overflow:auto">${TOWNS.map(T=>{const gs=GROUNDS.map((g,i)=>[g,i]).filter(([g])=>g.town===T.id);return`<h3 style="margin:8px 0 4px">${T.icon} ${T.name} <span class="mut" style="font-size:11px">${gs.reduce((a,[g,i])=>a+[...monIdx(i),...(g.boss?[-1]:[])].filter(m=>P.eggSeen[i+'_'+m]).length,0)}/${gs.reduce((a,[g])=>a+g.mons.length+(g.boss?1:0),0)}</span></h3>${gs.map(([g,gi])=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="mut" style="width:118px;font-size:11px;flex:none">${g.name}</span><div style="display:flex;gap:4px">${[...monIdx(gi),...(g.boss?[-1]:[])].map(mi=>cell(gi+'_'+mi)).join('')}</div></div>`).join('')}`;}).join('')}</div>`;}
 else if(t==='f'){const rc=fusRecipe(),sel=Object.entries(FUS.sel);body=`<p class="d">${rc?rc.txt:'같은 알 3개 → 등급↑ · 같은 사냥터 알 5개 → 보스 알 · 아무 알 4개 → 상위 사냥터 알'}</p>
  <div class="fslots">${sel.flatMap(([k,v])=>Array(v).fill(k)).map(k=>{const[gi,mi]=k.split('_').map(Number);return`<div class="bi" onclick="fusAdd('${k}',-1)">${icv({t:'egg',gi,mi},40)}</div>`;}).join('')||'<span class="mut">아래에서 알을 골라 넣자</span>'}</div>
  <button class="btn w" ${rc&&rc.t?'':'disabled'} onclick="fusDo()">🔮 합성하기</button>
  <h3>보유 알</h3><div class="bgrid">${eggs.map(([k,v])=>{const[gi,mi]=k.split('_').map(Number),left=v-(FUS.sel[k]||0);return`<div class="bi" style="${left?'':'opacity:.35'}" title="${monOf(gi,mi)[0]}의 알 · Lv${GROUNDS[gi].lv}" onclick="fusAdd('${k}',1)">${icv({t:'egg',gi,mi},40)}<span class="e">${left}</span><span class="t">Lv${GROUNDS[gi].lv}</span></div>`;}).join('')||'<span class="mut" style="grid-column:1/-1">알이 없다</span>'}</div>`;}
 else{const A=P.arena;body=`<div class="tabs">${A.slots.map((u,i)=>{const r=monById(u);return`<button class="tab ${ARV.v===i?'on':''}" onclick="ARV.v=${i};openMons('a')">${i+1}번 ${r?monOf(r.gi,r.mi)[0]:'빈 칸'}</button>`;}).join('')}${ARX[A.open]?`<button class="tab" onclick="unlockArena('d')">🔒 칸 해금 💎${ARX[A.open].d}</button><button class="tab" onclick="unlockArena('g')">${fmt(ARX[A.open].g)}G</button>`:''}</div>
  <canvas id="arc" width="640" height="300" style="width:100%;border-radius:10px;border:2px solid #8a6a3a;display:block"></canvas><div class="mut" id="arst" style="margin:4px 0"></div>
  <p class="d">배치한 몬스터에게 비슷한 레벨의 사냥꾼들이 실시간으로 도전한다. 매 경기 입장료, 이기면 상금 2배와 경험치.</p>
  <h3>배치할 몬스터</h3><div class="bgrid" style="grid-template-columns:repeat(auto-fill,64px)">${P.mons.filter(r=>!P.pets.includes(r.uid)).map(r=>monCell(r).replace(`onclick="MONT.sel=${r.uid};openMons()"`,`onclick="if(P.arena.slots[ARV.v]===${r.uid})monArena(${r.uid});else{const A=P.arena;if(A.slots.includes(${r.uid}))monArena(${r.uid});A.slots[ARV.v]=${r.uid};A.f[ARV.v]=null;A.nt[ARV.v]=rnd(2,5);openMons('a');}"`)).join('')||'<span class="mut" style="grid-column:1/-1">부화한 몬스터가 없다</span>'}</div><div id="arlog" style="margin-top:6px"></div>`;}
 openModal(`<h2>🐾 내 몬스터 <span class="gold" style="float:right">💰 ${fmt(P.gold)}G · 💎 ${fmt(P.dia||0)}</span></h2><div class="tabs">${[['r','몬스터·부화'],['p',`펫 ${P.pets.length}/${petSlots()}`],['f','알 합성'],['c','알 도감'],['a','투기장']].map(([k,n])=>`<button class="tab ${t===k?'on':''}" onclick="openMons('${k}')">${n}</button>`).join('')}</div>${body}<button class="btn w g" onclick="closeModal()">닫기 (P)</button>`,true);
 paintIcons($('#modal'));drawMonCvs($('#modal'));
 if(t==='a')requestAnimationFrame(drawArena);}
// ---------- 주문 제작 ----------
const ORD={ess:0};const craftLv=()=>Math.min(20,Math.floor(Math.sqrt((P.craftXp||0)/40)));
function orderPanel(si){P.orders=P.orders||[];const ml=craftLv(),nx=Math.pow(ml+1,2)*40,ess=matHave(AWM[0]);ORD.ess=Math.min(ORD.ess,ess,3);
 const luck=Math.min(0.9,ml*0.035+ORD.ess*0.18);
 const head=`<div class="eqst"><div>제작 숙련<b>Lv${ml}</b></div><div>다음까지<b>${fmt(Math.max(0,nx-(P.craftXp||0)))}</b></div><div>행운<b>+${Math.round(luck*100)}%</b></div><div>각성의 정수<b>${ess}</b></div></div>
  <div class="nb" style="margin:6px 0"><span class="mut" style="align-self:center">정수 투입</span>${[0,1,2,3].map(n=>`<button class="btn s ${ORD.ess===n?'':'g'}" ${n>ess?'disabled':''} onclick="ORD.ess=${n};openBuilding(curBld)">${n}</button>`).join('')}<span class="mut" style="align-self:center;font-size:11px">3개면 희귀 이상 확정</span></div>`;
 const mine=P.orders.map((o,i)=>{const c=CB[o.cid],left=o.ready-G.hour;return`<div class="news" style="display:flex;align-items:center;gap:6px"><div style="flex:1"><b>${c.name}</b> <span class="mut">${SHOPS[o.si].name}${o.ess?` · 정수 ${o.ess}`:''}</span></div>${left<=0?`<button class="btn s" onclick="orderTake(${i})">지금 수령</button>`:`<span class="mut">${left}시간 남음 · 완성되면 내 집으로 배달</span>`}</div>`;}).join('');
 const rows=SHOPS[si].items.filter(cid=>CB[cid].type!=='potion').map(cid=>{const c=CB[cid],fee=Math.round(cPrice(si,cid)*0.4),ok=c.recIds.every(([m,q])=>matHave(m)>=q)&&ordGold()>=fee&&c.lvReq<=P.lv;
  return`<div class="icard"><div class="ib"><b>${c.name}</b> <span class="mut">요구 Lv${c.lvReq} · ${2+c.tier}시간</span><div style="font-size:11.5px">${c.recIds.map(([m,q])=>`<span class="${matHave(m)>=q?'up':'dn'}">${MATS[m].name} ${matHave(m)}/${q}</span>`).join(' ')}</div>
  <button class="btn s" style="margin-top:4px" ${ok?'':'disabled'} onclick="orderMake(${si},'${cid}')">주문 ${fmt(fee)}G</button></div></div>`;}).join('');
 return head+(mine?`<h3>내 주문</h3>${mine}`:'')+`<h3>내 재료로 주문</h3><p class="d">가방과 창고의 재료·돈을 함께 써서 만든다 (창고 💰${fmt((P.stash&&P.stash.gold)||0)}G 포함). 숙련도·정수가 높을수록 높은 등급(=옵션)이 잘 나온다.</p><div class="icards">${rows}</div>`;}
function orderMake(si,cid){const c=CB[cid],fee=Math.round(cPrice(si,cid)*0.4);if(!c.recIds.every(([m,q])=>matHave(m)>=q)||ordGold()<fee)return;c.recIds.forEach(([m,q])=>matUse(m,q));const ess=Math.min(ORD.ess,matHave(AWM[0]));if(ess)matUse(AWM[0],ess);
 ordPay(fee);P.orders=P.orders||[];P.orders.push({si,cid,ready:G.hour+2+c.tier,ess,ml:craftLv()});ORD.ess=0;sfx('buy');wkEv('order');toast(`${c.name} 주문 완료`);openBuilding(curBld);}
function orderItem(o){const c=CB[o.cid],luck=Math.min(0.9,o.ml*0.035+o.ess*0.18);let it=makeItem(SLOTK[c.type],c.tier,luck);if(o.ess>=3&&it.r<2)it=makeItem(SLOTK[c.type],c.tier,luck,2);if(R()<o.ml*0.03)it=plusItem(it,1);P.craftXp=(P.craftXp||0)+10+c.tier*8;return it;}
function orderTake(i){const o=P.orders[i];if(!o||o.ready>G.hour)return;const it=orderItem(o);P.orders.splice(i,1);gainItem(it);toast(`[${RAR[it.r].n}] ${it.name} 수령!`);openBuilding(curBld);}
function orderDeliver(silent){if(!P||!P.orders)return;P.mail=P.mail||[];for(let i=P.orders.length-1;i>=0;i--){const o=P.orders[i];if(o.ready>G.hour)continue;const it=orderItem(o);P.orders.splice(i,1);P.mail.push(it);if(!silent){news(`📦 주문한 [${RAR[it.r].n}] ${it.name} 완성 — 내 집으로 배달됐다`,'me');toast('📦 주문 제작품이 내 집에 도착!');sfx('chest');}}}
function mailCheck(){if(!P||!P.mail||!P.mail.length||!CUR||CUR.key!=='HOME'||paused)return;const L=P.mail.splice(0);L.forEach(it=>gainItem(it,true));sfx('chest');burst(P.x,P.y-30,30,'#ffd23f',200);floatT(P.x,P.y-80,`📦 택배 ${L.length}개 도착!`,'#ffd23f',16,2);toast(`📦 택배 수령: ${L.map(it=>it.name).join(', ')}`);}
