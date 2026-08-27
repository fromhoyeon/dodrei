# Working Guide

이 문서는 DODREI 저장소에서 AI와 함께 실제 작업을 이어가기 위한 프로젝트 특수 작업 가이드다. 상위 전역 지침과 개인 공통 가이드에서 이미 다루는 일반 행동은 반복하지 않는다.

현재 활성 경로, 버전, 구체적인 파일 목록 같은 가변 정보는 이 문서에서 고정하지 않고 루트 `README.md`와 현재 상태 문서에서 확인한다.

## 작업 시작

- 저장소의 현재 상태가 필요하면 루트 `README.md`를 먼저 읽고 거기서 안내하는 canonical 문서만 필요한 범위에서 확인한다.
- 과거 대화나 기억만으로 현재 구현을 재구성하지 않는다. 버전, 활성 파일, architecture, 설정처럼 정확성이 필요한 내용은 실제 repository에서 확인한다.
- 이미 활성 상태 문서가 있는 하위 작업은 그 문서와 실제 코드를 우선 존중한다.
- 현재 대화와 이미 확인한 최신 자료로 충분하면 같은 문서를 습관적으로 반복 조회하지 않는다.

## DODREI에서 관리할 것

이 저장소에는 실제 작품 작업에 필요한 내용을 둔다.

- 채택된 작품 개념과 현재 버전
- 작품별/구현별 설계와 구현
- p5.js, TouchDesigner, Max/MSP, audio, local AI 등 실제 시스템
- architecture, content/asset 운용 방식, 테스트와 프로토타입
- 현재 구현 상태, 결정, 미해결 문제와 다음 작업

개인적 기원·기억 자체, 작품 하나를 넘어서는 철학적 탐구, 개인 예술관과 삶의 기록은 public repository의 canonical 원자료로 만들지 않는다. 이런 맥락이 실제 DODREI 작업에 필요하면 private 기록을 참고하고, public repository에는 구현과 공개에 필요한 수준의 결정만 남긴다.

공개 설명이나 artist text가 실제 산출물로 필요해지면 그 목적에 맞는 공개 가능한 문서를 별도로 만들 수 있다. 작품의 비공개 source layer 전체를 설명하는 문서를 기본 문서로 두지는 않는다.

## 상태와 문서

- 루트 `PROJECT_STATE.md`는 DODREI 전체의 활성 작업과 큰 상태만 유지한다.
- 세부 구현이 자체 상태 문서를 필요로 할 만큼 커졌을 때만 하위 상태 문서를 둔다.
- `ARCHITECTURE.md`, asset guide, config guide, handoff, 공개 작품 설명 등은 실제로 역할이 있을 때만 유지하거나 만든다.
- 동일한 상태를 여러 문서에 전문으로 반복하지 않는다. 상위 문서는 요약과 경로를 제공하고 세부 내용은 해당 canonical 문서에 둔다.
- 현재 parameter처럼 자주 변하는 값은 실제 config/code가 더 적절한 source of truth라면 문서마다 복제하지 않는다.
- 문서가 오래되어 실제 코드와 다르면 오래된 문서를 source of truth로 취급하지 않는다.
- archive 문서는 당시 상태를 보존하는 역사 자료다. 현재 문서처럼 보인다는 이유만으로 과거 내용을 현재 관점으로 다시 쓰지 않는다.

## 자료 분류

자료를 정리할 때 먼저 실제 상태를 확인하고 다음 정도만 구분한다.

- active — 현재 작업에 직접 사용
- reference — 과거 구현이나 아이디어 참고용
- archive — 현재 DODREI와 직접 관련 없거나 종료된 자료
- temporary — 전달/이행을 위한 임시 자료
- undecided — 아직 역할이 불명확해 그대로 두는 자료

분류를 위해 새 폴더 체계를 미리 세분화하지 않는다. 실제 파일이 쌓여 필요해질 때만 구조를 만든다.

## Asset

- 브라우저 작품이 직접 사용하는 최적화 이미지·오디오 등은 repository에 둘 수 있다.
- 대용량 원본 촬영물, 중간 렌더, 대량 생성물은 기본적으로 로컬/외부 저장소에 두고 Git에는 manifest, 선택본, 설정, 재현에 필요한 정보만 남기는 방향을 우선한다.
- 기존 asset을 이동하거나 이름을 바꿀 때는 코드 참조와 배포 경로 영향을 먼저 확인한다.
- GitHub API repository/path처럼 asset discovery에 실제 사용되는 설정은 단순한 설명 문자열이 아니라 runtime dependency로 취급한다.

## 변경과 checkpoint

- 수정 요청을 받으면 관련 파일과 영향 범위만 확인하고 작업한다.
- checkpoint에서는 이번 작업에서 실제로 바뀐 범위의 상태 문서만 갱신한다.
- 관련된 변경은 논리적으로 완결된 commit 단위로 묶고, 다른 진행 중인 변경을 임의로 포함하지 않는다.
- 구조 변경은 정리 자체가 목적이 되지 않도록 한다. 현재 작업을 더 빨리 이해하고 재개할 수 있을 때만 수행한다.
- 작은 tuning 값만 변했다면 Git history와 config 자체로 충분한지 먼저 판단하고, 모든 문서를 기계적으로 갱신하지 않는다.

## Compatibility와 migration

과거 구현에서 이어진 내부 identifier나 versioned module은 현재 architecture에 실제로 사용되고 있다면 단순히 이름이 오래되었다는 이유로 정리하지 않는다.

반대로 다음은 현재 상태 복구나 실행을 잘못되게 만들 수 있으므로 migration defect로 보고 수정한다.

- 이전 repository를 가리키는 실제 runtime dependency
- 이미 이동한 asset/code의 잘못된 활성 경로
- 현재 canonical 상태와 충돌하는 active 문서
- 사용자에게 노출되는 오래된 프로젝트명이나 잘못된 release 표기

현재 활성 구현 경로와 archive 위치는 이 가이드에서 고정하지 않는다. 항상 루트 `README.md`와 `PROJECT_STATE.md`에서 현재 값을 확인한다.
