'use strict';
// =====================================================================
//  메인 루프
// =====================================================================
function update(dt){NAVB=6;
 hourAcc+=dt;if(hourAcc>=HOUR_SEC){hourAcc=0;hourTick(false);}
 reconT-=dt;if(reconT<=0){reconT=1;reconcile(false);if(CUR.kind!=='town'&&!CUR.raid&&ents.chests.length<3&&R()<0.004)spawnChest(CUR);}
 updPlayer(dt);riftUpdate(dt);updPets(dt);
 for(const m of ents.mons)updMon(m,dt);
 for(let i=0;i<ents.mons.length;i++){const a=ents.mons[i];if(a.dead)continue;for(let j=i+1;j<ents.mons.length;j++){const b=ents.mons[j];if(b.dead)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),mn=a.r+b.r;if(d>0&&d<mn){const p=(mn-d)/2/d;moveEnt(a,-dx*p,-dy*p);moveEnt(b,dx*p,dy*p);}}}
 for(const a of ents.actors)updActor(a,dt);ents.actors=ents.actors.filter(a=>!a.remove);
 {const A=ents.actors;for(let i=0;i<A.length;i++){const a=A[i];if(a.down)continue;for(let j=i+1;j<A.length;j++){const b=A[j];if(b.down)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),mn=14;if(d>0.01&&d<mn){const p=(mn-d)/2/d*0.5;moveEnt(a,-dx*p,-dy*p);moveEnt(b,dx*p,dy*p);}}}}
 updFx(dt);cam.shake=Math.max(0,cam.shake-dt*30);}
