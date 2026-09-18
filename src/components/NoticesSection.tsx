import React, { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  FileText,
  Download,
  Pin,
  ExternalLink,
  Calendar,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { Notice } from '../types';
import { NoticeDetailModal } from './NoticeDetailModal';

interface NoticesSectionProps {
  notices: Notice[];
  onOpenAdmin: () => void;
  onSelectNotice?: (notice: Notice) => void;
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({
  notices,
  onOpenAdmin,
  onSelectNotice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  const categories = ['All', 'Academic', 'Student Issues', 'Events', 'Activities', 'General'];

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort pinned notices first
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Student Issues':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Events':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Activities':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <section id="notices" className="py-16 sm:py-20 bg-stone-50 text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
              <span>Campus Announcements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
              Digital Notice Board
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Stay updated with the latest Calcutta University announcements, student memorandums, scholarship camps, and unit bulletins.
            </p>
          </div>

          <button
            onClick={onOpenAdmin}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:border-orange-300 bg-orange-50 transition-colors shrink-0 self-start md:self-auto"
          >
            + Post Notice (Admin)
          </button>
        </div>

        {/* Filter Toolbar & Search */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm mb-8 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Notices Cards List */}
        {sortedNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNotices.map((notice) => (
              <div
                key={notice.id}
                className={`group bg-white rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  notice.isPinned
                    ? 'border-orange-300 shadow-md ring-1 ring-orange-200'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Category & Pin Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryBadgeClass(
                        notice.category
                      )}`}
                    >
                      {notice.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {notice.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          <Pin className="w-3 h-3 text-orange-600 fill-orange-600" /> Pinned
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {notice.date}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-base font-display leading-snug group-hover:text-orange-600 transition-colors">
                    {notice.title}
                  </h3>

                  {/* Short description */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {notice.description}
                  </p>
                </div>

                {/* Card Footer: Read More & Attachment */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  {notice.attachmentName ? (
                    <button
                      onClick={() => setActiveNotice(notice)}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-orange-600 transition-colors"
                      title={notice.attachmentName}
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-500" />
                      <span className="truncate max-w-[120px] font-medium text-[11px]">
                        {notice.attachmentName}
                      </span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">General Bulletin</span>
                  )}

                  <button
                    onClick={() => setActiveNotice(notice)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 group/btn"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-stone-300 p-8">
            <Bell className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-slate-600 font-medium text-sm">No notices match your current criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-semibold text-orange-600 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Notice Detail Lightbox Modal */}
      <NoticeDetailModal
        notice={activeNotice}
        onClose={() => setActiveNotice(null)}
      />
    </section>
  );
};
