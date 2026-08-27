# DODREI — Web Architecture

Current artwork/runtime: **v1.0.28**  
Current visual engine: **v1.0.28**  
Current config schema: **1**  
Architecture reviewed: **2026-08-28**

이 문서는 현재 `web/` 구현의 **구조와 책임 경계**를 설명한다. 작품의 현재 checkpoint와 미해결 문제는 `PROJECT_STATE.md`, 실제 parameter 값은 `config.js`, 현재 로드되는 module chain은 `index.html`이 우선한다.

아직 채택되지 않은 stage/state/content system이나 TouchDesigner/Max/local-AI 통합 구조를 미래 가능성만으로 이 문서에 미리 설계하지 않는다.

## 1. Design objective

DODREI web은 mobile-first browser media artwork다.

현재 architecture가 우선하는 것은 다음이다.

- 작품의 현재 동작을 명확하게 유지할 것;
- mobile 비용을 bounded하게 유지할 것;
- media selection, interaction, analysis/audio, rendering/content state를 필요 이상으로 결합하지 않을 것;
- 실제로 재사용되는 subsystem은 분리하되 generic framework를 만드는 것을 목표로 하지 않을 것;
- 미래 기능을 위해 placeholder architecture를 미리 만들지 않을 것.

과거 p5 Media Lab에서 발전해 온 구현이므로 내부에 `P5LAB_*`, `P5Lab*` identifier와 additive versioned modules가 남아 있다. 이는 compatibility lineage이며 현재 프로젝트의 역할을 LAB으로 정의하지 않는다.

## 2. Current runtime graph

```text
GitHub Contents API
        │
        ▼
   MediaManager ───── resident/archive images ───────────────┐
        │                                                    │
        │ current source                                     │ image pool
        ▼                                                    │
    Analyzer                                                 │
        │                                                    │
        ├─ luminance / RGB / motion-like analysis            │
        ▼                                                    │
   AudioEngine                                               │
        │                                                    │
        └──────────────┐                                     │
                       │                                     │
Pointer / Touch ─> Interaction                               │
      │                │                                     │
      │                └──────────────────────┐              │
      │                                       ▼              ▼
      └─> Memory Recall state ─────────────> VisualEngine <───┘
                                              │
                                              ▼
                                            Canvas
                                              │
                                              ├─ telemetry
                                              └─ artwork presentation

DOM
├─ runtime controls
├─ start screen
└─ memory aria-live mirror only
```

The active artwork is PHOTO ONLY. Legacy video-oriented names remain in some modules, but current behavior is driven by still-image pools, audio, interaction, Canvas2D visual processing, telemetry, and memory recall.

## 3. Application frame sequence

`sketch-v066.js` currently orchestrates the ordinary frame:

1. `Interaction.update()`
2. `MediaManager.update()`
3. obtain current source / interaction snapshot
4. `Analyzer.update(source, interaction)`
5. `AudioEngine.update(analysis, interaction)`
6. calculate startup visual/telemetry state
7. `VisualEngine.render(...)`
8. render telemetry when its startup stage is active

Telemetry is drawn after the processed artwork so it remains independently legible.

Memory recall does not create a second application loop. The separate memory module captures pointer/hold state and a resident image reference; the active visual engine reads that state and renders the recall path inside its normal Canvas pipeline.

## 4. Configuration architecture

```text
config.js
  runtime values
      │
      ├──────────────> artwork modules
      │
      ▼
config-schema.js
  metadata / validation / collection identity
      │
      ▼
control/
  import / merge / edit / export
```

### `config.js`

Canonical public runtime data.

Important separation:

```text
app.version          artwork/runtime release
meta.schemaVersion   incompatible config-contract version
meta.configRevision  lightweight config/tuning revision
```

Small tuning changes may increment config revision without changing the artwork/runtime version.

`window.P5LAB_CONFIG` remains a compatibility alias for older engine modules.

