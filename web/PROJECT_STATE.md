# PROJECT_STATE — DODREI / Web

Last updated: 2026-08-28  
Repository: `fromhoyeon/dodrei`  
Path: `web/`  
Current artwork/runtime version: `1.0.28`  
Current visual engine version: `1.0.28`  
Current config schema: `1`

이 문서는 DODREI의 **현재 브라우저 구현 checkpoint**를 복구하기 위한 canonical 상태 문서다.

휘발성이 높은 개별 config revision이나 모든 숫자 값을 이 문서에 복제하지 않는다. 실제 runtime 값은 `config.js`, 현재 로드되는 module chain은 `index.html`, 구현 세부는 활성 코드가 source of truth다. 이 문서는 현재 작품 상태, 중요한 판단, 미해결 문제와 다음 작업을 기록한다.

## Current baseline

PHOTO ONLY. Automatic mode advance is OFF.

```text
BASE_FPS        30
VIS_SPEED       S2 / 0.50x
START_MODE      PHOTO_DOUBLE_BLEND / TWIN_EXPOSURE//NULL
MODE_ORDER      DOUBLE_BLEND first
CROP_MIN        1.0x
CROP_MAX        8.0x
POST            ON
POST_CHAIN      HC -> GS -> FB -> ST -> GL
POST_FB         ON
POST_ST         ON
POST_GL         ON
TOUCH_PLAYBACK  0.50x before recall activation
SWIPE_THRESHOLD 0.15
RUPTURE_RES     mobile 0.62 / desktop 0.80
SWIPE_FB_RES    mobile 0.60 / desktop 0.78
FULLSCREEN      manual FS button inside runtime UI
UI_DEFAULT      HIDDEN
AUDIO           20220302 - sarabande.mp3
IMAGE_ARCHIVE   96 files
RESIDENT_POOL   20 decoded images
MEMORY_HOLD     1000 ms
MEMORY_TEXT     64 deterministic mixed fragments
```

Canonical visual share preset:

```text
?fps=30&speed=S2&post=1&fx=HC,GS,FB,ST,GL&mode=photo-double-blend&crop=10-80
```

## Repository / deployment state

브라우저 구현은 과거 `perfumeJaguar/perfumeJaguar.github.io/experiments/p5-media-lab/`에서 현재 DODREI 전용 repository의 `web/`으로 승격·이관되었다.

현재 기준:

```text
repository              fromhoyeon/dodrei
active browser path     web/
Pages root              / -> ./web/
image discovery source  fromhoyeon/dodrei / web/assets/images
```

2026-08-28 정합성 검토에서 이관 후에도 `config.js`의 image discovery가 이전 `perfumeJaguar` repository를 조회하고 있던 것을 발견해 현재 repository로 수정했다. 브라우저가 실제로 읽는 image path 자체는 계속 `./assets/images/...`이므로 작품 동작을 바꾸는 기능 변경이 아니라 canonical 저장소로 dependency를 복구한 것이다.

`P5LAB_*`, `P5Lab*` 같은 내부 identifier와 일부 과거 module 이름은 현재 코드의 compatibility lineage로 남아 있다. 이것은 현재 프로젝트가 LAB이라는 뜻이 아니며, 이름만 정리하기 위한 대규모 refactor는 하지 않는다.

## Current tuning after v1.0.28

2026-08-28에 global POST `FB`를 조금 더 강하게 조정했다. runtime/visual engine version은 `1.0.28`을 유지하고 config tuning만 변경했다.

현재 관련 값은 `config.js`가 canonical이며, checkpoint 시점의 핵심은 다음과 같다.

```text
POST FB retain alpha    128
POST FB scale           0.989
POST FB current alpha   236
```

이런 tuning 값은 앞으로 매번 이 문서에 복제하지 않는다. 작품 상태나 동작의 의미가 바뀌는 경우에만 이 문서를 갱신한다.

## v1.0.28 — thumbnail rollback / full-frame dim / text fade / mixed fragments

v1.0.28 keeps the v1.0.26 memory-source lock and v1.0.27 touch burst/lull + memory POST architecture, but simplifies recall presentation again.

### Active memory pipeline

```text
pointer down
  -> capture MediaManager current archive entry
  -> retain resident p5.Image

hold reaches 1000 ms
  -> memory ACTIVE
  -> fixed centered 1x cover memory source
  -> normal preset image selection stops
  -> random crop/layout stops
  -> PRE common FX stops
  -> preset feedback stops
  -> composition virtual clock stops
  -> old temporal buffers clear

while held
  -> touch rupture acts on fixed memory still
  -> swipe feedback can act downstream
  -> full-frame translucent black readability field is composited
  -> MEMORY NNN + fragment are composited with fade-in
  -> current POST COMMON FX is applied to the whole memory result
  -> default POST chain: HC -> GS -> FB -> ST -> GL

release
  -> recall inactive
  -> temporal buffers clear
  -> scene image slots reset
  -> normal composition refreshes cleanly
```

