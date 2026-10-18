import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full max-w-4xl mx-auto rounded-3xl bg-slate-900/50 border border-white/10 p-8 shadow-2xl relative overflow-hidden shimmer-mask">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 w-full max-w-md">
            <div className="w-28 h-5 rounded-lg bg-white/10" />
            <div className="w-64 h-10 rounded-xl bg-white/10" />
            <div className="w-48 h-6 rounded-lg bg-white/5" />
            <div className="flex gap-3 pt-2">
              <div className="w-36 h-8 rounded-xl bg-white/10" />
              <div className="w-36 h-8 rounded-xl bg-white/10" />
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end space-y-3">
            <div className="w-44 h-24 rounded-2xl bg-white/10" />
            <div className="w-32 h-6 rounded-lg bg-white/5" />
          </div>
        </div>
      </div>

      {/* Hourly Skeleton */}
      <div className="w-full rounded-3xl bg-slate-900/40 border border-white/10 p-6 relative overflow-hidden shimmer-mask">
        <div className="w-48 h-6 rounded-lg bg-white/10 mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-28 h-36 rounded-2xl bg-white/5 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-slate-900/40 border border-white/10 p-4 relative overflow-hidden shimmer-mask" />
        ))}
      </div>
    </div>
  );
};
