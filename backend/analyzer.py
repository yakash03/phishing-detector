import re
import urllib.parse
import whois
from datetime import datetime

SUSPICIOUS_KEYWORDS = ["login", "verify", "secure", "account", "update",
                       "banking", "confirm", "paypal", "ebay", "amazon",
                       "password", "credential", "signin", "wallet", "alert"]

LOOKALIKE = {
    "paypa1": "paypal", "arnazon": "amazon", "g00gle": "google",
    "faceb00k": "facebook", "micros0ft": "microsoft", "app1e": "apple",
    "netfl1x": "netflix", "inst4gram": "instagram", "twitt3r": "twitter",
    "y0utube": "youtube", "linkedln": "linkedin", "paypai": "paypal"
}

TRUSTED_DOMAINS = [
    "google.com", "youtube.com", "facebook.com", "amazon.com", "twitter.com",
    "instagram.com", "linkedin.com", "microsoft.com", "apple.com", "github.com",
    "stackoverflow.com", "wikipedia.org", "reddit.com", "netflix.com",
    "yahoo.com", "bing.com", "whatsapp.com", "zoom.us", "dropbox.com"
]

SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top",
                   ".buzz", ".club", ".work", ".click", ".link", ".info"]

def analyze_url(url):
    flags = []
    score = 0

    if not url.startswith("https://"):
        flags.append({"check": "No HTTPS", "risk": "high",
                      "detail": "Site does not use HTTPS encryption"})
        score += 30

    parsed = urllib.parse.urlparse(url)
    domain_raw = parsed.netloc.replace("www.", "")
    domain = domain_raw.lower()

    # ── Mixed case / homograph detection ──
    if domain_raw != domain_raw.lower() and domain_raw != domain_raw.upper():
        flags.append({"check": "Mixed case domain", "risk": "high",
                      "detail": f"Domain '{domain_raw}' uses unusual mixed uppercase letters — classic spoofing trick"})
        score += 45

    # ── Check if domain LOOKS like a trusted domain but is NOT ──
    for trusted in TRUSTED_DOMAINS:
        trusted_name = trusted.split(".")[0]
        domain_name = domain.split(".")[0]
        if domain_name == trusted_name and domain != trusted:
            flags.append({"check": f"Impersonating {trusted}", "risk": "high",
                          "detail": f"Domain pretends to be {trusted} but is different"})
            score += 50
            break
        if trusted_name in domain_name and domain != trusted and len(domain_name) > len(trusted_name):
            flags.append({"check": f"Lookalike of {trusted}", "risk": "high",
                          "detail": f"Domain closely resembles {trusted} — possible spoof"})
            score += 35
            break

    # ── IP address as domain ──
    if re.match(r"\d+\.\d+\.\d+\.\d+", domain):
        flags.append({"check": "IP address used as domain", "risk": "high",
                      "detail": "URL uses raw IP instead of a domain name"})
        score += 35

    # ── URL length ──
    if len(url) > 75:
        flags.append({"check": "Very long URL", "risk": "medium",
                      "detail": f"URL is {len(url)} characters — phishing URLs are often very long"})
        score += 15

    # ── Special characters ──
    if "@" in parsed.netloc or re.findall(r"[@%\-]{2,}", url):
        flags.append({"check": "Suspicious characters", "risk": "high",
                      "detail": "Special characters like @ or -- detected in URL"})
        score += 25

    # ── Suspicious keywords ──
    for word in SUSPICIOUS_KEYWORDS:
        if word in url.lower():
            flags.append({"check": f"Suspicious keyword: '{word}'", "risk": "medium",
                          "detail": f"Phishing pages often use '{word}' to appear legitimate"})
            score += 15
            break

    # ── Lookalike character substitutions ──
    for fake, real in LOOKALIKE.items():
        if fake in domain:
            flags.append({"check": "Character substitution detected", "risk": "high",
                          "detail": f"Domain uses '{fake}' to mimic '{real}'"})
            score += 40

    # ── Suspicious TLDs ──
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            flags.append({"check": f"Suspicious TLD: {tld}", "risk": "high",
                          "detail": f"The '{tld}' domain extension is commonly used in phishing"})
            score += 25
            break

    # ── Too many subdomains ──
    if len(domain.split(".")) > 4:
        flags.append({"check": "Too many subdomains", "risk": "medium",
                      "detail": "Excessive subdomains are a common phishing trick"})
        score += 20

    # ── Punycode / internationalized domain ──
    if "xn--" in domain:
        flags.append({"check": "Punycode domain", "risk": "high",
                      "detail": "Domain uses punycode — often used for visual spoofing attacks"})
        score += 35

    # ── Numbers in domain ──
    if re.search(r"\d", domain.split(".")[0]):
        flags.append({"check": "Numbers in domain name", "risk": "medium",
                      "detail": "Legitimate domains rarely contain numbers — common in phishing"})
        score += 10

    # ── WHOIS domain age ──
    try:
        w = whois.whois(domain)
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        if creation:
            age_days = (datetime.now() - creation).days
            if age_days < 30:
                flags.append({"check": "Very new domain", "risk": "high",
                              "detail": f"Domain is only {age_days} days old — very suspicious"})
                score += 40
            elif age_days < 180:
                flags.append({"check": "New domain", "risk": "medium",
                              "detail": f"Domain is only {age_days} days old"})
                score += 20
    except:
        flags.append({"check": "WHOIS failed", "risk": "medium",
                      "detail": "Could not verify domain registration"})
        score += 10

    score = min(score, 100)

    if score >= 70:
        verdict = "Dangerous"
    elif score >= 35:
        verdict = "Suspicious"
    else:
        verdict = "Likely Safe"

    return {"score": score, "verdict": verdict, "flags": flags, "url": url}
