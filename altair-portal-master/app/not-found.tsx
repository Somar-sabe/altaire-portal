import React from 'react';
import Link from 'next/link';

/**
 * @file /app/not-found.tsx
 * @description Default 404 page for the Altair Platform.
 * Resolves Next.js 15 ENOENT errors on internal _not-found route.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative">
          <h1 className="text-9xl font-black text-slate-100 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl font-bold text-slate-800">Page not found</p>
          </div>
        </div>
        
        <p className="text-slate-500 font-medium">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          href="/"
          className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 active:scale-95"
        >
          Return Home please
        </Link>
      </div>
    </div>
  );
}
