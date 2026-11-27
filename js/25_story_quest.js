'use strict';
// =====================================================================
//  메인 스토리 「봉인의 열 마을」 — 퀘스트·대화
// =====================================================================
const SNPC=[
 {n:'브란',t:'모험가 길드장',town:0,img:'npc_elder'},
 {n:'엘리나',t:'숲의 연금술사',town:1,img:'npc_mage'},
 {n:'고린',t:'드워프 대장장이',town:2,img:'npc_smith'},
 {n:'마르코',t:'항구의 선장',town:3,img:'npc_fisher'},
 {n:'레온',t:'드라칸 기사단장',town:4,img:'npc_guard'},
 {n:'실바',t:'요정 순찰대장',town:5,img:'npc_archer'},
 {n:'오르텐',t:'오르비스 대학자',town:6,img:'npc_priest'},
 {n:'자파르',t:'사막의 대상인',town:7,img:'npc_trader'},
 {n:'하랄',t:'북방의 광산왕',town:8,img:'npc_miner'},
 {n:'노아',t:'심연의 예언자',town:9,img:'npc_kid'},
];
const CHAP=['','1장 · 견습 모험가','2장 · 독안개의 숲','3장 · 소금바람 항구','4장 · 드워프의 광산','5장 · 요새의 맹세','6장 · 요정의 숲','7장 · 학자의 도시','8장 · 모래 폭풍','9장 · 북방의 왕','10장 · 심연','에필로그'];
// q(장, 의뢰인, 보고 대상, 요구Lv, 제목, 목표, 시작 대사[], 완료 대사[], 보상배율, 장 마무리?)
const MQ=[];const q=(ch,g,to,lv,title,o,s,e,f=0.6,end=false)=>MQ.push({ch,g,to:to==null?g:to,lv,title,o,s,e,f,end});
// ── 1장 아르덴
q(1,0,0,1,'길드에 온 것을 환영한다',{t:'talk'},['자네가 새로 등록한 모험가인가? 나는 아르덴 모험가 길드장 브란일세.','요즘 왕국 곳곳에 이상한 「균열」이 열린다는 소문이 돌고 있지. 하지만 그 전에… 자네는 검부터 제대로 휘둘러 봐야겠군.'],['좋아, 눈빛은 쓸 만하군. 동쪽 문 밖 초록 들판부터 시작하게.'],0.5);
q(1,0,0,1,'들판의 말썽꾼들',{t:'kill',g:0,n:8},['초록 들판의 슬라임과 들쥐가 밭을 망치고 있다네. 8마리만 정리해 주게.','공격은 Space, 스킬은 1~4번일세. 위험하면 Q로 물약을 마시고.'],['훌륭해! 첫 사냥치고는 깔끔하군.']);
q(1,0,0,2,'재료 상인의 부탁',{t:'collect',m:0,n:5},['재료 거래소에서 슬라임 젤이 모자란다더군. 젤 5개를 모아 오게.','몬스터가 떨어뜨린 재료는 가방(B)에 쌓인다네.'],['고맙네. 이 젤은 물약의 원료가 되지. 마을의 경제는 자네 같은 사냥꾼이 돌린다네.']);
q(1,0,0,2,'장비를 갖추자',{t:'buy',n:1},['맨손으로는 오래 못 버티네. 대장간이나 재료상에서 아무거나 하나 사 보게.','장인들은 사냥꾼이 판 재료로 물건을 만든다네. 재료가 없으면 진열대도 비지.'],['그렇지! 장비창(G)에서 끌어다 바꿔 낄 수도 있다네.']);
q(1,0,0,3,'이끼 동굴 조사',{t:'kill',g:1,n:10},['북쪽 이끼 동굴에서 코볼트들이 이상하게 흥분해 있다는 보고가 왔네.','동굴 몬스터 10마리를 처치하고 안쪽 상황을 살펴 주게.'],['…동굴 깊은 곳에서 「검은 빛」을 봤다고? 불길하군.']);
q(1,0,0,5,'동굴 군주 토벌',{t:'boss',g:1},['동굴 군주 도마뱀이 검은 빛에 홀려 날뛰고 있다는 게 확실해졌네.','자네라면 할 수 있어. 동굴 가장 깊은 곳의 군주를 쓰러뜨리게!'],['이건… 도마뱀의 비늘에 박혀 있던 「검은 균열 조각」이군.','이런 걸 아는 사람은 벨모어 숲의 연금술사 엘리나뿐일세. 역마차를 타고 가 보게.'],1.2,true);
// ── 2장 벨모어
q(2,0,1,5,'숲의 연금술사',{t:'talk'},['벨모어의 엘리나에게 균열 조각을 보여 주게. 역마차(🐎) 정류장이나 월드맵(M)으로 갈 수 있네.'],['어머, 브란 할아버지가 보내셨군요? 이 조각… 공허의 기운이 스며 있어요.','숲에도 같은 기운 때문에 독안개가 짙어지고 있답니다.']);
q(2,1,1,6,'속삭이는 숲의 늑대',{t:'kill',g:2,n:15},['안개를 먹은 늑대와 거미들이 숲길을 막고 있어요. 15마리만 처치해 주세요.'],['덕분에 약초꾼들이 다시 숲에 들어갈 수 있겠어요.']);
q(2,1,1,7,'해독제 재료',{t:'collect',m:11,n:6},['독안개를 막을 해독제를 만들려면 거미줄이 필요해요. 6개만 구해 주세요.'],['완벽해요! 이걸로 마을 사람들을 지킬 수 있어요.']);
q(2,1,1,9,'독안개 늪의 근원',{t:'kill',g:3,n:15},['안개는 남쪽 독안개 늪에서 흘러나와요. 리자드맨과 늪 괴물을 처치하며 근원을 찾아 주세요.'],['늪 한가운데에 작은 균열이 있었다고요? …점점 커지고 있어요.']);
q(2,1,1,9,'독 주머니 분석',{t:'collect',m:19,n:3},['균열 근처 몬스터의 독 주머니를 분석하면 공허의 정체를 알 수 있을 거예요. 3개만요.'],['결과가 나왔어요. 이건 수백 년 전 열 마을이 봉인한 「공허의 군주」의 기운이에요!']);
q(2,1,1,10,'숲 속의 보물',{t:'chest',n:1},['옛 봉인 기사들은 숲 곳곳에 보급품을 숨겨 두었대요. 사냥터에서 빛나는 보물상자를 하나 열어 보세요.'],['역시 상자 안에 봉인 문양이 새겨져 있었네요.','봉인의 기록을 더 알려면 항구 도시 시엘라의 마르코 선장을 찾아가세요. 그분 배에 옛 해도가 있어요.'],1,true);
// ── 3장 시엘라
q(3,1,3,11,'소금바람 항구',{t:'talk'},['시엘라의 마르코 선장을 찾아가세요. 성격이 좀… 거칠어요.'],['하! 엘리나가 보냈다고? 마침 일손이 필요했지.','바다에서도 해적 해골들이 되살아나고 있어. 다 그 균열 탓이지.']);
q(3,3,3,12,'해안의 해골 해적',{t:'kill',g:4,n:20},['소금 해안의 해적 해골과 집게 게를 20마리 쓸어 버려!'],['속이 시원하군! 자네 실력 좀 보는데?']);
q(3,3,3,12,'선원들의 보수',{t:'collect',m:24,n:2},['배를 띄우려면 선원들 보수가 필요해. 진주 2개면 된다고.'],['좋아, 이 정도면 한 달은 먹고 살겠군.']);
q(3,3,3,13,'항구 교역',{t:'sell',n:20},['항구는 교역으로 먹고 산다네. 재료상에 재료 20개를 팔아 시장을 돌게 해 줘.'],['시장에 활기가 돌아왔어. 자네 덕이야.']);
q(3,3,3,14,'항해 준비',{t:'equip',k:'a',n:2},['북쪽 광산으로 가는 바닷길은 험하다네. 2등급 이상 갑옷(비늘 갑옷 등)을 입고 와.'],['이제 좀 모험가 같군!','옛 해도에 따르면 첫 번째 봉인석은 카락 광산 깊은 곳에 있어. 드워프 고린에게 가 봐.'],1,true);
// ── 4장 카락
q(4,3,2,14,'드워프의 광산',{t:'talk'},['카락의 고린을 찾아가. 술 한 병 들고 가면 더 좋고.'],['흠, 인간 모험가로군. 봉인석 얘기라면… 광산이 미쳐 버린 이유가 그거였나.']);
q(4,2,2,15,'버려진 광산의 골렘',{t:'kill',g:5,n:20},['광산 골렘들이 광부를 공격하고 있네. 20마리 부숴 주게.'],['돌 부스러기 소리가 좋군!']);
q(4,2,2,15,'봉인 무기의 재료',{t:'collect',m:25,n:6},['공허에 맞설 무기를 만들려면 은광석 6개가 필요하네.'],['좋은 광석이야. 이제 진짜 대장장이 솜씨를 보여 주지.']);
q(4,2,2,16,'장인의 특수 제작',{t:'special',n:1},['대장간의 「✨ 특수 제작」에서 특수 재료로 장비를 하나 만들어 보게. 공허와 싸우려면 평범한 무기로는 부족해.'],['자네 손에 꼭 맞는군.']);
q(4,2,2,17,'고대 골렘',{t:'boss',g:5},['광산 가장 깊은 곳, 봉인석을 지키던 고대 골렘이 공허에 먹혔네. 쓰러뜨려 봉인석을 되찾아 주게!'],['…이게 첫 번째 「봉인 파편」이군. 열 마을에 하나씩, 공허의 군주 「녹시아」를 가둔 열 개의 봉인.','봉인이 깨질 때마다 균열이 열리는 거야. 드라칸의 기사단장 레온에게 알려야 해.'],1.2,true);
q(4,2,2,18,'붉은 협곡 정찰',{t:'kill',g:6,n:20},['드라칸으로 가는 길목, 붉은 협곡을 정리해 두게. 하피와 오우거가 들끓는다네.'],['길이 열렸군. 레온은 고집불통이지만 믿을 만한 사내라네.']);
// ── 5장 드라칸
q(5,2,4,20,'요새의 맹세',{t:'talk'},['드라칸 요새의 레온 기사단장에게 봉인 파편을 보여 주게.'],['봉인 파편이라… 기사단의 오래된 맹세가 떠오르는군. 「열 개의 봉인이 깨지는 날, 우리는 칼을 든다」.']);
q(5,4,4,21,'망자의 군주',{t:'boss',g:7},['아르덴 남쪽 묘지에서 리치 군주가 죽은 자들을 일으키고 있네. 두 번째 봉인이 거기 있지.'],['두 번째 봉인 파편이군. 자네 같은 모험가가 열 명만 있어도…']);
q(5,4,4,22,'지하 훈련장',{t:'dungeon'},['혼자서는 한계가 있네. 몬스터 코어로 자네만의 던전을 세워 다른 사냥꾼들을 단련시키게. 아르덴의 자네 집에서 관리할 수 있지.'],['좋아! 사냥꾼들이 강해지면 마을도 강해진다.']);
q(5,4,4,25,'얼음 봉우리',{t:'kill',g:8,n:25},['북쪽 얼음 봉우리의 설인과 서리 늑대가 요새 보급로를 끊었네. 25마리!'],['보급로가 뚫렸군. 고맙네.']);
q(5,4,4,25,'서리 결정',{t:'collect',m:43,n:4},['봉인 파편을 안정시키려면 서리 결정이 필요하다더군. 4개.'],['파편의 떨림이 멈췄어.']);
q(5,4,4,26,'균열을 닫아라',{t:'rift',n:1},['마을에 차원 균열이 열리면 사냥꾼을 원정대로 모아 보스를 쓰러뜨리게. 균열을 하나 닫고 오게.','균열은 가끔 열리니 월드맵(M)에서 🌀 표시를 확인하게.'],['훌륭하네. 자네는 이제 진짜 균열 사냥꾼이야.']);
q(5,4,4,30,'화룡 이그니스',{t:'boss',g:9},['용의 둥지의 화룡 이그니스가 세 번째 봉인을 삼켰네. 이건 기사단 전체의 숙원이었지… 부탁하네.'],['이그니스가 쓰러지며 말했다고? 「녹시아가 깨어난다… 요정의 숲이 다음이다」…','미르나로 가게. 요정 순찰대장 실바가 기다릴 걸세.'],1.5,true);
// ── 6장 미르나
q(6,4,5,30,'요정의 숲',{t:'talk'},['미르나의 요정 실바를 찾아가게. 월드맵(M)으로 워프할 수 있네.'],['인간이 이 숲까지… 브란의 제자로군. 숲이 「흉포한」 기운에 물들고 있어.']);
q(6,5,5,31,'깊은 초록 들판',{t:'kill',g:10,n:30},['깊은 초록 들판의 흉포한 몬스터 30마리를 처치해. 빛나는 놈들은 평소보다 훨씬 강하니 조심하고.'],['빛이 조금 옅어졌어.']);
q(6,5,5,33,'흉포한 동굴 군주',{t:'boss',g:11},['깊은 이끼 동굴의 군주가 네 번째 봉인을 지키고 있어.'],['네 번째 봉인 파편… 녹시아의 목소리가 들렸다고? 위험해.']);
q(6,5,5,39,'깊은 늪 정화',{t:'kill',g:13,n:30},['깊은 독안개 늪을 정화해야 해. 30마리.'],['숲이 조금씩 숨을 쉬기 시작했어.']);
q(6,5,5,40,'숨겨진 보급품',{t:'chest',n:3},['옛 봉인 기사들의 보급품 상자를 3개 더 찾아 줘. 그 안의 문양이 봉인 위치를 알려 줄 거야.'],['문양을 맞춰 보니… 다섯 번째 봉인은 깊은 광산에 있어.']);
q(6,5,5,45,'흉포한 고대 골렘',{t:'boss',g:15},['깊은 버려진 광산의 고대 골렘을 쓰러뜨려 다섯 번째 봉인을 되찾아.'],['다섯 개… 절반이야. 하지만 녹시아도 서두르고 있어.','오르비스의 대학자 오르텐이라면 봉인을 되살리는 법을 알 거야.'],1.5,true);
// ── 7장 오르비스
q(7,5,6,45,'학자의 도시',{t:'talk'},['오르비스의 오르텐에게 가 봐. 고대 유적 위에 세운 도시야.'],['오오, 봉인 파편 다섯 개! 이건 역사적인 발견일세!','봉인을 다시 세우려면 균열 그 자체의 힘이 필요하네.']);
q(7,6,6,51,'흉포한 망자의 군주',{t:'boss',g:17},['깊은 묘지의 리치 군주가 여섯 번째 봉인을 갖고 있네.'],['여섯 번째! 기록과 정확히 일치하는군.']);
q(7,6,6,52,'균열 파편 연구',{t:'collect',m:60,n:10},['균열에서 나온 몬스터의 「균열 파편」 10개를 가져오게. 봉인을 되살리는 열쇠야.'],['파편의 진동수를 분석하면… 그렇군, 공허는 「빛나는 변종」을 통해 힘을 모으고 있었어!']);
q(7,6,6,53,'균열 진압',{t:'rift',n:1},['또 균열이 열릴 걸세. 하나 더 닫아 주게. 「악한 균열」이 열린다면 각오하고.'],['자네의 이름이 학회지에 실릴 걸세.']);
q(7,6,6,55,'흉포한 협곡',{t:'kill',g:18,n:40},['깊은 붉은 협곡의 몬스터 40마리를 처치해 일곱 번째 봉인으로 가는 길을 열게.'],['길이 열렸네.']);
q(7,6,6,60,'흉포한 화룡',{t:'boss',g:19},['깊은 용의 둥지의 화룡이 일곱 번째 봉인을 품고 있네.'],['일곱 번째… 하지만 다음 봉인들은 「저주받은」 땅에 있네. 사하르의 대상인 자파르가 길을 알지.'],1.5,true);
// ── 8장 사하르
q(8,6,7,60,'모래 폭풍',{t:'talk'},['사하르의 자파르를 찾아가게. 돈만 주면 지옥 길도 안내하는 사내지.'],['봉인? 저주받은 땅? 흠, 위험한 일엔 값이 붙는 법이지.']);
q(8,7,7,61,'저주받은 들판',{t:'kill',g:20,n:40},['저주받은 초록 들판에서 40마리. 먼저 실력을 보여 줘야 길을 알려 주지.'],['좋아, 쓸 만하군.']);
q(8,7,7,63,'저주받은 동굴 군주',{t:'boss',g:21},['저주받은 이끼 동굴 군주. 여덟 번째 봉인이 거기 있다는 소문이 있어.'],['소문이 맞았군! 이 정보는 비싸다고.']);
q(8,7,7,65,'대상인의 거래',{t:'sell',n:100},['사막에서는 물건이 돌아야 사람이 산다. 재료 100개를 팔아 시장을 살려 줘.'],['하하! 사하르의 시장이 다시 북적이는군.']);
q(8,7,7,75,'저주받은 광산',{t:'boss',g:25},['저주받은 광산의 고대 골렘이 아홉 번째 봉인을 지킨다.'],['아홉 개… 마지막은 북쪽 끝, 노스헤임의 하랄 왕이 지키고 있지.'],1.5,true);
// ── 9장 노스헤임
q(9,7,8,75,'북방의 왕',{t:'talk'},['노스헤임의 광산왕 하랄을 찾아가. 성질은 불같지만 의리는 있다.'],['남쪽 꼬맹이가 봉인 아홉 개를 모았다고? 하하하! 마음에 드는군!','하지만 마지막 봉인은 이미 깨졌다네. 심연이 열려 버렸어.']);
q(9,8,8,81,'저주받은 묘지',{t:'boss',g:27},['먼저 저주받은 묘지의 리치 군주를 쓰러뜨려 망자들의 길을 막게.'],['좋아! 북방의 전사들이 자네를 칭송하는군.']);
q(9,8,8,90,'저주받은 화룡',{t:'boss',g:29},['저주받은 용의 둥지에서 화룡이 공허의 날개를 달고 깨어났네.'],['그 화룡이 품고 있던 건… 깨진 열 번째 봉인 조각이야.']);
q(9,8,8,91,'심연의 들판',{t:'kill',g:30,n:50},['심연의 기운이 북방까지 내려왔네. 심연의 들판에서 50마리!'],['북방은 버틸 수 있겠군.']);
q(9,8,8,95,'차원의 핵',{t:'collect',m:62,n:2},['깨진 봉인을 다시 붙이려면 「차원의 핵」 2개가 필요하네. 균열 보스에게서만 나오지.'],['이걸로 봉인을 임시로 붙일 수 있어. 하지만 녹시아를 끝장내려면 심연으로 내려가야 해.','아비스 항구의 예언자 노아가 길을 안다네. 아직 어린아이지만… 운명을 보는 눈이 있지.'],1.5,true);
// ── 10장 아비스
q(10,8,9,95,'심연의 예언자',{t:'talk'},['아비스의 노아를 찾아가게. 이 세계의 마지막 항구일세.'],['…기다리고 있었어요. 꿈에서 당신을 봤어요.','녹시아는 다섯 개의 「태초의 그릇」에 힘을 나눠 숨겼어요. 그걸 모두 깨야 해요.']);
q(10,9,9,99,'심연의 동굴 군주',{t:'boss',g:31},['첫 번째 그릇은 심연의 이끼 동굴 군주예요.'],['하나… 녹시아가 화를 내고 있어요.']);
q(10,9,9,105,'심연의 광산',{t:'boss',g:35},['두 번째 그릇은 심연의 광산 고대 골렘이에요.'],['둘… 어둠이 조금 걷혔어요.']);
q(10,9,9,111,'심연의 묘지',{t:'boss',g:37},['세 번째 그릇은 심연의 묘지. 죽음 그 자체가 지키고 있어요.'],['셋…']);
q(10,9,9,120,'심연의 화룡',{t:'boss',g:39},['네 번째 그릇은 심연의 화룡이에요. 지금까지 중 가장 강해요.'],['넷… 이제 마지막 하나.']);
q(10,9,9,126,'태초의 동굴',{t:'boss',g:41},['태초의 땅이 열렸어요. 태초의 동굴 군주가 녹시아의 문지기예요.'],['문이 열렸어요. 녹시아가 기다리고 있어요.']);
q(10,9,9,135,'태초의 광산',{t:'boss',g:45},['태초의 광산에서 녹시아의 심장이 뛰고 있어요.'],['심장이 멈췄어요…! 하지만 녹시아는 마지막 그릇으로 도망쳤어요.']);
q(10,9,9,141,'태초의 묘지',{t:'boss',g:47},['태초의 묘지. 녹시아의 그림자가 거기 있어요.'],['그림자가 사라졌어요. 마지막은… 태초의 화룡이에요.']);
q(10,9,9,150,'공허의 군주 녹시아',{t:'boss',g:49},['태초의 화룡이 녹시아의 마지막 그릇이에요. 이걸 쓰러뜨리면 열 개의 봉인이 다시 세워질 거예요.','…부디 살아서 돌아오세요.'],['해냈어요… 균열이 닫히고 있어요! 열 마을의 봉인이 다시 빛나요!','당신은 이제 전설이에요.'],3,true);
q(11,9,0,150,'전설의 귀환',{t:'talk'},['아르덴의 브란 할아버지가 기다리고 계실 거예요.'],['…허허, 정말 해냈구먼. 처음 길드에 왔을 때가 엊그제 같은데.','이제 이 세계는 자네 이야기를 영원히 노래할 걸세. 하지만 모험은 끝나지 않지. 균열 사냥꾼의 일은 계속된다네!'],2,true);

