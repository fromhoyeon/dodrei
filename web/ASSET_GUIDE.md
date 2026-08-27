# DODREI — Asset Guide

Current baseline: **photo-only**.

이 문서는 asset의 저장·사용 원칙을 설명한다. 정확한 현재 경로와 runtime dependency 값은 `config.js`와 실제 repository를 우선한다.

## Images

Recommended working format:

- JPEG or WebP for most photographic material;
- long edge roughly 1200–1800 px as a practical starting point;
- portrait / landscape / square may be mixed;
- avoid unnecessarily huge originals while the browser renderer remains Canvas2D/p5 based.

The current browser implementation keeps optimized runtime images under the active web asset tree and discovers the archive through GitHub's public Contents API. It keeps only a bounded decoded working set resident.

Repository/path settings used for discovery are **runtime dependencies**. If assets are moved to another repository or path, update the media discovery configuration together with the files rather than assuming the browser-relative image paths are enough.

## Future image sets

Additional sets can be stored as explicit subfolders when actual content requires them:

```text
assets/images/
├── personA/
├── personB/
└── ...
```

and configured in `config.js`:

```js
imageSets: [
  { id: "person-a", subdir: "personA" },
  { id: "person-b", subdir: "personB" }
]
```

The `id` is the stable configuration identity. `subdir` is the actual folder path relative to the configured image root.

Do not create set folders in advance merely because multi-set operation is possible.

## Selection layers

Two different selection systems exist and should not be conflated.

### Resident working-set rotation

The MediaManager maintains a bounded decoded pool. Candidate replacement images currently circulate through a shuffle bag so the archive can be covered without keeping every image decoded in memory.

### Visible scene selection

The visual engine selects from the resident images independently. The current scene policy permits random selection with replacement, so immediate repeats and the same image appearing in more than one visual slot are valid.

Future weighting, quotas, strict alternation and cross-set policies are not implemented. Add them only when an actual artistic requirement exists, and keep them in the media-selection boundary rather than visual FX code.

## Audio

One original composition is preferable because it exposes real musical density, dynamics and spectral balance.

Recommended:

- MP3;
- 44.1 kHz or 48 kHz;
- 192–320 kbps;
- one complete track.

Current audio path uses native HTML audio for stable audible playback plus a separate Web Audio analysis/effect layer.

## Video

Video code/assets may remain in the repository for earlier experiments, but video is not part of the current DODREI artistic baseline.

Do not optimize or expand the video asset workflow unless video becomes active again. Existing files should not be removed merely because they are inactive without first checking whether loaded legacy modules or historical reproduction still depend on them.

## Naming

Filename order is not the playback order.

Resident candidate circulation and visible-scene selection are both independent of ordinary filename ordering. Filenames may therefore stay human-readable without being used as sequencing instructions.

Prefer stable, simple names and avoid renaming large archives without reason because Git history and browser caches become noisier.

## Practical test diversity

Useful image archives should contain enough variation to expose the visual system:

- dark / bright;
- low / high contrast;
- portrait / landscape;
- close texture / wider scene;
- dominant-color / near-monochrome;
- different subject placement.

Because every source draw receives an independent crop, composition near image edges can become visible in unexpected viewports. Test with both portrait mobile and wide desktop layouts.

## Large/source media policy

Optimized assets required directly by the browser artwork may live in this repository.

Large original footage, source photo archives, intermediate renders and bulk generations should normally remain in local/external storage. Git should contain only what the runtime, reproduction or project history actually needs.

## Source of truth

For asset-related work:

1. enter through the repository root `README.md` if repository state is needed;
2. read `web/PROJECT_STATE.md` for the current baseline;
3. verify `config.js` for discovery paths, active limits and media policy;
4. verify actual repository folders;
5. inspect `js/media-manager.js` when selection/residency behavior matters.

Do not reconstruct asset rules from older `p5 Media Lab 01` documentation when current DODREI files can be checked.
