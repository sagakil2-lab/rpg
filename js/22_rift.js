'use strict';
// =====================================================================
//  차원 균열 레이드
// =====================================================================
const RIFT_H=18;
function riftPt(){const f=CUR.fountain||{x:18*TS,y:14*TS};return{x:f.x+7*TS,y:f.y-TS*0.5};}
function riftTick(silent){if(silent||typeof P==='undefined'||!P||!P.lv)return;const r=G.rift;
 if(!r){if(G.riftNext==null)G.riftNext=G.hour+20;if(G.hour>=G.riftNext&&R()<0.3)openRiftEvent();return;}
 if(r.state==='open'&&G.hour>=r.deadline){r.state='invade';r.need=Math.round((12+Math.round(r.lv/6))*(r.evil?1.6:1));r.invEnd=G.hour+(r.evil?16:12);r.killed=0;delete MAPS.RAID;
  news(`🚨 ${TOWNS[r.town].name}의 균열이 폭주했다! 몬스터가 마을로 쏟아진다 — 마을 사람들이 무기를 들었다`,'ev');toast(`🚨 ${TOWNS[r.town].name} 침공!`);}
 if(r.state==='invade'){if(!(CUR&&CUR.kind==='town'&&CUR.ti===r.town)){const hs=G.npcs.filter(n=>n.role==='hunter'&&n.node===r.town&&n.state!=='travel'&&n.lv>=r.lv-15).length;r.killed+=Math.round(hs*0.5+R());}
  for(const m of MATS){const s=G.mk[r.town][m.id];s.stock*=0.96;}
  if(r.killed>=r.need)riftEnd(true,'npc');else if(G.hour>=(r.invEnd||r.deadline+12))riftEnd(false);}}
function openRiftEvent(){const cand=TOWNS.filter(t=>t.unlock<=P.lv+3).map(t=>t.id);const town=pick(cand),want=Math.max(P.lv,TOWNS[town].unlock)+ri(0,4);
 const bg=GROUNDS.map((g,i)=>[g,i]).filter(([g])=>g.boss).sort((a,b)=>Math.abs(a[0].lv-want)-Math.abs(b[0].lv-want))[0][1];
 const evil=R()<0.15;G.rift={town,gi:bg,lv:want+(evil?6:0),evil,t0:G.hour,deadline:G.hour+RIFT_H,state:'open',party:[],killed:0,need:0};G.riftNext=G.hour+ri(40,70);delete MAPS.RAID;
 if(evil){news(`😈 ${TOWNS[town].name}에 '악한 균열'이 열렸다! 훨씬 강한 보스가 버티고 있다`,'ev');toast(`😈 악한 균열 발생! (${TOWNS[town].name})`);sfx('rift');return;}sfx('rift');news(`🌀 ${TOWNS[town].name}에 차원 균열 발생! 레이드 보스 「${GROUNDS[bg].boss[0]}」(Lv${want}) — ${RIFT_H}시간 안에 토벌하지 못하면 몬스터가 쏟아진다`,'ev');toast(`🌀 ${TOWNS[town].name}에 균열 발생!`);}
function riftEnd(win,by){const r=G.rift;if(!r)return;G.rift=null;delete MAPS.RAID;G.npcs.forEach(n=>n.party=false);
 if(CUR&&CUR.kind==='town'){CUR.invaded=false;ents.mons.forEach(m=>{if(m.raid&&!m.dead){m.dead=true;m.deadT=0;m.respawn=1e9;burst(m.x,m.y-16,14,'#b46aff',160);}});}
 if(win)news(by==='npc'?`🛡️ ${TOWNS[r.town].name} 주민과 사냥꾼들이 균열 몬스터를 막아냈다`:`🏆 ${TOWNS[r.town].name}의 균열을 닫았다!`,'ev');else news(`💥 ${TOWNS[r.town].name}의 균열이 저절로 닫혔다. 마을이 큰 피해를 입었다`,'ev');}
