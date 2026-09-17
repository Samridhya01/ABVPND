import React, { useState } from 'react';
import {
  Users,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  Shield,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { TeamMember } from '../types';

interface TeamSectionProps {
  team: TeamMember[];
  onOpenAdmin: () => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team, onOpenAdmin }) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', ...Array.from(new Set(team.map((m) => m.department)))];

  const filteredMembers =
    selectedDept === 'All'
      ? team
      : team.filter((m) => m.department === selectedDept);

  return (
    <section id="team" className="py-16 sm:py-20 bg-white text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>College Unit Leadership</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
              Unit Office Bearers & Student Conveners
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Dedicated student volunteers coordinating campus welfare, academic inquiries, and activities across Narasinha Dutt College.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:border-orange-300 bg-orange-50 transition-colors shrink-0"
            >
              + Manage Team (Admin)
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        {departments.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs no-scrollbar">
            <span className="text-slate-500 font-medium whitespace-nowrap">Filter Dept:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group bg-stone-50 rounded-2xl p-5 border border-stone-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badge */}
                <div className="relative mb-4">
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
                    <img
                      src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Role pill */}
                  <span className="absolute bottom-3 left-3 bg-slate-950/90 text-amber-400 backdrop-blur-sm text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md border border-slate-800">
                    {member.role}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-bold text-slate-900 text-lg font-display group-hover:text-orange-600 transition-colors">
                  {member.name}
                </h3>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.department}</span>
                </div>

                {member.academicYear && (
                  <div className="mt-1 text-[11px] font-medium text-slate-500">
                    {member.academicYear}
                  </div>
                )}
              </div>

              {/* Contact / Social Links Footer */}
              <div className="mt-5 pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="p-1.5 rounded-md hover:bg-stone-200 text-slate-600 hover:text-orange-600 transition-colors"
                      title={`Call: ${member.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-md hover:bg-stone-200 text-slate-600 hover:text-orange-600 transition-colors"
                      title={`Email: ${member.email}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-stone-200 text-slate-600 hover:text-pink-600 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.facebook && (
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-stone-200 text-slate-600 hover:text-blue-600 transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 italic">
                  NDC Student Volunteer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
