'use strict';
// =====================================================================
//  부위 조립(컷아웃) 캐릭터 — 뼈대 애니메이션
// =====================================================================
const RIGK=['head','torso','hips','arm','arm2','thigh','shin'];
const RIGA={head:{ax:200,ay:345},torso:{ax:117,ay:240,nx:105,ny:16,sx:44,sy:80,bx:160,by:76},hips:{cx:106,wy:14,jy:96,lb:60,lf:150},arm:{ax:53,ay:30,hx:77,hy:250},arm2:{ax:55,ay:30},thigh:{ax:66,ay:12,kx:62,ky:172},shin:{ax:48,ay:12,fy:236}};// 꼬마 체형 관절 (부위 이미지 픽셀)
let RIG_ON=true;
const rigReady=()=>RIG_ON&&RIGK.every(k=>IMG['rig_'+k]);
const lerpK=(ks,p)=>{p=clamp(p,0,1);for(let i=1;i<ks.length;i++)if(p<=ks[i][0]){const a=ks[i-1],b=ks[i],u=(p-a[0])/(b[0]-a[0]||1),e=u*u*(3-2*u);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*e);}return ks[ks.length-1].slice(1);};
// 포즈: [몸통기울기, 앞팔, 뒷팔, 앞허벅지, 앞정강이(상대), 뒷허벅지, 뒷정강이(상대), 높이, 무기모드(0=들기 1=연장)]
function rigPose(an,pr,t){const w=t*9;
 if(an==='walk'){const s=Math.sin(w),c=Math.cos(w);return[-0.06,-0.45*s+0.1,0.45*s+0.1,-0.55*s,0.15+0.55*Math.max(0,c),0.55*s,0.15+0.55*Math.max(0,-c),-Math.abs(s)*8,0];}
 if(an==='attack'){const[a,b,tl]=lerpK([[0,-0.3,0.3,0],[0.3,-3.0,0.5,0.12],[0.6,-0.55,0.1,-0.22],[1,-0.2,0.2,-0.05]],pr);return[tl,a,b,-0.35,0.3,0.35,0.25,4,1];}
 if(an==='dash')return[-0.35,-1.55,0.7,-1.0,0.9,0.75,0.2,18,1];
 if(an==='spin'){return[-0.1,-1.57,1.2,-0.2,0.2,0.2,0.2,0,1];}
 if(an==='cast'){const[a]=lerpK([[0,-0.3],[0.3,-2.9],[0.55,-2.9],[0.8,-1.5],[1,-1.5]],pr);return[0.05,a,-0.9,-0.15,0.15,0.15,0.15,0,0];}
 if(an==='hurt')return[0.28,0.6,0.7,0.25,0.3,-0.15,0.4,2,0];
 if(an==='death')return[0.2,0.5,0.6,-0.2,0.6,0.2,0.6,0,0];
 const b=Math.sin(t*2.2);return[0.02*b,0.12+0.03*b,0.18-0.03*b,-0.08,0.12,0.1,0.1,b*1.5,0];}
