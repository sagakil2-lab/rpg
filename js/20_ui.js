'use strict';
// =====================================================================
//  UI — 건물 / 가방 / 소식
// =====================================================================
let curBld=null;
function openModal(h,wide){$('#modal').innerHTML=`<div class="card ${wide?'wide':''}">${h}</div>`;$('#modal').classList.add('on');paused=true;input.atk=false;}
function closeModal(){$('#modal').classList.remove('on');paused=false;curBld=null;}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
function openBuilding(b){curBld=b;const ti=CUR.ti;if(b.type==='arena'){openMons('a');return;}
 if(b.type==='mat'){const si=b.shop,mine=Object.keys(P.bag).map(Number).sort((a,c)=>MATS[a].tier-MATS[c].tier);let tot=0;mine.forEach(id=>{let st=G.mk[ti][id].stock;for(let i=0;i<P.bag[id];i++){tot+=sellP(ti,id,st);st++;}});
  openModal(`<h2>📦 ${SHOPS[si].name}</h2><p class="d">많이 팔수록 값이 떨어진다.</p>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><h3 style="margin:0">내 재료 (${pBag()}/${P.cap}칸)</h3>${mine.length?`<button class="btn s" onclick="sellAllP()">전부 판매 ${fmt(tot)}G</button>`:''}</div>
  ${mine.length?`<table><tr><th>재료</th><th>수량</th><th>단가</th><th></th></tr>${mine.map(id=>`<tr><td>${MATS[id].name}${MATS[id].rare?' ✨':''}</td><td>${P.bag[id]}</td><td>${sellP(ti,id)}G</td><td><button class="btn s g" onclick="sellP1(${id},1)">1개</button> <button class="btn s" onclick="sellP1(${id},${P.bag[id]})">전부</button></td></tr>`).join('')}</table>`:'<p class="d">팔 재료가 없다. 사냥터에서 재료를 모아 오자.</p>'}
  <button class="btn w g" onclick="closeModal()">나가기</button>`);}
 else if(b.type==='craft'){const si=b.shop,crafters=G.npcs.filter(n=>n.role==='crafter'&&n.shop===si);syncShop(si);
  const row=cid=>{const c=CB[cid],s=G.cs[si][cid],p=cPrice(si,cid);const recipe=`<span class="mut" style="font-size:11px">재료: ${c.recIds.map(([mid,q])=>`<span class="${G.mk[ti][mid].stock>=q?'up':'dn'}">${MATS[mid].name}×${q}</span>`).join(' ')}</span>`;
   if(c.type==='potion')return`<div class="icard">${icv({t:'pot',id:cid},44)}<div class="ib"><b>${c.name}</b> <span class="mut">${c.stat} · 재고 ${Math.floor(s.stock)} · 보유 ${P.pot[cid]}</span><br>${recipe}<div style="margin-top:4px"><button class="btn s" ${s.stock<1||P.gold<p?'disabled':''} onclick="buyC(${si},'${cid}')">${s.stock<1?'품절':fmt(p)+'G 구입'}</button></div></div></div>`;
   const list=G.shopItems[si+'_'+cid]||[];
   return`<div style="margin:8px 0 2px"><b>${c.name}</b> <span class="mut">기본 ${c.stat} · 요구 Lv${c.lvReq} · 재고 ${list.length}</span> ${recipe}</div>`+(list.length?`<div class="icards">${list.map(it=>{const pr=p+Math.round(p*it.r*0.35);return itemCard(it,`<button class="btn s" style="margin-top:4px" ${P.gold<pr||c.lvReq>P.lv?'disabled':''} onclick="buyItem(${si},'${cid}',${it.uid})">${c.lvReq>P.lv?`Lv${c.lvReq} 필요`:fmt(pr)+'G 구입'}</button>`);}).join('')}</div>`:`<div class="mut" style="font-size:12px">품절 — 장인이 재료를 구하면 다시 만든다.</div>`);};
  const TABS=[['w','⚔️ 무기'],['a','🛡️ 갑옷'],['h','⛑️ 투구'],['b','👢 장화'],['p','🧪 물약']].filter(([k])=>SHOPS[si].items.some(cid=>(SLOTK[CB[cid].type]||'p')===k));if(TABS.some(([k])=>k!=='p'))TABS.push(['x','✨ 특수 제작']);TABS.push(['o','📝 주문 제작']);TABS.push(['s','💰 장비 판매']);
  if(!TABS.some(([k])=>k===SHOPTAB.v))SHOPTAB.v=TABS[0][0];const shown=SHOPS[si].items.filter(cid=>(SLOTK[CB[cid].type]||'p')===SHOPTAB.v);
  const cnt=k=>k==='o'?((P.orders||[]).filter(o=>o.ready<=G.hour).length||''):k==='x'?'':k==='s'?sellable().length:SHOPS[si].items.filter(cid=>(SLOTK[CB[cid].type]||'p')===k).reduce((a,cid)=>a+(CB[cid].type==='potion'?Math.floor(G.cs[si][cid].stock):(G.shopItems[si+'_'+cid]||[]).length),0);
  openModal(`<h2>⚒️ ${SHOPS[si].name} <span class="gold" style="float:right">💰 ${fmt(P.gold)}G</span></h2><p class="d">▲ 좋아짐 · ▼ 나빠짐</p>
  <h3>장인</h3>${crafters.map(n=>`<div class="news">🔨 <b>${n.name}</b> <span class="mut">제작 ${n.made}회 · ${n.status||'작업 중'}</span></div>`).join('')}
  <div class="tabs">${TABS.map(([k,n])=>`<button class="tab ${SHOPTAB.v===k?'on':''}" onclick="SHOPTAB.v='${k}';openBuilding(curBld)">${n} <span class="mut">${cnt(k)}</span></button>`).join('')}</div>
  ${SHOPTAB.v==='x'?specialCraft(si)+riftCraft():''}${SHOPTAB.v==='o'?orderPanel(si):''}${SHOPTAB.v==='s'?sellPanel():''}${SHOPTAB.v!=='p'&&SHOPTAB.v!=='x'&&SHOPTAB.v!=='s'&&SHOPTAB.v!=='o'&&eqItem(SHOPTAB.v)?`<div style="margin:6px 0"><span class="mut" style="font-size:11.5px">현재 장착:</span>${itemCard(eqItem(SHOPTAB.v))}</div>`:''}${shown.map(row).join('')}
  <button class="btn w g" onclick="closeModal()">나가기</button>`,true);paintIcons($('#modal'));}
 else if(b.type==='home'){openHome();}
 else if(b.type==='mapshop'){openMapShop();}
 else if(b.type==='portal'){openPortal();}
 else if(b.type==='gacha'){openShop('gacha');}
 else if(b.type==='inn'){const cost=P.lv<5?0:P.lv*3,sc=scrollCost();openModal(`<h2>🛏️ ${b.label}</h2><p class="d">쉬면 HP·MP가 모두 찬다.</p>
  <button class="btn w" ${P.gold<cost?'disabled':''} onclick="restInn(${cost})">휴식하기 (${cost?cost+'G':'무료'})</button>
  <h3>📜 귀환 주문서 <span class="mut" style="font-size:11px">보유 ${P.scroll||0} · 사냥터에서 R키</span></h3><div style="display:flex;gap:6px"><button class="btn s" ${P.gold<sc?'disabled':''} onclick="buyScroll(1)">1장 ${fmt(sc)}G</button><button class="btn s" ${P.gold<sc*5?'disabled':''} onclick="buyScroll(5)">5장 ${fmt(sc*5)}G</button></div><h3>⚒️ 강화 주문서</h3>${[1,2,3].map(g=>`<div style="display:flex;gap:6px;align-items:center;margin:3px 0"><b style="color:${ESCC[g]};flex:1">${escIc(g,22)} ${ESCN[g]} <span class="mut" style="font-size:11px">(+${g*5-4}~+${g*5}) 보유 ${(P.esc||{})[g]||0}</span></b><button class="btn s" ${P.gold<escCost(g)?'disabled':''} onclick="buyEsc(${g},1)">1장 ${fmt(escCost(g))}G</button>${g<3?`<button class="btn s" ${P.gold<escCost(g)*5?'disabled':''} onclick="buyEsc(${g},5)">5장</button>`:''}</div>`).join('')}<button class="btn w g" onclick="closeModal()">나가기</button>`);}
 else if(b.type==='coach'){openModal(`<h2>🐎 역마차 정류장</h2><p class="d">이동하는 동안 시간이 흐른다.</p>
  ${TOWNS.map(T=>{if(T.id===ti)return`<div class="news">${T.icon} <b>${T.name}</b> <span class="mut">(현재 위치)</span></div>`;const h=hoursBetween(ti,T.id),fare=h*4,lock=P.lv<T.unlock;
   return`<div class="news" style="display:flex;align-items:center"><div style="flex:1">${T.icon} <b>${T.name}</b> <span class="mut">${T.desc}</span><br><span class="mut">${h}시간 · ${fare}G</span></div>
   <button class="btn s" ${lock||P.gold<fare?'disabled':''} onclick="coach(${T.id},${h},${fare})">${lock?`🔒 Lv${T.unlock}`:'출발'}</button></div>`;}).join('')}
  <button class="btn w g" onclick="closeModal()">나가기</button>`);}}
