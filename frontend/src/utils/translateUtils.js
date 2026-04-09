/**
 * Automatic translation utility using the free Google Translate API.
 * No API key required. Translates any text (English or otherwise) to Nepali.
 *
 * Falls back to the original text if the API call fails.
 */

// In-memory cache so the same string is never translated twice in a session
const translationCache = new Map();

/**
 * Translate a single piece of text to the target language.
 * @param {string} text       - The source text
 * @param {string} targetLang - BCP-47 language code, default 'ne' (Nepali)
 * @returns {Promise<string>} - Translated text, or original on failure
 */
export const translateText = async (text, targetLang = 'ne') => {
  if (!text || !text.trim()) return text;

  const cacheKey = `${targetLang}::${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    // Response: [ [ ["translated", "original", ...], ... ], null, "en", ... ]
    const translated = data[0]
      .map((chunk) => (chunk && chunk[0] ? chunk[0] : ''))
      .join('');

    const result = translated || text; // never return empty string
    translationCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('[translate] failed, using original:', err.message);
    return text; // graceful fallback
  }
};

/**
 * Translate a full question object (questionText + options) to Nepali.
 * All strings are fetched in parallel for speed.
 *
 * @param {Object} question - Question with { questionText, options, ... }
 * @param {string} targetLang - default 'ne'
 * @returns {Promise<Object>} - New question object with translated fields
 */
export const translateQuestion = async (question, targetLang = 'ne') => {
  try {
    const allTexts = [question.questionText, ...question.options];
    const translations = await Promise.all(
      allTexts.map((t) => translateText(t, targetLang))
    );

    return {
      ...question,
      questionText: translations[0],
      options: translations.slice(1),
    };
  } catch (err) {
    return question; // fallback to original question
  }
};

/**
 * Translate an entire array of questions to Nepali in parallel.
 *
 * @param {Array}  questions  - Array of question objects
 * @param {string} targetLang - default 'ne'
 * @returns {Promise<Array>}  - Translated question array
 */
export const translateQuestions = async (questions, targetLang = 'ne') => {
  return Promise.all(questions.map((q) => translateQuestion(q, targetLang)));
};
