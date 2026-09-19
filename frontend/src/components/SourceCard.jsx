import React from 'react';
import { ExternalLink, Globe, User, Calendar, Clock, Archive } from 'lucide-react';

const SourceCard = ({ article }) => {
  if (!article) return null;

  const publishedDateStr = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isHistorical = article.externalId && article.externalId.startsWith('hist_');
  const archivedDateStr = isHistorical
    ? new Date(article.createdAt || article.fetchedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const sourceName = article.sourceName || article.source || 'News API';
  const authorName = article.author && article.author !== 'Staff Reporter' && article.author !== 'Reporter' ? article.author : null;
  const targetUrl = article.url || article.articleUrl || article.sourceUrl;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Verified Source Information
          </span>
        </div>
        {isHistorical && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
            <Archive className="w-3 h-3" />
            Archived Article
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        {/* Source Name */}
        <div>
          <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Publisher Source</p>
          <p className="font-extrabold text-sm text-white truncate">{sourceName}</p>
        </div>

        {/* Author */}
        <div>
          <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Author</p>
          <div className="flex items-center gap-1 font-semibold text-slate-200 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{authorName || 'Not specified'}</span>
          </div>
        </div>

        {/* Published Date */}
        <div>
          <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Published Date</p>
          <div className="flex items-center gap-1 font-semibold text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{publishedDateStr}</span>
          </div>
        </div>

        {/* Reading Time or Archived */}
        <div>
          <p className="text-[11px] text-slate-400 font-semibold mb-0.5">
            {isHistorical ? 'Archived On' : 'Reading Duration'}
          </p>
          <div className="flex items-center gap-1 font-semibold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{isHistorical && archivedDateStr ? archivedDateStr : `${article.readingTime || 3} min read`}</span>
          </div>
        </div>
      </div>

      {/* Direct Publisher Button */}
      <div className="pt-2 flex items-center justify-between">
        <p className="text-[11px] text-slate-400 hidden sm:block">
          Original report published on <strong className="text-slate-200">{sourceName}</strong>
        </p>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/30"
        >
          <span>Read Full Story on {sourceName}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default SourceCard;
