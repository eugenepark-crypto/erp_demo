"""
DART 기업정보 조회 웹 서버
company.html을 서빙하고, /api/company 요청을 받아 DART API를 대신 호출한다.
API 키(DART_API_KEY)는 이 서버 안에만 존재하고 브라우저로는 절대 전달하지 않는다.

설치:
    pip install -U flask requests python-dotenv

실행:
    python dart_server.py
    -> 브라우저에서 http://localhost:5000 접속
"""

import os

from flask import Flask, jsonify, request, send_from_directory

from dart_search import (
    PBLNTF_TY_LABEL,
    find_corp_code,
    get_company_profile,
    parse_rm,
    search_disclosures,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "company.html")


@app.route("/api/meta")
def api_meta():
    """화면의 공시유형 필터 목록을 채우기 위한 메타 정보 (공시검색.md 기준)"""
    return jsonify({"pblntf_ty": PBLNTF_TY_LABEL})


@app.route("/api/company")
def api_company():
    name = request.args.get("name", "").strip()
    pblntf_ty = request.args.get("type") or None
    try:
        days = int(request.args.get("days", 90))
    except ValueError:
        days = 90

    if not name:
        return jsonify({"error": "회사명을 입력해주세요."}), 400

    corp_code, matched_name = find_corp_code(name)
    if not corp_code:
        return jsonify({"error": f"'{name}'과 일치하는 회사를 찾지 못했습니다."}), 404

    profile = get_company_profile(corp_code)
    disclosures_result = search_disclosures(corp_code, days, pblntf_ty)

    status = disclosures_result.get("status")
    if status == "000":
        disclosures = disclosures_result.get("list", [])
    elif status == "013":  # 조회된 데이터 없음
        disclosures = []
    else:
        return jsonify({"error": f"공시 조회 실패 ({status}): {disclosures_result.get('message')}"}), 502

    # 비고(rm) 코드를 사람이 읽을 수 있는 설명으로 함께 붙여준다
    for d in disclosures:
        d["rm_labels"] = [label for _, label in parse_rm(d.get("rm", ""))]

    return jsonify({
        "matched_name": matched_name,
        "profile": profile if profile.get("status") == "000" else None,
        "days": days,
        "disclosures": disclosures,
    })


if __name__ == "__main__":
    print("http://localhost:5000 에서 실행됩니다. 종료하려면 Ctrl+C")
    app.run(port=5000, debug=False)
