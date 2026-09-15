/*
 * 교육용 가상 업무 앱 - 공통 로직
 * 세션 관리, localStorage 유틸, 공통 화면(배너/메뉴) 렌더링
 */

const TRAINING_SESSION_KEY = "training_erp_session";
const TRAINING_DATA_KEY = "training_erp_data";
const TRAINING_DATA_VERSION_KEY = "training_erp_data_version";

const TRAINING_ROLE_LABEL = {
  employee: "일반직원",
  hr: "인사담당자",
  ga: "총무담당자",
};

/* ---------- 세션 ---------- */
function trainingGetSession() {
  const raw = sessionStorage.getItem(TRAINING_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function trainingSetSession(session) {
  sessionStorage.setItem(TRAINING_SESSION_KEY, JSON.stringify(session));
}

function trainingLogout() {
  sessionStorage.removeItem(TRAINING_SESSION_KEY);
  window.location.href = "training_index.html";
}

/* 로그인 필요 페이지 상단에서 호출: 세션 없으면 로그인 화면으로 */
function trainingRequireLogin() {
  const session = trainingGetSession();
  if (!session) {
    window.location.href = "training_index.html";
    return null;
  }
  return session;
}

/* 특정 역할 전용 페이지에서 호출: 권한 없으면 대시보드로 돌려보냄 */
function trainingRequireRole(session, allowedRoles) {
  if (!allowedRoles.includes(session.role)) {
    alert("이 화면은 " + allowedRoles.map(r => TRAINING_ROLE_LABEL[r]).join("/") + " 역할만 볼 수 있는 교육용 화면입니다. 대시보드로 이동합니다.");
    window.location.href = "training_dashboard.html";
  }
}

/* ---------- 데이터 ---------- */
function trainingLoadData() {
  trainingEnsureSeedData();
  return JSON.parse(localStorage.getItem(TRAINING_DATA_KEY));
}

function trainingSaveData(data) {
  localStorage.setItem(TRAINING_DATA_KEY, JSON.stringify(data));
}

/* 지금까지 쌓인 신청/승인 내역을 전부 지우고, 처음 가상 데이터로 되돌린다. (다음 교육 참가자를 위한 초기화) */
function trainingResetAllData() {
  localStorage.removeItem(TRAINING_DATA_KEY);
  localStorage.removeItem(TRAINING_DATA_VERSION_KEY);
  trainingEnsureSeedData();
}

function trainingNewId(prefix) {
  return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

function trainingToday() {
  return new Date().toISOString().slice(0, 10);
}

/* 로그인한 사람의 사번(empNo)으로 가상 사원 명단에서 본인 레코드를 찾는다. 연결 키는 이름이 아니라 사번이다. */
function trainingFindMyEmployee(data, session) {
  return data.employees.find(e => e.empNo === session.empNo) || null;
}

/* ---------- 공통 레이아웃 렌더링 ---------- */
const TRAINING_MENUS = [
  { group: "공통", items: [
    { href: "training_dashboard.html", label: "대시보드", roles: ["employee", "hr", "ga"] },
  ]},
  { group: "인사(HR)", items: [
    { href: "training_hr_myinfo.html", label: "내 정보 조회", roles: ["employee", "hr", "ga"] },
    { href: "training_hr_leave.html", label: "휴가 신청/조회", roles: ["employee", "hr", "ga"] },
    { href: "training_hr_leave_approve.html", label: "휴가 승인 처리", roles: ["hr"] },
    { href: "training_hr_employees.html", label: "사원 목록", roles: ["hr"] },
  ]},
  { group: "총무(GA)", items: [
    { href: "training_ga_supply.html", label: "비품 신청/조회", roles: ["employee", "hr", "ga"] },
    { href: "training_ga_supply_approve.html", label: "비품 승인 처리", roles: ["ga"] },
    { href: "training_ga_room.html", label: "회의실 예약", roles: ["employee", "hr", "ga"] },
    { href: "training_ga_notice.html", label: "사내 공지", roles: ["employee", "hr", "ga"] },
  ]},
  { group: "개발용", items: [
    { href: "gemini_test.html", label: "Gemini 연동 테스트", roles: ["employee", "hr", "ga"] },
  ]},
];

function trainingRenderBanner() {
  return '<div class="demo-banner">⚠ 교육용 가상 자료 - 실제 인사·총무 정보 아님 (모든 인물·문서는 창작된 예시입니다)</div>';
}

function trainingRenderShellStart(session, currentPage) {
  const banner = trainingRenderBanner();
  let nav = "";
  TRAINING_MENUS.forEach(group => {
    const visibleItems = group.items.filter(item => item.roles.includes(session.role));
    if (visibleItems.length === 0) return;
    nav += '<div class="menu-group-title">' + group.group + '</div>';
    visibleItems.forEach(item => {
      const activeClass = item.href === currentPage ? " active" : "";
      nav += '<a class="' + (activeClass ? "active" : "") + '" href="' + item.href + '">' + item.label + '</a>';
    });
  });

  const html =
    banner +
    '<div class="app-shell">' +
      '<aside class="sidebar">' +
        '<div class="brand"><strong>' + TRAINING_COMPANY.name + '</strong><span>' + TRAINING_COMPANY.nameEn + ' · 교육용 가상 사내 시스템</span></div>' +
        '<div class="user-box">' + session.name + ' (' + session.empNo + ')<br>' + TRAINING_ROLE_LABEL[session.role] + '</div>' +
        '<nav>' + nav + '</nav>' +
        '<div class="logout"><a class="logout-link" href="#" onclick="trainingLogout(); return false;">로그아웃</a></div>' +
      '</aside>' +
      '<main class="main" id="training-main"></main>' +
    '</div>';

  document.body.insertAdjacentHTML("afterbegin", html);
}

/* 페이지 고유 내용을 좌측 메뉴 옆 본문 영역에 삽입 */
function trainingRenderPageContent(html) {
  document.getElementById("training-main").insertAdjacentHTML("beforeend", html);
}

/* 페이지 본문 맨 끝에 공통 푸터를 추가 (각 페이지 스크립트 마지막에 호출) */
function trainingRenderShellEnd() {
  trainingRenderPageContent(
    '<footer class="app-footer">본 화면의 모든 인물·부서·문서는 교육 목적으로 만든 가상 자료이며 실제 사실과 무관합니다. · ' + TRAINING_COMPANY.name + ' (가상)</footer>'
  );
}

/*
 * 페이지 초기화 헬퍼: 로그인 확인 + 좌측 메뉴/배너 삽입까지 처리.
 * 사용법: 각 페이지는 trainingInitPage()로 시작해서 세션을 받고,
 * trainingRenderPageContent()로 본문을 채운 뒤, 마지막에 trainingRenderShellEnd()를 호출한다.
 */
function trainingInitPage(currentPage, allowedRoles) {
  const session = trainingRequireLogin();
  if (!session) return null;
  if (allowedRoles) trainingRequireRole(session, allowedRoles);
  trainingRenderShellStart(session, currentPage);
  return session;
}