function resize(){applyRot(true);cv.width=innerWidth*DPR;cv.height=innerHeight*DPR;zoom=clamp(Math.min(innerWidth/(13*TS),innerHeight/(11*TS)),1,2.6);}
addEventListener('resize',resize);
function render(t){const c=ctx;c.setTransform(1,0,0,1,0,0);c.fillStyle='#000';c.fillRect(0,0,cv.width,cv.height);if(!CUR)return;if(!CUR.cache)buildCache(CUR);
 const S=DPR*zoom,vw=cv.width/S,vh=cv.height/S,mw=CUR.w*TS,mh=CUR.h*TS;
 const tx=mw<vw?(mw-vw)/2:clamp(P.x-vw/2,0,mw-vw),ty=mh<vh?(mh-vh)/2:clamp(P.y-20-vh/2,0,mh-vh);cam.x+=(tx-cam.x)*0.18;cam.y+=(ty-cam.y)*0.18;
 const shx=rnd(-cam.shake,cam.shake),shy=rnd(-cam.shake,cam.shake);
 c.setTransform(S,0,0,S,Math.round((-cam.x+shx)*S),Math.round((-cam.y+shy)*S));
 const sx=Math.max(0,Math.floor(cam.x)-2),sy=Math.max(0,Math.floor(cam.y)-2),sw=Math.min(mw-sx,Math.ceil(vw)+4),sh=Math.min(mh-sy,Math.ceil(vh)+4);
 if(sw>0&&sh>0)c.drawImage(CUR.cache,sx,sy,sw,sh,sx,sy,sw,sh);
 // 출입구 표지판
 for(const e of CUR.exits){const cx=(e.x+e.w/2)*TS,cy=(e.y+e.h/2)*TS;const off={E:[-40,-30],W:[40,-30],N:[48,30],S:[48,-30]}[e.side];let txt,lock=false;
  let sub=null,sc='#ffe2a8';if(e.gi!==undefined){const g=GROUNDS[e.gi];lock=P.lv<g.lv;txt=(lock?'🔒 ':'')+(g.kind==='dungeon'?'🕳️ ':'🌿 ')+g.name;sub=`권장 Lv${g.lv}~${g.lv+6}`;sc=lock?'#ff7a6a':P.lv>g.lv+12?'#9a9a9a':P.lv>=g.lv+4?'#8aef8a':'#ffd23f';}else txt='🏘️ '+TOWNS[CUR.leg&&G.leg?G.leg.town:CUR.pd||CUR.home?0:GROUNDS[CUR.gi].town].name;
  c.font='bold 10px sans-serif';let w=c.measureText(txt).width;if(sub){c.font='bold 9px sans-serif';w=Math.max(w,c.measureText(sub).width);c.font='bold 10px sans-serif';}const x=cx+off[0],y=cy+off[1];c.fillStyle='#5a3a20';c.fillRect(x-1.5,y,3,16);c.fillStyle=lock?'#4a2020':'#3a2a18';rr(c,x-w/2-5,y-14-(sub?12:0),w+10,16+(sub?12:0),4);c.fill();if(sub){c.textAlign='center';c.font='bold 9px sans-serif';c.fillStyle=sc;c.fillText(sub,x,y-3);c.font='bold 10px sans-serif';}c.fillStyle=lock?'#ff9a8a':'#ffe2a8';if(sub){c.textAlign='center';c.fillText(txt,x,y-15);continue;}c.textAlign='center';c.fillText(txt,x,y-3);}
 for(const tg of ents.tele){if(tg.t<0)continue;const p=tg.t/tg.max;c.fillStyle=`rgba(255,40,20,${0.15+p*0.25})`;c.beginPath();c.ellipse(tg.x,tg.y,tg.r,tg.r*0.6,0,0,7);c.fill();c.strokeStyle='rgba(255,90,60,.9)';c.lineWidth=2;c.stroke();c.fillStyle='rgba(255,60,30,.35)';c.beginPath();c.ellipse(tg.x,tg.y,tg.r*p,tg.r*0.6*p,0,0,7);c.fill();}
 drawRift(c,t);drawChests(c,t);if(CUR.torches&&IMG.obj_torch)for(const[tx,ty]of CUR.torches)c.drawImage(IMG.obj_torch,tx-11,ty-30,22,30);
 for(const p of ents.picks){const bob=p.z>0?p.z:Math.sin(p.t*4)*2+2;E(c,p.x,p.y,6,2.5,'rgba(0,0,0,.3)');const ic=p.kind==='gold'?IMG.icon_gold:p.kind==='mat'?matImg(MATS[p.id]):p.kind==='pot'?IMG['itm_'+p.id]:p.kind==='egg'?IMG['egg_'+p.gi]:p.kind==='core'?IMG['core_'+p.gi]:null;
  if(ic){if(p.kind==='egg'||p.kind==='core'||(p.kind==='mat'&&MATS[p.id].sp)){c.save();c.shadowColor=p.kind==='egg'?'#fff3b0':'#c77dff';c.shadowBlur=12;c.drawImage(ic,p.x-11,p.y-22-bob,22,22);c.restore();}else c.drawImage(ic,p.x-9,p.y-18-bob,18,18);}else if(p.kind==='gold'){E(c,p.x,p.y-7-bob,6,6,'#ffd23f');E(c,p.x-1.5,p.y-8.5-bob,2.5,2.5,'#fff6c0');}
  else if(p.kind==='egg'){const col=monOf(p.gi,p.mi)[2];c.save();c.shadowColor='#fff3b0';c.shadowBlur=10;E(c,p.x,p.y-11-bob,6,8,'#f4ecd8');E(c,p.x-1,p.y-12-bob,3,3,col);E(c,p.x+2,p.y-8-bob,2,2,col);c.restore();}
  else if(p.kind==='core'){c.save();c.shadowColor='#c77dff';c.shadowBlur=14;c.fillStyle='#b06aff';c.beginPath();c.moveTo(p.x,p.y-21-bob);c.lineTo(p.x+6,p.y-11-bob);c.lineTo(p.x,p.y-1-bob);c.lineTo(p.x-6,p.y-11-bob);c.closePath();c.fill();E(c,p.x-1.5,p.y-13-bob,2,3,'#f0d8ff');c.restore();}
  else if(p.kind==='gear'){const rc=RAR[p.item.r].c,rr0=p.item.r;if(rr0>=1){const bh=30+rr0*28,a=0.35+Math.sin(t*5)*0.15;const g=c.createLinearGradient(p.x,p.y-bh,p.x,p.y);g.addColorStop(0,rc+'00');g.addColorStop(1,rc+Math.round(a*255).toString(16).padStart(2,'0'));c.fillStyle=g;c.fillRect(p.x-3-rr0,p.y-bh,6+rr0*2,bh);if(rr0>=3&&R()<0.3)ents.parts.push({x:p.x+rnd(-6,6),y:p.y-rnd(0,bh),vx:0,vy:-30,gr:0,life:0,max:0.6,col:rc,s:2});}c.save();c.shadowColor=rc;c.shadowBlur=12;c.fillStyle=rc;c.beginPath();c.moveTo(p.x,p.y-20-bob);c.lineTo(p.x+7,p.y-11-bob);c.lineTo(p.x,p.y-2-bob);c.lineTo(p.x-7,p.y-11-bob);c.closePath();c.fill();c.restore();c.font='10px sans-serif';c.textAlign='center';c.fillText({w:'⚔️',a:'🛡️',h:'⛑️',b:'👢'}[p.item.k],p.x,p.y-26-bob);}
  else if(p.kind==='pot'){c.fillStyle='#e04848';rr(c,p.x-5,p.y-16-bob,10,12,4);c.fill();c.fillStyle='#ddd';c.fillRect(p.x-2,p.y-19-bob,4,4);}
  else{const col=CATC[MATS[p.id].cat];c.fillStyle=col;c.beginPath();c.moveTo(p.x,p.y-17-bob);c.lineTo(p.x+6,p.y-9-bob);c.lineTo(p.x,p.y-2-bob);c.lineTo(p.x-6,p.y-9-bob);c.closePath();c.fill();c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=1;c.stroke();
   if(MATS[p.id].rare){c.strokeStyle=`rgba(255,160,255,${0.5+Math.sin(t*6)*0.5})`;c.lineWidth=2;c.beginPath();c.arc(p.x,p.y-9-bob,10,0,7);c.stroke();}}}
 const list=[];for(const m of ents.mons)if(!m.dead||m.deadT<0.4)list.push(m);if(CUR.home)for(const f of homeInit().placed){const F=furOf(f.id);if(F&&!F.floor)list.push({fur:1,f,F,y:(f.y+F.h)*TS-2});}for(const a of ents.actors)list.push(a);if(ents.pets)for(const p of ents.pets)list.push(p);list.push(P);list.sort((a,b)=>a.y-b.y);
 LBL.length=0;if(CUR.home)drawFurs(c,t,true);for(const e of list){if(e===P)drawPlayer(c,t);else if(e.fur)drawFur(c,e,t);else if(e.kind)drawActor(c,e,t);else drawMonster(c,e,t);}if(CUR.home)homeGhost(c,t);flushLabels(c);
 for(const p of ents.projs){if(p.kind==='spear'){c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(p.vy,p.vx));c.strokeStyle='#7a5a3a';c.lineWidth=3;c.beginPath();c.moveTo(-14,0);c.lineTo(8,0);c.stroke();c.fillStyle='#ccd';c.beginPath();c.moveTo(13,0);c.lineTo(6,-4);c.lineTo(6,4);c.fill();c.restore();continue;}
  if(p.kind==='web'){c.strokeStyle='rgba(240,240,240,.9)';c.lineWidth=1.5;for(let k=0;k<4;k++){const a=k*0.785;c.beginPath();c.moveTo(p.x-Math.cos(a)*8,p.y-Math.sin(a)*8);c.lineTo(p.x+Math.cos(a)*8,p.y+Math.sin(a)*8);c.stroke();}continue;}
  const ec=p.el&&ELEM[p.el]&&ELEM[p.el].c;E(c,p.x,p.y,8,8,(ec||p.col)+'99');E(c,p.x,p.y,5,5,p.col);E(c,p.x,p.y,2.5,2.5,'#fff');}
 for(const g of ents.ghosts){c.globalAlpha=0.35*(1-g.life/g.max);drawChar(c,g.x,g.y,{body:'#8fd8ff',hair:'#8fd8ff',skin:'#bfe8ff',hat:'helm',face:g.face,sword:P.w},t);}c.globalAlpha=1;
 for(const p of ents.aproj){if(p.kind==='fire'){E(c,p.x,p.y,10,10,'rgba(255,120,30,.45)');E(c,p.x,p.y,5.5,5.5,'#ffb02a');}else if(p.kind==='bolt'){E(c,p.x,p.y,6,6,'rgba(150,200,255,.5)');E(c,p.x,p.y,3,3,'#fff');}
  else{c.save();c.translate(p.x,p.y);c.rotate(p.ang);c.strokeStyle=p.pierce?'#ffe08a':'#7a5a3a';c.lineWidth=p.pierce?3.5:2.2;c.beginPath();c.moveTo(-14,0);c.lineTo(7,0);c.stroke();c.fillStyle='#ddd';c.beginPath();c.moveTo(11,0);c.lineTo(5,-3.5);c.lineTo(5,3.5);c.fill();c.restore();}}
 for(const p of ents.pproj){if(p.kind==='fire'){E(c,p.x,p.y,11,11,'rgba(255,120,30,.45)');E(c,p.x,p.y,6.5,6.5,'#ffb02a');E(c,p.x,p.y,3,3,'#fff');}
  else if(p.kind==='arrow'){c.save();c.translate(p.x,p.y);c.rotate(p.ang);c.strokeStyle='#6a4a2a';c.lineWidth=2.5;c.beginPath();c.moveTo(-16,0);c.lineTo(8,0);c.stroke();c.fillStyle=p.col||'#ddd';if(p.col&&p.col!=='#fff'){c.shadowColor=p.col;c.shadowBlur=10;}c.beginPath();c.moveTo(13,0);c.lineTo(6,-4);c.lineTo(6,4);c.fill();c.shadowBlur=0;c.fillStyle='#eee';c.fillRect(-18,-3,5,2);c.fillRect(-18,1,5,2);c.restore();}
  else if(p.kind==='bolt'){c.save();c.shadowColor=p.col;c.shadowBlur=16;E(c,p.x,p.y,8,8,p.col+'88');E(c,p.x,p.y,4.5,4.5,'#fff');c.restore();if(R()<0.7)ents.parts.push({x:p.x,y:p.y,vx:rnd(-15,15),vy:rnd(-15,15),gr:0,life:0,max:0.25,col:p.col,s:rnd(1.5,3)});}
  else{c.save();c.translate(p.x,p.y);c.rotate(p.ang);c.strokeStyle='rgba(190,255,255,.95)';c.shadowColor='#8ff';c.shadowBlur=12;c.lineWidth=5;c.beginPath();c.arc(-8,0,22,-1.1,1.1);c.stroke();c.lineWidth=2;c.strokeStyle='#fff';c.beginPath();c.arc(-10,0,20,-0.9,0.9);c.stroke();c.restore();}}
 for(const b of ents.bolts){const a=1-b.life/b.max,rg=mulberry(b.seed);c.strokeStyle=`rgba(220,240,255,${a})`;c.shadowColor='#8cf';c.shadowBlur=14;c.lineWidth=3;c.beginPath();c.moveTo(b.x+20,b.y-290);
  for(let i=1;i<=8;i++)c.lineTo(b.x+20*(1-i/8)+(rg()-0.5)*24,b.y-290+284*i/8);c.stroke();c.shadowBlur=0;E(c,b.x,b.y-4,20*a,8*a,`rgba(200,230,255,${a*0.6})`);}
 for(const mt of ents.meteors){const p=mt.t/mt.max;c.fillStyle=`rgba(255,80,20,${0.12+p*0.25})`;c.beginPath();c.ellipse(mt.x,mt.y,mt.r,mt.r*0.6,0,0,7);c.fill();c.strokeStyle='rgba(255,120,60,.85)';c.lineWidth=2;c.stroke();
  const mx=mt.x+160*(1-p),my=mt.y-340*(1-p);for(let i=3;i>=0;i--)E(c,mx+i*14,my-i*24,16-i*3,16-i*3,i?`rgba(255,140,40,${0.55-i*0.13})`:'#ff7a2a');E(c,mx,my,9,9,'#ffe14a');}
 for(const f of ents.fxs){const fr=Math.max(1,Math.round(f.img.width/f.img.height)),fi=Math.min(fr-1,Math.floor(f.t/f.dur*fr)),fw=f.img.width/fr,sz=40*f.s;c.save();c.translate(f.x,f.y);c.rotate(f.rot);c.globalCompositeOperation='lighter';c.drawImage(f.img,fi*fw,0,fw,f.img.height,-sz/2,-sz/2,sz,sz);c.restore();}
 for(const r of ents.rings){const p=r.life/r.max;c.strokeStyle=`rgba(${r.col},${1-p})`;c.lineWidth=6*(1-p)+1;c.beginPath();c.ellipse(r.x,r.y,r.r*(0.3+p*0.7),r.r*(0.3+p*0.7)*0.6,0,0,7);c.stroke();}
 drawProc(c,t);for(const s of ents.slashes){if(s.life<0)continue;const p=s.life/s.max;c.save();c.translate(s.x,s.y);c.rotate(s.ang);c.globalAlpha=1-p;c.strokeStyle=s.col;c.shadowColor=s.col;c.shadowBlur=10;c.lineWidth=s.w*(1-p*.5);c.beginPath();c.arc(0,0,s.r,-1.3,-1.3+2.6*Math.min(1,p*2.4));c.stroke();c.restore();}
 for(const p of ents.parts){c.globalAlpha=1-p.life/p.max;E(c,p.x,p.y,p.s,p.s,p.col);}c.globalAlpha=1;
 c.textAlign='center';for(const f of ents.floats){c.globalAlpha=1-Math.max(0,(f.life/f.max-0.6)/0.4);c.font=`900 ${f.size}px sans-serif`;c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.8)';c.strokeText(f.text,f.x,f.y);c.fillStyle=f.color;c.fillText(f.text,f.x,f.y);}c.globalAlpha=1;
 for(const a of ents.actors)if(a.bubT>0&&a.bubble)drawBubble(c,a.x,a.y-(a.look.h||50)-6,a.bubble);
 // 조명 (던전 어둠 + 밤)
 c.setTransform(1,0,0,1,0,0);const th=THM(CUR.theme);const hr=(G.hour+8)%24;const night=CUR.kind==='dungeon'?0:(hr>=20||hr<5?0.45:hr>=18?0.2:hr<7?0.25:0);const dark=Math.min(0.85,th.dark+night);
 if(CUR.torches&&dark>0){}
 if(dark>0){const px=(P.x-cam.x)*S,py=(P.y-20-cam.y)*S;const g=c.createRadialGradient(px,py,60*S,px,py,(CUR.kind==='dungeon'?280:340)*S);g.addColorStop(0,'rgba(5,5,20,0)');g.addColorStop(1,`rgba(5,5,20,${dark})`);c.fillStyle=g;c.fillRect(0,0,cv.width,cv.height);}
 if(CUR.torches){c.globalCompositeOperation='lighter';for(const[tx,ty]of CUR.torches){const sx=(tx-cam.x)*S,sy=(ty-cam.y)*S;if(sx<-200||sy<-200||sx>cv.width+200||sy>cv.height+200)continue;const fl=0.85+Math.sin(t*9+tx)*0.1+Math.sin(t*23+ty)*0.05;const g2=c.createRadialGradient(sx,sy,2,sx,sy,90*S*fl);g2.addColorStop(0,'rgba(255,170,70,.45)');g2.addColorStop(1,'rgba(255,120,30,0)');c.fillStyle=g2;c.fillRect(sx-100*S,sy-100*S,200*S,200*S);}c.globalCompositeOperation='source-over';
  c.setTransform(S,0,0,S,Math.round(-cam.x*S),Math.round(-cam.y*S));for(const[tx,ty]of CUR.torches){c.fillStyle='#4a3020';c.fillRect(tx-2,ty-4,4,12);const fl=Math.sin(t*12+tx)*1.5;E(c,tx,ty-8+fl*0.3,4.5,7+fl,'#ff8a2a');E(c,tx,ty-7,2.2,4,'#ffe14a');}c.setTransform(1,0,0,1,0,0);}
 const boss=ents.mons.find(m=>m.boss&&!m.dead&&Math.hypot(m.x-P.x,m.y-P.y)<420);
 if(boss){const W=Math.min(cv.width*0.5,420*DPR),x=(cv.width-W)/2,y=40*DPR;c.fillStyle='rgba(0,0,0,.6)';c.fillRect(x-4,y-22*DPR,W+8,36*DPR);c.fillStyle='#ffd2b8';c.font=`bold ${13*DPR}px sans-serif`;c.textAlign='center';c.fillText(`👑 ${boss.name} Lv${boss.lv}`,cv.width/2,y-6*DPR);
  c.fillStyle='#3a1010';c.fillRect(x,y,W,9*DPR);c.fillStyle='#e0402a';c.fillRect(x,y,W*boss.hp/boss.maxhp,9*DPR);}
 townAmb(c,t);if(SFL.a>0){c.fillStyle=`rgba(${SFL.c},${SFL.a})`;c.fillRect(0,0,cv.width,cv.height);}if(fade.a>0){c.fillStyle=`rgba(0,0,0,${fade.a})`;c.fillRect(0,0,cv.width,cv.height);}}
