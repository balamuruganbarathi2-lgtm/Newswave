import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: 'text',
    },
    description: {
      type: String,
      default: '',
      trim: true,
      index: 'text',
    },
    content: {
      type: String,
      default: '',
    },
    contentSnippet: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    keyPoints: {
      type: [String],
      default: [],
    },
    whyItMatters: {
      type: String,
      default: '',
    },
    readingTime: {
      type: Number,
      default: 3,
    },
    url: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    articleUrl: {
      type: String,
      default: '',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    urlToImage: {
      type: String,
      default: '',
    },
    sourceName: {
      type: String,
      default: 'NewsWave Feed',
      index: true,
    },
    source: {
      type: String,
      default: 'NewsWave Feed',
    },
    author: {
      type: String,
      default: 'Staff Reporter',
    },
    category: {
      type: String,
      required: true,
      default: 'Technology',
      index: true,
    },
    country: {
      type: String,
      default: 'India',
      index: true,
    },
    region: {
      type: String,
      default: 'India',
      index: true,
    },
    state: {
      type: String,
      default: 'National',
      index: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      default: 'Neutral',
      index: true,
    },
    sentimentScore: {
      type: Number,
      default: 0.0,
    },
    classificationConfidence: {
      type: Number,
      default: 0.85,
    },
    topic: {
      type: String,
      default: 'General',
      index: true,
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    similarArticleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      default: null,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast regional and category querying
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ country: 1, publishedAt: -1 });
articleSchema.index({ region: 1, publishedAt: -1 });
articleSchema.index({ state: 1, publishedAt: -1 });
articleSchema.index({ region: 1, state: 1, publishedAt: -1 });
articleSchema.index({ sourceName: 1, publishedAt: -1 });

// Ensure URLs, images, and content snippets match
articleSchema.pre('save', function (next) {
  if (this.urlToImage && !this.imageUrl) {
    this.imageUrl = this.urlToImage;
  } else if (this.imageUrl && !this.urlToImage) {
    this.urlToImage = this.imageUrl;
  }

  if (this.sourceName && !this.source) {
    this.source = this.sourceName;
  } else if (this.source && !this.sourceName) {
    this.sourceName = this.source;
  }

  if (this.url) {
    this.articleUrl = this.url;
    this.sourceUrl = this.url;
  }

  if (!this.contentSnippet && (this.description || this.content)) {
    this.contentSnippet = (this.description || this.content || '').substring(0, 300);
  }

  next();
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
