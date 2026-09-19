import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleBookmarkApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookmarkButton = ({ articleId, initialBookmarked = false, onToggle }) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in to save bookmark articles');
      return;
    }

    setLoading(true);
    try {
      const { data } = await toggleBookmarkApi(articleId);
      if (data.success) {
        setBookmarked(data.bookmarked);
        if (onToggle) onToggle(data.bookmarked);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${
        bookmarked
          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 ring-1 ring-blue-200'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
      }`}
      title={bookmarked ? 'Remove Bookmark' : 'Save Article'}
      aria-label="Bookmark"
    >
      <Bookmark className={`w-4 h-4 transition-transform active:scale-125 ${bookmarked ? 'fill-blue-600' : ''}`} />
    </button>
  );
};

export default BookmarkButton;
