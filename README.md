# DODREI

DODREI의 실제 구상·설계·구현·상태 관리를 위한 canonical 작업 저장소다.

개인적 기억과 삶의 기록, 공개할 필요가 없는 작품의 개인적 기원과 내부 사유는 별도의 private 기록에서 다룬다. 이 저장소에는 실제 DODREI 작업에 필요한 구현, 채택된 결정과 공개 가능한 작업 정보만 둔다.

## 작업 진입점

이 `README.md`는 저장소의 유일한 고정 진입점이다.

현재 활성 작업은 다음과 같다.

| Track | Status | Current state | Structure |
| --- | --- | --- | --- |
| `web/` | active | [`web/PROJECT_STATE.md`](web/PROJECT_STATE.md) | [`web/ARCHITECTURE.md`](web/ARCHITECTURE.md) |

일반적인 web 작업에서는 **이 README를 읽은 뒤 바로 `web/PROJECT_STATE.md`로 이동한다.** 구조를 이해하거나 큰 수정이 필요할 때만 `web/ARCHITECTURE.md`를 추가로 읽는다.

루트 [`PROJECT_STATE.md`](PROJECT_STATE.md)는 여러 구현 track 사이의 공통 상태나 DODREI 전체 수준의 결정이 실제로 생겼을 때 사용하는 project-level state다. 현재는 web 하나만 활성화되어 있으므로 일반적인 web 작업에서 읽을 필요가 없다.

정확한 parameter, 활성 module chain과 구현 세부는 문서에 복제하지 않고 실제 코드에서 확인한다.

```text
runtime values       -> web/config.js
active script chain  -> web/index.html
web checkpoint       -> web/PROJECT_STATE.md
web structure        -> web/ARCHITECTURE.md
project-wide state   -> PROJECT_STATE.md (필요할 때만)
```

## 문서 원칙

문서는 상태 복구와 안전한 작업에 실제로 필요한 만큼만 유지한다.

- 같은 현재값을 여러 문서에 반복하지 않는다.
- 작은 tuning과 파일 변경 이력은 config/code와 Git history에 맡긴다.
- `PROJECT_STATE.md`는 현재 상태, 채택된 판단, 미해결 문제와 다음 작업을 기록한다.
- `ARCHITECTURE.md`는 시스템 구조와 책임 경계, 수정할 때 확인해야 할 위치를 기록한다.
- 별도 config guide, asset guide, working guide, handoff 등은 내용이 독립 문서를 필요로 할 만큼 커졌을 때만 만든다.
- 새 구현 영역도 처음부터 같은 문서 세트를 강제하지 않는다. README에서 경로를 안내하고, 실제 복구 복잡성이 생긴 만큼만 state/architecture 문서를 둔다.

## Repository 작업 원칙

- repository 상태가 필요하면 항상 이 README부터 시작한다.
- 현재 대화와 이미 확인한 최신 정보로 충분하면 repository를 반복 조회하지 않는다.
- 필요한 작업 범위와 관련된 문서·코드만 확인한다.
- 가능성을 탐색한 아이디어와 실제 채택된 결정을 구분한다.
- 미래 가능성만을 위해 abstraction, 빈 폴더, placeholder module과 문서를 만들지 않는다.
- 대용량 원본 미디어와 대량 생성물은 기본적으로 Git 밖에서 관리하고, 실제 runtime/reproduction에 필요한 최적화 asset만 repository에 둘 수 있다.
- private context를 일반 구현 작업에서 자동으로 조회하거나 public 문서로 옮기지 않는다.
- checkpoint에서는 실제로 바뀐 상태와 결정만 관련 canonical 문서에 반영한다.

## 확장

TouchDesigner, Max/MSP, audio, local AI 등 다른 DODREI 구현 영역이 실제로 repository에 들어오면 그때 필요한 최소 구조를 만든다. 둘 이상의 활성 track에 공통된 상태·결정이 생기기 전에는 루트 상태 문서를 불필요하게 비대하게 만들지 않는다.
