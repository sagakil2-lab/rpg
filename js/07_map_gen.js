'use strict';
// =====================================================================
//  맵 생성
// =====================================================================
const TS=32;
const TL={GRASS:0,ROAD:1,WATER:2,TREE:3,ROCK:4,FLOOR:5,WALL:6,SAND:7,BLD:8,FLOWER:9,LAVA:10,TOMB:11,FENCE:12,BRIDGE:13,PINE:14,PROP:15};
const BLOCK=[0,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1];
// 지역별 장식 (나무·식물·소품)
const TREEIMG={meadow:['obj_tree','tr_blossom'],forest:['obj_tree','tr_birch','obj_tree'],swamp:['tr_swamp','tr_swamp','obj_tree'],town:['obj_tree','tr_blossom'],forestTown:['obj_tree','tr_birch','tr_blossom'],portTown:['tr_palm','obj_tree'],fortTown:['obj_tree','tr_dead'],mineTown:['tr_dead','obj_tree'],beach:['tr_palm'],canyon:['tr_burnt','tr_dead']};
const PLANTS={meadow:['pl_flower','pl_bush','pl_berry'],forest:['pl_bush','pl_berry','pl_mush'],swamp:['pl_reed','pl_mush','pl_reed'],beach:['pl_drygrass'],canyon:['pl_cactus','pl_drygrass'],snow:['pl_snowbush'],cave:['pl_mush'],grave:['pl_drygrass'],town:['pl_flower','pl_bush'],forestTown:['pl_flower','pl_berry','pl_mush'],portTown:['pl_drygrass','pl_flower'],fortTown:['pl_bush'],mineTown:['pl_drygrass','pl_cactus']};
const FPROPS={meadow:['pf_campfire','pf_tent'],forest:['pf_campfire','pf_tent','pf_pillar'],swamp:['pf_pillar','tr_swamp'],beach:['pf_shell','pf_tent','pf_shell'],canyon:['pf_lavarock','pf_pillar','tr_burnt'],snow:['pf_icerock','pf_campfire','tr_snowpine'],cave:['pf_crystal','pf_minecart','tr_mushroom'],mine:['pf_minecart','pf_crystal'],grave:['pf_pillar','tr_dead'],lava:['pf_lavarock','tr_burnt','pf_crystal']};
const PSZ={pt_well:62,pt_stall:66,pt_barrel:44,pt_crate:54,pt_cart:56,pt_lamp:64,pt_bench:46,pt_sign:50,pf_campfire:42,pf_tent:60,pf_crystal:48,pf_minecart:52,pf_pillar:56,pf_shell:44,pf_icerock:52,pf_lavarock:56,tr_dead:74,tr_burnt:74,tr_mushroom:70,tr_swamp:78,tr_snowpine:78,pl_bush:30,pl_berry:30,pl_flower:28,pl_reed:32,pl_cactus:34,pl_drygrass:28,pl_snowbush:30,pl_mush:24};
function drawProp(c,k,x,y){const im=IMG[k];if(!im)return;const s=PSZ[k]||48,f=s/Math.max(im.width,im.height),w=im.width*f,h=im.height*f;c.drawImage(im,x*TS+16-w/2,y*TS+30-h,w,h);}
function decorate(m,rng,big){const th=m.theme,pl=m.vibe?m.vibe.plant:PLANTS[th],fp=FPROPS[th];m.props=m.props||[];
 for(let y=2;y<m.h-2;y++)for(let x=2;x<m.w-2;x++){const t=tAt(m,x,y);if(BLOCK[t]||t===TL.ROAD||t===TL.BRIDGE)continue;const r=rng();
  if(fp&&big&&r<0.006&&m.entDist&&m.entDist[x+y*m.w]>6){let ok=true;for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++)if(BLOCK[tAt(m,x+dx,y+dy)]){ok=false;break;}if(ok){m.props.push([x,y,fp[Math.floor(rng()*fp.length)]]);setT(m,x,y,TL.PROP);}}
  else if(pl&&r<0.03)m.props.push([x,y,pl[Math.floor(rng()*pl.length)],1]);}}
const THEMES={
 town:{base:'#6aa84f',base2:'#64a14a'},forestTown:{base:'#4f8f45',base2:'#4a8741',road:'#b89a66',tree:'#235f2c',tree2:'#2f7a3a'},
 mineTown:{base:'#8f8a6a',base2:'#878264',road:'#a89880',road2:'#988870',rock:'#6a625a'},
 portTown:{base:'#7ab85a',base2:'#74b055',road:'#d8c08a',water:'#2f7ab8'},fortTown:{base:'#7a8a5a',base2:'#748455',road:'#a89a88',road2:'#988a78',fence:'#6a6a72'},
 meadow:{base:'#79c25a',base2:'#72b954',tree:'#2f8a3a',tree2:'#46a84a',flowers:true},
 cave:{floor:'#4a4650',floor2:'#46424c',wall:'#221e28',wallTop:'#5a5464',rock:'#6a6470',dark:0.5},
 forest:{base:'#3f7a3a',base2:'#3a7235',tree:'#1d5428',tree2:'#2a6a32',rock:'#6a6a62'},
 swamp:{base:'#5a6a3a',base2:'#556437',water:'#3d5a40',tree:'#3a4a2a',tree2:'#4a5a32',dark:0.25},
 beach:{base:'#e8d49a',base2:'#e2cc90',plain:true,water:'#3a8ac8',rock:'#8a8a7a'},
 mine:{floor:'#5a4a3a',floor2:'#554636',wall:'#20170e',wallTop:'#6a5a48',rock:'#7a6a58',dark:0.52},
 canyon:{base:'#c8744a',base2:'#c06d45',plain:true,rock:'#8a4a32',lava:'#ff6a1a'},
 grave:{floor:'#3a3a46',floor2:'#363642',wall:'#17171f',wallTop:'#3e3e4c',tomb:'#8a8a9a',rock:'#55556a',dark:0.5},
 snow:{base:'#eef4fa',base2:'#e6eef6',plain:true,rock:'#9ab0c8',tree:'#2a5a4a',tree2:'#3a6a5a',snowy:true},
 lava:{floor:'#4a2018',floor2:'#451d16',wall:'#160806',wallTop:'#5a2a20',lava:'#ff5a10',rock:'#5a3028',dark:0.5},
};
const DEFTH={base:'#6aa84f',base2:'#64a14a',road:'#cdb07a',road2:'#bc9c68',water:'#4a90c8',tree:'#2f7a3a',tree2:'#3f9a4a',rock:'#8a8a8a',wall:'#333',wallTop:'#555',floor:'#555',floor2:'#505050',lava:'#f60',tomb:'#999',fence:'#8a8270',sand:'#ead8a2',dark:0};
const THM=k=>Object.assign({},DEFTH,THEMES[k]);
const MAPS={};
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function newMap(key,name,kind,w,h,theme){return{key,name,kind,w,h,theme,tiles:new Uint8Array(w*h),buildings:[],exits:[],entries:{},spawns:[],roadTiles:[],cache:null,mini:null};}
const tAt=(m,x,y)=>(x<0||y<0||x>=m.w||y>=m.h)?TL.WALL:m.tiles[y*m.w+x];
const setT=(m,x,y,t)=>{if(x>=0&&y>=0&&x<m.w&&y<m.h)m.tiles[y*m.w+x]=t;};
const blocked=(m,x,y)=>BLOCK[tAt(m,x,y)]===1||(m.solid&&m.solid.has(x+y*m.w));
function bfs(m,starts){const d=new Int16Array(m.w*m.h).fill(-1);const q=[];starts.forEach(([x,y])=>{const k=x+y*m.w;if(d[k]<0){d[k]=0;q.push(k);}});
 for(let i=0;i<q.length;i++){const k=q[i],x=k%m.w,y=(k/m.w)|0;for(const[dx,dy]of DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=m.w||ny>=m.h)continue;const nk=nx+ny*m.w;if(d[nk]>=0||blocked(m,nx,ny))continue;d[nk]=d[k]+1;q.push(nk);}}return d;}
