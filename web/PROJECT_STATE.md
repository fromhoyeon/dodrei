# PROJECT_STATE — DODREI / Web

마지막 갱신: 2026-08-28  
저장소: `fromhoyeon/dodrei`  
경로: `web/`  
작품/실행 버전: `1.0.28`  
시각 엔진: `1.0.28`  
설정 스키마(config schema): `1`

이 문서는 브라우저 구현을 다시 시작할 때 필요한 **현재 상태(checkpoint), 채택된 판단, 미해결 문제와 다음 작업**만 기록한다.

정확한 매개변수는 `config.js`, 현재 로드되는 모듈 체인과 캐시 키(cache key)는 `index.html`, 구조와 책임 경계는 `ARCHITECTURE.md`가 기준(source of truth)이다. 작은 조정 값과 버전별 세부 변경 이력은 이 문서에 계속 복제하지 않는다.

## 현재 기준 상태

- 사진만 사용(PHOTO ONLY).
- 자동 모드 전환은 꺼져 있고, 수동 다음 모드 전환은 켜져 있다.
- 기본 모드: `PHOTO_DOUBLE_BLEND / TWIN_EXPOSURE//NULL`.
- 화면에 보이는 장면은 매번 독립적으로 다시 뽑는 무작위 선택(random with replacement)을 사용한다. 즉시 반복이나 같은 source 중복도 허용한다.
- 현재 96개 이미지 archive 중 디코딩된 작업 집합(working set) 20개를 메모리에 유지한다.
- 현재 POST 시작 체인: `HC -> GS -> FB -> ST -> GL`.
- 터치는 memory recall 전의 visual playback을 늦추고 rupture/swipe 효과를 제어한다.
- 모바일에서 무거운 시각 처리 경로는 작품의 핵심 동작을 먼저 줄이기보다 해상도를 낮춘 buffer와 frame skipping을 사용한다.
- 현재 soundtrack: `20220302 - sarabande.mp3`.

현재 시각 기본값은 다음 URL parameter로 공유할 수 있다.

```text
?fps=30&speed=S2&post=1&fx=HC,GS,FB,ST,GL&mode=photo-double-blend&crop=10-80
```

정확한 현재 숫자 값은 `config.js`를 기준으로 한다.

## Memory recall — 현재 채택된 동작

작품을 **1초 동안 누르고 있으면** recall이 활성화된다.

```text
hold-start
  -> 현재 MediaManager archive entry + resident image 확보

activation
  -> 중앙에 고정된 memory still로 잠금
  -> 일반 preset 이미지 선택 / random crop 진행 중지
  -> PRE 공통 FX / preset feedback 우회
  -> 더 이상 필요 없는 temporal history 초기화

while held
  -> touch rupture 유지
  -> swipe feedback은 유지 가능
  -> 화면 전체 반투명 검정 readability field
  -> MEMORY NNN + deterministic fragment text
  -> 현재 정렬된 POST chain을 recall 결과 전체에 적용

release
  -> recall/temporal state 초기화
  -> 일반 composition을 깨끗하게 갱신
```

화면에 보이는 recall 표현은 Canvas 내용이다. DOM recall node는 접근성을 위한 text mirror 역할만 한다.

과거의 thumbnail 표현은 더 이상 사용하지 않는다. 현재 64개 deterministic fragment pool은 하나의 통일된 문학적 목소리보다 평범한 메모, 숫자, 불완전한 기록, 기술적으로 보이는 조각, 기억 같은 문장을 의도적으로 섞는다.

### 현재 recall 한계

Recall 대상은 hold 시작 시점에 확보한 MediaManager의 현재 archive entry를 따른다. 여러 이미지가 합성된 화면에서는 이것이 실제로 가장 지배적인 layer나 손가락 아래 layer와 정확히 일치한다고 보장할 수 없다. **합성된 화면에서 정확히 어떤 layer를 눌렀는지 판별하는 문제**는 아직 해결되지 않았다.

## 현재 의도된 터치 / 시각 동작

- grayscale rupture palette와 불규칙한 horizontal fracture
- 짧고 속도에 반응하는 release tail
- 계속 빠르게 깜빡이기보다 burst/lull을 갖는 stochastic rupture timing
- 작은 drag도 동작할 수 있도록 낮춘 swipe feedback threshold
- 일반 touch rupture는 global POST를 우회할 수 있음
- recall은 의도적인 예외로, recall image + dim + typography에 POST를 함께 적용
- v1.0.28 이후 작품/실행 버전은 바꾸지 않고 config tuning으로 global feedback을 강화함

## 저장소 / 배포 상태

현재 브라우저 구현과 이미지 자동 탐색은 모두 다음 경로를 사용한다.

```text
fromhoyeon/dodrei
└─ web/
   └─ assets/images/
```

저장소 루트는 GitHub Pages에서 `./web/`으로 이동시킨다.

2026-08-28 migration audit에서 이전 실행이 `perfumeJaguar/perfumeJaguar.github.io/experiments/p5-media-lab/assets/images`에 의존하던 문제를 확인하고 수정했다.

## 열려 있는 가능성 — 아직 채택하지 않음

다음은 고정된 architecture가 아니라 탐색 단계다.

- 명시적인 memory/content record와 지속되는 발견 상태(persistent discovery state)
- hypertext/book/game 계열의 탐색 구조
- hidden hotspot 또는 다른 discovery interaction
- stage/state/content/event system
- 향후 TouchDesigner, Max/MSP, external audio, local AI와의 연결

실제 작품이 요구하기 전에는 이를 위한 schema나 module을 만들지 않는다.

## 현재 미해결 문제 / 다음 작업

1. memory recall에서 **실제로 손가락 아래 있거나 합성에 사용된 layer를 정확히 판별하는 방법**이 아직 해결되지 않았다.
2. 강화된 POST feedback의 작품적 결과를 계속 평가한다. 동작의 성격을 바꾸지 않는 작은 변경은 config tuning으로 처리한다.
3. 명시적인 memory/content 구조를 만들지는 아직 열린 설계 문제다.
4. 구조 작업을 시작할 때는 새로운 handoff/state 문서를 만들지 말고 `ARCHITECTURE.md`를 사용한다.

## 작업 이어가기

일반적인 웹 작업:

```text
저장소 루트 README
  -> 이 PROJECT_STATE.md
  -> 필요할 때만 config.js / index.html / 관련 코드
  -> 구조나 책임 경계가 중요할 때만 ARCHITECTURE.md
```

현재 저장소를 직접 확인할 수 있다면 삭제되었거나 오래된 guide, 과거 버전 이름만으로 현재 상태를 복원하지 않는다.
