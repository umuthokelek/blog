import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 safe-area-top full-width">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400">
                Blog
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className="nav-link">
              Ana Sayfa
            </Link>
            <Link href="/new-article" className="nav-link">
              Yeni Makale
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              <span className="sr-only">Menüyü aç</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-900/50">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 pt-5 pb-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Menü
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="sr-only">Menüyü kapat</span>
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
                <Link
                  href="/new-article"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Yeni Makale
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 