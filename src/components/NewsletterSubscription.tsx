import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Bell,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Calendar,
  HeartHandshake,
  AlertCircle,
} from 'lucide-react';
import { storageService } from '../services/storageService';

const AVAILABLE_TOPICS = [
  { id: 'exams', label: 'CU Exam Schedules & Syllabus', icon: GraduationCap },
  { id: 'scholarships', label: 'SVMCM & State Scholarships', icon: Sparkles },
  { id: 'events', label: 'Seminars & Blood Donation Camps', icon: Calendar },
  { id: 'welfare', label: 'Admission & Help Desk Alerts', icon: HeartHandshake },
];

export const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'CU Exam Schedules & Syllabus',
    'SVMCM & State Scholarships',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleTopic = (label: string) => {
    setSelectedTopics((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid student email address (e.g. name@example.com).',
      });
      return;
    }

    setIsLoading(true);

    // Simulate quick verification and save to storage
    setTimeout(() => {
      const result = storageService.subscribeNewsletter(
        email.trim(),
        selectedTopics.length > 0 ? selectedTopics : ['General Campus Notices']
      );

      setIsLoading(false);
      if (result.success) {
        setIsSubscribed(true);
        setStatusMessage({
          type: 'success',
          text: result.message,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: result.message,
        });
      }
    }, 400);
  };

  const handleReset = () => {
    setEmail('');
    setIsSubscribed(false);
    setStatusMessage(null);
  };

  return (
    <div
      id="newsletter-subscription-section"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/90 shadow-2xl p-6 sm:p-8 lg:p-10 mb-12"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Context & Information */}
          <div className="lg:col-span-6 space-y-3.5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/70 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Campus Digital Bulletin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight leading-snug">
              Never Miss Official Notices & Upcoming Campus Events
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Stay ahead with verified Calcutta University circulars, semester exam schedules,
              Swami Vivekananda (SVMCM) scholarship deadlines, and ABVP student initiatives delivered
              straight to your inbox.
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                Zero Spam Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                100% Free for NDC Students
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Subscription Form */}
          <div className="lg:col-span-6">
            <div className="bg-slate-950/80 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-slate-800 shadow-inner">
              {isSubscribed ? (
                <div className="text-center py-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">You are Subscribed!</h4>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                      {statusMessage?.text ||
                        'You will receive verified college circulars and event alerts at your email address.'}
                    </p>
                    <p className="text-amber-400 font-mono text-xs mt-1.5 font-semibold">
                      {email}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-slate-400 hover:text-amber-400 underline font-medium transition-colors"
                    >
                      Subscribe another student email
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  {/* Select alert preferences */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Choose Your Update Topics:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AVAILABLE_TOPICS.map((topic) => {
                        const Icon = topic.icon;
                        const isChecked = selectedTopics.includes(topic.label);
                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => toggleTopic(topic.label)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-left transition-all border ${
                              isChecked
                                ? 'bg-orange-950/60 border-orange-500/50 text-amber-300 font-semibold'
                                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] shrink-0 ${
                                isChecked
                                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                                  : 'border-slate-600 bg-slate-800'
                              }`}
                            >
                              {isChecked ? '✓' : ''}
                            </span>
                            <Icon className="w-3.5 h-3.5 shrink-0 text-orange-400" />
                            <span className="truncate">{topic.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email Input Field & Submit Button */}
                  <div>
                    <label
                      htmlFor="newsletter-email-input"
                      className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                    >
                      Student Email Address:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="newsletter-email-input"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (statusMessage) setStatusMessage(null);
                          }}
                          placeholder="e.g. yourname.ndc@gmail.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs transition-all placeholder:text-slate-500 outline-none"
                        />
                      </div>

                      <button
                        id="btn-submit-newsletter"
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md hover:shadow-orange-500/20 active:scale-98 transition-all shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Subscribe</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error or validation alert */}
                  {statusMessage && statusMessage.type === 'error' && (
                    <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2.5 rounded-lg animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{statusMessage.text}</span>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    By subscribing, you agree to receive academic circulars and event notifications.
                    You can unsubscribe anytime by clicking the link in the footer.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
