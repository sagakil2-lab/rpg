'use strict';
// =====================================================================
//  타이틀 화면
// =====================================================================
function showTitle(){const has=(()=>{try{return!!localStorage.getItem(SAVE_KEY);}catch(e){return false;}})();
 const el=document.createElement('div');el.id='title';el.innerHTML=`<canvas id="tcv"></canvas><div class="tbox">
  <div class="tlogo"><img id="tlimg" style="display:none;height:min(240px,calc(var(--vh,1vh)*30));filter:drop-shadow(0 6px 18px #000a);margin-bottom:-18px"><div class="tt1">봉인의 열 마을</div><div class="tt2">모험가의 시장</div></div>
  <div class="tbtns">${has?`<button class="tb" onclick="startGame(false)">▶ 이어하기</button>`:`<button class="tb" onclick="startGame(true)">✦ 모험 시작</button>`}
  <button class="tb g" onclick="toggleSound();this.textContent=SND.on?(SND.bgmOn?'🔊 소리 켬':'🔉 효과음만'):'🔇 소리 끔'">${SND.on?(SND.bgmOn?'🔊 소리 켬':'🔉 효과음만'):'🔇 소리 끔'}</button></div>
  <div class="tfoot">방향키 이동 · Space 공격 · E 대화 · M 월드맵 · O 퀘스트 · Y 상점</div></div>`;document.body.appendChild(el);
 const cv=$('#tcv'),c=cv.getContext('2d');const stars=Array.from({length:90},()=>[Math.random(),Math.random()*0.6,Math.random()*2+0.5,Math.random()*6]);
 const loop=t=>{if(!$('#title'))return;{const li=$('#tlimg');if(li&&IMG.title_logo&&li.style.display==='none'){li.src=IMG.title_logo.src;li.style.display='inline-block';}}t/=1000;cv.width=innerWidth;cv.height=innerHeight;const W=cv.width,H=cv.height;
  if(IMG.title_bg){const im=IMG.title_bg,s=Math.max(W/im.width,H/im.height)*1.06,dx=(W-im.width*s)/2+Math.sin(t*0.15)*W*0.02,dy=(H-im.height*s)/2;c.drawImage(im,dx,dy,im.width*s,im.height*s);}
  else{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a1440');g.addColorStop(0.55,'#6a3a6a');g.addColorStop(1,'#f0a060');c.fillStyle=g;c.fillRect(0,0,W,H);
   for(const s of stars){c.globalAlpha=0.5+Math.sin(t*2+s[3])*0.4;c.fillStyle='#fff';c.fillRect(s[0]*W,s[1]*H,s[2],s[2]);}c.globalAlpha=1;
   const rx=W*0.72,ry=H*0.3,rg=c.createRadialGradient(rx,ry,4,rx,ry,H*0.25);rg.addColorStop(0,'rgba(220,160,255,.9)');rg.addColorStop(0.3,'rgba(140,60,220,.5)');rg.addColorStop(1,'rgba(60,0,120,0)');c.fillStyle=rg;c.beginPath();c.ellipse(rx,ry,H*0.12+Math.sin(t*2)*6,H*0.2,0.3,0,7);c.fill();
   const mtn=(y0,amp,col,sp)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,y0+Math.sin(x*0.004+sp)*amp+Math.sin(x*0.013+sp*2)*amp*0.4);c.lineTo(W,H);c.fill();};
   mtn(H*0.62,40,'#3a2a50',1);mtn(H*0.72,30,'#2a1e38',2.5);mtn(H*0.82,24,'#1a1226',4);
   c.fillStyle='#120c1a';for(let i=0;i<10;i++){const x=W*0.1+i*W*0.08,h=30+((i*37)%50);c.fillRect(x,H*0.86-h,26,h);c.beginPath();c.moveTo(x-4,H*0.86-h);c.lineTo(x+13,H*0.86-h-22);c.lineTo(x+30,H*0.86-h);c.fill();c.fillStyle='#ffcf6a';c.fillRect(x+9,H*0.86-h+12,6,6);c.fillStyle='#120c1a';}}
  requestAnimationFrame(loop);};requestAnimationFrame(loop);}
