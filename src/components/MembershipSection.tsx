import React, { useState } from 'react';
import {
  IdCard,
  QrCode,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Download,
  Search,
  IndianRupee,
  FileCheck2,
  UserCheck,
  Printer,
  Sparkles,
  ArrowRight,
  Eye,
  X,
} from 'lucide-react';
import { MembershipApplication, UnitSettings } from '../types';
import { storageService } from '../services/storageService';
import { AbvpLogo } from './AbvpLogo';

interface MembershipSectionProps {
  onOpenAdmin?: () => void;
  onOpenMembershipModal?: () => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  onOpenAdmin,
  onOpenMembershipModal,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [semester, setSemester] = useState('1st Semester');
  const [stream, setStream] = useState('B.A. Honours');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');

  // Post-submission state
  const [submittedCard, setSubmittedCard] = useState<MembershipApplication | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Search existing membership card
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<MembershipApplication | null | 'not_found'>(null);

  const semesters = [
    '1st Semester (1st Year)',
    '2nd Semester (1st Year)',
    '3rd Semester (2nd Year)',
    '4th Semester (2nd Year)',
    '5th Semester (3rd Year)',
    '6th Semester (3rd Year)',
    '7th Semester (4th Year)',
    '8th Semester (4th Year)',
    'Post-Graduate (M.A./M.Sc.)',
  ];

  const streams = [
    'B.A. Honours (Bengali, English, History, Pol Science, Sanskrit, Philosophy)',
    'B.A. General (Arts Stream)',
    'B.Sc. Honours (Physics, Chemistry, Mathematics, Botany, Zoology, Computer Science)',
    'B.Sc. General (Science Stream)',
    'B.Com. Honours (Accounting & Finance)',
    'B.Com. General',
    'Post-Graduate / Other',
  ];

  const [settings, setSettings] = useState<UnitSettings>(() => storageService.getSettings());
  const [viewingQrModal, setViewingQrModal] = useState(false);

  React.useEffect(() => {
    const handleUpdate = () => {
      setSettings(storageService.getSettings());
    };
    window.addEventListener('abvp_data_updated', handleUpdate);
    return () => window.removeEventListener('abvp_data_updated', handleUpdate);
  }, []);

