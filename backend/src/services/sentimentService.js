import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

/**
 * Perform Sentiment Analysis on article title and snippet
 */
export const analyzeSentiment = (title = '', description = '') => {
  const fullText = `${title}. ${description}`;
  const result = sentimentAnalyzer.analyze(fullText);

  // Normalize score between -1.0 and +1.0
  const wordCount = result.tokens ? Math.max(result.tokens.length, 1) : 1;
  const rawScore = result.score;
  const normalizedScore = Math.max(-1, Math.min(1, rawScore / Math.sqrt(wordCount * 1.5)));

  let label = 'Neutral';
  if (normalizedScore > 0.12) {
    label = 'Positive';
  } else if (normalizedScore < -0.12) {
    label = 'Negative';
  }

  return {
    sentiment: label,
    sentimentScore: Math.round(normalizedScore * 100) / 100,
    positiveWords: result.positive || [],
    negativeWords: result.negative || [],
  };
};
