from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import analyze_url
from virustotal import check_virustotal
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_with_gemini(url, rule_result):
    try:
        flags_text = "\n".join([f"- {f['check']}: {f['detail']}" for f in rule_result.get("flags", [])])
        vt = rule_result.get("virustotal", {})
        vt_text = f"{vt.get('malicious_engines',0)} malicious, {vt.get('suspicious_engines',0)} suspicious out of {vt.get('total_engines',0)} engines"

        prompt = f"""You are a cybersecurity expert specializing in phishing URL detection. Analyze this URL and provide your expert assessment.

URL: {url}

Rule-based analysis found:
- Risk Score: {rule_result.get('score', 0)}/100
- Initial Verdict: {rule_result.get('verdict', 'Unknown')}
- VirusTotal: {vt_text}
- Flags detected:
{flags_text if flags_text else "No flags detected"}

Based on your expert knowledge, provide:
1. Your overall verdict (Dangerous / Suspicious / Low Risk / Likely Safe)
2. A confidence level (0-100)
3. A clear 2-3 sentence explanation of WHY this URL is or isn't suspicious
4. Any additional threats the rule-based system may have missed
5. A recommended action for the user

Return ONLY a JSON object with exactly these keys, no other text:
{{
  "ai_verdict": "Dangerous",
  "confidence": 95,
  "explanation": "your explanation here",
  "additional_threats": "any extra threats or None detected",
  "recommendation": "your recommendation here",
  "final_score": 85
}}"""

        response = model.generate_content(prompt)
        response_text = response.text.strip()

        if "```" in response_text:
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]

        ai_data = json.loads(response_text.strip())
        return ai_data

    except Exception as e:
        print(f"Gemini API error: {e}")
        return None

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    if not url.startswith("http"):
        url = "https://" + url

    result = analyze_url(url)
    vt = check_virustotal(url)
    result["virustotal"] = vt

    if vt.get("malicious_engines", 0) > 3:
        result["score"] = min(result["score"] + 40, 100)
        result["flags"].append({
            "check": "VirusTotal flagged",
            "risk": "high",
            "detail": f"{vt['malicious_engines']} of {vt['total_engines']} AV engines flagged this URL"
        })
        result["verdict"] = "Dangerous"

    ai_analysis = analyze_with_gemini(url, result)

    if ai_analysis:
        result["ai_analysis"] = ai_analysis
        result["score"] = ai_analysis.get("final_score", result["score"])
        result["verdict"] = ai_analysis.get("ai_verdict", result["verdict"])

    return jsonify(result)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "AI Phishing Detector running", "ai": "Gemini-powered"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(debug=False, host="0.0.0.0", port=port)