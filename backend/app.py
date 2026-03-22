from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import analyze_url
from virustotal import check_virustotal
from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_with_groq(url, rule_result):
    try:
        flags_text = "\n".join([f"- {f['check']}: {f['detail']}" for f in rule_result.get("flags", [])])
        vt = rule_result.get("virustotal", {})
        vt_text = str(vt.get("malicious_engines", 0)) + " malicious, " + str(vt.get("suspicious_engines", 0)) + " suspicious out of " + str(vt.get("total_engines", 0)) + " engines"

        prompt = "You are a cybersecurity expert specializing in phishing URL detection.\n\n"
        prompt += "URL: " + url + "\n\n"
        prompt += "Rule-based analysis found:\n"
        prompt += "- Risk Score: " + str(rule_result.get("score", 0)) + "/100\n"
        prompt += "- Initial Verdict: " + str(rule_result.get("verdict", "Unknown")) + "\n"
        prompt += "- VirusTotal: " + vt_text + "\n"
        prompt += "- Flags detected:\n"
        prompt += flags_text if flags_text else "No flags detected"
        prompt += "\n\nReturn ONLY a JSON object with exactly these keys, no other text:\n"
        prompt += '{"ai_verdict": "Dangerous", "confidence": 95, "explanation": "your explanation here", "additional_threats": "any extra threats or None detected", "recommendation": "your recommendation here", "final_score": 85}'

        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = response.choices[0].message.content.strip()

        if "```" in response_text:
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]

        ai_data = json.loads(response_text.strip())
        return ai_data

    except Exception as e:
        print("Groq API error: " + str(e))
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
            "detail": str(vt["malicious_engines"]) + " of " + str(vt["total_engines"]) + " AV engines flagged this URL"
        })
        result["verdict"] = "Dangerous"

    ai_analysis = analyze_with_groq(url, result)

    if ai_analysis:
        result["ai_analysis"] = ai_analysis
        result["score"] = ai_analysis.get("final_score", result["score"])
        result["verdict"] = ai_analysis.get("ai_verdict", result["verdict"])

    return jsonify(result)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "AI Phishing Detector running", "ai": "Groq-powered"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(debug=False, host="0.0.0.0", port=port)
