"""Convert written numeric dates to spoken Spanish words for Qwen-TTS.

Only the audio prompt is normalized. App texts in content/translations/es.json
are never modified. Native Spanish QA remains necessary.
"""
import re

PREPROCESSOR_VERSION = "spanish-numerals-v1"

ONES = ("cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve")
TENS = ("", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa")
HUNDREDS = ("", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos")
ROMAN = {"V":5,"VI":6,"VII":7,"VIII":8,"IX":9,"X":10,"XI":11,"XII":12,"XIII":13,"XIV":14,"XV":15,"XVI":16,"XVII":17,"XVIII":18,"XIX":19,"XX":20,"XXI":21}


def spanish_number(n):
    """Cardinal 0..9999, suitable for years; use in a narration, not for publication."""
    if not 0 <= n <= 9999:
        raise ValueError(n)
    if n < 30:
        return ONES[n]
    if n < 100:
        tens, units = divmod(n, 10)
        return TENS[tens] + (" y " + ONES[units] if units else "")
    if n == 100:
        return "cien"
    if n < 1000:
        hundreds, rest = divmod(n, 100)
        return HUNDREDS[hundreds] + (" " + spanish_number(rest) if rest else "")
    thousands, rest = divmod(n, 1000)
    prefix = ("mil" if thousands == 1 else spanish_number(thousands) + " mil")
    return prefix + (" " + spanish_number(rest) if rest else "")


def spoken_spanish(text):
    """Prepare years, dates, decimals, and Roman-century notation for TTS.

    This is intentionally conservative: avoids modifying alphanumeric labels.
    """
    # Roman centuries (e.g. "siglo XVI", "del IX al XVIII").
    # Only complete uppercase tokens matching a small whitelist; never names.
    roman_pattern = r"(?<!\w)(?:" + "|".join(sorted(ROMAN, key=len, reverse=True)) + r")(?!\w)"
    text = re.sub(roman_pattern, lambda m: spanish_number(ROMAN[m.group(0)]), text)

    # 4,5 -> cuatro coma cinco (e.g. kilometres). Keep the separator from OCR-like years out.
    def decimal_sub(match):
        return spanish_number(int(match.group(1))) + " coma " + " ".join(ONES[int(c)] for c in match.group(2))
    text = re.sub(r"(?<![\w])([0-9]{1,4}),([0-9]{1,3})(?![\w])", decimal_sub, text)

    def number_sub(match):
        return spanish_number(int(match.group(0)))
    return re.sub(r"(?<!\w)(?<!\d[.,])\d{1,4}(?!\w)(?![.,]\d)", number_sub, text)
