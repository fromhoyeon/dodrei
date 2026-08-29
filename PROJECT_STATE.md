# PROJECT_STATE — DODREI

Last updated: 2026-08-29

이 문서는 DODREI **전체 수준의 상태가 실제로 필요할 때만** 사용하는 project-level state다.

현재 활성 구현 track은 `web/` 하나뿐이다. 따라서 일반적인 web 작업에서는 이 문서를 읽지 않고 루트 `README.md`에서 바로 [`web/PROJECT_STATE.md`](web/PROJECT_STATE.md)로 이동한다.

## Current project-level state

- active track: `web/`
- web implementation state: [`web/PROJECT_STATE.md`](web/PROJECT_STATE.md)
- web architecture: [`web/ARCHITECTURE.md`](web/ARCHITECTURE.md)
- TouchDesigner, Max/MSP, local AI 등 다른 구현 track은 아직 이 repository 안에서 canonical 구조를 갖지 않는다.
- 현재 web runtime/state는 2026-08-28 checkpoint 이후 별도 구현 변경 없이 유지되고 있다.

현재 DODREI 전체 수준에서 web state와 별도로 관리해야 할 공통 runtime state나 cross-track dependency는 없다.

## Current artistic direction

다음은 특정 web 효과의 설명이 아니라, 현재 DODREI의 구현과 이후 다른 track에도 영향을 줄 수 있는 project-level 작품적 기준이다.

- DODREI에서 기억은 보존된 원본을 정확히 다시 꺼내는 행위보다 **불완전한 회수와 재구성**에 가깝게 다룬다.
- archive의 image/video/material은 단순히 저장된 과거를 보여주는 source가 아니라, 반복적인 선택·조합·변형을 통해 매번 다른 현재의 상태를 만드는 재료가 될 수 있다.
- 회상 과정에서 원본 기억 또는 하나의 확정된 ground truth가 직접 복원되지 않을 가능성을 열어둔다. 현재 나타나는 이미지와 의미는 회수 과정 자체에서 다시 구성될 수 있다.
- 반복된 기록·회상·재배열을 통해 인과나 의미가 사후적으로 생겨나는 구조를 중요한 관심사로 둔다.
- 위 개념을 개별 visual/audio effect와 일대일 상징 관계로 고정하지 않는다. 실제 구현은 독립적인 미적·기술적 판단을 유지한다.

현재 web의 memory recall interaction은 이 방향과 연결될 수 있지만, project-level 개념이 특정 interaction 하나로 환원되는 것은 아니다.

## Public / private boundary

- 작품의 개인적 기원과 공개할 필요가 없는 삶의 기록은 이 repository의 canonical public state로 옮기지 않는다.
- 공개 작품은 그 기원을 직접 설명하거나 하나의 정답으로 제시할 필요가 없다.
- 개인적 source에서 출발한 감각·구조·작업 방식이 실제 작품에 남더라도, 공개 설명은 작품에서 확인 가능한 구조와 채택된 판단을 중심으로 한다.

## Exploratory, not adopted

다음은 최근 논의되었지만 현재 DODREI의 공식 mythology나 구현 요구사항으로 채택되지 않았다.

- 존재하지 않는 새 `Dodrei`를 둘러싼 false documentation / fake archive;
- 관찰 기록, 이미지, 소리, 상충하는 증언 등이 반복되며 허구의 현실성을 획득하는 public mythology;
- 이를 web navigation, hidden archive, hypertext 등의 구체적 interface 구조로 확장하는 방식.

이 가능성들은 실제 작품 요구가 생기기 전까지 schema, module, content system으로 선행 구현하지 않는다.

## 이 문서를 확장하는 시점

다음과 같은 실제 필요가 생겼을 때만 내용을 늘린다.

- 둘 이상의 활성 구현 track이 생겨 서로의 상태를 조정해야 함;
- 여러 track에 공통으로 영향을 주는 작품적·기술적 결정이 생김;
- repository 전체의 release/deployment 관계를 별도로 복구해야 함;
- 하위 state 하나만으로는 DODREI 전체의 현재 상태를 이해하기 어려워짐.

그 전까지는 이 문서를 얇게 유지한다. 세부 구현 상태, parameter, 버전별 변경 이력과 architecture를 여기 복제하지 않는다.
