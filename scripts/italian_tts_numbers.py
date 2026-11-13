"""Convert Italian numerals to words for speech synthesis ONLY.

The published text and app JSON are never modified.  The goal is to prevent
multilingual speech models from reading years and Roman centuries in English.
"""
import re

PREPROCESSOR_VERSION = "italian-numerals-v1"

_UNITS = ('zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove',
          'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici',
          'sedici', 'diciassette', 'diciotto', 'diciannove')
_TENS = ('', '', 'venti', 'trenta', 'quaranta', 'cinquanta',
         'sessanta', 'settanta', 'ottanta', 'novanta')
_ROMAN_ORDINALS = {
    'IX': 'nono', 'X': 'decimo', 'XI': 'undicesimo', 'XII': 'dodicesimo',
    'XIII': 'tredicesimo', 'XIV': 'quattordicesimo', 'XV': 'quindicesimo',
    'XVI': 'sedicesimo', 'XVII': 'diciassettesimo', 'XVIII': 'diciottesimo',
    'XIX': 'diciannovesimo', 'XX': 'ventesimo', 'XXI': 'ventunesimo',
}


def italian_number(n):
    """Cardinal numbers from 0 to 9999, as a single Italian word."""
    if not 0 <= n <= 9999:
        raise ValueError('Number out of supported range: ' + str(n))
    if n < 20:
        return _UNITS[n]
    if n < 100:
        tens, units = divmod(n, 10)
        stem = _TENS[tens]
        if units in (1, 8):
            stem = stem[:-1]
        suffix = 'tré' if units == 3 else (_UNITS[units] if units else '')
        return stem + suffix
    if n < 1000:
        hundreds, rest = divmod(n, 100)
        prefix = ('cento' if hundreds == 1 else _UNITS[hundreds] + 'cento')
        # Common Italian orthography elides cento before otto/ottanta.
        if 80 <= rest < 90 or rest == 8:
            prefix = prefix[:-1]
        result = prefix + (italian_number(rest) if rest else '')
        return result[:-3] + 'tré' if n % 10 == 3 and result.endswith('tre') else result
    thousands, rest = divmod(n, 1000)
    prefix = ('mille' if thousands == 1 else italian_number(thousands) + 'mila')
    result = prefix + (italian_number(rest) if rest else '')
    return result[:-3] + 'tré' if n % 10 == 3 and result.endswith('tre') else result


def spoken_italian(text):
    """Transform years, simple numerals, numeric dates and Roman centuries.

    This is a pronunciation aid, not an Italian grammar editor.
    """
    # Single Roman numeral tokens; avoid replacing ordinary words.
    def roman_replace(match):
        return _ROMAN_ORDINALS[match.group(0)]
    romans = '|'.join(sorted(_ROMAN_ORDINALS, key=len, reverse=True))
    text = re.sub(r'(?<!\w)(?:' + romans + r')(?!\w)', roman_replace, text)

    # Decimal comma: 4,5 -> quattro virgola cinque.
    def decimal_replace(match):
        whole, frac = match.group(1), match.group(2)
        return italian_number(int(whole)) + ' virgola ' + ' '.join(_UNITS[int(c)] for c in frac)
    text = re.sub(r'(?<![\w])([0-9]{1,4}),([0-9]{1,3})(?![\w])', decimal_replace, text)

    def integer_replace(match):
        return italian_number(int(match.group(0)))
    return re.sub(r'(?<!\w)[0-9]{1,4}(?!\w)', integer_replace, text)
