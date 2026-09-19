import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryBySlugApi } from '../services/api';
import NewsCard from '../components/NewsCard';
import { NewsCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryDetails = () => {
  const { slug } = useParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const { data } = await getCategoryBySlugApi(slug, { page, limit: 12 });
        if (data.success) {
          setCategoryInfo(data.category);
          setArticles(data.articles);
          setTotal(data.total);
        }
      } catch (err) {
        console.error('Error loading category articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, page]);

  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/categories" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 capitalize">
            {categoryInfo?.name || slug} News
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {categoryInfo?.description || `Curated news stories and AI insights for ${slug}.`}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-center">
          <span className="text-xs text-blue-600 font-semibold block">Total Articles</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">{total}</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          title={`No articles in ${categoryInfo?.name || slug}`}
          description="Check back shortly as the background news fetcher regularly updates this feed."
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

export default CategoryDetails;