function pathTo(m,sx,sy,tx,ty){if(blocked(m,tx,ty))return null;const d=bfs(m,[[tx,ty]]);let k=sx+sy*m.w;if(d[k]<0)return null;const out=[];let guard=0;
 while(d[k]>0&&guard++<400){const x=k%m.w,y=(k/m.w)|0;let nk=-1;for(const[dx,dy]of DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=m.w||ny>=m.h)continue;const c=nx+ny*m.w;if(d[c]===d[k]-1){nk=c;break;}}if(nk<0)break;k=nk;out.push({x:(k%m.w)*TS+16,y:((k/m.w)|0)*TS+20});}return out;}
function noise(rng,W,H,cell){const gw=Math.ceil(W/cell)+2,gh=Math.ceil(H/cell)+2,g=[];for(let i=0;i<gw*gh;i++)g.push(rng());const o=new Float32Array(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const fx=x/cell,fy=y/cell,ix=fx|0,iy=fy|0,tx=fx-ix,ty=fy-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);
  const a=g[iy*gw+ix],b=g[iy*gw+ix+1],c=g[(iy+1)*gw+ix],d=g[(iy+1)*gw+ix+1];o[y*W+x]=a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;}return o;}
function getMap(key){if(key==='PD'&&MAPS.PD&&P.dun&&MAPS.PD.sig!==P.dsel+'_'+P.dun.cores.length+'_'+(P.dun.map||'basic'))delete MAPS.PD;if(!MAPS[key])MAPS[key]=key==='RAID'?genRaid():key==='PD'?genPD():key==='LEG'?genLegMap():key==='HOME'?genHome():key[0]==='T'?genTown(+key.slice(1)):genGround(+key.slice(1));return MAPS[key];}
function genPD(){const d=P.dun,L=dunLv();const cnt={};d.cores.forEach(gi=>cnt[gi]=(cnt[gi]||0)+1);const gi=+Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]||b-a)[0];
 const theme=dmap().theme||(L<8?'cave':L<16?'mine':L<24?'grave':'lava');const mk=Object.keys(DMAPS).indexOf(d.map||'basic');const m=genGround(gi,{key:'PD',name:d.name,kind:'dungeon',theme,town:0,side:'E',boss:true,seed:9100+d.cores.length*31+mk*577});m.pd=true;m.sig=P.dsel+'_'+d.cores.length+'_'+(d.map||'basic');m.entries.T0.home=1;const rng=mulberry(77+d.cores.length);m.torches=[];m.decor=[];
 for(let y=1;y<m.h-1;y++)for(let x=1;x<m.w-1;x++){if(tAt(m,x,y)===TL.WALL&&!blocked(m,x,y+1)&&rng()<0.16)m.torches.push([x*TS+16,y*TS+18]);
  else if(!blocked(m,x,y)&&rng()<0.035)m.decor.push([x,y,Math.floor(rng()*4)]);}
 const e=m.entries.T0;m.banner={x:e.x+40,y:e.y-50};return m;}

