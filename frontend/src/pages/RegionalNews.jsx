import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getNewsApi } from '../services/api';
import NewsCard from '../components/NewsCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { MapPin, Filter, Calendar, Layers, RefreshCw, ChevronRight } from 'lucide-react';

const SOUTH_INDIA_STATES = [
  { name: 'All South India', slug: 'south-india', isRegion: true },
  { name: 'Tamil Nadu', slug: 'tamil-nadu' },
  { name: 'Kerala', slug: 'kerala' },
  { name: 'Karnataka', slug: 'karnataka' },
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
  { name: 'Telangana', slug: 'telangana' },
  { name: 'Puducherry', slug: 'puducherry' },
];

const CATEGORY_OPTIONS = [
  'All',
  'Politics',
  'Business',
  'Technology',
  'Education',
  'Health',
  'Science',
  'Sports',
  'Entertainment',
  'National',
];

const RegionalNews = ({ mode = 'region' }) => {
  const { regionName, stateSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || 'All';
  const dateRange = searchParams.get('dateRange') || 'all';

  // Format active region & state titles
  let currentRegion = 'India';
  let currentState = 'All';
  let pageTitle = 'India News Hub';
  let pageSubtitle = 'National coverage, policy updates, business, tech & regional developments';

  if (mode === 'state' || stateSlug) {
    const rawState = (stateSlug || '').replace(/-/g, ' ');
    currentState = rawState.replace(/\b\w/g, (c) => c.toUpperCase());
    currentRegion = 'South India';
    pageTitle = `${currentState} News`;
    pageSubtitle = `Real-time verified news and historical coverage for ${currentState}`;
  } else if (regionName && regionName.toLowerCase() === 'south-india') {
    currentRegion = 'South India';
    currentState = 'All';
    pageTitle = 'South India News Portal';
    pageSubtitle = 'Coverage across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana & Puducherry';
  } else {
    currentRegion = 'India';
    currentState = 'All';
    pageTitle = 'India News Portal';
    pageSubtitle = 'National headlines, policy, business, education & regional reports';
  }

  // Compute date filtering bounds
  const computeDateBounds = (rangeKey) => {
    const now = new Date();
    if (rangeKey === 'today') {
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      return { from: from.toISOString() };
    } else if (rangeKey === 'yesterday') {
      const from = new Date(now);
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      const to = new Date(now);
      to.setDate(to.getDate() - 1);
      to.setHours(23, 59, 59, 999);
      return { from: from.toISOString(), to: to.toISOString() };
    } else if (rangeKey === '7days') {
      const from = new Date(now);
      from.setDate(from.getDate() - 7);
      return { from: from.toISOString() };
    } else if (rangeKey === '30days') {
      const from = new Date(now);
      from.setDate(from.getDate() - 30);
      return { from: from.toISOString() };
    }
    return {};
  };

  const fetchRegionalNews = async () => {
    setLoading(true);
    try {
      const dateFilter = computeDateBounds(dateRange);

      const params = {
        page,
        limit: 12,
        region: currentRegion,
        state: currentState !== 'All' ? currentState : undefined,
        category: category !== 'All' ? category : undefined,
        ...dateFilter,
      };

      const { data } = await getNewsApi(params);
      if (data.success) {
        setArticles(data.articles || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching regional news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionalNews();
  }, [regionName, stateSlug, page, category, dateRange]);

  const handleStateClick = (st) => {
    if (st.isRegion) {
      return `/region/south-india`;
    }
    return `/state/${st.slug}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {currentRegion}
              </span>
              {currentState !== 'All' && (
                <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  STATE: {currentState}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {pageSubtitle}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-3 rounded-2xl text-center shrink-0">
            <p className="text-2xl font-black text-blue-400 font-mono">{total}</p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Indexed Articles</p>
          </div>
        </div>

        {/* South India State Filter Tabs (Requirement 3) */}
        {(currentRegion === 'South India' || mode === 'state') && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SOUTH_INDIA_STATES.map((st) => {
              const isActive =
                (st.isRegion && currentState === 'All') ||
                (!st.isRegion && currentState.toLowerCase() === st.name.toLowerCase());
              return (
                <Link
                  key={st.slug}
                  to={handleStateClick(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {st.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Control Bar: Categories & Date Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 font-mono shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Category:
          </span>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                if (cat === 'All') nextParams.delete('category');
                else nextParams.set('category', cat);
                nextParams.set('page', '1');
                setSearchParams(nextParams);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                (cat === 'All' && !searchParams.get('category')) || searchParams.get('category') === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date Filter Bar (Requirement 13) */}
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => {
              const nextParams = new URLSearchParams(searchParams);
              if (e.target.value === 'all') nextParams.delete('dateRange');
              else nextParams.set('dateRange', e.target.value);
              nextParams.set('page', '1');
              setSearchParams(nextParams);
            }}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

      </div>

      {/* Main Grid */}
      {loading ? (
        <LoadingSkeleton count={9} />
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        /* Empty State with Data Quality Rule (Requirement 17) */
        <EmptyState
          title={`No recent articles available for ${currentState !== 'All' ? currentState : currentRegion}`}
          message="No articles matching your selected filters were found in MongoDB. Try switching categories or clearing date filters."
          actionText="Clear Filters"
          onAction={() => setSearchParams({})}
        />
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => {
              const nextParams = new URLSearchParams(searchParams);
              nextParams.set('page', String(page - 1));
              setSearchParams(nextParams);
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs font-semibold text-slate-500 px-3">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => {
              const nextParams = new URLSearchParams(searchParams);
              nextParams.set('page', String(page + 1));
              setSearchParams(nextParams);
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default RegionalNews;