### Thumbnail rollback

The v1.0.27 original-aspect-ratio thumbnail was removed from the active renderer and from `index.html` markup. There is no visible thumbnail in recall.

Reason: the thumbnail made the memory interaction too explanatory and constrained future recall layouts. The recall presentation now reserves the whole frame for future text/media without assuming a central image card.

### Readability field

The local black panel from v1.0.27 was replaced by a full-frame translucent black field.

```text
local text panel         REMOVED
full-frame dim           black alpha ~106/255 before POST
shade fade               ~260 ms smoothstep
text/id fade             ~520 ms smoothstep, slightly delayed
text shadow              retained
```

This is not the old v1.0.25 opaque black plate: the fixed recalled image remains visible and touch effects continue underneath. The dim exists inside the p5 memory composite and therefore also participates in POST.

### Text remains inside POST

`MEMORY NNN` and the body fragment are drawn before POST. They therefore continue to receive the currently enabled POST chain, including feedback and glitch. Temporary loss of legibility during GL/FB events is currently accepted as part of the visual language.

The visible recall presentation is Canvas content. The DOM `#memory-recall` node remains only as an `aria-live` text mirror and is not a visual overlay.

### Fragment pool

The old 24-fragment pool was strongly biased toward polished, vaguely melancholic memory sentences. v1.0.28 replaces it with a 64-entry deterministic pool designed to feel less narratively uniform.

Content types now include:

- ordinary memory observations;
- shopping/practical notes;
- room/studio notes;
- times and percentages;
- number strings;
- incomplete sentences and interrupted records;
- neutral `IP:port` scraps using documentation-only or private address ranges;
- personal shorthand that may be meaningful only to its original writer.

The intent is **not** overt mystery, horror, ARG signaling or an implied cipher. It should resemble unrelated scraps whose original context is absent.

Archive mapping remains deterministic by archive key/index through the existing stable hash. With 96 images and 64 fragments, fragment reuse is still possible.

### Recall target limitation

Recall still captures the MediaManager current archive entry at hold-start. In `PHOTO_DOUBLE_BLEND` and other multi-image modes, this is not guaranteed to be the exact visually dominant or under-finger composited layer. Exact layer/hit resolution remains unresolved.

## v1.0.27 — retained touch burst/lull + memory POST

Retained behavior:

- memory overlay is p5 canvas content rather than a visible DOM layer;
- recall explicitly applies POST after memory overlay composition even though ordinary touch rupture normally bypasses POST;
- touch rupture pattern refresh alternates stochastic short bursts and longer lulls;
- burst windows force fresh rupture patterns on allowed heavy passes;
- lulls hold the previous fracture instead of reseeding continuously;
- movement energy shortens lulls modestly but does not eliminate them;
- touch raster scales were raised conservatively.

Approximate rupture timing:

```text
BURST   ~105-315 ms
LULL    ~220-780 ms before gesture-energy shortening
```

Current quality/performance compromise:

```text
feedback/swipe mobile     0.60
feedback/swipe desktop    0.78
rupture mobile            0.62
rupture desktop           0.80
rupture frame skip mobile 2
rupture frame skip desk   1
```

If mobile touch performance regresses, reduce these resolution scales before discarding burst timing.

## v1.0.26 — retained memory PRE-FX lock

v1.0.26 established the current conceptual architecture: memory recall changes the actual visual source instead of covering a still-running random composition.

The captured resident `p5.Image` remains stable through resident-pool rotation for the duration of the hold. On release, ordinary scene slots and timing references are reset to avoid a large time jump.

## Earlier recall history

- `v1.0.24`: first 2-second text-only deterministic memory prototype; also mobile visibility and version-sync work.
- `v1.0.25`: hold reduced to 1 second; raw thumbnail added on an opaque full-screen DOM plate. Superseded.
- `v1.0.26`: real composition lock; transparent DOM thumbnail/text remained.
- `v1.0.27`: thumbnail/text moved into p5 before POST; local dark panel; burst/lull rupture timing.
- `v1.0.28`: thumbnail removed; full-frame dim + fading text retained before POST; fragment pool expanded and diversified.

## Touch rupture

- Grayscale palette: black / dark gray / mid gray / near-white.
- Irregular horizontal slice heights.
- Mostly narrow slices, occasional broad fractures.
- Only a subset of slices move.
- Shift is usually small with occasional extreme displacement.
- Release tail is short and velocity-aware.
- Burst/lull timing avoids uniform metronomic glitching.
- Mobile heavy pass still uses every-second-render-frame safeguard.
- Swipe feedback threshold remains `0.15`.
- During recall, touch effects operate on the fixed memory image.

## Global POST FX

Current ordered keys:

```text
BW GS LS BL FB GL ST CR HC DK VG
```

Startup chain:

```text
HC -> GS -> FB -> ST -> GL
```

Roles:

