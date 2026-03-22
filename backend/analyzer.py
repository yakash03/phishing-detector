import re
import urllib.parse
import whois
from datetime import datetime

SUSPICIOUS_KEYWORDS = ["login", "verify", "secure", "account", "update",
                       "banking", "confirm", "paypal", "ebay", "amazon"]

LOOKALIKE = {"paypa1": "paypal", "arnazon": "amazon", "g00gle": "google",
             "faceb00k": "facebook", "micros0ft": "microsoft"}

def analyze_url(url):
    flags = []
    score = 0

    if not url.startswith("https://"):
        flags.append({"check": "No HTTPS", "risk": "high",
                      "detail": "Site does not use HTTPS encryption"})
        score += 30

    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc.lower().replace("www.", "")

    if re.match(r"\d+\.\d+\.\d+\.\d+", domain):
        flags.append({"check": "IP as domain", "risk": "high",
                      "detail": "URL uses raw IP instead of a domain name"})
        score += 35

    if len(url) > 75:
        flags.append({"check": "Very long URL", "risk": "medium",
                      "detail": f"URL length {len(url)} chars — phishing URLs are often very long"})
        score += 15

    if "@" in parsed.netloc or re.findall(r"[@%\-]{2,}", url):
        flags.append({"check": "Suspicious characters", "risk": "high",
                      "detail": "Special characters like @ or -- detected in URL"})
        score += 25

    for word in SUSPICIOUS_KEYWORDS:
        if word in url.lower():
            flags.append({"check": f"Suspicious keyword: '{word}'", "risk": "medium",
                          "detail": f"Phishing pages often use '{word}' to seem legitimate"})
            score += 15
            break

    for fake, real in LOOKALIKE.items():
        if fake in domain:
            flags.append({"check": "Lookalike domain", "risk": "high",
                          "detail": f"Domain looks like '{real}' but is different"})
            score += 40

    if len(domain.split(".")) > 4:
        flags.append({"check": "Too many subdomains", "risk": "medium",
                      "detail": "Excessive subdomains are a common phishing trick"})
        score += 20

    try:
        w = whois.whois(domain)
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        if creation:
            age_days = (datetime.now() - creation).days
            if age_days < 180:
                flags.append({"check": "New domain", "risk": "high",
                              "detail": f"Domain is only {age_days} days old"})
                score += 30
    except:
        flags.append({"check": "WHOIS failed", "risk": "medium",
                      "detail": "Could not verify domain registration"})
        score += 10

    score = min(score, 100)
    if score >= 70:
        verdict = "Dangerous"
    elif score >= 40:
        verdict = "Suspicious"
    else:
        verdict = "Likely Safe"

    return {"score": score, "verdict": verdict, "flags": flags, "url": url}