# DODREI — Web Architecture

현재 작품/실행 버전: **v1.0.28**  
현재 시각 엔진: **v1.0.28**  
현재 설정 스키마(config schema): **1**  
구조 검토일: **2026-08-28**

이 문서는 `web/` 구현의 **구조, 책임 경계, 안전하게 수정하기 위해 알아야 할 안정적인 운영 규칙**을 설명한다.

현재 상태와 미해결 문제는 `PROJECT_STATE.md`, 실제 매개변수 값은 `config.js`, 현재 로드되는 모듈 체인과 캐시 키(cache key)는 `index.html`이 우선한다.

별도 config/asset guide는 현재 필요하지 않다. 구조적으로 중요한 내용은 이 문서에 통합하고, 자주 바뀌는 값은 실제 코드/config에 맡긴다.

## 1. 설계 목표

DODREI web은 모바일 우선(mobile-first) 브라우저 미디어 작품이다.

현재 구조가 우선하는 것은 다음이다.

- 현재 작품 동작을 명확하게 유지한다.
- 모바일에서 계산 비용이 무제한으로 늘어나지 않도록 제한한다.
- media selection, interaction, analysis/audio, rendering/content state를 필요 이상으로 결합하지 않는다.
- 실제로 독립된 책임이 있는 subsystem만 분리한다.
- 범용 프레임워크(generic framework)를 만드는 것을 목표로 하지 않는다.
- 미래 가능성만을 위해 placeholder architecture나 schema를 미리 만들지 않는다.

## 2. 실행 흐름(Runtime graph)

```text
GitHub Contents API
        │
        ▼
   MediaManager ───── resident/archive images ───────────────┐
        │                                                    │
        ▼                                                    │
    Analyzer                                                 │
        │                                                    │
        ▼                                                    │
   AudioEngine                                               │
        │                                                    │
        └──────────────┐                                     │
                       │                                     ▼
Pointer / Touch ─> Interaction ───────────────────────> VisualEngine
      │                                                   ▲
      └──────────────> Memory Recall state ────────────────┘
                                                          │
                                                          ▼
                                                        Canvas

DOM
├─ runtime controls
├─ start screen
└─ memory aria-live mirror only
```

일반 frame orchestration은 `sketch-v066.js`가 소유한다.

```text
interaction update
-> media update
-> analysis
-> audio update
-> visual render
-> telemetry
```

Memory recall은 두 번째 application loop를 만들지 않는다. memory module이 hold/capture state를 소유하고, 활성 visual engine이 같은 Canvas system 안에서 대체 recall path를 렌더링한다.

## 3. 설정과 제어

```text
config.js
  runtime values
      │
      ├──────────────> artwork modules
      │
      ▼
config-schema.js
  validation / editor metadata / collection identity
      │
      ▼
control/
  import / merge / edit / export
```

### 기준이 되는 값(Source of truth)

```text
app.version          작품/실행 release
meta.schemaVersion   호환되지 않는 config-contract version
meta.configRevision  가벼운 config/tuning revision
```

작은 tuning 변경은 작품/실행 버전을 바꾸지 않고 `configRevision`만 올릴 수 있다.

`config.js`는 data이지 실행 behavior가 아니다. function/callback은 config object 안에 두지 않는다. module이 behavior를 구현하고, config는 지원되는 behavior/parameter를 선택한다.

### 안정된 ID

Preset, pipeline stage, image-set collection은 안정된 ID를 사용한다. 화면에 보이는 label이나 배열 위치가 바뀌어도 identity는 유지될 수 있다.

Config에 알 수 없는 preset/stage ID를 추가한다고 rendering implementation이 새로 생기지는 않는다.

### 가져오기 / migration

Control은 호환 가능한 merge 규칙을 사용한다.

- 알고 있는 정상 값 -> 가져옴
- 현재 필드가 입력에 없음 -> 현재 값 유지
- 알 수 없거나 오래된 필드 -> 무시
- 잘못된 값 -> 무시
- 새 ID를 명시적으로 허용한 collection은 새 값을 받을 수 있음

필드 이름을 바꿀 때는 과거 이름을 무기한 중복 유지하지 말고 `config-schema.js`에 명시적인 migration alias를 둔다.

Schema-version이 다르면 경고할 수 있지만, 알고 있는 호환 경로는 여전히 merge할 수 있다.

### 배포

Config/module/asset이 바뀌면:

1. 관련 source를 수정한다.
2. 작품/실행 release가 의미 있게 바뀐 경우에만 `app.version`을 변경한다.
3. 필요하면 `configRevision`을 올린다.
4. 배포 resource가 바뀌었으면 `index.html` cache key를 갱신한다.
5. 배포 동작이 중요하면 실제 runtime/telemetry를 확인한다.

공개 Control page에는 repository write credential이 없다. 브라우저 `localStorage` draft는 편의 기능일 뿐 기준 backup이 아니다.

