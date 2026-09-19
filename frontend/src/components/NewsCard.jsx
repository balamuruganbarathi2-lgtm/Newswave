import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import SentimentBadge from './SentimentBadge';
import BookmarkButton from './BookmarkButton';
import { getCategoryFallbackImage } from '../utils/imageUtils';

const NewsCard = ({ article, onBookmarkToggle }) => {
  if (!article) return null;

  const formattedTime = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const fallbackImg = getCategoryFallbackImage(article.category, article.title);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Card Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img
            src={article.imageUrl || fallbackImg}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = fallbackImg;
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              {article.category}
            </span>
            {article.state && article.state !== 'National' && article.state !== 'All' ? (
              <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                {article.state}
              </span>
            ) : article.region === 'South India' ? (
              <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                South India
              </span>
            ) : article.region === 'India' ? (
              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                India
              </span>
            ) : null}
          </div>
          {article.isDuplicate && (
            <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Similar Story
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                {article.sourceName}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <SentimentBadge sentiment={article.sentiment} score={article.sentimentScore} />
            </div>
            <BookmarkButton articleId={article._id} onToggle={onBookmarkToggle} />
          </div>

          <Link to={`/news/${article._id}`}>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {article.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formattedTime}</span>
        </div>

        <div className="flex items-center gap-3">
          {article.viewsCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Eye className="w-3 h-3" />
              {article.viewsCount}
            </span>
          )}
          <Link
            to={`/news/${article._id}`}
            className="font-semibold text-blue-600 hover:text-blue-800 text-xs flex items-center gap-0.5"
          >
            <span>Read</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