function drawAura(c,t){const r=topRar();if(r<2||P.dead)return;const col=r>=4?rainbow():RAR[r].c,pu=0.6+Math.sin(t*(r>=3?5:3))*0.3,R0=r>=4?34:r>=3?30:26;
 const g=c.createRadialGradient(P.x,P.y-24,4,P.x,P.y-24,R0*1.4);g.addColorStop(0,col+'00');g.addColorStop(0.55,col+Math.round(40*pu+20).toString(16).padStart(2,'0'));g.addColorStop(1,col+'00');c.fillStyle=g;c.beginPath();c.ellipse(P.x,P.y-24,R0*1.1,R0*1.4,0,0,7);c.fill();
 c.strokeStyle=col;c.globalAlpha=0.5*pu;c.lineWidth=2;c.beginPath();c.ellipse(P.x,P.y,16+Math.sin(t*4)*2,6,0,0,7);c.stroke();c.globalAlpha=1;
 if(R()<(r>=4?0.7:r>=3?0.45:0.25))ents.parts.push({x:P.x+rnd(-14,14),y:P.y-rnd(0,40),vx:rnd(-6,6),vy:rnd(-50,-20),gr:0,life:0,max:rnd(.5,.9),col:r>=4?pick(['#ff3a3a','#ffd23f','#ff6af0','#fff']):pick([col,'#fff']),s:rnd(1.2,2.4)});}
