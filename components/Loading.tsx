export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-white/70 text-lg">Loading...</p>
      </div>
    </div>
  );
} 