import React, { useState } from 'react';
import {
  Download,
  FileText,
  Search,
  CheckCircle,
  FileCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DownloadDocument } from '../types';

interface DownloadsSectionProps {
  downloads: DownloadDocument[];
  onOpenAdmin: () => void;
}

export const DownloadsSection: React.FC<DownloadsSectionProps> = ({
  downloads,
  onOpenAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Scholarships', 'Guidelines', 'Forms', 'Academic', 'Reports'];

  const filteredDocs = downloads.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (doc: DownloadDocument) => {
    alert(`Starting download for: ${doc.title} (${doc.fileSize} ${doc.fileType})`);
  };

  return (
    <section id="downloads" className="py-16 sm:py-20 bg-stone-50 text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Student Resources & Forms</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
              Documents & Downloads
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Access university academic calendars, anti-ragging affidavit forms, scholarship guidelines, and unit memorandums.
            </p>
          </div>

          <button
            onClick={onOpenAdmin}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:border-orange-300 bg-orange-50 transition-colors shrink-0 self-start md:self-auto"
          >
            + Upload Document (Admin)
          </button>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm mb-8 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white rounded-xl p-5 border border-stone-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-slate-700">
                    {doc.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-display leading-snug group-hover:text-orange-600 transition-colors">
                  {doc.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 font-medium">
                  <span>{doc.fileType} • {doc.fileSize}</span>
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-orange-600 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
