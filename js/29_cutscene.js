'use strict';
// =====================================================================
//  스토리 컷신 — 이미지 슬라이드 + 타이핑 자막 + 효과
// =====================================================================
// 슬라이드: [이미지키, 이동방향, 효과, 배경색(이미지 없을 때), 대체그림키, 화자, 대사]
const SCN={
 pro:{t:'프롤로그 · 봉인의 열 마을',s:[
  ['cs_pro_1','r','sparkle',['#1a1440','#6a3a6a','#f0a060'],null,'','아주 먼 옛날, 하늘이 찢어지고 「공허의 군주 녹시아」가 이 땅에 내려왔다.'],
  ['cs_pro_2','in','rift',['#100820','#3a1050','#8a2a6a'],'b_lichlord_sheet','','녹시아의 그림자가 닿는 곳마다 숲은 시들고, 짐승들은 미쳐 날뛰었다.'],
  ['cs_pro_3','l','light',['#2a3a6a','#6a8ac8','#f8e0a0'],null,'','열 마을의 용사들은 목숨을 걸고 싸웠고, 마침내 녹시아를 열 개의 봉인석에 나누어 가두었다.'],
  ['cs_pro_4','out','fog',['#1a2a3a','#3a5a6a','#8ab0a0'],null,'','그리고 수백 년이 흘렀다. 사람들은 봉인의 이야기를 잊었다.'],
  ['cs_pro_5','r','rift',['#2a1a3a','#6a3a5a','#e08a60'],null,'','…그런데 요즘, 왕국 곳곳에 이상한 「균열」이 열리기 시작했다.'],
  ['cs_pro_6','in','sparkle',['#3a5a2a','#7aa84a','#f8e8a0'],'player','','왕도 아르덴. 오늘, 한 명의 견습 모험가가 길드의 문을 두드린다.'],
 ]},
 ch1:{t:'1장 · 견습 모험가',s:[
  ['cs_ch1_1','r','sparkle',['#3a6a2a','#8ac85a','#f8f0b0'],null,'브란','어서 오게, 젊은이. 모험가 길드는 언제나 새 얼굴을 환영하지.'],
  ['cs_ch1_2','in','dark',['#1a1a22','#3a3a4a','#5a4a6a'],'b_cavelord_sheet','','하지만 북쪽 이끼 동굴 깊은 곳에서는 검은 빛이 조용히 꿈틀거리고 있었다.'],
 ]},
 ch2:{t:'2장 · 독안개의 숲',s:[
  ['cs_ch2_1','l','fog',['#1a3a1a','#3a6a3a','#8ab06a'],null,'엘리나','숲이 숨을 쉬지 못하고 있어요. 이 안개… 자연의 것이 아니에요.'],
  ['cs_ch2_2','in','rift',['#1a2a1a','#3a4a2a','#6a8a3a'],'m_bog_sheet','','늪 한가운데, 작은 균열이 독안개를 토해 내고 있었다.'],
 ]},
 ch3:{t:'3장 · 소금바람 항구',s:[
  ['cs_ch3_1','r','rain',['#1a3a5a','#3a7ab0','#e8d49a'],null,'마르코','하! 바다는 거짓말을 안 해. 저 해골 놈들, 바다 밑에서 기어 나온 거야.'],
  ['cs_ch3_2','l','light',['#2a4a6a','#5a8ac0','#f0d090'],null,'','낡은 해도에는 열 개의 별이 그려져 있었다. 그 첫 번째 별은 북쪽 광산을 가리켰다.'],
 ]},
 ch4:{t:'4장 · 드워프의 광산',s:[
  ['cs_ch4_1','in','embers',['#2a1a10','#5a3a20','#c8743a'],null,'고린','광산이 미쳐 버렸네. 골렘들이 우리 형제들을 쫓아냈어.'],
  ['cs_ch4_2','out','light',['#2a2a3a','#5a5a8a','#c8b0ff'],'b_ancientgolem_sheet','','광산 가장 깊은 곳, 고대 골렘의 가슴에서 첫 번째 봉인 파편이 빛나고 있었다.'],
 ]},
 ch5:{t:'5장 · 요새의 맹세',s:[
  ['cs_ch5_1','r','embers',['#3a1a1a','#7a3a2a','#e0a060'],null,'레온','「열 개의 봉인이 깨지는 날, 우리는 칼을 든다.」 기사단의 오래된 맹세일세.'],
  ['cs_ch5_2','in','embers',['#2a0a08','#6a1a10','#ff6a2a'],'b_firedragon_sheet','','용의 둥지에서 화룡 이그니스가 깨어났다. 그 날개 아래, 세 번째 봉인이 타오르고 있었다.'],
 ]},
 ch6:{t:'6장 · 요정의 숲',s:[
  ['cs_ch6_1','l','sparkle',['#1a3a3a','#3a8a6a','#c8f0d0'],null,'실바','인간이 이 숲까지… 숲이 흉포한 빛에 물들고 있어.'],
  ['cs_ch6_2','in','dark',['#2a0a0a','#5a1a2a','#a03a4a'],null,'','빛나는 괴물들의 눈은 녹시아의 것과 똑같은 색이었다.'],
 ]},
 ch7:{t:'7장 · 학자의 도시',s:[
  ['cs_ch7_1','r','light',['#2a2a4a','#5a5a9a','#e8e0c0'],null,'오르텐','봉인 파편 다섯 개! 이건 역사적인 발견일세!'],
  ['cs_ch7_2','in','rift',['#1a0a2a','#4a1a6a','#b46aff'],null,'','균열의 파편이 공명하자, 오르텐의 서재에 녹시아의 목소리가 울려 퍼졌다.'],
 ]},
 ch8:{t:'8장 · 모래 폭풍',s:[
  ['cs_ch8_1','l','sand',['#5a3a1a','#c8904a','#f8e0a0'],null,'자파르','위험한 일엔 값이 붙는 법이지. 하지만 자네라면… 할인해 주지.'],
  ['cs_ch8_2','in','dark',['#1a0a1a','#3a1a3a','#6a3a6a'],null,'','모래 아래 잠든 저주받은 땅이 천천히 눈을 떴다.'],
 ]},
 ch9:{t:'9장 · 북방의 왕',s:[
  ['cs_ch9_1','r','snow',['#3a4a6a','#8aa8d0','#f0f4ff'],null,'하랄','남쪽 꼬맹이가 봉인 아홉 개를! 하하하! 술부터 한잔하지!'],
  ['cs_ch9_2','out','rift',['#0a0a1a','#1a1a3a','#5a3a8a'],null,'','그러나 마지막 봉인은 이미 깨져 있었다. 북쪽 하늘 끝에서 심연이 입을 벌렸다.'],
 ]},
 ch10:{t:'10장 · 심연',s:[
  ['cs_ch10_1','l','sparkle',['#0a1a2a','#1a3a5a','#8ac8ff'],null,'노아','…기다리고 있었어요. 꿈에서 당신을 봤어요.'],
  ['cs_ch10_2','in','rift',['#0a0010','#2a0040','#ff3a6a'],null,'','심연의 끝, 공허의 군주 녹시아가 다섯 개의 그릇 속에서 웃고 있었다.'],
 ]},
 end:{t:'에필로그 · 전설의 귀환',s:[
  ['cs_end_1','in','flash',['#f8f0ff','#c8a0ff','#6a3aff'],null,'','태초의 화룡이 쓰러지는 순간, 열 개의 봉인이 동시에 빛났다.'],
  ['cs_end_2','r','light',['#3a5a8a','#8ab0e0','#f8e8b0'],null,'','하늘의 균열이 하나씩 닫히고, 열 마을에 다시 아침이 찾아왔다.'],
  ['cs_end_3','l','sparkle',['#3a6a2a','#8ac85a','#f8f0b0'],'player','브란','허허, 정말 해냈구먼. 이제 이 세계는 자네의 이야기를 영원히 노래할 걸세.'],
  ['cs_end_4','out','sparkle',['#1a1440','#6a3a6a','#f0a060'],null,'','— 그러나 모험은 끝나지 않는다. 균열 사냥꾼의 이야기는 계속된다. —'],
 ]},
};
const CS={on:false};
function playScene(id,after){const S=SCN[id];if(!S){after&&after();return;}P.seen=P.seen||{};P.seen[id]=1;
 closeModal();paused=true;CS.on=true;CS.id=id;CS.i=-1;CS.after=after;CS.parts=[];CS.prevBgm=SND.bgmKey;
 let el=$('#cs');if(el)el.remove();el=document.createElement('div');el.id='cs';
 el.innerHTML=`<canvas id="cscv"></canvas><div class="cs-title" id="cst"></div><div class="cs-box" id="csb"><div class="cs-who" id="csw"></div><div class="cs-txt" id="csx"></div><div class="cs-nx" id="csn">▼</div></div>
  <button class="cs-skip" onclick="csEnd()">건너뛰기 ▶▶</button><div class="cs-dots" id="csd"></div>`;document.body.appendChild(el);
 el.addEventListener('pointerdown',e=>{if(e.target.closest('.cs-skip'))return;csAdvance();});
 const t=$('#cst');t.textContent=S.t;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2600);
 csNext();requestAnimationFrame(csLoop);}
