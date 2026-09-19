import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Sparkles } from 'lucide-react';
import SentimentBadge from './SentimentBadge';
import BookmarkButton from './BookmarkButton';
import { getCategoryFallbackImage } from '../utils/imageUtils';

const FeaturedNews = ({ article }) => {
  if (!article) return null;

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fallbackImg = getCategoryFallbackImage(article.category, article.title);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow group mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Cover Image */}
        <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden bg-slate-100">
          <img
            src={article.imageUrl || fallbackImg}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = fallbackImg;
            }}
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Top Story
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <SentimentBadge sentiment={article.sentiment} score={article.sentimentScore} />
                <span className="text-xs font-medium text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">{article.sourceName}</span>
              </div>
              <BookmarkButton articleId={article._id} />
            </div>

            <Link to={`/news/${article._id}`}>
              <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-3 leading-snug mb-3">
                {article.title}
              </h2>
            </Link>

            <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-6">
              {article.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>

            <Link
              to={`/news/${article._id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
            >
              <span>Read Full Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;
