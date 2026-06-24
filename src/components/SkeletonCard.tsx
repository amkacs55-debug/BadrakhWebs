"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-[#0F172A] border border-slate-800/60 rounded-2xl overflow-hidden">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <div className="space-y-2">
          <div className="h-4 shimmer rounded-md w-3/4" />
          <div className="h-3 shimmer rounded-md w-1/2" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 shimmer rounded-md w-14" />
          <div className="h-5 shimmer rounded-md w-16" />
        </div>
        <div className="pt-2 border-t border-slate-800/60">
          <div className="h-6 shimmer rounded-md w-24" />
        </div>
      </div>
    </div>
  );
}
