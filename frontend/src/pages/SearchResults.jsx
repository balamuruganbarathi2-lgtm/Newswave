import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getNewsApi } from '../services/api';
import NewsCard from '../components/NewsCard';
import { NewsCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('All');
  const [sentiment, setSentiment] = useState('All');
  const [sort, setSort] = useState('latest');
  
  // Date Range Filter
  const [datePreset, setDatePreset] = useState('All Time');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const calculateDateRange = () => {
    if (datePreset === 'Custom Range') {
      return { from: fromDate, to: toDate };
    }
    const today = new Date();
    if (datePreset === 'Today') {
      const dateStr = today.toISOString().split('T')[0];
      return { from: dateStr, to: dateStr };
    } else if (datePreset === 'Yesterday') {
      const yest = new Date(today);
      yest.setDate(today.getDate() - 1);
      const dateStr = yest.toISOString().split('T')[0];
      return { from: dateStr, to: dateStr };
    } else if (datePreset === 'Last 7 Days') {
      const past = new Date(today);
      past.setDate(today.getDate() - 7);
      return { from: past.toISOString().split('T')[0], to: today.toISOString().split('T')[0] };
    } else if (datePreset === 'Last 30 Days') {
      const past = new Date(today);
      past.setDate(today.getDate() - 30);
      return { from: past.toISOString().split('T')[0], to: today.toISOString().split('T')[0] };
    }
    return { from: '', to: '' };
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const { from, to } = calculateDateRange();

        const { data } = await getNewsApi({
          search: queryParam,
          category: category === 'All' ? '' : category,
          sentiment: sentiment === 'All' ? '' : sentiment,
          from,
          to,
          sort,
          page,
          limit: 12,
        });

        if (data.success) {
          setArticles(data.articles);
          setTotal(data.total);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [queryParam, category, sentiment, sort, datePreset, fromDate, toDate, page]);

  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Search News Analytics</span>
            </h1>
            {queryParam && (
              <p className="text-xs text-slate-500 mt-1">
                Showing results for <span className="font-bold text-slate-800">"{queryParam}"</span> — {total} articles found
              </p>
            )}
          </div>

          <div className="w-full md:w-auto">
            <SearchBar placeholder="Type search phrase..." initialValue={queryParam} />
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Category:</span>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Sports">Sports</option>
                <option value="Health">Health</option>
                <option value="Science">Science</option>
                <option value="Entertainment">Entertainment</option>
                <option value="World">World</option>
                <option value="Environment">Environment</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={datePreset}
                onChange={(e) => { setDatePreset(e.target.value); setPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Custom Range">Custom Range</option>
              </select>
            </div>

            {/* Sentiment Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sentiment:</span>
              <select
                value={sentiment}
                onChange={(e) => { setSentiment(e.target.value); setPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Sentiments</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="confidence">AI Confidence</option>
            </select>
          </div>

        </div>

        {/* Custom Date Range Picker Fields */}
        {datePreset === 'Custom Range' && (
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-semibold text-slate-600">From Date:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
            />
            <span className="font-semibold text-slate-600">To Date:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setPage(1); }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
            />
          </div>
        )}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          title="No matching articles found"
          description={`No news stories matched "${queryParam}". Try clearing active filters or searching another keyword.`}
          actionText="Clear Search"
          onAction={() => {
            setCategory('All');
            setSentiment('All');
            setDatePreset('All Time');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs font-bold text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default SearchResults;