// 장비 부위 덮개: [로컬x, 로컬y, 폭, 높이] (부위 이미지 좌상단 기준)
const RAM={"dragon": {"torso": [-66.6, -17.5, 314, 272], "hips": [-34.9, 4.5, 262, 215], "arm": [-22.0, -33.6, 134, 317], "thigh": [0.0, 1.3, 126, 184]}, "leather": {"torso": [-49.8, -7.1, 288, 262], "hips": [-25.2, 3.9, 254, 176], "arm": [-8.4, -14.2, 122, 298], "thigh": [0.0, 3.2, 126, 184]}, "plate": {"torso": [-44.6, 4.5, 290, 250], "hips": [-22.0, 3.9, 250, 189], "arm": [-13.6, -16.8, 129, 301], "thigh": [3.2, -14.9, 123, 202]}, "robe": {"torso": [-7.8, -18.7, 226, 272], "hips": [-34.3, -69.2, 272, 302], "arm": [-32.3, 4.5, 144, 280]}, "scale": {"torso": [-52.4, 4.5, 297, 250], "hips": [-25.2, 3.9, 264, 209], "arm": [-3.2, -15.5, 116, 299], "thigh": [2.6, 1.3, 124, 185]}};
const RHAIR=[[-56.8, -130.2, 513, 485], [-66.6, -150.9, 523, 511], [-117.2, -128.4, 527, 612], [-153.4, -124.5, 535, 494], [-76.9, -116.8, 504, 481], [-110.9, -120.7, 500, 486]];
const RHELM=[[-64.7, -137.1, 452, 593], [-80.4, -145.6, 476, 523], [-181.7, -238.4, 616, 650], [-100.9, -172.1, 527, 550], [-209.4, -316.7, 738, 694], [-172.0, -173.3, 539, 658], [-139.5, -243.2, 534, 621], [-144.3, -321.6, 577, 699]];
const HAIR_N=['갈색 덥수룩','검정 뾰족','금발 긴머리','빨강 포니테일','곱슬','은발 올림'],CAPE_N=['없음','붉은 망토','푸른 망토','검은 누더기','왕실 망토'];
const ARSET=[null,'leather','scale','scale','plate','dragon'],ARTINT=[null,null,null,'sepia(.35) hue-rotate(35deg) saturate(.8)',null,null];
const RIG_WX=1.15,RIG_WPN=1.45,HAIRCLIP={0:0.38,1:0.32,3:0.36},HADJ={0:[-6,-4,1.08],1:[-20,-4,1.08],2:[-12,0,1.04],3:[-20,-4,1.08],4:[-20,-4,1.06],7:[-40,0,1.06]};const HELMT=[null,0,1,3,2,7],HELMV={circlet:6,hood:5,wizhat:4},HAIRUNDER={0:1,1:1,2:1,3:1,4:1,6:1,7:1};
const RIG_TOT=1060;// 발끝~머리끝 높이(부위 픽셀)
function drawRig(c,x,y,o,t){const LS=0.82,S=o.h/RIG_TOT*1.06,P0=rigPose(o.an,o.pr==null?0:o.pr,t);const[tor,aF,aB,thF,shF,thB,shB,bob,wm]=P0;
 const A=RIGA,T=A.torso,Hp=A.hips,legLen=((A.thigh.ky-A.thigh.ay)+(A.shin.fy-A.shin.ay))*LS;
 c.save();c.translate(x,y);if(o.face<0)c.scale(-1,1);
 if(o.an==='spin'){const sp=Math.cos(((o.pr||0))*Math.PI*2);c.scale(Math.abs(sp)<0.15?0.15*Math.sign(sp||1):sp,1);}
 if(o.an==='death'){const d=o.pr||0;c.rotate(-d*1.45);c.translate(-d*o.h*0.25,-d*o.h*0.05);}
 c.scale(S,S);c.scale(RIG_WX,1);c.translate(0,-legLen+bob*1.4);
 const base=o.flash?'brightness(3)':'none';let F=base;const setF=f=>{F=f;};
 const ar=o.armor&&RAM[o.armor]?o.armor:null;
 const ov=(k,ax,ay,sy)=>{const ak=k==='arm2'?'arm':k;if(!ar||!RAM[ar][ak]||!IMG['ra_'+ar+'_'+ak])return;const m=RAM[ar][ak],ff=o.armorTint?(F==='none'?'':F+' ')+o.armorTint:F;c.drawImage(fimg(IMG['ra_'+ar+'_'+ak],ff),-ax+m[0],-ay+m[1]*(sy||1),m[2],m[3]*(sy||1));};
 const part=(k,ax,ay,sy)=>{const im=fimg(IMG['rig_'+k],F);c.drawImage(im,-ax,-ay);ov(k,ax,ay,sy);};
 const boot=()=>{const bi=o.bootI;if(bi==null||!IMG['rboot_'+bi])return;const im=fimg(IMG['rboot_'+bi],F),w=bi===0?150:bi<3?160:150,h=w*im.height/im.width;c.drawImage(im,-A.shin.ax+12,-A.shin.ay+A.shin.fy+6-h,w,h);};
 const leg=(lx,th,sh,dark)=>{c.save();c.translate(lx,0);c.rotate(th);c.scale(LS,LS);if(dark)setF((o.flash?'brightness(3) ':'')+'brightness(0.72)');
  c.save();c.translate(A.thigh.kx-A.thigh.ax,A.thigh.ky-A.thigh.ay-10);c.rotate(sh);part('shin',A.shin.ax,A.shin.ay);boot();c.restore();
  part('thigh',A.thigh.ax,A.thigh.ay);c.restore();setF(base);};
 const waistY=-(Hp.jy-Hp.wy);// 허리(골반 윗선) 위치
 // 망토 (등 뒤)
 if(o.cape&&IMG['rcape_'+(o.cape-1)]){const im=IMG['rcape_'+(o.cape-1)],sway=(o.an==='walk'?0.1+Math.sin(t*9)*0.04:o.an==='dash'?0.45:0.05+Math.sin(t*2.2)*0.02);
  c.save();c.translate(0,waistY);c.rotate(tor);c.translate(T.nx-T.ax-10,T.ny-T.ay+20);c.rotate(sway);const h=440,w=h*im.width/im.height*0.7;c.drawImage(im,-w*0.6,-8,w,h);c.restore();}
 // 뒷팔
 c.save();c.translate(0,waistY);c.rotate(tor);c.translate(T.bx-T.ax,T.by-T.ay);c.rotate(aB);setF((o.flash?'brightness(3) ':'')+'brightness(0.7)');part('arm2',A.arm2.ax,A.arm2.ay,1.1);setF(base);c.restore();
 leg(Hp.lb-Hp.cx,thB,shB,true);leg(Hp.lf-Hp.cx,thF,shF,false);
 c.save();c.translate(0,waistY);c.rotate(tor*0.5);c.translate(0,-waistY);part('hips',Hp.cx,Hp.jy);c.restore();
 c.save();c.translate(0,waistY+8);c.rotate(tor);
  part('torso',T.ax,T.ay);
  // 머리
  c.save();c.translate(T.nx-T.ax,T.ny-T.ay);c.scale(1/RIG_WX,1);c.rotate(-tor*0.5+(o.an==='hurt'?0.2:0));
   const hx=-A.head.ax,hy=-A.head.ay;c.drawImage(fimg(IMG.rig_head,F),hx,hy);
   const hi=o.helmI,hm=hi!=null&&IMG['rhelm_'+hi];
   if((!hm||HAIRUNDER[hi])&&o.hair!=null&&IMG['rhair_'+o.hair]){const m=RHAIR[o.hair];const cl=hm&&HAIRCLIP[hi]!=null;if(cl){const hmm=RHELM[hi];c.save();c.beginPath();c.rect(hx-400,hy+hmm[1]+hmm[3]*HAIRCLIP[hi],1400,1400);c.clip();}if(IMG['rcap_'+o.hair])c.drawImage(fimg(IMG['rcap_'+o.hair],F),hx,hy);c.drawImage(fimg(IMG['rhair_'+o.hair],F),hx+m[0],hy+m[1],m[2],m[3]);if(cl)c.restore();}
   if(hm){const m=RHELM[hi],q=HADJ[hi]||[0,0,1],w=m[2]*q[2],h=m[3]*q[2];c.drawImage(fimg(IMG['rhelm_'+hi],F),hx+m[0]+q[0]-(w-m[2])/2,hy+m[1]+q[1]-(h-m[3])*0.7,w,h);}
  c.restore();
  // 앞팔 + 무기
  c.save();c.translate(T.sx-T.ax,T.sy-T.ay);c.rotate(aF);part('arm',A.arm.ax,A.arm.ay);
   if(o.hand){const im=IMG[o.hand.img];c.translate(A.arm.hx-A.arm.ax,A.arm.hy-A.arm.ay-6);
    if(o.hand.bow){c.rotate(-aF-0.1);drawBow(c,o.hand,wm);}
    else{c.rotate(wm?Math.PI/2-0.25:-0.65-aF*0.3);
    if(im){const L=400*RIG_WPN,hh=L*im.height/im.width;if(o.hand.glow&&!o.flash){c.shadowColor=o.hand.glow;c.shadowBlur=30;}c.drawImage(im,-L*0.14,-hh/2,L,hh);c.shadowBlur=0;}}}
  c.restore();
 c.restore();
 c.filter='none';c.restore();return true;}
