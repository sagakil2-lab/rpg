'use strict';
// =====================================================================
//  유틸
// =====================================================================
const R=Math.random,rnd=(a,b)=>a+R()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(R()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),$=s=>document.querySelector(s),fmt=n=>Math.round(n).toLocaleString();
const DPR=Math.min(2,window.devicePixelRatio||1);
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const HOUR_SEC=10; // 실제 10초 = 게임 1시간
