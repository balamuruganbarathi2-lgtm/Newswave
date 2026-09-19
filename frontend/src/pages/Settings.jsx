import React, { useState } from 'react';
import { Sliders, Cpu, Bell, Shield, Database, RefreshCw, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const [fetchInterval, setFetchInterval] = useState('15');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4" />
          <span>Configuration Panel</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure real-time news collection intervals, API credentials, and NLP parameters.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* News Engine Config */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>News Collection Scheduler</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Automated Fetch Interval (Minutes)
            </label>
            <select
              value={fetchInterval}
              onChange={(e) => setFetchInterval(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="5">Every 5 Minutes (High Frequency)</option>
              <option value="15">Every 15 Minutes (Default Standard)</option>
              <option value="30">Every 30 Minutes</option>
              <option value="60">Every 60 Minutes (Hourly)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Controls how often background scheduler queries RSS feeds and external APIs.
            </p>
          </div>
        </div>

        {/* NLP Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>AI & NLP Engine Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block mb-1">Duplicate Similarity Threshold</span>
              <span className="font-mono font-bold text-slate-900 text-sm">0.72 (Cosine / StringSimilarity)</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block mb-1">Sentiment Engine</span>
              <span className="font-mono font-bold text-slate-900 text-sm">VADER & Lexicon Normalized</span>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span>Database Status</span>
          </h3>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-500 font-medium">Active Database Engine:</span>
            <span className="font-bold text-slate-900 font-mono">MongoDB (Mongoose ORM)</span>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          Save Configuration
        </button>

      </form>
    </div>
  );
};

export default Settings;
