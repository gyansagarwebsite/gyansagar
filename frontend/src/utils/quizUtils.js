/**
 * Shuffles a single question's options and updates the correctAnswer index
 * to point to the same text in the new shuffled array.
 * 
 * @param {Object} q - The question object from the backend
 * @returns {Object} - Shuffled question object
 */
export const shuffleQuestion = (q) => {
  if (!q || !q.options || q.options.length < 2) return q;

  const originalOptions = [...q.options];
  const originalCorrectIndex = q.correctAnswer;
  const correctOptionText = originalOptions[originalCorrectIndex];

  // Shuffle logic (Fisher-Yates)
  const shuffledOptions = [...originalOptions];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }

  // Find where the correct answer ended up
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex
  };
};

/**
 * Shuffles an array of questions.
 * 
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Array of shuffled questions
 */
export const shuffleQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];
  return questions.map(q => shuffleQuestion(q));
};