function csNext(){const S=SCN[CS.id];CS.i++;if(CS.i>=S.s.length){csEnd();return;}const sl=S.s[CS.i];
 CS.prev=CS.cur;CS.cur={sl,t0:performance.now()};CS.full=sl[6];CS.typed=0;CS.typeT=performance.now();
 $('#csw').textContent=sl[5]||'';$('#csw').style.display=sl[5]?'block':'none';$('#csx').textContent='';$('#csn').style.opacity=0;
 $('#csd').innerHTML=S.s.map((_,i)=>`<i class="${i===CS.i?'on':''}"></i>`).join('');
 if(sl[2]==='flash')CS.flash=1;sfx(sl[2]==='rift'?'rift':'click');}
function csAdvance(){if(!CS.on)return;if(CS.typed<CS.full.length){CS.typed=CS.full.length;return;}csNext();}
function csEnd(){if(!CS.on)return;CS.on=false;const el=$('#cs');if(el){el.classList.add('out');setTimeout(()=>el.remove(),500);}paused=false;const f=CS.after;CS.after=null;setTimeout(()=>{f&&f();},520);}
function csImg(sl){return IMG[sl[0]]||null;}
function csDraw(c,W,H,st,a,t){const sl=st.sl,el=(t-st.t0)/1000,im=csImg(sl),k=Math.min(1,el/9);
 c.save();c.globalAlpha=a;
 if(im){const base=Math.max(W/im.width,H/im.height),zoomIn=sl[1]==='in',zoomOut=sl[1]==='out',sc=base*(zoomIn?1.08+k*0.12:zoomOut?1.2-k*0.12:1.16),
   w=im.width*sc,h=im.height*sc,mx=w-W,dx=sl[1]==='r'?-mx*k:sl[1]==='l'?-mx*(1-k):-mx/2;c.drawImage(im,dx,(H-h)/2,w,h);}
 else{const[c1,c2,c3]=sl[3];const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,c1);g.addColorStop(0.6,c2);g.addColorStop(1,c3);c.fillStyle=g;c.fillRect(0,0,W,H);
  const off=(sl[1]==='r'?-1:sl[1]==='l'?1:0)*k*60;
  const mtn=(y0,amp,col,sp)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,H);for(let x=-80;x<=W+80;x+=24)c.lineTo(x+off*sp,y0+Math.sin(x*0.004+sp)*amp+Math.sin(x*0.011+sp*3)*amp*0.4);c.lineTo(W,H);c.fill();};
  mtn(H*0.62,46,'rgba(0,0,0,.25)',0.4);mtn(H*0.74,34,'rgba(0,0,0,.4)',0.7);mtn(H*0.86,26,'rgba(0,0,0,.6)',1);
  const fk=sl[4];if(fk==='player'){const ly=playerLayer();if(ly){ly.an='idle';ly.face=1;ly.h=H*0.42;ly.flash=false;drawLayered(c,W*0.5+off,H*0.72,ly,t/1000);}}
  else if(fk&&IMG[fk]){const sh=IMG[fk],fw=sh.width/4,fh=sh.height/3,hh=H*0.55,ww=hh*fw/fh,s2=sl[1]==='in'?0.9+k*0.15:1;c.save();c.translate(W*0.5+off,H*0.72);c.scale(s2,s2);c.shadowColor='#000';c.shadowBlur=30;c.drawImage(sh,0,0,fw,fh,-ww/2,-hh,ww,hh);c.restore();}}
 c.restore();}
