import React from 'react';
import { TrendingUp, ArrowUpRight, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrendingCard = ({ topics = [] }) => {
  const navigate = useNavigate();

  const handleTopicClick = (topicName) => {
    navigate(`/search?q=${encodeURIComponent(topicName)}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
            <Flame className="w-4 h-4 fill-rose-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Trending Topics</h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400">Live NLP</span>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs">
          Loading trending analytics...
        </div>
      ) : (
        <div className="space-y-2.5">
          {topics.slice(0, 5).map((item, index) => (
            <div
              key={item._id || index}
              onClick={() => handleTopicClick(item.topic)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold ${
                  index === 0 ? 'bg-amber-100 text-amber-700' :
                  index === 1 ? 'bg-slate-200 text-slate-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                    {item.topic}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {item.articleCount?.toLocaleString() || 120} articles
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  ↑ {item.trendScore || (10 - index * 0.8).toFixed(1)}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingCard;
