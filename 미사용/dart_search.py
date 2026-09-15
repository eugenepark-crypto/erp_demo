"""
DART(전자공시시스템) 공시 조회 프로그램
참고: https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS001 (공시정보 API 그룹)
  - 고유번호        corpCode.xml   (apiId=2019018) — 회사명 -> corp_code 매핑용, 최초 1회 캐시
  - 공시검색        list.json      (apiId=2019001) — 회사의 최근 공시 목록
  - 기업개황        company.json   (apiId=2019002) — 대표자/주소/설립일 등 회사 기본 정보
  - 공시서류원본파일 document.xml   (apiId=2019003) — 접수번호로 원본 zip 파일 다운로드

설치:
    pip install -U requests python-dotenv

실행:
    python dart_search.py 삼성전자                    # 기업개황 + 최근 90일 공시
    python dart_search.py 삼성전자 --days 180          # 최근 180일 공시
    python dart_search.py --download 20260908800624   # 해당 접수번호의 공시 원본파일(zip) 다운로드
"""

import argparse
import io
import os
import sys
import xml.etree.ElementTree as ET
import zipfile
from datetime import datetime, timedelta

import requests
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8")  # Windows 콘솔에서 한글 깨짐 방지
load_dotenv()

API_KEY = os.getenv("DART_API_KEY")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(BASE_DIR, "dart_cache")
CORP_CODE_CACHE = os.path.join(CACHE_DIR, "corp_code.xml")
DOWNLOAD_DIR = os.path.join(BASE_DIR, "dart_downloads")

CORP_CLS_LABEL = {"Y": "유가증권", "K": "코스닥", "N": "코넥스", "E": "기타(비상장 등)"}


def ensure_corp_code_file():
    """[고유번호 API] 회사명 -> corp_code 매핑용 XML을 최초 1회 내려받아 캐시한다."""
    if os.path.exists(CORP_CODE_CACHE):
        return
    os.makedirs(CACHE_DIR, exist_ok=True)
    resp = requests.get(
        "https://opendart.fss.or.kr/api/corpCode.xml",
        params={"crtfc_key": API_KEY},
        timeout=30,
    )
    resp.raise_for_status()
    with zipfile.ZipFile(io.BytesIO(resp.content)) as zf:
        xml_bytes = zf.read(zf.namelist()[0])
    with open(CORP_CODE_CACHE, "wb") as f:
        f.write(xml_bytes)


# DART 공식 등록명이 흔히 부르는 이름과 다른 경우를 위한 별칭 (예: 네이버 -> NAVER)
CORP_NAME_ALIASES = {
    "네이버": "NAVER",
}


def find_corp_code(company_name: str):
    """
    회사명으로 corp_code를 찾는다.
    1) 별칭(CORP_NAME_ALIASES)이 있으면 그 이름으로 바꿔서 찾는다.
    2) 대소문자 구분 없이 정확히 일치하는 회사명을 우선 찾는다.
    3) 정확히 일치하는 게 없으면, 이름에 포함된 회사들 중 상장사(종목코드가 있는 회사)를 우선으로 고른다.
       (비상장 투자조합·펀드 등은 이름에 우연히 포함되어도 실제 찾는 회사가 아닌 경우가 많기 때문)
    """
    ensure_corp_code_file()
    search_name = CORP_NAME_ALIASES.get(company_name, company_name)

    tree = ET.parse(CORP_CODE_CACHE)
    listed_partial = None
    any_partial = None
    for item in tree.getroot().findall("list"):
        name = (item.findtext("corp_name") or "").strip()
        if name.upper() == search_name.upper():
            return item.findtext("corp_code"), name
        if search_name.upper() in name.upper():
            stock_code = (item.findtext("stock_code") or "").strip()
            if stock_code and listed_partial is None:
                listed_partial = (item.findtext("corp_code"), name)
            if any_partial is None:
                any_partial = (item.findtext("corp_code"), name)

    if listed_partial:
        return listed_partial
    return any_partial if any_partial else (None, None)


