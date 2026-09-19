import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getOverviewStatsApi,
  forceFetchNewsApi
} from '../services/api';
import {
  Shield,
  Newspaper,
  Users,
  Layers,
  Globe,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const { data } = await getOverviewStatsApi();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleForceFetch = async () => {
    setFetching(true);
    setMsg('');
    try {
      const { data } = await forceFetchNewsApi();
      if (data.success) {
        setMsg(`Fetch executed successfully! ${data.result?.newArticlesAdded || 0} articles added.`);
        fetchOverview();
      }
    } catch (err) {
      console.error('Force fetch error:', err);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-blue-400">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">
              ADMIN CONTROL PANEL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage NewsWave database, ingestion feeds & South India state analytics</p>
        </div>

        <button
          onClick={handleForceFetch}
          disabled={fetching}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/30 whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
          <span>{fetching ? 'Syncing Feeds...' : 'Force Live News Sync'}</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Database Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Articles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Articles</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {loading ? '...' : stats?.totalArticles?.toLocaleString() || 0}
          </p>
          <span className="text-[11px] text-slate-400">Stored in MongoDB database</span>
        </div>

        {/* India Articles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">India Articles</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {loading ? '...' : stats?.indiaArticles?.toLocaleString() || 0}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">National & Regional India</span>
        </div>

        {/* South India Articles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">South India Articles</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {loading ? '...' : stats?.southIndiaArticles?.toLocaleString() || 0}
          </p>
          <span className="text-[11px] text-indigo-600 font-semibold">6 South Indian States</span>
        </div>

      </div>

      {/* Regional State Breakdown Card (Requirement 15) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-base">South India State Distribution</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200/60">
            Real-Time MongoDB Counts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">Tamil Nadu</p>
            <p className="text-xl font-black text-blue-600 font-mono">{loading ? '...' : stats?.stateBreakdown?.tamilNadu || 0}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">Kerala</p>
            <p className="text-xl font-black text-emerald-600 font-mono">{loading ? '...' : stats?.stateBreakdown?.kerala || 0}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">Karnataka</p>
            <p className="text-xl font-black text-amber-600 font-mono">{loading ? '...' : stats?.stateBreakdown?.karnataka || 0}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">Andhra Pradesh</p>
            <p className="text-xl font-black text-purple-600 font-mono">{loading ? '...' : stats?.stateBreakdown?.andhraPradesh || 0}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">Telangana</p>
            <p className="text-xl font-black text-rose-600 font-mono">{loading ? '...' : stats?.stateBreakdown?.telangana || 0}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">Puducherry</p>
            <p className="text-xl font-black text-cyan-600 font-mono">{loading ? '...' : stats?.stateBreakdown?.puducherry || 0}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