function drawPlayer(c,t){drawAura(c,t);if(P.dead){c.globalAlpha=0.4;}if(P.inv>0&&Math.floor(t*20)%2&&!P.dead)c.globalAlpha=0.55;
 if(P.buff.atkT>0){c.strokeStyle=`rgba(255,170,40,${0.5+Math.sin(t*8)*0.3})`;c.lineWidth=2.5;c.beginPath();c.ellipse(P.x,P.y,21,8,0,0,7);c.stroke();if(R()<0.3)ents.parts.push({x:P.x+rnd(-12,12),y:P.y,vx:0,vy:-60,gr:0,life:0,max:0.5,col:'#ffb84a',s:2});}
 const ly=playerLayer();if(ly){E(c,P.x,P.y,11,4,'rgba(0,0,0,.3)');drawLayered(c,P.x,P.y,ly,t);}
 else if(IMG.player_sheet){const sh=IMG.player_sheet;E(c,P.x,P.y,11,4,'rgba(0,0,0,.3)');const[an,pr]=playerAnim();drawSheet(c,sh,SHEETS.player,an,pr,P.x,P.y,62,P.face,false,t);}
 else drawChar(c,P.x,P.y,{img:'player',h:54,body:ACOL[P.a],cloak:'#6a1f2a',hat:P.h>0?'helm':null,helmCol:HCOL[P.h],boots:BCOL[P.b],sword:P.w,swing:P.swing,spin:P.spin,cast:P.castT>0,face:P.face,walk:P.walk,moving:P.moving,flash:P.flash>0.5},t);c.globalAlpha=1;
 if(P.castT>0){const g=P.castT/0.4;E(c,P.x+P.face*8,P.y-52,10*g,10*g,`rgba(255,240,180,${g*0.6})`);}
 if(P.buff.defT>0){c.fillStyle='rgba(120,180,255,.16)';c.strokeStyle=`rgba(150,200,255,${0.6+Math.sin(t*6)*0.2})`;c.lineWidth=2;c.beginPath();c.ellipse(P.x,P.y-24,24,33,0,0,7);c.fill();c.stroke();}
 {const bw=36,bx=P.x-bw/2,by=P.y-80,hp=clamp(P.hp/maxHp(),0,1),mp=clamp(P.mp/maxMp(),0,1);c.fillStyle='rgba(0,0,0,.7)';rr(c,bx-1.5,by-1.5,bw+3,10,3);c.fill();
  c.fillStyle='#3a0d0d';c.fillRect(bx,by,bw,4.5);c.fillStyle=hp<0.3?'#ff3a2a':'#e8443a';c.fillRect(bx,by,bw*hp,4.5);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(bx,by,bw*hp,1.5);
  c.fillStyle='#0d1a3a';c.fillRect(bx,by+5.5,bw,2.5);c.fillStyle='#4a9aff';c.fillRect(bx,by+5.5,bw*mp,2.5);
  if(P.recall){const k=1-P.recall.t/P.recall.max;c.strokeStyle='#9fe8ff';c.lineWidth=3;c.beginPath();c.arc(P.x,P.y-30,30,-Math.PI/2,-Math.PI/2+k*6.283);c.stroke();}}
 c.fillStyle='rgba(255,230,160,.8)';c.beginPath();c.moveTo(P.x,P.y-62);c.lineTo(P.x+4,P.y-68);c.lineTo(P.x-4,P.y-68);c.fill();}