// ---------- 마을별 분위기 ----------
const TVIBE=[
 {n:'왕도',tile:'tile_town',f:'none',rf:'none',roofs:['#a83a3a','#3a5aa8','#c8962e','#8a3a3a'],tree:['obj_tree','tr_blossom'],plant:['pl_flower','pl_bush'],part:'petal',pc:'#ffd0e0',ov:null,ff:'none'},
 {n:'숲',tile:'tile_forestTown',f:'saturate(1.25) brightness(.92)',rf:'sepia(.3)',roofs:['#5a7a3a','#7a4a8a','#3a6a5a','#8a6a3a'],tree:['tr_mushroom','tr_birch','obj_tree'],plant:['pl_mush','pl_berry','pl_flower'],part:'firefly',pc:'#c8ff7a',ov:'rgba(20,60,30,.14)',ff:'hue-rotate(60deg) saturate(1.2)',th:{water:'#3a8a7a'}},
 {n:'광산',tile:'tile_mineTown',f:'brightness(.85) sepia(.25)',rf:'brightness(.8) sepia(.4)',roofs:['#5a4a3a','#6a3a2a','#4a4a52','#7a5a3a'],tree:['tr_dead','tr_burnt'],plant:['pl_drygrass'],part:'ember',pc:'#ffa04a',ov:'rgba(60,30,10,.18)',ff:'sepia(1) saturate(4) hue-rotate(-25deg) brightness(.95)',lava:true,bf:'brightness(.9) sepia(.2)'},
 {n:'항구',tile:'tile_portTown',f:'saturate(1.15) brightness(1.05)',rf:'brightness(1.1)',roofs:['#2a6aa8','#e8e8e0','#3a8ab8','#c84a3a'],tree:['tr_palm','obj_tree'],plant:['pl_drygrass','pl_flower'],part:'spray',pc:'#e0f4ff',ov:'rgba(120,200,255,.07)',ff:'none',th:{water:'#2a7ac8'}},
 {n:'요새',tile:'tile_fortTown',f:'sepia(.35) saturate(.8)',rf:'sepia(.3) brightness(.85)',roofs:['#4a4a52','#6a2a2a','#3a3a42','#5a3a2a'],tree:['tr_burnt','tr_dead'],plant:['pl_drygrass'],part:'ash',pc:'#9a8a80',ov:'rgba(90,20,10,.16)',ff:'sepia(.6) hue-rotate(-20deg)',bf:'saturate(.75) brightness(.9)'},
 {n:'요정',tile:'tile_meadow',f:'hue-rotate(-25deg) saturate(1.3) brightness(1.05)',rf:'hue-rotate(-30deg) saturate(.8) brightness(1.1)',roofs:['#d87aa8','#a87ad8','#7ac8d8','#e8a8c8'],tree:['tr_blossom','tr_mushroom','tr_blossom'],plant:['pl_flower','pl_flower','pl_berry'],part:'petal',pc:'#ffb0d8',ov:'rgba(255,160,220,.08)',ff:'hue-rotate(-60deg) saturate(1.3)',th:{water:'#7ab8e8'},bf:'saturate(1.15) brightness(1.05)'},
 {n:'유적',tile:'tile_town',f:'saturate(.55) brightness(1.08) sepia(.25)',rf:'grayscale(.6) brightness(1.15)',roofs:['#c8b88a','#4a6aa8','#d8d0c0','#8a7a5a'],tree:['tr_birch','obj_tree'],plant:['pl_bush'],part:'mote',pc:'#ffe8a0',ov:'rgba(255,235,180,.08)',ff:'grayscale(.4) brightness(1.1)',bf:'saturate(.7) brightness(1.08)'},
 {n:'사막',tile:'tile_beach',f:'saturate(1.2) hue-rotate(-8deg)',rf:'sepia(.6) brightness(1.05)',roofs:['#d8a860','#c87a3a','#e8c890','#a85a3a'],tree:['tr_palm','tr_palm','tr_dead'],plant:['pl_cactus','pl_drygrass'],part:'sand',pc:'#e8c890',ov:'rgba(255,170,60,.12)',ff:'sepia(.4)',th:{water:'#3ab8c8',base:'#e8d49a',base2:'#e2cc90'},bf:'sepia(.35) brightness(1.05)'},
 {n:'설원',liq:'ice',tile:'tile_snow',f:'none',rf:'brightness(1.25) saturate(.5)',roofs:['#e8eef4','#5a6a8a','#8a4a3a','#3a4a6a'],tree:['tr_snowpine','tr_snowpine','obj_pine'],plant:['pl_snowbush'],part:'snow',pc:'#ffffff',ov:'rgba(160,200,255,.12)',ff:'hue-rotate(170deg) saturate(.4) brightness(1.3)',th:{water:'#a8d8f0',base:'#eef4fa',base2:'#e6eef6'},bf:'brightness(1.05) saturate(.8)'},
 {n:'심연',liq:'void',tile:'tile_swamp',f:'hue-rotate(220deg) saturate(.8) brightness(.7)',rf:'hue-rotate(220deg) brightness(.6) saturate(.6)',roofs:['#3a2a5a','#2a1a3a','#5a2a6a','#1a2a3a'],tree:['tr_dead','tr_swamp'],plant:['pl_mush','pl_reed'],part:'wisp',pc:'#c88aff',ov:'rgba(40,10,70,.25)',ff:'hue-rotate(220deg) saturate(1.5) brightness(.8)',th:{water:'#5a2a8a'},bf:'brightness(.75) hue-rotate(-15deg) saturate(.8)'}];
const AMB={l:[],t:0,key:null};
function townAmb(c,t){const V=CUR&&CUR.kind==='town'&&!CUR.home&&CUR.vibe;if(!V){AMB.l.length=0;return;}const W=cv.width,H=cv.height,dt=Math.min(0.05,t-(AMB.t||t));AMB.t=t;if(AMB.key!==CUR.key){AMB.key=CUR.key;AMB.l.length=0;}
 if(V.ov){c.fillStyle=V.ov;c.fillRect(0,0,W,H);}
 const k=V.part,N={snow:90,petal:40,ember:45,sand:70,firefly:30,wisp:28,spray:35,ash:40,mote:35}[k]||0;
 while(AMB.l.length<N){const p={x:R()*W,y:R()*H,s:rnd(1.5,4)*DPR,ph:R()*6.28,v:rnd(0.6,1.4)};AMB.l.push(p);}
 c.save();for(const p of AMB.l){const v=p.v*DPR;p.ph+=dt*2;
  if(k==='snow'){p.y+=40*v*dt;p.x+=Math.sin(p.ph)*20*dt*DPR;}else if(k==='petal'){p.y+=30*v*dt;p.x+=(18+Math.sin(p.ph)*20)*dt*DPR;}else if(k==='ember'){p.y-=35*v*dt;p.x+=Math.sin(p.ph)*15*dt*DPR;}
  else if(k==='sand'){p.x+=160*v*dt;p.y+=Math.sin(p.ph)*10*dt*DPR;}else if(k==='ash'){p.y+=18*v*dt;p.x+=10*v*dt;}else if(k==='spray'){p.x-=25*v*dt;p.y+=Math.sin(p.ph)*8*dt*DPR;}else{p.x+=Math.sin(p.ph*0.7)*14*dt*DPR;p.y+=Math.cos(p.ph*0.5)*10*dt*DPR-(k==='wisp'?12*v*dt:0);}
  if(p.y>H+10)p.y=-10;if(p.y<-10)p.y=H+10;if(p.x>W+10)p.x=-10;if(p.x<-10)p.x=W+10;
  const a=k==='firefly'||k==='mote'||k==='wisp'?0.35+Math.sin(p.ph*2)*0.35:k==='sand'?0.45:0.85;c.globalAlpha=Math.max(0,a);c.fillStyle=V.pc;
  if(k==='petal'){c.save();c.translate(p.x,p.y);c.rotate(p.ph);c.beginPath();c.ellipse(0,0,p.s*1.2,p.s*0.6,0,0,7);c.fill();c.restore();}
  else if(k==='sand')c.fillRect(p.x,p.y,p.s*3,p.s*0.5);
  else{if(k==='firefly'||k==='wisp'||k==='ember'||k==='mote'){c.globalCompositeOperation='lighter';}c.beginPath();c.arc(p.x,p.y,p.s*(k==='wisp'?1.6:1),0,7);c.fill();c.globalCompositeOperation='source-over';}}
 c.restore();c.globalAlpha=1;}
