import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full flex flex-col relative z-10 border-t border-white/5">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 md:px-12 lg:px-16 lg:py-24">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="flex flex-col gap-3">
            <a href="mailto:hello@sprdlx.com" className="text-gray-300 hover:text-orange-400 transition-colors">
              hello@sprdlx.com
            </a>
            <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/company/super-deluxe-studios/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              LinkedIn
            </a>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-gray-300 hover:text-orange-400 transition-colors font-light"
          >
            Back to top ↑
          </button>
        </div>
        <p className="mt-8 text-[12px] leading-snug text-gray-500">© 2026 SPRDLX. All rights reserved.</p>
      </div>
    </footer>
  );
}
