import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  IdCard,
  QrCode,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Download,
  Printer,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Phone,
  User,
  MapPin,
  GraduationCap,
  BookOpen,
  IndianRupee,
  ExternalLink,
} from 'lucide-react';
import { MembershipApplication, UnitSettings } from '../types';
import { storageService } from '../services/storageService';
import { AbvpLogo } from './AbvpLogo';
import { compressImage } from '../utils/imageCompressor';

interface MembershipRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (membership: MembershipApplication) => void;
}

export const MembershipRegistrationModal: React.FC<MembershipRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Form input states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [semester, setSemester] = useState('1st Semester');
  const [stream, setStream] = useState('B.A. Honours');
  const [customStream, setCustomStream] = useState('');

  // Screenshot upload states
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // UI interaction states
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCard, setSubmittedCard] = useState<MembershipApplication | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    'Other / Custom Stream',
  ];

  const [settings, setSettings] = useState<UnitSettings>(() => storageService.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(storageService.getSettings());
    };
    window.addEventListener('abvp_data_updated', handleUpdate);
    return () => window.removeEventListener('abvp_data_updated', handleUpdate);
  }, []);

  const upiId = settings.upiId || 'abvpndc.howrah@upi';
  const qrCodeUrl = settings.paymentQrUrl;

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setSemester('1st Semester (1st Year)');
    setStream('B.A. Honours (Bengali, English, History, Pol Science, Sanskrit, Philosophy)');
    setCustomStream('');
    setScreenshotPreview('');
    setScreenshotName('');
    setSubmittedCard(null);
    setFormError(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    setFormError(null);
    setScreenshotName(file.name);

    try {
      const compressedDataUrl = await compressImage(file, 800, 800, 0.75);
      setScreenshotPreview(compressedDataUrl);
    } catch (err) {
      console.error('Failed to compress payment screenshot', err);
      // Fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setScreenshotPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError('Please enter your full name as registered in college.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please provide a valid 10-digit mobile number for WhatsApp communication.');
      return;
    }

    if (!address.trim()) {
      setFormError('Please enter your residential address.');
      return;
    }

    const selectedStreamFinal = stream === 'Other / Custom Stream'
      ? (customStream.trim() || 'Custom Stream')
      : stream;

    if (!screenshotPreview) {
      setFormError('Payment screenshot is required! Please scan the QR code to pay ₹5 and upload the payment proof.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = storageService.submitMembership({
        name: name.trim(),
        phone: cleanPhone,
        address: address.trim(),
        semester: semester.trim(),
        stream: selectedStreamFinal,
        paymentScreenshotUrl: screenshotPreview,
      });

      setSubmittedCard(created);
      if (onSuccess) {
        onSuccess(created);
      }
    } catch (err) {
      console.error('Membership submission failed:', err);
      setFormError('Failed to submit membership application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      id="membership-registration-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="membership-registration-modal-dialog"
        className="relative bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <AbvpLogo size="md" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                  ABVP Membership Registration
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  ₹5 Drive
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Narasinha Dutt College Unit, Howrah • Session 2026-27
              </p>
            </div>
          </div>

          <button
            id="btn-close-membership-modal"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
            aria-label="Close membership modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {submittedCard ? (
            /* Success & Membership Card View */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                    Application Submitted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    Welcome to Akhil Bharatiya Vidyarthi Parishad, Narasinha Dutt College Unit! Your membership card has been generated. The unit committee will verify your ₹5 UPI payment screenshot shortly.
                  </p>
                </div>
              </div>

              {/* Printable Provisional ID Card */}
              <div className="border border-stone-300 rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-stone-900 via-slate-900 to-amber-950 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Top Branding */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 gap-2 relative">
                  <div className="flex items-center gap-2.5">
                    <AbvpLogo size="sm" showText={false} />
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Akhil Bharatiya Vidyarthi Parishad
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Narasinha Dutt College Unit • Howrah
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      PROVISIONAL ID
                    </span>
                  </div>
                </div>

                {/* Card Main Info */}
                <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Student Full Name
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-white font-display">
                        {submittedCard.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Phone Number
                        </span>
                        <span className="font-mono text-slate-200">{submittedCard.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Membership ID
                        </span>
                        <span className="font-mono font-bold text-amber-400">
                          {submittedCard.membershipId}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Semester
                        </span>
                        <span className="text-slate-200">{submittedCard.semester}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Stream / Course
                        </span>
                        <span className="text-slate-200 truncate block" title={submittedCard.stream}>
                          {submittedCard.stream}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Residential Address
                      </span>
                      <span className="text-slate-300 text-[11px] leading-tight block">
                        {submittedCard.address}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <QrCode className="w-20 h-20 text-slate-900" />
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 mt-2">
                      {submittedCard.membershipId}
                    </span>
                    <span className="text-[9px] text-slate-400">Scan for Verification</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                  <span>Fee Paid: ₹5 (UPI Verified)</span>
                  <span className="italic text-amber-400/90 font-medium">छात्र शक्ति – राष्ट्र शक्ति</span>
                  <span>Date: {new Date(submittedCard.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Register Another Student
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-stone-300 shadow-sm transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-bold rounded-xl shadow-md transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Quick Instructions Banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="leading-relaxed">
                  <span className="font-bold text-slate-900">Student Membership Drive 2026-27: </span>
                  Join the nationalist student movement on campus. Fill in your academic details and pay the nominal membership fee of ₹5 to receive your verified digital membership credential.
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Student Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    <span>Student Full Name <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Sourav Mukherjee"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Please provide your name as registered in college admission records.
                  </span>
                </div>

                {/* 2. Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>Phone Number (WhatsApp) <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none font-mono transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Unit notices & membership updates will be sent here.
                  </span>
                </div>

                {/* 3. Semester */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
                    <span>Semester / Year <span className="text-red-500">*</span></span>
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-colors"
                  >
                    {semesters.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Stream / Department */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                    <span>Stream / Department <span className="text-red-500">*</span></span>
                  </label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-colors"
                  >
                    {streams.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  {stream === 'Other / Custom Stream' && (
                    <input
                      type="text"
                      value={customStream}
                      onChange={(e) => setCustomStream(e.target.value)}
                      placeholder="Specify your stream or department..."
                      className="mt-2 w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
                    />
                  )}
                </div>

                {/* 5. Residential Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>Residential Address <span className="text-red-500">*</span></span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., 12/A Netaji Subhash Road, Howrah - 711101"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Your local residence or hostel address in Howrah / Kolkata.
                  </span>
                </div>
              </div>

              {/* 6. Payment Section (₹5 UPI QR & Screenshot Upload) */}
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-stone-50/80 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-bold">
                      ₹
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Membership Fee Payment: <span className="text-orange-600">₹5 Only</span>
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold rounded-full">
                    UPI Accepted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Left: UPI QR & Details */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-3.5 bg-white rounded-xl border border-stone-200 shadow-sm text-center">
                    <div className="p-2 bg-white rounded-lg border border-stone-200 shadow-inner flex items-center justify-center">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="Official ABVP UPI QR Code"
                          className="w-28 h-28 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        /* SVG Dynamic UPI QR Preview */
                        <svg viewBox="0 0 140 140" className="w-28 h-28 text-slate-900">
                          {/* Corner markers */}
                          <rect x="10" y="10" width="35" height="35" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                          <rect x="20" y="20" width="15" height="15" fill="currentColor" rx="2" />
                          <rect x="95" y="10" width="35" height="35" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                          <rect x="105" y="20" width="15" height="15" fill="currentColor" rx="2" />
                          <rect x="10" y="95" width="35" height="35" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                          <rect x="20" y="105" width="15" height="15" fill="currentColor" rx="2" />
                          {/* Data dots pattern */}
                          <circle cx="60" cy="20" r="4" fill="currentColor" />
                          <circle cx="75" cy="20" r="4" fill="currentColor" />
                          <circle cx="60" cy="35" r="4" fill="currentColor" />
                          <circle cx="80" cy="35" r="4" fill="currentColor" />
                          <circle cx="20" cy="65" r="4" fill="currentColor" />
                          <circle cx="35" cy="65" r="4" fill="currentColor" />
                          <circle cx="60" cy="65" r="6" fill="#ea580c" />
                          <circle cx="80" cy="65" r="4" fill="currentColor" />
                          <circle cx="105" cy="65" r="4" fill="currentColor" />
                          <circle cx="120" cy="65" r="4" fill="currentColor" />
                          <circle cx="20" cy="80" r="4" fill="currentColor" />
                          <circle cx="35" cy="80" r="4" fill="currentColor" />
                          <circle cx="60" cy="80" r="4" fill="currentColor" />
                          <circle cx="75" cy="95" r="4" fill="currentColor" />
                          <circle cx="95" cy="95" r="4" fill="currentColor" />
                          <circle cx="60" cy="115" r="4" fill="currentColor" />
                          <circle cx="80" cy="115" r="4" fill="currentColor" />
                          <circle cx="105" cy="115" r="4" fill="currentColor" />
                          <circle cx="120" cy="115" r="4" fill="currentColor" />
                        </svg>
                      )}
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 font-medium">
                      Scan via GPay, PhonePe, Paytm, BHIM
                    </div>

                    {/* Copy UPI Button */}
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="mt-1.5 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-slate-700 font-mono text-[10px] flex items-center gap-1 border border-stone-300 transition-colors"
                    >
                      <span>{upiId}</span>
                      {copiedUpi ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500" />
                      )}
                    </button>
                  </div>

                  {/* Right: Upload SS Dropzone */}
                  <div className="sm:col-span-7 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-orange-600" />
                      <span>Upload ₹5 Payment Screenshot <span className="text-red-500">*</span></span>
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {screenshotPreview ? (
                      <div className="p-3 bg-white border border-emerald-300 rounded-xl shadow-sm flex items-center gap-3">
                        <img
                          src={screenshotPreview}
                          alt="Uploaded SS Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Payment Proof Attached</span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate mt-0.5">
                            {screenshotName || 'payment_screenshot.jpg'}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setScreenshotPreview('');
                              setScreenshotName('');
                            }}
                            className="text-[10px] text-red-600 hover:underline mt-1 font-semibold"
                          >
                            Remove & Upload Different Screenshot
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-colors ${
                          isDragging
                            ? 'border-orange-500 bg-orange-50/60'
                            : 'border-stone-300 hover:border-orange-500 bg-white hover:bg-orange-50/20'
                        }`}
                      >
                        <Upload className="w-6 h-6 text-orange-600 mx-auto mb-1.5" />
                        <span className="text-xs font-bold text-slate-800 block">
                          Click to browse or drag & drop screenshot
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Attach screenshot showing ₹5 sent to <span className="font-mono text-slate-700">{upiId}</span>
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-1">
                          Supports JPG, PNG, WebP up to 5MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <IdCard className="w-4 h-4 text-amber-200" />
                      <span>Submit Membership & Pay ₹5</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
