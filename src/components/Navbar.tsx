import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Search,
  LifeBuoy,
  ShieldCheck,
  SearchCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  IdCard,
  Bell,
  Calendar,
  Users,
  Image as ImageIcon,
  FileDown,
  MessageSquare,
  MapPin,
  Mail,
  Phone,
  HelpCircle,
  BookOpen,
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
  const [openDropdown, setOpenDropdown] = useState<'about' | 'services' | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (menu: 'about' | 'services') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner Alert if active */}
      {settings.bannerAlertActive && settings.heroNotice && (
        <aside
          id="top-announcement-banner"
          aria-label="Campus Announcement"
          className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs py-2 px-3 sm:px-4 shadow-inner relative z-50"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-medium tracking-wide truncate">
              <span className="bg-white text-orange-700 uppercase font-bold text-[10px] px-2 py-0.5 rounded shadow-sm shrink-0 flex items-center gap-1">
                <Bell className="w-2.5 h-2.5" /> Notice
              </span>
              <span className="truncate">{settings.heroNotice}</span>
            </div>
            <a
              href="#notices"
              className="text-white hover:text-amber-100 text-xs font-semibold underline underline-offset-2 shrink-0 flex items-center gap-1"
            >
              <span>View Board</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </aside>
      )}

      {/* Main Sticky Header */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-md shadow-xl border-b border-slate-800 py-2 text-white'
            : 'bg-slate-950 text-white py-3 border-b border-slate-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Logo & Name */}
            <a
              href="#home"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-h-[44px]"
            >
              <AbvpLogo size="md" showText={false} />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors font-display">
                    ABVP
                  </span>
<<<<<<< HEAD
                  <span className="text-xs sm:text-sm font-semibold text-orange-400">
                    Narasinha Dutt College Unit
=======
                  <span className="text-xs sm:text-sm font-bold text-orange-400">
                    NDC Unit
>>>>>>> 089777fb64c240dee92ecbd96f76108184b8ac1c
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide line-clamp-1">
                  Narasimha Datta College • <span className="text-amber-400 italic">জ্ঞান • চরিত্র • একতা</span>
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links (Organized into clean categories) */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-slate-200"
            >
              {/* Direct Link: Home */}
              <a
                href="#home"
                className="px-2.5 py-2 rounded-lg transition-colors hover:text-amber-400 hover:bg-slate-900"
              >
                Home
              </a>

              {/* Direct Link: Notices with indicator */}
              <a
                href="#notices"
                className="px-2.5 py-2 rounded-lg transition-colors hover:text-amber-400 hover:bg-slate-900 flex items-center gap-1.5"
              >
                <span>Notices</span>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              </a>

              {/* Direct Link: Events */}
              <a
                href="#events"
                className="px-2.5 py-2 rounded-lg transition-colors hover:text-amber-400 hover:bg-slate-900"
              >
                Events
              </a>

              {/* Dropdown: About Unit */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
                  className="px-2.5 py-2 rounded-lg transition-colors hover:text-amber-400 hover:bg-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>About Unit</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === 'about' ? 'rotate-180 text-amber-400' : 'text-slate-400'
                    }`}
                  />
                </button>

                {openDropdown === 'about' && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <a
                      href="#about"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <div className="font-semibold">About the Unit</div>
                        <div className="text-[10px] text-slate-400">History & student welfare</div>
                      </div>
                    </a>
                    <a
                      href="#team"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Unit Office Bearers</div>
                        <div className="text-[10px] text-slate-400">Student leadership & team</div>
                      </div>
                    </a>
                    <a
                      href="#activities"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Activities & Campaigns</div>
                        <div className="text-[10px] text-slate-400">Blood donation, rallies</div>
                      </div>
                    </a>
                    <a
                      href="#gallery"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Photo Gallery</div>
                        <div className="text-[10px] text-slate-400">Campus moments & drives</div>
                      </div>
                    </a>
                    <a
                      href="#contact"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Location & Contact</div>
                        <div className="text-[10px] text-slate-400">Campus help desk address</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Dropdown: Student Services */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
                  className="px-2.5 py-2 rounded-lg transition-colors hover:text-amber-400 hover:bg-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Student Desk</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === 'services' ? 'rotate-180 text-amber-400' : 'text-slate-400'
                    }`}
                  />
                </button>

                {openDropdown === 'services' && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <a
                      href="#helpdesk"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <LifeBuoy className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>Student Help Desk</span>
                          <span className="px-1.5 py-0.5 bg-orange-600/30 text-orange-300 rounded text-[9px] font-bold">
                            Free
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">Admissions & exam queries</div>
                      </div>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        onOpenTracker();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <SearchCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Track Submitted Ticket</div>
                        <div className="text-[10px] text-slate-400">Check grievance status</div>
                      </div>
                    </button>

                    <a
                      href="#suggestions"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Anonymous Suggestion Box</div>
                        <div className="text-[10px] text-slate-400">Share constructive feedback</div>
                      </div>
                    </a>

                    <a
                      href="#downloads"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <FileDown className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Question Papers & Forms</div>
                        <div className="text-[10px] text-slate-400">Calcutta Univ downloads</div>
                      </div>
                    </a>

                    <a
                      href="#newsletter-subscription-section"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Newsletter Subscription</div>
                        <div className="text-[10px] text-slate-400">Get campus updates by email</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </nav>

            {/* Action Buttons Right Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Primary Call to Action: Join Membership (₹5) */}
              <button
                id="btn-nav-membership"
                type="button"
                onClick={onOpenMembership}
                title="Join ABVP Student Membership (₹5 per year)"
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md hover:shadow-orange-500/30 transition-all transform active:scale-95 group ring-1 ring-amber-400/50 min-h-[38px]"
              >
                <IdCard className="w-3.5 h-3.5 text-slate-950 group-hover:scale-110 transition-transform shrink-0" />
                <span className="hidden xs:inline sm:inline">Join</span>
                <span>₹5 Drive</span>
              </button>

              {/* Global Search Button */}
              <button
                id="btn-global-search"
                onClick={onOpenSearch}
                title="Search notices, events, documents, team (Ctrl + K)"
                className="p-2 sm:px-2.5 sm:py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs min-h-[38px] min-w-[38px] justify-center"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline text-slate-400 font-normal">Search</span>
                <kbd className="hidden xl:inline bg-slate-900 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-slate-400 font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Student Help Desk Link Button (Desktop & Tablet) */}
              <a
                id="btn-nav-helpdesk"
                href="#helpdesk"
                className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-400 text-xs font-semibold border border-slate-800 hover:border-slate-700 transition-colors min-h-[38px]"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                <span className="hidden md:inline">Help Desk</span>
              </a>

              {/* Admin Portal Trigger */}
              <button
                id="btn-open-admin"
                onClick={onOpenAdmin}
                title={isAdmin ? 'Admin Dashboard (Active)' : 'Unit Admin Login'}
                className={`p-2 rounded-lg border transition-colors flex items-center gap-1 text-xs min-h-[38px] min-w-[38px] justify-center ${
                  isAdmin
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800'
                }`}
                aria-label="Admin Portal"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden xl:inline">{isAdmin ? 'Admin' : 'Login'}</span>
              </button>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen / Sliding Drawer Overlay */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden fixed inset-0 top-[57px] z-50 bg-slate-950/98 backdrop-blur-xl border-t border-slate-800 overflow-y-auto pb-16 animate-in slide-in-from-top-4 duration-200"
          >
            <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
              {/* Highlight Membership Card (Mobile Top) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 border border-orange-500/40 shadow-lg">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                      <IdCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white font-black text-sm">Join ABVP (₹5 Drive)</div>
                      <div className="text-orange-400 text-[11px] font-medium">
                        Instant Digital Membership Card
                      </div>
                    </div>
                  </div>
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full font-mono">
                    ₹5
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    onOpenMembership();
                  }}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs shadow-md active:scale-98 flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <span>Apply Now & Get Digital Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Fast Action Buttons: Track Ticket & Help Desk */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    onOpenTracker();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400 text-xs font-semibold min-h-[44px]"
                >
                  <SearchCheck className="w-4 h-4 text-orange-400" />
                  <span>Track Ticket</span>
                </button>

                <a
                  href="#helpdesk"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-950/50 border border-orange-600/40 text-orange-300 text-xs font-semibold min-h-[44px]"
                >
                  <LifeBuoy className="w-4 h-4 text-orange-400" />
                  <span>Help Desk</span>
                </a>
              </div>

              {/* Category 1: Updates & Programs */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Campus Updates & Notices
                </div>
                <div className="grid grid-cols-1 gap-1">
                  <a
                    href="#home"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">Home Page</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href="#notices"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Notice Board</span>
                      <span className="px-1.5 py-0.5 bg-orange-600/40 text-orange-300 text-[10px] font-bold rounded">
                        Latest
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href="#events"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">Seminars & Events</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href="#activities"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">Campus Activities & Drives</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* Category 2: About Our Unit */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  About the Unit
                </div>
                <div className="grid grid-cols-1 gap-1">
                  <a
                    href="#about"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">About ABVP NDC</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href="#team"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">Unit Office Bearers & Leadership</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href="#gallery"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">Photo & Activity Gallery</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href="#contact"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">Campus Location & Contact Info</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* Category 3: Student Support & Resources */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Student Services
                </div>
                <div className="grid grid-cols-1 gap-1">
                  <a
                    href="#downloads"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">CU Question Papers & Downloads</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href="#suggestions"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">Anonymous Student Suggestion Box</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                  <a
                    href="#newsletter-subscription-section"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-200 hover:text-amber-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors min-h-[44px]"
                  >
                    <span className="font-medium">Campus Newsletter & Alert Bulletin</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* Emergency & Direct Helpline Quick Links */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {settings.socialLinks.whatsapp && (
                    <a
                      href={settings.socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold min-h-[44px]"
                    >
                      <span>WhatsApp Help</span>
                    </a>
                  )}
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold min-h-[44px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Helpline</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 text-amber-400 text-xs font-semibold border border-slate-800 hover:bg-slate-800 min-h-[44px]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAdmin ? 'Open Admin Dashboard' : 'Unit Administrator Login'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
