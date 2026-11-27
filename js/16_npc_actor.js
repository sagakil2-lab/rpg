'use strict';
// =====================================================================
//  NPC 액터 (마을 주민 / 시뮬레이션 NPC 표시)
// =====================================================================
const VNAMES=['한나','토마','베시','오토','리사','고든','미라','펠릭스','넬','브루노','이다','카를'];
function mkVillager(){return{kind:'villager',name:pick(VNAMES),x:0,y:0,r:8,path:null,pi:0,wait:rnd(0,3),face:1,walk:0,moving:false,bubble:'',bubT:0,spd:rnd(34,48),
 look:{layer:{body:pick(NPC_BODIES),cloth:pick(['#c8564a','#4a7ac8','#6aa84f','#c8a84a','#8a5ac8','#d88a3a','#4aa8a0']),hair:'hair_'+ri(1,4),hairTint:pick(['#4a3020','#2a2222','#a86a2a','#d8d0c0','#c8a050']),hat:pick([null,null,'hat_straw','hat_cap']),hand:pick([null,null,'tool_basket'])},body:pick(['#c8564a','#4a7ac8','#6aa84f','#c8a84a','#8a5ac8','#d88a3a','#4aa8a0']),hair:pick(['#4a3020','#222','#a86a2a','#ddd','#c8a050']),hat:pick([null,null,'straw','band']),img:pick(['npc_villager','npc_guard','npc_elder','npc_fisher','npc_priest','npc_smith','npc_kid','npc_mage','npc_merchantf','npc_miner']),h:46,useSheet:R()<0.7}};}
function mkSimActor(n){const L=n.role==='hunter'?{body:'#8a2a2a',cloak:'#5a1a1a',hat:'hood',sword:n.w,img:'npc_hunter'}:n.role==='trader'?{body:'#c8a030',hat:'wide',pack:true,img:'npc_trader'}:{body:'#3a6a9a',apron:'#6a4a2a',hat:'band',hair:'#3a2a1a',img:'npc_crafter'};
 L.layer={body:pick(NPC_BODIES),hair:'hair_'+ri(1,4),hairTint:pick(['#4a3020','#2a2222','#a86a2a','#c8a050']),...(n.role==='trader'?{hat:'hat_wide',back:'back_pack',cloth:'#c8a030'}:n.role==='crafter'?{hat:'hat_band',hand:'tool_hammer',cloth:'#3a6a9a'}:{})};
 const a={kind:'sim',npc:n,name:n.name,x:0,y:0,r:9,path:null,pi:0,wait:rnd(0,2),face:1,walk:0,moving:false,bubble:'',bubT:0,spd:rnd(48,62),look:Object.assign({h:50},L)};
 if(n.role==='hunter'&&n.karma==null)n.karma=rollKarma();
 if(n.role==='hunter'&&!n.cls)n.cls=CLS8[(n.id||0)%8];
 if(n.role==='hunter'&&n.cls==='archer'){a.look.img='npc_archer';a.look.useSheet=true;}
 if(n.role==='hunter'&&(n.cls||'warrior')==='warrior'&&IMG.npc_warrior_sheet){a.look.img='npc_warrior';a.look.useSheet=true;}
 if(n.role==='hunter'&&n.cls==='mage'&&IMG.npc_battlemage_sheet){a.look.img='npc_battlemage';a.look.useSheet=true;}
 if(n.role==='hunter'&&n.cls==='mage'){a.look.layer.hand='var_staff';a.look.staff=1;}
 if(n.role==='hunter'&&n.cls==='priest'){a.look.img=IMG.npc_healer_sheet?'npc_healer':'npc_priest';a.look.useSheet=true;}
 if(n.role==='hunter'&&n.cls==='knight'){a.look.img=IMG.npc_knight_sheet?'npc_knight':'npc_guard';a.look.useSheet=true;}
 if(n.role==='hunter'&&(n.cls==='assassin'||n.cls==='summoner')&&IMG['npc_'+n.cls+'_sheet']){a.look.img='npc_'+n.cls;a.look.useSheet=true;}
 {const pk=promoK(n);if(pk){a.look.img='npc_'+pk;a.look.useSheet=true;a.look.h=54;}}
 if((CUR.kind!=='town'||CUR.invaded)&&n.role==='hunter')mkFighter(a,n);
 return a;}