function genTown(ti){
 const T=TOWNS[ti],W=36,H=28,rng=mulberry(777+ti*131),m=newMap('T'+ti,T.name,'town',W,H,T.theme);m.ti=ti;const V=TVIBE[ti]||TVIBE[0];m.vibe=V;m.treeL=V.tree;
 const cx=17,cy=13;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=rng()<0.05?TL.FLOWER:TL.GRASS;if(x<2||y<2||x>=W-2||y>=H-2)t=T.border;setT(m,x,y,t);}
 const road=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)setT(m,x,y,TL.ROAD);};
 road(2,cy,W-3,cy+1);road(cx,2,cx+1,H-3);road(cx-4,cy-3,cx+5,cy+4);road(3,22,W-4,23);
 for(let y=cy-1;y<=cy+2;y++)for(let x=cx-1;x<=cx+2;x++)setT(m,x,y,TL.WATER);
 m.fountain={x:(cx+1)*TS,y:(cy+1)*TS};if(V.lava)for(let y=cy-1;y<=cy+2;y++)for(let x=cx-1;x<=cx+2;x++)setT(m,x,y,TL.LAVA);
 if(T.theme==='portTown'){for(let y=24;y<H;y++)for(let x=0;x<W;x++)setT(m,x,y,y===24?TL.SAND:TL.WATER);for(let y=24;y<H;y++)for(let x=26;x<=27;x++)setT(m,x,y,TL.BRIDGE);}
 const gates=[];
 for(const side in T.exits){const gi=T.exits[side];let ex,en;
  if(side==='E'){road(W-2,cy,W-1,cy+1);ex={x:W-1,y:cy,w:1,h:2};en={x:(W-3)*TS+16,y:(cy+1)*TS+8};gates.push([W-1,cy],[W-1,cy+1]);}
  if(side==='W'){road(0,cy,1,cy+1);ex={x:0,y:cy,w:1,h:2};en={x:2*TS+16,y:(cy+1)*TS+8};gates.push([0,cy],[0,cy+1]);}
  if(side==='N'){road(cx,0,cx+1,1);ex={x:cx,y:0,w:2,h:1};en={x:(cx+1)*TS,y:3*TS};gates.push([cx,0],[cx+1,0]);}
  if(side==='S'){road(cx,H-2,cx+1,H-1);ex={x:cx,y:H-1,w:2,h:1};en={x:(cx+1)*TS,y:(H-3)*TS};gates.push([cx,H-1],[cx+1,H-1]);}
  ex.to='G'+gi;ex.side=side;ex.gi=gi;m.exits.push(ex);m.entries['G'+gi]=en;}
 const slots=[[3,6,6,4],[10,6,5,4],[22,6,5,4],[28,6,6,4],[3,18,6,4],[10,18,5,4],[22,18,5,4],[28,18,6,4]];
 const types=ti===0?['home','craft','mat','mapshop','portal','inn','coach','gacha']:['gacha','craft','mat','portal','arena','inn','coach','house'];const SPEC=[null,'windmill','forge','pier','tower','windmill','chapel','warehouse','stable','pier'];
 const roofs=['#9a4a3a','#4a5a7a','#6a7a3a','#8a5a3a','#5a4a6a','#3a6a6a'];
 slots.forEach(([x,y,w,h],i)=>{const type=types[i];const b={x,y,w,h,type,img:type==='portal'?'house':type,door:{x:x+(w>>1),y:y+h-1}};
  if(type==='home'){b.label='유부장의 집';b.icon='🏠';}if(type==='mapshop'){b.label='던전 지도 상점';b.icon='🗺️';}if(type==='portal'){b.label='사냥터 게이트';b.icon='🌀';}if(type==='gacha'){b.label='소환의 집';b.icon='🔮';b.img=IMG.bld_gacha?'gacha':'house';}if(type==='portal'&&IMG.bld_guild)b.img='guild';if(type==='arena'){b.label='몬스터 투기장';b.icon='🏟️';b.img=IMG.bld_arena?'arena':'house';}if(type==='house'&&i===7&&SPEC[ti]&&IMG['bld_'+SPEC[ti]])b.spec=SPEC[ti];b.front={x:b.door.x,y:b.door.y+1};
  b.roof={arena:'#8a3a2a',mat:'#b0503a',craft:'#4a5a8a',inn:'#8a5a2a',coach:'#5a7a3a',home:'#2a6a8a',mapshop:'#6a3a8a',portal:'#3a2a7a',house:V.roofs[(i*7+ti)%V.roofs.length],gacha:'#5a2a8a'}[type];if(type!=='portal'&&type!=='gacha'&&type!=='home')b.roof=V.roofs[(i+ti)%V.roofs.length];
  b.wall=type==='house'?pick(['#e8d8b8','#e0cca8','#d8d0c0']):'#eadcbc';
  if(type==='mat'){b.shop=ti*2;b.label=SHOPS[ti*2].name;b.icon='📦';}
  if(type==='craft'){b.shop=ti*2+1;b.label=SHOPS[ti*2+1].name;b.icon='⚒️';}
  if(type==='inn'){b.label=T.name+' 여관';b.icon='🛏️';}
  if(type==='coach'){b.label='역마차 정류장';b.icon='🐎';}
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)setT(m,xx,yy,TL.BLD);
  for(let yy=b.front.y;yy<b.front.y+4;yy++){if(tAt(m,b.front.x,yy)===TL.ROAD)break;setT(m,b.front.x,yy,TL.ROAD);}
  m.buildings.push(b);});
 const nTree=T.theme==='forestTown'?90:40;
 for(let i=0;i<nTree;i++){const x=ri(2,W-3),y=ri(2,H-3);let ok=true;for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++){const t=tAt(m,x+dx,y+dy);if(t!==TL.GRASS&&t!==TL.FLOWER&&t!==T.border){ok=false;break;}}
  if(ok)setT(m,x,y,T.theme==='mineTown'?(R()<0.6?TL.ROCK:TL.TREE):T.theme==='fortTown'&&R()<0.3?TL.ROCK:TL.TREE);}
 {const TP=['pt_well','pt_stall','pt_barrel','pt_crate','pt_cart','pt_lamp','pt_bench','pt_sign','pt_lamp','pt_barrel','pt_stall','pt_crate'];m.props=[];let placed=0;
  for(let k=0;k<400&&placed<16;k++){const x=ri(3,W-4),y=ri(3,H-4);const t=tAt(m,x,y);if(t!==TL.GRASS&&t!==TL.FLOWER)continue;let road=0,bad=false;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const q=tAt(m,x+dx,y+dy);if(q===TL.ROAD)road++;if(q===TL.BLD||q===TL.WATER||BLOCK[q]&&q!==TL.BLD)bad=true;}
   if(bad||!road||m.buildings.some(b=>Math.abs(b.front.x-x)<=1&&Math.abs(b.front.y-y)<=2))continue;m.props.push([x,y,TP[placed%TP.length]]);setT(m,x,y,TL.PROP);placed++;}
  decorate(m,mulberry(99+ti),false);}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(tAt(m,x,y)===TL.ROAD)m.roadTiles.push([x,y]);
 m.gateDist=bfs(m,gates);
 const hm=m.buildings.find(b=>b.type==='home');if(hm)m.entries.PD={x:hm.front.x*TS+16,y:(hm.front.y+1)*TS+4};const coach=m.buildings.find(b=>b.type==='coach');m.entries.coach={x:coach.front.x*TS+16,y:(coach.front.y+1)*TS};
 m.entries.start={x:(cx-3)*TS,y:(cy+3)*TS};
 return m;}

