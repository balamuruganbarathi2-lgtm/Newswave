import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

const SentimentBadge = ({ sentiment, score, size = 'sm' }) => {
  const getBadgeStyle = () => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Smile className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Positive',
        };
      case 'negative':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <Frown className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Negative',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Meh className="w-3.5 h-3.5 text-slate-500" />,
          label: 'Neutral',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border px-2.5 py-0.5 text-xs ${style.bg}`}
      title={score !== undefined ? `Sentiment Score: ${score}` : undefined}
    >
      {style.icon}
      <span>{style.label}</span>
      {score !== undefined && (
        <span className="opacity-75 font-mono text-[10px]">
          ({score > 0 ? `+${score}` : score})
        </span>
      )}
    </span>
  );
};

export default SentimentBadge;
