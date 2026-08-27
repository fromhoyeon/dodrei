# DODREI — Web Architecture

Current artwork/runtime: **v1.0.28**  
Current visual engine: **v1.0.28**  
Current config schema: **1**  
Architecture reviewed: **2026-08-28**

이 문서는 `web/` 구현의 **구조, 책임 경계, 안전하게 수정하기 위해 알아야 할 안정적인 운영 규칙**을 설명한다.

현재 checkpoint와 미해결 문제는 `PROJECT_STATE.md`, 실제 parameter 값은 `config.js`, 현재 로드되는 module chain/cache key는 `index.html`이 우선한다.

별도 config/asset guide는 현재 필요하지 않다. 구조적으로 중요한 내용은 이 문서에 통합하고, 자주 바뀌는 값은 실제 코드/config에 맡긴다.

## 1. Design objective

DODREI web은 mobile-first browser media artwork다.

현재 architecture가 우선하는 것은 다음이다.

- 현재 작품 동작을 명확하게 유지한다.
- mobile 비용을 bounded하게 유지한다.
- media selection, interaction, analysis/audio, rendering/content state를 필요 이상으로 결합하지 않는다.
- 실제로 독립된 책임이 있는 subsystem만 분리한다.
- generic framework를 만드는 것을 목표로 하지 않는다.
- 미래 가능성만을 위해 placeholder architecture나 schema를 미리 만들지 않는다.

## 2. Runtime graph

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

Ordinary frame orchestration is owned by `sketch-v066.js`.

```text
interaction update
-> media update
-> analysis
-> audio update
-> visual render
-> telemetry
```

Memory recall does not create a second application loop. The memory module owns hold/capture state; the active visual engine renders the alternate recall path in the same Canvas system.

## 3. Configuration / Control

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

### Sources of truth

```text
app.version          artwork/runtime release
meta.schemaVersion   incompatible config-contract version
meta.configRevision  lightweight config/tuning revision
```

A small tuning change may increment `configRevision` without changing the artwork/runtime version.

`config.js` is data, not executable behavior. Functions/callbacks do not belong in the config object; modules implement behavior and config selects supported behavior/parameters.

### Stable IDs

Preset, pipeline stage and image-set collections use stable IDs. Visible labels or array positions may change without changing identity.

Adding an unknown preset/stage ID to config does not create rendering implementation.

### Import / migration

Control uses compatible merge semantics:

- known valid value -> import;
- missing current field -> retain current value;
- unknown/obsolete field -> ignore;
- invalid value -> ignore;
- collections that explicitly allow new IDs may accept them.

Renamed fields should use explicit migration aliases in `config-schema.js` rather than maintaining duplicate names indefinitely.

A schema-version mismatch may warn while still allowing compatible known paths to merge.

### Deployment

When config/modules/assets change:

1. update the relevant source;
2. change `app.version` only when the artwork/runtime release meaningfully changes;
3. increment `configRevision` when useful;
4. refresh the `index.html` cache key when deployed resources changed;
5. verify live runtime/telemetry when deployment behavior matters.

The public Control page has no repository write credentials. Browser `localStorage` drafts are convenience only, not canonical backup.

## 4. Repository / asset boundary

The active implementation lives at:

```text
repository  fromhoyeon/dodrei
path        web/
```

The root Pages entry redirects to `./web/`.

Image auto-discovery uses GitHub's public Contents API. Therefore repository/path fields in `config.js` are **runtime dependencies**, not descriptive metadata.

```text
GitHub Contents API
-> configured repository/image directory
-> filename metadata
-> browser-relative ./assets/images/... paths
-> decoded resident working set
```

If the project or asset tree moves, update the discovery dependency together with the files.

Optimized assets required directly by the artwork may live in this repository. Large original footage/photo archives, intermediate renders and bulk generated media should normally remain in local/external storage unless reproduction or runtime requires them.

Filename order is not playback order; avoid mass renaming assets without a functional reason because it creates cache/Git noise.

## 5. MediaManager and selection layers

`js/media-manager.js` owns:

- archive discovery as lightweight metadata;
- image-set identity;
- bounded decoded residency;
- background staging/replacement;
- eviction of old decoded references;
- current source/image-pool exposure.

Two randomness layers are intentionally separate.

```text
archive -> resident pool
candidate circulation: shuffle-bag style

resident pool -> visible scene
selection: independent random with replacement
```

Visible immediate repeats and duplicate source usage can therefore be artistically valid even while resident-pool rotation tries to circulate the archive efficiently.

Image sets use stable `id` + storage `subdir`. Future weighting, quotas or alternation belong at this media-selection boundary only when the artwork requires them.

## 6. Visual modes / pipeline

The runtime supports a preset playlist whose exact order/enabled state is config-owned. Current mode state is summarized in `PROJECT_STATE.md`.

Conceptual pipeline stages include:

```text
preset composition
-> common/touch processing
-> preset/swipe feedback
-> memory composition when active
-> global POST when applicable
-> vignette / waveform
```

