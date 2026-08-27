# DODREI Configuration Guide

Current config schema: **1**

이 문서는 `config.js`의 **구조, 의미, 편집·호환 규칙**을 설명한다. 현재 release 번호, config revision, 개별 tuning 값처럼 자주 바뀌는 값은 이 문서의 source of truth가 아니다.

현재 실제 값은 항상 `config.js`에서 확인하고, 작품의 현재 checkpoint와 의미 있는 변경은 `PROJECT_STATE.md`에서 확인한다.

## 1. Purpose

DODREI keeps runtime tuning in one canonical browser-side data file:

`config.js`

The file is intentionally readable/editable by hand and machine-readable by the static `control/` editor.

```text
config.js
   │ values
   ▼
DODREI runtime

config-schema.js
   │ meaning / validation / editor metadata
   ▼
DODREI CONTROL
```

The schema explains the config; it does not replace it.

## 2. Public browser configuration

These are artwork/runtime parameters, not secrets. GitHub Pages is a static public host, so `config.js` must never contain passwords, tokens, API secrets, private URLs, credentials, or other secret deployment data.

## 3. Canonical shape

```js
window.DODREI_CONFIG = {
  meta: {},
  app: {},
  timing: {},
  render: {},
  media: {},
  interaction: {},
  audio: {},
  visual: {},
  telemetry: {},
  control: {}
};

window.P5LAB_CONFIG = window.DODREI_CONFIG;
```

`P5LAB_CONFIG` remains a compatibility alias for older modules. It is an internal lineage/compatibility name, not the current project identity.

## 4. Version model

Keep these separate:

```text
app.version
```

Artwork/runtime release. This is consumed by runtime presentation/telemetry and should change when the displayed release meaningfully changes.

```text
meta.schemaVersion
```

Configuration contract version. Change only for meaningfully incompatible config-shape changes.

```text
meta.configRevision
```

Lightweight revision for config/tuning snapshots. It may change without an artwork/runtime version bump.

`meta.configRevision` is deliberately **not duplicated into every README/state/architecture document**. Small numeric tuning should not create a documentation synchronization burden. If a tuning change alters the meaning or behavior of the artwork enough to matter at project level, record that change in `PROJECT_STATE.md`.

### Historical v1.0.24 lesson

During v1.0.24, `index.html` showed a new start-note while `config.js app.version` still contained the previous release string. Pages had the new code, but telemetry/runtime presentation therefore looked stale.

Before declaring a deployment/version mismatch, verify both:

```text
index.html start-note / cache key
config.js app.version
```

This historical lesson remains valid even though the current release has moved on.

## 5. Current values and source of truth

Do not copy the whole current config into this guide.

For current work:

```text
actual runtime values      -> config.js
active module chain        -> index.html
current artwork checkpoint -> PROJECT_STATE.md
public compact summary     -> README.md
```

A share URL may serialize a subset of current runtime choices, but it is not a substitute for `config.js` as the canonical default configuration.

## 6. Stable IDs

Ordered object collections use stable IDs.

Example:

```js
presets: [
  {
    id: "photo-double-blend",
    name: "PHOTO_DOUBLE_BLEND",
    enabled: true
  }
]
```

The `id` is compatibility identity. Visible name or array position may change; the ID should not change casually.

This applies to:

- visual presets;
- visual pipeline stages;
- image sets.

## 7. Import / merge rules

DODREI CONTROL uses compatible partial merge.

- **Compatible**: current path/ID exists and imported value validates → use imported value.
- **Missing**: current config has a value absent from imported file → retain current-site value.
- **Obsolete**: imported path/ID is unknown → ignore.
- **Invalid**: known path but wrong type/range/structure → ignore.
- **Added**: collections that explicitly allow new IDs may accept them; current example is `media.imageSets`.

Preset and pipeline IDs are not open-ended because unknown effect/stage names do not create engine implementation.

A schema-version mismatch does not automatically reject the whole file. The editor warns and still attempts compatible path/ID-level merge.

## 8. Renamed fields

`config-schema.js` reserves an `aliases` map for migration.

```js
aliases: {
  "visual.oldThreshold": "visual.swipeFeedbackThreshold"
}
```

Prefer explicit migration aliases instead of indefinitely supporting duplicate field names.

## 9. Config is data, not code

Do not place functions, callbacks, arbitrary expressions or executable snippets inside the config object.

Bad:

```js
value: () => Math.random()
```

Good:

```js
strategy: "sequence"
swipeFeedbackThreshold: 0.15
```

Behavior belongs in modules; config selects supported behavior and supplies parameters.

## 10. Mode playlist

`visual.presets` is the current artwork mode playlist. The exact active order and defaults should be read from `config.js` or `PROJECT_STATE.md` rather than copied here as permanent documentation.

`visual.modeControl` determines sequencing, loop behavior, automatic/manual advance and start position.

