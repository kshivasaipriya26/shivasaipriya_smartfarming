
import re

def detect_language(text, preferred_language="en"):
    if not text.strip():
        return preferred_language

    scripts = {
        "te": r"[\u0C00-\u0C7F]",
        "hi": r"[\u0900-\u097F]",
        "ta": r"[\u0B80-\u0BFF]",
        "kn": r"[\u0C80-\u0CFF]",
        "ml": r"[\u0D00-\u0D7F]",
        "bn": r"[\u0980-\u09FF]",
        "gu": r"[\u0A80-\u0AFF]",
        "pa": r"[\u0A00-\u0A7F]",
        "or": r"[\u0B00-\u0B7F]",
        "ur": r"[\u0600-\u06FF]",
    }

    for language, pattern in scripts.items():
        if re.search(pattern, text):
            return language

    return preferred_language if preferred_language in {
        "en", "te", "hi", "ta", "kn", "ml", "bn", "gu", "pa", "or", "ur"
    } else "en"


def analyze_farming_query(text):
    text = re.sub(r"\s+", " ", text).strip()
    lower = text.lower()

    crops = {
        "rice": ["rice", "paddy", "వరి", "धान"],
        "cotton": ["cotton", "పత్తి", "कपास"],
        "maize": ["maize", "corn", "మొక్కజొన్న"],
        "chilli": ["chilli", "chili", "మిరప"],
    }

    crop = next(
        (name for name, words in crops.items()
         if any(word in lower for word in words)),
        None
    )

    if any(w in lower for w in [
        "disease", "pest", "insect", "వ్యాధి", "పురుగు"
    ]):
        intent = "pest_or_disease"
    elif any(w in lower for w in ["water", "irrigation", "నీరు"]):
        intent = "irrigation"
    elif any(w in lower for w in ["fertilizer", "fertiliser", "ఎరువు"]):
        intent = "fertilizer"
    elif any(w in lower for w in ["price", "market", "ధర"]):
        intent = "market_information"
    else:
        intent = "general"

    return {
        "normalized_text": text,
        "intent": intent,
        "crop": crop
    }
