'use strict';
// =====================================================================
//  그리기 헬퍼 & 캐릭터 / 몬스터 임시 그림
// =====================================================================
function E(c,x,y,rx,ry,f){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);c.fillStyle=f;c.fill();}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function shade(h,a){if(h[0]!=='#')return h;h=h.slice(1);if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);const f=v=>clamp(Math.round(a<0?v*(1+a):v+(255-v)*a),0,255);return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`;}
const ACOL=['#7a6a5a','#8b5a2b','#4a8a8a','#3f7a3a','#dfe8f0','#a82222'],WCOL=['#8a7a6a','#c0c6cc','#eef3fa','#7ff','#555a66','#ff7a3a'];
// 사람형 캐릭터 (오른쪽을 보는 기준)
const SHEETS={player:{cols:6,rows:7,a:{idle:[0,0,6,6],walk:[1,0,6,12],attack:[2,0,6],spin:[3,0,6],dash:[4,0,6,18],cast:[5,0,6],hurt:[6,0,1],death:[6,2,4]}},
 npc:{cols:4,rows:2,a:{idle:[0,0,4,5],walk:[1,0,4,8]}},mon:{cols:4,rows:3,a:{move:[0,0,4,8],attack:[1,0,4],hurt:[2,0,1],death:[2,1,3]}}};
function drawSheet(c,img,L,an,pr,x,y,h,face,flash,t){const a=L.a[an]||L.a.idle||L.a.move;const n=a[2];const f=pr!=null?Math.min(n-1,Math.max(0,Math.floor(pr*n))):Math.floor(t*(a[3]||8))%n;
 const fw=img.width/L.cols,fh=img.height/L.rows,w=h*fw/fh;c.save();c.translate(x,y);if(face<0)c.scale(-1,1);if(flash)c.filter='brightness(3)';c.drawImage(img,(a[1]+f)*fw,a[0]*fh,fw,fh,-w/2,-h+4,w,h);c.filter='none';c.restore();}
function playerAnim(){if(P.dead)return['death',Math.min(1,P.deadT/0.8)];if(P.flash>0.5)return['hurt',1-P.flash];if(P.dash)return['dash',null];if(P.spin>0)return['spin',1-P.spin];
 if(P.castT>0)return['cast',1-P.castT/0.4];if(P.swing>0)return['attack',1-P.swing];return[P.moving?'walk':'idle',null];}
const NATIVE_L={npc_hunter:1,npc_trader:1,npc_elder:1};
const NTINT={};const TSHIFT=[0,150,215,270,95,330];
function tintSheet(key,v){const im=IMG[key];if(!im||!v)return im;const ck=key+'|'+v;if(NTINT[ck]!==undefined)return NTINT[ck]||im;
 try{const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(im,0,0);const d=c.getImageData(0,0,cv.width,cv.height),p=d.data,sh=TSHIFT[v%TSHIFT.length]/360;
  for(let i=0;i<p.length;i+=4){if(p[i+3]<10)continue;const r=p[i]/255,g=p[i+1]/255,b=p[i+2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,dd=mx-mn;if(dd<0.12)continue;
   const s=dd/(1-Math.abs(2*l-1)+1e-6);if(s<0.28||l<0.12||l>0.92)continue;let h=mx===r?((g-b)/dd)%6:mx===g?(b-r)/dd+2:(r-g)/dd+4;h=(h*60+360)%360;if(h>=12&&h<=52)continue;// 피부·머리·금장식·나무 보존
   let nh=(h/360+sh)%1;if(nh*360>40&&nh*360<88)nh=(nh+0.14)%1;const q=l<0.5?l*(1+s):l+s-l*s,pp=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?pp+(q-pp)*6*t:t<1/2?q:t<2/3?pp+(q-pp)*(2/3-t)*6:pp;};
   p[i]=f(nh+1/3)*255;p[i+1]=f(nh)*255;p[i+2]=f(nh-1/3)*255;}
  c.putImageData(d,0,0);NTINT[ck]=cv;return cv;}catch(e){NTINT[ck]=null;return im;}}
const npcVar=n=>n&&n.role==='hunter'?((Math.floor((n.id||0)/6)*5+(n.id||0))%TSHIFT.length):0;
function drawChar(c,x,y,o,t){if(o.npcSheet){if(NATIVE_L[o.img])o=Object.assign({},o,{face:-(o.face||1)});const ak=o.atkP!=null&&IMG[o.img+'_atk']&&tintSheet(o.img+'_atk',o.tint);if(ak&&IMG[o.img+'_sheet']){E(c,x,y,11,4,'rgba(0,0,0,.3)');drawSheet(c,ak,{cols:Math.max(1,Math.round(ak.width/ak.height/1.5)),rows:1,a:{attack:[0,0,Math.max(1,Math.round(ak.width/ak.height/1.5))]}},'attack',o.atkP,x,y,(o.h||50)+6,o.face,o.flash,t);return;}const sh=tintSheet(o.img+'_sheet',o.tint);if(sh){E(c,x,y,11,4,'rgba(0,0,0,.3)');drawSheet(c,sh,SHEETS.npc,o.moving?'walk':'idle',null,x,y,(o.h||50)+6,o.face,o.flash,t);return;}}
 const img=o.img&&IMG[o.img];
 c.save();c.translate(x,y);E(c,0,0,11,4,'rgba(0,0,0,.3)');
 const bob=o.moving?-Math.abs(Math.sin(o.walk))*2:0;
 if(img){const H=o.h||54,Wd=H*img.width/img.height;c.scale(o.face<0?-1:1,1);if(o.flash)c.filter='brightness(3)';c.drawImage(img,-Wd/2,-H+3+bob,Wd,H);c.filter='none';c.restore();return;}
 c.scale(o.face<0?-1:1,1);const F=v=>o.flash?'#fff':v;const w=o.moving?Math.sin(o.walk)*3:0;
 if(o.cloak){c.fillStyle=F(o.cloak);c.beginPath();c.moveTo(-6,-24+bob);c.lineTo(-13,-6+Math.sin(t*6)*1.5);c.lineTo(2,-8);c.fill();}
 if(o.pack){c.fillStyle=F('#7a5030');rr(c,-13,-24+bob,9,13,3);c.fill();}
 c.fillStyle=F('#3a3040');c.fillRect(-5+w,-9,4,9);c.fillRect(1-w,-9,4,9);if(o.boots){c.fillStyle=F(o.boots);c.fillRect(-6+w,-4,6,4);c.fillRect(0-w,-4,6,4);}
 c.fillStyle=F(o.body);rr(c,-8,-25+bob,16,17,5);c.fill();
 if(o.apron){c.fillStyle=F(o.apron);c.fillRect(-6,-18+bob,12,10);}
 c.fillStyle=F(shade(o.body,-0.3));c.fillRect(-8,-13+bob,16,2);
 E(c,0,-32+bob,9,9,F(o.skin||'#f2c9a0'));
 const hc=F(o.hair||'#4a3020');
 if(o.hat==='helm'){c.fillStyle=F(o.helmCol||'#9aa4ad');c.beginPath();c.arc(0,-33+bob,10,Math.PI,0);c.fill();c.fillRect(-10,-34+bob,20,3);}
 else if(o.hat==='hood'){c.fillStyle=F(o.cloak||'#5a1a1a');c.beginPath();c.arc(-1,-33+bob,10.5,Math.PI*0.9,Math.PI*2.05);c.fill();}
 else if(o.hat==='wide'){c.fillStyle=F('#8a6a3a');E(c,0,-38+bob,15,4,F('#8a6a3a'));rr(c,-7,-46+bob,14,9,3);c.fill();}
 else if(o.hat==='band'){c.fillStyle=hc;c.beginPath();c.arc(0,-34+bob,9.5,Math.PI,0);c.fill();c.fillStyle=F('#c84a3a');c.fillRect(-9.5,-37+bob,19,3);}
 else if(o.hat==='straw'){E(c,0,-38+bob,14,4,F('#e8c870'));E(c,0,-41+bob,7,5,F('#e8c870'));}
 else{c.fillStyle=hc;c.beginPath();c.arc(0,-34+bob,9.5,Math.PI,0);c.fill();c.fillRect(-9.5,-35+bob,5,8);}
 E(c,3,-31+bob,1.3,1.7,'#222');E(c,6.5,-31+bob,1.3,1.7,'#222');
 if(o.sword!==undefined&&o.sword>=0){c.save();c.translate(6,-19+bob);let ang=o.spin>0?(1-o.spin)*Math.PI*4:o.swing>0?-1.9+(1-o.swing)*3.2:o.cast?-2.5:-1.0;c.rotate(ang);
  c.fillStyle=F('#5a3a20');c.fillRect(-3,-2,8,4);c.fillStyle=F('#d4af37');c.fillRect(4,-6,3,12);if(o.sword>=3&&!o.flash){c.shadowColor=WCOL[o.sword];c.shadowBlur=8;}
  c.fillStyle=F(WCOL[o.sword]);c.beginPath();const L=20+o.sword*2;c.moveTo(7,-2.5);c.lineTo(7+L,-2.5);c.lineTo(11+L,0);c.lineTo(7+L,2.5);c.lineTo(7,2.5);c.fill();c.shadowBlur=0;c.restore();}
 E(c,7,-17+bob,3.2,3.2,F(o.skin||'#f2c9a0'));
 c.restore();}
const MSZ={m_slime:0.75,m_rat:0.7,m_shroom:0.85,m_bat:0.8,m_cavelizard:0.9,m_kobold:0.9,m_wolf:1.05,m_spider:1.0,m_goblin:0.9,m_lizardman:1.1,m_toad:0.95,m_bog:1.0,
 m_crab:0.9,m_pirate:1.1,m_merman:1.15,m_golem:1.35,m_minerghost:1.0,m_mole:1.0,m_harpy:1.15,m_ogre:1.45,m_firelizard:0.95,m_ghoul:1.15,m_skelknight:1.2,m_lich:1.05,
 m_yeti:1.45,m_frostwolf:1.15,m_icespirit:1.0,m_wyvern:1.4,m_drake:1.35,m_flamespirit:0.9};
const MSCALE={gob:.85,ogre:1.3,golem:1.2,dragon:1.1,bat:.9,rat:.85,toad:1.1};
// 몬스터 (왼쪽을 보는 기준)
function drawMon(c,m,x,y,t,white){const col=white?'#fff':m.color,dk=white?'#eee':shade(m.color,-0.45),lt=white?'#fff':shade(m.color,0.4);
 const sc=(m.boss?1.3:1)*(MSCALE[m.shape]||1);c.save();c.translate(x,y);c.scale(sc,sc);
 if(m.boss&&!white){c.shadowColor='#ff3a2a';c.shadowBlur=16;}
 const eye=(ex,ey,r=4)=>{E(c,ex,ey,r,r,'#fff');E(c,ex-1.3,ey,r*.55,r*.55,m.boss?'#d00':'#111');};const s=m.shape;
 if(s==='slime'||s==='toad'){const q=Math.sin(t*5)*.08,w=s==='toad'?40:32;E(c,0,-24*(1-q),w*(1+q),25*(1-q),col);c.shadowBlur=0;E(c,-11,-36,9,5,lt);
  if(s==='toad'){E(c,14,-26,5,3,dk);E(c,-2,-14,6,3,dk);eye(-14,-44,5);eye(6,-44,5);c.strokeStyle=dk;c.lineWidth=2.5;c.beginPath();c.moveTo(-34,-20);c.quadraticCurveTo(-18,-14,-4,-22);c.stroke();}else{eye(-12,-30);eye(6,-30);}}
 else if(s==='shroom'){const bb=Math.sin(t*4)*2;c.fillStyle=white?'#fff':'#f3e6c8';rr(c,-13,-36+bb,26,36-bb,6);c.fill();c.shadowBlur=0;
  c.fillStyle=col;c.beginPath();c.ellipse(0,-38+bb,36,24,0,Math.PI,0);c.fill();E(c,-14,-48+bb,5,4,'#fff');E(c,8,-54+bb,6,4,'#fff');E(c,22,-42+bb,4,3,'#fff');eye(-6,-20,3.5);eye(6,-20,3.5);}
 else if(s==='rat'||s==='wolf'||s==='lizard'){const bb=Math.sin(t*6)*2,L=s==='lizard';c.shadowBlur=0;
  c.strokeStyle=dk;c.lineWidth=L?9:4;c.lineCap='round';c.beginPath();c.moveTo(28,-24);c.quadraticCurveTo(54,-32+bb,64,L?-6:-44);c.stroke();
  c.fillStyle=dk;[-22,-8,10,22].forEach((lx,i)=>c.fillRect(lx,-16,6,16+(i%2?bb:-bb)*.6));
  if(m.boss&&!white){c.shadowColor='#ff3a2a';c.shadowBlur=16;}E(c,4,-26+bb*.3,33,L?13:18,col);c.shadowBlur=0;E(c,4,-20,24,8,lt);
  E(c,-30,-32+bb*.5,L?18:15,L?10:13,col);E(c,-44,-30+bb*.5,L?8:7,6,col);
  if(!L){c.fillStyle=dk;c.beginPath();c.moveTo(-34,-42);c.lineTo(-29,-58);c.lineTo(-22,-41);c.fill();}
  E(c,-51,-31+bb*.5,3,2.5,'#222');eye(-32,-36,3.5);
  if(s==='wolf'){c.fillStyle='#fff';c.beginPath();c.moveTo(-46,-25);c.lineTo(-44,-19);c.lineTo(-42,-25);c.fill();}
  if(L){c.fillStyle=dk;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-14+i*9,-37);c.lineTo(-10+i*9,-45);c.lineTo(-6+i*9,-37);c.fill();}}}
 else if(s==='crab'){const bb=Math.sin(t*5)*3;c.shadowBlur=0;c.strokeStyle=dk;c.lineWidth=4;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-20+i*6,-14);c.lineTo(-34+i*4,0);c.stroke();c.beginPath();c.moveTo(14+i*6,-14);c.lineTo(28+i*6,0);c.stroke();}
  E(c,0,-22,36,18,col);E(c,-6,-28,18,6,lt);E(c,-42,-34+bb,14,10,col);E(c,42,-34-bb,14,10,col);c.fillStyle=dk;c.fillRect(-11,-50,3,14);c.fillRect(7,-50,3,14);eye(-10,-52,4.5);eye(8,-52,4.5);}
 else if(s==='bat'||s==='bird'){const f=Math.sin(t*14),hv=Math.sin(t*3)*6;c.translate(0,-62+hv);c.fillStyle=dk;
  c.beginPath();c.moveTo(-6,-2);c.lineTo(-54,-18-f*18);c.lineTo(-34,10);c.closePath();c.fill();c.beginPath();c.moveTo(6,-2);c.lineTo(54,-18-f*18);c.lineTo(34,10);c.closePath();c.fill();
  E(c,0,0,17,20,col);c.shadowBlur=0;E(c,0,6,10,10,lt);eye(-7,-6,4);eye(7,-6,4);
  if(s==='bird'){c.fillStyle=white?'#fff':'#f0a020';c.beginPath();c.moveTo(-6,0);c.lineTo(-20,4);c.lineTo(-6,6);c.fill();}
  else{c.fillStyle=dk;c.beginPath();c.moveTo(-12,-14);c.lineTo(-8,-28);c.lineTo(-3,-16);c.fill();c.beginPath();c.moveTo(12,-14);c.lineTo(8,-28);c.lineTo(3,-16);c.fill();}}
 else if(s==='ghost'){const hv=Math.sin(t*2.5)*7;c.globalAlpha*=0.88;c.translate(0,-48+hv);c.fillStyle=col;c.beginPath();c.arc(0,-10,28,Math.PI,0);c.lineTo(28,26);
  for(let i=1;i<=4;i++)c.lineTo(28-i*14,26+(i%2?-10:0)+Math.sin(t*6+i)*3);c.closePath();c.fill();c.shadowBlur=0;E(c,-10,-10,5,8,'#112');E(c,10,-10,5,8,'#112');E(c,0,8,6,4,'#112');}
 else if(s==='spider'){const bb=Math.sin(t*8);c.shadowBlur=0;c.strokeStyle=dk;c.lineWidth=3.5;
  for(let i=0;i<4;i++){const w=(i%2?1:-1)*bb*3;c.beginPath();c.moveTo(-4,-24);c.lineTo(-28-i*6,-44+i*6+w);c.lineTo(-38-i*5,0);c.stroke();c.beginPath();c.moveTo(4,-24);c.lineTo(28+i*6,-44+i*6-w);c.lineTo(38+i*5,0);c.stroke();}
  E(c,14,-28,24,20,col);E(c,-14,-26,15,13,col);E(c,12,-36,10,6,lt);[-20,-14,-8].forEach((ex,i)=>E(c,ex,-30+(i%2)*4,2.6,2.6,'#f33'));}
 else if(s==='dragon'){const f=Math.sin(t*5);c.shadowBlur=0;c.fillStyle=dk;c.beginPath();c.moveTo(10,-56);c.lineTo(40,-130-f*16);c.lineTo(84,-80-f*10);c.closePath();c.fill();
  c.strokeStyle=col;c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(40,-30);c.quadraticCurveTo(76,-24,86,-4);c.stroke();
  c.fillStyle=dk;[-20,24].forEach(lx=>c.fillRect(lx,-22,12,22));E(c,8,-38,46,26,col);E(c,4,-28,32,10,lt);
  c.strokeStyle=col;c.lineWidth=18;c.beginPath();c.moveTo(-24,-50);c.quadraticCurveTo(-40,-70,-46,-88);c.stroke();E(c,-52,-92,22,14,col);
  c.fillStyle=white?'#fff':'#eee';c.beginPath();c.moveTo(-46,-102);c.lineTo(-34,-122);c.lineTo(-40,-100);c.fill();c.beginPath();c.moveTo(-58,-104);c.lineTo(-52,-124);c.lineTo(-52,-102);c.fill();
  c.fillStyle=dk;c.beginPath();c.moveTo(-6,-56);c.lineTo(-12,-118-f*14);c.lineTo(30,-70);c.closePath();c.fill();eye(-56,-96,4.5);}
 else{const bb=Math.sin(t*3)*2,sk=s==='skel',gl=s==='golem';c.shadowBlur=0;
  c.fillStyle=sk?(white?'#fff':'#bbb6a6'):dk;c.fillRect(-13,-26,10,26);c.fillRect(3,-26,10,26);
  if(gl){c.fillStyle=col;rr(c,-24,-66+bb,48,42,6);c.fill();rr(c,-16,-90+bb,32,24,5);c.fill();c.fillStyle=dk;c.fillRect(-24,-46+bb,48,4);rr(c,-40,-64+bb,15,38,5);c.fill();rr(c,25,-64+bb,15,38,5);c.fill();
   E(c,-7,-79+bb,4,3,white?'#fff':'#ffe14a');E(c,7,-79+bb,4,3,white?'#fff':'#ffe14a');}
  else{c.fillStyle=sk?(white?'#fff':'#d8d2bf'):col;rr(c,-17,-62+bb,34,40,8);c.fill();
   if(sk){c.strokeStyle='#555';c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();c.moveTo(-11,-54+bb+i*7);c.lineTo(11,-54+bb+i*7);c.stroke();}}else E(c,0,-40+bb,11,12,lt);
   E(c,0,-76+bb,15,15,sk?(white?'#fff':'#eee8d8'):lt);
   if(s==='gob'){c.fillStyle=col;c.beginPath();c.moveTo(-13,-80+bb);c.lineTo(-30,-88+bb);c.lineTo(-12,-72+bb);c.fill();c.beginPath();c.moveTo(13,-80+bb);c.lineTo(30,-88+bb);c.lineTo(12,-72+bb);c.fill();}
   if(s==='fishman'){c.fillStyle=dk;c.beginPath();c.moveTo(-4,-90+bb);c.lineTo(4,-104+bb);c.lineTo(10,-88+bb);c.fill();}
   if(s==='ogre'){c.fillStyle='#eee';c.beginPath();c.moveTo(-8,-68+bb);c.lineTo(-6,-60+bb);c.lineTo(-4,-68+bb);c.fill();c.beginPath();c.moveTo(4,-68+bb);c.lineTo(6,-60+bb);c.lineTo(8,-68+bb);c.fill();}
   if(sk){E(c,-6,-77+bb,4,4.5,'#111');E(c,6,-77+bb,4,4.5,'#111');E(c,-6,-77+bb,1.5,1.5,'#f33');E(c,6,-77+bb,1.5,1.5,'#f33');}else{eye(-6,-78+bb,3.6);eye(6,-78+bb,3.6);}
   c.save();c.translate(-17,-56+bb);c.rotate(0.5+Math.sin(t*3)*.2);c.fillStyle=sk?(white?'#fff':'#d8d2bf'):col;rr(c,-4,0,8,28,4);c.fill();
   c.strokeStyle=white?'#fff':(sk?'#9aa':'#7a5a3a');c.lineWidth=sk?4:7;c.lineCap='round';c.beginPath();c.moveTo(0,26);c.lineTo(-4,-14);c.stroke();c.restore();}}
 c.restore();}