// ── 진행 상태
function qInit(){if(!P.mq)P.mq={i:0,st:'new',c:0};if(!P.side)P.side=[];if(!P.sideDay)P.sideDay=-1;}
const curQ=()=>MQ[P.mq.i];
function qNeed(Q){return Q.o.n||1;}
function qProgress(Q){const o=Q.o;if(P.mq.st!=='active')return 0;
 if(o.t==='collect')return Math.min(o.n,P.bag[o.m]||0);if(o.t==='lv')return Math.min(o.n,P.lv);if(o.t==='equip'){const it=eqItem(o.k);return it&&it.t>=o.n?1:0;}if(o.t==='dungeon')return P.duns&&P.duns.length?1:0;return Math.min(qNeed(Q),P.mq.c);}
function qDone(Q){if(Q.o.t==='talk')return true;return qProgress(Q)>=(Q.o.t==='equip'||Q.o.t==='dungeon'||Q.o.t==='boss'?1:qNeed(Q));}
function qGoal(Q){const o=Q.o,G2=o.g!=null?GROUNDS[o.g]:null,N=SNPC[Q.to];
 return o.t==='talk'?`${TOWNS[N.town].name}의 ${N.n}와(과) 대화`:o.t==='kill'?`${G2.name}(Lv${G2.lv}) 몬스터 처치 ${qProgress(Q)}/${o.n}`:o.t==='boss'?`${G2.name}(Lv${G2.lv})의 보스 👑${G2.boss[0]} 처치 ${qProgress(Q)}/1`:
  o.t==='collect'?`${MATS[o.m].name} 모으기 ${qProgress(Q)}/${o.n}`:o.t==='buy'?`상점에서 물건 구입 ${qProgress(Q)}/${o.n}`:o.t==='sell'?`재료 판매 ${qProgress(Q)}/${o.n}`:o.t==='equip'?`${o.n}등급 이상 ${GEARK[o.k][1]} 장착`:
  o.t==='special'?`대장간 특수 제작 ${qProgress(Q)}/1`:o.t==='dungeon'?'나만의 던전 건설 (U)':o.t==='rift'?`차원 균열 닫기 ${qProgress(Q)}/${o.n}`:o.t==='chest'?`보물상자 열기 ${qProgress(Q)}/${o.n}`:'';}