function genGround(gi,ov){
 const g=ov||GROUNDS[gi],dg=g.kind==='dungeon',W=ov?(dg?50:46):(dg?104:100),H=ov?(dg?40:36):(dg?84:80),rng=mulberry(ov?ov.seed:4242+gi*977);
 const m=newMap(ov?ov.key:'G'+gi,g.name,g.kind,W,H,g.theme);m.gi=gi;const th=THM(g.theme);
 const side=ov?ov.side:(Object.keys(TOWNS[g.town].exits).find(s=>TOWNS[g.town].exits[s]===gi)||'S');const ent={E:'W',W:'E',N:'S',S:'N'}[side];
 let ex,ey;if(ent==='W'){ex=1;ey=H>>1;}if(ent==='E'){ex=W-2;ey=H>>1;}if(ent==='N'){ex=W>>1;ey=1;}if(ent==='S'){ex=W>>1;ey=H-2;}
 const floor=dg?TL.FLOOR:TL.GRASS;
 const obs={meadow:TL.TREE,forest:TL.TREE,swamp:TL.TREE,beach:TL.ROCK,canyon:TL.ROCK,snow:TL.PINE}[g.theme]||TL.WALL;
 if(!dg){const n1=noise(rng,W,H,5),n2=noise(rng,W,H,3);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const v=n1[y*W+x],v2=n2[y*W+x];let t=floor;
   if(th.flowers&&rng()<0.06)t=TL.FLOWER;
   if(g.theme==='meadow'&&v>0.71)t=TL.TREE;
   if(g.theme==='forest'){if(v>0.68)t=TL.TREE;else if(v2>0.88)t=TL.ROCK;}
   if(g.theme==='swamp'){if(v>0.64)t=TL.WATER;else if(v2>0.8)t=TL.TREE;}
   if(g.theme==='beach'){const sea=ent==='E'?x<7+Math.sin(y*0.35)*2:x>W-8+Math.sin(y*0.35)*2;if(sea)t=TL.WATER;else if(v>0.72)t=TL.ROCK;}
   if(g.theme==='canyon'){if(v>0.65)t=TL.ROCK;else if(v2>0.85)t=TL.LAVA;}
   if(g.theme==='snow'){if(v>0.64)t=TL.PINE;else if(v2>0.84)t=TL.ROCK;}
   if(x===0||y===0||x===W-1||y===H-1)t=obs;setT(m,x,y,t);}
  const cxp=W>>1,cyp=H>>1;for(let i=0;i<=60;i++){const x=Math.round(ex+(cxp-ex)*i/60),y=Math.round(ey+(cyp-ey)*i/60);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>0&&y+dy>0&&x+dx<W-1&&y+dy<H-1)setT(m,x+dx,y+dy,floor);}
 }else{for(let i=0;i<W*H;i++)m.tiles[i]=TL.WALL;
  let x=ex,y=ey,dx=ent==='W'?1:ent==='E'?-1:0,dy=ent==='N'?1:ent==='S'?-1:0,carved=0;const goal=W*H*0.42;
  const carve=(x,y)=>{for(let yy=y;yy<=y+1;yy++)for(let xx=x;xx<=x+1;xx++)if(xx>0&&yy>0&&xx<W-1&&yy<H-1&&tAt(m,xx,yy)===TL.WALL){setT(m,xx,yy,floor);carved++;}};
  for(let it=0;it<500000&&carved<goal;it++){carve(x,y);if(rng()<0.05){const rw=ri(4,8),rh=ri(3,6);for(let yy=0;yy<rh;yy++)for(let xx=0;xx<rw;xx+=2)carve(x+xx-2,y+yy-2);}
   if(rng()<0.22){const d=DIRS[Math.floor(rng()*4)];dx=d[0];dy=d[1];}x=clamp(x+dx,1,W-3);y=clamp(y+dy,1,H-3);}
  for(let y2=1;y2<H-1;y2++)for(let x2=1;x2<W-1;x2++){if(tAt(m,x2,y2)!==TL.FLOOR)continue;const r=rng();
   if(g.theme==='grave'&&r<0.05)setT(m,x2,y2,TL.TOMB);else if(g.theme==='lava'&&r<0.035)setT(m,x2,y2,TL.LAVA);else if(r<0.02)setT(m,x2,y2,TL.ROCK);}}
 const open=[];if(ent==='W'||ent==='E'){const x0=ent==='W'?0:W-3;for(let yy=ey-1;yy<=ey+1;yy++)for(let xx=x0;xx<x0+3;xx++)setT(m,xx,yy,floor);m.exits.push({x:ent==='W'?0:W-1,y:ey-1,w:1,h:3,to:'T'+g.town,side:ent});
  for(let yy=ey-1;yy<=ey+1;yy++)open.push([ent==='W'?0:W-1,yy]);m.entries['T'+g.town]={x:(ent==='W'?3:W-4)*TS+16,y:ey*TS+20};}
 else{const y0=ent==='N'?0:H-3;for(let yy=y0;yy<y0+3;yy++)for(let xx=ex-1;xx<=ex+1;xx++)setT(m,xx,yy,floor);m.exits.push({x:ex-1,y:ent==='N'?0:H-1,w:3,h:1,to:'T'+g.town,side:ent});
  for(let xx=ex-1;xx<=ex+1;xx++)open.push([xx,ent==='N'?0:H-1]);m.entries['T'+g.town]={x:ex*TS+16,y:(ent==='N'?3:H-4)*TS+20};}
 {const dv={W:[1,0],E:[-1,0],N:[0,1],S:[0,-1]}[ent];const sx0=ent==='W'?0:ent==='E'?W-1:ex,sy0=ent==='N'?0:ent==='S'?H-1:ey;
  for(let k=0;k<10;k++)for(let o=-1;o<=1;o++){const x=sx0+dv[0]*k+(dv[0]?0:o),y=sy0+dv[1]*k+(dv[1]?0:o);if(k===0||(x>0&&y>0&&x<W-1&&y<H-1))setT(m,x,y,floor);}}
 let d=bfs(m,open);
 if(g.boss){let far=0,fk=0;for(let i=0;i<W*H;i++)if(d[i]>far){far=d[i];fk=i;}const bx=clamp(fk%W,6,W-7),by=clamp((fk/W)|0,5,H-6);for(let yy=by-4;yy<=by+4;yy++)for(let xx=bx-5;xx<=bx+5;xx++)setT(m,xx,yy,floor);d=bfs(m,open);}
 for(let i=0;i<W*H;i++)if(d[i]<0&&!BLOCK[m.tiles[i]])m.tiles[i]=dg?TL.WALL:obs;
 m.entDist=d;let far=0,fk=0;
 for(let i=0;i<W*H;i++){if(d[i]>12&&!BLOCK[m.tiles[i]])m.spawns.push([(i%W)*TS+16,((i/W)|0)*TS+20]);if(d[i]>far){far=d[i];fk=i;}}
 if(g.boss)m.bossPt={x:(fk%W)*TS+16,y:((fk/W)|0)*TS+20};
 decorate(m,rng,true);m.spawns=m.spawns.filter(([sx,sy])=>!BLOCK[tAt(m,Math.floor(sx/TS),Math.floor(sy/TS))]);
 return m;}

