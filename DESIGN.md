# DESIGN.md — 화면 디자인 기준

> 이 문서는 앱의 색·글꼴·여백·버튼 기준을 정리한 디자인 가이드입니다. PRD.md의 기능·데이터 규칙과는 별개이며, 이 문서를 고치더라도 PRD.md의 내용은 바뀌지 않습니다.

## 참고 출처

방향성 참고: [Design System Analysis: Cal.com — getdesign.md](https://getdesign.md/cal/design-md)

> ⚠ 위 페이지는 색상 코드·폰트명·여백 수치 같은 구체적인 값을 제공하지 않습니다. "Clean neutral UI, developer-oriented simplicity", "Monochrome designs" 같은 **방향성 설명만** 담고 있습니다. 그래서 아래 구체적인 수치들은 이 페이지에서 그대로 가져온 것이 아니라, 우리 앱(`assets/training_style.css`)에 이미 적용되어 있던 값을 그 방향성(뉴트럴하고 차분한 톤, 군더더기 없는 구성)에 맞춰 정리한 것입니다.

---

## 1. 색상 (Color)

| 용도 | 변수명 | 값 | 비고 |
|---|---|---|---|
| 기본 강조색 | `--color-primary` | `#2f5fb3` | 버튼, 링크, 사이드바 활성 메뉴 |
| 강조색(진하게, hover) | `--color-primary-dark` | `#1f4488` | 버튼 hover, 사이드바 배경 |
| 배경 | `--color-bg` | `#f4f6f9` | 전체 페이지 배경 |
| 카드 배경 | `--color-card` | `#ffffff` | 카드, 로그인 박스 |
| 테두리 | `--color-border` | `#dfe4ea` | 카드 테두리, 표 구분선 |
| 기본 글자색 | `--color-text` | `#232a33` | 본문 텍스트 |
| 보조 글자색 | `--color-text-muted` | `#6b7684` | 설명문, 캡션 |
| 위험/반려 | `--color-danger` / `--color-rejected` | `#d0392b` | 반려 배지, 위험 버튼 |
| 승인/정상 | `--color-ok` | `#2a9d5c` | 승인 배지 |
| 대기 | `--color-pending` | `#b98900` | 대기 배지 |
| 경고 배너 배경 | `--color-warn-bg` / `--color-warn-border` | `#fff4e5` / `#f0b429` | 상단 "교육용 가상 자료" 배너 |

**규칙**: 색은 위 표의 변수만 사용한다. 화면마다 임의의 새 색을 추가하지 않는다 (뉴트럴하고 일관된 톤 유지 — Cal.com 분석의 "monochrome" 방향과 동일한 취지).

---

## 2. 글꼴 (Typography)

- **글꼴 패밀리**: `"Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif`
- **기본 글자 크기**: 13px (표, 본문), 14px (사이드바 메뉴)
- **제목 크기**: 페이지 제목(`.page-title`) 21px / 카드 제목(`h2`) 15px / 로그인 제목(`h1`) 19px
- **작은 텍스트**: 배너 13px, 설명문(`.page-desc`) 13px, 푸터/캡션 11~12px
- **글자 굵기**: 제목과 표 헤더는 600~700(semi-bold~bold), 본문은 기본(400)

---

## 3. 여백 (Spacing)

| 요소 | 값 |
|---|---|
| 본문 영역 패딩 (`.main`) | 26px 32px 50px |
| 카드 내부 패딩 (`.card`) | 20px 22px |
| 카드 사이 간격 | 20px (margin-bottom) |
| 폼 항목 사이 간격 (`label`) | 위쪽 12px, 아래쪽 5px |
| 2단 그리드 간격 (`.grid-2`) | 18px |
| 폼 2단 간격 (`.form-row`) | 16px |
| 표 셀 패딩 | 9px 10px |
| 사이드바 너비 | 230px |
| 모서리 둥글기 (`--radius`) | 카드 8px / 버튼 6px / 배지 999px(완전 둥글게) |

**규칙**: 새 화면을 추가할 때도 카드 패딩 `20px 22px`, 카드 간격 `20px`를 기본값으로 쓴다. 임의로 다른 여백 수치를 쓰지 않는다.

---

## 4. 버튼 (Button)

| 종류 | 클래스 | 배경 | 텍스트 | 용도 |
|---|---|---|---|---|
| 기본(채움) | `.btn` | `--color-primary` (hover 시 `--color-primary-dark`) | 흰색 | 주요 동작 (신청하기, 예약하기, 로그인) |
| 외곽선 | `.btn-outline` | 흰색 | `--color-primary` (테두리도 동일) | 보조 동작 (바로가기, 더 보기) |
| 위험 | `.btn-danger` | `--color-danger` | 흰색 | 반려 등 되돌리기 어려운 처리 |
| 작게 | `.btn-small` (다른 클래스와 함께 사용) | - | - | 표 안 처리 버튼, 카드 안 보조 버튼 |

- 공통 스타일: 테두리 없음, 모서리 둥글기 6px, 굵은 글자(600), 패딩 `9px 16px` (작은 버튼은 `5px 11px`)
- 여러 버튼을 나란히 둘 때는 `.btn-row`(가로 flex, 간격 8px)로 감싼다.

---

## 5. 상태 배지 (Status Badge)

| 상태 | 클래스 | 색 |
|---|---|---|
| 대기 | `.badge-pending` | 배경 `#fff2cf`, 글자 `--color-pending` |
| 승인 | `.badge-approved` | 배경 `#dcf5e6`, 글자 `--color-ok` |
| 반려 | `.badge-rejected` | 배경 `#fbdedb`, 글자 `--color-rejected` |

완전히 둥근 모서리(`border-radius: 999px`), 작은 글자(12px, 굵게)로 표 안에서 상태를 한눈에 구분한다.

---

## 6. 공통 레이아웃 구조

```
[상단 고정 배너] ⚠ 교육용 가상 자료 (모든 화면 공통, 스크롤해도 고정)
┌───────────┬─────────────────────────────┐
│  사이드바   │  본문 (카드 단위로 구성)         │
│  230px    │  - 카드마다 h2 제목 + 표/폼      │
│  (남색)    │  - 카드 사이 20px 간격          │
│           │  - 맨 아래 안내 푸터            │
└───────────┴─────────────────────────────┘
```

새 화면을 추가할 때도 이 구조(고정 배너 → 사이드바+본문 → 카드 단위 콘텐츠 → 안내 푸터)를 그대로 따른다. 실제 구현은 `assets/training_style.css`, `assets/training_app.js`의 `trainingRenderShellStart()`를 참고.