function qReward(Q){const L=Math.max(1,Q.lv),exp=Math.round(expNeedL(L)*Q.f),gold=Math.round(25*Math.pow(L,1.35)*Q.f*2);return{exp,gold,sp:Q.end?1:0,item:Q.end};}
function questEv(t,a,b){if(!P||!P.mq)return;const Q=curQ();if(Q&&P.mq.st==='active'){const o=Q.o;let hit=false;
  if(o.t==='kill'&&t==='kill'&&a===o.g)hit=true;if(o.t==='boss'&&t==='kill'&&a===o.g&&b)hit=true;if(o.t===t&&['buy','sell','special','rift','chest'].includes(t)){P.mq.c+=(t==='sell'?a:1);hit=null;}
  if(hit){P.mq.c++;}if(hit!==false&&qDone(Q)&&!P.mq.toast){P.mq.toast=1;toast(`✅ 「${Q.title}」 목표 달성! ${SNPC[Q.to].n}에게 보고하자`);sfx('quest');}}
 for(const s of P.side){if(s.done)continue;if(s.t===t&&(s.t!=='kill'||s.g===a))s.c+=(t==='sell'?a:1);if(s.t==='collect')continue;if(s.c>=s.n)sideDone(s);}}
function qAccept(){P.mq.st='active';P.mq.c=0;P.mq.toast=0;const Q=curQ();toast(`📜 퀘스트 수락: ${Q.title}`);sfx('quest');news(`📜 [${CHAP[Q.ch]}] ${Q.title} — ${qGoal(Q)}`,'me');}
function qComplete(){const Q=curQ();if(Q.o.t==='collect')addBag(P.bag,Q.o.m,-Q.o.n);const r=qReward(Q);P.gold+=r.gold;P.sp+=r.sp;gainExp(r.exp);
 let extra='';if(r.item){const k=pick(['w','a','h','b','r','n']),t=clamp(lvTier(Q.lv)+1,1,5);const it=plusItem(makeItem(k,k==='r'||k==='n'?Math.min(3,t):t,0.6,2),plusOf(Q.lv));gainItem(it,true);extra=` · 🎁${it.name}`;}
 addDia(Q.end?30:5+Q.ch,'퀘스트');sfx('questdone');news(`🏆 퀘스트 완료: ${Q.title} (+${fmt(r.exp)} EXP, +${fmt(r.gold)}G${r.sp?' · SP+1':''}${extra})`,'me');toast(`🏆 ${Q.title} 완료!`);
 if(Q.end&&MQ[P.mq.i+1]&&MQ[P.mq.i+1].ch!==Q.ch){const nc=MQ[P.mq.i+1].ch;P.pendingScene=nc===11?'end':'ch'+nc;}
 if(Q.end&&MQ[P.mq.i+1]&&MQ[P.mq.i+1].ch!==Q.ch)setTimeout(()=>toast(`📖 ${CHAP[MQ[P.mq.i+1].ch]} 시작`),1500);
 P.mq.i++;P.mq.st='new';P.mq.c=0;P.mq.toast=0;}
