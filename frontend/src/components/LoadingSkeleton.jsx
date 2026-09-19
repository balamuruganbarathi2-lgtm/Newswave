import React from 'react';

export const NewsCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse flex flex-col justify-between">
    <div>
      <div className="w-full h-44 bg-slate-200 rounded-xl mb-4"></div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 bg-slate-200 rounded-full w-20"></div>
        <div className="h-4 bg-slate-200 rounded-full w-16"></div>
      </div>
      <div className="h-5 bg-slate-200 rounded w-5/6 mb-2"></div>
      <div className="h-5 bg-slate-200 rounded w-4/6 mb-3"></div>
      <div className="h-3.5 bg-slate-100 rounded w-full mb-1"></div>
      <div className="h-3.5 bg-slate-100 rounded w-4/5 mb-4"></div>
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
      <div className="h-3 bg-slate-200 rounded w-24"></div>
      <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
    </div>
  </div>
);

export const FeaturedSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-7 h-72 lg:h-96 bg-slate-200 rounded-xl"></div>
    <div className="lg:col-span-5 flex flex-col justify-between py-2">
      <div>
        <div className="h-6 bg-slate-200 rounded-full w-32 mb-4"></div>
        <div className="h-8 bg-slate-200 rounded w-full mb-3"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-100 rounded w-2/3 mb-6"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-10 bg-slate-200 rounded-xl w-36"></div>
        <div className="h-4 bg-slate-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export default NewsCardSkeleton;
