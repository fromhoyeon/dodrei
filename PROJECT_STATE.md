# PROJECT_STATE — DODREI

Last updated: 2026-08-28

이 문서는 DODREI **전체 수준의 상태가 실제로 필요할 때만** 사용하는 project-level state다.

현재 활성 구현 track은 `web/` 하나뿐이다. 따라서 일반적인 web 작업에서는 이 문서를 읽지 않고 루트 `README.md`에서 바로 [`web/PROJECT_STATE.md`](web/PROJECT_STATE.md)로 이동한다.

## Current project-level state

- active track: `web/`
- web implementation state: [`web/PROJECT_STATE.md`](web/PROJECT_STATE.md)
- web architecture: [`web/ARCHITECTURE.md`](web/ARCHITECTURE.md)
- TouchDesigner, Max/MSP, local AI 등 다른 구현 track은 아직 이 repository 안에서 canonical 구조를 갖지 않는다.

현재 DODREI 전체 수준에서 web state와 별도로 관리해야 할 공통 runtime state나 cross-track dependency는 없다.

## 이 문서를 확장하는 시점

다음과 같은 실제 필요가 생겼을 때만 내용을 늘린다.

- 둘 이상의 활성 구현 track이 생겨 서로의 상태를 조정해야 함;
- 여러 track에 공통으로 영향을 주는 작품적·기술적 결정이 생김;
- repository 전체의 release/deployment 관계를 별도로 복구해야 함;
- 하위 state 하나만으로는 DODREI 전체의 현재 상태를 이해하기 어려워짐.

그 전까지는 이 문서를 얇게 유지한다. 세부 구현 상태, parameter, 버전별 변경 이력과 architecture를 여기 복제하지 않는다.
