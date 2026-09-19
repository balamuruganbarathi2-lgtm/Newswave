import React, { useState, useEffect } from 'react';
import { getBookmarksApi } from '../services/api';
import NewsCard from '../components/NewsCard';
import { NewsCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Bookmark, BookmarkX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchUserBookmarks = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await getBookmarksApi();
      if (data.success) {
        setBookmarks(data.bookmarks);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookmarks();
  }, [isAuthenticated]);

  const handleBookmarkToggle = () => {
    fetchUserBookmarks();
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-8 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Sign in to save bookmarks</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          Access your personal reading list across desktop and mobile devices.
        </p>
        <Link to="/login" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20">
          Login to Account
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 fill-blue-600" />
            <span>Saved Reading List</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Bookmarks</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Articles and AI insights saved for offline reading and quick reference.
          </p>
        </div>

        <div className="bg-slate-100 font-mono text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200">
          {bookmarks.length} Saved
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={BookmarkX}
          title="No saved articles yet"
          description="Bookmark an article while browsing to save it to your reading list."
          actionText="Explore Latest News"
          onAction={() => window.location.href = '/'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bm) => (
            <NewsCard
              key={bm._id}
              article={bm.article}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
