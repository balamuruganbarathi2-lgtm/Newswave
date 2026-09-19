import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategoriesApi } from '../services/api';
import {
  Cpu,
  TrendingUp,
  Trophy,
  HeartPulse,
  FlaskConical,
  Film,
  Globe,
  Leaf,
  Layers,
  ArrowRight
} from 'lucide-react';

const ICON_MAP = {
  technology: Cpu,
  business: TrendingUp,
  sports: Trophy,
  health: HeartPulse,
  science: FlaskConical,
  entertainment: Film,
  world: Globe,
  environment: Leaf,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await getCategoriesApi();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">News Categories</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore news organized into AI-classified domains and channels.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.slug] || Layers;
            return (
              <Link
                key={cat._id || cat.slug}
                to={`/category/${cat.slug}`}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
                      {cat.articleCount || 0} articles
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description || `Latest news stories and analysis for ${cat.name}.`}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Browse Channel</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
