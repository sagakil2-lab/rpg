'use strict';
// =====================================================================
//  데이터 — 마을 / 사냥터 / 재료 / 제작품 / 상점
// =====================================================================
const TOWNS=[
 {id:0,name:'아르덴',icon:'🏰',unlock:1,theme:'town',border:3,wx:50,wy:49,mods:{},exits:{E:0,N:1,S:7},desc:'왕도. 모험이 시작되는 곳.'},
 {id:1,name:'벨모어',icon:'🌲',unlock:5,theme:'forestTown',border:3,wx:26,wy:33,mods:{plant:1.25,magic:1.1,hide:0.9},exits:{W:2,S:3},desc:'숲 속 연금술 마을.'},
 {id:2,name:'카락',icon:'⛏️',unlock:14,theme:'mineTown',border:4,wx:79,wy:21,mods:{ore:0.8,hide:1.3,plant:1.2},exits:{N:5,E:6},desc:'드워프 광산 도시.'},
 {id:3,name:'시엘라',icon:'⚓',unlock:11,theme:'portTown',border:3,wx:30,wy:64,mods:{sea:0.75,ore:1.25,bone:1.1},exits:{W:4},desc:'바닷바람이 부는 항구 도시.'},
 {id:4,name:'드라칸',icon:'🛡️',unlock:20,theme:'fortTown',border:12,wx:69,wy:70,mods:{ore:1.3,hide:1.15,magic:0.9},exits:{E:8,S:9},desc:'용의 땅을 지키는 변경 요새.'},
 {id:5,name:'미르나',icon:'🌸',unlock:30,theme:'forestTown',border:3,wx:49,wy:15,mods:{plant:0.9,magic:1.2},exits:{},desc:'깊은 숲 너머 요정들의 마을.'},
 {id:6,name:'오르비스',icon:'🏛️',unlock:45,theme:'town',border:3,wx:64,wy:33,mods:{misc:0.85,magic:1.15},exits:{},desc:'고대 유적 위에 세운 학자들의 도시.'},
 {id:7,name:'사하르',icon:'🏜️',unlock:60,theme:'mineTown',border:4,wx:88,wy:60,mods:{ore:0.85,sea:1.4},exits:{},desc:'모래 폭풍 속 광산 교역 도시.'},
 {id:8,name:'노스헤임',icon:'❄️',unlock:75,theme:'fortTown',border:12,wx:48,wy:88,mods:{hide:0.85,plant:1.3},exits:{},desc:'만년설에 둘러싸인 북방 요새.'},
 {id:9,name:'아비스',icon:'🌋',unlock:95,theme:'portTown',border:3,wx:10,wy:88,mods:{magic:0.8,bone:0.9,ore:1.2},exits:{},desc:'심연의 균열 끝에 선 마지막 항구.'},
];
const NT=TOWNS.length;
// mons: [이름, 형태, 색, 에셋ID]
const GROUNDS=[
 {name:'초록 들판',lv:1,town:0,kind:'field',theme:'meadow',wx:40,wy:42,
  mons:[['슬라임','slime','#5ccf6a','m_slime'],['들쥐','rat','#a08a78','m_rat'],['버섯돌이','shroom','#d0583e','m_shroom'],['뿔토끼','rat','#d8b080','m_bunny'],['왕벌','bat','#e8b030','m_bee']],boss:['여왕벌','bat','#e8a020','b_queenbee'],
  mats:[['슬라임 젤','misc'],['쥐 가죽','hide'],['질긴 풀','plant'],['작은 뼈','bone'],['버섯 포자','plant']]},
 {name:'이끼 동굴',lv:3,town:0,kind:'dungeon',theme:'cave',wx:52,wy:38,
  mons:[['동굴 박쥐','bat','#5a4a6a','m_bat'],['동굴 도마뱀','lizard','#5aa070','m_cavelizard'],['코볼트','gob','#b07a48','m_kobold']],boss:['동굴 군주 도마뱀','lizard','#2f7a48','b_cavelord'],
  mats:[['박쥐 날개','hide'],['철광석','ore'],['석탄','ore'],['도마뱀 비늘','hide'],['코볼트 등불','magic']]},
 {name:'속삭이는 숲',lv:6,town:1,kind:'field',theme:'forest',wx:10,wy:14,
  mons:[['회색 늑대','wolf','#8a8c99','m_wolf'],['거대 거미','spider','#5a3a5e','m_spider'],['고블린','gob','#78a84a','m_goblin'],['어둠 요정','bat','#6a5a7a','m_fairy'],['걷는 나무','golem','#8a6a3a','m_treant']],
  mats:[['늑대 가죽','hide'],['거미줄','misc'],['송진','plant'],['고블린 귀','bone'],['늑대 이빨','bone']]},
 {name:'독안개 늪',lv:9,town:1,kind:'field',theme:'swamp',wx:10,wy:42,
  mons:[['리자드맨','fishman','#4a9a5a','m_lizardman'],['독두꺼비','toad','#7ab83a','m_toad'],['늪 괴물','slime','#566a44','m_bog'],['늪 악어','lizard','#5a8a4a','m_crocodile'],['거대 거머리','slime','#7a5a8a','m_leech']],
  mats:[['리자드 가죽','hide'],['늪 이끼','plant'],['두꺼비 기름','misc'],['썩은 뿌리','plant'],['독 주머니','magic']]},
 {name:'소금 해안',lv:12,town:3,kind:'field',theme:'beach',wx:6,wy:64,
  mons:[['집게 게','crab','#d8603e','m_crab'],['해적 해골','skel','#e2dcc6','m_pirate'],['머맨','fishman','#4a8ab0','m_merman'],['분홍 해파리','slime','#e8a0a8','m_jellyfish'],['가시 바다거북','crab','#5a8a4a','m_seaturtle']],boss:['새끼 크라켄','slime','#8a6ac8','b_krakenling'],
  mats:[['게 껍질','sea'],['해초','sea'],['소금 결정','sea'],['녹슨 금화','misc'],['진주','sea']]},
 {name:'버려진 광산',lv:15,town:2,kind:'dungeon',theme:'mine',wx:92,wy:16,
  mons:[['돌 골렘','golem','#9a988a','m_golem'],['광부 유령','ghost','#a8c8e0','m_minerghost'],['거대 두더지','rat','#6a5040','m_mole'],['태엽 굴착기','golem','#b07a40','m_dwarfbot'],['폭탄 고블린','gob','#7a8a40','m_bomber']],boss:['고대 골렘','golem','#6a6a90','b_ancientgolem'],
  mats:[['은광석','ore'],['수정 조각','magic'],['두더지 발톱','bone'],['유령 천','magic'],['골렘 핵','magic']]},
 {name:'붉은 협곡',lv:18,town:2,kind:'field',theme:'canyon',wx:94,wy:36,
  mons:[['하피','bird','#c88a5a','m_harpy'],['오우거','ogre','#a87a50','m_ogre'],['화염 도마뱀','lizard','#e85a2a','m_firelizard'],['붉은 전갈','spider','#d0402a','m_scorpion']],boss:['미라 파라오','ghost','#d8b040','b_pharaoh'],
  mats:[['하피 깃털','hide'],['오우거 뼈','bone'],['화염석','ore'],['붉은 가죽','hide'],['미스릴 광석','ore']]},
 {name:'망자의 묘지',lv:21,town:0,kind:'dungeon',theme:'grave',wx:50,wy:66,
  mons:[['구울','ghoul','#788a6a','m_ghoul'],['스켈레톤 기사','skel','#cfcbb8','m_skelknight'],['리치 견습생','ghost','#a66ae0','m_lich'],['붕대 미라','ghoul','#c8b890','m_mummy'],['밴시','ghost','#d8e0e8','m_banshee'],['해골 사냥개','wolf','#d8d0b0','m_bonedog']],boss:['리치 군주','ghost','#7a3ad0','b_lichlord'],
  mats:[['뼛가루','bone'],['저주받은 천','magic'],['검은 철','ore'],['망령의 재','magic'],['영혼석','magic']]},
 {name:'얼음 봉우리',lv:25,town:4,kind:'field',theme:'snow',wx:96,wy:80,
  mons:[['설인','ogre','#eef2ff','m_yeti'],['서리 늑대','wolf','#9cc8ff','m_frostwolf'],['얼음 정령','ghost','#6cd0ff','m_icespirit'],['얼음 골렘','golem','#8ac8f0','m_icegolem'],['펭귄 창병','gob','#4a4a5a','m_penguin']],
  mats:[['설인 모피','hide'],['빙하수','plant'],['백색 이빨','bone'],['서리 결정','magic'],['얼음 핵','magic']]},
 {name:'용의 둥지',lv:30,town:4,kind:'dungeon',theme:'lava',wx:78,wy:94,
  mons:[['와이번','bird','#a8544a','m_wyvern'],['드레이크','lizard','#c8402a','m_drake'],['화염 정령','ghost','#ff7a2a','m_flamespirit'],['불꽃 샐러맨더','lizard','#e8602a','m_salamander'],['임프','bat','#c8402a','m_imp']],boss:['화룡 이그니스','dragon','#e83a10','b_firedragon'],
  mats:[['와이번 날개','hide'],['용 비늘','hide'],['용의 피','magic'],['용 뼈','bone'],['화염 심장','magic']]},
];
const MATS=[];
GROUNDS.forEach((g,gi)=>{g.matIds=[];g.mats.forEach((m,k)=>{const id=MATS.length,v=0.85+((id*37)%10)/25;
 MATS.push({id,name:m[0],cat:m[1],tier:gi+1,g:gi,rare:k===4,base:Math.max(3,Math.round((3+3*Math.pow(1.5,gi))*(k===4?2.3:v)))});g.matIds.push(id);});});
