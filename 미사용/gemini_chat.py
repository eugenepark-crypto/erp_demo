"""
Gemini API 간단 호출 예제
출처: https://ai.google.dev/gemini-api/docs/get-started?hl=ko

설치:
    pip install -U google-genai python-dotenv

실행:
    python gemini_chat.py "질문 내용"
    (질문을 안 주면 기본 질문으로 실행됩니다)
"""

import sys

from dotenv import load_dotenv
from google import genai

sys.stdout.reconfigure(encoding="utf-8")  # Windows 콘솔에서 한글이 깨지는 것 방지

load_dotenv()  # .env 파일의 GEMINI_API_KEY를 환경변수로 읽어온다

client = genai.Client()  # 환경변수 GEMINI_API_KEY를 자동으로 사용


def ask_gemini(prompt: str) -> str:
    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
    )
    return interaction.output_text


if __name__ == "__main__":
    question = sys.argv[1] if len(sys.argv) > 1 else "안녕하세요! 자기소개를 한 문장으로 해줘."
    print(ask_gemini(question))