function nearRift(){const r=G.rift;if(!r||!CUR||CUR.home||CUR.kind!=='town'||r.town!==CUR.ti)return false;const p=riftPt();return Math.hypot(P.x-p.x,P.y-p.y)<60;}
function riftBossPreview(){const r=G.rift,b=mkMon(r.gi,-1,true);raidScale(b,r.lv,true);return b;}
function raidScale(m,lv,boss){const ev=G.rift&&G.rift.evil;m.lv=lv;m.maxhp=m.hp=Math.round((20+lv*14)*(boss?28:1.6)*(ev?(boss?1.8:1.3):1)*1.35);m.atk=(3+lv*2.6)*(boss?2:1.15)*(ev?1.4:1)*1.3;if(ev){m.vt=2;m.el='dark';}m.def=lv*1.3;m.raid=true;if(boss){m.raidBoss=true;m.name=(ev?'😈 ':'🌀 ')+m.name.replace(/^🌀 /,'');m.r*=1.25;m.vt=m.vt||2;}return m;}
const hireCost=n=>Math.round(30+n.lv*18);
function openRift(){G.npcs.forEach(n=>{if(n.role==='hunter'&&!n.cls)n.cls=CLS8[(n.id||0)%8];});const r=G.rift;if(!r){closeModal();return;}const b=riftBossPreview(),left=r.deadline-G.hour,party=r.party.map(id=>G.npcs.find(n=>n.id===id)).filter(Boolean);
 const cands=G.npcs.filter(n=>n.role==='hunter'&&!r.party.includes(n.id)&&n.state!=='travel'&&n.karma>-40&&n.lv<r.lv).sort((a,c)=>(c.node===r.town)-(a.node===r.town)||c.lv-a.lv).slice(0,10);
 openModal(`<h2>${r.evil?'😈 악한 균열':'🌀 차원 균열'} — ${TOWNS[r.town].name} <span class="gold" style="float:right">💰 ${fmt(P.gold)}G</span></h2>
 ${r.state==='open'?`<p class="d"><b>균열 Lv${r.lv}</b> · 남은 시간 <b>${left}시간</b> · 동료는 균열 Lv보다 낮은 사냥꾼만 (최대 4명)</p>`:`<p class="dn">침공 중! 처치 <b>${r.killed}/${r.need}</b> · 보스를 잡아도 끝난다.</p>`}
 <div class="sdet">${icv({t:'egg',gi:r.gi,mi:-1},44)} <b style="font-size:15px">${b.name}</b> <span class="mut">레이드 보스 · 원본 ${GROUNDS[r.gi].name}</span>${statLine(b)}<div class="mut" style="font-size:11.5px">보상: 균열 재료(파편·공허의 결정·차원의 핵), 강화 장비, 장신구, 대량의 골드·경험치</div></div>
 <h3>⚔️ 원정대 (${party.length}/4)</h3><div class="ngrid">${party.map(n=>ncard(n,{top:`<span class="nx" onclick="event.stopPropagation();riftKick(${n.id})">✕</span>`})).join('')||'<span class="mut e">아직 아무도 없다. 혼자 들어가도 된다.</span>'}</div>
 ${party.length<4?`<h3>🍺 초대할 수 있는 사냥꾼 <span class="mut" style="font-size:11px">— 이 마을에 있는 사람이 위에, 고용비는 레벨에 비례</span></h3><div class="ngrid">${cands.map(n=>{const c=hireCost(n);if(!n.cls)n.cls=CLS8[(n.id||0)%8];return ncard(n,{sub:`<div class="mut" style="font-size:9.5px">${n.node===r.town?'📍여기':NODES[n.node]?NODES[n.node].name:''}</div>`,btm:`<button class="btn s" ${P.gold<c?'disabled':''} onclick="event.stopPropagation();riftHire(${n.id})">${fmt(c)}G</button>`});}).join('')}</div>`:''}
 <div class="skd" id="npcc" style="margin-top:8px;--bc:#c8962e"><span class="mut">이름을 누르면 능력과 스킬이 보인다</span></div>
 <button class="btn w" onclick="enterRaid()">⚔️ 균열 속으로 진입${party.length?` (원정대 ${party.length}명)`:' (혼자)'}</button>
 <button class="btn w g" onclick="closeModal()">나가기</button>`,true);paintIcons($('#modal'));}
function npcStat(n){const c=n.cls||'warrior';let hp=Math.round((90+n.lv*24+ADEF[n.a]*5+HHP[n.h||0])*(c==='warrior'?1.25:0.85)),atk=(10+n.lv*3.2+WATK[n.w]*1.3)*(c==='mage'?1.15:1),def=3+n.lv*1.2+ADEF[n.a];
 if(c==='priest')atk*=0.6;if(c==='knight'){hp=Math.round(hp*1.45);def*=1.6;atk*=0.8;}if(promoK(n)){hp=Math.round(hp*1.25);atk*=1.2;def*=1.15;}return{hp,atk:Math.round(atk),def:Math.round(def)};}