// ── 대화창
const DLG={lines:[],i:0,sid:0,after:null};
function portrait(sid,sz){const N=SNPC[sid],im=IMG['por_'+sid];if(im)return`<img src="${im.src}" style="width:${sz}px;height:${sz}px;border-radius:12px;border:3px solid #c8962e;object-fit:cover;background:#3a2a1a">`;
 const sh=IMG[N.img+'_sheet'];if(!sh)return`<div style="width:${sz}px;height:${sz}px;font-size:${sz*0.6}px;text-align:center">🧙</div>`;const cv=document.createElement('canvas');cv.width=cv.height=sz;const c=cv.getContext('2d'),fw=sh.width/4,fh=sh.height/2;
 c.fillStyle='#3a2a1a';c.fillRect(0,0,sz,sz);c.drawImage(sh,fw*0.14,fh*0.04,fw*0.72,fw*0.72,0,0,sz,sz);return`<img src="${cv.toDataURL()}" style="width:${sz}px;height:${sz}px;border-radius:12px;border:3px solid #c8962e">`;}
function dlgShow(sid,lines,after,btn){DLG.sid=sid;DLG.lines=lines;DLG.i=0;DLG.after=after;DLG.btn=btn;dlgRender();}
function dlgRender(){const N=SNPC[DLG.sid],last=DLG.i>=DLG.lines.length-1,Q=curQ();sfx('click');
 openModal(`<div style="display:flex;gap:12px;align-items:flex-start">${portrait(DLG.sid,96)}<div style="flex:1"><div style="font-size:16px;font-weight:800;color:#ffd98a">${N.n} <span class="mut" style="font-size:12px;font-weight:400">${N.t} · ${TOWNS[N.town].name}</span></div>
  <div style="margin-top:8px;font-size:14.5px;line-height:1.6;min-height:64px;background:rgba(0,0,0,.25);border-radius:10px;padding:10px">${DLG.lines[DLG.i]}</div>
  <div class="mut" style="font-size:11px;margin-top:4px">${DLG.i+1} / ${DLG.lines.length}</div></div></div>
  ${last&&DLG.btn?DLG.btn:`<button class="btn w" onclick="dlgNext()">${last?'닫기':'다음 ▶'}</button>`}`);}