- `FB` — strong low-resolution temporal memory;
- `GL` — sparse temporal slice glitch, more active with touch;
- `ST` — film/projection luminance instability only;
- `HC/GS/LS` — compatible Canvas filters batched where possible;
- `BL` — reduced mobile scratch when enabled.

Outside recall, ordinary touch rupture still bypasses POST. Recall is an intentional exception: full-frame dim and typography are composed first and then the current POST chain is applied.

## Startup sequence

```text
0.0s   soundtrack begins immediately
2.0s   title/start screen disappears
2.0-3.0s black screen + music only
3.0s   telemetry stage 1
3.2s   telemetry stage 2
3.4s   telemetry stage 3
6.4s   main visual at 20% brightness
7.4s   main visual at 100% brightness
```

## Scene / resident-pool policy

Outside recall, visible scene draws use independent random selection with replacement:

```text
recent-image ban        NONE
scene shuffle-bag       NONE
duplicate suppression   NONE
immediate repeat        ALLOWED
same image in slots     ALLOWED
```

Resident working-set rotation remains separate:

```text
archive metadata        96 images
active decoded pool     20
rotation batch          5
rotation interval       5 s
candidate policy        shuffle-bag
runtime decode          sequential
```

## Conceptual direction

Current direction remains **recollection / fading memory**: fragments whose original significance is uncertain but whose emotional or material residue persists.

The following are **open possibilities, not adopted implementation commitments**:

- interactive web book / hypertext;
- puzzle/game exploration;
- visual-novel-like scenes;
- hidden hotspots / hold / swipe / wait interactions;
- non-linear memory nodes and persistent discovery state;
- DODREI visual engine as the physics/surface of a memory world rather than a decorative background.

Avoid making every scene a conventional discoverable-button puzzle. Long stretches may contain nothing explicit.

If explicit memory records are later adopted, content should likely remain separate from rendering. A possible data shape is:

```text
memory id
image/archive key
text / media payload
unlock / discovery condition
links to other memories
persistent discovered state
optional scene/FX parameters
```

This remains a design possibility until actual work requires it.

## Important active files

- `config.js` — runtime configuration and actual current parameter values;
- `index.html` — active script chain, cache key and visible runtime version;
- `js/visual-engine-v1028.js` — active text-only recall presentation; full-frame readability field + text fade while preserving recall POST;
- `js/visual-engine-v1027.js` — memory composite/POST base + burst/lull touch timing;
- `js/visual-engine-v1026.js` — memory PRE-FX composition lock base;
- `js/visual-engine-v1022.js` — ST dimming and resize resource disposal;
- `js/visual-engine-v1021.js` — sparse GL;
- `js/visual-engine-v1020.js` — irregular touch rupture/release;
- `js/visual-engine-v1015.js` — performance-diet layer;
- `js/visual-engine-v1012.js` — ordered global FB;
- `js/visual-engine-v1000.js` — swipe feedback and ordinary touch POST bypass;
- `js/interaction-v1020.js` — velocity-aware release tail;
- `js/memory-recall-v1028.js` — 1-second archive capture, activation timestamp and 64-fragment pool;
- `js/mobile-visibility-v1024.js` — mobile background pause/resume;
- `sketch-v066.js` — application orchestration.

Older versioned modules remain because the active engine is built as an additive inheritance/module chain. Do not delete or rename them merely because newer files exist; verify `index.html` and inheritance before changing that structure.

## Documentation roles

- `README.md` — web implementation entrypoint and compact current summary.
- `PROJECT_STATE.md` — this document; current checkpoint, adopted decisions, limitations and next work.
- `ARCHITECTURE.md` — current structural model and editing map. Update when architecture meaningfully changes.
- `CONFIG_GUIDE.md` — stable config semantics, editing and migration rules. Current values remain in `config.js` rather than being copied there.
- `ASSET_GUIDE.md` — asset handling and media-selection guidance.

If prose and code disagree, verify the active code. Historical version notes explain how the current state developed but do not override current implementation.

## Current unresolved / next

1. Exact under-finger composited-layer detection for memory recall remains unresolved.
2. Continue evaluating the current stronger global POST feedback artistically; treat further small numeric changes as config tuning unless behavior/architecture changes.
3. Future explicit memory/content structure remains an open design question, not a committed schema.
4. If architecture changes materially, update `ARCHITECTURE.md` together with this state rather than accumulating another handoff document.
5. TouchDesigner, Max/MSP, external audio/local AI and other DODREI tracks are not normalized under `web/`; they should be added only when actual work begins and the root repository state is updated.

## Checkpoint — 2026-08-28

- Runtime and visual engine remain `1.0.28`.
- Current repository/path is `fromhoyeon/dodrei` → `web/`.
- Image discovery no longer depends on the previous `perfumeJaguar` repository.
- Global POST feedback has been strengthened through config tuning without a runtime version bump.
- Memory recall remains the v1.0.28 one-second fixed-source, text-only, pre-POST presentation described above.
- Documentation roles have been normalized so volatile config values are not expected to be duplicated across every guide.
