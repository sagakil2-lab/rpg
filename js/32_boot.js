'use strict';
// =====================================================================
//  시작
// =====================================================================
resize();loadAssets();loadSounds();setInterval(()=>{try{bgmTick();}catch(e){}},1000);
function startGame(fresh){const t=$('#title');if(t)t.remove();if(fresh){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
if(fresh||!loadSaved()){newSim();newPlayer();gainItem(makeItem('w',0,0,0),true);gainItem(makeItem('a',0,0,0),true);
 qInit();enterMap('T0',getMap('T0').entries.start);
 news('🗺️ 왕도 아르덴에서 모험을 시작했다. 분수대 옆 길드장 브란에게 말을 걸어 보자 (❗ 표시).','me');
 playScene('pro',()=>playScene('ch1',openHelp));}else{toast('💾 저장된 게임을 불러왔다');}
setInterval(()=>saveGame(false),30000);addEventListener('beforeunload',()=>saveGame(false));addEventListener('visibilitychange',()=>{if(document.hidden)saveGame(false);});

dailyLogin();requestAnimationFrame(frame);}
showTitle();

(function(){const W=(n,k,cond)=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(...a){const pre=cond?cond.pre&&cond.pre(a):null;const r=f.apply(this,a);try{if(!cond||!cond.ok||cond.ok(a,r,pre))sfx(typeof k==='function'?k(a,r):k);}catch(e){}return r;};};
 W('hatchAnim','hatch');W('fusDo','fuse');W('openStash','open');W('equip','equip');W('openStory','talk');W('enterLeg','warp');W('legVictory','victory');
 W('useRecall','recall',{ok:()=>P&&P.recall});W('homeClick','place',{pre:()=>!!HM.place,ok:(a,r,pre)=>pre&&!HM.place});
 W('openModal','open',{pre:()=>!$('#modal').classList.contains('on'),ok:(a,r,pre)=>pre});
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button,.btn,.tab,.ncard,.mrow');if(!b||b.disabled)return;const oc=(b.getAttribute('onclick')||'');if(/closeModal\(\)\s*$|closeModal\(\);?$/.test(oc))return;sfx('click');},true);
 W('petHurt','petdie',{ok:a=>a[0]&&a[0].hp<=0});W('closeModal','close',{pre:()=>$('#modal')&&$('#modal').classList.contains('on'),ok:(a,r,pre)=>pre});
})();

(function(){const f=window.doAttack;if(typeof f!=='function')return;window.doAttack=function(...a){const c0=P.atkCd;const r=f.apply(this,a);try{if(P.atkCd>0.2&&!nearChest())procAtk();}catch(e){}return r;};})();
