import React, { useState } from 'react';
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  Paperclip,
  ShieldCheck,
  SearchCheck,
  Lock,
  FileCheck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { HelpDeskTicket } from '../types';
import { storageService } from '../services/storageService';

interface HelpDeskSectionProps {
  onOpenTracker: (refId?: string) => void;
}

export const HelpDeskSection: React.FC<HelpDeskSectionProps> = ({ onOpenTracker }) => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseSemester, setCourseSemester] = useState('');
  const [category, setCategory] = useState<HelpDeskTicket['category']>('Academic');
  const [description, setDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState<HelpDeskTicket['preferredContact']>('WhatsApp');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [submittedTicket, setSubmittedTicket] = useState<HelpDeskTicket | null>(null);
  const [copied, setCopied] = useState(false);
  const [trackInput, setTrackInput] = useState('');

  const categories: HelpDeskTicket['category'][] = [
    'Academic',
    'Examination',
    'Scholarship',
    'College Administration',
    'Student Facilities',
    'Fees',
    'Hostel/Transport',
    'Other',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || !description.trim()) {
      alert('Please fill all required fields marked with *');
      return;
    }

    const created = storageService.submitTicket({
      studentName,
      email,
      phone,
      courseSemester: courseSemester || 'General Undergraduate',
      category,
      description,
      preferredContact,
      documentName: selectedFile ? selectedFile.name : undefined,
    });

    setSubmittedTicket(created);
  };

  const handleCopyRef = () => {
    if (!submittedTicket) return;
    navigator.clipboard.writeText(submittedTicket.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    setStudentName('');
    setEmail('');
    setPhone('');
    setCourseSemester('');
    setDescription('');
    setSelectedFile(null);
  };

  return (
    <section id="helpdesk" className="py-16 sm:py-20 bg-white text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <LifeBuoy className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>Student Support Cell</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
            Student Help Desk & Grievance Portal
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Facing problems with university registration, marksheet verification, scholarship portal errors, or college infrastructure? Submit your issue below for direct student-level assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form or Success Card */}
          <div className="lg:col-span-8 bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            {submittedTicket ? (
              /* Success State with Reference ID */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    Ticket Generated Successfully
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                    Thank You, {submittedTicket.studentName}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Your issue regarding <span className="font-semibold text-slate-800">“{submittedTicket.category}”</span> has been registered in the unit help desk ledger.
                  </p>
                </div>

                {/* Reference ID Highlight Box */}
                <div className="max-w-md mx-auto p-4 bg-white rounded-xl border-2 border-orange-400 shadow-md">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Your Unique Complaint / Reference ID
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl sm:text-2xl font-mono font-black text-orange-600 tracking-wider">
                      {submittedTicket.referenceId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 transition-colors"
                      title="Copy Reference ID"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Please save this reference number to track verification updates from our student volunteers.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenTracker(submittedTicket.referenceId)}
                    className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <SearchCheck className="w-4 h-4" />
                    <span>Track Ticket Now</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-slate-700 font-semibold text-xs border border-stone-300 transition-colors"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            ) : (
              /* Support Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg font-display">
                    Submit Your Concern / Grievance
                  </h3>
                  <span className="text-xs text-slate-500">Fields marked * are mandatory</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g., Sourav Sen"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp / Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98300 XXXXX"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Course & Semester */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Course & Semester
                    </label>
                    <input
                      type="text"
                      value={courseSemester}
                      onChange={(e) => setCourseSemester(e.target.value)}
                      placeholder="e.g., B.A. History (Hons), Sem 3"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Issue Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as HelpDeskTicket['category'])}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4 pt-1.5 text-xs text-slate-700">
                      {(['WhatsApp', 'Phone Call', 'Email'] as const).map((method) => (
                        <label key={method} className="flex items-center gap-1.5 cursor-pointer font-medium">
                          <input
                            type="radio"
                            name="preferredContact"
                            checked={preferredContact === method}
                            onChange={() => setPreferredContact(method)}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe Your Issue in Detail <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Clearly mention what error or obstacle you are facing, relevant application numbers, department room numbers, or dates..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none resize-y"
                  />
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supporting Document / Screenshot (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-3.5 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-stone-100 transition-colors flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-orange-600" />
                      <span>{selectedFile ? 'Change File' : 'Choose File (PDF/Image)'}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                    {selectedFile && (
                      <span className="text-xs text-slate-600 truncate max-w-xs font-medium">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Help Request & Generate ID</span>
                  </button>
                </div>

                {/* Privacy Notice */}
                <div className="pt-3 border-t border-stone-200/80 flex items-start gap-2.5 text-slate-500 text-[11px] leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-semibold text-slate-700">Privacy Notice:</span> Your phone number and email are kept strictly confidential by unit conveners. Information provided is utilized exclusively to follow up and resolve your student inquiry with college administrative desks.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Track Ticket Box & Quick Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Ticket Tracker Card */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <SearchCheck className="w-5 h-5" />
                <h3 className="font-bold text-base font-display">Already Submitted a Request?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check volunteer action reports and resolution remarks on your earlier grievance.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (trackInput.trim()) onOpenTracker(trackInput);
                }}
                className="space-y-2 pt-1"
              >
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  placeholder="Enter Ref: ABVP-NDC-2026-..."
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <SearchCheck className="w-3.5 h-3.5" />
                  <span>Check Ticket Status</span>
                </button>
              </form>
            </div>

            {/* Help Desk Working Hours & In-Person Kiosk */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-orange-600" />
                Physical Help Desk Location
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                During semester admission and registration seasons, physical help desk canopies are set up by our unit volunteers near the <span className="font-semibold text-slate-800">Narasimha Datta College Main Entrance (Belilious Road)</span>.
              </p>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div><span className="font-semibold text-slate-700">Timings:</span> 10:30 AM – 4:30 PM (College Working Days)</div>
                <div><span className="font-semibold text-slate-700">Services:</span> Form filling assistance, printout guidance, anti-ragging support.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