## 4. 저장소와 asset의 경계

현재 구현 위치:

```text
repository  fromhoyeon/dodrei
path        web/
```

루트 Pages entry는 `./web/`으로 이동한다.

이미지 자동 탐색은 GitHub public Contents API를 사용한다. 따라서 `config.js`의 repository/path 필드는 설명용 metadata가 아니라 **실제 runtime dependency**다.

```text
GitHub Contents API
-> configured repository/image directory
-> filename metadata
-> browser-relative ./assets/images/... paths
-> decoded resident working set
```

프로젝트나 asset tree가 이동하면 파일 이동과 함께 discovery dependency도 수정한다.

작품 실행에 직접 필요한 최적화 asset은 이 저장소에 둘 수 있다. 큰 원본 영상·사진 archive, intermediate render, 대량 generated media는 재현이나 runtime에 꼭 필요하지 않다면 보통 local/external storage에 둔다.

Filename order는 playback order가 아니다. 기능적 이유 없이 대량 rename을 하면 cache/Git noise가 커지므로 피한다.

## 5. MediaManager와 선택 단계

`js/media-manager.js`가 소유하는 것:

- 가벼운 metadata 형태의 archive discovery
- image-set identity
- 제한된 수의 decoded residency
- background staging/replacement
- 오래된 decoded reference의 eviction
- 현재 source/image-pool 노출

두 종류의 무작위 선택은 의도적으로 분리한다.

```text
archive -> resident pool
후보 순환: shuffle-bag 방식

resident pool -> visible scene
화면 선택: independent random with replacement
```

따라서 resident pool은 archive를 효율적으로 순환시키면서도, 화면에서는 즉시 반복이나 같은 source의 중복 사용이 작품적으로 허용될 수 있다.

Image set은 안정된 `id` + storage `subdir`를 사용한다. 이후 weighting, quota, alternation이 필요해지면 작품이 실제로 요구할 때 이 media-selection 경계에서 다룬다.

## 6. 시각 모드와 처리 흐름

Runtime은 preset playlist를 지원하며, 정확한 순서와 enabled state는 config가 소유한다. 현재 mode 상태는 `PROJECT_STATE.md`에 요약한다.

개념적인 처리 단계:

```text
preset composition
-> common/touch processing
-> preset/swipe feedback
-> memory composition when active
-> global POST when applicable
-> vignette / waveform
```

현재 중요한 예외:

- 일반 touch rupture는 global POST를 우회할 수 있다.
- recall은 fixed memory image + readability field + typography를 먼저 합성한 뒤 그 전체에 현재 POST chain을 적용한다.

깊은 adaptive crop은 의도된 동작이다. 먼저 cover-fit을 계산하고, 이후 zoom/pan은 실제 overflow와 허용 범위 안에서 clamp한다.

## 7. 버전으로 이어진 visual-engine 계보

현재 브라우저 구현은 기존 클래스 위에 새 subclass를 추가하는 방식으로 성장했다. `index.html`은 긴 순서형 체인을 로드하며 현재 활성 끝점은 `visual-engine-v1028.js`다.

중요하게 유지되는 층:

```text
v1000   swipe feedback / ordinary touch POST bypass base
v1003   open random scene-slot selection / crop behavior
v1007   mobile main-composition scaling
v1012   ordered global POST feedback base
v1015   performance-diet layer
v1020   irregular touch rupture / release behavior
v1021   sparse GL
v1022   ST dimming + resize resource disposal
v1026   memory PRE-source composition lock
v1027   memory canvas composite + POST + touch burst/lull
v1028   text-only recall / full-frame readability field / fade
```

오래된 module이 로드된다는 이유만으로 dead code라고 판단하지 않는다. 삭제하거나 flatten하기 전에 `index.html`과 inheritance를 확인한다.

### `P5Lab*` / `P5LAB_*` 이름을 유지하는 이유

구현에는 다음과 같은 과거 식별자가 아직 남아 있다.

```text
P5LabUtils
P5LabInteraction
P5LabMediaManager
P5LAB_CONFIG
P5LAB_VISUAL_ENGINE_CLASS
...
```

이것들은 단순히 오래된 이름만은 아니다. 현재 wiring에 실제로 참여한다.

- base class를 새로운 `Dodrei*` subclass가 확장한다.
- 뒤쪽 module이 global alias를 덮어써 최신 구현을 선택한다.
- `P5LabUtils` 같은 공용 namespace를 여러 활성 module이 참조한다.
- `index.html`은 엄격한 module order에 의존한다.

이름만 바꾸는 대규모 수정은 runtime 이득 없이 넓은 dependency surface를 건드린다.

**현재 방침:** 호환성을 위한 식별자를 유지한다. 버전 체인을 하나의 깨끗한 기준 구현으로 정리할 가치가 생기면, 그 전용 architecture refactor 안에서 naming cleanup을 함께 수행하고 전후 동작을 검증한다. 다른 기능 작업에 섞지 않는다.