const SPM=[['네잎 클로버','plant'],['반딧불 이끼','magic'],['고대 나무껍질','plant'],['마녀 버섯','magic'],['인어 비늘','sea'],['금광석','ore'],['불사조 깃털','magic'],['저주받은 반지','misc'],['영원의 얼음꽃','plant'],['용의 눈','magic']];
GROUNDS.forEach((g,gi)=>{const id=MATS.length;MATS.push({id,name:SPM[gi][0],cat:SPM[gi][1],tier:gi+1,g:gi,rare:true,sp:true,base:Math.round((3+3*Math.pow(1.5,gi))*4.5)});g.sp=id;});
// ===== 확장 사냥터 40곳: 기존 몬스터의 변종(색·크기·빛) =====
function hueShift(hex,deg){if(!deg)return hex;let r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0,l=(mx+mn)/2;
 if(mx!==mn){const d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h/=6;}h=(h+deg/360)%1;
 const f=(p,q,t)=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;
 return'#'+[f(p,q,h+1/3),f(p,q,h),f(p,q,h-1/3)].map(v=>Math.round(clamp(v,0,1)*255).toString(16).padStart(2,'0')).join('');}
const VT=[{n:'',m:'',hue:0,glow:null,sc:1},{n:'깊은',m:'흉포한 ',hue:150,glow:'#ff5a3a',sc:1.12},{n:'저주받은',m:'저주받은 ',hue:250,glow:'#b46aff',sc:1.2},{n:'심연의',m:'심연의 ',hue:195,glow:'#4ad8ff',sc:1.28},{n:'태초의',m:'태초의 ',hue:310,glow:'#ffd23f',sc:1.36}];
const BASE_G=GROUNDS.length;
for(let i=BASE_G;i<50;i++){const b=GROUNDS[i%BASE_G],vt=Math.floor(i/BASE_G),lv=b.lv+vt*30,town=5+clamp(Math.floor((lv-31)/24),0,4),T=TOWNS[town],rq=mulberry(i*91),hs=c=>hueShift(c,VT[vt].hue);
 GROUNDS.push({name:VT[vt].n+' '+b.name,lv,town,kind:b.kind,theme:b.theme,vt,base:i%BASE_G,portal:true,wx:clamp(T.wx+(rq()-0.5)*24,3,97),wy:clamp(T.wy+(rq()-0.5)*24,3,97),
  mons:b.mons.map(m=>[VT[vt].m+m[0],m[1],hs(m[2]),m[3]]).concat(vt===3?[['공허의 눈','ghost','#8a4ab0','m_voidwatcher'],['그림자 기사','skel','#3a2a4a','m_shadowknight']]:[]),boss:b.boss?[VT[vt].m+b.boss[0],b.boss[1],hs(b.boss[2]),b.boss[3]]:(vt===3?['공허의 군주','ogre','#4a2a6a','b_voidlord']:null),mats:b.mats,matIds:b.matIds,sp:b.sp});}