function drawBow(c,h,draw){const L=330;c.save();c.lineCap='round';c.strokeStyle='#3a2414';c.lineWidth=26;c.beginPath();c.moveTo(0,-L/2);c.quadraticCurveTo(L*0.42,0,0,L/2);c.stroke();c.strokeStyle=h.col||'#9a6a3a';c.lineWidth=16;c.stroke();
 c.strokeStyle='#eee';c.lineWidth=4;c.beginPath();c.moveTo(0,-L/2);c.lineTo(draw?-60:0,0);c.lineTo(0,L/2);c.stroke();if(h.glow){c.shadowColor=h.glow;c.shadowBlur=24;c.strokeStyle=h.glow;c.lineWidth=5;c.beginPath();c.moveTo(0,-L/2);c.quadraticCurveTo(L*0.42,0,0,L/2);c.stroke();}c.restore();}
function useRecall(){if(P.dead||P.recall)return;if(!P.scroll){toast('귀환 주문서가 없다 — 여관에서 살 수 있다');return;}if(!CUR||CUR.kind==='town'){toast('이미 마을이다');return;}
 const to=CUR.raid&&G.rift?G.rift.town:CUR.pd?0:GROUNDS[CUR.gi]?GROUNDS[CUR.gi].town:0;P.recall={t:1.6,max:1.6,to};toast('귀환 주문 시전… (움직이면 취소)');}