function dlgNext(){if(DLG.i<DLG.lines.length-1){DLG.i++;dlgRender();return;}closeModal();const f=DLG.after;DLG.after=null;if(f)f();}
function openStory(sid){qInit();if(P.pendingScene&&SCN[P.pendingScene]){const id=P.pendingScene;P.pendingScene=null;playScene(id,()=>openStory(sid));return;}const Q=curQ(),N=SNPC[sid];
 if(Q&&P.mq.st==='active'&&Q.to===sid&&qDone(Q)){const r=qReward(Q);
  dlgShow(sid,Q.e,null,`<div class="sdet" style="margin:8px 0"><b>🏆 보상</b> <span class="gold">+${fmt(r.exp)} EXP · +${fmt(r.gold)}G${r.sp?' · 스킬 포인트 +1':''}${r.item?' · 🎁 희귀 장비':''}</span></div><button class="btn w" onclick="closeModal();qComplete();setTimeout(()=>openStory(${sid}),350)">보상 받기</button>`);return;}
 if(Q&&P.mq.st==='new'&&Q.g===sid){if(P.lv<Q.lv){dlgShow(sid,[`조금 더 강해지고 오게. 다음 일은 위험하거든. (Lv${Q.lv} 필요)`,...sideHint()],null);return;}
  dlgShow(sid,Q.s,null,`<div class="sdet" style="margin:8px 0"><b>📜 ${CHAP[Q.ch]} — ${Q.title}</b><br><span style="font-size:12.5px">목표: ${qGoal(Q)}</span></div><button class="btn w" onclick="closeModal();qAccept();if(curQ()&&curQ().o.t==='talk'&&curQ().to===${sid}&&P.mq.st==='active')openStory(${sid})">✅ 수락</button><button class="btn w g" onclick="closeModal()">나중에</button>`);return;}
 const idle=Q&&P.mq.st==='active'?(Q.to===sid?[`${Q.title}… 목표: ${qGoal(Q)}`]:[`지금은 「${Q.title}」에 집중하게. ${SNPC[Q.to].n}이(가) 기다리고 있을 걸세.`]):[pick(['오늘도 무사하길.','균열이 또 열리면 꼭 알려 주게.','자네 소문은 여기까지 들렸다네.'])];
 dlgShow(sid,[...idle],null,`<button class="btn w" onclick="closeModal();openBoard(${sid})">📋 의뢰 게시판</button><button class="btn w g" onclick="closeModal()">닫기</button>`);}
