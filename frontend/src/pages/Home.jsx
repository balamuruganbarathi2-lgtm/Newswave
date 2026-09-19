import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNewsApi, getFeaturedNewsApi, getTrendingTopicsApi } from '../services/api';
import FeaturedNews from '../components/FeaturedNews';
import NewsCard from '../components/NewsCard';
import TrendingCard from '../components/TrendingCard';
import { NewsCardSkeleton, FeaturedSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { ChevronLeft, ChevronRight, Filter, Sparkles, Calendar, MapPin, ArrowRight, Flag } from 'lucide-react';

const CATEGORY_PILLS = [
  'All', 'Technology', 'Business', 'Sports', 'Health', 'Science', 'Entertainment', 'World', 'Environment'
];

const SOUTH_INDIA_HUB_STATES = [
  { name: 'Tamil Nadu', slug: 'tamil-nadu', color: 'from-blue-600 to-indigo-700', desc: 'Chennai, Coimbatore, Trichy' },
  { name: 'Kerala', slug: 'kerala', color: 'from-emerald-600 to-teal-700', desc: 'Kochi, Thiruvananthapuram, Wayanad' },
  { name: 'Karnataka', slug: 'karnataka', color: 'from-amber-600 to-orange-700', desc: 'Bengaluru, Mysuru, Mangaluru' },
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh', color: 'from-purple-600 to-violet-700', desc: 'Visakhapatnam, Vijayawada, Tirupati' },
  { name: 'Telangana', slug: 'telangana', color: 'from-rose-600 to-pink-700', desc: 'Hyderabad, Warangal, Nizamabad' },
  { name: 'Puducherry', slug: 'puducherry', color: 'from-cyan-600 to-blue-700', desc: 'Pondicherry, Karaikal, Mahe' },
];

const Home = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [southIndiaArticles, setSouthIndiaArticles] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSentiment, setSelectedSentiment] = useState('All');
  
  // Date Range State
  const [dateRangePreset, setDateRangePreset] = useState('All Time');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const calculateDateRange = () => {
    if (dateRangePreset === 'Custom Range') {
      return { from: fromDate, to: toDate };
    }
    
    const today = new Date();
    if (dateRangePreset === 'Today') {
      const dateStr = today.toISOString().split('T')[0];
      return { from: dateStr, to: dateStr };
    } else if (dateRangePreset === 'Yesterday') {
      const yest = new Date(today);
      yest.setDate(today.getDate() - 1);
      const dateStr = yest.toISOString().split('T')[0];
      return { from: dateStr, to: dateStr };
    } else if (dateRangePreset === 'Last 7 Days') {
      const past = new Date(today);
      past.setDate(today.getDate() - 7);
      return { from: past.toISOString().split('T')[0], to: today.toISOString().split('T')[0] };
    } else if (dateRangePreset === 'Last 30 Days') {
      const past = new Date(today);
      past.setDate(today.getDate() - 30);
      return { from: past.toISOString().split('T')[0], to: today.toISOString().split('T')[0] };
    }

    return { from: '', to: '' };
  };

  const fetchHomeData = async () => {
    setLoading(true);
    setError(false);
    try {
      const { from, to } = calculateDateRange();

      const [featRes, newsRes, southRes, trendRes] = await Promise.all([
        getFeaturedNewsApi(),
        getNewsApi({
          category: selectedCategory === 'All' ? '' : selectedCategory,
          sentiment: selectedSentiment === 'All' ? '' : selectedSentiment,
          from,
          to,
          page,
          limit: 9,
        }),
        getNewsApi({
          region: 'South India',
          limit: 3,
        }),
        getTrendingTopicsApi(),
      ]);

      if (featRes.data.success) setFeaturedArticle(featRes.data.article);
      if (newsRes.data.success) {
        setArticles(newsRes.data.articles);
        setTotalPages(newsRes.data.totalPages || 1);
      }
      if (southRes.data.success) {
        setSouthIndiaArticles(southRes.data.articles || []);
      }
      if (trendRes.data.success) setTrendingTopics(trendRes.data.topics || []);
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [selectedCategory, selectedSentiment, dateRangePreset, fromDate, toDate, page]);

  return (
    <div className="space-y-8">
      
      {/* Top Headline / Featured Section */}
      {loading ? (
        <FeaturedSkeleton />
      ) : (
        featuredArticle && <FeaturedNews article={featuredArticle} />
      )}

      {/* SOUTH INDIA SPOTLIGHT HUB (Requirement 7 & 18) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest">
                PROJECT FEATURED HUB
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">South India Regional News</h2>
            <p className="text-xs text-slate-300">Dedicated coverage across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana & Puducherry</p>
          </div>

          <Link
            to="/region/south-india"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/30 whitespace-nowrap self-start sm:self-auto"
          >
            <span>Explore All South India</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* State Quick Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {SOUTH_INDIA_HUB_STATES.map((st) => (
            <Link
              key={st.slug}
              to={`/state/${st.slug}`}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 p-4 rounded-2xl flex flex-col justify-between group transition-all hover:scale-105"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase block mb-1">State</span>
                <h4 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">{st.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{st.desc}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-blue-400">
                <span>Browse</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent South India Articles Preview */}
        {southIndiaArticles.length > 0 && (
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
              Latest South India Bulletins
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {southIndiaArticles.map((art) => (
                <Link
                  key={art._id}
                  to={`/news/${art._id}`}
                  className="bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-2xl hover:bg-slate-800/80 transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase mb-2 inline-block">
                      {art.state || 'South India'}
                    </span>
                    <h5 className="font-bold text-xs text-white group-hover:text-blue-300 line-clamp-2 leading-snug">
                      {art.title}
                    </h5>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Source: {art.sourceName}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trending Topics Bar */}
      {trendingTopics.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Real-Time Trending Keywords</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {trendingTopics.slice(0, 6).map((topic, idx) => (
              <TrendingCard key={idx} topic={topic} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Main Feed Controls & Filters Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Latest Live Articles</h2>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200/60">
              MongoDB Feeds
            </span>
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sentiment:</span>
            <select
              value={selectedSentiment}
              onChange={(e) => {
                setSelectedSentiment(e.target.value);
                setPage(1);
              }}
              className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive 😊</option>
              <option value="Neutral">Neutral 😐</option>
              <option value="Negative">Negative 😟</option>
            </select>
          </div>
        </div>

        {/* Date Filter & Category Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-700">Filter By Date:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {['All Time', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setDateRangePreset(preset);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    dateRangePreset === preset
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {dateRangePreset === 'Custom Range' && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {CATEGORY_PILLS.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Articles Grid */}
      {loading ? (
        <NewsCardSkeleton count={9} />
      ) : error ? (
        <ErrorState onRetry={fetchHomeData} />
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Articles Match Your Filters"
          message="No articles were found matching your current category, sentiment, or date range settings."
          actionText="Reset All Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSelectedSentiment('All');
            setDateRangePreset('All Time');
            setFromDate('');
            setToDate('');
            setPage(1);
          }}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold text-slate-600 px-3">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
};

export default Home;
