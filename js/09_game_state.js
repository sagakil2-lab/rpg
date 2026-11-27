'use strict';
// =====================================================================
//  게임 상태
// =====================================================================
let CUR=null,ents=null,paused=false,fade={a:0,dir:0,cb:null},hourAcc=0,reconT=0,hudT=0,miniT=0,zoom=1;
const cam={x:0,y:0,shake:0};
const cv=$('#cv'),ctx=cv.getContext('2d');
const maxHp=()=>Math.round((60+P.lv*15+eqSum('hp'))*(1+0.08*rk('vit')+(HF('cozy')?0.06:0)+0.006*SV('vit'))),maxMp=()=>Math.round((20+P.lv*3)*(1+0.1*rk('focus')+0.006*SV('int'))),pAtk=()=>Math.round((6+P.lv*2+eqv('w','atk')+eqv('r','atk'))*(1+0.05*rk('str'))*(1+0.005*SV('str'))*(P.buff.atkT>0?1+P.buff.atk:1)*(HF('warrior')?1.05:1)*(rk('berserk')&&P.hp<maxHp()*0.5?1+0.08*rk('berserk'):1)),pDef=()=>Math.round((2+P.lv+eqSum('def'))*(1+0.004*SV('vit'))),expNeed=()=>expNeedL(P.lv);
const MAXLV=200;
// Lv30까지는 빠르게, 그 뒤로는 레벨마다 필요 시간이 약 12.6%씩 늘어난다 (쉬지 않고 사냥 시 Lv100 ≈ 2년)
// 같은 레벨 몬스터 (10+4L)마리 분량, 10레벨마다 ×1.45 (Lv50부터 ×1.3)
function expNeedL(L){return Math.round((10+4*L)*(5+4*L)*(L<50?Math.pow(1.45,Math.floor(L/10)):6.41*Math.pow(1.3,Math.floor(L/10)-5)));}
function SV(k){return(P&&P.st&&P.st[k])||0;}
const STP_LV=3;function stpLeft(){const st=P.st||{};return(P.lv-1)*STP_LV+(P.stBonus||0)-['str','agi','int','vit'].reduce((a,k)=>a+(st[k]||0),0);}
const dmgCalc=(a,d,m)=>Math.max(1,Math.round((a*rnd(.85,1.15)-d*0.5)*m));
function newPlayer(){P={lv:1,exp:0,hp:75,mp:23,gold:50,bag:{},cap:60,pot:{p1:3,p2:0,p3:0},scroll:2,stash:{bag:{},items:[],gold:0},w:0,a:0,h:0,b:0,items:[],eq:{w:null,a:null,h:null,b:null,r:null,n:null},eggs:{},eggI:{},dia:50,cores:{},dun:null,duns:[],dsel:0,dmaps:{basic:1},karma:0,kills:0,sk:{spin:1},slots:['spin',null,null,null],sp:0,cd:{},buff:{atk:0,atkT:0,def:0,defT:0},castT:0,deadT:0,dash:null,
 x:0,y:0,r:9,face:1,dir:{x:1,y:0},walk:0,moving:false,atkCd:0,skillCd:0,inv:0,flash:0,swing:0,spin:0,dead:false};}
function freshEnts(){return{chests:[],aproj:[],mons:[],actors:[],picks:[],parts:[],floats:[],slashes:[],rings:[],projs:[],tele:[],pproj:[],timers:[],ghosts:[],bolts:[],meteors:[],fxs:[]};}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>e.classList.remove('on'),2200);}

// ---------- 충돌 이동 ----------
function hitTile(m,x,y,r){const x0=Math.floor((x-r)/TS),x1=Math.floor((x+r)/TS),y0=Math.floor((y-r*0.5)/TS),y1=Math.floor((y+r*0.3)/TS);
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++)if(blocked(m,tx,ty))return true;return false;}
function moveEnt(e,dx,dy){const r=e.r||9;const st=hitTile(CUR,e.x,e.y,r);if(st||!hitTile(CUR,e.x+dx,e.y,r))e.x+=dx;if(st||!hitTile(CUR,e.x,e.y+dy,r))e.y+=dy;}
function nearestOpen(m,x,y){const tx=Math.floor(x/TS),ty=Math.floor(y/TS);for(let rad=0;rad<14;rad++)for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==rad)continue;const px=(tx+dx)*TS+16,py=(ty+dy)*TS+20;if(!hitTile(m,px,py,10))return{x:px,y:py};}return{x,y};}
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/14);for(let i=1;i<n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;if(hitTile(CUR,x,y,7))return false;}return true;}
let NAVB=6;const SFL={a:0,c:'255,255,255'};
function castFX(br){const col=BRC[br]||'#fff',rgb=col.match(/\w\w/g).map(h=>parseInt(h,16)).join(',');SFL.a=Math.max(SFL.a,0.18);SFL.c=rgb;ents.rings.push({x:P.x,y:P.y-4,life:0,max:0.45,r:64,col:rgb});
 for(let i=0;i<26;i++){const a=R()*6.28,v=rnd(60,200);ents.parts.push({x:P.x,y:P.y-18,vx:Math.cos(a)*v,vy:Math.sin(a)*v*0.6-40,gr:120,life:0,max:rnd(.35,.7),col:pick([col,'#fff',col]),s:rnd(1.5,3.5)});}}
