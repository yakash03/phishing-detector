import re
import urllib.parse
import whois
from datetime import datetime

TRUSTED_DOMAINS = [
    "google.com", "youtube.com", "facebook.com", "amazon.com", "twitter.com",
    "instagram.com", "linkedin.com", "microsoft.com", "apple.com", "github.com",
    "stackoverflow.com", "wikipedia.org", "reddit.com", "netflix.com",
    "yahoo.com", "bing.com", "whatsapp.com", "zoom.us", "dropbox.com",
    "gmail.com", "outlook.com", "hotmail.com", "live.com", "office.com",
    "adobe.com", "cloudflare.com", "spotify.com", "twitch.tv", "discord.com",
    "paypal.com", "ebay.com", "walmart.com", "target.com", "bestbuy.com",
    "chase.com", "bankofamerica.com", "wellsfargo.com", "citibank.com",
    "nytimes.com", "bbc.com", "cnn.com", "reuters.com", "bloomberg.com",
    "medium.com", "wordpress.com", "shopify.com", "stripe.com", "slack.com",
    "notion.so", "figma.com", "canva.com", "trello.com", "atlassian.com",
    "airbnb.com", "uber.com", "lyft.com", "doordash.com", "grubhub.com",
    "indeed.com", "glassdoor.com", "coursera.org", "udemy.com", "edx.org",
    "npmjs.com", "pypi.org", "docker.com", "kubernetes.io", "aws.amazon.com",
    "azure.microsoft.com", "cloud.google.com", "digitalocean.com", "heroku.com",
    "vercel.com", "netlify.com", "railway.app", "render.com", "fly.io"
]

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "account", "update", "banking", "confirm",
    "password", "credential", "signin", "wallet", "alert", "suspended",
    "unusual", "activity", "validate", "restore", "recover", "unlock",
    "limited", "expire", "urgent", "immediate", "action", "required",
    "click", "free", "winner", "prize", "gift", "bonus", "claim",
    "invoice", "payment", "billing", "refund", "transaction", "transfer"
]

LOOKALIKE_CHARS = {
    "paypa1": "paypal", "paypai": "paypal", "paypa|": "paypal",
    "arnazon": "amazon", "anazon": "amazon", "amaz0n": "amazon",
    "g00gle": "google", "gooogle": "google", "googie": "google",
    "faceb00k": "facebook", "facebok": "facebook", "faceboook": "facebook",
    "micros0ft": "microsoft", "mircosoft": "microsoft", "microsft": "microsoft",
    "app1e": "apple", "appl3": "apple", "aple": "apple",
    "netfl1x": "netflix", "netfix": "netflix", "netlfix": "netflix",
    "inst4gram": "instagram", "instagran": "instagram", "lnstagram": "instagram",
    "twitt3r": "twitter", "twtter": "twitter", "tvvitter": "twitter",
    "y0utube": "youtube", "youtub3": "youtube", "yotube": "youtube",
    "linkedln": "linkedin", "linke din": "linkedin", "lnkedin": "linkedin",
    "dropb0x": "dropbox", "drropbox": "dropbox",
    "githb": "github", "githubb": "github", "guthub": "github"
}

SUSPICIOUS_TLDS = [
    ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".buzz", ".club",
    ".work", ".click", ".link", ".download", ".stream", ".gdn", ".racing",
    ".win", ".loan", ".review", ".trade", ".date", ".faith", ".accountant",
    ".science", ".party", ".cricket", ".men", ".bid"
]

TRUSTED_TLDS = [
    ".com", ".org", ".net", ".edu", ".gov", ".io", ".co", ".uk",
    ".de", ".fr", ".jp", ".au", ".ca", ".in", ".us"
]

SHORTENERS = [
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "short.link",
    "buff.ly", "rb.gy", "is.gd", "tiny.cc", "cutt.ly", "shorturl.at"
]

def get_base_domain(domain):
    parts = domain.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return domain

def levenshtein(s1, s2):
    if len(s1) < len(s2):
        return levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    prev = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        curr = [i + 1]
        for j, c2 in enumerate(s2):
            curr.append(min(prev[j + 1] + 1, curr[j] + 1, prev[j] + (c1 != c2)))
        prev = curr
    return prev[len(s2)]