GROUNDS.forEach((g,i)=>{if(g.base==null)g.base=i;if(!g.vt)g.vt=0;});
const THEL={forest:'poison',swamp:'poison',beach:'bolt',canyon:'fire',grave:'dark',snow:'ice',lava:'fire'},VTEL=[null,'fire','dark','ice','holy'];
const GEL=g=>(g.vt&&VTEL[g.vt])||THEL[g.theme]||'none';
const OPP={fire:'ice',ice:'fire',bolt:'poison',poison:'bolt',holy:'dark',dark:'holy'};
const elMul=(a,d)=>(!a||!d||a==='none'||d==='none')?1:a===d?0.5:OPP[a]===d?1.6:1;
const AWM=[];
const RIFTM=[];[['균열 파편','misc',70,43,80],['공허의 결정','magic',180,39,120],['차원의 핵','magic',480,49,210]].forEach(([n,c,b,b0,h])=>{const id=MATS.length;MATS.push({id,name:n,cat:c,tier:9,g:0,rare:n!=='균열 파편',base:b,base0:b0,hue:h,rift:true});RIFTM.push(id);});
{const id=MATS.length;MATS.push({id,name:'각성의 정수',cat:'magic',tier:9,g:0,rare:true,base:260,base0:45,hue:40,rift:true});AWM.push(id);}
const matImg=m=>IMG['matx_'+m.id]||(m.sp&&IMG['smat_'+m.g])||IMG['mat_'+(m.base0??m.id)]||IMG['icon_'+m.cat];
const MB={};MATS.forEach(m=>MB[m.name]=m.id);
const CATN={hide:'가죽',ore:'광석',bone:'뼈',plant:'식물',magic:'마법',sea:'해산',misc:'잡화'};
const CATC={hide:'#c8844a',ore:'#9aa4b0',bone:'#eee6d0',plant:'#6ad04a',magic:'#b87aff',sea:'#4ab0e0',misc:'#e0c050'};
const WNAME=['녹슨 단검','철검','은검','미스릴 검','흑철 대검','용아검'],WATK=[2,6,14,26,40,60];
const ANAME=['낡은 천옷','가죽 갑옷','비늘 갑옷','리자드 갑옷','설인 모피 갑옷','용비늘 갑옷'],ADEF=[0,4,10,18,28,42];
const LVREQ=[0,3,9,15,21,27];
const HNAME=['맨머리','가죽 모자','철 투구','은빛 투구','미스릴 투구','용각 투구'],HDEF=[0,2,5,9,14,20],HHP=[0,10,25,45,70,100];
const BNAME=['낡은 신발','가죽 장화','철 장화','리자드 장화','설원 장화','용린 장화'],BDEF=[0,1,3,6,9,13],BSPD=[0,3,5,7,9,12];
const HCOL=['#4a3020','#8b5a2b','#9aa4ad','#d8dee6','#6ff0f0','#c83a2a'],BCOL=['#6a4a30','#8b5a2b','#8a9098','#3f7a3a','#dfe8f0','#b02a2a'];
const SLOTK={weapon:'w',armor:'a',helmet:'h',boots:'b'};
const CRAFT=[
 {id:'p1',name:'체력 물약(소)',type:'potion',tier:1,heal:45,rec:{'질긴 풀':2,'슬라임 젤':1}},
 {id:'p2',name:'체력 물약(중)',type:'potion',tier:2,heal:150,rec:{'송진':1,'해초':2,'버섯 포자':1}},
 {id:'p3',name:'체력 물약(대)',type:'potion',tier:3,heal:400,rec:{'늪 이끼':2,'빙하수':1,'두꺼비 기름':1}},
 {id:'w1',type:'weapon',tier:1,rec:{'철광석':3,'석탄':2}},{id:'w2',type:'weapon',tier:2,rec:{'은광석':3,'석탄':2,'수정 조각':1}},
 {id:'w3',type:'weapon',tier:3,rec:{'미스릴 광석':3,'화염석':2}},{id:'w4',type:'weapon',tier:4,rec:{'검은 철':4,'영혼석':1}},
 {id:'w5',type:'weapon',tier:5,rec:{'용 뼈':2,'용 비늘':2,'화염 심장':1}},
 {id:'a1',type:'armor',tier:1,rec:{'쥐 가죽':3,'늑대 가죽':2}},{id:'a2',type:'armor',tier:2,rec:{'도마뱀 비늘':3,'게 껍질':2}},
 {id:'a3',type:'armor',tier:3,rec:{'리자드 가죽':3,'붉은 가죽':2}},{id:'a4',type:'armor',tier:4,rec:{'설인 모피':3,'서리 결정':2}},
 {id:'a5',type:'armor',tier:5,rec:{'용 비늘':4,'용의 피':1}},
 {id:'h1',type:'helmet',tier:1,rec:{'쥐 가죽':2,'작은 뼈':1}},{id:'h2',type:'helmet',tier:2,rec:{'철광석':2,'도마뱀 비늘':1}},{id:'h3',type:'helmet',tier:3,rec:{'은광석':2,'수정 조각':1}},
 {id:'h4',type:'helmet',tier:4,rec:{'미스릴 광석':2,'화염석':1}},{id:'h5',type:'helmet',tier:5,rec:{'용 뼈':1,'용 비늘':2}},
 {id:'b1',type:'boots',tier:1,rec:{'쥐 가죽':2,'늑대 가죽':1}},{id:'b2',type:'boots',tier:2,rec:{'도마뱀 비늘':2,'박쥐 날개':1}},{id:'b3',type:'boots',tier:3,rec:{'리자드 가죽':2,'늪 이끼':1}},
 {id:'b4',type:'boots',tier:4,rec:{'설인 모피':2,'하피 깃털':1}},{id:'b5',type:'boots',tier:5,rec:{'와이번 날개':2,'용 비늘':1}},
];
const CB={};
CRAFT.forEach(c=>{if(c.type==='weapon'){c.name=WNAME[c.tier];c.stat=`공격 +${WATK[c.tier]}`;c.lvReq=LVREQ[c.tier];}
 else if(c.type==='armor'){c.name=ANAME[c.tier];c.stat=`방어 +${ADEF[c.tier]}`;c.lvReq=LVREQ[c.tier];}
 else if(c.type==='helmet'){c.name=HNAME[c.tier];c.stat=`방어 +${HDEF[c.tier]} · HP +${HHP[c.tier]}`;c.lvReq=LVREQ[c.tier];}
 else if(c.type==='boots'){c.name=BNAME[c.tier];c.stat=`방어 +${BDEF[c.tier]} · 이동 +${BSPD[c.tier]}%`;c.lvReq=LVREQ[c.tier];}else{c.stat=`HP +${c.heal}`;c.lvReq=0;}
 c.recIds=Object.entries(c.rec).map(([n,q])=>[MB[n],q]);c.base=Math.round(c.recIds.reduce((s,[id,q])=>s+MATS[id].base*q,0)*1.5+5);CB[c.id]=c;});
