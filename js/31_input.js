'use strict';
// =====================================================================
//  입력
// =====================================================================
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
 if(k==='escape'){closeModal();return;}if(paused){if(k==='b'||k==='i'||k==='t'||k==='g'||k==='u')closeModal();return;}input.keys[k]=true;
 if(k===' '||k==='j')input.atk=true;if(k==='k')input.sl[0]=true;if(k>='1'&&k<='4'&&k.length===1)input.sl[+k-1]=true;if(k==='t')openSkills();if(k==='q'||k==='l')input.pot=true;if(k==='5')quaffId('p1');if(k==='6')quaffId('p2');if(k==='7')quaffId('p3');if(k==='e'||k==='enter')input.act=true;if(k==='b'||k==='i')openBag();if(k==='g')openEquip();if(k==='v')toggleRig();if(k==='m')openWorld();if(k==='n')toggleSound();if(k==='o')openQuests();if(k==='y')openShop('charge');if(k==='escape'&&!$('#modal').classList.contains('on'))openSettings();if(k==='p')openMons();if(k==='h')cycleHair();if(k==='r'||k==='8')useRecall();if(k==='c')cycleCape();if(k==='u')openDungeon();});
addEventListener('keyup',e=>{const k=e.key.toLowerCase();input.keys[k]=false;if(k===' '||k==='j')input.atk=false;});
const touch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches;
if(touch){$('#pad').style.display='block';$('#acts').style.display='block';
 const pad=$('#pad'),knob=$('#knob');let jid=null,ox=0,oy=0;
 pad.addEventListener('touchstart',e=>{const t=e.changedTouches[0];jid=t.identifier;ox=LX(t);oy=LY(t);knob.style.display='block';knob.style.left=(ox-55)+'px';knob.style.top=(oy-55-(innerHeight-pad.offsetHeight))+'px';e.preventDefault();},{passive:false});
 pad.addEventListener('touchmove',e=>{for(const t of e.changedTouches){if(t.identifier!==jid)continue;let dx=LX(t)-ox,dy=LY(t)-oy;const d=Math.hypot(dx,dy),mx=45;if(d>mx){dx=dx/d*mx;dy=dy/d*mx;}input.jx=dx/mx;input.jy=dy/mx;knob.firstChild.style.transform=`translate(${dx}px,${dy}px)`;}e.preventDefault();},{passive:false});
 const end=e=>{for(const t of e.changedTouches)if(t.identifier===jid){jid=null;input.jx=input.jy=0;knob.style.display='none';knob.firstChild.style.transform='';}};pad.addEventListener('touchend',end);pad.addEventListener('touchcancel',end);
 const hold=(id,on,off)=>{const b=$(id);b.addEventListener('touchstart',e=>{e.preventDefault();on();},{passive:false});b.addEventListener('touchend',e=>{e.preventDefault();off&&off();},{passive:false});};
 hold('#bA',()=>input.atk=true,()=>input.atk=false);hold('#bP',()=>input.pot=true);hold('#bE',()=>input.act=true);}
