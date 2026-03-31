import re


class PlaceholderClassifier:
    """Rule-based placeholder classifier using pattern matching."""

    AI_PATTERNS = [
        (r"\b(it is a|it is the|it is our|it is my)\b", "Formal subject introduction", 0.15),
        (r"\b(multifaceted|comprehensive|meticulously|profoundly|exemplary)\b", "Overly formal vocabulary", 0.2),
        (r"\b(esteemed|vital|critical|crucial|paramount|imperative)\b", "Elevated formal language", 0.15),
        (r"\b(concise|succinct|brief|summary|overall)\b", "Predictable transitions", 0.1),
        (r"\b(however|therefore|furthermore|moreover|consequently|thus)\b", "Formulaic connectors", 0.1),
        (r"\b(in conclusion|to conclude|ultimately|finally|in summary)\b", "Predictable conclusion phrase", 0.2),
        (r"\b(the delegation|our delegation|the committee|this assembly)\b", "MUN formal address", 0.15),
        (r"\b(all stakeholders|all parties|all relevant actors)\b", "Generic stakeholder language", 0.15),
        (r"\b(collaborative|cooperative|collective|unified effort)\b", "AI cooperative language", 0.12),
        (r"\b(sustainable|equitable|inclusive|balanced approach)\b", "AI policy language", 0.12),
        (r"\b(facilitate|enavigate|leverage|mobilize)\b", "Corporate AI language", 0.18),
        (r"\b(aspect|factor|element|component)\b", "Generic formal noun", 0.08),
        (r"\b(utilize|implement|facilitate|enhance)\b", "AI action verbs", 0.12),
        (r"\b(majority|significant|substantial|considerable)\b", "Hedged superlatives", 0.1),
        (r"\b(ensure|guarantee|assure|secure)\b", "Strong guarantee language", 0.1),
        (r"\b(underscore|emphasize|highlight|illuminate)\b", "Formal emphasis", 0.15),
    ]

    def analyze(self, text: str) -> dict:
        """Analyze text and return score with highlights."""
        text_lower = text.lower()
        score = 0.0
        highlights = []

        for sentence_end in re.finditer(r'[.!?]\s+', text):
            start = sentence_end.start()
            sentence = text_lower[start + 1: sentence_end.end()]
            if not sentence.strip():
                continue

            sentence_score = 0.0
            matched_reason = None

            for pattern, reason, weight in self.AI_PATTERNS:
                if re.search(pattern, sentence):
                    sentence_score += weight
                    if matched_reason is None:
                        matched_reason = reason

            if sentence_score > 0.2:
                actual_start = text_lower.rfind(sentence, 0, sentence_end.start() + 1)
                highlights.append({
                    "start": actual_start,
                    "end": sentence_end.start() + 1,
                    "score": min(sentence_score, 1.0),
                    "reason": matched_reason or "Formal AI patterns"
                })

        highlights = highlights[:5]

        ai_word_count = 0
        total_words = len(text.split())
        for pattern, _, weight in self.AI_PATTERNS:
            ai_word_count += len(re.findall(pattern, text_lower))

        if total_words > 0:
            ai_density = ai_word_count / total_words
            score = min(0.3 + ai_density * 3, 0.95)
        else:
            score = 0.5

        if len(highlights) == 0 and score < 0.4:
            score = max(0.05, score - 0.25)
        elif len(highlights) == 0 and score > 0.6:
            score = min(0.95, score + 0.1)

        return {
            "score": round(score, 2),
            "highlights": highlights
        }