const SHOPS=[
 {town:0,name:'아르덴 재료 거래소',kind:'mat'},{town:0,name:'왕실 대장간',kind:'craft',items:['p1','w1','w2','a1','a2','h1','h2','b1']},
 {town:1,name:'벨모어 재료상',kind:'mat'},{town:1,name:'초록 연금술 공방',kind:'craft',items:['p1','p2','p3','b2']},
 {town:2,name:'카락 광물 시장',kind:'mat'},{town:2,name:'드워프 무기 공방',kind:'craft',items:['w1','w2','w3','w4','w5','h3','h4']},
 {town:3,name:'시엘라 교역소',kind:'mat'},{town:3,name:'항구 잡화점',kind:'craft',items:['p1','p2','a1','a2','h1','b1','b2']},
 {town:4,name:'드라칸 군수 창고',kind:'mat'},{town:4,name:'요새 방어구점',kind:'craft',items:['p2','a3','a4','a5','w3','h5','b3','b4','b5']},
 {town:5,name:'미르나 정령 시장',kind:'mat'},{town:5,name:'요정 세공방',kind:'craft',items:['p2','p3','w4','a4','h4','b4']},
 {town:6,name:'오르비스 경매장',kind:'mat'},{town:6,name:'학자의 병기고',kind:'craft',items:['p3','w4','w5','a5','h5','b5']},
 {town:7,name:'사하르 대상 시장',kind:'mat'},{town:7,name:'사막 대장간',kind:'craft',items:['p2','p3','w3','w4','w5','a3','a4']},
 {town:8,name:'노스헤임 보급소',kind:'mat'},{town:8,name:'설원 방어구점',kind:'craft',items:['p3','a4','a5','h4','h5','b4','b5']},
 {town:9,name:'아비스 암시장',kind:'mat'},{town:9,name:'심연의 용광로',kind:'craft',items:['p3','w5','a5','h5','b5']},
];
const NODES=[...TOWNS.map(t=>({name:t.name,x:t.wx,y:t.wy})),...GROUNDS.map(g=>({name:g.name,x:g.wx,y:g.wy})),{name:'유부장의 던전',x:57,y:58}];const DUN=NODES.length-1;
const hoursBetween=(a,b)=>Math.max(1,Math.round(Math.hypot(NODES[a].x-NODES[b].x,NODES[a].y-NODES[b].y)/7));
const W5=[5,4,4,3,1],WS=17;
const rollDrop=g=>{let r=R()*WS;for(let k=0;k<5;k++){r-=W5[k];if(r<0)return g.matIds[k];}return g.matIds[0];};
const bagCount=b=>Object.values(b).reduce((s,v)=>s+v,0);const STK=30;const pBag=()=>Object.values(P.bag).reduce((s,v)=>s+Math.ceil(v/STK),0);const pFit=id=>Math.max(0,(P.cap-pBag())*STK+(P.bag[id]?(STK-P.bag[id]%STK)%STK:0));
const addBag=(b,id,n=1)=>{b[id]=(b[id]||0)+n;if(b[id]<=0)delete b[id];};
const ROLE={hunter:['⚔️','사냥꾼','#ff7a6a'],trader:['🐪','상인','#ffd23f'],crafter:['🔨','장인','#7ad0ff']};
