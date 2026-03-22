import requests
import base64
import os
from dotenv import load_dotenv
load_dotenv()

VT_KEY = os.getenv("VT_API_KEY")

def check_virustotal(url):
    try:
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
        headers = {"x-apikey": VT_KEY}
        r = requests.get(
            f"https://www.virustotal.com/api/v3/urls/{url_id}",
            headers=headers, timeout=10
        )
        if r.status_code == 200:
            stats = r.json()["data"]["attributes"]["last_analysis_stats"]
            malicious = stats.get("malicious", 0)
            suspicious = stats.get("suspicious", 0)
            total = sum(stats.values())
            return {
                "malicious_engines": malicious,
                "suspicious_engines": suspicious,
                "total_engines": total,
                "vt_score": round((malicious / total) * 100) if total else 0
            }
    except:
        pass
    return {"malicious_engines": 0, "suspicious_engines": 0,
            "total_engines": 0, "vt_score": 0}