function sellP1(id,n){const ti=CUR.ti;n=Math.min(n,P.bag[id]||0);questEv('sell',n);sfx('coin');let tot=0;for(let i=0;i<n;i++){tot+=sellP(ti,id);G.mk[ti][id].stock+=1;}addBag(P.bag,id,-n);P.gold+=tot;toast(`+${fmt(tot)}G`);openBuilding(curBld);}
function sellAllP(){const ti=CUR.ti;let tot=0,c=0;questEv('sell',bagCount(P.bag));sfx('coin');for(const id of Object.keys(P.bag)){const q=P.bag[id];for(let i=0;i<q;i++){tot+=sellP(ti,+id);G.mk[ti][id].stock+=1;}c+=q;}P.bag={};P.gold+=tot;if(c>=10)news(`🧺 ${TOWNS[ti].name}에 재료 ${c}개 판매 +${fmt(tot)}G`,'me');toast(`+${fmt(tot)}G`);openBuilding(curBld);}
function buyC(si,cid){const c=CB[cid],s=G.cs[si][cid],p=cPrice(si,cid);const k=SLOTK[c.type];if(s.stock<1||P.gold<p)return;questEv('buy');sfx('buy');P.gold-=p;s.stock-=1;
 if(c.type==='potion'){P.pot[cid]++;toast(`${c.name} 구입!`);}else{const it=makeItem(k,c.tier,0.1);const before=P.eq[k];gainItem(it,true);news(`🛒 [${RAR[it.r].n}] ${it.name} 구입 — ${itemStats(it).replace(/<[^>]+>/g,'')}`,'me');toast(P.eq[k]!==before?`[${RAR[it.r].n}] ${it.name} 구입·장착!`:`[${RAR[it.r].n}] ${it.name} 구입 — 장비창(G)에서 바꿔 낄 수 있다`);}openBuilding(curBld);}