Unknown preset IDs do not create new rendering code. New modes require implementation in the relevant engine/module first.

## 11. Visual pipeline

The `visual.pipeline` collection describes supported stable stage IDs and whether those stages are enabled. The active runtime still owns the actual execution semantics and compatibility rules.

Do not add an unknown stage in config and expect it to execute.

Global POST common FX are handled separately through `visual.postCommonFx`, including an ordered list of supported effect keys. The exact current startup chain belongs in `config.js` and the current state document.

## 12. Touch-related parameters

Touch behavior spans configuration and implementation.

Config owns tunable values such as:

- touch playback multiplier;
- swipe feedback threshold/strength/alpha;
- touch rupture resolution scales;
- rupture palette thresholds/colors.

Implementation owns timing/state behavior such as the burst/lull envelope and release logic unless those controls are explicitly promoted into config later.

Do not infer current numeric values from old version notes in this guide; read `config.js`.

## 13. Image sets, discovery and residency

`media.imageSets` uses stable IDs and subdirectories relative to the configured image root.

Example:

```js
imageSets: [
  { id: "default", subdir: "" }
]
```

Additional sets may be added as explicit subfolders when actual content requires them. Weighting, alternation or quota policy belongs in media selection, not visual-effect code.

Two selection layers must remain conceptually separate:

```text
archive -> resident working-set rotation
  candidate policy: currently shuffle-bag based

resident images -> visible scene selection
  scene policy: independently configured; currently random with replacement
```

### Repository migration rule

Image auto-discovery uses GitHub's public Contents API. `media.githubOwner`, `media.githubRepo`, `media.githubBranch` and `media.githubImageDir` must point to the repository/path that actually contains the deployed asset archive.

During the 2026-08-28 migration audit, these fields were found still pointing to the former `perfumeJaguar/perfumeJaguar.github.io/experiments/p5-media-lab/assets/images` location even though the implementation had moved to `fromhoyeon/dodrei/web/`. They were corrected to the current canonical repository.

When moving the project again, treat these fields as **runtime dependencies**, not merely documentation strings.

## 14. Memory recall and narrative state

Memory recall behavior is primarily code-owned rather than a general config schema.

The current implementation is split between the memory-recall module and the active visual-engine tail. `PROJECT_STATE.md` describes the current user-visible behavior and unresolved design questions.

Future explicit narrative content should preferably move into a dedicated content structure/file rather than bloating `config.js` with story content. Config may expose supported timing/visual parameters, while memory text/link/state data should remain its own content layer if that system is actually adopted.

This is an architectural direction, not a requirement to create a future schema now.

## 15. Mobile visibility pause

The mobile `visibilitychange` pause/resume behavior is currently code-owned rather than configurable.

It pauses only when the page becomes hidden and resumes only if the module itself caused the pause. User PAU state remains authoritative.

## 16. Local drafts

The Control page may store a browser `localStorage` draft. This is convenience only, not a backup or source of truth.

Important tuning states should be exported and/or committed to Git.

## 17. Static deployment workflow

Normal workflow:

```text
1. Open DODREI CONTROL (optional)
2. Load current site / local draft / file / pasted config
3. Edit and review warnings
4. Export config.js if using Control
5. Replace config.js
6. Update app.version only if the artwork/runtime release changes
7. Increment configRevision when useful for the config snapshot
8. Refresh index.html cache key when deployed assets/config/modules changed
9. Commit
10. Verify live runtime/telemetry when deployment behavior matters
```

The static browser control page has no repository write credentials.

## 18. Adding a parameter

Preferred sequence:

```text
1. Add runtime value to config.js.
2. Make module code read that path.
3. Add config-schema metadata if useful.
4. Test Control import/export when relevant.
5. Update PROJECT_STATE only if artwork behavior/decision materially changes.
6. Update ARCHITECTURE only if structure/responsibility changes.
7. Update this guide only if config semantics or editing rules change.
```

This prevents every small tuning edit from requiring synchronized prose changes across all documentation.

## 19. Current known limitations of the config/control layer

The config/control system does not currently provide a general solution for:

- dependency rules between fields;
- full semantic pair validation for every min/max relationship;
- GitHub write-back from the public control page;
- undo/redo history;
- general graph/node editing;
- automatic plugin discovery;
- a formal memory/narrative content schema;
- arbitrary POST graph behavior beyond what the active runtime implements.

These are limitations or possible future needs, not a roadmap that must be implemented.

## 20. Continuation rule

For config-related continuation work:

1. enter through the repository root `README.md` when repository state is needed;
2. read `web/PROJECT_STATE.md` for the current checkpoint;
3. verify `config.js` for actual values;
4. verify `index.html` for active modules/cache key when deployment is relevant;
5. inspect only the modules needed for the requested behavior.

Do not reconstruct current defaults from old versioned module names or stale prose.
