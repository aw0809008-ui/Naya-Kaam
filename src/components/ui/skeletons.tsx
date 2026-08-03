'use client';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAECE7] shadow-sm animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded-md w-3/4" />
          <div className="h-3 bg-gray-100 rounded-md w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded-md w-full" />
        <div className="h-3 bg-gray-100 rounded-md w-5/6" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded-md w-1/4" />
        <div className="h-8 bg-gray-200 rounded-xl w-24" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EAECE7] shadow-sm animate-pulse space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-24 h-24 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-3 flex-1 w-full">
          <div className="h-5 bg-gray-200 rounded-md w-1/2 mx-auto sm:mx-0" />
          <div className="h-3 bg-gray-100 rounded-md w-1/3 mx-auto sm:mx-0" />
          <div className="h-3 bg-gray-100 rounded-md w-2/3 mx-auto sm:mx-0" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        <div className="h-12 bg-gray-100 rounded-2xl" />
        <div className="h-12 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}