// ---------- 맵 그리기(캐시) ----------
function buildCache(m){const th=Object.assign(THM(m.theme),m.vibe&&m.vibe.th||{});const cv=document.createElement('canvas');cv.width=m.w*TS;cv.height=m.h*TS;const c=cv.getContext('2d');const rng=mulberry(m.key.charCodeAt(1)*999+7);
 for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)drawTileBase(c,m,x,y,th,rng);
 const PR={};(m.props||[]).forEach(p=>(PR[p[1]]=PR[p[1]]||[]).push(p));
 for(let y=0;y<m.h;y++){for(let x=0;x<m.w;x++)drawTileObj(c,m,x,y,th,rng);(PR[y]||[]).forEach(p=>drawProp(c,p[2],p[0],p[1]));m.buildings.filter(b=>b.y+b.h-1===y).forEach(b=>{c.filter=m.vibe&&m.vibe.bf||'none';drawBuilding(c,b);c.filter='none';});}
 if(m.decor){for(const[x,y,k]of m.decor){const px=x*TS+16,py=y*TS+20;
  const dimg=IMG[['deco_0','deco_1','chest_0','deco_3'][k]];if(dimg){const w=k===3?40:k===1?30:34,h=w*dimg.height/dimg.width;c.drawImage(dimg,px-w/2,py+6-h,w,h);continue;}
  if(k===0){c.strokeStyle='#ddd6c0';c.lineWidth=3;c.beginPath();c.moveTo(px-8,py-2);c.lineTo(px+8,py+3);c.moveTo(px-6,py+4);c.lineTo(px+7,py-4);c.stroke();E(c,px+9,py-5,4,3.5,'#e8e2cc');}
  else if(k===1){E(c,px,py-2,7,6,'#e8e2cc');E(c,px-2.5,py-3,1.8,2,'#222');E(c,px+2.5,py-3,1.8,2,'#222');}
  else if(k===2){c.fillStyle='#6a4522';c.fillRect(px-10,py-10,20,14);c.fillStyle='#d4af37';c.fillRect(px-10,py-5,20,2);c.fillRect(px-2,py-8,4,5);}
  else{c.fillStyle='rgba(120,20,20,.35)';c.beginPath();c.ellipse(px,py,10,5,0,0,7);c.fill();}}}
 if(m.banner&&IMG.obj_banner){const b=m.banner,im=IMG.obj_banner,h=56,w=h*im.width/im.height;c.drawImage(im,b.x+16-w/2,b.y+16-h,w,h);}
 else if(m.banner){const b=m.banner;c.fillStyle='#4a2a14';c.fillRect(b.x-2,b.y-30,4,46);c.fillStyle='#8a1e2a';c.fillRect(b.x+2,b.y-30,30,24);c.fillStyle='#ffd23f';c.font='bold 14px sans-serif';c.textAlign='center';c.fillText('🏰',b.x+17,b.y-12);}
 if(m.fountain&&(IMG['fnt_t'+m.ti]||IMG.obj_fountain)){const f=m.fountain,im=IMG['fnt_t'+m.ti]||(m.vibe?fimg(IMG.obj_fountain,m.vibe.ff):IMG.obj_fountain),nf=!!IMG['fnt_t'+m.ti],w=nf?190:150,h=w*im.height/im.width;if(nf){const rd=IMG['road_t'+m.ti]||(IMG.tile_road&&fimg(IMG.tile_road,m.vibe?m.vibe.rf:'none'));for(let yy=-2;yy<2;yy++)for(let xx=-2;xx<2;xx++){const px=f.x+xx*TS,py=f.y+yy*TS;if(rd){const k=rd.width/256,sw=TS*k;c.drawImage(rd,(px*k)%rd.width,(py*k)%rd.height,Math.min(sw,rd.width-(px*k)%rd.width),Math.min(sw,rd.height-(py*k)%rd.height),px,py,TS,TS);}else{c.fillStyle='#bc9c68';c.fillRect(px,py,TS,TS);}}}c.drawImage(im,f.x-w/2,nf?f.y+2*TS+10-h:f.y+30-h,w,h);}
 else if(m.fountain){const f=m.fountain;E(c,f.x,f.y,40,34,'#8a8a92');E(c,f.x,f.y,34,28,'#4a90c8');E(c,f.x,f.y-4,10,8,'#b0b0b8');E(c,f.x,f.y-12,4,10,'#bfe6ff');}
 if(m.home)homeArt(c,m);m.cache=cv;
 const mc=document.createElement('canvas');mc.width=m.w*2;mc.height=m.h*2;const x2=mc.getContext('2d');
 for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const t=tAt(m,x,y);x2.fillStyle=t===TL.ROAD||t===TL.BRIDGE?'#c9a96e':t===TL.WATER?'#3a7ab8':t===TL.LAVA?'#e05010':t===TL.BLD?'#a0603a':BLOCK[t]?'#1e1a16':m.kind==='dungeon'?'#5a5660':'#4a7a3a';x2.fillRect(x*2,y*2,2,2);}
 m.mini=mc;}