const LBL=[];function lbl(x,y,txt,font,col,pri,mk,mon){LBL.push({x,y,txt,font,col,pri:pri||0,mk,mon});}
function flushLabels(c){if(!LBL.length)return;const pl=[];LBL.sort((a,b)=>b.pri-a.pri||(Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y)));c.textAlign='center';c.lineJoin='round';
 for(const L of LBL){c.font=L.font;const w=c.measureText(L.txt).width+4,h=parseInt(L.font.match(/(\d+)px/)[1])+3;let y=L.y;
  const mx=L.pri>=5?6:L.mon?0:2;let ok=false;for(let k=0;k<=mx;k++){const hit=pl.find(r=>Math.abs(r.x-L.x)<(r.w+w)/2&&Math.abs(r.y-y)<(r.h+h)/2);if(!hit){ok=true;break;}if(k<mx)y=hit.y-(hit.h+h)/2-1;}if(!ok)continue;
  pl.push({x:L.x,y,w,h});c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.8)';c.strokeText(L.txt,L.x,y+h/2-3);c.fillStyle=L.col;c.fillText(L.txt,L.x,y+h/2-3);
  if(L.mk){const b=Math.sin(performance.now()/250)*3;c.font='900 22px sans-serif';c.strokeStyle='#000';c.lineWidth=4;c.strokeText(L.mk[0],L.x,y-12+b);c.fillStyle=L.mk[1];c.fillText(L.mk[0],L.x,y-12+b);pl.push({x:L.x,y:y-20,w:16,h:22});}}}
function drawActor(c,a,t){if((a.swing||0)>(a._sw||0)+0.3)a._as=performance.now();a._sw=a.swing||0;{const p=a._as?(performance.now()-a._as)/420:2;a._atkP=p<1?p:null;}if(a.down){c.save();c.globalAlpha=0.4;c.translate(a.x,a.y);c.rotate(-1.2);c.translate(-a.x,-a.y);const d=a.down;a.down=false;drawActor(c,a,t);a.down=d;c.restore();c.font='bold 10px sans-serif';c.textAlign='center';c.fillStyle='#ffb0a0';c.fillText(`💀 ${Math.ceil(a.reviveT)}초 후 부활`,a.x,a.y-30);return;}const L=a.look;if(a.fighter&&a.npc){const col=promoK(a.npc)?'#ffd24a':NCC[a.cls||a.npc.cls||'warrior']||'#c8962e',pu=0.75+0.25*Math.sin(t*3+a.npc.id);c.save();c.globalAlpha=0.22*pu;c.fillStyle=col;c.beginPath();c.ellipse(a.x,a.y+1,17,6.5,0,0,Math.PI*2);c.fill();c.globalAlpha=0.9*pu;c.strokeStyle=col;c.lineWidth=2.2;c.beginPath();c.ellipse(a.x,a.y+1,17,6.5,0,0,Math.PI*2);c.stroke();c.restore();}
 const ly=a._atkP!=null&&IMG[a.look.img+'_atk']&&IMG[a.look.img+'_sheet']?null:actorLayer(a);if(ly){E(c,a.x,a.y,11,4,'rgba(0,0,0,.3)');drawLayered(c,a.x,a.y,ly,t);}else drawChar(c,a.x,a.y,Object.assign({},L,{face:a.face,walk:a.walk,moving:a.moving,flash:a.flash>0.5,swing:a.swing||0,npcSheet:true,atkP:a._atkP,tint:a.npc?npcVar(a.npc):0,h:(L.h||50)*(a.npc&&a.npc.role==='hunter'?0.95+((a.npc.id*13)%11)/100:1)}),t);
 if(a.npc){const r=ROLE[a.npc.role],hk=a.npc.role==='hunter';c.font='bold 9px sans-serif';c.textAlign='center';const txt=`${a.hostile?'💢':hk?(a.npc.karma<=-40?'☠':'')+(a.fighter&&NCLS[a.cls]?NCLS[a.cls][0]:''):r[0]}${a.name} Lv${a.npc.lv}`;lbl(a.x,a.y-(L.h||50)-1,txt,'bold 9px sans-serif',hk?karmaCol(a.npc.karma):r[2],a.hostile?2:0);
  if(a.hostile){c.strokeStyle=`rgba(255,60,40,${0.5+Math.sin(t*10)*0.4})`;c.lineWidth=2;c.beginPath();c.ellipse(a.x,a.y,14,6,0,0,7);c.stroke();}}
 if(a.kind==='story'){const N=SNPC[a.sid],mk=storyMark(a),top=a.y-58;lbl(a.x,top-3,`${N.n} · ${N.t}`,'bold 10px sans-serif','#ffd98a',5,mk);}
 if(a.fighter&&a.hp<a.maxhp){c.fillStyle='#300';c.fillRect(a.x-12,a.y+4,24,3);c.fillStyle='#e85a4a';c.fillRect(a.x-12,a.y+4,24*a.hp/a.maxhp,3);}}
