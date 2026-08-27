# DODREI

DODREI의 실제 구상·설계·구현·상태 관리를 위한 작업 저장소다.

이 저장소는 작품의 현재 구현과 채택된 구조를 장기적으로 보존하는 canonical 작업공간으로 사용한다. 개인적 기억과 삶의 기록, 작품 하나를 넘어서는 예술적·철학적 탐구는 필요한 경우 별도의 개인 기록 체계에서 다루고, 이곳에는 실제 DODREI 작업에 필요한 결정과 상태만 남긴다.

DODREI의 개인적 기원, 비공개 컨셉, 아직 공개 여부가 정해지지 않은 해석과 내부 사유는 private `fromhoyeon/hoyeon` repository의 `project-context/dodrei/`에서 관리한다. 실제 구현 상태, 코드, architecture, release와 배포 관련 정보는 이 `dodrei` repository를 canonical source로 사용한다.

## 진입점

`README.md`는 이 저장소에서 고정하는 최초 진입점이다.

AI나 작업자가 현재 상태를 확인할 때는 다음 순서를 기본으로 한다.

1. 이 `README.md`
2. [`PROJECT_STATE.md`](PROJECT_STATE.md) — DODREI 전체의 현재 작업 상태
3. 실제 작업 대상의 하위 `README.md` / 상태 문서
4. 필요한 architecture 문서와 실제 코드
5. 작업 규칙이 필요하면 [`WORKING_GUIDE.md`](WORKING_GUIDE.md)
6. 작품의 private context가 실제로 필요한 경우에만 `fromhoyeon/hoyeon/project-context/dodrei/` 참조

현재 대화나 이미 확인된 정보만으로 충분하면 위 문서를 매번 전부 읽을 필요는 없다. 정확한 과거 상태가 필요한 범위만 확인한다.

## 현재 구조

- `web/` — 현재 활성 브라우저 기반 DODREI 구현체.
- `archive/legacy-portfolio/` — 이 저장소가 DODREI 전용이 되기 전 사용하던 포트폴리오/Pages 실험 자료. 비활성 참고 자료이며 임의로 현재 DODREI 구조에 섞지 않는다.
- `PROJECT_STATE.md` — DODREI 전체 수준의 현재 상태와 다음 작업을 기록한다.
- `WORKING_GUIDE.md` — 이 저장소에서 AI와 함께 작업할 때 필요한 프로젝트 특수 규칙을 기록한다.

새 폴더나 문서 유형은 실제 필요가 생길 때만 추가한다. TouchDesigner, Max/MSP, audio, local AI 등 향후 작업도 자료의 실제 상태를 먼저 확인한 뒤 필요한 최소 구조만 만든다.

## Canonical 원칙

- 전체 프로젝트의 현재 범위와 활성 작업은 루트 `PROJECT_STATE.md`에서 확인한다.
- 개별 구현의 세부 상태는 해당 작업의 하위 상태 문서와 실제 코드가 우선한다.
- 문서와 코드가 어긋나면 실제 구현을 확인해 문서를 갱신한다.
- 작품의 private context와 실제 구현 상태를 같은 문서에서 억지로 관리하지 않는다.
- 과거 handoff나 archive는 참고 자료이며 현재 상태의 source of truth로 사용하지 않는다.
- 대용량 원본 이미지·영상·오디오는 일반 Git 저장소에 무조건 넣지 않는다. 런타임에 실제 필요한 최적화 asset은 예외로 둘 수 있다.

## 현재 활성 작업

브라우저 기반 DODREI의 현재 상세 상태는 다음에서 이어간다.

- [`web/README.md`](web/README.md)
- [`web/PROJECT_STATE.md`](web/PROJECT_STATE.md)
