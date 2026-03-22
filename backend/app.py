from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import analyze_url
from virustotal import check_virustotal

app = Flask(__name__)
CORS(app)

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
    if vt["malicious_engines"] > 3:
        result["score"] = min(result["score"] + 40, 100)
        result["flags"].append({
            "check": "VirusTotal flagged",
            "risk": "high",
            "detail": f"{vt['malicious_engines']} of {vt['total_engines']} AV engines flagged this URL"
        })
        result["verdict"] = "Dangerous"
    result["virustotal"] = vt
    return jsonify(result)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)