function csFx(c,W,H,fx,t){const P2=CS.parts,add=o=>P2.push(o);const r=Math.random;
 if(fx==='sparkle'&&r()<0.5)add({x:r()*W,y:r()*H,vx:0,vy:-10-r()*20,l:0,m:2+r()*2,s:1+r()*2.5,col:'#fff8c0',tw:1});
 if(fx==='embers'&&r()<0.8)add({x:r()*W,y:H+5,vx:(r()-0.5)*30,vy:-60-r()*90,l:0,m:3+r()*2,s:1.5+r()*2.5,col:r()<0.5?'#ffb04a':'#ff6a2a',glow:1});
 if(fx==='snow'&&r()<0.9)add({x:r()*W*1.2-W*0.1,y:-5,vx:-20-r()*20,vy:40+r()*50,l:0,m:12,s:1.5+r()*3,col:'#ffffff'});
 if(fx==='rain'&&r()<1)for(let i=0;i<3;i++)add({x:r()*W*1.2,y:-10,vx:-120,vy:700,l:0,m:1.5,s:1,col:'rgba(200,220,255,.6)',line:1});
 if(fx==='sand'&&r()<1)add({x:-10,y:r()*H,vx:200+r()*200,vy:(r()-0.5)*40,l:0,m:5,s:1+r()*2,col:'rgba(240,210,150,.7)'});
 if(fx==='rift'&&r()<0.6){const cx=W*0.68,cy=H*0.32,a=r()*6.28,d=40+r()*140;add({x:cx+Math.cos(a)*d,y:cy+Math.sin(a)*d*0.7,vx:-Math.cos(a)*40,vy:-Math.sin(a)*30,l:0,m:2,s:1.5+r()*2.5,col:r()<0.5?'#c89aff':'#ff6af0',glow:1});}
 if(fx==='rift'&&!(CS.cur&&csImg(CS.cur.sl))){const cx=W*0.68,cy=H*0.32,im=IMG.csfx_rift;c.save();c.globalCompositeOperation='lighter';
  if(im){c.translate(cx,cy);c.rotate(t/3000);const s=H*0.55*(1+Math.sin(t/400)*0.04);c.globalAlpha=0.85;c.drawImage(im,-s/2,-s/2,s,s);}
  else{for(let i=0;i<4;i++){const g=c.createRadialGradient(cx,cy,4,cx,cy,H*(0.28-i*0.05));g.addColorStop(0,'rgba(230,180,255,.55)');g.addColorStop(1,'rgba(90,0,160,0)');c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,H*(0.13-i*0.02)+Math.sin(t/300+i)*6,H*(0.24-i*0.03),0.3+t/4000*(i%2?-1:1),0,7);c.fill();}}c.restore();}
 if(fx==='fog'){const im=IMG.csfx_fog;c.save();c.globalAlpha=0.45;if(im){c.globalCompositeOperation='lighter';const w=W*1.5,h=H*0.6,x=-((t/40)%w);c.drawImage(im,x,H*0.4,w,h);c.drawImage(im,x+w,H*0.4,w,h);}
  else for(let i=0;i<6;i++){const x=((t/30+i*W/3)%(W*1.4))-W*0.2,y=H*(0.55+0.07*Math.sin(i)),g=c.createRadialGradient(x,y,10,x,y,W*0.25);g.addColorStop(0,'rgba(220,240,220,.5)');g.addColorStop(1,'rgba(220,240,220,0)');c.fillStyle=g;c.fillRect(x-W*0.3,y-W*0.3,W*0.6,W*0.6);}c.restore();}
 if(fx==='light'){c.save();c.globalCompositeOperation='lighter';const im=IMG.csfx_rays;if(im){c.globalAlpha=0.35+Math.sin(t/900)*0.1;c.drawImage(im,0,0,W,H);}
  else for(let i=0;i<5;i++){c.globalAlpha=0.08+0.04*Math.sin(t/700+i);c.fillStyle='#fff2c0';c.beginPath();const x=W*(0.15+i*0.14);c.moveTo(x,0);c.lineTo(x+40,0);c.lineTo(x+220,H);c.lineTo(x+120,H);c.fill();}c.restore();}
 if(fx==='dark'){const g=c.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.9);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(10,0,20,${0.7+Math.sin(t/500)*0.15})`);c.fillStyle=g;c.fillRect(0,0,W,H);}
 if(fx==='flash'||fx==='magic'){const im=IMG.csfx_magic;if(im){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=0.6;c.translate(W/2,H*0.55);c.rotate(t/2500);const s=H*0.8;c.drawImage(im,-s/2,-s/2,s,s);c.restore();}}
 c.save();for(let i=P2.length-1;i>=0;i--){const p=P2[i];p.l+=1/60;p.x+=p.vx/60;p.y+=p.vy/60;if(p.l>p.m||p.y>H+20||p.x>W+40){P2.splice(i,1);continue;}const a=Math.min(1,p.l*3,(p.m-p.l)*2)*(p.tw?0.5+0.5*Math.sin(p.l*8):1);c.globalAlpha=a;
  if(p.line){c.strokeStyle=p.col;c.lineWidth=1;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx/40,p.y-p.vy/40);c.stroke();continue;}if(p.glow){c.shadowColor=p.col;c.shadowBlur=8;}else c.shadowBlur=0;c.fillStyle=p.col;c.beginPath();c.arc(p.x,p.y,p.s,0,7);c.fill();}
 c.restore();if(P2.length>500)P2.splice(0,P2.length-500);}
function csLoop(now){if(!CS.on&&!$('#cs'))return;const cv=$('#cscv');if(!cv){return;}const W=cv.width=innerWidth,H=cv.height=innerHeight,c=cv.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,W,H);
 const st=CS.cur;if(st){const tr=Math.min(1,(now-st.t0)/700),e=tr*tr*(3-2*tr);
  if(CS.prev&&tr<1){c.save();c.translate(-W*0.25*e,0);csDraw(c,W,H,CS.prev,1-e,now);c.restore();c.save();c.translate(W*0.35*(1-e),0);csDraw(c,W,H,st,e,now);c.restore();}else csDraw(c,W,H,st,e,now);
  csFx(c,W,H,st.sl[2],now);
  if(CS.flash>0){c.fillStyle=`rgba(255,255,255,${CS.flash})`;c.fillRect(0,0,W,H);CS.flash-=0.02;}
  // 레터박스
  c.fillStyle='#000';c.fillRect(0,0,W,H*0.06);c.fillRect(0,H*0.94,W,H*0.06);
  if(CS.on&&now-st.t0>500&&CS.typed<CS.full.length&&now-CS.typeT>38){CS.typeT=now;CS.typed++;const ch=CS.full[CS.typed-1];if(ch!==' '&&CS.typed%2)csTick();}
  const x=$('#csx');if(x)x.textContent=CS.full.slice(0,CS.typed);const n=$('#csn');if(n)n.style.opacity=CS.typed>=CS.full.length?1:0;}
 requestAnimationFrame(csLoop);}
function csTick(){if(!SND.on)return;const c=actx();if(!c)return;sTone(c,c.currentTime,880+Math.random()*120,0.025,'square',0.025);}
addEventListener('keydown',e=>{if(!CS.on)return;if(e.key===' '||e.key==='Enter'){e.preventDefault();e.stopPropagation();csAdvance();}if(e.key==='Escape')csEnd();},true);
function openScenes(){P.seen=P.seen||{};const ids=Object.keys(SCN);
 openModal(`<h2>🎬 이야기 다시 보기</h2><div class="mgrid">${ids.map(id=>P.seen[id]?`<div class="mrow" style="cursor:pointer" onclick="playScene('${id}')"><span style="font-size:22px">🎬</span><b style="font-size:12.5px">${SCN[id].t}</b></div>`:`<div class="mrow" style="opacity:.4"><span style="font-size:22px">🔒</span><b style="font-size:12.5px">???</b></div>`).join('')}</div><button class="btn w g" onclick="openQuests()">돌아가기</button>`);}