const FCACHE=new Map();function fimg(im,f){if(!im||!f||f==='none')return im;let m=FCACHE.get(im);if(!m){m={};FCACHE.set(im,m);}if(!m[f]){const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const x=cv.getContext('2d');x.filter=f;x.drawImage(im,0,0);m[f]=cv;}return m[f];}
function vtSheet(k,vt){const im=IMG[k];if(!im)return null;const f=`hue-rotate(${VT[vt].hue}deg) saturate(1.3)`;let m=FCACHE.get(im);if(!m){m={};FCACHE.set(im,m);}const key='vt'+vt;if(!m[key]){const a=fimg(im,f);const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const x=cv.getContext('2d');x.shadowColor=VT[vt].glow;x.shadowBlur=Math.round(im.width/120);x.drawImage(a,0,0);x.shadowBlur=0;x.drawImage(a,0,0);m[key]=cv;}return m[key];}
function drawMonster(c,m,t){c.save();if(m.dead)c.globalAlpha=Math.max(0,1-m.deadT*2.5);const lx=m.lunge>0?m.face*Math.sin((0.25-m.lunge)/0.25*Math.PI)*12:0;
 const img=IMG[m.id],msh=m.vt&&IMG[m.id+'_sheet']?vtSheet(m.id+'_sheet',m.vt):IMG[m.id+'_sheet'];c.translate(m.x+lx,m.y);
 if(m.wind>0){c.fillStyle=`rgba(255,50,30,${0.25+Math.sin(t*30)*0.15})`;c.beginPath();c.ellipse(0,0,m.r+8,(m.r+8)*0.5,0,0,7);c.fill();}
 if(m.vt&&msh){const gl=VT[m.vt].glow;const g=c.createRadialGradient(0,-20,4,0,-20,m.r*2.6);g.addColorStop(0,gl+'66');g.addColorStop(1,gl+'00');c.fillStyle=g;c.globalAlpha=0.7+Math.sin(t*4)*0.25;c.beginPath();c.ellipse(0,-20,m.r*2.6,m.r*2.2,0,0,7);c.fill();c.globalAlpha=m.dead?Math.max(0,1-m.deadT*2.5):1;}
 if(msh){const H=(m.boss||m.clone?150:54*(MSZ[m.id]||1))*(m.elite?1.25:1)*VT[m.vt||0].sc;E(c,0,0,m.r+4,5,'rgba(0,0,0,.3)');const an=m.dead?'death':m.flash>0.45?'hurt':(m.wind>0||m.lunge>0)?'attack':'move';
  const pr=m.dead?Math.min(1,m.deadT*2.5):an==='attack'?(m.wind>0?(1-m.wind/0.5)*0.6:0.6+(0.25-m.lunge)/0.25*0.4):an==='hurt'?0:null;drawSheet(c,msh,SHEETS.mon,an,pr,0,0,H,m.face,false,m.anim);}
 else if(img){const H=m.boss?110:m.elite?64:50,Wd=H*img.width/img.height;if(m.face<0)c.scale(-1,1);if(m.flash>0.45)c.filter='brightness(3)';E(c,0,0,Wd*0.32,5,'rgba(0,0,0,.3)');c.drawImage(img,-Wd/2,-H+4,Wd,H);c.filter='none';}
 else{E(c,0,0,m.r+4,5,'rgba(0,0,0,.3)');c.scale(m.sc*(m.face>0?-1:1),m.sc);drawMon(c,{shape:m.shape,color:m.color,boss:m.boss||m.elite},0,0,m.anim,m.flash>0.45);}
 if(m.invT>0){c.globalAlpha=0.6+Math.sin(t*10)*0.2;c.strokeStyle='#cfe8ff';c.lineWidth=3;c.beginPath();c.ellipse(0,-m.r*1.6,m.r*2.2,m.r*2.4,0,0,7);c.stroke();c.fillStyle='rgba(180,220,255,.15)';c.fill();c.globalAlpha=1;}
 if(m.enraged&&R()<0.5)ents.parts.push({x:m.x+rnd(-m.r,m.r),y:m.y-rnd(10,m.r*3),vx:0,vy:-60,gr:0,life:0,max:0.5,col:'#ff4a2a',s:3});
 if(m.clone){c.globalAlpha=0.65;}
 c.restore();if(m.dead)return;
 const top=m.y-(m.boss?100:m.elite?62:48);
 if(m.pet){c.fillStyle='rgba(0,0,0,.65)';c.fillRect(m.x-16,top-1,32,8);c.fillStyle='#3a0d0d';c.fillRect(m.x-15,top,30,3.5);c.fillStyle='#5aef6a';c.fillRect(m.x-15,top,30*Math.max(0,m.hp/m.maxhp),3.5);c.fillStyle='#0d1a3a';c.fillRect(m.x-15,top+4.5,30,2);c.fillStyle='#4a9aff';c.fillRect(m.x-15,top+4.5,30*m.mp/m.maxmp,2);}
 else if(m.hp<m.maxhp&&!m.boss){c.fillStyle='rgba(0,0,0,.6)';c.fillRect(m.x-15,top,30,4);c.fillStyle=m.elite?'#ff9a3a':'#e04848';c.fillRect(m.x-15,top,30*m.hp/m.maxhp,4);}
 if(m.awk){c.strokeStyle=`rgba(255,200,60,${0.5+Math.sin(t*6)*0.3})`;c.lineWidth=2;c.beginPath();c.ellipse(m.x,m.y,m.r+8,(m.r+8)*0.45,0,0,7);c.stroke();}
 if(m.elite||m.vt||m.awk||m.pet||m.hp<m.maxhp){lbl(m.x,top-6,`${m.el&&m.el!=='none'?ELEM[m.el].ic:''}${m.name} Lv${m.lv}`,'bold 9px sans-serif',m.pet?'#9fef9f':m.awk?'#ffd23f':m.elite?'#ffb07a':'#fff',m.pet?4:m.elite||m.boss?3:1,null,1);}
 if(m.wind>0){c.font='900 16px sans-serif';c.fillStyle='#ff4a2a';c.fillText('!',m.x,top-12);}
 {const L=[];if(m.stun>0)L.push('stun');if(m.slow>0)L.push('slow');if(m.poison&&m.poison.t>0)L.push('poison');if(m.enraged)L.push('rage');if(m.invT>0)L.push('invuln');if(L.length){const sz=m.boss?22:16;L.forEach((k,i)=>{const x=m.x-(L.length-1)*sz*0.55+i*sz*1.1,y=top-(m.wind>0?30:18)+(k==='stun'?Math.sin(t*8)*2:0);const im=IMG['st_'+k];if(im)c.drawImage(im,x-sz/2,y-sz/2,sz,sz);else{c.font='12px sans-serif';c.fillText({stun:'💫',slow:'❄️',poison:'☠',rage:'💢',invuln:'🛡'}[k],x,y+4);}});}}}