### `config-schema.js`

Editor metadata rather than runtime defaults. It describes value types, bounds, select options, collection identity and migration aliases.

### `control/`

Static editor with no GitHub write credentials. It can load compatible config data, merge known fields/IDs and export a canonical `config.js`.

See `CONFIG_GUIDE.md` for config semantics. Current numeric values should be read from `config.js`, not duplicated here.

## 5. Repository and asset discovery boundary

The active browser implementation lives at:

```text
repository  fromhoyeon/dodrei
path        web/
```

The root Pages entry redirects to `./web/`.

`MediaManager` can discover image filenames through GitHub's public Contents API. The configured repository/path therefore forms a real runtime dependency:

```text
GitHub Contents API
  -> configured repository / image directory
  -> filename metadata
  -> browser-relative ./assets/images/... paths
  -> decoded resident working set
```

During repository promotion, the code and assets moved to `fromhoyeon/dodrei/web/` while the discovery config still referenced the old `perfumeJaguar/perfumeJaguar.github.io/experiments/p5-media-lab/` location. This was corrected on 2026-08-28.

If the project moves again, repository/path fields must be migrated together with the files. They are not merely descriptive metadata.

## 6. MediaManager

Responsibilities:

- discover image archive entries as lightweight path metadata;
- attach stable `setId` metadata;
- keep a bounded decoded working set;
- stage replacements in the background;
- evict old decoded references;
- expose current source / image pool;
- isolate resident-pool candidate selection from visual scene selection.

Current policy is summarized in `PROJECT_STATE.md`; exact numeric limits live in `config.js`.

### Two different randomness layers

Resident-pool rotation uses a shuffle bag to circulate archive content efficiently.

Visible scene selection is independent from that resident candidate bag. The current visible-scene policy allows replacement, duplicates and immediate repeats as valid artistic behavior.

Do not merge these two concepts just because both involve random selection.

## 7. Image sets

Image sets use stable IDs plus subdirectories relative to the configured image root.

```js
imageSets: [
  { id: "default", subdir: "" }
]
```

The ID is configuration identity; the subdirectory is storage location.

Future weighting, quotas, strict alternation or cross-set pairing should be added to the media-selection boundary only if the artwork actually requires them. They do not belong in visual FX code and should not be prebuilt in advance.

## 8. Visual mode system

The current artwork has a supported preset playlist including:

```text
PHOTO_DOUBLE_BLEND
PHOTO_FEEDBACK_CROP
PHOTO_RAPID_CROP
PHOTO_SHARD_SWAP
PHOTO_BLEND_CYCLE
PHOTO_FULL
```

`PHOTO_DOUBLE_BLEND` is the current default. Automatic advance is OFF and manual next-mode control remains available.

The actual order/enabled state is config-owned. Preset IDs are stable configuration identities; adding an unknown ID to config does not create new rendering behavior.

## 9. Visual engine inheritance chain

The browser implementation grew through additive versioned subclasses. The active tail currently reaches `visual-engine-v1028.js`.

Relevant retained layers include:

```text
visual-engine-v1000.js   swipe feedback / ordinary touch POST bypass base
        ↓
visual-engine-v1003.js   open random scene-slot selection / crop behavior
        ↓
visual-engine-v1004.js
        ↓
visual-engine-v1007.js   mobile main-composition scaling
        ↓
visual-engine-v1012.js   ordered global POST feedback base
        ↓
visual-engine-v1015.js   performance-diet layer
        ↓
visual-engine-v1020.js   irregular touch rupture / release behavior
        ↓
visual-engine-v1021.js   sparse GL
        ↓
visual-engine-v1022.js   ST dimming + resize resource disposal
        ↓
visual-engine-v1026.js   memory PRE-source composition lock
        ↓
visual-engine-v1027.js   memory canvas composite + POST + touch burst/lull
        ↓
visual-engine-v1028.js   text-only recall / full-frame readability field / fade
```

