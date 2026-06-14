import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Newspaper } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

export default function MiddleHeader() {
  return (
    <div className="bg-bg-main border-b border-border-subtle py-1.5 md:py-3">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-6">
        {/* Mobile: Weather and Date on same line to save space */}
        <div className="w-full flex md:hidden items-center justify-between gap-2 order-1">
          <div className="scale-90 origin-left">
            <WeatherWidget />
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-text-primary uppercase tracking-widest leading-none">
              {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <p className="text-[7px] font-bold text-text-muted leading-none mt-0.5">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* 1. Desktop Weather Widget */}
        <div className="hidden md:flex md:flex-1 justify-start order-1">
          <WeatherWidget />
        </div>

        {/* 2. Center: Logo */}
        <div className="w-full md:flex-1 flex justify-center order-2">
          <Link to="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-brand-red rounded-brand-md flex items-center justify-center shadow-brand-md group-hover:rotate-6 transition-transform relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <Newspaper className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-7 md:h-7 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base md:text-2xl font-black text-text-primary tracking-tighter leading-none whitespace-nowrap">
                  All Bangla <span className="text-brand-red">News Feed</span>
                </span>
                <span className="text-[6px] sm:text-[7px] md:text-[10px] font-bold text-brand-green uppercase tracking-[0.1em] md:tracking-[0.15em] mt-0.5 md:mt-1">
                  Latest Feed & Directory
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* 3. Desktop Date/Time */}
        <div className="hidden md:flex md:flex-1 justify-end order-3">
          <div className="text-right">
            <p className="text-xs font-black text-text-primary uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-[10px] font-bold text-text-muted">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