const GEARK={r:['💍','반지',ACCN.r,i=>''],n:['📿','목걸이',ACCN.n,i=>''],w:['⚔️','무기',WNAME,i=>`공격 +${WATK[i]}`],a:['🛡️','갑옷',ANAME,i=>`방어 +${ADEF[i]}`],h:['⛑️','투구',HNAME,i=>`방어 +${HDEF[i]} · HP +${HHP[i]}`],b:['👢','신발',BNAME,i=>`방어 +${BDEF[i]} · 이동 +${BSPD[i]}%`]};
function gearIcon(cv,it,i0){if(typeof it==='string'){it={k:it,t:i0,r:0,el:'none'};}if(!it)return;const k=it.k,i=it.t,gl=it.el&&it.el!=='none'?ELEM[it.el].c:null;const c=cv.getContext('2d'),W=cv.width,H=cv.height;c.setTransform(1,0,0,1,0,0);c.filter='none';c.shadowBlur=0;c.clearRect(0,0,W,H);
 {const fr=IMG['ui_rar_'+Math.min(3,it.r)];if(fr){if(it.r===4){c.save();c.filter='hue-rotate(-40deg) saturate(1.6)';c.drawImage(fr,0,0,W,H);c.restore();}else c.drawImage(fr,0,0,W,H);}}
 if(it.r>0){const g=c.createRadialGradient(W/2,H/2,4,W/2,H/2,W*0.6);g.addColorStop(0,RAR[it.r].c+(it.r>=3?'88':'55'));g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,W,H);}
 c.save();c.translate(W/2,H/2);c.scale(0.8,0.8);c.translate(-W/2,-H/2);if(gl){c.shadowColor=gl;c.shadowBlur=10;}
 const fit=(im,sx,sy,sw,sh,pad=6)=>{const f=Math.min((W-pad*2)/sw,(H-pad*2)/sh);const w=sw*f,h=sh*f;c.drawImage(im,sx,sy,sw,sh,(W-w)/2,(H-h)/2,w,h);};
 if((k==='r'||k==='n')){const im=IMG['acc_'+it.ai];if(im)fit(im,0,0,im.width,im.height,5);if(it.p){c.shadowBlur=0;c.fillStyle='#ffd23f';c.font=`bold ${W*0.24}px sans-serif`;c.textAlign='right';c.fillText('+'+it.p,W-2,H-3);}return;}
 if(it.v&&IMG['var_'+it.v]){const im=IMG['var_'+it.v];if(k==='w'){c.save();c.translate(W/2,H/2);c.rotate(-Math.PI/4);const L=W*1.25,h=L*im.height/im.width;c.drawImage(im,-L/2,-h/2,L,h);c.restore();}else fit(im,0,0,im.width,im.height,5);return;}
 if(it.v&&!IMG['var_'+it.v]){c.font=`${W*0.22}px sans-serif`;c.textAlign='right';c.fillStyle='#ffd98a';c.fillText('★',W-3,H*0.3);}
 if(k==='w'){const im=IMG['wpn_'+i];if(im){c.save();c.translate(W/2,H/2);c.rotate(-Math.PI/4);const L=W*1.25,h=L*im.height/im.width;c.drawImage(im,-L/2,-h/2,L,h);c.restore();}else{c.save();c.translate(W/2,H/2);c.rotate(-Math.PI/4);c.fillStyle=WCOL[i];c.fillRect(-W*0.4,-3,W*0.8,6);c.restore();}return;}
 if(k==='h'){const im=IMG['helm_'+i];if(im&&i>0)fit(im,0,0,im.width,im.height);else{c.font=`${W*0.5}px sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(i?'⛑️':'🙂',W/2,H/2);}return;}
 if(k==='a'&&IMG['arm_'+i]){fit(IMG['arm_'+i],0,0,IMG['arm_'+i].width,IMG['arm_'+i].height,4);return;}
 if(k==='b'&&IMG['boot_'+i]){fit(IMG['boot_'+i],0,0,IMG['boot_'+i].width,IMG['boot_'+i].height,5);return;}
 if(k==='a'){let key=null;for(let q=i;q>=0;q--)if(bodyOK(q)){key='body_a'+q;break;}
  if(key){const im=IMG[key+'_sheet'],fw=im.width/6,fh=im.height/7;fit(im,fw*0.15,fh*0.25,fw*0.7,fh*0.7,2);}else{c.fillStyle=ACOL[i];c.beginPath();c.roundRect?c.roundRect(W*0.25,H*0.2,W*0.5,H*0.6,8):c.rect(W*0.25,H*0.2,W*0.5,H*0.6);c.fill();}return;}
 if(k==='b'){c.fillStyle=BCOL[i];c.strokeStyle='#1a120a';c.lineWidth=2;for(const ox of[-10,8]){c.beginPath();c.moveTo(W/2+ox-7,H*0.25);c.lineTo(W/2+ox+5,H*0.25);c.lineTo(W/2+ox+5,H*0.62);c.lineTo(W/2+ox+13,H*0.66);c.lineTo(W/2+ox+13,H*0.76);c.lineTo(W/2+ox-7,H*0.76);c.closePath();c.fill();c.stroke();}}}
function equipPreviewLoop(){const cv=document.getElementById('eqcv');if(!cv)return;const c=cv.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,cv.width,cv.height);
 const t=performance.now()/1000;E(c,100,262,48,10,'rgba(0,0,0,.35)');
 const ly=playerLayer();if(ly){ly.an='idle';ly.pr=null;ly.h=250;ly.face=1;ly.flash=false;drawLayered(c,100,265,ly,t);}
 else drawChar(c,100,265,{h:200,body:ACOL[P.a],cloak:'#6a1f2a',hat:P.h>0?'helm':null,helmCol:HCOL[P.h],boots:BCOL[P.b],sword:P.w,face:1,walk:0,moving:false},t);
 requestAnimationFrame(equipPreviewLoop);}
const EQSEL={v:null};
function eqSelShow(){const tip=$('#eqtip');if(!tip)return;const it=itemById(EQSEL.v);document.querySelectorAll('#eqinv .it').forEach(e=>e.classList.toggle('sel',+e.dataset.uid===EQSEL.v));if(!it){tip.innerHTML='<span class="mut">장비를 끌어서 장착 · 눌러서 선택</span>';return;}
 const eq=P.eq[it.k]===it.uid;tip.innerHTML=itemTip(it)+`<div style="margin-top:6px;display:flex;gap:6px">${eq?'<span class="mut">장착 중</span><button class="btn s" onclick="openEnhance(${it.uid})">⚒️ 강화 +${it.p||0}</button>':`<button class="btn s" onclick="openEnhance(${it.uid})">⚒️ 강화 +${it.p||0}</button><button class="btn s g" onclick="sellItem(${it.uid},()=>{EQSEL.v=null;openEquip();})">판매 ${fmt(itemVal(it))}G</button>`}</div>`;}
function setEq(k,uid){sfx('equip');const it=uid!=null?itemById(uid):null;if(it&&LVREQ[it.t]>P.lv){toast(`Lv${LVREQ[it.t]} 이상 장착 가능`);return;}if(it&&inStash(uid)){const S=stashOf();S.items=S.items.filter(x=>x!==it);P.items.push(it);}
 if(uid==null&&(k==='w'||k==='a')){toast('무기와 갑옷은 비워 둘 수 없다');return;}P.eq[k]=uid;syncEq();P.hp=Math.min(P.hp,maxHp());toast(it?`${it.name} 장착`:`${GEARK[k][1]} 해제`);openEquip();}
function itemTip(it){if(!it)return'<span class="mut">비어 있음</span>';return`<b style="color:${RAR[it.r].c}">[${RAR[it.r].n}] ${it.name}</b> <span class="mut">${GEARK[it.k][1]} · 요구 Lv${LVREQ[it.t]}</span><br>${itemStats(it)||'<span class="mut">기본 능력치 없음</span>'}<br>${cmpStats(it)}`;}
const QT={hid:false};function toggleQT(){QT.hid=!QT.hid;layoutHud();}
function layoutHud(){const q=$('#qtrack'),pb=$('#petbar'),tg=$('#qtog');if(!q)return;let y=lrect($('#hud')).bottom+5;
 if(pb){if(pb.style.top!==y+'px')pb.style.top=y+'px';if(pb.childElementCount)y=lrect(pb).bottom+5;}
 q.classList.toggle('hid',QT.hid);if(q.style.top!==y+'px')q.style.top=y+'px';
 if(tg){const r=QT.hid?null:lrect(q);tg.textContent=QT.hid?'📜▶':'◀';tg.style.width=QT.hid?'44px':'22px';tg.style.left=(QT.hid?8:r.right)+'px';tg.style.top=(QT.hid?y:r.top+4)+'px';tg.style.borderRadius=QT.hid?'8px':'0 8px 8px 0';tg.style.borderLeft=QT.hid?'1px solid #8a6a3a':'0';}}
function heroPortrait(){const cv=$('#hpor');if(!cv||!P)return;const c=cv.getContext('2d'),t=performance.now()/1000;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,cv.width,cv.height);
 if(IMG.por_hero){const im=IMG.por_hero,s=Math.max(cv.width/im.width,cv.height/im.height);c.drawImage(im,(cv.width-im.width*s)/2,0,im.width*s,im.height*s);}
 else{const ly=playerLayer();if(ly){const o=Object.assign({},ly,{an:'idle',pr:null,face:1,flash:false});c.save();c.translate(56,0);c.scale(2.3,2.3);c.translate(-P.x,-(P.y-52));try{drawLayered(c,P.x,P.y,o,t);}catch(e){}c.restore();}}
 if(P.hp<maxHp()*0.3){c.fillStyle=`rgba(255,0,0,${0.18+Math.sin(t*8)*0.12})`;c.fillRect(0,0,cv.width,cv.height);}}
function petBar(){const el=$('#petbar');if(!el||!P||!P.pets)return;const list=P.pets.slice(0,petSlots()).map(u=>monById(u)).filter(Boolean);
 const key=list.map(r=>r.uid+(petAlive(r)?'a':'d')).join(',');if(el._k!==key){el._k=key;el.innerHTML=list.map(r=>`<div class="pc" data-u="${r.uid}"><canvas width="68" height="68" data-gi="${r.gi}" data-mi="${r.mi}"></canvas><div class="bb"><b class="nm"></b><div class="bar hp"><i></i><span></span></div><div class="bar mp"><i></i><span></span></div></div></div>`).join('');
  el.querySelectorAll('canvas').forEach(cv=>{const c=cv.getContext('2d'),m=monVis(+cv.dataset.gi,+cv.dataset.mi);drawMonAt(c,m,34,64,+cv.dataset.mi<0?62:54,0.3,'move',1);});layoutHud();}
 list.forEach(r=>{const d=el.querySelector(`.pc[data-u="${r.uid}"]`);if(!d)return;const m=ents.pets&&ents.pets.find(p=>p.pet===r),alive=petAlive(r);d.classList.toggle('dead',!alive);
  const st=monStat(r),mx=m?m.maxhp:Math.round(st.hp*0.6),hp=alive?(m?m.hp:(r.php??mx)):0,mmx=40,mp=m?m.mp:(r.pmp??40);
  d.querySelector('.nm').textContent=`${monOf(r.gi,r.mi)[0]} Lv${st.L}`+(alive?'':` · ${Math.ceil((r.dead-Date.now())/1000)}초`);
  const b=d.querySelectorAll('.bar');b[0].querySelector('i').style.width=(hp/mx*100)+'%';b[0].querySelector('span').textContent=`${Math.ceil(hp)}/${mx}`;b[1].querySelector('i').style.width=(mp/mmx*100)+'%';b[1].querySelector('span').textContent=`${Math.floor(mp)}/${mmx}`;});}
function openEquip(){const slotPos={h:[8,26],r:[8,128],w:[8,230],a:[228,26],n:[228,128],b:[228,230]};
 const st=`<div class="eqst"><div>레벨<b>${P.lv}</b></div><div>공격<b>${pAtk()}</b></div><div>방어<b>${pDef()}</b></div><div>HP<b>${maxHp()}</b></div></div>`;
 const slots=Object.entries(slotPos).map(([k,[x,y]])=>{const it=eqItem(k);return`<div class="es" data-slot="${k}" style="left:${x}px;top:${y}px;${it?`border-color:${RAR[it.r].c};border-style:solid`:''}"><span class="sl2">${GEARK[k][0]} ${GEARK[k][1]}</span><canvas width="56" height="56" data-uid="${it?it.uid:''}" data-k="${k}"></canvas></div>`;}).join('');
 const order={w:0,a:1,h:2,b:3,r:4,n:5};const items=P.items.filter(it=>P.eq[it.k]!==it.uid).sort((x,y)=>order[x.k]-order[y.k]||y.t-x.t||y.r-x.r);
 const inv=items.map(it=>`<div class="it ${P.eq[it.k]===it.uid?'eq':''}" data-uid="${it.uid}" style="border-color:${RAR[it.r].c}" data-r="${it.r}"><span class="t">${GEARK[it.k][0]}</span><canvas width="56" height="56" data-uid="${it.uid}"></canvas>${it.el!=='none'?`<span style="position:absolute;right:3px;top:1px;font-size:10px">${ELEM[it.el].ic}</span>`:''}${P.eq[it.k]===it.uid?'<span class="e">E</span>':''}</div>`).join('');
 openModal(`<h2>🛡️ 장비</h2><p class="d">끌어서 장착 · 칸 밖으로 끌면 해제 · 눌러서 선택</p>
 <div class="eqw"><div><div class="eqc" id="eqc"><canvas id="eqcv" width="200" height="290"></canvas>${slots}</div>${st}</div>
 <div class="inv"><h3>보유 장비 (${items.length}) <span class="mut" style="font-size:11px">${RAR.map(r=>`<span style="color:${r.c}">■</span>${r.n}`).join(' ')}</span></h3><div class="ig" id="eqinv">${inv}</div><div class="ttip" id="eqtip"></div>
 <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap"><button class="btn s g" onclick="sellJunk(0)">일반 등급 판매</button><button class="btn s g" onclick="sellJunk(1)">고급 이하 판매</button></div></div></div>
 <button class="btn w g" onclick="openBag()">가방으로</button>`,true);
 document.querySelectorAll('#modal canvas[data-uid]').forEach(cv=>{const u=cv.dataset.uid;if(u)gearIcon(cv,itemById(+u));else{const c=cv.getContext('2d');c.font='26px sans-serif';c.textAlign='center';c.textBaseline='middle';c.globalAlpha=0.3;c.fillText(GEARK[cv.dataset.k][0],28,28);}});
 equipPreviewLoop();bindEquipDrag();eqSelShow();}
function itemVal(it){const base=[8,30,80,170,320,550][Math.min(5,it.t)]*(it.k==='w'?1.1:it.k==='a'?1:it.k==='r'||it.k==='n'?1.4:0.7);return Math.max(3,Math.round(base*(1+it.r*0.6)*(1+(it.p||0)*0.5)*(it.v?1.3:1)));}
const sellable=()=>P.items.filter(it=>P.eq[it.k]!==it.uid);
function sellItem(uid,re){sfx('coin');if(inStash(uid)){const S=stashOf(),it=S.items.find(x=>x.uid===uid);S.items=S.items.filter(x=>x!==it);P.items.push(it);}const i=P.items.findIndex(x=>x.uid===uid);if(i<0)return;const it=P.items[i];if(P.eq[it.k]===uid){toast('장착 중인 장비는 팔 수 없다');return;}P.items.splice(i,1);const g=itemVal(it);P.gold+=g;news(`💰 [${RAR[it.r].n}] ${it.name} 판매 +${fmt(g)}G`,'me');toast(`${it.name} 판매 +${fmt(g)}G`);(re||(()=>openBuilding(curBld)))();}
function sellBulk(maxR){let g=0,n=0;P.items=P.items.filter(it=>{if(P.eq[it.k]!==it.uid&&it.r<=maxR){g+=itemVal(it);n++;return false;}return true;});P.gold+=g;toast(n?`장비 ${n}개 판매 +${fmt(g)}G`:'팔 장비가 없다');if(n)news(`💰 장비 ${n}개 일괄 판매 +${fmt(g)}G`,'me');openBuilding(curBld);}
function sellPanel(){const L=sellable().sort((a,b)=>b.r-a.r||b.t-a.t);if(!L.length)return'<p class="d">팔 수 있는 장비가 없다. (장착 중인 장비는 팔 수 없다)</p>';
 const sumR=r=>L.filter(it=>it.r<=r).reduce((a,it)=>a+itemVal(it),0);
 return`<p class="d">장착하지 않은 장비만 팔 수 있다.</p><div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0"><button class="btn s g" onclick="sellBulk(0)">일반 등급 모두 판매 (${fmt(sumR(0))}G)</button><button class="btn s g" onclick="sellBulk(1)">고급 이하 모두 판매 (${fmt(sumR(1))}G)</button></div>
 <div class="icards">${L.map(it=>itemCard(it,`<button class="btn s" style="margin-top:4px" onclick="sellItem(${it.uid})">💰 ${fmt(itemVal(it))}G 판매</button>`)).join('')}</div>`;}
function sellJunk(maxR=0){let g=0,n=0;P.items=P.items.filter(it=>{if(P.eq[it.k]!==it.uid&&it.r<=maxR){g+=itemVal(it);n++;return false;}return true;});P.gold+=g;toast(n?`장비 ${n}개 판매 +${fmt(g)}G`:'정리할 장비가 없다');openEquip();}
function bindEquipDrag(){const tip=$('#eqtip');let drag=null;
 const start=(uid,fromSlot,e)=>{e.preventDefault();drag={uid,fromSlot,sx:e.clientX,sy:e.clientY,moved:false,el:null};tip.innerHTML=itemTip(itemById(uid));};
 document.querySelectorAll('#eqinv .it').forEach(el=>{const u=+el.dataset.uid;el.addEventListener('pointerdown',e=>start(u,false,e));el.addEventListener('pointerenter',()=>{if(EQSEL.v==null)tip.innerHTML=itemTip(itemById(u));});});
 document.querySelectorAll('#eqc .es').forEach(el=>{const k=el.dataset.slot;el.addEventListener('pointerdown',e=>{if(P.eq[k]!=null)start(P.eq[k],k,e);});el.addEventListener('pointerenter',()=>tip.innerHTML=itemTip(eqItem(k)));});
 const target=(x,y)=>{const el=document.elementFromPoint(x,y);if(!el)return null;const s=el.closest('.es');if(s)return{slot:s.dataset.slot,el:s};if(el.closest('#eqc'))return{slot:'char'};if(el.closest('#eqinv'))return{slot:'inv'};return{slot:'out'};};
 const move=e=>{if(!drag)return;if(!drag.moved&&Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)<6)return;const it=itemById(drag.uid);
  if(!drag.moved){drag.moved=true;const g=document.createElement('canvas');g.width=g.height=64;g.className='ghost';gearIcon(g,it);document.body.appendChild(g);drag.el=g;}
  drag.el.style.left=LX(e)+'px';drag.el.style.top=LY(e)+'px';document.querySelectorAll('.es').forEach(s=>s.classList.remove('hot'));
  const tg=target(e.clientX,e.clientY);if(tg&&!drag.fromSlot&&(tg.slot===it.k||tg.slot==='char'))document.querySelector(`.es[data-slot="${it.k}"]`).classList.add('hot');};
 const up=e=>{if(!drag)return;const d=drag;drag=null;if(d.el)d.el.remove();document.querySelectorAll('.es').forEach(s=>s.classList.remove('hot'));
  removeEventListener('pointermove',move);removeEventListener('pointerup',up);const it=itemById(d.uid);
  if(!d.moved){EQSEL.v=it.uid;eqSelShow();return;}
  const tg=target(e.clientX,e.clientY);if(!tg)return;
  if(!d.fromSlot&&(tg.slot===it.k||tg.slot==='char'))setEq(it.k,it.uid);
  else if(!d.fromSlot&&tg.slot!=='inv'&&tg.slot!=='out')toast(`${GEARK[it.k][1]}은(는) ${GEARK[it.k][1]} 칸에만 넣을 수 있다`);
  else if(d.fromSlot&&(tg.slot==='inv'||tg.slot==='out'))setEq(d.fromSlot,null);};
 for(const id of ['eqc','eqinv']){const el=document.getElementById(id);if(el)el.addEventListener('pointerdown',()=>{addEventListener('pointermove',move);addEventListener('pointerup',up);});}}
function fastHours(h){for(let i=0;i<h;i++)hourTick(false);}
function restInn(cost){P.gold-=cost;closeModal();fade.dir=1;fade.cb=()=>{fastHours(4);P.hp=maxHp();P.mp=maxMp();reconcile(false);toast('푹 쉬었다! HP·MP 회복');};}
