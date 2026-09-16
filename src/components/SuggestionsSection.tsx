import React, { useState } from 'react';
import {
  MessageSquarePlus,
  Send,
  CheckCircle2,
  Shield,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { StudentSuggestion } from '../types';
import { storageService } from '../services/storageService';

export const SuggestionsSection: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [courseSemester, setCourseSemester] = useState('');
  const [category, setCategory] = useState<StudentSuggestion['category']>('Campus Infrastructure');
  const [suggestion, setSuggestion] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories: StudentSuggestion['category'][] = [
    'Campus Infrastructure',
    'Library & Academics',
    'Cultural & Sports',
    'Canteen & Facilities',
    'General Student Life',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    storageService.submitSuggestion({
      isAnonymous,
      studentName: isAnonymous ? undefined : studentName.trim() || undefined,
      courseSemester: courseSemester.trim() || undefined,
      category,
      suggestion,
      contactInfo: isAnonymous ? undefined : contactInfo.trim() || undefined,
    });

    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setSuggestion('');
    setStudentName('');
    setCourseSemester('');
    setContactInfo('');
    setIsAnonymous(false);
  };

  return (
    <section id="suggestions" className="py-16 sm:py-20 bg-stone-50 text-slate-900 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
            Student Suggestion Box
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Have ideas to improve campus life, library books, canteen prices, or sports facilities? Share constructive proposals with your student representatives.
          </p>
        </div>

        {/* Suggestion Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900">
                Suggestion Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contributing your perspective to make Narasimha Datta College a better campus. Our unit committee reviews all proposals periodically to frame official student memorandums.
              </p>
              <div className="pt-2">
                <button
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  Send Another Suggestion
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Anonymous Toggle */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <EyeOff className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Submit Anonymously</div>
                    <div className="text-[11px] text-slate-500">Your name and contact details will not be recorded</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g., Anirban Roy"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email / Phone (Optional)
                    </label>
                    <input
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="To receive updates on your idea"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course / Stream / Semester
                  </label>
                  <input
                    type="text"
                    value={courseSemester}
                    onChange={(e) => setCourseSemester(e.target.value)}
                    placeholder="e.g., B.Sc. Zoology (Hons), Sem 4"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Suggestion Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StudentSuggestion['category'])}
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Suggestion / Proposal <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Share constructive recommendations on how the college or student amenities can be improved..."
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-orange-600" />
                  <span>Constructive input directly reviewed in unit council meetings.</span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Suggestion</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
