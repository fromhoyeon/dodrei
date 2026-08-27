# PROJECT_STATE — DODREI

Last updated: 2026-08-28

## Current phase

DODREI 전용 WORK 프로젝트와 repository 체계를 정립하는 단계다.

현재 repository의 실제 활성 구현은 브라우저 기반 p5.js 작업이며, 이전 포트폴리오/Pages 자료는 DODREI와 분리해 archive로 보존한다. 이번 정리는 기존 작품 코드를 재설계하기 위한 작업이 아니라, 앞으로 현재 상태를 빠르게 복구하고 안전하게 이어가기 위한 진입 구조를 만드는 작업이다.

## Active

### Web

경로: `web/`

현재 상세 상태는 해당 경로의 `PROJECT_STATE.md`가 canonical이다.

현재 확인된 checkpoint:

- artwork/runtime: `1.0.28`
- visual engine: `1.0.28`
- config schema: `1`
- PHOTO ONLY
- automatic mode advance OFF
- 96-image archive / 20-image resident pool
- 1-second memory recall

세부 구현, 활성 모듈, 파라미터와 미해결 문제는 하위 상태 문서와 실제 코드에서 확인한다.

## Known project tracks not yet normalized in this repository

다음 영역은 DODREI의 실제 작업 범위에 포함될 수 있으나, 현재 repository 안의 canonical 구조가 아직 확인·정립되지 않았다.

- TouchDesigner 기존 작품과 리팩터링 자료
- Max/MSP 및 audio 연동 계획
- local AI / 생성 이미지 / 외부 서비스 연동 자료
- 상위 작품 architecture와 stage/state/content/event 구조 관련 handoff
- 대용량 원본 이미지·영상·오디오 asset

이 항목들을 위해 빈 폴더나 문서 세트를 미리 만들지 않는다. 실제 자료를 가져오거나 작업을 시작할 때 현재 상태를 확인한 뒤 필요한 최소 구조를 결정한다.

## Repository decisions

- 루트 `README.md`를 저장소의 고정 진입점으로 사용한다.
- 루트 `PROJECT_STATE.md`에는 DODREI 전체 수준의 현재 활성 작업과 큰 상태만 기록한다.
- 프로젝트 특수 AI 작업 규칙은 `WORKING_GUIDE.md`에 둔다.
- 브라우저 기반 DODREI 구현체는 LAB/실험 성격의 과거 경로에서 벗어나 `web/`을 정식 구현 경로로 사용한다.
- 이전 포트폴리오 루트 파일과 `portfolio-v2/`는 삭제하지 않고 `archive/legacy-portfolio/`로 보존한다.
- GitHub Pages 루트 진입점은 `web/`의 활성 DODREI 작업으로 연결한다.
- 구조를 보기 좋게 만들기 위한 목적만으로 추가 이동·세분화하지 않는다.
- 작품의 개인적 기원이나 비공개 개념 원자료를 public repository의 canonical 문서로 만들지 않는다. 공개 저장소에는 실제 구현과 공개 가능한 작업 정보만 남기는 방향을 우선한다.

## Documentation status

현재 web 하위 문서 중 `PROJECT_STATE.md`와 `README.md`는 v1.0.28 상태를 반영한다.

`ARCHITECTURE.md`는 확인 시점에 v1.0.24 / visual engine v1.0.22 기준 헤더와 일부 이전 설명을 포함하고 있어 현재 구현의 완전한 상태 문서로 간주하지 않는다. architecture를 실제로 다시 다루는 작업에서 코드와 최신 state를 기준으로 갱신한다.

별도 `CONCEPT.md`는 현재 만들지 않는다. 작품의 비공개 기원·개인적 사유와 공개 가능한 작품 설명의 경계가 필요하므로, private 기록을 원자료로 두고 public repository에는 실제 필요가 생길 때 공개 가능한 설명만 별도로 정리한다.

## Archive

`archive/legacy-portfolio/`는 이 repository가 DODREI 전용으로 정리되기 전의 개인 포트폴리오 및 GitHub Pages 실험 자료다.

- 현재 DODREI 작업에는 비활성이다.
- 삭제하지 않고 역사적 참고용으로 보존한다.
- archive 내부의 과거 `README.md`와 `PROJECT_STATE.md`는 당시 포트폴리오 상태를 설명하는 문서이며 현재 DODREI의 canonical 문서가 아니다.

## Next

1. DODREI WORK 프로젝트의 Project Instructions와 repository 운영 규칙을 계속 검증한다.
2. 다음 실제 작업이 시작될 때 필요한 DODREI 자료만 repository에 가져와 분류한다.
3. web 외 영역은 실제 파일과 상태를 확인하기 전까지 구조를 만들지 않는다.
4. 몇 차례 실제 WORK 사례를 거친 뒤 반복적으로 유효한 규칙만 공통 working guide 후보로 승격한다.
