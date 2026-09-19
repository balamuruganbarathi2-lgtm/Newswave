/**
 * Smart Article-Specific Image Resolver
 * Provides exact keyword matching for news topics + deterministic fallback pools
 * to guarantee every article receives a distinct, relevant thumbnail.
 */

// Keyword-to-Image Map for highly specific topic matching
const KEYWORD_IMAGE_MAP = [
  // --- SPORTS ---
  { keywords: ['cricket', 'wicket', 'run rate', 'ipl', 'test match', 'batsman', 'bowler'], image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['grand prix', 'formula 1', 'f1', 'pit strategy', 'pit stop', 'race driver', 'circuit', 'racing car', 'motorsport'], image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['football', 'soccer', 'match comeback', 'championship victory', 'goal', 'striker', 'premier league', 'champions league'], image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['basketball', 'nba', 'dunk', 'three-pointer', 'hoop', 'court'], image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['tennis', 'grand slam', 'wimbledon', 'us open', 'racket', 'ace'], image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['golf', 'pga', 'birdie', 'putting green', 'hole in one'], image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['boxing', 'mma', 'ufc', 'knockout', 'ring', 'heavyweight'], image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['olympics', 'track and field', 'marathon', 'sprint', 'running', 'athlete'], image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['swimming', 'pool', 'lap', 'freestyle'], image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80' },

  // --- TECHNOLOGY ---
  { keywords: ['quantum', 'qubit', 'quantum processor', 'quantum computer'], image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['ai', 'artificial intelligence', 'autonomous', 'llm', 'chatgpt', 'neural network', 'robotics'], image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['semiconductor', 'wafer', 'chip', 'intel', 'nvidia', 'tsmc', 'transistor'], image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['smartphone', 'iphone', 'android', 'mobile app', 'samsung'], image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['software', 'developer', 'coding', 'programming', 'javascript', 'python'], image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['cybersecurity', 'hacker', 'encryption', 'data breach', 'firewall'], image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['cloud', 'aws', 'azure', 'server', 'data center'], image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },

  // --- BUSINESS ---
  { keywords: ['federal reserve', 'interest rate', 'central bank', 'inflation', 'fed'], image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['stock market', 's&p 500', 'nasdaq', 'wall street', 'earnings', 'shares', 'equity'], image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['energy', 'oil', 'petroleum', 'commodities', 'gas'], image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['real estate', 'housing', 'mortgage', 'property'], image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['crypto', 'bitcoin', 'ethereum', 'blockchain'], image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },

  // --- SCIENCE ---
  { keywords: ['webb', 'james webb', 'telescope', 'exoplanet', 'astronomy', 'galaxy', 'nasa', 'space'], image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['deep sea', 'ocean', 'hydrothermal', 'submersible', 'marine'], image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['physics', 'particle', 'cern', 'atom', 'laser'], image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80' },

  // --- HEALTH ---
  { keywords: ['gene therapy', 'dna', 'genetic', 'clinical trial', 'remission'], image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['vaccine', 'vaccination', 'who', 'seasonal strain', 'virus', 'hospital', 'medical'], image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['doctor', 'surgery', 'patient', 'medicine', 'health'], image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80' },

  // --- ENTERTAINMENT ---
  { keywords: ['movie', 'cinema', 'film', 'box office', 'actor', 'hollywood'], image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['music', 'concert', 'album', 'singer', 'grammy', 'song'], image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' },

  // --- ENVIRONMENT ---
  { keywords: ['climate', 'global warming', 'renewable', 'solar', 'wind energy', 'carbon'], image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['forest', 'rainforest', 'deforestation', 'trees', 'conservation'], image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },

  // --- WORLD ---
  { keywords: ['diplomacy', 'summit', 'treaty', 'united nations', 'president', 'prime minister', 'election'], image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80' }
];

// Diverse category image pools (Used when no specific keyword matches)
const CATEGORY_IMAGE_POOLS = {
  Sports: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', // Football stadium
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', // F1 race
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80', // Cricket match
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80', // Basketball hoop
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80', // Tennis court
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80', // Golf course
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', // Athletics track
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80', // Boxing ring
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80', // Swimming pool
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80', // Gym / Training
  ],
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', // Circuit board
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80', // AI Cybernetics
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80', // Quantum processor
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', // Code editor screen
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // Smartphone
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80', // Server racks
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', // Cybersecurity matrix
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', // Global network
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80', // UX design wireframe
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', // Matrix code stream
  ],
  Business: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', // Financial analytics
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80', // Stock market ticker
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80', // Bank building / currency
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', // Financial district skyscrapers
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', // Executive meeting
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80', // Energy commodities
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80', // Banking exchange
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80', // Real estate property
  ],
  Science: [
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80', // Science lab laser
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', // Space nebula / JWST
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', // Deep sea ocean
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', // Chemical research beaker
    'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80', // Rocket launch
  ],
  Health: [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80', // Medical doctor stethoscope
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80', // Gene therapy DNA research
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', // Vaccine vials
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', // Healthcare consultation
  ],
  Entertainment: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', // Live concert stage
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', // Cinema theatre
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', // Studio microphone
  ],
  World: [
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80', // Global map / travel
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80', // International summit hall
  ],
  Environment: [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', // Landscape mountain nature
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80', // Lush green forest
  ]
};

/**
 * Extract direct image URL from HTML content if available (e.g. from RSS item description or content:encoded)
 */
export const extractImageFromHtml = (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== 'string') return null;
  const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1] && imgMatch[1].startsWith('http')) {
    return imgMatch[1];
  }
  return null;
};

/**
 * Deterministically pick an article-specific image based on title/description keywords or title hash.
 */
export const getArticleSpecificImage = (title = '', description = '', category = 'Technology') => {
  const combinedText = `${title} ${description}`.toLowerCase();

  // 1. Try matching high-specificity keywords
  for (const item of KEYWORD_IMAGE_MAP) {
    if (item.keywords.some((kw) => combinedText.includes(kw))) {
      return item.image;
    }
  }

  // 2. Deterministic Hash Fallback based on article title
  const pool = CATEGORY_IMAGE_POOLS[category] || CATEGORY_IMAGE_POOLS['Technology'];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
};