function drawBubble(c,x,y,text){c.font='10px sans-serif';const words=[...text];const lines=[];let cur='';for(const ch of words){if(c.measureText(cur+ch).width>130){lines.push(cur);cur=ch;}else cur+=ch;}lines.push(cur);
 const w=Math.max(...lines.map(l=>c.measureText(l).width))+12,h=lines.length*13+8;c.fillStyle='rgba(255,250,235,.95)';rr(c,x-w/2,y-h,w,h,6);c.fill();c.beginPath();c.moveTo(x-4,y);c.lineTo(x,y+6);c.lineTo(x+4,y);c.fill();
 c.fillStyle='#2a1e12';c.textAlign='center';lines.forEach((l,i)=>c.fillText(l,x,y-h+15+i*13));}
let updMiniBase=true;
function drawMini(){const mc=$('#mini');if(!CUR||!CUR.mini)return;const c=mc.getContext('2d');const s=Math.min(120/CUR.mini.width,100/CUR.mini.height);mc.width=Math.round(CUR.mini.width*s);mc.height=Math.round(CUR.mini.height*s);
 c.imageSmoothingEnabled=false;c.drawImage(CUR.mini,0,0,mc.width,mc.height);const k=s*2/TS;
 for(const e of CUR.exits){c.fillStyle=e.gi!==undefined&&P.lv<GROUNDS[e.gi].lv?'#f44':'#4f4';c.fillRect(e.x*s*2-1,e.y*s*2-1,e.w*s*2+2,e.h*s*2+2);}
 for(const m of ents.mons)if(!m.dead){c.fillStyle=m.boss?'#f0f':'#f55';c.fillRect(m.x*k-1,m.y*k-1,m.boss?4:2,m.boss?4:2);}
 for(const a of ents.actors){c.fillStyle=a.npc?ROLE[a.npc.role][2]:'#ccc';c.fillRect(a.x*k-1,a.y*k-1,2,2);}
 for(const p of ents.picks){c.fillStyle='#ff0';c.fillRect(p.x*k,p.y*k,1.5,1.5);}
 c.fillStyle='#fff';c.fillRect(P.x*k-2,P.y*k-2,4,4);}
function partyFrame(){const el=$('#pframe');if(!el)return;const show=CUR&&CUR.raid;if(!show){if(el.style.display!=='none')el.style.display='none';return;}el.style.display='flex';const q=$('#qtrack');el.style.top=((q&&!q.classList.contains('hid')&&q.innerHTML?lrect(q).bottom:lrect($('#petbar').childElementCount?$('#petbar'):$('#hud')).bottom)+6)+'px';
 const A=ents.actors.filter(a=>a.npc&&a.fighter);const h=A.map(a=>`<div class="pm ${a.down?'dn':''}" onclick="PFS.v=${a.npc.id};openPartyCard()">${NCLS[a.cls||'warrior'][0]} <b>${a.name}</b> <span class="mut">Lv${a.npc.lv}</span>${a.down?` <span class="dn">💀${Math.ceil(a.reviveT)}</span>`:''}<i><b style="width:${Math.max(0,a.hp/a.maxhp*100)}%"></b></i></div>`).join('');if(el._h!==h){el.innerHTML=h;el._h=h;}}
