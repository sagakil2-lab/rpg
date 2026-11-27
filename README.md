# 모험 RPG — GitHub 버전 (관리·수정용 구조)

PC·휴대폰 주소: `https://sagakil2-lab.github.io/RPG/`

## 폴더 구조
```
index.html            화면 뼈대 (HUD·버튼 배치). 게임 코드는 없음
css/style.css         모든 디자인 (색·크기·모바일 배치)
js/                   게임 코드 — 기능별로 나뉜 파일, 번호 순서대로 불러옴
assets/               그림(webp)·소리(mp3)
assets/asset_list.js  그림·소리 목록 (새 파일을 넣으면 여기에 이름 추가)
assets/anchors.js     캐릭터 몸 시트 기준점 (건드리지 않기)
.nojekyll             지우지 않기
```

## 무엇을 고치려면 어디를 여나
찾는 이름으로 파일 안에서 Ctrl+F 하면 바로 나와요.

| 고칠 것 | 파일 | 찾을 이름 |
|---|---|---|
| 마을·사냥터·몬스터 목록·재료 | `01_data_world.js` | `const GROUNDS` |
| NPC 사냥꾼 사냥터 선택 | `05_home.js` | `chooseGround` |
| 경험치 곡선 | `09_game_state.js` | `expNeedL` |
| 능력치 포인트 효과 | `27b_events_stats.js` | `const STD` |
| 플레이어 공격·방어·HP 공식 | `09_game_state.js` | `const maxHp` |
| 몬스터 능력치(HP·공격) | `10_monster_ai.js` | `mkMon` |
| 보스 패턴 | `10_monster_ai.js` | `const BPAT` |
| 장비 생성·등급 | `11_items.js` | `makeItem` |
| 장비 강화 확률(+15) | `11_items.js` | `const ENH_RATE` |
| 스킬 목록·설명 | `13_skills.js` | `const SK` |
| 스킬 효과 | `13_skills.js` | `const SKFN` |
| 발동형 스킬 | `13_skills.js` | `procTick` |
| 스킬 숙련도 | `13_skills.js` | `const SKM_MAX` |
| 뽑기 확률 | `27_shop_gacha.js` | `const GACHA` |
| 출석·주간 미션·시즌 패스 | `27b_events_stats.js` | `const ATTR` |
| 오프라인 보상 | `27b_events_stats.js` | `offlineCheck` |
| 제작 의뢰 | `04_monsters_pets.js` | `orderPanel` |
| 알 부화·펫·투기장 | `04_monsters_pets.js` | `hatchEgg` |
| NPC 직업·전직 | `17_npc_karma_combat.js` | `const PROMO` |
| 주인공 머리·투구 위치 | `15_char_rig.js` | `const RHAIR` |
| 효과음·배경음악 목록 | `24_sound.js` | `const SFXK` |
| 마을 분위기 | `07_map_gen.js` | `const TVIBE` |
| 모바일 메뉴(☰) | `21_legend.js` | `openMenu` |
| 장비창 | `20_ui.js` | `openEquip` |
| 메인 스토리 | `25_story_quest.js` | `const MQ` |

GitHub 웹에서 파일을 열고 ✏️(연필)을 눌러 바로 고친 뒤 「Commit changes」하면 1~3분 뒤 반영돼요.

## 자주 하는 수정
- **그림 바꾸기**: `assets/`의 같은 이름 webp 파일을 덮어쓰기 (png를 webp로 바꿔서). 새 그림이면 `asset_list.js`의 `img` 목록에도 이름 추가.
- **소리 바꾸기**: `assets/sfx_이름.mp3` 덮어쓰기. 새 소리면 `asset_list.js`의 `snd` 목록과 `24_sound.js`의 `SFXK` 목록에 추가.
- **수정이 안 보일 때**: `index.html`과 `asset_list.js`의 `v=` 숫자를 아무 값으로 바꾸면 브라우저가 새 파일을 받아요. 아니면 `Ctrl+F5`.

## 내 컴퓨터에서 먼저 테스트
`로컬테스트_윈도우.bat`(Python 필요) 또는 `로컬테스트_맥.command`를 실행 → `http://localhost:8000`.
F12(개발자 도구) → Console 탭에 빨간 오류가 뜨면 파일 이름·줄 번호가 나와서 어디가 틀렸는지 바로 찾을 수 있어요.

## 주의
- js 파일은 번호 순서대로 하나의 게임처럼 이어져요. 파일 이름을 바꾸거나 새 파일을 추가하면 `index.html` 아래쪽 `<script src="js/...">` 목록도 같이 고쳐야 해요.
- 저장 데이터는 브라우저(주소)별로 따로예요. 설정창의 파일 내보내기로 백업하세요.
