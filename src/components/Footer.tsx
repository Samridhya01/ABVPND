import React, { useState } from 'react';
import {
  LifeBuoy,
  MapPin,
  Mail,
  Phone,
  ArrowUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  SendHorizontal,
  MessageCircle,
  ShieldCheck,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import { UnitSettings } from '../types';

interface FooterProps {
  settings: UnitSettings;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenTracker,
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialChannels = [
    { name: 'Instagram', url: settings.socialLinks.instagram, icon: Instagram },
    { name: 'Facebook', url: settings.socialLinks.facebook, icon: Facebook },
    { name: 'X', url: settings.socialLinks.x, icon: Twitter },
    { name: 'YouTube', url: settings.socialLinks.youtube, icon: Youtube },
    { name: 'Telegram', url: settings.socialLinks.telegram, icon: SendHorizontal },
    { name: 'WhatsApp', url: settings.socialLinks.whatsapp, icon: MessageCircle },
  ];

  return (
    <footer id="footer" className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Upper Footer: Navigation & Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-0.5 text-center">
                  <span className="text-[9px] font-black text-amber-400 leading-none">ABVP</span>
                  <span className="text-[7px] font-semibold text-slate-300 leading-none mt-0.5">NDC</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-black text-base tracking-tight font-display">
                  {settings.unitName}
                </h3>
                <p className="text-[11px] text-orange-400 font-semibold">
                  Howrah, West Bengal • Students • Service • Nation
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An active collegiate unit committed to constructive student welfare, campus problem resolution, blood donation, and cultural enrichment for the students of Narasinha Dutt College.
            </p>

            {/* Social Media Row */}
            <div className="flex items-center gap-2 pt-1">
              {socialChannels.map((s) => {
                const IconComp = s.icon;
                if (!s.url) return null;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 transition-colors"
                    title={s.name}
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenTracker}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-semibold"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-orange-500" />
                <span>Track Submitted Help Request</span>
              </button>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-display tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About the Unit
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-amber-400 transition-colors">
                  Unit Office Bearers
                </a>
              </li>
              <li>
                <a href="#activities" className="hover:text-amber-400 transition-colors">
                  Activities & Campaigns
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-400 transition-colors">
                  Photo & Event Gallery
                </a>
              </li>
              <li>
                <a href="#downloads" className="hover:text-amber-400 transition-colors">
                  Resources & Downloads
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">
                  Contact & Directions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Student Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-display tracking-wide">
              Student Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#helpdesk" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Student Help Desk</span>
                  <span className="px-1.5 py-0.2 bg-orange-600/30 text-orange-300 rounded text-[9px] font-bold">
                    Active
                  </span>
                </a>
              </li>
              <li>
                <a href="#notices" className="hover:text-amber-400 transition-colors">
                  Notice Board
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-amber-400 transition-colors">
                  Seminars & Blood Donation
                </a>
              </li>
              <li>
                <a href="#suggestions" className="hover:text-amber-400 transition-colors">
                  Suggestion Box (Anonymous)
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Complaint Status Lookup
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-display tracking-wide">
              Campus Office
            </h4>
            <div className="space-y-2.5 text-[11px] leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  {settings.collegeName}, {settings.collegeAddress}, {settings.city} - {settings.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{settings.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-slate-500 hover:text-amber-400 underline font-medium"
              >
                Unit Administrator Portal
              </button>
            </div>
          </div>
        </div>

        {/* Institutional Disclaimer Box */}
        <div className="mt-10 p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold block mb-0.5">
                Official Institutional Disclaimer:
              </span>
              <p>
                {settings.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Terms */}
      <div className="border-t border-slate-900 bg-slate-950 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} {settings.unitName}. All rights reserved. (ज्ञान • शील • एकता)
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setShowDisclaimerModal(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Terms & Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-base text-slate-900 font-display">
                Privacy Policy & Student Data Protection
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto">
              <p>
                The ABVP Narasinha Dutt College Unit respects student privacy. Any personal information submitted through our Student Help Desk (such as Name, Email, Phone Number, Course, or attachments) is collected solely for the objective of:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verifying and responding to reported academic or college issues.</li>
                <li>Contacting the student via their preferred communication channel (WhatsApp/Call/Email).</li>
                <li>Compiling anonymous summary statistics for college administration memorandums.</li>
              </ul>
              <p>
                Student data is never sold, leased, or transmitted to third-party commercial entities. Suggestion submissions marked anonymous do not record the sender’s name or IP.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-slate-950 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-base text-slate-900 font-display">
                Terms of Use & Legal Disclaimer
              </h3>
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto">
              <p>
                <strong>1. Non-Affiliation Declaration:</strong> This portal is owned and operated independently by the Akhil Bharatiya Vidyarthi Parishad (ABVP) – Narasinha Dutt College Unit, Howrah. It does not purport to act as an official administrative authority or proxy of the Governing Body, Principal, or Teachers' Council of Narasinha Dutt College.
              </p>
              <p>
                <strong>2. Informational Purpose:</strong> All notices, event details, and document guidelines published are intended for student convenience and educational awareness. Students are advised to also corroborate university examination schedules with official Calcutta University and Narasinha Dutt College circulars.
              </p>
              <p>
                <strong>3. Constructive Campus Atmosphere:</strong> We promote peaceful, democratic, and constructive campus interaction strictly in accordance with UGC guidelines and college codes of conduct.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="px-4 py-2 bg-slate-950 text-white rounded-lg text-xs font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
