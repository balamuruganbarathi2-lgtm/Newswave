/**
 * AI Article Classifier & Regional Detector Service
 * Classifies text into standard categories with confidence scores
 * and detects Country, Region (India / South India), and State (Tamil Nadu, Kerala, Karnataka, AP, Telangana, Puducherry).
 */

const CATEGORY_KEYWORDS = {
  Technology: [
    'ai', 'artificial intelligence', 'tech', 'apple', 'google', 'microsoft', 'software', 'hardware',
    'app', 'iphone', 'android', 'cyber', 'robotics', 'chip', 'semiconductor', 'startup', 'crypto',
    'metaverse', 'cloud', 'data', 'algorithm', 'computing', 'nvidia', 'openai', 'llm', 'developer'
  ],
  Business: [
    'market', 'economy', 'stock', 'shares', 'finance', 'company', 'ceo', 'revenue', 'profit',
    'inflation', 'bank', 'investor', 'wall street', 'trade', 'tax', 'earnings', 'gdp', 'fed',
    'real estate', 'billion', 'dollar', 'merger', 'acquisition', 'corporate', 'venture'
  ],
  Sports: [
    'cricket', 'football', 'soccer', 'nba', 'basketball', 'match', 'tournament', 'championship',
    'league', 'goal', 'score', 'player', 'coach', 'stadium', 'cup', 'olympics', 'tennis',
    'formula 1', 'f1', 'race', 'grand prix', 'victory', 'team', 'athlete', 'ipl'
  ],
  Health: [
    'health', 'medical', 'hospital', 'doctor', 'disease', 'virus', 'cancer', 'vaccine', 'drug',
    'medicine', 'fda', 'patient', 'mental health', 'wellness', 'fitness', 'surgery', 'clinical',
    'treatment', 'pharma', 'diet', 'cardiology', 'epidemic', 'therapy'
  ],
  Science: [
    'nasa', 'space', 'astronomy', 'physics', 'quantum', 'mars', 'planet', 'galaxy', 'research',
    'scientist', 'study', 'biology', 'genetics', 'dinosaur', 'fossil', 'asteroid', 'telescope',
    'james webb', 'laboratory', 'discovery', 'experiment', 'atom', 'isro'
  ],
  Entertainment: [
    'movie', 'film', 'actor', 'actress', 'hollywood', 'kollywood', 'tollywood', 'mollywood', 'sandalwood',
    'music', 'song', 'album', 'celebrity', 'star', 'trailer', 'box office', 'netflix', 'series',
    'show', 'emmy', 'oscar', 'grammy', 'director', 'theater', 'concert', 'cinema'
  ],
  World: [
    'president', 'election', 'government', 'politics', 'minister', 'parliament', 'diplomacy',
    'war', 'military', 'peace', 'treaty', 'border', 'un', 'united nations', 'china', 'russia',
    'ukraine', 'europe', 'asia', 'biden', 'policy', 'crisis', 'summit'
  ],
  Environment: [
    'climate', 'global warming', 'environment', 'carbon', 'emissions', 'renewable', 'solar',
    'wind', 'pollution', 'recycle', 'nature', 'ocean', 'wildlife', 'forest', 'disaster',
    'earthquake', 'flood', 'hurricane', 'sustainability', 'green energy', 'monsoon'
  ],
  Education: [
    'education', 'school', 'university', 'college', 'exam', 'student', 'teacher', 'degree',
    'jee', 'neet', 'cbse', 'ugc', 'scholarship', 'campus', 'academic', 'curriculum'
  ]
};

const SOUTH_INDIA_STATE_KEYWORDS = {
  'Tamil Nadu': ['tamil nadu', 'chennai', 'coimbatore', 'madurai', 'trichy', 'salem', 'tirunelveli', 'tn news', 'stalin', 'dmk', 'aiadmk', 'kollywood', 'marina beach'],
  'Kerala': ['kerala', 'kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'kozhikode', 'wayanad', 'thrissur', 'kerala news', 'pinarayi', 'mollywood', 'sabari'],
  'Karnataka': ['karnataka', 'bengaluru', 'bangalore', 'mysuru', 'mysore', 'mangaluru', 'mangalore', 'hubballi', 'siddaramaiah', 'sandalwood', 'vidhana soudha'],
  'Andhra Pradesh': ['andhra pradesh', 'visakhapatnam', 'vizag', 'vijayawada', 'tirupati', 'guntur', 'amaravati', 'ap news', 'chandrababu', 'tollywood'],
  'Telangana': ['telangana', 'hyderabad', 'warangal', 'nizamabad', 'karimnagar', 'secunderabad', 'revanth', 'charminar', 'hitech city'],
  'Puducherry': ['puducherry', 'pondicherry', 'jipmer', 'karaikal', 'mahe', 'yanam', 'auroville']
};

const NATIONAL_INDIA_KEYWORDS = [
  'india', 'delhi', 'new delhi', 'mumbai', 'parliament', 'lok sabha', 'modi', 'rupee', 'isro',
  'supreme court', 'rbi', 'bcci', 'indian navy', 'indian army', 'bharat', 'rajya sabha', 'gdp india'
];

export const classifyArticle = (title = '', description = '') => {
  const combinedText = `${title} ${description}`.toLowerCase();
  
  const categoryScores = {};
  let totalHits = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let hits = 0;
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[-[\]{}()*+?~=!:?^$|#\s\\]/g, '\\$&')}\\b`, 'gi');
      const matches = combinedText.match(regex);
      if (matches) {
        hits += matches.length * (title.toLowerCase().includes(kw) ? 2 : 1);
      }
    }
    categoryScores[category] = hits;
    totalHits += hits;
  }

  let predictedCategory = 'Technology';
  let highestScore = 0;

  for (const [category, hits] of Object.entries(categoryScores)) {
    if (hits > highestScore) {
      highestScore = hits;
      predictedCategory = category;
    }
  }

  let confidence = 0.75;
  if (totalHits > 0) {
    confidence = Math.min(0.98, Math.max(0.78, 0.75 + (highestScore / totalHits) * 0.20 + Math.min(0.08, highestScore * 0.02)));
  }

  return {
    category: predictedCategory,
    confidence: Math.round(confidence * 100) / 100,
  };
};

/**
 * Detect Country, Region, and State for an article based on title, description, and source metadata
 */
export const detectRegionAndState = (title = '', description = '', sourceName = '') => {
  const combinedText = `${title} ${description} ${sourceName}`.toLowerCase();

  // 1. Check South India State Match
  for (const [stateName, keywords] of Object.entries(SOUTH_INDIA_STATE_KEYWORDS)) {
    for (const kw of keywords) {
      if (combinedText.includes(kw)) {
        return {
          country: 'India',
          region: 'South India',
          state: stateName,
        };
      }
    }
  }

  // 2. Check National India Match
  for (const kw of NATIONAL_INDIA_KEYWORDS) {
    if (combinedText.includes(kw)) {
      return {
        country: 'India',
        region: 'India',
        state: 'National',
      };
    }
  }

  // 3. Fallback
  return {
    country: 'India',
    region: 'India',
    state: 'National',
  };
};