function huntCap(){const g=GROUNDS[CUR.gi];if(!g)return 4;return g.lv<=8?3:g.lv<=25?4:5;}
function reconcile(initial){if(!CUR)return;let want;
 if(CUR.raid)want=((CUR.leg?G.leg:G.rift)||{party:[]}).party.map(id=>G.npcs.find(n=>n.id===id)).filter(Boolean);
 else if(CUR.kind==='town')want=CUR.home?[]:G.npcs.filter(n=>n.node===CUR.ti);else{want=G.npcs.filter(n=>n.role==='hunter'&&n.node===(CUR.pd?DUN:NT+CUR.gi)&&n.state==='hunt'&&(!CUR.pd||(n.dunI|0)===P.dsel));const cap=CUR.pd?6:huntCap();if(want.length>cap)want=want.sort((a,b)=>a.id-b.id).slice(0,cap);}
 const have=new Set(ents.actors.filter(a=>a.npc).map(a=>a.npc));
 for(const n of want){if(have.has(n))continue;const a=mkSimActor(n);
  if(CUR.kind==='town'){if(n.role==='crafter'){const b=CUR.buildings.find(b=>b.shop===n.shop);a.x=b.front.x*TS+16+rnd(-20,20);a.y=(b.front.y+1)*TS;}
   else if(initial||!CUR.exits.length){const[tx,ty]=pick(CUR.roadTiles);a.x=tx*TS+16;a.y=ty*TS+20;}else{const e=CUR.entries[pick(Object.keys(CUR.entries).filter(k=>k[0]==='G'))];a.x=e.x;a.y=e.y;}}
  else if(CUR.raid){a.x=P.x+rnd(-40,40);a.y=P.y+rnd(-10,30);const q=nearestOpen(CUR,a.x,a.y);a.x=q.x;a.y=q.y;a.bubble=pick(['보스에게 돌격!','한꺼번에 몰아쳐!','뒤는 맡겨!','저 녀석만 잡으면 끝이다!']);a.bubT=2.5;}
  else{if(initial){const p=pick(CUR.spawns);a.x=p[0];a.y=p[1];}else{const e=CUR.entries['T'+(CUR.pd?0:GROUNDS[CUR.gi].town)];a.x=e.x;a.y=e.y;}}
  ents.actors.push(a);}
 for(const a of ents.actors)if(a.npc&&!want.includes(a.npc)&&!a.leaving){a.leaving=true;a.path=null;a.bubble=a.npc.state==='travel'&&a.npc.role!=='crafter'?(a.fighter?'이제 돌아가야겠어.':`${NODES[a.npc.to].name}(으)로 떠난다!`):'';a.bubT=a.bubble?3:0;}}
function followDist(a,dist,dt){const tx=Math.floor(a.x/TS),ty=Math.floor(a.y/TS),k=tx+ty*CUR.w;const d=dist[k];if(d===0)return true;
 let best=null,bd=d<0?1e9:d;for(const[dx,dy]of DIRS){const nx=tx+dx,ny=ty+dy;if(nx<0||ny<0||nx>=CUR.w||ny>=CUR.h)continue;const v=dist[nx+ny*CUR.w];if(v>=0&&v<bd){bd=v;best=[nx,ny];}}
 if(!best){return d<0;}stepToward(a,best[0]*TS+16,best[1]*TS+18,a.spd*1.2,dt);a.moving=true;a.walk+=dt*10;return false;}