function npcCard(id){const n=G.npcs.find(x=>x.id===id);if(!n)return;const c=n.cls||'warrior',st=npcStat(n),K=NCLS[c],el=$('#npcc');if(!el)return;
 el.innerHTML=`<div class="skdh"><span style="width:64px;height:64px;display:inline-flex;align-items:flex-end;justify-content:center;background:radial-gradient(circle at 50% 70%,${promoK(n)?'#ffd24a55':(NCC[c]||'#c8962e')+'55'},transparent 70%);border-radius:10px">${npcImg(n,64)}</span><div><b style="font-size:15px">${n.name}</b> <span class="mut">Lv${n.lv} ${clsNm(n)}</span>${promoK(n)?`<span class="chip" style="border:1px solid #ffd24a;color:#ffd24a;margin-left:4px">전직</span>`:''}<div class="mut" style="font-size:11.5px">${NCLSD[c]}${promoK(n)?' '+PROMO[c][2]+'.':PROMO[c]&&IMG['npc_'+PROMO[c][0]+'_sheet']?` (Lv${PROMO_LV}에 ${PROMO[c][1]}(으)로 전직)`:''}</div></div></div>
 <div class="eqst"><div>HP<b>${fmt(st.hp)}</b></div><div>공격<b>${st.atk}</b></div><div>방어<b>${st.def}</b></div><div>무기<b style="font-size:11px">${WNAME[n.w]}</b></div></div>
 <div class="nb" style="margin-top:6px">${K[2].map(s=>`<span class="chip" style="border:1px solid #c8962e">${s}</span>`).join('')}</div>`;}
function riftHire(id){const r=G.rift,n=G.npcs.find(x=>x.id===id);if(!r||!n||r.party.length>=4)return;if(n.lv>=r.lv){toast(`균열 Lv${r.lv}보다 낮은 동료만 데려갈 수 있다`);return;}const c=hireCost(n);if(P.gold<c)return;P.gold-=c;n.gold+=c;r.party.push(id);n.party=true;if(n.state==='hunt'||n.state==='rest'||n.state==='idle'){n.node=r.town;n.state='rest';n.timer=99;}toast(`${n.name} 원정대 합류!`);openRift();}
function riftKick(id){const r=G.rift;r.party=r.party.filter(x=>x!==id);const n=G.npcs.find(x=>x.id===id);if(n){n.party=false;n.timer=1;}openRift();}
function genRaid(){const r=G.rift,g=GROUNDS[r.gi],W=36,H=30,rng=mulberry(5000+r.t0);const m=newMap('RAID','균열 투기장 — '+g.boss[0],'dungeon',W,H,r.evil?'lava':pick(['lava','grave','cave']));m.gi=r.gi;m.raid=true;
 const cx=18,cy=12;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const e=((x-cx)/15)**2+((y-cy)/10.5)**2;let t=e<1?TL.FLOOR:TL.WALL;if(x>=16&&x<=20&&y>cy&&y<H-1)t=TL.FLOOR;if(x===0||y===0||x===W-1)t=TL.WALL;setT(m,x,y,t);}
 for(const[px,py]of[[8,8],[28,8],[9,16],[27,16]])for(let yy=0;yy<2;yy++)for(let xx=0;xx<2;xx++)setT(m,px+xx,py+yy,TL.ROCK);
 if(m.theme==='lava')for(let i=0;i<14;i++){const a=rng()*6.28,x=Math.round(cx+Math.cos(a)*13.2),y=Math.round(cy+Math.sin(a)*9);if(!(x>=15&&x<=21&&y>cy))setT(m,x,y,TL.LAVA);}
 for(let x=17;x<=19;x++)setT(m,x,H-1,TL.FLOOR);m.exits.push({x:17,y:H-1,w:3,h:1,to:'T'+r.town,side:'S'});m.entries['T'+r.town]={x:18*TS+16,y:(H-4)*TS+20};
 const d=bfs(m,[[17,H-1],[18,H-1],[19,H-1]]);m.entDist=d;for(let i=0;i<W*H;i++)if(d[i]>6&&!BLOCK[m.tiles[i]])m.spawns.push([(i%W)*TS+16,((i/W)|0)*TS+20]);
 m.bossPt={x:cx*TS+16,y:(cy-3)*TS+20};m.torches=[];for(let k=0;k<12;k++){const a=k/12*6.28;const x=Math.round(cx+Math.cos(a)*15.6),y=Math.round(cy+Math.sin(a)*11);if(tAt(m,x,y)===TL.WALL&&!blocked(m,x,y+1))m.torches.push([x*TS+16,y*TS+18]);}
 return m;}
