import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Creative [#d4a643] Spinner with Pulse Effect */}
        <div className="relative mx-auto mb-8 h-24 w-24">
          <div className="absolute inset-0 rounded-full border-8 border-[#d4a643]"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-8 border-transparent border-t-[#d4a643]"></div>
          <div className="absolute inset-4 animate-pulse rounded-full bg-green-500 opacity-20"></div>
          <div className="absolute inset-8 animate-ping rounded-full bg-green-400 opacity-30"></div>
        </div>

        {/* Professional Text with Subtle Animation */}
        <h2 className="mb-2 text-3xl font-semibold text-[#d4a643]">
          Loading
          <span className="inline-block animate-bounce">.</span>
          <span className="inline-block animate-bounce delay-150">.</span>
          <span className="inline-block animate-bounce delay-300">.</span>
        </h2>
        <p className="text-lg text-[#d4a643]">Please wait while we prepare everything for you</p>
      </div>

      {/* Tailwind Animation Delay Helpers (if not using tailwind-plugin) */}
      <style >{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;