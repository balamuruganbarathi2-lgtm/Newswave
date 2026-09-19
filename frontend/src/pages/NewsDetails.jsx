import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getNewsByIdApi } from '../services/api';
import AIInsightCard from '../components/AIInsightCard';
import NewsCard from '../components/NewsCard';
import BookmarkButton from '../components/BookmarkButton';
import SentimentBadge from '../components/SentimentBadge';
import SourceCard from '../components/SourceCard';
import { getCategoryFallbackImage } from '../utils/imageUtils';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  User,
  Eye,
  Share2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Newspaper,
  BookOpen
} from 'lucide-react';

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const { data } = await getNewsByIdApi(id);
        if (data.success) {
          setArticle(data.article);
          setRelatedArticles(data.relatedArticles || []);
        }
      } catch (err) {
        console.error('Error fetching article details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-8">
        <div className="h-6 bg-slate-200 rounded w-24"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
        <div className="h-80 bg-slate-200 rounded-3xl w-full"></div>
        <div className="h-24 bg-slate-200 rounded-3xl w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Article Not Found</h2>
        <p className="text-sm text-slate-500 mb-4">The requested news article could not be located in MongoDB.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fallbackImg = getCategoryFallbackImage(article.category, article.title);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      
      {/* Back Button & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-2">
          <BookmarkButton articleId={article._id} />
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }
            }}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            title="Share Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Article Header & Headline */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
            {article.category}
          </span>
          <SentimentBadge sentiment={article.sentiment} score={article.sentimentScore} />
          <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full">
            {article.sourceName}
          </span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200/60">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {article.readingTime || 3} min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-b border-slate-200/80 py-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <span>Author: {article.author && article.author !== 'Staff Reporter' ? article.author : article.sourceName}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Published: {formattedDate}</span>
          </div>

          {article.viewsCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{article.viewsCount} views</span>
            </div>
          )}
        </div>
      </div>

      {/* Large Hero Article Image */}
      <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm max-h-[460px] bg-slate-100 relative group">
        <img
          src={article.imageUrl || fallbackImg}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = fallbackImg;
          }}
        />
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full">
          Photo via {article.sourceName}
        </div>
      </div>

      {/* Reusable Source Attribution Card */}
      <SourceCard article={article} />

      {/* Section 1: NEWSWAVE AI SUMMARY */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 lg:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              NewsWave AI Summary
            </h3>
          </div>
          <span className="text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200/60">
            Synthesized Report
          </span>
        </div>

        <div className="text-slate-700 text-sm leading-relaxed space-y-3 whitespace-pre-line font-normal">
          {article.summary}
        </div>
      </div>

      {/* Section 2: KEY POINTS */}
      {article.keyPoints && article.keyPoints.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 border-blue-200/60">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-extrabold text-slate-900">
              Key Points & Takeaways
            </h3>
          </div>

          <ul className="space-y-2.5">
            {article.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 leading-snug">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 3: WHAT THIS MEANS / WHY THIS MATTERS */}
      {article.whyItMatters && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 lg:p-8 shadow-sm space-y-3 border border-slate-800">
          <div className="flex items-center gap-2 text-blue-400">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-lg font-extrabold text-white">
              What This Means / Why It Matters
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {article.whyItMatters}
          </p>
        </div>
      )}

      {/* Section 4: AI & NLP INSIGHTS */}
      <AIInsightCard article={article} />

      {/* Section 5: ORIGINAL PUBLISHER FOOTER CALLOUT */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 lg:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start text-blue-400 text-xs font-mono font-bold">
            <Newspaper className="w-4 h-4" />
            <span>ORIGINAL PUBLISHER ATTRIBUTION</span>
          </div>
          <h4 className="text-base font-extrabold text-white">Read complete journalistic report on {article.sourceName}</h4>
          <p className="text-xs text-slate-400 max-w-lg">
            NewsWave strictly respects original journalism copyright. Visit the official publisher website for un-edited articles, video coverage, and original commentary.
          </p>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/30 whitespace-nowrap"
        >
          <span>Read Full Article on {article.sourceName}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Section 6: RELATED NEWS */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900">Related {article.category} Stories</h3>
            <Link to={`/category/${article.category.toLowerCase()}`} className="text-xs font-bold text-blue-600 hover:text-blue-800">
              View All {article.category} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedArticles.map((rel) => (
              <NewsCard key={rel._id} article={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default NewsDetails;