`index.html` loads both inherited base modules and the active tail. Older files are therefore not automatically dead code. Before deleting or consolidating versioned modules, verify the active script chain and inheritance graph.

A future refactor may flatten this history if the cost of maintaining the inheritance chain becomes real. Do not do so merely to make filenames cleaner.

## 10. Ordinary visual pipeline and POST

The retained stage representation includes concepts such as:

```text
preset-composition
common-crush
touch-rupture
preset-feedback
swipe-feedback
vignette
waveform
```

Global POST common FX are ordered separately through configuration. Current startup behavior is summarized in `PROJECT_STATE.md` and actual parameters live in `config.js`.

Important current rule:

- ordinary touch rupture can bypass global POST as designed;
- memory recall is an explicit exception: recalled image + readability field + typography are composited first and the current POST chain is then applied to the whole recall result.

## 11. Crop architecture

Each source draw can receive an independent adaptive crop.

Cover-fit is calculated from source dimensions and target buffer aspect, then artistic zoom/pan uses available overflow and legal clamping. Deep crops are intentional.

Current numeric crop range belongs in `config.js` / `PROJECT_STATE.md` rather than being repeated as an architectural constant.

## 12. Touch interaction

Mouse and one-finger touch normalize into downstream interaction state including:

```text
x
y
pressure
pressed
swipeSpeed
releaseEnergy
releaseAgeMs
```

Touch currently affects playback speed before recall activation and drives visual rupture/swipe processing.

### Touch rupture

Current behavior includes:

- grayscale high-contrast base;
- irregular horizontal slice heights;
- only a subset of slices displaced;
- mostly small displacement with occasional extreme fractures;
- velocity-aware release tail;
- reduced-resolution mobile path with frame skipping;
- stochastic burst/lull timing rather than a uniform high-rate refresh.

### Swipe feedback

Activation is conditional on pressed state and configured normalized swipe speed threshold.

Exact threshold/strength/resolution values are tuning data and should be read from config/state.

## 13. Memory recall architecture

Memory recall is no longer a DOM visual overlay.

`js/memory-recall-v1028.js` owns:

- pointer hold timer;
- capture of the current archive key/entry;
- retention of the resident `p5.Image` reference;
- deterministic fragment lookup;
- memory id/text state;
- activation timestamp;
- release/cancel reset;
- aria-live text mirroring.

The active visual engine owns recall rendering.

Current render path:

```text
hold-start
  -> capture current archive entry + resident image

hold threshold reached
  -> fixed memory source
  -> stop ordinary scene/crop/PRE progression
  -> clear obsolete temporal history

while held
  -> touch rupture
  -> optional swipe feedback
  -> full-frame translucent readability field
  -> MEMORY id + text
  -> ordered POST common FX
  -> vignette / waveform

release
  -> clear recall state / temporal buffers
  -> refresh ordinary composition
```

The fixed recalled image is rendered as the underlying memory surface; the v1.0.27 thumbnail was removed in v1.0.28.

The DOM memory node is retained only for accessibility text mirroring.

### Current limitation

The captured archive entry follows `MediaManager.currentImageIndex`. In multi-image compositions this is not guaranteed to represent the exact visually dominant or under-finger layer. Exact composited-layer hit resolution remains unresolved.

### Possible future content layer

If explicit memory records, links or persistent discovery state are actually adopted, content should remain separate from the visual renderer. This is a design direction only; there is no need to create a content schema before the work requires it.

## 14. Audio

The stable audible path uses native HTML audio with a parallel Web Audio analysis/effect layer.

The current stack includes:

- PCM analysis window;
- waveform;
- filter control;
- delay/feedback;
- distortion;
- subtle playback-rate movement;
- touch-dependent wet amount;
- independent runtime mute;
- pause integration through `DODREI_SET_PAUSED`.

