'use strict';
// =====================================================================
//  월드맵 (M) — 클릭해서 이동·워프
// =====================================================================
const WM={sel:null,W:1920,H:1080,sx:19.2,sy:10.8};
const THCOL={meadow:'#7cc25a',cave:'#6a6470',forest:'#2f7a3a',swamp:'#5a6a3a',beach:'#e8d49a',mine:'#8a7458',canyon:'#c8744a',grave:'#55556a',snow:'#e6eef6',lava:'#c8401a',town:'#8ab86a',forestTown:'#4f8f45',mineTown:'#a8a080',portTown:'#7ab8d8',fortTown:'#8a8a6a'};
function layoutWorld(){if(layoutWorld.done)return;layoutWorld.done=1;
 TOWNS.forEach(T=>{const gs=GROUNDS.map((g,i)=>[g,i]).filter(([g])=>g.town===T.id);gs.forEach(([g],k)=>{const a=k/gs.length*6.283+T.id*0.7,r=6.5+(k%2)*3.5;g.wx=clamp(T.wx+Math.cos(a)*r*0.8,3,97);g.wy=clamp(T.wy+Math.sin(a)*r*1.25,4,96);});});
 NODES.forEach((n,i)=>{if(i<NT){n.x=TOWNS[i].wx;n.y=TOWNS[i].wy;}else if(i<NT+GROUNDS.length){n.x=GROUNDS[i-NT].wx;n.y=GROUNDS[i-NT].wy;}});}
function wpos(x,y){return[x*WM.sx,y*WM.sy];}
function wNodes(){const L=[];TOWNS.forEach((T,i)=>{const[x,y]=wpos(T.wx,T.wy);L.push({t:'town',i,x,y,r:28});});GROUNDS.forEach((g,i)=>{const[x,y]=wpos(g.wx,g.wy);L.push({t:'g',i,x,y,r:13});});
 if(P.duns&&P.duns.length){const[x,y]=wpos(57,58);L.push({t:'dun',x,y,r:15});}return L;}