Important current exception:

- ordinary touch rupture may bypass global POST;
- recall explicitly composites the fixed memory image + readability field + typography and then applies the current POST chain to that combined result.

Deep adaptive crops are intentional. Cover-fit is computed first, then zoom/pan uses available overflow and legal clamping.

## 7. Versioned visual-engine lineage

The current browser implementation grew through additive versioned subclasses. `index.html` loads a long ordered chain, and the active tail currently reaches `visual-engine-v1028.js`.

Important retained layers include:

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

Older loaded modules are not automatically dead code. Verify `index.html` and inheritance before deleting or flattening them.

### `P5Lab*` / `P5LAB_*` naming decision

The implementation still uses inherited identifiers such as:

```text
P5LabUtils
P5LabInteraction
P5LabMediaManager
P5LAB_CONFIG
P5LAB_VISUAL_ENGINE_CLASS
...
```

These are not merely stale labels. They participate in active wiring:

- base classes are extended by newer `Dodrei*` subclasses;
- later modules overwrite global aliases to select the newest implementation;
- common namespaces such as `P5LabUtils` are referenced across many loaded modules;
- `index.html` depends on strict module order.

A rename-only sweep would therefore touch a broad dependency surface while providing almost no runtime benefit.

**Current policy:** retain compatibility identifiers. When the versioned chain becomes worth flattening into a clean baseline, perform naming cleanup as part of that dedicated architecture refactor and verify behavior before/after. Do not mix it into unrelated feature work.

Old external repository paths, stale user-visible names or wrong canonical state are different: those are migration defects and should be fixed independently.

## 8. Interaction

Mouse and one-finger touch normalize into state such as:

```text
x / y
pressure
pressed
swipeSpeed
releaseEnergy
releaseAgeMs
```

Current touch behavior includes grayscale rupture, irregular slices, velocity-aware release, reduced-resolution mobile processing and stochastic burst/lull timing.

Exact thresholds, strengths and scales are tuning values in `config.js`.

## 9. Memory recall

`js/memory-recall-v1028.js` owns:

- hold timer;
- capture of current archive entry;
- retention of resident image reference;
- deterministic fragment selection;
- memory id/text state;
- activation timestamp;
- release/cancel reset;
- aria-live text mirroring.

The active visual engine owns visible recall rendering.

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

The DOM memory node is accessibility-only.

Exact under-finger/composited-layer resolution is not solved yet; this is a current limitation, not a reason to prebuild a generalized hit-testing system.

If explicit linked memory records or persistent discovery are later adopted, content data should stay separate from the renderer. No schema is needed until that work actually begins.

## 10. Audio / lifecycle / telemetry

Audio uses native HTML playback plus a parallel Web Audio analysis/effect path. Current capabilities include PCM analysis, waveform, filtering, delay/feedback, distortion, subtle rate movement, touch-dependent wet control, mute and pause integration.

`mobile-visibility-v1024.js` pauses on mobile document hide and resumes only when that module itself caused the pause; user PAU state remains authoritative.

Telemetry is both instrumentation and artwork and is drawn after the processed visual surface.

DOM is reserved for relatively cheap UI/presentation tasks; large full-frame Canvas processing and media residency are the main performance concerns.

## 11. Performance principles

- `pixelDensity(1)`;
- bounded main composition dimensions;
- bounded decoded image pool;
- reduced-resolution analysis and auxiliary FX buffers;
- sequential background decode;
- mobile frame skipping for heavy rupture work;
- batching compatible Canvas filters where possible;
- no active halation/bloom pass;
- explicit resource disposal/rebuild on viewport changes.

When performance regresses, reduce auxiliary resolution/work frequency before removing defining artistic behavior.

## 12. Editing map

| Goal | Primary source |
| --- | --- |
| current checkpoint / next | `PROJECT_STATE.md` |
| exact runtime tuning | `config.js` |
| config validation/editor metadata | `config-schema.js` |
| static config editor | `control/` |
| active module chain/cache key | `index.html` |
| archive discovery/resident rotation | `js/media-manager.js` |
| visual algorithms / POST | active visual-engine lineage |
| touch release state | `js/interaction-v1020.js` |
| memory hold/content state | `js/memory-recall-v1028.js` |
| mobile visibility | `js/mobile-visibility-v1024.js` |
| app frame/startup/pause/viewport | `sketch-v066.js` |
| runtime controls | relevant UI/control modules |

## 13. Documentation / continuation rule

The active web documentation is intentionally only:

```text
PROJECT_STATE.md
ARCHITECTURE.md
```

For an ordinary new session:

```text
root README
-> web/PROJECT_STATE.md
-> relevant config/code only as needed
```

Read this architecture document when the task changes module responsibility, data flow, compatibility boundaries or large implementation structure.

Do not recreate separate README/config/asset/handoff documents merely to categorize information. Split a new document only when one of these two files becomes genuinely insufficient for an independent responsibility.
