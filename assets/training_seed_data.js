/*
 * 교육용 가상 업무 앱 - 초기 시드 데이터
 * 아래 인물/부서/문서는 모두 교육 목적으로 새로 만든 가상 자료이며
 * 실제 존재하는 인물·회사·문서와 관련이 없습니다.
 *
 * 직원(12명)/휴가(6건)/급여(12건) 데이터는 data/가상_인사총무.json과 동일한 내용을
 * file:// 로 더블클릭해서 열어도 동작하도록 이 파일 안에 직접 옮겨 적은 것입니다.
 * (크롬 등 브라우저는 file:// 페이지에서 JSON 파일을 fetch로 불러오는 것을 막기 때문)
 * data/가상_인사총무.json을 수정하면 이 파일의 employees/leaveRequests/payroll도
 * 같은 내용으로 함께 갱신해 주세요.
 */

const TRAINING_COMPANY = {
  name: "(주)다온에프에스",
  nameEn: "DAON-FS",
};

function trainingSeedDefaults() {
  return {
    /* 시드 인물 목록에 없는 이름으로 로그인했을 때 쓰는 기본 프로필 */
    myProfileDefault: {
      dept: "경영지원팀",
      position: "주임",
      joinDate: "2023-03-02",
      annualLeaveTotal: 15,
      annualLeaveUsed: 0,
    },

    employees: [
      { empNo: "23001", name: "오세은", dept: "인사총무팀", position: "과장", joinDate: "2019-05-13", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23002", name: "민도현", dept: "인사총무팀", position: "주임", joinDate: "2022-01-10", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23003", name: "차은호", dept: "영업1팀", position: "대리", joinDate: "2021-07-19", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23004", name: "구지완", dept: "영업1팀", position: "사원", joinDate: "2024-02-05", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0.5 },
      { empNo: "23005", name: "백서아", dept: "물류운영팀", position: "차장", joinDate: "2016-09-01", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23006", name: "장하린", dept: "물류운영팀", position: "사원", joinDate: "2024-08-19", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23007", name: "노준영", dept: "경영지원팀", position: "부장", joinDate: "2012-03-16", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23008", name: "윤태경", dept: "영업1팀", position: "사원", joinDate: "2025-01-06", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23009", name: "강도윤", dept: "물류운영팀", position: "대리", joinDate: "2020-11-02", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 2 },
      { empNo: "23010", name: "임서진", dept: "경영지원팀", position: "사원", joinDate: "2024-05-20", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23011", name: "한지우", dept: "영업1팀", position: "과장", joinDate: "2018-04-15", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
      { empNo: "23012", name: "조은비", dept: "경영지원팀", position: "주임", joinDate: "2022-09-01", status: "재직중", annualLeaveTotal: 15, annualLeaveUsed: 0 },
    ],

    leaveRequests: [
      { id: "lv1", empNo: "23003", empName: "차은호", type: "연차", startDate: "2026-09-21", endDate: "2026-09-21", days: 1, reason: "개인 사유", status: "대기", requestedAt: "2026-09-10" },
      { id: "lv2", empNo: "23004", empName: "구지완", type: "반차(오전)", startDate: "2026-09-16", endDate: "2026-09-16", days: 0.5, reason: "병원 방문", status: "승인", requestedAt: "2026-09-05" },
      { id: "lv3", empNo: "23006", empName: "장하린", type: "연차", startDate: "2026-08-28", endDate: "2026-08-29", days: 2, reason: "여름 휴가", status: "반려", requestedAt: "2026-08-20" },
      { id: "lv4", empNo: "23002", empName: "민도현", type: "반차(오후)", startDate: "2026-09-25", endDate: "2026-09-25", days: 0.5, reason: "가족 행사", status: "대기", requestedAt: "2026-09-12" },
      { id: "lv5", empNo: "23009", empName: "강도윤", type: "연차", startDate: "2026-09-14", endDate: "2026-09-15", days: 2, reason: "개인 사유", status: "승인", requestedAt: "2026-09-01" },
      { id: "lv6", empNo: "23011", empName: "한지우", type: "연차", startDate: "2026-09-30", endDate: "2026-09-30", days: 1, reason: "리프레시 휴가", status: "반려", requestedAt: "2026-09-08" },
    ],

    payroll: [
      { id: "pay_2026_09_23001", empNo: "23001", empName: "오세은", payMonth: "2026-09", baseSalary: 3700000, allowance: 150000, deduction: 385000, netPay: 3465000 },
      { id: "pay_2026_09_23002", empNo: "23002", empName: "민도현", payMonth: "2026-09", baseSalary: 3000000, allowance: 120000, deduction: 312000, netPay: 2808000 },
      { id: "pay_2026_09_23003", empNo: "23003", empName: "차은호", payMonth: "2026-09", baseSalary: 3300000, allowance: 150000, deduction: 345000, netPay: 3105000 },
      { id: "pay_2026_09_23004", empNo: "23004", empName: "구지완", payMonth: "2026-09", baseSalary: 2700000, allowance: 100000, deduction: 280000, netPay: 2520000 },
      { id: "pay_2026_09_23005", empNo: "23005", empName: "백서아", payMonth: "2026-09", baseSalary: 4100000, allowance: 180000, deduction: 428000, netPay: 3852000 },
      { id: "pay_2026_09_23006", empNo: "23006", empName: "장하린", payMonth: "2026-09", baseSalary: 2700000, allowance: 100000, deduction: 280000, netPay: 2520000 },
      { id: "pay_2026_09_23007", empNo: "23007", empName: "노준영", payMonth: "2026-09", baseSalary: 4500000, allowance: 200000, deduction: 470000, netPay: 4230000 },
      { id: "pay_2026_09_23008", empNo: "23008", empName: "윤태경", payMonth: "2026-09", baseSalary: 2700000, allowance: 100000, deduction: 280000, netPay: 2520000 },
      { id: "pay_2026_09_23009", empNo: "23009", empName: "강도윤", payMonth: "2026-09", baseSalary: 3300000, allowance: 150000, deduction: 345000, netPay: 3105000 },
      { id: "pay_2026_09_23010", empNo: "23010", empName: "임서진", payMonth: "2026-09", baseSalary: 2700000, allowance: 100000, deduction: 280000, netPay: 2520000 },
      { id: "pay_2026_09_23011", empNo: "23011", empName: "한지우", payMonth: "2026-09", baseSalary: 3700000, allowance: 150000, deduction: 385000, netPay: 3465000 },
      { id: "pay_2026_09_23012", empNo: "23012", empName: "조은비", payMonth: "2026-09", baseSalary: 3000000, allowance: 120000, deduction: 312000, netPay: 2808000 },
    ],

    supplyRequests: [
      { id: "sp1", empNo: "23003", empName: "차은호", item: "A4 용지 (1박스)", qty: 1, reason: "부서 비품 소진", status: "대기", requestedAt: "2026-09-11" },
      { id: "sp2", empNo: "23006", empName: "장하린", item: "모니터 받침대", qty: 1, reason: "재택 후 사무실 복귀", status: "승인", requestedAt: "2026-09-03" },
      { id: "sp3", empNo: "23004", empName: "구지완", item: "볼펜 세트", qty: 2, reason: "소모품 보충", status: "승인", requestedAt: "2026-08-25" },
    ],
    roomBookings: [
      { id: "rm1", empName: "노준영", room: "3층 대회의실", date: "2026-09-17", timeSlot: "10:00-11:00", purpose: "주간 팀장 회의" },
      { id: "rm2", empName: "백서아", room: "2층 소회의실 A", date: "2026-09-18", timeSlot: "14:00-15:00", purpose: "물류 파트너사 미팅" },
      { id: "rm3", empName: "오세은", room: "2층 소회의실 B", date: "2026-09-19", timeSlot: "09:30-10:30", purpose: "신입사원 온보딩" },
    ],
    notices: [
      {
        id: "no1",
        title: "[총무] 9월 사내 소독 작업 안내",
        author: "총무팀 (가상)",
        date: "2026-09-08",
        content: "9월 20일(일) 오전 사옥 전 층 정기 소독을 진행합니다. 당일 사무실 이용에는 지장이 없습니다.",
      },
      {
        id: "no2",
        title: "[인사] 하반기 정기 건강검진 일정 공지",
        author: "인사팀 (가상)",
        date: "2026-09-05",
        content: "10월 중 부서별 순차 건강검진이 진행됩니다. 세부 일정은 추후 개별 안내 예정입니다.",
      },
      {
        id: "no3",
        title: "[총무] 회의실 예약 시스템 이용 안내",
        author: "총무팀 (가상)",
        date: "2026-08-30",
        content: "회의실 예약은 본 시스템의 '회의실 예약' 메뉴에서 신청할 수 있습니다. 중복 예약 시 총무팀에서 조율합니다.",
      },
    ],
  };
}

/* 시드 데이터 구조가 바뀌면 이 번호를 올려서, 예전 브라우저에 저장된 낡은 데이터를 새 구조로 다시 채운다 */
const TRAINING_SEED_VERSION = "3";

function trainingEnsureSeedData() {
  const savedVersion = localStorage.getItem(TRAINING_DATA_VERSION_KEY);
  if (!localStorage.getItem(TRAINING_DATA_KEY) || savedVersion !== TRAINING_SEED_VERSION) {
    localStorage.setItem(TRAINING_DATA_KEY, JSON.stringify(trainingSeedDefaults()));
    localStorage.setItem(TRAINING_DATA_VERSION_KEY, TRAINING_SEED_VERSION);
  }
}