function buyScroll(n){const c=scrollCost()*n;if(P.gold<c)return;P.gold-=c;P.scroll=(P.scroll||0)+n;toast(`귀환 주문서 +${n}`);openBuilding(curBld);}
const scrollCost=()=>40+P.lv*3;
function cycleHair(){P.hair=((P.hair??0)+1)%6;toast('머리: '+HAIR_N[P.hair]);}
function cycleCape(){P.cape=((P.cape??1)+1)%5;toast('망토: '+CAPE_N[P.cape]);}
function toggleRig(){RIG_ON=!RIG_ON;toast(RIG_ON?'부위 조립 캐릭터':'기존 시트 캐릭터');}

const NPC_BODIES=['npc_m1','npc_f1','npc_m2','npc_f2'];
const ANCH=()=>window.SHEET_ANCHORS||{};
function frameRC(L,an,pr,t){const a=L.a[an]||L.a.idle||L.a.move;const n=a[2];const f=pr!=null?Math.min(n-1,Math.max(0,Math.floor(pr*n))):Math.floor(t*(a[3]||8))%n;return[a[0],a[1]+f];}
const TINTC=new Map();
function tinted(img,col,sx,sy,sw,sh){const k=(img.src||'')+'|'+col+'|'+sx+'|'+sy;let cv=TINTC.get(k);if(cv)return cv;cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(sw));cv.height=Math.max(1,Math.round(sh));
 const x=cv.getContext('2d');x.drawImage(img,sx,sy,sw,sh,0,0,cv.width,cv.height);x.globalCompositeOperation='multiply';x.fillStyle=col;x.fillRect(0,0,cv.width,cv.height);
 x.globalCompositeOperation='destination-in';x.drawImage(img,sx,sy,sw,sh,0,0,cv.width,cv.height);if(TINTC.size>1500)TINTC.clear();TINTC.set(k,cv);return cv;}