function nearMon(x,y,rad,ex){let b=null,bd=rad;for(const m of ents.mons){if(m.dead||(ex&&ex.has(m)))continue;const d=Math.hypot(m.x-x,m.y-y);if(d<bd){bd=d;b=m;}}return b;}
function pillar(x,y,col,w){for(let i=0;i<22;i++)ents.parts.push({x:x+rnd(-w,w),y:y-rnd(0,140),vx:0,vy:rnd(-60,-10),gr:0,life:0,max:rnd(.3,.6),col:pick([col,'#fff']),s:rnd(2,4)});ents.rings.push({x,y,life:0,max:0.35,r:w*2.2,col:col.match(/\w\w/g).map(h=>parseInt(h,16)).join(',')});}
function navTo(e,tx,ty,spd,dt){if(los(e.x,e.y,tx,ty)){e.nav=null;return stepToward(e,tx,ty,spd,dt);}
 const ttx=Math.floor(tx/TS),tty=Math.floor(ty/TS),tk=ttx+ty*0+tty*4096;e.navT=(e.navT||0)-dt;
 if((!e.nav||e.navK!==tk||e.navT<=0)&&NAVB>0){NAVB--;let gx=ttx,gy=tty;if(blocked(CUR,gx,gy)){const q=nearestOpen(CUR,tx,ty);gx=Math.floor(q.x/TS);gy=Math.floor(q.y/TS);}
  e.nav=pathTo(CUR,Math.floor(e.x/TS),Math.floor(e.y/TS),gx,gy);e.navI=0;e.navK=tk;e.navT=1.2+R()*0.6;if(!e.nav){e.navFail=(e.navFail||0)+1;}else e.navFail=0;}
 if(e.nav&&e.navI<e.nav.length){while(e.navI<e.nav.length-1&&los(e.x,e.y,e.nav[e.navI+1].x,e.nav[e.navI+1].y-4))e.navI++;const q=e.nav[e.navI];if(stepToward(e,q.x,q.y-4,spd,dt))e.navI++;return false;}
 return stepToward(e,tx,ty,spd,dt);}
function stepToward(e,tx,ty,spd,dt){const dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy);if(d<3)return true;moveEnt(e,dx/d*Math.min(spd*dt,d),dy/d*Math.min(spd*dt,d));if(Math.abs(dx)>1)e.face=dx<0?-1:1;return false;}

// ---------- 맵 진입 ----------
function enterMap(key,pos){P.trail=[];if(key!=='LEG'&&G.leg&&G.leg.in){legEnd(false);}const m=getMap(key);for(const k in MAPS)if(MAPS[k]!==m)MAPS[k].cache=null;CUR=m;ents=freshEnts();P.x=pos.x;P.y=pos.y;if(hitTile(m,P.x,P.y,10)){const q=nearestOpen(m,P.x,P.y);P.x=q.x;P.y=q.y;}P.dash=null;cam.x=P.x;cam.y=P.y;
 if(m.leg){if(G.leg)legSpawn(m);}else if(m.raid){if(G.rift)raidSpawn(m);}
 else if(m.pd){const ms=P.dun?P.dun.mons:[];const used=[];const far=()=>{let best=null,bs=-1;for(let s=0;s<40;s++){const p=pick(m.spawns);const md=used.length?Math.min(...used.map(u=>Math.hypot(u[0]-p[0],u[1]-p[1]))):1e9;if(md>bs){bs=md;best=p;}}return best;};ms.forEach((pm,i)=>{for(let k=0;k<pdCount(pm);k++){const mo=pdMon(i);let sp;if(pm.mi<0){sp=!used.length&&m.bossPt?[m.bossPt.x,m.bossPt.y]:far();used.push(sp);}else sp=pick(m.spawns);mo.x=mo.hx=sp[0];mo.y=mo.hy=sp[1];ents.mons.push(mo);}});}
 else if(m.kind!=='town'){const g=GROUNDS[m.gi];const n=Math.round(((m.kind==='dungeon'?20:17)+(isSurge(m.gi)?6:0))*Math.max(1,m.w*m.h/1800)*0.75);for(let i=0;i<n;i++)spawnMon(m);
  if(g.boss&&m.bossPt){const b=mkMon(m.gi,-1,true);b.x=b.hx=m.bossPt.x;b.y=b.hy=m.bossPt.y;ents.mons.push(b);}}
 else if(m.home){homeSolid(m);}else{ents.actors.push(mkStory(m.ti));const vn=9;for(let i=0;i<vn;i++){const a=mkVillager();const[tx,ty]=pick(m.roadTiles);a.x=tx*TS+16;a.y=ty*TS+20;ents.actors.push(a);}}
 if(m.kind!=='town'&&!m.raid){let n=(R()<0.45?1:0)+(R()<0.12?1:0)+(m.pd?0:(R()<0.25?1:0));for(let i=0;i<n;i++)spawnChest(m);}
 reconcile(true);
 const lbl=m.pd?`🏰 ${m.name} (Lv${dunLv()}) — 몬스터 ${ents.mons.length}마리`:m.kind==='town'?`${TOWNS[m.ti].icon} ${m.name}`:`${m.kind==='dungeon'?'🕳️':'🌿'} ${m.name} (Lv${GROUNDS[m.gi].lv}~)`;
 $('#hLoc').textContent=m.name;toast(lbl);updMiniBase=true;}
function transition(key,fromKey){if(fade.dir)return;try{window.joyReset&&window.joyReset();}catch(e){}sfx('warp');fade.dir=1;fade.cb=()=>{const m=getMap(key);enterMap(key,m.entries[fromKey]||(fromKey==='HOME'?m.entries.PD:null)||m.entries.start||m.entries[Object.keys(m.entries)[0]]);};}
