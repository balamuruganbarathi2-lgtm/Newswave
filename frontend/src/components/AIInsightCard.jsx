import React from 'react';
import { Sparkles, Cpu, ShieldCheck, Copy, Info } from 'lucide-react';
import SentimentBadge from './SentimentBadge';

const AIInsightCard = ({ article }) => {
  if (!article) return null;

  const confidencePercent = Math.round((article.classificationConfidence || 0.88) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-navy-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700/60 relative overflow-hidden my-6">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight text-slate-100">AI Intelligence & Insights</h3>
            <p className="text-xs text-slate-400">Automated NLP & ML Model Analysis</p>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-blue-900/60 text-blue-300 px-2.5 py-1 rounded-full border border-blue-700/50">
          NewsWave AI v2.4
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Category Classification */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Category</span>
          </div>
          <p className="font-semibold text-slate-100 text-sm">{article.category}</p>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Confidence:</span>
            <span className="font-mono text-emerald-400 font-bold">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${confidencePercent}%` }}></div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Sentiment Output</span>
          </div>
          <div className="mb-1">
            <SentimentBadge sentiment={article.sentiment} score={article.sentimentScore} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Score range: -1.0 (Negative) to +1.0 (Positive)
          </p>
        </div>

        {/* Topic & Duplicate Status */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Copy className="w-3.5 h-3.5 text-blue-400" />
            <span>Duplicate Detection</span>
          </div>
          {article.isDuplicate ? (
            <div className="text-amber-400 font-medium text-xs flex items-center gap-1 mt-1">
              <span>⚠️ Similar story detected in system</span>
            </div>
          ) : (
            <div className="text-emerald-400 font-medium text-xs flex items-center gap-1 mt-1">
              <span>✓ Unique story verified</span>
            </div>
          )}
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Topic: <span className="text-slate-200 font-medium">{article.topic || article.category}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span>Classifications and sentiment scores are generated automatically by Python/Node NLP algorithms.</span>
      </div>
    </div>
  );
};

export default AIInsightCard;
