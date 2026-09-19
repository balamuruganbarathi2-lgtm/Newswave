import React, { useState, useEffect } from 'react';
import { getNewsApi, deleteArticleApi, importHistoricalNewsApi } from '../services/api';
import SentimentBadge from '../components/SentimentBadge';
import { Search, Trash2, Calendar, Download, RefreshCw, CheckCircle2, AlertCircle, Newspaper, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageNews = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Historical Import State (Requirement 9)
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-31');
  const [importCategory, setImportCategory] = useState('Technology');
  const [importKeyword, setImportKeyword] = useState('');
  const [importingStatus, setImportingStatus] = useState(''); // 'Fetching...', 'Processing...', 'Saving...', 'Completed'
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState('');

  const fetchAdminArticles = async () => {
    setLoading(true);
    try {
      const { data } = await getNewsApi({
        search,
        category: category === 'All' ? '' : category,
        page,
        limit: 15,
      });

      if (data.success) {
        setArticles(data.articles);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Error fetching admin news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminArticles();
  }, [search, category, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const { data } = await deleteArticleApi(id);
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a._id !== id));
        setTotal((t) => Math.max(0, t - 1));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting article');
    }
  };

  const handleHistoricalImport = async (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      setImportError('Please select both From Date and To Date');
      return;
    }

    setImportError('');
    setImportResult(null);

    // Interactive Status Progression
    setImportingStatus('Fetching...');
    setTimeout(() => setImportingStatus('Processing...'), 1200);
    setTimeout(() => setImportingStatus('Saving...'), 2400);

    try {
      const { data } = await importHistoricalNewsApi({
        from: fromDate,
        to: toDate,
        category: importCategory,
        search: importKeyword,
      });

      if (data.success) {
        setImportingStatus('Completed');
        setImportResult(data.result);
        fetchAdminArticles();
      }
    } catch (err) {
      setImportingStatus('');
      setImportError(err.response?.data?.message || 'Failed to import historical news');
    }
  };

  const totalPages = Math.ceil(total / 15) || 1;

  return (
    <div className="space-y-8">
      
      {/* Admin Historical Import Tool Card (Requirement 9) */}
      <div className="bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 text-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-4 h-4" />
          <span>Admin Historical Import Engine</span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight mb-1">Import Historical News Archive</h2>
        <p className="text-xs text-slate-400 max-w-2xl mb-6">
          Query News API `/v2/everything` or RSS archives for a specified historical date range and import articles into MongoDB Atlas.
        </p>

        <form onSubmit={handleHistoricalImport} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={importCategory}
                onChange={(e) => setImportCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
              >
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Search Keyword (Optional)</label>
              <input
                type="text"
                value={importKeyword}
                onChange={(e) => setImportKeyword(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={!!importingStatus && importingStatus !== 'Completed'}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${importingStatus && importingStatus !== 'Completed' ? 'animate-bounce' : ''}`} />
              <span>{importingStatus ? importingStatus : 'Import Historical News'}</span>
            </button>

            {importingStatus && (
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-3 py-1.5 rounded-xl border border-blue-800/60">
                Status: {importingStatus}
              </span>
            )}
          </div>
        </form>

        {/* Error Alert */}
        {importError && (
          <div className="mt-4 p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-medium rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Summary Output Result (Requirement 9) */}
        {importResult && (
          <div className="mt-6 bg-slate-800/80 border border-slate-700 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Fetched</span>
              <span className="font-mono text-lg font-bold text-white">{importResult.fetched}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Inserted</span>
              <span className="font-mono text-lg font-bold text-emerald-400">{importResult.inserted}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Duplicates Skipped</span>
              <span className="font-mono text-lg font-bold text-amber-400">{importResult.duplicates}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Date Range</span>
              <span className="font-mono text-xs font-bold text-blue-300">{importResult.dateRange?.from} to {importResult.dateRange?.to}</span>
            </div>
          </div>
        )}
      </div>

      {/* Header & Table Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" />
            <span>Admin Corpus Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Stored Articles</h1>
          <p className="text-xs text-slate-500 mt-0.5">Total {total} news articles in MongoDB Atlas repository.</p>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Filter title or source..."
              className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
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
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Headline & Source</th>
                <th className="p-4">Category</th>
                <th className="p-4">Sentiment</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">Loading articles data...</td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No matching articles found.</td>
                </tr>
              ) : (
                articles.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 max-w-xs sm:max-w-md">
                      <Link to={`/news/${item._id}`} className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1">
                        {item.title}
                      </Link>
                      <span className="text-[11px] text-slate-400">{item.sourceName}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{item.category}</td>
                    <td className="p-4">
                      <SentimentBadge sentiment={item.sentiment} score={item.sentimentScore} />
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-slate-100 rounded-lg font-semibold text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-bold text-slate-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-slate-100 rounded-lg font-semibold text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageNews;