function sideHint(){return['기다리는 동안 「의뢰 게시판」의 일을 해 보는 건 어떤가?'];}
// ── 의뢰 게시판 (반복 퀘스트)
function genSides(sid){const day=Math.floor(G.hour/24);P.board=P.board||{};if(P.board.day===day&&P.board[sid])return P.board[sid];if(P.board.day!==day)P.board={day};
 const rng=mulberry(day*31+sid*7+P.lv),pk=a=>a[Math.floor(rng()*a.length)];const gs=GROUNDS.map((g,i)=>[g,i]).filter(([g])=>g.lv<=P.lv+2&&g.lv>=P.lv-12&&TOWNS[g.town].unlock<=P.lv);const L=[];
 for(let k=0;k<3;k++){const[g,gi]=gs.length?pk(gs):[GROUNDS[0],0];const ty=rng()<0.55?'kill':rng()<0.6?'collect':'chest';const s={id:day+'_'+sid+'_'+k,t:ty,g:gi,c:0,lv:g.lv};
  if(ty==='kill'){s.n=10+Math.floor(rng()*15);s.title=`${g.name} 소탕`;}else if(ty==='collect'){s.m=g.matIds[Math.floor(rng()*4)];s.n=4+Math.floor(rng()*6);s.title=`${MATS[s.m].name} 납품`;}else{s.n=1;s.title='보물상자 회수';}
  L.push(s);}P.board[sid]=L;return L;}