function drawWorld(){drawWorld.force=1;if(drawWorld.run)return;drawWorld.run=1;const loop=now=>{if(!$('#wmc')||!$('#modal').classList.contains('on')){drawWorld.run=0;return;}if(drawWorld.force||now-(drawWorld.last||0)>=66){drawWorld.last=now;drawWorld.force=0;drawWorldF();}requestAnimationFrame(loop);};requestAnimationFrame(loop);drawWorld.force=1;}
function drawWorldF(){const cv=$('#wmc');if(!cv)return;const now=performance.now();const c=cv.getContext('2d',{alpha:false}),t=now/1000;const BG=IMG.world_bg;if(!WM.bgc||WM.bgc.w!==WM.W){const b=document.createElement('canvas');b.width=WM.W;b.height=WM.H;const x=b.getContext('2d');x.fillStyle='#d8c49a';x.fillRect(0,0,WM.W,WM.H);if(BG)x.drawImage(BG,0,0,WM.W,WM.H);WM.bgc=b;b.w=WM.W;}c.drawImage(WM.bgc,0,0);
 // 지형(바이옴) 얼룩
 const blob=(x,y,r,col,a)=>{const g=c.createRadialGradient(x,y,4,x,y,r);g.addColorStop(0,col);g.addColorStop(1,col+'00');c.globalAlpha=a;c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();c.globalAlpha=1;};
 if(!BG){GROUNDS.forEach(g=>{const[x,y]=wpos(g.wx,g.wy);blob(x,y,120,THCOL[g.theme]||'#888888',0.55);});TOWNS.forEach(T=>{const[x,y]=wpos(T.wx,T.wy);blob(x,y,140,THCOL[T.theme]||'#88aa66',0.6);});
 c.fillStyle='rgba(60,40,20,.08)';for(let i=0;i<400;i++){const r=mulberry(i)();c.fillRect((i*137)%WM.W,(i*251)%WM.H,2+r*3,2);}}
 // 길
 c.setLineDash([8,7]);c.lineWidth=3;c.strokeStyle=BG?'rgba(90,55,25,.35)':'rgba(110,70,30,.55)';
 GROUNDS.forEach(g=>{const T=TOWNS[g.town],[a,b]=wpos(T.wx,T.wy),[x,y]=wpos(g.wx,g.wy);c.beginPath();c.moveTo(a,b);c.lineTo(x,y);c.stroke();});
 if(!BG){c.strokeStyle='rgba(120,60,20,.75)';c.lineWidth=5;}else{c.strokeStyle='rgba(0,0,0,0)';}for(let i=1;i<NT;i++){const[a,b]=wpos(TOWNS[i-1].wx,TOWNS[i-1].wy),[x,y]=wpos(TOWNS[i].wx,TOWNS[i].wy);c.beginPath();c.moveTo(a,b);c.lineTo(x,y);c.stroke();}c.setLineDash([]);
 c.textAlign='center';
 for(const n of wNodes()){let lock,lbl,sub,col;
  if(n.t==='town'){const T=TOWNS[n.i];lock=P.lv<T.unlock;const ti=IMG['wm_town'+n.i];if(ti){const w=n.r*2.6,h=w*ti.height/ti.width;c.drawImage(lock?fimg(ti,'grayscale(1) brightness(.7)'):ti,n.x-w/2,n.y-h*0.62,w,h);}else{c.fillStyle=lock?'#6a5a4a':'#f3e0b0';c.strokeStyle='#3a2410';c.lineWidth=4;c.beginPath();c.arc(n.x,n.y,n.r,0,7);c.fill();c.stroke();c.font='22px sans-serif';c.fillStyle='#000';c.fillText(T.icon,n.x,n.y+8);}
   lbl=T.name;sub=lock?`🔒 Lv${T.unlock}`:'마을';col=lock?'#7a6a5a':'#3a1a08';c.font='bold 15px sans-serif';}
  else if(n.t==='g'){const g=GROUNDS[n.i];lock=P.lv<g.lv-5||P.lv<TOWNS[g.town].unlock;const gl=VT[g.vt].glow;
   const gim=IMG[g.kind==='dungeon'?'wm_dungeon':'wm_field'];if(gim){const w=n.r*2.8,h=w*gim.height/gim.width;const gk=lock?'grayscale(1) brightness(.75)':gl?'drop-shadow(0 0 7px '+gl+')':null;c.drawImage(gk?fimg(gim,gk):gim,n.x-w/2-(gl&&!lock?0:0),n.y-h*0.6,w,h);if(g.boss&&IMG.ic_crown)c.drawImage(IMG.ic_crown,n.x+n.r*0.4,n.y-n.r*1.6,16,16);else if(g.boss){c.font='11px sans-serif';c.fillText('👑',n.x+n.r,n.y-n.r+2);}}else{
   if(gl){c.shadowColor=gl;c.shadowBlur=12;}c.fillStyle=lock?'#8a7a6a':g.kind==='dungeon'?'#4a3a5a':'#3a7a3a';c.strokeStyle=gl||'#2a1a0a';c.lineWidth=3;c.beginPath();
   if(g.kind==='dungeon'){c.moveTo(n.x,n.y-n.r);c.lineTo(n.x+n.r,n.y);c.lineTo(n.x,n.y+n.r);c.lineTo(n.x-n.r,n.y);c.closePath();}else c.arc(n.x,n.y,n.r,0,7);c.fill();c.stroke();c.shadowBlur=0;
   c.font='12px sans-serif';c.fillStyle='#fff';c.fillText(g.kind==='dungeon'?'🕳':'🌿',n.x,n.y+4);if(g.boss){c.font='11px sans-serif';c.fillText('👑',n.x+n.r,n.y-n.r+2);}}
   if(awk(n.i)){c.strokeStyle='#ffd23f';c.lineWidth=3;c.globalAlpha=0.6+Math.sin(t*5)*0.4;c.beginPath();c.arc(n.x,n.y,n.r+10,0,7);c.stroke();c.globalAlpha=1;}
   lbl=g.name;sub=awk(n.i)?`⚡각성 Lv${P.lv}`:`Lv${g.lv}`;col=lock?'#7a6a5a':gl?'#5a1a6a':'#1a3a10';c.font='bold 11px sans-serif';}
  else{if(IMG.wm_mydun){const w=n.r*2.6,h=w*IMG.wm_mydun.height/IMG.wm_mydun.width;c.drawImage(IMG.wm_mydun,n.x-w/2,n.y-h*0.62,w,h);}else{c.font='22px sans-serif';c.fillText('🏰',n.x,n.y+8);}lbl='내 던전';sub=P.duns.map(d=>dband(d).ic).join('');col='#3a1a08';c.font='bold 12px sans-serif';}
  c.lineWidth=3;c.strokeStyle='rgba(255,245,220,.9)';c.strokeText(lbl,n.x,n.y+n.r+15);c.fillStyle=col;c.fillText(lbl,n.x,n.y+n.r+15);
  c.font='bold 11px sans-serif';c.strokeText(sub,n.x,n.y+n.r+28);c.fillStyle=n.t==='g'&&!lock?'#a0380a':col;c.fillText(sub,n.x,n.y+n.r+28);
  if(WM.sel&&WM.sel.t===n.t&&WM.sel.i===n.i){c.strokeStyle='#ffd23f';c.lineWidth=3;c.beginPath();c.arc(n.x,n.y,n.r+8+Math.sin(t*5)*2,0,7);c.stroke();}}
 // 균열 표시
 if(G.rift){const T=TOWNS[G.rift.town],[x,y]=wpos(T.wx,T.wy),ri=IMG[G.rift.evil?'wm_rift_evil':'wm_rift'];if(ri){c.save();c.translate(x+32,y-26);c.rotate(t*0.8);c.drawImage(ri,-22,-22,44,44);c.restore();}else{c.font='26px sans-serif';c.fillText(G.rift.evil?'😈':'🌀',x+30,y-22);}c.font='bold 11px sans-serif';c.lineWidth=3;c.strokeStyle='#000';c.strokeText('균열 Lv'+G.rift.lv,x+32,y-52);c.fillStyle='#e0b0ff';c.fillText('균열 Lv'+G.rift.lv,x+32,y-52);}
 // 현재 위치
 let here=null;if(CUR){if(CUR.kind==='town')here=wpos(TOWNS[CUR.ti].wx,TOWNS[CUR.ti].wy);else if(CUR.gi!=null&&!CUR.pd)here=wpos(GROUNDS[CUR.gi].wx,GROUNDS[CUR.gi].wy);else if(CUR.pd)here=wpos(57,58);}
 if(here){const bob=Math.sin(t*4)*4;c.fillStyle='#e02020';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.moveTo(here[0],here[1]-26+bob);c.lineTo(here[0]-9,here[1]-44+bob);c.lineTo(here[0]+9,here[1]-44+bob);c.closePath();c.fill();c.stroke();c.font='bold 12px sans-serif';c.fillStyle='#e02020';c.fillText('현재 위치',here[0],here[1]-48+bob);}
 }