과거 외부 repository path, 오래된 사용자 노출 이름, 잘못된 기준 상태는 별개의 문제다. 이런 것은 migration defect이므로 독립적으로 수정한다.

## 8. 상호작용

Mouse와 한 손가락 touch는 다음과 같은 state로 정규화한다.

```text
x / y
pressure
pressed
swipeSpeed
releaseEnergy
releaseAgeMs
```

현재 touch behavior에는 grayscale rupture, irregular slice, velocity-aware release, reduced-resolution mobile processing, stochastic burst/lull timing이 포함된다.

정확한 threshold, strength, scale은 `config.js`의 tuning 값이다.

## 9. Memory recall

`js/memory-recall-v1028.js`가 소유하는 것:

- hold timer
- 현재 archive entry 확보
- resident image reference 유지
- deterministic fragment selection
- memory id/text state
- activation timestamp
- release/cancel reset
- aria-live text mirroring

화면에 보이는 recall 렌더링은 활성 visual engine이 소유한다.

```text
hold-start
-> capture archive entry + resident image

activation
-> fixed memory source
-> stop normal scene/crop/PRE progression
-> clear obsolete temporal history

while held
-> touch rupture
-> optional swipe feedback
-> full-frame readability field
-> MEMORY id + fragment text
-> ordered POST
-> vignette / waveform

release
-> clear recall/temporal state
-> refresh ordinary composition
```

DOM memory node는 접근성 전용이다.

정확한 under-finger/composited-layer 판별은 아직 해결되지 않았다. 이것은 현재 한계이지, 일반화된 hit-testing system을 미리 만들 이유는 아니다.

나중에 명시적인 linked memory record나 persistent discovery가 실제로 채택되면 content data는 renderer와 분리한다. 그 작업이 실제로 시작되기 전에는 schema가 필요 없다.

## 10. Audio / lifecycle / telemetry

Audio는 native HTML playback과 별도의 Web Audio analysis/effect path를 함께 사용한다. 현재 기능에는 PCM analysis, waveform, filtering, delay/feedback, distortion, 미세한 rate movement, touch-dependent wet control, mute, pause integration이 있다.

`mobile-visibility-v1024.js`는 모바일에서 document가 숨겨지면 pause하고, 그 module 자신이 pause를 발생시킨 경우에만 resume한다. 사용자의 PAU state가 우선한다.

Telemetry는 계측(instrumentation)이면서 작품 요소이기도 하며 처리된 visual surface 뒤에 그린다.

DOM은 비교적 저렴한 UI/presentation 작업에 사용한다. 전체 화면 Canvas processing과 media residency가 주요 performance 비용이다.

## 11. 성능 원칙

- `pixelDensity(1)`
- 제한된 main composition dimensions
- 제한된 decoded image pool
- analysis와 auxiliary FX buffer는 낮은 해상도 사용
- sequential background decode
- 무거운 rupture 작업은 모바일에서 frame skipping
- 가능한 Canvas filter는 batch 처리
- 현재 활성 halation/bloom pass 없음
- viewport 변경 시 resource를 명시적으로 dispose/rebuild

성능이 나빠지면 작품을 정의하는 핵심 동작을 먼저 없애기보다 보조 처리의 해상도나 실행 빈도를 줄인다.

## 12. 수정 위치 안내

| 하려는 일 | 우선 확인할 source |
| --- | --- |
| 현재 상태 / 다음 작업 | `PROJECT_STATE.md` |
| 정확한 runtime tuning | `config.js` |
| config validation/editor metadata | `config-schema.js` |
| static config editor | `control/` |
| 활성 module chain/cache key | `index.html` |
| archive discovery/resident rotation | `js/media-manager.js` |
| visual algorithms / POST | 현재 visual-engine 계보 |
| touch release state | `js/interaction-v1020.js` |
| memory hold/content state | `js/memory-recall-v1028.js` |
| mobile visibility | `js/mobile-visibility-v1024.js` |
| app frame/startup/pause/viewport | `sketch-v066.js` |
| runtime controls | 관련 UI/control module |

## 13. 문서와 작업 이어가기 규칙

현재 활성 웹 문서는 의도적으로 다음 두 개만 둔다.

```text
PROJECT_STATE.md
ARCHITECTURE.md
```

일반적인 새 작업 세션:

```text
root README
-> web/PROJECT_STATE.md
-> 필요할 때만 관련 config/code
```

Module responsibility, data flow, compatibility boundary, 큰 구현 구조를 바꾸는 작업이라면 이 architecture 문서를 읽는다.

정보를 분류한다는 이유만으로 별도 README/config/asset/handoff 문서를 다시 만들지 않는다. 이 두 문서로 독립적인 책임을 감당하기 어려워졌을 때만 새 문서를 분리한다.