function sideGoal(s){return s.t==='kill'?`${GROUNDS[s.g].name} 몬스터 ${Math.min(s.c,s.n)}/${s.n}`:s.t==='collect'?`${MATS[s.m].name} ${Math.min(P.bag[s.m]||0,s.n)}/${s.n} (가방에 모이면 자동 납품)`:`보물상자 ${s.c}/${s.n}`;}
const sideRew=s=>({exp:Math.round(expNeedL(Math.max(1,Math.min(P.lv,s.lv+3)))*0.12*(s.t==='chest'?1.5:1)),gold:Math.round(20*Math.pow(Math.max(1,s.lv),1.25)*(s.t==='chest'?1.5:1))});
function openBoard(sid){const L=genSides(sid),act=P.side.filter(s=>!s.done);
 openModal(`<h2>📋 의뢰 게시판 — ${TOWNS[SNPC[sid].town].name} <span class="mut" style="font-size:12px">매일 갱신 · 최대 3개 진행</span></h2>
 ${L.map(s=>{const r=sideRew(s),taken=P.side.some(x=>x.id===s.id);return`<div class="news" style="display:flex;align-items:center;gap:8px"><div style="flex:1"><b>${s.title}</b> <span class="mut">Lv${s.lv}</span><br><span style="font-size:12px">${sideGoal(s)}</span><br><span class="gold" style="font-size:11.5px">+${fmt(r.exp)} EXP · +${fmt(r.gold)}G</span></div>
  <button class="btn s" ${taken||act.length>=3?'disabled':''} onclick="takeSide('${s.id}',${sid})">${taken?'진행 중':'수락'}</button></div>`;}).join('')}
 <h3>진행 중인 의뢰 ${act.length}/3</h3>${act.map(s=>`<div class="news">• <b>${s.title}</b> — ${sideGoal(s)}</div>`).join('')||'<p class="d">없음</p>'}
 <button class="btn w g" onclick="closeModal()">닫기</button>`);}
