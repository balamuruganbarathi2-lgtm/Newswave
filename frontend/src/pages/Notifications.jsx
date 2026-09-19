import React from 'react';
import { Bell, CheckCircle2, Sparkles, AlertCircle, Clock } from 'lucide-react';

const Notifications = () => {
  const notificationsList = [
    {
      id: 1,
      title: 'Automated News Ingestion Completed',
      message: 'Background scheduler fetched 18 new articles across Technology, Business, and Sports feeds.',
      time: '10 minutes ago',
      type: 'NEWS_ALERT',
    },
    {
      id: 2,
      title: 'Trending Topic Surge Detected',
      message: 'NLP frequency calculation flagged "Artificial Intelligence" with +42% query volume.',
      time: '1 hour ago',
      type: 'TRENDING_ALERT',
    },
    {
      id: 3,
      title: 'System Health Verification',
      message: 'MongoDB connection & Express REST APIs operating with zero latency anomalies.',
      time: '3 hours ago',
      type: 'SYSTEM',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Activity Feed</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System logs, automated news ingestion notices, and trending alerts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {notificationsList.map((item) => (
          <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