function drawTileBase(c,m,x,y,th,rng){const t=tAt(m,x,y),px=x*TS,py=y*TS,dg=m.kind==='dungeon';
 const tex=(ov)=>{const k=ov.width/256,sw=TS*k,sx=(px*k)%ov.width,sy=(py*k)%ov.height;c.drawImage(ov,sx,sy,Math.min(sw,ov.width-sx),Math.min(sw,ov.height-sy),px,py,TS,TS);};
 const ground=()=>{const V=m.vibe,ov=V?(IMG['tile_t'+m.ti]||(IMG[V.tile]&&fimg(IMG[V.tile],V.f))):IMG['tile_'+m.theme];if(ov){tex(ov);return;}
  c.fillStyle=dg?(rng()<.5?th.floor:th.floor2):(rng()<.5?th.base:th.base2);c.fillRect(px,py,TS,TS);
  if(!dg&&!th.plain){c.strokeStyle='rgba(0,0,0,.09)';c.lineWidth=1;for(let i=0;i<3;i++){const gx=px+rng()*TS,gy=py+rng()*TS;c.beginPath();c.moveTo(gx,gy);c.lineTo(gx+1,gy-4);c.stroke();}}
  else{c.fillStyle=dg?'rgba(0,0,0,.14)':'rgba(0,0,0,.06)';for(let i=0;i<2;i++)c.fillRect(px+rng()*TS,py+rng()*TS,2+rng()*3,2);}};
 switch(t){
  case TL.ROAD:case TL.BRIDGE:{if(t===TL.BRIDGE&&IMG.tile_bridge){tex(IMG.tile_bridge);break;}if(t===TL.BRIDGE){c.fillStyle='#8a6a42';c.fillRect(px,py,TS,TS);c.fillStyle='#6a4e2e';for(let i=0;i<4;i++)c.fillRect(px,py+i*8,TS,1.5);break;}
   const ov=m.vibe?(IMG['road_t'+m.ti]||(IMG.tile_road&&fimg(IMG.tile_road,m.vibe.rf))):IMG.tile_road;if(ov){tex(ov);break;}c.fillStyle=th.road;c.fillRect(px,py,TS,TS);c.fillStyle=th.road2;for(let i=0;i<3;i++)c.fillRect(px+rng()*28,py+rng()*28,3,2);break;}
  case TL.WATER:{const lk=m.vibe&&m.vibe.liq||{swamp:'swamp'}[m.theme]||'water',li=IMG['liq_'+lk];if(li){tex(li);if(tAt(m,x,y-1)!==TL.WATER&&tAt(m,x,y-1)!==TL.BRIDGE){c.fillStyle='rgba(255,255,255,.3)';c.fillRect(px,py,TS,3);}break;}}c.fillStyle=th.water;c.fillRect(px,py,TS,TS);c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1.5;c.beginPath();const wx=px+4+rng()*12,wy=py+8+rng()*16;c.moveTo(wx,wy);c.quadraticCurveTo(wx+5,wy-3,wx+10,wy);c.stroke();
   if(tAt(m,x,y-1)!==TL.WATER&&tAt(m,x,y-1)!==TL.BRIDGE){c.fillStyle='rgba(255,255,255,.35)';c.fillRect(px,py,TS,3);}break;
  case TL.LAVA:if(IMG.liq_lava){tex(IMG.liq_lava);break;}c.fillStyle=th.lava;c.fillRect(px,py,TS,TS);for(let i=0;i<3;i++)E(c,px+4+rng()*24,py+4+rng()*24,3+rng()*3,2+rng()*2,'#ffd04a');break;
  case TL.WALL:if(IMG['wall_'+m.theme]){const wi=IMG['wall_'+m.theme],k=wi.width/256,q=TS*k;c.drawImage(wi,(x%4)*q%wi.width,(y%4)*q%wi.height,q,q,px,py,TS,TS);if(tAt(m,x,y+1)!==TL.WALL&&y+1<m.h){c.fillStyle='rgba(0,0,0,.35)';c.fillRect(px,py+TS-3,TS,3);}break;}c.fillStyle=th.wall;c.fillRect(px,py,TS,TS);if(tAt(m,x,y+1)!==TL.WALL&&y+1<m.h){c.fillStyle=th.wallTop;c.fillRect(px,py+TS-13,TS,13);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(px,py+TS-13,TS,2);c.fillStyle='rgba(255,255,255,.06)';c.fillRect(px+rng()*20,py+TS-10,8,3);}break;
  case TL.SAND:c.fillStyle=th.sand;c.fillRect(px,py,TS,TS);c.fillStyle='rgba(0,0,0,.06)';c.fillRect(px+rng()*28,py+rng()*28,3,2);break;
  default:ground();if(t===TL.FLOWER)for(let i=0;i<3;i++){const cols=['#ff7aa8','#ffe14a','#fff','#b88aff'];E(c,px+4+rng()*24,py+4+rng()*24,2.2,2.2,cols[Math.floor(rng()*4)]);}}}
