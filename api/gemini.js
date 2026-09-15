/*
 * Vercel 서버리스 함수 - Gemini API 연동 테스트용
 * GEMINI_API_KEY는 Vercel 프로젝트의 환경변수로만 존재하며 브라우저로는 절대 전달하지 않는다.
 */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST 요청만 지원합니다." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "서버에 GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다. Vercel 프로젝트 설정에서 추가해주세요." });
    return;
  }

  const prompt = req.body && typeof req.body.prompt === "string" ? req.body.prompt.slice(0, 500) : "";
  if (!prompt) {
    res.status(400).json({ error: "prompt가 비어 있습니다." });
    return;
  }

  try {
    const model = "gemini-3.6-flash";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: (data.error && data.error.message) || "Gemini API 호출 실패" });
      return;
    }

    const text =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    res.status(200).json({ text: text || "(응답 텍스트를 찾을 수 없습니다)" });
  } catch (err) {
    res.status(500).json({ error: "Gemini API 호출 중 오류: " + err.message });
  }
};
