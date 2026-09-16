import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Calendar,
  User,
  Phone,
  FileText,
} from 'lucide-react';
import { HelpDeskTicket } from '../types';
import { storageService } from '../services/storageService';

interface TicketTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRefId?: string;
}

export const TicketTrackerModal: React.FC<TicketTrackerModalProps> = ({
  isOpen,
  onClose,
  initialRefId = '',
}) => {
  const [refId, setRefId] = useState(initialRefId);
  const [ticket, setTicket] = useState<HelpDeskTicket | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId.trim()) return;
    const found = storageService.findTicketByReference(refId);
    setTicket(found || null);
    setSearched(true);
  };

  const getStatusBadge = (status: HelpDeskTicket['status']) => {
    switch (status) {
      case 'Submitted':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Clock,
          label: 'Ticket Submitted',
          desc: 'Received by the unit desk; queued for review.',
        };
      case 'Under Review':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Clock,
          label: 'Under Active Review',
          desc: 'A volunteer is verifying your issue with college counters.',
        };
      case 'In Progress':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: Clock,
          label: 'In Progress / Action Taken',
          desc: 'Formal representation or dialogue initiated on your behalf.',
        };
      case 'Resolved':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          label: 'Issue Resolved',
          desc: 'The reported matter has been resolved or closed.',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-600/30 text-amber-400 border border-orange-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Track Grievance / Help Desk Ticket
              </h3>
              <p className="text-xs text-slate-400">
                Check current status & volunteer updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 bg-stone-50 border-b border-stone-200">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Your Reference ID:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                placeholder="e.g., ABVP-NDC-2026-1042"
                className="flex-1 px-3.5 py-2 text-xs uppercase font-mono font-bold bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Sample test IDs to check: <code className="bg-stone-200 px-1 py-0.5 rounded text-[10px] text-slate-800">ABVP-NDC-2026-1042</code> or <code className="bg-stone-200 px-1 py-0.5 rounded text-[10px] text-slate-800">ABVP-NDC-2026-1039</code>
            </p>
          </form>
        </div>

        {/* Results Area */}
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
          {searched && ticket ? (
            <div className="space-y-4">
              {/* Status Banner */}
              {(() => {
                const info = getStatusBadge(ticket.status);
                const IconComp = info.icon;
                return (
                  <div className={`p-4 rounded-xl border ${info.color} flex items-start gap-3`}>
                    <IconComp className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">{info.label}</div>
                      <div className="text-xs mt-0.5 opacity-90">{info.desc}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Ticket Details Box */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-slate-500">Reference ID:</span>
                  <span className="font-mono font-bold text-slate-900">{ticket.referenceId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-semibold text-slate-900">{ticket.studentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-slate-500">Course / Semester:</span>
                  <span className="font-medium text-slate-800">{ticket.courseSemester}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-orange-600">{ticket.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-slate-500">Submitted At:</span>
                  <span className="text-slate-700">{ticket.submittedAt}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-slate-500">Preferred Contact:</span>
                  <span className="text-slate-800 font-medium">{ticket.preferredContact}</span>
                </div>

                <div className="pt-2">
                  <span className="text-slate-500 block mb-1">Issue Description:</span>
                  <p className="bg-white p-2.5 rounded-lg border border-stone-200 text-slate-700 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                {/* Admin Note / Remarks */}
                {ticket.adminNotes && (
                  <div className="pt-2">
                    <span className="text-orange-700 font-bold block mb-1">
                      Desk Volunteer Update:
                    </span>
                    <p className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900 leading-relaxed font-medium">
                      {ticket.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : searched && !ticket ? (
            <div className="text-center py-8 space-y-2">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <div className="font-bold text-slate-900 text-sm">Ticket Not Found</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No matching submission found for ID "<span className="font-mono font-semibold">{refId}</span>". Please check your reference ID format.
              </p>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              Enter your complaint reference ID above to view live progress notes from unit coordinators.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