function drawTileObj(c,m,x,y,th,rng){const t=tAt(m,x,y),px=x*TS,py=y*TS;
 if(t===TL.TREE){const L=m.treeL||TREEIMG[m.theme],k=L?L[(x*7+y*13)%L.length]:'obj_tree',ti=IMG[k];if(ti&&k!=='obj_tree'){const h=k==='tr_birch'?66:58,w=h*ti.width/ti.height;c.drawImage(ti,px+16-w/2,py+31-h,w,h);return;}const ov=IMG.obj_tree;if(ov){c.drawImage(ov,px-8,py-26,48,58);return;}E(c,px+16,py+28,13,4,'rgba(0,0,0,.25)');c.fillStyle='#6a4a2a';c.fillRect(px+13,py+14,6,14);
  const o=rng()*4-2;E(c,px+16+o,py+6,16,14,th.tree);E(c,px+11+o,py+1,10,8,th.tree2);E(c,px+22+o,py+7,8,7,th.tree2);}
 else if(t===TL.PINE){if((x*5+y*3)%3===0&&IMG.tr_snowpine){const ti=IMG.tr_snowpine,h=72,w=h*ti.width/ti.height;c.drawImage(ti,px+16-w/2,py+31-h,w,h);return;}const ov=IMG.obj_pine;if(ov){c.drawImage(ov,px-6,py-30,44,62);return;}E(c,px+16,py+28,11,4,'rgba(0,0,0,.25)');c.fillStyle='#5a3a22';c.fillRect(px+14,py+20,4,9);
  for(let i=0;i<3;i++){c.fillStyle=i%2?th.tree2:th.tree;c.beginPath();c.moveTo(px+16,py-14+i*10);c.lineTo(px+4+i*-2,py+6+i*8);c.lineTo(px+28+i*2,py+6+i*8);c.closePath();c.fill();
   if(th.snowy){c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.moveTo(px+16,py-14+i*10);c.lineTo(px+11,py-6+i*10);c.lineTo(px+21,py-6+i*10);c.closePath();c.fill();}}}
 else if(t===TL.ROCK){const ov=IMG.obj_rock;if(ov){c.drawImage(ov,px,py-6,TS,TS+6);return;}E(c,px+16,py+26,14,4,'rgba(0,0,0,.25)');E(c,px+16,py+17,14,11,th.rock);E(c,px+12,py+12,7,5,'rgba(255,255,255,.18)');}
 else if(t===TL.TOMB){const ov=IMG.obj_tomb;if(ov){c.drawImage(ov,px,py-8,TS,TS+8);return;}E(c,px+16,py+27,12,4,'#2a2a22');c.fillStyle=th.tomb;rr(c,px+9,py+2,14,24,6);c.fill();c.fillStyle='rgba(0,0,0,.35)';c.fillRect(px+15,py+7,2,10);c.fillRect(px+12,py+10,8,2);}
 else if(t===TL.FENCE){c.fillStyle=th.fence;c.fillRect(px,py+2,TS,TS-2);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(px,py+12,TS,2);c.fillRect(px+(y%2?8:20),py+2,2,TS);c.fillStyle='rgba(255,255,255,.12)';c.fillRect(px,py+2,TS,3);}}
function drawBuilding(c,b){const px=b.x*TS,py=b.y*TS,W=b.w*TS,H=b.h*TS,wallY=py+H*0.42;const ov=(b.spec&&IMG['bld_'+b.spec])||(b.type==='house'&&CUR&&CUR.kind==='town'&&CUR.ti!=null&&IMG['bld_house_t'+CUR.ti])||IMG['bld_'+(b.img||b.type)]||((b.type==='home'||b.type==='mapshop')?IMG.bld_house:null);
 if(ov){const dw=W+10,dh=dw*ov.height/ov.width;c.drawImage(ov,px-5,py+H+4-dh,dw,dh);}
 else{c.fillStyle='rgba(0,0,0,.25)';c.fillRect(px+8,py+H-4,W-4,8);
  c.fillStyle=b.wall;c.fillRect(px+4,wallY,W-8,py+H-wallY);c.strokeStyle='rgba(80,55,30,.55)';c.lineWidth=2;c.strokeRect(px+4,wallY,W-8,py+H-wallY);
  c.beginPath();c.moveTo(px+4,wallY+(py+H-wallY)/2);c.lineTo(px+W-4,wallY+(py+H-wallY)/2);c.stroke();
  c.fillStyle=b.roof;c.beginPath();c.moveTo(px-4,wallY+8);c.lineTo(px+14,py-14);c.lineTo(px+W-14,py-14);c.lineTo(px+W+4,wallY+8);c.closePath();c.fill();
  c.fillStyle=shade(b.roof,-0.25);c.fillRect(px-4,wallY+4,W+8,5);c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=1.5;
  for(let i=1;i<5;i++){const yy=py-14+(wallY+6-(py-14))*i/5;c.beginPath();c.moveTo(px+14-18*i/5,yy);c.lineTo(px+W-14+18*i/5,yy);c.stroke();}
  const dxp=b.door.x*TS;[[px+14,1],[px+W-34,1]].forEach(([wx])=>{if(Math.abs(wx+10-(dxp+16))<22)return;c.fillStyle='#ffe9a8';c.fillRect(wx,wallY+14,20,16);c.strokeStyle='#5a3a20';c.lineWidth=2;c.strokeRect(wx,wallY+14,20,16);c.beginPath();c.moveTo(wx+10,wallY+14);c.lineTo(wx+10,wallY+30);c.stroke();});
  c.fillStyle='#4a2e18';rr(c,dxp+7,py+H-28,18,28,7);c.fill();E(c,dxp+21,py+H-14,1.6,1.6,'#ffd23f');}
 if(b.label){const sx=b.door.x*TS+16,sy=wallY-4;c.font='bold 11px sans-serif';const txt=b.icon+' '+b.label;const w=c.measureText(txt).width;
  c.fillStyle='#3a2a18';rr(c,sx-w/2-7,sy-15,w+14,19,5);c.fill();c.strokeStyle='#c8962e';c.lineWidth=1.5;c.stroke();c.fillStyle='#ffe2a8';c.textAlign='center';c.fillText(txt,sx,sy-1);}}
