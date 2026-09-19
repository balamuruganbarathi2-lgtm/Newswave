import mongoose from 'mongoose';

const trendingTopicSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    articleCount: {
      type: Number,
      default: 1,
    },
    trendScore: {
      type: Number,
      default: 0.0,
    },
    changeIndicator: {
      type: String,
      enum: ['UP', 'DOWN', 'STABLE'],
      default: 'UP',
    },
    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const TrendingTopic = mongoose.model('TrendingTopic', trendingTopicSchema);
export default TrendingTopic;