const PFS={v:null};function openPartyCard(){openModal(`<h2>원정대</h2><div class="ngrid">${ents.actors.filter(a=>a.npc&&a.fighter).map(a=>ncard(a.npc,{hp:a.hp/a.maxhp,down:a.down})).join('')}</div><div class="skd" id="npcc" style="margin-top:8px;--bc:#c8962e"></div><button class="btn w g" onclick="closeModal()">닫기</button>`);const fa=ents.actors.find(a=>a.npc&&a.fighter);npcCard(PFS.v||(fa&&fa.npc.id));}
function hud(){try{questPoll();}catch(e){}try{petBar();heroPortrait();}catch(e){}try{homeBar();}catch(e){}try{partyFrame();}catch(e){}$('#hLv').textContent=`Lv${P.lv}`;$('#hHp').style.width=(P.hp/maxHp()*100)+'%';$('#hHpT').textContent=`HP ${Math.ceil(P.hp)}/${maxHp()}`;
 $('#hMp').style.width=(P.mp/maxMp()*100)+'%';$('#hMpT').textContent=`MP ${Math.floor(P.mp)}/${maxMp()}`;$('#hXp').style.width=(P.exp/expNeed()*100)+'%';
 $('#hTime').textContent=timeStr(G.hour);$('#hPot').textContent=`🧪${P.pot.p1}/${P.pot.p2}/${P.pot.p3} 🎒${pBag()}/${P.cap}`;$('#hGold').innerHTML=`💰 ${fmt(P.gold)}G <span style="color:#7fe8ff;cursor:pointer;pointer-events:auto" onclick="openShop('charge')">💎 ${fmt(P.dia||0)}</span>`;
 const nt=[...TOWNS.filter(t=>t.unlock>P.lv).map(t=>[t.unlock,t.name+' 마을']),...GROUNDS.filter(g=>g.lv>P.lv).map(g=>[g.lv,g.name])].sort((a,b)=>a[0]-b[0])[0];
 $('#goal').textContent=nt?`🎯 다음 해금: Lv${nt[0]} ${nt[1]}`:'🎯 모든 지역 해금 완료';
 const pr=$('#prompt');let txt='';if(CUR&&!paused&&!P.dead){const b=nearBuilding();if(nearRift())txt='[E] 🌀 차원 균열 조사';else if(nearChest())txt='[E/Space] 🎁 보물상자 열기';else if(b)txt=b.type==='house'?'🚪 남의 집 (잠김)':`[E/Space] ${b.icon} ${b.label} 들어가기`;else{const a=nearActor();if(a)txt=`[E] 💬 ${a.name}와(과) 대화`;}}
 pr.style.display=txt?'block':'none';pr.textContent=txt;$('#bE').textContent=txt?(txt.includes('대화')?'대화':'입장'):'대화';$('#bA').textContent=CUR&&CUR.kind==='town'?'행동':'공격';
 {const mb=$('#bMenuB');if(mb){const nn=(P.sp>0?P.sp:0)+(stpLeft()>0?1:0)+(P._evb||0);const v=nn?String(nn):'';if(mb._v!==v){mb._v=v;mb.textContent=v;mb.style.display=v?'block':'none';}}}
 {const h=P.sp>0?`🌟<span class="bdg">${P.sp}</span>`:'🌟';const b=$('#bSk');if(b._h!==h){b.innerHTML=h;b._h=h;}b.style.background=P.sp>0?'#8a6a1a':'';}
 layoutHud();
 $('#sbar').innerHTML=P.slots.map((id,i)=>{if(!id)return`<div class="sl e" data-i="${i}"><span class="k">${i+1}</span></div>`;const s=SK[id],cd=Math.max(0,P.cd[id]||0);
  return`<div class="sl ${P.mp<s.mp?'nm':''}" data-i="${i}" title="${s.n}"><div class="in"><span class="ic">${skIc(id,40)}</span>${cd>0?`<i style="height:${cd/s.cd*100}%"></i><b>${cd.toFixed(1)}</b>`:''}</div><span class="k">${i+1}</span><span class="m">${s.mp}</span></div>`;}).join('')+'<div style="width:8px"></div>'+['p1','p2','p3'].map((pid,i)=>`<div class="sl pot ${P.pot[pid]?'':'e'}" data-p="${pid}" title="${CB[pid].name} (HP +${CB[pid].heal})"><div class="in"><span class="ic" style="font-size:${18+i*4}px">${IMG['itm_'+pid]?`<img src="${IMG['itm_'+pid].src}" style="width:${24+i*3}px;height:${24+i*3}px;pointer-events:none">`:'🧪'}</span></div><span class="k">${i+5}</span><span class="z">${['소','중','대'][i]}</span><span class="c">${P.pot[pid]}</span></div>`).join('')+`<div class="sl pot ${P.scroll?'':'e'}" data-r="1" title="귀환 주문서 (R)"><div class="in"><span class="ic">${IMG.itm_scroll?`<img src="${IMG.itm_scroll.src}" style="width:30px;height:30px;pointer-events:none">`:'📜'}</span></div><span class="k">R</span><span class="c">${P.scroll||0}</span></div>`;}
$('#sbar').addEventListener('pointerdown',e=>{const el=e.target.closest('.sl');if(!el)return;e.preventDefault();if(el.dataset.r){useRecall();return;}if(el.dataset.p){quaffId(el.dataset.p);return;}const i=+el.dataset.i;if(!P.slots[i]){openSkills();return;}input.sl[i]=true;});
let last=performance.now();
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;const t=now/1000;
 if(fade.dir===1){fade.a+=dt*4;if(fade.a>=1){fade.a=1;fade.cb&&fade.cb();fade.cb=null;fade.dir=-1;}}else if(fade.dir===-1){fade.a-=dt*3;if(fade.a<=0){fade.a=0;fade.dir=0;}}
 if(CUR&&P&&P.arena)try{arenaTick(dt);}catch(e){console.error(e)}
 try{mailCheck();}catch(e){}try{if(CUR&&!paused)procTick(dt);}catch(e){console.error(e)}
 if(!paused&&CUR&&fade.dir===0)update(dt);else if(CUR&&!paused)updFx(dt);
 render(t);hudT-=dt;if(hudT<=0){hudT=0.1;hud();}miniT-=dt;if(miniT<=0){miniT=0.2;drawMini();}
 requestAnimationFrame(frame);}
