import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        {/* RESPONSIVE SPINNER 
            Mobile: h-16 w-16
            Desktop (md+): h-24 w-24
        */}
        <div className="relative mx-auto mb-6 h-16 w-16 md:mb-8 md:h-24 md:w-24">
          {/* Static Background Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#d4a643] opacity-20 md:border-8"></div>
          
          {/* Spinning Top Ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#d4a643] md:border-8"></div>
          
          {/* Inner Glow Pulse */}
          <div className="absolute inset-2 animate-pulse rounded-full bg-green-500 opacity-10 md:inset-4"></div>
          
          {/* Radar Ping Effect */}
          <div className="absolute inset-4 animate-ping rounded-full bg-green-400 opacity-20 md:inset-8"></div>
        </div>

        {/* RESPONSIVE TEXT 
            Mobile: text-xl
            Desktop (md+): text-3xl
        */}
        <h2 className="mb-3 text-xl font-bold tracking-tight text-[#d4a643] md:text-3xl">
          Loading
          <span className="inline-block animate-custom-bounce">.</span>
          <span className="inline-block animate-custom-bounce [animation-delay:150ms]">.</span>
          <span className="inline-block animate-custom-bounce [animation-delay:300ms]">.</span>
        </h2>
        
        <p className="mx-auto max-w-[250px] text-sm font-medium text-[#d4a643]/80 md:max-w-none md:text-lg">
          Please wait while we prepare everything for you
        </p>
      </div>

      {/* Embedded Styles for Animations */}
      <style>{`
        @keyframes custom-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-custom-bounce {
          animation: custom-bounce 1.2s infinite ease-in-out;
        }

        /* Adjust bounce height for larger screens */
        @media (min-width: 768px) {
          @keyframes custom-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        }

        /* Ensure smooth spinning */
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;