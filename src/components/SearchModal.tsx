import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Bell,
  Calendar,
  Sparkles,
  FileText,
  Users,
  ArrowRight,
  Tag,
} from 'lucide-react';
import {
  Notice,
  UnitEvent,
  TeamMember,
  ActivityItem,
  DownloadDocument,
} from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: Notice[];
  events: UnitEvent[];
  team: TeamMember[];
  activities: ActivityItem[];
  downloads: DownloadDocument[];
  onSelectNotice?: (notice: Notice) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  notices,
  events,
  team,
  activities,
  downloads,
  onSelectNotice,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingNotices = q
    ? notices.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      )
    : [];

  const matchingEvents = q
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
      )
    : [];

  const matchingTeam = q
    ? team.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q)
      )
    : [];

  const matchingActivities = q
    ? activities.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    : [];

  const matchingDocs = q
    ? downloads.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchingNotices.length +
    matchingEvents.length +
    matchingTeam.length +
    matchingActivities.length +
    matchingDocs.length;

  const handleNavigate = (hash: string) => {
    onClose();
    window.location.hash = hash;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 bg-slate-950 text-white flex items-center gap-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notices, events, team members, activities, documents..."
            className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-stone-100">
          {!q ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Search className="w-8 h-8 text-stone-300 mx-auto" />
              <p>Type to search across the entire college unit platform.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-[11px] text-slate-500">Try searching:</span>
                {['Scholarship', 'Blood Donation', 'Library', 'Admission', 'Syllabus'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-[11px] font-medium border border-stone-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No results found for "<span className="font-semibold text-slate-800">{query}</span>". Try another search term.
            </div>
          ) : (
            <>
              {/* Notices */}
              {matchingNotices.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-2">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Notices ({matchingNotices.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingNotices.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (onSelectNotice) onSelectNotice(n);
                          handleNavigate('notices');
                        }}
                        className="p-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-xs group-hover:text-orange-600">
                            {n.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{n.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {matchingEvents.length > 0 && (
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Events ({matchingEvents.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingEvents.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => handleNavigate('events')}
                        className="p-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-xs group-hover:text-purple-600">
                            {e.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {e.date} • {e.venue}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {matchingActivities.length > 0 && (
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Activities & Campaigns ({matchingActivities.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingActivities.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => handleNavigate('activities')}
                        className="p-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-xs group-hover:text-amber-600">
                            {a.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{a.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {matchingDocs.length > 0 && (
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Downloads & Forms ({matchingDocs.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingDocs.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleNavigate('downloads')}
                        className="p-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-xs group-hover:text-blue-600">
                            {d.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {d.category} • {d.fileType} ({d.fileSize})
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members */}
              {matchingTeam.length > 0 && (
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Team Members ({matchingTeam.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingTeam.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleNavigate('team')}
                        className="p-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-xs group-hover:text-emerald-600">
                            {m.name} – {m.role}
                          </div>
                          <div className="text-[11px] text-slate-500">{m.department}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-slate-500 text-[11px] flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>{totalResults} items matching</span>
        </div>
      </div>
    </div>
  );
};
