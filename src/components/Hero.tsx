import React from 'react';
import {
  ArrowRight,
  LifeBuoy,
  Phone,
  Sparkles,
  Calendar,
  Award,
  Users,
  CheckCircle2,
  BookOpen,
  HeartHandshake,
  AlertTriangle,
  IdCard,
} from 'lucide-react';
import { UnitSettings } from '../types';
import { AbvpLogo } from './AbvpLogo';

interface HeroProps {
  settings: UnitSettings;
  onOpenSearch?: () => void;
  onOpenTracker?: () => void;
  onOpenMembership?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenSearch,
  onOpenTracker,
  onOpenMembership,
}) => {
  const statItems = [
    {
      label: 'Campus Activities',
      value: `${settings.stats.activitiesCount}+`,
      subtext: 'Welfare & Academic Drives',
      icon: Sparkles,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Events & Seminars',
      value: `${settings.stats.eventsCount}+`,
      subtext: 'Conclaves & Blood Donation',
      icon: Calendar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      label: 'Student Initiatives',
      value: `${settings.stats.initiativesCount}+`,
      subtext: 'Representations & Memorandums',
      icon: Award,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Years on Campus',
      value: `${settings.stats.yearsOfService}+`,
      subtext: 'Dedicated Service to NDC',
      icon: Users,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10 border-sky-500/20',
    },
  ];

  return (
    <section id="home" className="relative bg-slate-950 text-white overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800">
      {/* Subtle Background Pattern & Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Watermark Saffron/Navy Geometric Lines */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading, Tagline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Unit Identity Badge with Official Logo */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-amber-400 shadow-md backdrop-blur-sm">
              <AbvpLogo size="sm" showText={false} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>অখিল ভারতীয় বিদ্যার্থী পরিষদ • NDC Unit Howrah</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.12]">
              <span className="block text-slate-100 font-normal text-xl sm:text-2xl md:text-3xl mb-1 tracking-wide">
                Akhil Bharatiya Vidyarthi Parishad
              </span>
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">
                Narasinha Dutt College Unit
              </span>
            </h1>

            {/* Tagline */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-slate-300 font-semibold text-base sm:text-lg">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-md">
                জ্ঞান
              </span>
              <span className="text-slate-600">•</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 text-white rounded-md">
                চরিত্র
              </span>
              <span className="text-slate-600">•</span>
              <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded-md">
                একতা
              </span>
              <span className="text-xs text-slate-400 font-normal italic w-full sm:w-auto mt-1 sm:mt-0">
                (Students • Service • Nation)
              </span>
            </div>

            {/* Introductory Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Empowering students of Narasinha Dutt College with timely academic guidance, scholarship support, campus welfare advocacy, and meaningful community service. We stand with every student from admission to convocation.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-btn-membership"
                type="button"
                onClick={() => {
                  if (onOpenMembership) {
                    onOpenMembership();
                  } else {
                    const el = document.getElementById('membership');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 group ring-2 ring-amber-400/40 cursor-pointer"
              >
                <IdCard className="w-4 h-4 text-amber-200" />
                <span>Join ABVP (₹5)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                id="hero-btn-helpdesk"
                href="#helpdesk"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-semibold text-sm border border-slate-800 hover:border-amber-500/40 shadow-sm transition-all flex items-center gap-2"
              >
                <LifeBuoy className="w-4 h-4 text-orange-500" />
                <span>Student Help Desk</span>
              </a>

              <a
                id="hero-btn-activities"
                href="#activities"
                className="px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/60 font-medium text-sm transition-colors flex items-center gap-2"
              >
                <span>Activities</span>
              </a>
            </div>

            {/* Quick Highlights / Bullet points */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free Admission Kiosk
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SVMCM & Scholarship Aid
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Grievance Resolution
              </span>
            </div>
          </div>

          {/* Right Column: Visual Feature Showcase / Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Card container */}
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-1 border border-slate-800 shadow-2xl">
                {/* Official Emblem Seal Badge Floating at Top-Right */}
                <div className="absolute -top-4 -right-3 sm:-right-4 z-20 bg-slate-950 p-1.5 rounded-full border border-amber-500/50 shadow-2xl ring-4 ring-orange-500/20 hover:scale-105 transition-transform">
                  <AbvpLogo size="lg" showText={false} />
                </div>

                {/* Visual Image with Saffron/Navy tone */}
                <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden">
                  <img
                    src="https://narasinhaduttcollege.edu.in/ws/wp-content/themes/innereye/images/adm.jpg"
                    alt="ABVP Narasinha Dutt College Unit Activities"
                    className="w-full h-full object-cover brightness-95 contrast-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">Student Welfare & Action</div>
                        <div className="text-slate-400 text-[11px]">Narasinha Dutt College, Belilious Rd</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-medium text-[10px]">
                        Active Unit
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro Action Box below photo */}
                <div className="p-4 space-y-2 bg-slate-950/60 rounded-xl mt-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-slate-200">Got an issue on campus?</span>
                    <a href="#helpdesk" className="text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                      Submit Ticket <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Issues regarding syllabus, college library, examination forms, or fee counters are addressed proactively by our unit volunteers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-Stat Cards */}
        <div className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/90 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                    {stat.value}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Official Institutional Disclaimer Banner */}
        <div className="mt-10 p-3.5 sm:p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-200/90 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300 uppercase text-[11px] tracking-wider block">
              Notice & Institutional Disclaimer:
            </span>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              {settings.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
