import React from 'react';
import {
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Compass,
  Award,
  Users,
  Target,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { UnitSettings } from '../types';

interface AboutSectionProps {
  settings: UnitSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const pillars = [
    {
      title: 'Educational & Academic Guidance',
      description:
        'Continuous support for admissions, Calcutta University registration, syllabus doubts, book distribution, and free study assistance for underprivileged students.',
      icon: GraduationCap,
      accent: 'border-amber-500/30 text-amber-600 bg-amber-50',
    },
    {
      title: 'Student Rights & Campus Welfare',
      description:
        'Proactive dialogue with college authorities on library facilities, clean drinking water, canteen hygiene, lab maintenance, and fee transparency.',
      icon: ShieldCheck,
      accent: 'border-orange-500/30 text-orange-600 bg-orange-50',
    },
    {
      title: 'Social Service & Blood Donation',
      description:
        'Regular voluntary blood donation drives in collaboration with local hospital blood banks, thalassemia awareness, cleanliness drives, and disaster relief.',
      icon: HeartHandshake,
      accent: 'border-red-500/30 text-red-600 bg-red-50',
    },
    {
      title: 'Cultural & National Consciousness',
      description:
        'Fostering cultural pride, ethical leadership, seminars on youth icons like Swami Vivekananda, Netaji Subhas Chandra Bose, and national youth sports.',
      icon: Compass,
      accent: 'border-blue-500/30 text-blue-600 bg-blue-50',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-stone-50 text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>About The Organisation & Unit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
            Dedicated to Student Welfare & Nation Building
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Understanding our role at Narasinha Dutt College, Howrah: bridging students with campus administrative solutions, educational enrichment, and community responsibility.
          </p>
        </div>

        {/* Dual Column: ABVP Overview & NDC Unit Role */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mb-14">
          {/* Card 1: What is ABVP */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold font-display shadow-md">
                1949
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                  What is ABVP?
                </h3>
                <p className="text-xs text-orange-600 font-medium">
                  Akhil Bharatiya Vidyarthi Parishad
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Founded on 9th July 1949, Akhil Bharatiya Vidyarthi Parishad is recognized as the world's largest student movement. Built upon the guiding ideals of <span className="font-semibold text-slate-900">“ज्ञान, शील, एकता” (Knowledge, Character, and Unity)</span>, ABVP believes that students are not merely citizens of tomorrow, but energetic stakeholders of today.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike partisan political unions, ABVP champions constructive student activism—directing the boundless potential of the youth towards academic excellence, civic awareness, environmental conservation, and social cohesion across Indian campuses.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-stone-100 text-slate-700 font-medium">Constructive Activism</span>
              <span className="px-2.5 py-1 rounded bg-stone-100 text-slate-700 font-medium">Campus Harmony</span>
              <span className="px-2.5 py-1 rounded bg-stone-100 text-slate-700 font-medium">Democratic Student Representation</span>
            </div>
          </div>

          {/* Card 2: NDC Unit Role */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold font-display shadow-md">
                NDC
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                  Role of Narasinha Dutt College Unit
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Serving Howrah's premier undergraduate institution
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              At Narasinha Dutt College (Belilious Road, Howrah), our college unit functions as an accessible student helpline. We strive to assist thousands of students navigating Calcutta University semester curricula, exam registration, scholarship verifications, and career pathways.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our campus volunteers operate through active dialogue with department teachers, non-teaching staff, and fellow students. We represent student grievances formally, maintain an anti-ragging student watch, and provide round-the-clock guidance through our digital Student Help Desk.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-orange-50 text-orange-700 font-medium border border-orange-200/60">Admission Help Desk</span>
              <span className="px-2.5 py-1 rounded bg-orange-50 text-orange-700 font-medium border border-orange-200/60">SVMCM Guidance</span>
              <span className="px-2.5 py-1 rounded bg-orange-50 text-orange-700 font-medium border border-orange-200/60">Infrastructure Advocacy</span>
            </div>
          </div>
        </div>

        {/* The 4 Core Pillars */}
        <div className="mt-8">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Four Core Pillars of Our Campus Initiatives
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guiding how our college unit organizes events, drives, and student assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${pillar.accent}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-base font-display">
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
