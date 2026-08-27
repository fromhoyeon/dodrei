# PROJECT_STATE — DODREI / Web

Last updated: 2026-08-28  
Repository: `fromhoyeon/dodrei`  
Path: `web/`  
Artwork/runtime: `1.0.28`  
Visual engine: `1.0.28`  
Config schema: `1`

이 문서는 브라우저 구현을 다시 시작할 때 필요한 **현재 checkpoint, 채택된 판단, 미해결 문제와 다음 작업**만 기록한다.

정확한 parameter는 `config.js`, 현재 로드되는 module chain과 cache key는 `index.html`, 구조와 책임 경계는 `ARCHITECTURE.md`가 source of truth다. 작은 tuning 값과 버전별 세부 변경 이력은 이 문서에 계속 복제하지 않는다.

## Current baseline

- PHOTO ONLY.
- automatic mode advance OFF; manual next-mode control ON.
- default mode: `PHOTO_DOUBLE_BLEND / TWIN_EXPOSURE//NULL`.
- visible scene selection: independent random with replacement; immediate repeat/duplicate allowed.
- decoded image archive working set: 20 resident images from the current 96-image archive.
- current POST startup chain: `HC -> GS -> FB -> ST -> GL`.
- touch slows visual playback before memory recall and drives rupture/swipe effects.
- mobile-heavy visual paths use reduced-resolution buffers/frame skipping rather than reducing the main artistic behavior first.
- current soundtrack: `20220302 - sarabande.mp3`.

Current visual defaults can be shared through:

```text
?fps=30&speed=S2&post=1&fx=HC,GS,FB,ST,GL&mode=photo-double-blend&crop=10-80
```

Exact current numeric values remain in `config.js`.

## Memory recall — adopted current behavior

Holding the artwork for **1 second** activates recall.

```text
hold-start
  -> capture current MediaManager archive entry + resident image

activation
  -> lock to fixed centered memory still
  -> stop normal preset image selection / random crop progression
  -> bypass PRE common FX / preset feedback
  -> clear obsolete temporal history

while held
  -> touch rupture remains active
  -> swipe feedback may remain active
  -> full-frame translucent black readability field
  -> MEMORY NNN + deterministic fragment text
  -> current ordered POST chain applies to the whole recall result

release
  -> clear recall/temporal state
  -> refresh ordinary composition cleanly
```

Visible recall presentation is Canvas content. The DOM recall node is only an accessibility text mirror.

The earlier thumbnail presentation is no longer active. The current 64-fragment deterministic pool intentionally mixes ordinary notes, numbers, incomplete records, technical-looking scraps and memory-like sentences rather than presenting one uniform literary voice.

### Current recall limitation

The recall target follows the MediaManager current archive entry captured at hold-start. In multi-image compositions this is not guaranteed to be the exact visually dominant or under-finger layer. Exact composited-layer hit resolution remains unresolved.

## Touch / visual behavior that is currently intentional

- grayscale rupture palette and irregular horizontal fractures;
- short velocity-aware release tail;
- stochastic burst/lull rupture timing rather than constant high-rate flicker;
- swipe feedback threshold low enough for small drags to engage;
- ordinary touch rupture may bypass global POST;
- recall is an intentional exception: recall image + dim + typography receive POST together;
- global feedback was strengthened after v1.0.28 through config tuning without changing the artwork/runtime version.

## Repository / deployment state

The active browser implementation and image discovery now both use:

```text
fromhoyeon/dodrei
└─ web/
   └─ assets/images/
```

The repository root redirects to `./web/` for GitHub Pages.

A 2026-08-28 migration audit found and corrected the previous runtime dependency on `perfumeJaguar/perfumeJaguar.github.io/experiments/p5-media-lab/assets/images`.

## Legacy internal names / refactor decision

The active code still contains `P5Lab*`, `P5LAB_*` identifiers and a long versioned visual-engine inheritance chain.

A 2026-08-28 review confirmed these names participate in current global aliases, class inheritance and ordered module loading rather than existing only as stale labels. For example newer `Dodrei*` subclasses extend inherited `P5Lab*` classes and then replace the active global alias; `P5LabUtils` is used across multiple modules.

**Decision:** do not perform a rename-only sweep now. It has broad regression surface and no meaningful runtime benefit.

If these names are cleaned up, do it together with an architecture refactor that flattens the versioned inheritance/module lineage into a new current baseline, with the active behavior verified before and after. User-visible old names, obsolete repository paths and stale state documents are still treated as migration defects and should be removed independently.

## Open possibilities — not adopted commitments

The following remain exploratory rather than fixed architecture:

- explicit memory/content records and persistent discovery state;
- hypertext/book/game-like navigation;
- hidden hotspots or other discovery interactions;
- stage/state/content/event systems;
- future coupling with TouchDesigner, Max/MSP, external audio or local AI.

Do not create schemas or modules for these until the artwork actually requires them.

## Current unresolved / next

1. Exact under-finger/composited-layer detection for memory recall remains unresolved.
2. Continue artistic evaluation of the stronger POST feedback; further small changes are config tuning unless they alter behavior meaningfully.
3. Explicit memory/content structure remains an open design question.
4. When structural work begins, use `ARCHITECTURE.md` rather than creating another handoff/state document.
5. A future code-baseline refactor may flatten versioned modules and rename `P5Lab*` compatibility identifiers together, but only as a dedicated verified refactor.

## Continuation

For ordinary web work:

```text
repository root README
  -> this PROJECT_STATE.md
  -> config.js / index.html / relevant code as needed
  -> ARCHITECTURE.md only when structure or responsibility matters
```

Do not read deleted/old guides or reconstruct current state from historical version labels when the active repository can be checked directly.