function genLegMap(){const r=G.leg,g=GROUNDS[r.gi],W=36,H=30,rng=mulberry(5000+r.t0);const m=newMap('LEG','전설의 둥지 — '+r.name,'dungeon',W,H,r.theme);m.gi=r.gi;m.raid=true;m.leg=true;
 const cx=18,cy=12;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const e=((x-cx)/15)**2+((y-cy)/10.5)**2;let t=e<1?TL.FLOOR:TL.WALL;if(x>=16&&x<=20&&y>cy&&y<H-1)t=TL.FLOOR;if(x===0||y===0||x===W-1)t=TL.WALL;setT(m,x,y,t);}
 for(const[px,py]of[[8,8],[28,8],[9,16],[27,16]])for(let yy=0;yy<2;yy++)for(let xx=0;xx<2;xx++)setT(m,px+xx,py+yy,TL.ROCK);
 if(m.theme==='lava')for(let i=0;i<14;i++){const a=rng()*6.28,x=Math.round(cx+Math.cos(a)*13.2),y=Math.round(cy+Math.sin(a)*9);if(!(x>=15&&x<=21&&y>cy))setT(m,x,y,TL.LAVA);}
 for(let x=17;x<=19;x++)setT(m,x,H-1,TL.FLOOR);m.exits.push({x:17,y:H-1,w:3,h:1,to:'T'+r.town,side:'S'});m.entries['T'+r.town]={x:18*TS+16,y:(H-4)*TS+20};
 const d=bfs(m,[[17,H-1],[18,H-1],[19,H-1]]);m.entDist=d;for(let i=0;i<W*H;i++)if(d[i]>6&&!BLOCK[m.tiles[i]])m.spawns.push([(i%W)*TS+16,((i/W)|0)*TS+20]);
 m.bossPt={x:cx*TS+16,y:(cy-3)*TS+20};m.torches=[];for(let k=0;k<12;k++){const a=k/12*6.28;const x=Math.round(cx+Math.cos(a)*15.6),y=Math.round(cy+Math.sin(a)*11);if(tAt(m,x,y)===TL.WALL&&!blocked(m,x,y+1))m.torches.push([x*TS+16,y*TS+18]);}
 return m;}
function enterRaid(){if(!G.rift)return;closeModal();delete MAPS.RAID;transition('RAID','T'+G.rift.town);news('🌀 차원 균열 속으로 들어갔다','me');}
function raidSpawn(m){const r=G.rift;const b=raidScale(mkMon(r.gi,-1,true),r.lv,true);b.x=b.hx=m.bossPt.x;b.y=b.hy=m.bossPt.y;b.aggroT=1e9;ents.mons.push(b);}
function riftVictory(m){const r=G.rift;if(!r)return;wkEv('rift');const p0=ents.picks.length,pk=(kind,o)=>ents.picks.push(Object.assign({x:m.x,y:m.y,vx:0,vy:0,z:0,vz:130,kind,t:0},o));
 const[sh,vo,co]=RIFTM,X=r.evil?2:1;for(let i=0;i<ri(3,4)*X;i++)pk('mat',{id:sh});for(let i=0;i<ri(1,2)*X;i++)pk('mat',{id:vo});if(R()<(r.evil?0.8:0.45))pk('mat',{id:co});if(r.evil){if(R()<0.5)pk('gear',{item:plusItem(makeItem(pick(['w','a']),5,1,3),plusOf(r.lv)+2)});else pk('egg',{gi:r.gi,mi:-1});}
 pk('gold',{amt:Math.round(r.lv*rnd(30,45))});const t=clamp(lvTier(r.lv)+1,1,5);if(R()<0.5)pk('gear',{item:plusItem(makeItem(pick(['w','a','h','b']),t,0.8),plusOf(r.lv)+1)});else pk('gear',{item:plusItem(makeItem(pick(['r','n']),3,0.6),plusOf(r.lv))});
 if(R()<0.25)pk('core',{gi:r.gi});scatterPicks(p0);
 const exp=Math.round((5+r.lv*4)*15);gainExp(exp);floatT(P.x,P.y-70,`+${fmt(exp)} EXP`,'#7fe0ff',14,2);
 r.party.forEach(id=>{const n=G.npcs.find(x=>x.id===id);if(n){n.gold+=r.lv*30;n.exp+=r.lv*200;}});
 addDia(r.evil?40:15,'균열 보스 토벌');cam.shake=16;toast(`🏆 레이드 보스 ${m.name} 토벌!`);questEv('rift');riftEnd(true,'player');}