function takeSide(id,sid){const s=genSides(sid).find(x=>x.id===id);if(!s||P.side.filter(x=>!x.done).length>=3)return;P.side.push(Object.assign({},s,{c:0}));sfx('quest');toast(`📋 의뢰 수락: ${s.title}`);openBoard(sid);}
function sideDone(s){s.done=true;addDia(2);if(s.t==='collect')addBag(P.bag,s.m,-s.n);const r=sideRew(s);P.gold+=r.gold;gainExp(r.exp);sfx('questdone');toast(`📋 의뢰 완료: ${s.title} (+${fmt(r.gold)}G)`);news(`📋 의뢰 완료: ${s.title} +${fmt(r.exp)} EXP +${fmt(r.gold)}G`,'me');P.side=P.side.filter(x=>!x.done||x===s).slice(-10);}
function questPoll(){if(!P||!P.mq)return;for(const s of P.side)if(!s.done&&s.t==='collect'&&(P.bag[s.m]||0)>=s.n)sideDone(s);P.side=P.side.filter(s=>!s.done);
 const Q=curQ();if(Q&&P.mq.st==='active'&&!P.mq.toast&&Q.o.t!=='talk'&&qDone(Q)){P.mq.toast=1;toast(`✅ 「${Q.title}」 목표 달성! ${SNPC[Q.to].n}에게 보고하자`);sfx('quest');}
 const el=$('#qtrack');if(!el)return;if(!Q){el.innerHTML='<b>🏆 모든 이야기를 마쳤다</b>';return;}const N=SNPC[P.mq.st==='active'?Q.to:Q.g];
 el.innerHTML=`<div class="qh">📖 ${CHAP[Q.ch]}</div><b>${Q.title}</b><div>${P.mq.st==='new'?(P.lv<Q.lv?`🔒 Lv${Q.lv} 필요`:`❗ ${TOWNS[N.town].name}의 ${N.n}에게 말을 걸자`):(qDone(Q)?`✅ ${TOWNS[N.town].name}의 ${N.n}에게 보고`:'▸ '+qGoal(Q))}</div>${P.side.map(s=>`<div class="qs">📋 ${s.title}: ${sideGoal(s).split(' (')[0]}</div>`).join('')}`;}
function openQuests(){qInit();const Q=curQ();const done=MQ.slice(0,P.mq.i);
 openModal(`<h2>📖 퀘스트 <span class="mut" style="font-size:12px">메인 ${P.mq.i}/${MQ.length} 완료</span></h2>
 ${Q?`<div class="sdet"><div class="mut">${CHAP[Q.ch]}</div><b style="font-size:15px">${Q.title}</b> ${P.mq.st==='new'?'<span class="mut">(미수락)</span>':''}<div style="margin-top:4px">${P.mq.st==='new'?`${TOWNS[SNPC[Q.g].town].name}의 ${SNPC[Q.g].n}에게 말을 걸어 시작 (Lv${Q.lv})`:qGoal(Q)}</div><div class="mut" style="font-size:12px;margin-top:4px">「${Q.s[0]}」</div></div>`:'<p>모든 메인 퀘스트를 완료했다!</p>'}
 <h3>📋 의뢰</h3>${P.side.map(s=>`<div class="news">• <b>${s.title}</b> — ${sideGoal(s)}</div>`).join('')||'<p class="d">진행 중인 의뢰 없음</p>'}
 <h3>📚 지나온 이야기 <button class="btn s" style="float:right" onclick="openScenes()">🎬 컷신 다시 보기</button></h3>${[...new Set(done.map(x=>x.ch))].reverse().map(ch=>`<details><summary><b>${CHAP[ch]}</b> <span class="mut">${done.filter(x=>x.ch===ch).length}개</span></summary>${done.filter(x=>x.ch===ch).map(x=>`<div class="news">✔ ${x.title} <span class="mut">— ${x.e[0]}</span></div>`).join('')}</details>`).join('')||'<p class="d">아직 없다.</p>'}
 <button class="btn w g" onclick="closeModal()">닫기 (O)</button>`,true);}
// ── 마을에 이야기 NPC 배치
function mkStory(sid){const N=SNPC[sid],m=CUR,e=m.entries.start;let x=e.x+70,y=e.y-20;const q2=nearestOpen(m,x,y);
 return{kind:'story',sid,name:N.n,x:q2.x,y:q2.y,r:9,path:null,pi:0,wait:1e9,face:-1,walk:0,moving:false,bubble:'',bubT:0,spd:0,look:{img:N.img,h:50,useSheet:true,layer:null,body:'#8a5a2a',hair:'#4a3020'}};}
function storyMark(a){qInit();const Q=curQ();if(!Q)return null;if(P.mq.st==='active'&&Q.to===a.sid)return qDone(Q)?['?','#ffd23f']:['…','#bbb'];if(P.mq.st==='new'&&Q.g===a.sid)return P.lv>=Q.lv?['!','#ffd23f']:['!','#888'];return null;}