def analyze_url(url):
    flags = []
    score = 0

    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    parsed = urllib.parse.urlparse(url)
    domain_raw = parsed.netloc.replace("www.", "")
    domain = domain_raw.lower().strip()
    base_domain = get_base_domain(domain)
    domain_name = domain.split(".")[0]
    full_url_lower = url.lower()

    # ── 1. TRUSTED DOMAIN — instant safe return ──
    if base_domain in TRUSTED_DOMAINS:
        return {
            "score": 0,
            "verdict": "Likely Safe",
            "flags": [{
                "check": "Verified trusted domain",
                "risk": "safe",
                "detail": f"{base_domain} is a globally trusted and verified domain"
            }],
            "url": url
        }

    # ── 2. HTTPS check ──
    if not url.startswith("https://"):
        flags.append({"check": "No HTTPS encryption", "risk": "high",
                      "detail": "Site does not use HTTPS — your data can be intercepted"})
        score += 30

    # ── 3. IP address as domain ──
    if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain):
        flags.append({"check": "IP address used as domain", "risk": "high",
                      "detail": "Legitimate sites use domain names, not raw IP addresses"})
        score += 40

    # ── 4. Mixed case domain (GOOGle.com style) ──
    if domain_raw != domain_raw.lower():
        flags.append({"check": "Mixed case domain name", "risk": "high",
                      "detail": f"'{domain_raw}' uses unusual uppercase letters — classic phishing trick to fool users"})
        score += 50

    # ── 5. Lookalike character substitutions ──
    for fake, real in LOOKALIKE_CHARS.items():
        if fake in domain:
            flags.append({"check": f"Character substitution attack", "risk": "high",
                          "detail": f"Domain uses '{fake}' to impersonate '{real}'"})
            score += 45
            break

    # ── 6. Close match to trusted domain (typosquatting) ──
    for trusted in TRUSTED_DOMAINS:
        trusted_name = trusted.split(".")[0]
        if domain_name != trusted_name and levenshtein(domain_name, trusted_name) <= 2 and len(domain_name) > 3:
            flags.append({"check": f"Typosquatting detected", "risk": "high",
                          "detail": f"'{domain_name}' is suspiciously similar to '{trusted_name}' — possible impersonation"})
            score += 45
            break

    # ── 7. Trusted brand name in subdomain or path ──
    for trusted in TRUSTED_DOMAINS:
        trusted_name = trusted.split(".")[0]
        if trusted_name in domain and base_domain not in TRUSTED_DOMAINS:
            flags.append({"check": f"Brand impersonation", "risk": "high",
                          "detail": f"URL contains '{trusted_name}' but is NOT the real {trusted} website"})
            score += 40
            break

    # ── 8. Suspicious TLD ──
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            flags.append({"check": f"High-risk domain extension: {tld}", "risk": "high",
                          "detail": f"'{tld}' extensions are heavily used in phishing campaigns"})
            score += 30
            break

    # ── 9. URL shortener ──
    for shortener in SHORTENERS:
        if shortener in domain:
            flags.append({"check": "URL shortener detected", "risk": "medium",
                          "detail": f"URL shorteners like {shortener} hide the real destination"})
            score += 20
            break

    # ── 10. Suspicious keywords ──
    found_keywords = []
    for word in SUSPICIOUS_KEYWORDS:
        if word in full_url_lower:
            found_keywords.append(word)
    if found_keywords:
        flags.append({"check": f"Phishing keywords detected", "risk": "medium",
                      "detail": f"Suspicious words found: {', '.join(found_keywords[:5])}"})
        score += min(len(found_keywords) * 8, 30)

    # ── 11. Excessive subdomains ──
    subdomain_count = len(domain.split(".")) - 2
    if subdomain_count > 2:
        flags.append({"check": "Excessive subdomains", "risk": "medium",
                      "detail": f"Domain has {subdomain_count} subdomains — used to confuse users"})
        score += 20

    # ── 12. Very long URL ──
    if len(url) > 100:
        flags.append({"check": "Extremely long URL", "risk": "medium",
                      "detail": f"URL is {len(url)} characters — phishing URLs are often very long to hide real destination"})
        score += 15
    elif len(url) > 75:
        flags.append({"check": "Long URL", "risk": "low",
                      "detail": f"URL is {len(url)} characters — slightly longer than normal"})
        score += 8

    # ── 13. Special characters ──
    if "@" in parsed.netloc:
        flags.append({"check": "@ symbol in URL", "risk": "high",
                      "detail": "@ in URL can be used to hide the real destination domain"})
        score += 35
    if url.count("-") > 3:
        flags.append({"check": "Multiple hyphens in domain", "risk": "medium",
                      "detail": "Legitimate sites rarely use many hyphens — common in phishing"})
        score += 15
    if re.search(r"%[0-9a-fA-F]{2}", url):
        flags.append({"check": "URL encoded characters", "risk": "medium",
                      "detail": "Encoded characters can be used to hide malicious content"})
        score += 15

    # ── 14. Numbers in domain ──
    if re.search(r"\d", domain_name) and not re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain):
        flags.append({"check": "Numbers in domain name", "risk": "low",
                      "detail": "Legitimate domains rarely mix numbers — common phishing pattern"})
        score += 10

    # ── 15. Punycode ──
    if "xn--" in domain:
        flags.append({"check": "Punycode internationalized domain", "risk": "high",
                      "detail": "Punycode domains can visually impersonate real websites"})
        score += 35

    # ── 16. Double extension ──
    if re.search(r"\.(php|html|asp|exe|js)\.", full_url_lower):
        flags.append({"check": "Double file extension", "risk": "high",
                      "detail": "Multiple file extensions in URL is a common malware distribution trick"})
        score += 30

    # ── 17. WHOIS domain age ──
    try:
        w = whois.whois(domain)
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        if creation:
            age_days = (datetime.now() - creation).days
            if age_days < 7:
                flags.append({"check": "Brand new domain — less than 7 days old", "risk": "high",
                              "detail": f"Domain registered only {age_days} days ago — extremely suspicious"})
                score += 50
            elif age_days < 30:
                flags.append({"check": "Very new domain — less than 30 days old", "risk": "high",
                              "detail": f"Domain is only {age_days} days old — phishing sites are often newly registered"})
                score += 40
            elif age_days < 180:
                flags.append({"check": "Relatively new domain", "risk": "medium",
                              "detail": f"Domain is only {age_days} days old"})
                score += 20
            else:
                flags.append({"check": "Established domain", "risk": "safe",
                              "detail": f"Domain has been registered for {age_days} days"})
    except:
        flags.append({"check": "WHOIS lookup failed", "risk": "medium",
                      "detail": "Could not verify domain registration — domain may be hidden or very new"})
        score += 10

    # ── Final score and verdict ──
    score = min(score, 100)

    if score >= 70:
        verdict = "Dangerous"
    elif score >= 35:
        verdict = "Suspicious"
    elif score >= 15:
        verdict = "Low Risk"
    else:
        verdict = "Likely Safe"

    return {"score": score, "verdict": verdict, "flags": flags, "url": url}