def get_company_profile(corp_code: str) -> dict:
    """[기업개황 API]"""
    resp = requests.get(
        "https://opendart.fss.or.kr/api/company.json",
        params={"crtfc_key": API_KEY, "corp_code": corp_code},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def print_company_profile(profile: dict):
    corp_cls = CORP_CLS_LABEL.get(profile.get("corp_cls"), profile.get("corp_cls"))
    print("=" * 50)
    print(f"{profile.get('corp_name')} ({profile.get('stock_name')}, {profile.get('stock_code') or '비상장'})")
    print(f"  구분     : {corp_cls}")
    print(f"  대표자   : {profile.get('ceo_nm')}")
    print(f"  설립일   : {profile.get('est_dt')}")
    print(f"  주소     : {profile.get('adres')}")
    print(f"  홈페이지 : {profile.get('hm_url') or '-'}")
    print("=" * 50)
    print()


# 공시유형(pblntf_ty) — 공시검색.md 문서 기준
PBLNTF_TY_LABEL = {
    "A": "정기공시",
    "B": "주요사항보고",
    "C": "발행공시",
    "D": "지분공시",
    "E": "기타공시",
    "F": "외부감사관련",
    "G": "펀드공시",
    "H": "자산유동화",
    "I": "거래소공시",
    "J": "공정위공시",
}

# 비고(rm) 코드 — 공시검색.md 문서 기준. 여러 글자가 조합되어 올 수 있다 (예: "코연" = 코스닥 + 연결)
RM_LABEL = {
    "유": "유가증권시장 소관",
    "코": "코스닥시장 소관",
    "채": "채권상장법인 공시",
    "넥": "코넥스시장 소관",
    "공": "공정거래위원회 소관",
    "연": "연결부분 포함",
    "정": "정정신고 있음",
    "철": "철회(간주)됨",
}


def parse_rm(rm: str) -> list:
    """비고 문자열을 한 글자씩 나눠 (코드, 설명) 리스트로 돌려준다."""
    if not rm:
        return []
    return [(ch, RM_LABEL[ch]) for ch in rm if ch in RM_LABEL]


def search_disclosures(corp_code: str, days: int, pblntf_ty: str = None) -> dict:
    """[공시검색 API] pblntf_ty를 지정하면 해당 공시유형만 검색한다 (A~J, 공시검색.md 참고)."""
    end_de = datetime.today().strftime("%Y%m%d")
    bgn_de = (datetime.today() - timedelta(days=days)).strftime("%Y%m%d")
    params = {
        "crtfc_key": API_KEY,
        "corp_code": corp_code,
        "bgn_de": bgn_de,
        "end_de": end_de,
        "page_count": 100,
    }
    if pblntf_ty:
        params["pblntf_ty"] = pblntf_ty
    resp = requests.get("https://opendart.fss.or.kr/api/list.json", params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def print_disclosures(matched_name: str, days: int, result: dict):
    status = result.get("status")
    if status == "013":  # 조회된 데이터 없음
        print(f"최근 {days}일 동안 '{matched_name}'의 공시가 없습니다.")
        return
    if status != "000":
        print(f"조회 실패 ({status}): {result.get('message')}")
        return

    disclosures = result.get("list", [])
    print(f"'{matched_name}' 최근 {days}일 공시 {len(disclosures)}건\n")
    for d in disclosures:
        url = f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={d['rcept_no']}"
        rm_labels = ", ".join(label for _, label in parse_rm(d.get("rm", "")))
        rm_suffix = f"  [{rm_labels}]" if rm_labels else ""
        print(f"[{d['rcept_dt']}] {d['report_nm']}  ({d['flr_nm']})  접수번호:{d['rcept_no']}{rm_suffix}")
        print(f"  {url}")


def download_document(rcept_no: str):
    """[공시서류원본파일 API] 접수번호로 원본 zip 파일을 내려받는다."""
    resp = requests.get(
        "https://opendart.fss.or.kr/api/document.xml",
        params={"crtfc_key": API_KEY, "rcept_no": rcept_no},
        timeout=30,
    )
    resp.raise_for_status()

    if not resp.content.startswith(b"PK"):  # zip 파일이 아니면 에러 응답(xml/json)
        print("다운로드 실패:", resp.text[:300])
        return

    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    save_path = os.path.join(DOWNLOAD_DIR, f"{rcept_no}.zip")
    with open(save_path, "wb") as f:
        f.write(resp.content)
    print(f"원본 공시서류를 저장했습니다: {save_path}")


def main():
    parser = argparse.ArgumentParser(description="DART 공시정보 조회 (공시검색 · 기업개황 · 원본파일)")
    parser.add_argument("company", nargs="?", help="검색할 회사명")
    parser.add_argument("--days", type=int, default=90, help="공시 검색 기간(일), 기본 90일")
    parser.add_argument(
        "--type",
        dest="pblntf_ty",
        choices=list(PBLNTF_TY_LABEL.keys()),
        help="공시유형 필터: " + ", ".join(f"{k}={v}" for k, v in PBLNTF_TY_LABEL.items()),
    )
    parser.add_argument("--download", metavar="접수번호", help="해당 접수번호의 공시 원본파일(zip) 다운로드")
    args = parser.parse_args()

    if not API_KEY:
        print("DART_API_KEY가 .env에 없습니다. .env 파일을 확인해주세요.")
        sys.exit(1)

    if args.download:
        download_document(args.download)
        return

    if not args.company:
        parser.print_help()
        sys.exit(1)

    corp_code, matched_name = find_corp_code(args.company)
    if not corp_code:
        print(f"'{args.company}'과 일치하는 회사를 찾지 못했습니다.")
        sys.exit(1)
    if matched_name != args.company:
        print(f"(참고: 정확히 일치하는 회사가 없어 '{matched_name}'로 검색합니다)\n")

    profile = get_company_profile(corp_code)
    if profile.get("status") == "000":
        print_company_profile(profile)

    result = search_disclosures(corp_code, args.days, args.pblntf_ty)
    print_disclosures(matched_name, args.days, result)


if __name__ == "__main__":
    main()