Current soundtrack and actual parameters are asset/config state, not architecture constants.

## 15. Mobile visibility lifecycle

`js/mobile-visibility-v1024.js` handles mobile-only document visibility.

```text
hidden   -> DODREI_SET_PAUSED(true)
visible  -> resume only if this module auto-paused it
user PAU -> authoritative; do not auto-resume
```

Desktop is intentionally left unchanged.

## 16. Telemetry and HTML UI

Telemetry is both instrumentation and artwork and is rendered after processed visuals.

HTML/DOM currently handles:

- start screen;
- runtime control buttons;
- share/status UI;
- accessibility mirror for memory text.

Memory recall's visible dim/text is Canvas content, not DOM presentation.

Simple DOM controls are comparatively cheap. Performance risk mainly comes from full-frame Canvas work, large media, large CSS effects, extra video or additional concurrent processing.

## 17. Mobile performance strategy

Retained principles:

- `pixelDensity(1)`;
- bounded main composition dimensions;
- reduced-resolution analysis;
- bounded decoded image pool;
- sequential background image decode;
- reduced touch rupture/swipe buffers;
- reduced global feedback/glitch auxiliary buffers;
- mobile-heavy rupture frame skipping;
- compatible Canvas filters batched where possible;
- no active halation/bloom pass;
- explicit disposal/rebuild of graphics resources on viewport changes.

Exact current resolutions live in config/state.

## 18. Startup sequence

The current sequence remains:

```text
0.0s   soundtrack begins immediately after accepted user gesture
2.0s   title/start screen disappears
2.0-3.0s black screen + music only
3.0s   telemetry stage 1
3.2s   telemetry stage 2
3.4s   telemetry stage 3
6.4s   main visual at 20% brightness
7.4s   main visual at 100% brightness
```

Timing values originate in `config.js`; this section records the current presentation logic, not an immutable contract.

## 19. Editing map

| Goal | Primary source |
|---|---|
| tune current artwork | `config.js` |
| edit config through UI | `control/` |
| validation/editor metadata | `config-schema.js` |
| image discovery/resident rotation | `js/media-manager.js` + media config |
| visual algorithms / POST | active versioned visual-engine tail |
| normalized touch release | `js/interaction-v1020.js` |
| memory hold/content state | `js/memory-recall-v1028.js` |
| memory visual presentation | `js/visual-engine-v1026.js` → `v1028.js` |
| mobile hide/show lifecycle | `js/mobile-visibility-v1024.js` |
| audio | active audio modules |
| telemetry | telemetry modules |
| app frame/startup/pause/viewport | `sketch-v066.js` |
| PAU/MUT/UI/FS controls | `js/runtime-utility-controls-v105.js` |
| current script chain/cache key | `index.html` |
| current checkpoint / unresolved work | `PROJECT_STATE.md` |

## 20. Compatibility and migration policy

Do not equate old names with active project boundaries.

Retained identifiers such as `P5LAB_CONFIG`, `P5LabMediaManager` and older versioned modules may remain when changing them offers no functional benefit and would increase regression risk.

By contrast, old repository URLs, asset paths, user-visible project labels or documentation that can cause the current state to be reconstructed incorrectly are migration defects and should be corrected.

This distinction lets the project preserve working lineage without allowing obsolete external dependencies to survive unnoticed.

## 21. Source-of-truth / continuation rule

For a new session that needs repository state:

1. begin at the repository root `README.md`;
2. read root `PROJECT_STATE.md` to identify the active track;
3. for web work, read `web/README.md` and `web/PROJECT_STATE.md`;
4. verify `config.js` for actual defaults and runtime dependency paths;
5. verify `index.html` for the active module chain/cache key;
6. inspect only the relevant active modules;
7. use this architecture document when structural responsibility matters.

Do not reconstruct the current implementation from old version numbers, archive documents or stale conversation memory when the active repository can answer it directly.