function drawLayered(c,x,y,o,t){if(o.L===SHEETS.player&&rigReady())return drawRig(c,x,y,o,t);c.imageSmoothingQuality='high';const body=IMG[o.body+'_sheet'],A=ANCH()[o.body];if(!body||!A)return false;const L=o.L,[r,col]=frameRC(L,o.an,o.pr,t);
 const fw=body.width/L.cols,fh=body.height/L.rows,H=o.h,W=H*fw/fh,fi=r*L.cols+col;
 const near=key=>{const own=A.f[r*L.cols+col];if(own&&own[key]&&(key!=='h'||own.h[3]>=0.15))return own[key];if(key==='h'&&(o.an==='attack'||o.an==='cast')){for(const cc of [col+1,col-1]){if(cc<0||cc>=L.cols)continue;const q=A.f[r*L.cols+cc];if(q&&q.h&&q.h[3]>=0.15)return q.h;}}for(const rr of (o.an==='death'&&key==='h')?[r]:(key==='h'&&r>0?[0,r]:[r,0])){for(let d=0;d<L.cols;d++){for(const cc of [col-d,col+d]){if(cc<0||cc>=L.cols)continue;const g=A.f[rr*L.cols+cc];if(g&&g[key]&&(key!=='h'||g.h[3]>=0.15))return g[key];}}}return null;};
 c.save();c.translate(x,y-(o.an==='walk'?Math.abs(Math.sin(t*9))*H*0.03:0));if(o.face<0)c.scale(-1,1);const ox=-W/2,oy=-H+4,U=u=>ox+u*W,V=v=>oy+v*H;const cap=near('c'),hd=near('h');
 if(o.flash)c.filter='brightness(3)';
 if(o.back&&cap&&IMG[o.back]){const im=IMG[o.back],bw=cap[2]*W*1.25,bh=bw*im.height/im.width;c.drawImage(im,U(cap[0])-cap[2]*W*0.75-bw/2,V(cap[1])+cap[3]*H*0.9,bw,bh);}
 c.drawImage(body,col*fw,r*fh,fw,fh,ox,oy,W,H);
 for(const[suf,tc]of[['_boots',o.boots],['_cloth',o.cloth],['_hair',o.hairCol||'#5a3a22']]){const li=IMG[o.body+suf];if(li&&tc){const lw=li.width/L.cols,lh=li.height/L.rows;c.drawImage(tinted(li,tc,col*lw,r*lh,lw,lh),ox,oy,W,H);}}
 if(cap&&o.head){const hk=o.head,im=IMG[hk.img],cx=U(cap[0]),ct=V(cap[1]-cap[3]/2),cb=V(cap[1]+cap[3]/2),cw=cap[2]*W,ch=cap[3]*H;
  c.save();if(hk.clip!=null){c.beginPath();c.rect(-W,-H*2,W*2,cb+ch*hk.clip+H*2);c.clip();}
  if(im&&hk.top!=null){const w=cw*hk.k/hk.dw,h=w*im.height/im.width,x0=cx-w*hk.dcx-cw*0.06+cw*(hk.dx||0),y0=ct-ch*0.04-h*hk.dt;
   c.save();c.beginPath();c.rect(-W*2,-H*3,W*4,H*6);c.rect(cx+cw*0.12,ct+ch*(hk.cl||0.45),W,H);c.clip('evenodd');c.drawImage(im,x0,y0,w,h);c.restore();}
  else if(im){const src=hk.tint?tinted(im,hk.tint,0,0,im.width,im.height):im,w=cw*(hk.wf||1.1),h=w*im.height/im.width;c.drawImage(src,cx-w/2+cw*(hk.dx||0),hk.bot!=null?cb+ch*hk.bot-h:ct-ch*(hk.lift||0),w,h);}
  else if(hk.proc){c.fillStyle=hk.proc;c.beginPath();c.ellipse(cx,cb,cw*0.56,ch*1.05,0,Math.PI,0);c.fill();}
  c.restore();}
 if(hd&&o.hand){const im=IMG[o.hand.img],isP=o.L===SHEETS.player,ci=Math.min(5,col),len=(isP?0.3:0.24)*W;const ang=isP?(PANG[o.an]?PANG[o.an][ci]:0.1)+(o.an==='walk'?Math.sin(t*9)*0.08:0):-1.0;c.save();c.translate(U(hd[0]),V(hd[1]));c.rotate(ang);
  if(im){const w=len*1.2,h=w*im.height/im.width;if(o.hand.glow&&!o.flash){const pu=0.75+Math.sin(t*5)*0.25;c.shadowColor=o.hand.glow;c.shadowBlur=14*pu;c.drawImage(im,-w*0.12,-h/2,w,h);c.globalCompositeOperation='lighter';c.globalAlpha=0.35*pu;c.drawImage(glowed(im,o.hand.glow),-w*0.12,-h/2,w,h);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.shadowBlur=0;}else c.drawImage(im,-w*0.12,-h/2,w,h);}
  else if(o.hand.proc){c.fillStyle='#5a3a20';c.fillRect(-len*0.05,-2,len*0.22,4);c.fillStyle=o.hand.proc;c.fillRect(len*0.17,-1.8,len*0.9,3.6);}c.restore();}
 c.filter='none';c.restore();return true;}
