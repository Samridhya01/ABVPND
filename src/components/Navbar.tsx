import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  LifeBuoy,
  ShieldCheck,
  PhoneCall,
  SearchCheck,
  ChevronRight,
  Sparkles,
  IdCard,
} from 'lucide-react';
import { UnitSettings } from '../types';
import { AbvpLogo } from './AbvpLogo';

interface NavbarProps {
  settings: UnitSettings;
  onOpenSearch: () => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  onOpenMembership: () => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenSearch,
  onOpenTracker,
  onOpenAdmin,
  onOpenMembership,
  isAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Membership (₹5)', href: '#membership', isHighlight: true },
    { label: 'About', href: '#about' },
    { label: 'Notices', href: '#notices' },
    { label: 'Events', href: '#events' },
    { label: 'Activities', href: '#activities' },
    { label: 'Team', href: '#team' },
    { label: 'Help Desk', href: '#helpdesk' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Downloads', href: '#downloads' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Banner Alert if active */}
      {settings.bannerAlertActive && settings.heroNotice && (
        <div id="top-announcement-banner" className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs sm:text-sm py-2 px-4 shadow-inner relative z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-medium tracking-wide truncate">
              <span className="bg-white text-orange-700 uppercase font-bold text-[10px] px-2 py-0.5 rounded shadow-sm shrink-0">
                Notice
              </span>
              <span className="truncate">{settings.heroNotice}</span>
            </div>
            <a
              href="#notices"
              className="text-white hover:text-amber-100 text-xs font-semibold underline underline-offset-2 shrink-0 flex items-center gap-1"
            >
              View Board <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-slate-800 py-2.5 text-white'
            : 'bg-slate-950 text-white py-3.5 border-b border-slate-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <a href="#home" className="flex items-center gap-3 group focus:outline-none">
              <AbvpLogo size="md" showText={false} />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors font-display">
                    ABVP
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-orange-400">
                    Narasinha Dutt College Unit
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">
                  Howrah, West Bengal • <span className="text-amber-400/90 italic font-normal">জ্ঞান • চরিত্র • একতা</span>
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 text-sm font-medium text-slate-200">
              {navLinks.map((link) => {
                if (link.href === '#membership') {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={onOpenMembership}
                      className="px-2.5 py-1.5 rounded-md transition-colors duration-150 text-amber-400 font-bold bg-orange-950/60 border border-orange-500/40 hover:bg-orange-900/60 flex items-center gap-1"
                    >
                      <IdCard className="w-3.5 h-3.5 text-orange-400" />
                      <span>Membership</span>
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 rounded">₹5</span>
                    </button>
                  );
                }
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-2.5 py-1.5 rounded-md transition-colors duration-150 hover:text-amber-400 hover:bg-slate-900"
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Main Navigation 'Membership' Button */}
              <button
                id="btn-nav-membership"
                type="button"
                onClick={onOpenMembership}
                title="Sign up for ABVP Membership (₹5)"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:shadow-orange-500/30 transition-all transform active:scale-95 group ring-1 ring-amber-400/50"
              >
                <IdCard className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>Membership</span>
                <span className="bg-slate-950 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  ₹5
                </span>
              </button>

              {/* Search Button */}
              <button
                id="btn-global-search"
                onClick={onOpenSearch}
                title="Search notices, events, documents, team (Ctrl + K)"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-2 text-xs"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-slate-400 font-normal">Search...</span>
                <kbd className="hidden md:inline bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* Track Complaint / Ticket Status */}
              <button
                id="btn-track-ticket"
                onClick={onOpenTracker}
                title="Track your submitted help request status"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <SearchCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Track Ticket</span>
              </button>

              {/* Student Help Desk CTA */}
              <a
                id="btn-nav-helpdesk"
                href="#helpdesk"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-orange-600/30 transition-all transform active:scale-95"
              >
                <LifeBuoy className="w-3.5 h-3.5 animate-pulse" />
                <span>Help Desk</span>
              </a>

              {/* Admin Portal Trigger */}
              <button
                id="btn-open-admin"
                onClick={onOpenAdmin}
                title={isAdmin ? 'Admin Dashboard (Logged In)' : 'Admin Portal Login'}
                className={`p-2 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
                  isAdmin
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden lg:inline">{isAdmin ? 'Admin' : 'Login'}</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="xl:hidden bg-slate-950 border-t border-slate-800 mt-2 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMembership();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-xs font-black shadow-md active:scale-98"
              >
                <IdCard className="w-4 h-4 text-slate-950" />
                <span>Join ABVP Membership (₹5)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracker();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800 hover:bg-slate-800"
              >
                <SearchCheck className="w-4 h-4 text-orange-400" />
                Track Submitted Complaint / Ticket
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 text-amber-400 text-xs font-semibold border border-slate-800 hover:bg-slate-800"
              >
                <ShieldCheck className="w-4 h-4" />
                {isAdmin ? 'Admin Dashboard (Active)' : 'Unit Admin Sign In'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