function riftUpdate(dt){const r=G.rift;if(!CUR||CUR.kind!=='town'||CUR.home){return;}
 const inv=!!(r&&r.state==='invade'&&r.town===CUR.ti);CUR.invaded=inv;if(!inv)return;
 for(const a of ents.actors){if(a.fighter||a.remove||a.leaving||a.kind==='story')continue;if(a.npc&&a.npc.role==='hunter'){mkFighter(a,a.npc);a.bubble=pick(['마을을 지켜라!','덤벼라, 괴물들!','사냥꾼들, 모여!']);a.bubT=2;}else a.flee=true;}
 r.spT=(r.spT||0)-dt;const alive=ents.mons.filter(m=>!m.dead).length;
 if(r.spT<=0&&alive<=(r.evil?4:2)){r.wave=(r.wave||0)+1;r.spT=r.evil?6:9;const p=riftPt(),W=r.wave,ev=r.evil?1.5:1;
  const grp=[[Math.round((6+W)*ev),r.lv-3,0],[Math.round((2+Math.floor(W/2))*ev),r.lv,1]];if(W>=2||r.evil)grp.push([W>=4||r.evil?2:1,r.lv+2,2]);
  grp.forEach(([n,lv,tier])=>{for(let i=0;i<n;i++){const m=raidScale(mkMon(r.gi,-1,false),Math.max(1,lv),false);if(tier>=1){m.elite=true;m.maxhp=m.hp=Math.round(m.hp*(tier===2?4:2));m.atk*=tier===2?1.6:1.25;m.r*=tier===2?1.35:1.1;if(tier===2){m.name='균열 대장 '+m.name;m.vt=3;}}
   const a=R()*6.28,rr=rnd(10,60);m.x=p.x+Math.cos(a)*rr;m.y=p.y+Math.sin(a)*rr*0.6;const q0=nearestOpen(CUR,m.x,m.y);m.x=q0.x;m.y=q0.y;const q=pick(CUR.roadTiles);m.hx=q[0]*TS+16;m.hy=q[1]*TS+20;m.aggroT=6;ents.mons.push(m);}});
  burst(p.x,p.y-20,40,'#b46aff',260);cam.shake=10;toast(`🌀 침공 ${W}차 웨이브!`);}
 ents.mons=ents.mons.filter(m=>!m.dead||m.deadT<1);}
function drawRift(c,t){const r=G.rift;if(!r||!CUR||CUR.home||CUR.kind!=='town'||r.town!==CUR.ti)return;const p=riftPt(),inv=r.state==='invade';
 c.save();c.translate(p.x,p.y-30);for(let i=0;i<5;i++){c.save();c.rotate(t*(1+i*0.4)*(i%2?-1:1));c.scale(1,1.5);const g=c.createRadialGradient(0,0,2,0,0,30-i*4);g.addColorStop(0,r.evil?'rgba(40,0,20,.95)':inv?'rgba(255,90,60,.9)':'rgba(220,170,255,.9)');g.addColorStop(1,'rgba(60,0,120,0)');c.fillStyle=g;c.beginPath();c.ellipse(0,0,30-i*4,18-i*2,0.6*i,0,7);c.fill();c.restore();}
 c.strokeStyle=r.evil?'rgba(255,30,60,.95)':inv?'rgba(255,120,80,.8)':'rgba(200,140,255,.8)';c.lineWidth=r.evil?5:3;c.beginPath();c.ellipse(0,0,22+Math.sin(t*3)*2,34+Math.sin(t*3)*3,0,0,7);c.stroke();c.restore();
 if(R()<0.4)ents.parts.push({x:p.x+rnd(-20,20),y:p.y-30+rnd(-30,30),vx:rnd(-20,20),vy:rnd(-40,-10),gr:0,life:0,max:0.6,col:inv?'#ff7a5a':'#c89aff',s:rnd(1.5,3)});
 const txt=inv?`🚨 ${r.evil?'악한 ':''}균열 폭주 ${r.killed}/${r.need} · ${Math.max(0,(r.invEnd||0)-G.hour)}시간 후 소멸`:`${r.evil?'😈 악한 균열':'🌀 차원 균열'} Lv${r.lv} · ${Math.max(0,r.deadline-G.hour)}시간`;c.font='bold 11px sans-serif';c.textAlign='center';c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.8)';c.strokeText(txt,p.x,p.y-78);c.fillStyle=inv?'#ff9a7a':'#e0c0ff';c.fillText(txt,p.x,p.y-78);}