function wmInfo(){const s=WM.sel;if(!s)return'<span class="mut">마을·사냥터를 누르고 이동 버튼을 누르거나, 한 번 더 누르면 바로 이동한다.</span>';
 if(s.t==='town'){const T=TOWNS[s.i],lock=P.lv<T.unlock,here=CUR&&CUR.kind==='town'&&CUR.ti===s.i,fare=wFare(T.wx,T.wy);const gs=GROUNDS.filter(g=>g.town===s.i);
  return`<b style="font-size:15px">${T.icon} ${T.name}</b> <span class="mut">${T.desc} · 해금 Lv${T.unlock}</span><br><span class="mut" style="font-size:11.5px">주변 사냥터 ${gs.length}곳: Lv${Math.min(...gs.map(g=>g.lv))}~${Math.max(...gs.map(g=>g.lv))}${G.rift&&G.rift.town===s.i?' · 🌀 균열 발생 중!':''}</span><br>
  <button class="btn s" style="margin-top:6px" ${lock||here||P.gold<fare?'disabled':''} onclick="wGo()">${here?'현재 위치':lock?`🔒 Lv${T.unlock}`:`🌀 워프 (${fare}G)`}</button>`;}
 if(s.t==='g'){const g=GROUNDS[s.i],T=TOWNS[g.town],lock=P.lv<T.unlock||P.lv<g.lv-5,fare=wFare(g.wx,g.wy);
  return`<b style="font-size:15px">${g.kind==='dungeon'?'🕳️':'🌿'} ${g.name}</b> <span class="mut">Lv${g.lv} · ${T.name} 지역${g.vt?' · '+VT[g.vt].n+' 변종(빛나는 몬스터)':''} · 속성 ${ELEM[GEL(g)].ic||'없음'}${ELEM[GEL(g)].n}</span><br>
  <span class="mut" style="font-size:11.5px">몬스터: ${g.mons.map(m=>m[0]).join(', ')}${g.boss?' · 👑 '+g.boss[0]:''}</span><br>
  <button class="btn s" style="margin-top:6px" ${lock||P.gold<fare?'disabled':''} onclick="wGo()">${lock?`🔒 Lv${Math.max(T.unlock,g.lv-5)}`:`🌀 워프 (${fare}G)`}</button>`;}
 if(s.t==='dun')return`<b>🏰 내 던전</b> <span class="mut">${P.duns.map(d=>d.name).join(', ')}</span><br><button class="btn s" style="margin-top:6px" onclick="closeModal();openDungeon()">관리</button> <span class="mut">입장은 아르덴 내 집에서</span>`;return'';}
