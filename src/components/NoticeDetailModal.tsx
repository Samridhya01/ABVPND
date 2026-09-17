import React from 'react';
import { X, Calendar, FileText, Download, Share2, Tag, CheckCircle } from 'lucide-react';
import { Notice } from '../types';

interface NoticeDetailModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!notice) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}#notices - ${notice.title}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDownload = () => {
    alert(`Downloading attachment: ${notice.attachmentName || 'Notice_Document.pdf'}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wide">
                {notice.category}
              </span>
              {notice.isPinned && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-600 text-white uppercase">
                  Important Bulletin
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold font-display leading-snug text-white">
              {notice.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Published on: {notice.date}</span>
              <span>•</span>
              <span>ABVP NDC Notice Board</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 font-medium text-slate-800">
            {notice.description}
          </div>

          {notice.details ? (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Full Notice Bulletin:</h4>
              <p className="whitespace-pre-line text-slate-600 leading-relaxed text-sm">
                {notice.details}
              </p>
            </div>
          ) : (
            <p className="text-slate-600 text-sm">
              All regular undergraduate students of Narasinha Dutt College are advised to note the contents of this announcement. For further inquiries or ground assistance, visit the ABVP Student Help Desk near the college gate.
            </p>
          )}

          {/* Attachment Preview Box */}
          {notice.attachmentName && (
            <div className="mt-6 p-4 rounded-xl border border-amber-200 bg-amber-50/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{notice.attachmentName}</div>
                  <div className="text-xs text-slate-500">{notice.attachmentSize || 'Official PDF Document'}</div>
                </div>
              </div>
              <button
                onClick={handleSimulateDownload}
                className="px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium py-1.5 px-2.5 rounded-lg hover:bg-stone-200 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Notice</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
