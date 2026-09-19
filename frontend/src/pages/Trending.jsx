import React, { useState, useEffect } from 'react';
import {
  getTrendingTopicsApi,
  getCategoryDistributionApi,
  getSentimentDistributionApi,
  getNewsActivityApi
} from '../services/api';
import ChartCard, { CategoryChart, SentimentChart, ActivityTimelineChart } from '../components/ChartCard';
import TrendingCard from '../components/TrendingCard';
import { Flame, TrendingUp, BarChart2, PieChart as PieIcon, Activity } from 'lucide-react';

const Trending = () => {
  const [timeframe, setTimeframe] = useState('7');
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [trendRes, catRes, sentRes, actRes] = await Promise.all([
          getTrendingTopicsApi(),
          getCategoryDistributionApi(),
          getSentimentDistributionApi(),
          getNewsActivityApi(timeframe),
        ]);

        if (trendRes.data.success) setTrendingTopics(trendRes.data.topics);
        if (catRes.data.success) setCategoryData(catRes.data.data);
        if (sentRes.data.success) setSentimentData(sentRes.data.data);
        if (actRes.data.success) setActivityData(actRes.data.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe]);

  return (
    <div className="space-y-8">
      {/* Header & Time Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 fill-rose-600" />
            <span>AI Trend Detection</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trending & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time keyword extraction, sentiment distributions, and category analytics.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { label: 'Today', value: '1' },
            { label: 'Last 7 Days', value: '7' },
            { label: 'Last 30 Days', value: '30' },
          ].map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Topics Widget (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <TrendingCard topics={trendingTopics} />
        </div>

        {/* Right Charts Suite (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Activity Timeline Chart */}
          <ChartCard
            title="News Collection Activity Timeline"
            subtitle={`Daily count of new articles ingested over past ${timeframe} days`}
          >
            <ActivityTimelineChart data={activityData} />
          </ChartCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution Chart */}
            <ChartCard
              title="Articles by Category"
              subtitle="Distribution across NLP categories"
            >
              <CategoryChart data={categoryData} />
            </ChartCard>

            {/* Sentiment Breakdown Chart */}
            <ChartCard
              title="Sentiment Analysis Breakdown"
              subtitle="Positive vs Neutral vs Negative ratio"
            >
              <SentimentChart data={sentimentData} />
            </ChartCard>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Trending;
