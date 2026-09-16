import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Filter,
  ArrowRight,
  Shield,
  HeartHandshake,
} from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivitiesSectionProps {
  activities: ActivityItem[];
  onOpenAdmin: () => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  activities,
  onOpenAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const categories = ['All', 'Welfare', 'Education', 'Social Service', 'Cultural', 'Awareness', 'Campus'];

  const filteredActivities =
    selectedCategory === 'All'
      ? activities
      : activities.filter((act) => act.category === selectedCategory);

  return (
    <section id="activities" className="py-16 sm:py-20 bg-stone-50 text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Ground Action & Campaigns</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
              Activities & Student Initiatives
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              From free admission assistance and blood donation drives to environmental campaigns and academic seminars across Narasimha Datta College.
            </p>
          </div>

          <button
            onClick={onOpenAdmin}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:border-orange-300 bg-orange-50 transition-colors shrink-0 self-start md:self-auto"
          >
            + Add Activity (Admin)
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="group bg-white rounded-2xl border border-stone-200 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Photo */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                <img
                  src={act.imageUrl}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Category tag */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-950/80 backdrop-blur-sm text-amber-400 border border-slate-800 shadow">
                  {act.category}
                </span>

                <span className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {act.date}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-lg font-display leading-snug group-hover:text-orange-600 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {/* Key Outcomes Checklist */}
                {act.keyOutcomes && act.keyOutcomes.length > 0 && (
                  <div className="pt-3 border-t border-stone-100 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {act.keyOutcomes.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
