import stringSimilarity from 'string-similarity';

/**
 * Service to detect duplicate or highly similar news articles
 */

const SIMILARITY_THRESHOLD = 0.72; // Configurable similarity threshold (0.0 to 1.0)

export const checkDuplicate = (newArticleTitle, existingArticles) => {
  if (!newArticleTitle || !existingArticles || existingArticles.length === 0) {
    return { isDuplicate: false, similarArticleId: null, similarityScore: 0 };
  }

  const normalizedNewTitle = newArticleTitle.toLowerCase().replace(/[^\w\s]/gi, '').trim();
  
  let highestScore = 0;
  let matchedArticleId = null;

  for (const article of existingArticles) {
    const normalizedExistingTitle = (article.title || '').toLowerCase().replace(/[^\w\s]/gi, '').trim();
    if (!normalizedExistingTitle) continue;

    const similarity = stringSimilarity.compareTwoStrings(normalizedNewTitle, normalizedExistingTitle);
    
    if (similarity > highestScore) {
      highestScore = similarity;
      matchedArticleId = article._id;
    }
  }

  const isDuplicate = highestScore >= SIMILARITY_THRESHOLD;

  return {
    isDuplicate,
    similarArticleId: isDuplicate ? matchedArticleId : null,
    similarityScore: Math.round(highestScore * 100) / 100,
  };
};