  const upiId = settings.upiId || 'abvpndc.howrah@upi';
  const qrCodeUrl = settings.paymentQrUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setScreenshotPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in Name, Phone, and Address.');
      return;
    }

    if (!screenshotPreview) {
      alert('Please upload a screenshot of your ₹5 UPI payment confirmation.');
      return;
    }

    const created = storageService.submitMembership({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      semester,
      stream,
      paymentScreenshotUrl: screenshotPreview,
    });

    setSubmittedCard(created);
  };

  const handleSearchCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;
    const all = storageService.getMemberships();
    const query = searchPhone.trim().toLowerCase();
    const found = all.find(
      (m) =>
        m.phone.includes(query) ||
        m.membershipId.toLowerCase() === query ||
        m.name.toLowerCase().includes(query)
    );
    setSearchResult(found || 'not_found');
  };

  const resetForm = () => {
    setSubmittedCard(null);
    setName('');
    setPhone('');
    setAddress('');
    setScreenshotPreview('');
    setScreenshotName('');
  };

  return (
    <section id="membership" className="py-16 sm:py-20 bg-stone-100 text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <IdCard className="w-4 h-4 text-orange-600" />
            <span>Official Membership Drive 2026–27</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
            Join ABVP – Narasinha Dutt College Unit
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Become a part of the world’s largest nationalist student movement. Contribute just <span className="font-bold text-orange-600">₹5 annual membership fee</span>, get your digital membership slip, and join campus welfare initiatives!
          </p>

          {onOpenMembershipModal && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={onOpenMembershipModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md hover:shadow-orange-600/25 transition-all"
              >
                <IdCard className="w-4 h-4 text-amber-200" />
                <span>Open Registration Form in Pop-up Modal</span>
              </button>
            </div>
          )}
        </div>

        {/* Card View if submitted or lookup */}
        {submittedCard ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border-2 border-orange-400 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                Membership Registered
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                Welcome to the Parishad, {submittedCard.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Your ₹5 annual membership contribution has been logged. Save your digital membership receipt below.
              </p>
            </div>

            {/* Official Digital Membership Card Preview */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-stone-900 text-white p-6 border-2 border-amber-400/80 shadow-2xl space-y-5">
              {/* Decorative Watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <AbvpLogo size="xl" showText={false} />
              </div>

              {/* Card Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <AbvpLogo size="sm" showText={true} />
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    Session 2026–27
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    Paid ₹5 (Verified)
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Student Member:</span>
                  <div className="text-base font-bold text-white font-display mt-0.5">
                    {submittedCard.name}
                  </div>
                  <div className="text-slate-300 mt-1 font-mono text-[11px]">
                    Phone: {submittedCard.phone}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Membership ID:</span>
                  <div className="text-sm font-mono font-black text-amber-400 mt-0.5 tracking-wider">
                    {submittedCard.membershipId}
                  </div>
                  <div className="text-slate-300 mt-1 text-[11px]">
                    Semester: {submittedCard.semester}
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-400">Stream / Dept: </span>
                    <span className="font-semibold text-white">{submittedCard.stream}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Address: </span>
                    <span>{submittedCard.address}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Motto */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-amber-300/90 font-semibold">
                <span>ज्ञान • शील • एकता</span>
                <span>Narasinha Dutt College Unit, Howrah</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Card</span>
              </button>
              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-slate-700 font-semibold text-xs border border-stone-300 transition-colors"
              >
                Enroll Another Student
              </button>
            </div>
          </div>
        ) : (
          /* 2-Column Membership Layout: Left = UPI Payment Guide, Right = Membership Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: QR Code & UPI Payment Instructions */}
            <div className="lg:col-span-5 space-y-6">
              {/* Payment Box */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900">
                    <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base font-display">Step 1: Pay ₹5 via UPI</h3>
                      <p className="text-xs text-slate-500">Official unit membership contribution</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    ₹5.00
                  </span>
                </div>

                {/* QR Code Card */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col items-center text-center space-y-3">
                  <div className="relative p-2.5 bg-white rounded-xl shadow-md border border-stone-300 group">
                    {qrCodeUrl ? (
                      <div
                        onClick={() => setViewingQrModal(true)}
                        className="w-44 h-44 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 cursor-pointer"
                        title="Click to view full size QR code"
                      >
                        <img
                          src={qrCodeUrl}
                          alt="ABVP NDC ₹5 UPI Payment QR Code"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      /* Stylized Default QR Code Graphic with ABVP Logo Center */
                      <svg viewBox="0 0 160 160" className="w-40 h-40" xmlns="http://www.w3.org/2000/svg">
                        {/* Outer Background */}
                        <rect width="160" height="160" fill="#ffffff" />
                        
                        {/* Corner QR Markers */}
                        <rect x="10" y="10" width="40" height="40" fill="#0f172a" rx="4" />
                        <rect x="16" y="16" width="28" height="28" fill="#ffffff" rx="2" />
                        <rect x="22" y="22" width="16" height="16" fill="#ea580c" rx="2" />

                        <rect x="110" y="10" width="40" height="40" fill="#0f172a" rx="4" />
                        <rect x="116" y="16" width="28" height="28" fill="#ffffff" rx="2" />
                        <rect x="122" y="22" width="16" height="16" fill="#ea580c" rx="2" />

                        <rect x="10" y="110" width="40" height="40" fill="#0f172a" rx="4" />
                        <rect x="16" y="116" width="28" height="28" fill="#ffffff" rx="2" />
                        <rect x="22" y="122" width="16" height="16" fill="#ea580c" rx="2" />

                        {/* QR Pattern Simulation Blocks */}
                        <rect x="58" y="15" width="8" height="8" fill="#0f172a" />
                        <rect x="74" y="15" width="8" height="8" fill="#0f172a" />
                        <rect x="90" y="15" width="8" height="8" fill="#0f172a" />
                        <rect x="58" y="31" width="8" height="8" fill="#0f172a" />
                        <rect x="74" y="31" width="8" height="8" fill="#ea580c" />
                        <rect x="90" y="31" width="8" height="8" fill="#0f172a" />
                        <rect x="58" y="47" width="8" height="8" fill="#0f172a" />
                        <rect x="90" y="47" width="8" height="8" fill="#0f172a" />

                        {/* Middle row blocks */}
                        <rect x="15" y="58" width="8" height="8" fill="#0f172a" />
                        <rect x="31" y="58" width="8" height="8" fill="#0f172a" />
                        <rect x="47" y="58" width="8" height="8" fill="#0f172a" />
                        <rect x="105" y="58" width="8" height="8" fill="#0f172a" />
                        <rect x="121" y="58" width="8" height="8" fill="#ea580c" />
                        <rect x="137" y="58" width="8" height="8" fill="#0f172a" />

                        {/* Center Brand Badge */}
                        <circle cx="80" cy="80" r="22" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                        <text x="80" y="84" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ABVP ₹5</text>

                        {/* Bottom row blocks */}
                        <rect x="58" y="105" width="8" height="8" fill="#0f172a" />
                        <rect x="74" y="105" width="8" height="8" fill="#ea580c" />
                        <rect x="90" y="105" width="8" height="8" fill="#0f172a" />
                        <rect x="58" y="121" width="8" height="8" fill="#0f172a" />
                        <rect x="90" y="121" width="8" height="8" fill="#0f172a" />
                        <rect x="105" y="121" width="8" height="8" fill="#0f172a" />
                        <rect x="121" y="121" width="8" height="8" fill="#0f172a" />
                        <rect x="137" y="121" width="8" height="8" fill="#ea580c" />
                        <rect x="105" y="137" width="8" height="8" fill="#0f172a" />
                        <rect x="137" y="137" width="8" height="8" fill="#0f172a" />
                      </svg>
                    )}

                    <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                      <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold shadow">
                        Scan with GPay / PhonePe / Paytm
                      </span>
                    </div>
                  </div>

                  {qrCodeUrl && (
                    <button
                      type="button"
                      onClick={() => setViewingQrModal(true)}
                      className="text-[11px] text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 mt-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Click to view full size</span>
                    </button>
                  )}

                  <p className="text-[11px] text-slate-500 pt-1 max-w-xs">
                    Scan above or transfer ₹5 to unit UPI ID, take a screenshot of the successful transaction screen, and attach it in the form.
                  </p>

                  {/* UPI ID Pill */}
                  <div className="w-full flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Official UPI ID:</span>
                      <span className="font-mono font-bold text-slate-900">{upiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-2 pt-1 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Member Privileges & Opportunities:</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-[11px]">
                    <li>Priority access to Student Help Desk assistance & university form fill-up guidance.</li>
                    <li>Eligibility to participate in state & national student conferences and seminars.</li>
                    <li>Leadership opportunities in college study circles, social camps & sports tournaments.</li>
                    <li>Digital Membership ID Card and verifiable collegiate unit enrollment.</li>
                  </ul>
                </div>
              </div>

              {/* Search Card Box */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Search className="w-4 h-4 text-orange-600" />
                  <span>Already Registered? Find Your Membership Card</span>
                </div>
                <form onSubmit={handleSearchCard} className="flex gap-2">
                  <input
                    type="text"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    placeholder="Enter phone or Membership ID..."
                    className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-950 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Lookup
                  </button>
                </form>

                {searchResult === 'not_found' && (
                  <p className="text-[11px] text-red-600">
                    No matching membership record found. Please verify your phone number or submit a fresh enrollment below.
                  </p>
                )}

                {searchResult && searchResult !== 'not_found' && (
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs space-y-2">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{searchResult.name}</span>
                      <span className="font-mono text-orange-700">{searchResult.membershipId}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {searchResult.stream} • {searchResult.semester}
                    </div>
                    <button
                      onClick={() => setSubmittedCard(searchResult)}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <span>View Full Digital Card</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Step 2 Membership Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-md">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg font-display">
                      Step 2: Student Enrollment Form
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your academic information and attach the ₹5 payment screenshot.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                    Fee: ₹5
                  </span>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Subhankar Ghosh"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98300 XXXXX"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Semester (sem) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Semester (Sem) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                    >
                      {semesters.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stream / Department (strime) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stream / Course / Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                  >
                    {streams.map((str) => (
                      <option key={str} value={str}>
                        {str}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., 24/B, Panchanantala Road, Kadamtala, Howrah - 711101"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none resize-y"
                  />
                </div>

                {/* Upload Screenshot of Payment of ₹5 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Screenshot (SS) of Payment of ₹5 <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="mt-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 hover:border-orange-500 rounded-xl bg-stone-50 transition-colors text-center cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    {screenshotPreview ? (
                      <div className="space-y-2 flex flex-col items-center">
                        <img
                          src={screenshotPreview}
                          alt="Payment Confirmation Screenshot"
                          className="h-28 w-auto rounded-lg object-contain border border-stone-300 shadow-sm"
                        />
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Screenshot Uploaded ({screenshotName})</span>
                        </div>
                        <span className="text-[10px] text-slate-500 underline">Click to change image</span>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-semibold text-slate-800">
                          Click to browse or drop payment screenshot here
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Upload clear image showing ₹5 payment status, UTR / Transaction ID
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Submit Membership & Generate Card (₹5)</span>
                  </button>
                </div>

                {/* Privacy & Verifiability */}
                <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-slate-500 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Your details are verified by the ABVP Narasinha Dutt College Unit committee. Digital membership slip is generated immediately.
                  </span>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Full Size QR Code Modal */}
      {viewingQrModal && qrCodeUrl && (
        <div
          onClick={() => setViewingQrModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-stone-200 text-center"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="text-left">
                <h4 className="font-bold text-slate-900 text-sm">Official ₹5 UPI Payment QR</h4>
                <p className="text-[11px] text-slate-500">Scan via GPay / PhonePe / Paytm / BHIM</p>
              </div>
              <button
                onClick={() => setViewingQrModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex justify-center">
              <img
                src={qrCodeUrl}
                alt="ABVP NDC UPI Payment QR Code"
                className="w-64 h-64 object-contain rounded-lg shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-stone-100 p-2.5 rounded-lg text-xs font-mono font-bold text-slate-800 flex items-center justify-between">
              <span>{upiId}</span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-2.5 py-1 bg-white rounded border border-stone-300 font-sans font-semibold text-[11px] hover:bg-stone-50 flex items-center gap-1"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={qrCodeUrl}
                download="ABVP_NDC_UPI_Payment_QR.png"
                className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </a>
              <button
                type="button"
                onClick={() => setViewingQrModal(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