function wFare(x,y){let here=[TOWNS[0].wx,TOWNS[0].wy];if(CUR){if(CUR.kind==='town')here=[TOWNS[CUR.ti].wx,TOWNS[CUR.ti].wy];else if(CUR.gi!=null&&GROUNDS[CUR.gi])here=[GROUNDS[CUR.gi].wx,GROUNDS[CUR.gi].wy];}return Math.round(8+Math.hypot(x-here[0],y-here[1])*(2+P.lv*0.15));}
function wGo(){const s=WM.sel;if(!s)return;if(s.t==='town'){const T=TOWNS[s.i],fare=wFare(T.wx,T.wy);if(P.gold<fare||P.lv<T.unlock)return;P.gold-=fare;closeModal();fade.dir=1;fade.cb=()=>{enterMap('T'+s.i,getMap('T'+s.i).entries.coach);news(`🌀 ${T.name}(으)로 워프`,'me');sfx('warp');};}
 else if(s.t==='g'){const g=GROUNDS[s.i];portalGo(s.i,wFare(g.wx,g.wy));sfx('warp');}}
function wmPop(n){const old=$('#wmpop');if(old)old.remove();if(!n)return;const wrap=$('#wmwrap');if(!wrap)return;const tmp=document.createElement('div');tmp.innerHTML=wmInfo();const btn=tmp.querySelector('button');
 const el=document.createElement('div');el.id='wmpop';el.style.cssText=`position:absolute;left:${n.x}px;top:${n.y+n.r+34}px;transform:translateX(-50%);z-index:3;background:rgba(30,20,12,.94);border:2px solid #c8962e;border-radius:10px;padding:6px 8px;text-align:center;white-space:nowrap;box-shadow:0 6px 16px #000a`;
 const nm=n.t==='town'?TOWNS[n.i].name:n.t==='g'?GROUNDS[n.i].name:'내 던전';el.innerHTML=`<b style="color:#ffe2a8;font-size:13px">${nm}</b><br>`;if(btn){btn.style.marginTop='4px';btn.addEventListener('pointerup',e=>e.stopPropagation());el.appendChild(btn);}
 el.addEventListener('pointerdown',e=>e.stopPropagation());wrap.firstElementChild.style.position='relative';(wrap.querySelector('#wminner')||wrap).appendChild(el);}
