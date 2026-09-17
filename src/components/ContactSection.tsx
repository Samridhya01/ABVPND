import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  SendHorizontal,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { UnitSettings } from '../types';

interface ContactSectionProps {
  settings: UnitSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 2500);
  };

  const socialChannels = [
    {
      name: 'Instagram',
      url: settings.socialLinks.instagram,
      icon: Instagram,
      color: 'hover:bg-pink-600 hover:text-white',
      border: 'hover:border-pink-600',
    },
    {
      name: 'Facebook',
      url: settings.socialLinks.facebook,
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      border: 'hover:border-blue-600',
    },
    {
      name: 'X (Twitter)',
      url: settings.socialLinks.x,
      icon: Twitter,
      color: 'hover:bg-slate-900 hover:text-white',
      border: 'hover:border-slate-900',
    },
    {
      name: 'YouTube',
      url: settings.socialLinks.youtube,
      icon: Youtube,
      color: 'hover:bg-red-600 hover:text-white',
      border: 'hover:border-red-600',
    },
    {
      name: 'Telegram',
      url: settings.socialLinks.telegram,
      icon: SendHorizontal,
      color: 'hover:bg-sky-600 hover:text-white',
      border: 'hover:border-sky-600',
    },
    {
      name: 'WhatsApp',
      url: settings.socialLinks.whatsapp,
      icon: MessageCircle,
      color: 'hover:bg-emerald-600 hover:text-white',
      border: 'hover:border-emerald-600',
    },
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Unit Office & Reach Out</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
            Contact Us & Campus Location
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Reach out to the ABVP Narasinha Dutt College Unit coordinators for student inquiries, academic clarifications, or activity collaboration.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Official Unit Contact Info & Socials */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Info Box */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  College Unit Headquarters
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  {settings.unitName}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Affiliated with Calcutta University • Howrah District
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-orange-400 border border-slate-800 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Campus Location:</div>
                    <div className="text-slate-300 leading-relaxed mt-0.5">
                      {settings.collegeName}, {settings.collegeAddress}, {settings.city}, {settings.state} - {settings.pincode}
                    </div>
                  </div>
                </div>

                {/* Email */}
                {settings.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-amber-400 border border-slate-800 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Official Email:</div>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-amber-400 hover:underline font-mono text-xs"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {settings.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Helpline / WhatsApp:</div>
                      <a
                        href={`tel:${settings.phone}`}
                        className="text-slate-200 hover:text-white font-mono text-xs"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Timing */}
                {settings.helplineTiming && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-sky-400 border border-slate-800 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Student Help Desk Hours:</div>
                      <div className="text-slate-300 mt-0.5">{settings.helplineTiming}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Connect on Social Media:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {socialChannels.map((social) => {
                    const IconComponent = social.icon;
                    if (!social.url) return null;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium transition-all ${social.color} ${social.border}`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="truncate">{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 overflow-hidden shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Howrah Campus Map Guide</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Narasimha+Datta+College+Howrah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative h-36 w-full rounded-xl overflow-hidden border border-stone-300 bg-stone-200">
                {/* Stylized Google Map Visual */}
                <iframe
                  title="Narasinha Dutt College Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src="https://maps.google.com/maps?q=Narasimha+Datta+College+Howrah+West+Bengal&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Opposite Howrah Municipal Corporation, close to Kadamtala bus terminus and 10 mins from Howrah Railway Station.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-stone-200 mb-6">
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Have an event query, feedback for the unit, or want to join as a student volunteer? Write to us below.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-display">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out to the ABVP NDC Unit. A unit representative will respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91..."
                        className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Volunteer Enrollment / Query"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your query, comments, or how we can assist you..."
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200/80 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All inquiries received are attended to by designated college unit coordinators.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