const HELMG=[null,{top:0.483,dt:0.022,dcx:0.503,dw:0.943},{top:0.614,dt:0.042,dcx:0.5,dw:0.961},{top:0.596,dt:0.074,dcx:0.625,dw:0.703,dx:0.22},{top:0.584,dt:0.16,dcx:0.578,dw:0.795,dx:0.12},{top:0.549,dt:0.155,dcx:0.509,dw:0.797}];
const HELM=i=>Object.assign({img:'helm_'+i,proc:HCOL[i],k:1.12,cl:0.42},HELMG[i]);
const HAT={hat_straw:{img:'hat_straw',proc:'#e0c070',wf:1.75,lift:0.25,clip:0.2},hat_wide:{img:'hat_wide',proc:'#8a6a3a',wf:1.95,lift:0.35,clip:0.2},
 hat_hood:{img:'hat_hood',proc:'#5a1a1a',wf:1.3,lift:0.15,clip:0.35},hat_band:{img:'hat_band',proc:'#c84a3a',wf:1.12,lift:0.05,clip:0.15},hat_cap:{img:'hat_cap',proc:'#4a6aa0',wf:1.15,lift:0.15,clip:0.15}};
// 무기 각도는 그림에서 읽지 않고 동작별로 고정 (라디안, 0=정면 수평, +는 아래)
const PANG={idle:[-0.5,-0.5,-0.5,-0.5,-0.5,-0.5],walk:[-0.45,-0.45,-0.45,-0.45,-0.45,-0.45],attack:[-2.3,-2.0,-0.9,0.4,0.85,0.4],
 spin:[0.1,1.15,2.2,3.25,4.3,5.35],dash:[0,0,0,0,0,0.1],cast:[-1.5,-1.5,-1.3,-1.1,-1.1,-1.1],hurt:[-0.8,-0.8],death:[1,1,1,1,1,1]};
const bodyOK=i=>{const im=IMG['body_a'+i+'_sheet'];return im&&ANCH()['body_a'+i]&&im.width/6>=200;};// 새 체형(칸 256px) 시트만 사용
function playerLayer(){let key=null;for(let i=P.a;i>=0;i--){if(bodyOK(i)){key='body_a'+i;break;}}if(!key&&!rigReady())return null;const[an,pr]=playerAnim();
 return{body:key,L:SHEETS.player,an,pr,face:P.face,h:rigReady()?44:62,flash:P.flash>0.5,boots:BCOL[P.b],
  head:P.h>0?HELM(P.h):null,helmI:P.h>0?((eqItem('h')&&HELMV[eqItem('h').v]!=null)?HELMV[eqItem('h').v]:HELMT[P.h]):null,hairCol:'#6a4226',armor:(eqItem('a')&&(eqItem('a').v==='robe'||eqItem('a').v==='plate'))?eqItem('a').v:ARSET[P.a],armorTint:(eqItem('a')&&eqItem('a').v)?null:ARTINT[P.a],bootI:P.b,hair:P.hair??0,cape:P.cape??1,hand:{img:(eqItem('w')&&eqItem('w').v&&IMG['var_'+eqItem('w').v])?'var_'+eqItem('w').v:'wpn_'+P.w,proc:WCOL[P.w],glow:eqGlow(),bow:eqItem('w')&&eqItem('w').v==='bow'}};}
function actorLayer(a){const y=a.look.layer;if(!y||!IMG[y.body+'_sheet']||!ANCH()[y.body])return null;if(((a.npc&&a.npc.role!=='hunter')||a.look.useSheet)&&IMG[a.look.img+'_sheet'])return null;let head,hand=null,cloth=y.cloth;
 if(a.npc&&a.npc.role==='hunter'){const n=a.npc;cloth=ACOL[n.a];head=n.h>0?HELM(n.h):HAT.hat_hood;hand={img:n.cls==='mage'?'var_staff':'wpn_'+n.w,proc:WCOL[n.w]};}
 else{head=y.hat?HAT[y.hat]:null;if(y.hand)hand={img:y.hand,proc:'#7a5a3a'};}
 return{body:y.body,L:SHEETS.npc,an:a.moving?'walk':'idle',pr:null,face:a.face,h:(a.look.h||50)+6,flash:a.flash>0.5,cloth,head,hand,back:y.back,hairCol:y.hairTint,boots:a.npc&&a.npc.role==='hunter'?BCOL[a.npc.b||0]:(y.boots||(y.boots=pick(['#6a4a30','#4a3a2a','#8b5a2b','#3a3a44'])))};}