function openWorld(){layoutWorld();openModal(`<h2>🗺️ 월드맵 <span class="mut" style="font-size:12px">마을 ${NT}곳 · 사냥터·던전 ${GROUNDS.length}곳</span><span class="gold" style="float:right">💰 ${fmt(P.gold)}G</span></h2>
 <div id="wmwrap" style="width:100%;height:calc(var(--vh,1vh)*62);overflow:auto;border-radius:10px;border:2px solid #6a4a2a;cursor:grab;touch-action:none"><div id="wminner" style="position:relative;width:${WM.W}px;height:${WM.H}px"><canvas id="wmc" width="${WM.W}" height="${WM.H}" style="display:block"></canvas></div></div>
 <div id="wminfo" class="sdet" style="min-height:60px">${wmInfo()}</div>
 <div class="mut" style="font-size:11px">● 사냥터 ◆ 던전 · 👑 보스 · 빛나는 테두리 = 변종 지역 · 🌀 균열 · 워프 요금은 거리와 레벨에 비례</div><button class="btn w g" onclick="closeModal()">닫기 (M)</button>`,true);
 const card=$('#modal .card');if(card)card.style.maxWidth='1100px';
 const wrap=$('#wmwrap');
 const cur=()=>{if(CUR){let p=null;if(CUR.kind==='town')p=wpos(TOWNS[CUR.ti].wx,TOWNS[CUR.ti].wy);else if(CUR.gi!=null&&GROUNDS[CUR.gi])p=wpos(GROUNDS[CUR.gi].wx,GROUNDS[CUR.gi].wy);if(p){wrap.scrollLeft=p[0]-wrap.clientWidth/2;wrap.scrollTop=p[1]-wrap.clientHeight/2;}}};cur();
 if(!openWorld.bound){openWorld.bound=1;let drag=null;
  addEventListener('pointerdown',e=>{const wrap=$('#wmwrap');if(!wrap||!wrap.contains(e.target)||e.target.closest('#wmpop'))return;drag={x:LX(e),y:LY(e),sl:wrap.scrollLeft,st:wrap.scrollTop,m:0};});
  addEventListener('pointermove',e=>{const wrap=$('#wmwrap');if(!drag||!wrap)return;const dx=LX(e)-drag.x,dy=LY(e)-drag.y;if(Math.abs(dx)+Math.abs(dy)>5)drag.m=1;wrap.scrollLeft=drag.sl-dx;wrap.scrollTop=drag.st-dy;});
  addEventListener('pointerup',e=>{const cv=$('#wmc');if(!drag||!cv){drag=null;return;}const d=drag;drag=null;if(d.m)return;const r=lrect(cv),x=(LX(e)-r.left)*WM.W/r.width,y=(LY(e)-r.top)*WM.H/r.height;
   let best=null,bd=1e9;for(const n of wNodes()){const q=Math.hypot(n.x-x,n.y-y);if(q<n.r+22&&q<bd){bd=q;best=n;}}const same=best&&WM.sel&&WM.sel.t===best.t&&WM.sel.i===best.i;WM.sel=best?{t:best.t,i:best.i}:null;if(same&&best.t!=='dun'){wGo();return;}const inf=$('#wminfo');if(inf)inf.innerHTML=wmInfo();wmPop(best);});}
 drawWorld();}
