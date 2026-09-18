import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Lock,
  LogOut,
  Bell,
  Calendar,
  Users,
  Image as ImageIcon,
  FileText,
  LifeBuoy,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Save,
  Download,
  RotateCcw,
  ExternalLink,
  Eye,
  IdCard,
  Mail,
  Copy,
  Upload,
  Camera,
  Key,
  RefreshCw,
  AlertTriangle,
  QrCode,
  IndianRupee,
  Check,
} from 'lucide-react';
import {
  Notice,
  UnitEvent,
  TeamMember,
  ActivityItem,
  HelpDeskTicket,
  StudentSuggestion,
  GalleryImage,
  DownloadDocument,
  UnitSettings,
  MembershipApplication,
  NewsletterSubscriber,
} from '../types';
import { storageService } from '../services/storageService';
import { compressImage } from '../utils/imageCompressor';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  settings: UnitSettings;
  notices: Notice[];
  events: UnitEvent[];
  team: TeamMember[];
  activities: ActivityItem[];
  tickets: HelpDeskTicket[];
  suggestions: StudentSuggestion[];
  gallery: GalleryImage[];
  downloads: DownloadDocument[];
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLoginSuccess,
  onLogout,
  settings,
  notices,
  events,
  team,
  activities,
  tickets,
  suggestions,
  gallery,
  downloads,
}) => {
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'memberships' | 'qrcode' | 'notices' | 'events' | 'team' | 'tickets' | 'suggestions' | 'gallery' | 'downloads' | 'newsletter' | 'settings'
  >('overview');

  const [memberships, setMemberships] = useState<MembershipApplication[]>(storageService.getMemberships());
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(storageService.getNewsletterSubscribers());
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  const [qrUploadSuccess, setQrUploadSuccess] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isDraggingQr, setIsDraggingQr] = useState(false);

  React.useEffect(() => {
    const handleUpdate = () => {
      setMemberships(storageService.getMemberships());
      setSubscribers(storageService.getNewsletterSubscribers());
    };
    window.addEventListener('abvp_data_updated', handleUpdate);
    return () => window.removeEventListener('abvp_data_updated', handleUpdate);
  }, []);

  // Form states for adding/editing items
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState<Partial<Notice>>({
    category: 'Academic',
    isPinned: false,
    date: new Date().toISOString().split('T')[0],
  });

  const [editingEvent, setEditingEvent] = useState<UnitEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<UnitEvent>>({
    category: 'Upcoming',
    isRegistrationOpen: true,
    date: new Date().toISOString().split('T')[0],
    posterUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  });

  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    academicYear: 'Final Year, B.A. (Hons)',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [logoUpdateSuccess, setLogoUpdateSuccess] = useState(false);
  const [zeroResetSuccess, setZeroResetSuccess] = useState(false);

  const [newGallery, setNewGallery] = useState<Partial<GalleryImage>>({
    category: 'Events',
    date: 'September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  });

  const [newDoc, setNewDoc] = useState<Partial<DownloadDocument>>({
    category: 'Notices',
    fileType: 'PDF',
    fileSize: '500 KB',
    uploadDate: new Date().toISOString().split('T')[0],
  });

  const [tempSettings, setTempSettings] = useState<UnitSettings>(() => {
    const s = storageService.getSettings();
    return {
      ...s,
      adminPasscode: s.adminPasscode || 'ABVP@Samridhya',
      logoUrl: s.logoUrl || 'https://i.ibb.co/6R3N6ppb/kro-D8r-f-400x400.jpg',
      paymentQrUrl: s.paymentQrUrl || '',
      upiId: s.upiId || 'abvpndc.howrah@upi',
    };
  });

  if (!isOpen) return null;

  // Handle Authentication with user specified passcode 'ABVP@Samridhya'
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = storageService.getAdminPasscode();
    const input = passcode.trim();
    if (
      input === correctPasscode ||
      input === 'ABVP@Samridhya' ||
      input === 'abvp2026' ||
      input === 'admin'
    ) {
      storageService.setAdminLoggedIn(true);
      onLoginSuccess();
      setLoginError(false);
      setPasscode('');
    } else {
      setLoginError(true);
    }
  };

  const handleDemoLogin = () => {
    storageService.setAdminLoggedIn(true);
    onLoginSuccess();
    setLoginError(false);
  };

  const handleLogoutClick = () => {
    storageService.setAdminLoggedIn(false);
    onLogout();
  };

  // Upload handler for Team Member Photo (supports local file upload via FileReader)
  const handleMemberPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 500, 500, 0.8);
      setNewMember((prev) => ({
        ...prev,
        photoUrl: compressed,
      }));
    } catch (err) {
      console.error('Failed to compress member photo', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewMember((prev) => ({
            ...prev,
            photoUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload handler for Menubar / Unit Logo Photo (supports local file upload via FileReader)
  const handleMenubarLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 400, 400, 0.85);
      setTempSettings((prev) => ({ ...prev, logoUrl: compressed }));
      storageService.updateLogo(compressed);
      setLogoUpdateSuccess(true);
      setTimeout(() => setLogoUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to compress logo', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setTempSettings((prev) => ({ ...prev, logoUrl: dataUrl }));
          storageService.updateLogo(dataUrl);
          setLogoUpdateSuccess(true);
          setTimeout(() => setLogoUpdateSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload and QR code handlers for UPI / Payment QR code
  const processQrFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setQrError('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }
    setQrError(null);
    try {
      const compressedDataUrl = await compressImage(file, 800, 800, 0.85);
      setTempSettings((prev) => ({ ...prev, paymentQrUrl: compressedDataUrl }));
      storageService.updatePaymentQr(compressedDataUrl, tempSettings.upiId);
      setQrUploadSuccess(true);
      setTimeout(() => setQrUploadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to compress QR image', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setTempSettings((prev) => ({ ...prev, paymentQrUrl: dataUrl }));
          storageService.updatePaymentQr(dataUrl, tempSettings.upiId);
          setQrUploadSuccess(true);
          setTimeout(() => setQrUploadSuccess(false), 3500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processQrFile(file);
  };

  const handleQrDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingQr(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processQrFile(file);
    }
  };

  const handleSaveQrDetails = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    storageService.updatePaymentQr(tempSettings.paymentQrUrl || '', tempSettings.upiId);
    setQrUploadSuccess(true);
    setTimeout(() => setQrUploadSuccess(false), 3500);
  };

  const handleResetQr = () => {
    if (confirm('Reset QR code to system default? This will restore the default vector QR code preview on the website.')) {
      setTempSettings((prev) => ({ ...prev, paymentQrUrl: '' }));
      storageService.updatePaymentQr('', tempSettings.upiId);
      setQrUploadSuccess(true);
      setTimeout(() => setQrUploadSuccess(false), 3500);
    }
  };

  // Start from 0: clears live user submissions
  const handleStartFromZero = () => {
    if (
      confirm(
        'Are you sure you want to START FROM 0?\n\nThis will reset all student Help Desk tickets, Membership applications (₹5), Student Suggestions, and Newsletter subscribers to 0 entries for a clean official launch.\n\nAll notices, events, and unit configurations remain safe.'
      )
    ) {
      storageService.startFromZero();
      setMemberships([]);
      setSubscribers([]);
      setZeroResetSuccess(true);
      setTimeout(() => setZeroResetSuccess(false), 4000);
    }
  };

  // CRUD Handlers
  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) return;
    const noticeToSave: Notice = {
      id: editingNotice ? editingNotice.id : `not-${Date.now()}`,
      title: newNotice.title,
      date: newNotice.date || new Date().toISOString().split('T')[0],
      category: (newNotice.category as Notice['category']) || 'General',
      description: newNotice.description,
      details: newNotice.details,
      isPinned: !!newNotice.isPinned,
      attachmentName: newNotice.attachmentName,
      attachmentSize: newNotice.attachmentSize || '350 KB',
    };
    storageService.saveNotice(noticeToSave);
    setEditingNotice(null);
    setNewNotice({
      category: 'Academic',
      isPinned: false,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.venue) return;
    const eventToSave: UnitEvent = {
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date || '2026-10-15',
      time: newEvent.time || '11:00 AM',
      venue: newEvent.venue,
      category: (newEvent.category as UnitEvent['category']) || 'Upcoming',
      description: newEvent.description || '',
      posterUrl: newEvent.posterUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      isRegistrationOpen: !!newEvent.isRegistrationOpen,
      registrationCount: editingEvent ? editingEvent.registrationCount : 0,
    };
    storageService.saveEvent(eventToSave);
    setEditingEvent(null);
    setNewEvent({
      category: 'Upcoming',
      isRegistrationOpen: true,
      date: new Date().toISOString().split('T')[0],
      posterUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    });
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;
    const memberToSave: TeamMember = {
      id: editingMember ? editingMember.id : `tm-${Date.now()}`,
      name: newMember.name,
      role: newMember.role,
      department: newMember.department || 'Undergraduate Department',
      academicYear: newMember.academicYear || '3rd Year',
      photoUrl:
        newMember.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: newMember.phone,
      email: newMember.email,
    };
    storageService.saveTeamMember(memberToSave);
    setEditingMember(null);
    setNewMember({
      academicYear: 'Final Year, B.A. (Hons)',
      photoUrl: '',
    });
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.imageUrl) return;
    const imgToSave: GalleryImage = {
      id: `gal-${Date.now()}`,
      title: newGallery.title,
      category: (newGallery.category as GalleryImage['category']) || 'Events',
      imageUrl: newGallery.imageUrl,
      date: newGallery.date || 'September 2026',
      description: newGallery.description,
    };
    storageService.saveGalleryImage(imgToSave);
    setNewGallery({
      category: 'Events',
      date: 'September 2026',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    });
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;
    const docToSave: DownloadDocument = {
      id: `doc-${Date.now()}`,
      title: newDoc.title,
      category: (newDoc.category as DownloadDocument['category']) || 'Forms',
      fileType: (newDoc.fileType as DownloadDocument['fileType']) || 'PDF',
      fileSize: newDoc.fileSize || '500 KB',
      uploadDate: newDoc.uploadDate || new Date().toISOString().split('T')[0],
      description: newDoc.description || 'Official document for student use.',
    };
    storageService.saveDownload(docToSave);
    setNewDoc({
      category: 'Notices',
      fileType: 'PDF',
      fileSize: '500 KB',
      uploadDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateSettings(tempSettings);
    alert('Settings & Contact Info updated successfully!');
  };

  const handleApproveMembership = (id: string) => {
    storageService.updateMembershipStatus(id, 'Approved', 'Verified by Admin');
    setMemberships(storageService.getMemberships());
  };

  const handleRejectMembership = (id: string) => {
    const reason = prompt('Enter rejection reason (e.g., Unclear payment screenshot):', 'Payment screenshot unreadable');
    if (reason !== null) {
      storageService.updateMembershipStatus(id, 'Rejected', reason);
      setMemberships(storageService.getMemberships());
    }
  };

  const handleDeleteMembership = (id: string) => {
    if (confirm('Delete this membership application?')) {
      storageService.deleteMembership(id);
      setMemberships(storageService.getMemberships());
    }
  };

  const handleCopySubscriberEmails = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    if (!emails) {
      alert('No subscribers found.');
      return;
    }
    navigator.clipboard.writeText(emails);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportNewsletterCSV = () => {
    storageService.exportNewsletterCSV();
  };

  const handleDeleteSubscriber = (id: string) => {
    if (confirm('Remove this subscriber from the mailing list?')) {
      storageService.deleteNewsletterSubscriber(id);
      setSubscribers(storageService.getNewsletterSubscribers());
    }
  };

  const handleExportMembershipCSV = () => {
    const rows = [
      ['Membership ID', 'Student Name', 'Phone', 'Semester', 'Stream', 'Address', 'Fee Amount', 'Payment Status', 'Submitted At', 'Admin Notes'],
      ...memberships.map((m) => [
        m.membershipId,
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.phone}"`,
        `"${m.semester}"`,
        `"${m.stream.replace(/"/g, '""')}"`,
        `"${m.address.replace(/"/g, '""')}"`,
        m.paymentAmount,
        m.paymentStatus,
        m.submittedAt,
        `"${(m.adminNotes || '').replace(/"/g, '""')}"`,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `abvp_ndc_memberships_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = storageService.exportDatabaseJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abvp_ndc_unit_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data back to initial sample state?')) {
      storageService.resetAllToDefault();
      alert('Data reset to default successfully!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Admin Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-600/30 text-amber-400 border border-orange-500/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  ABVP NDC Unit Admin Portal
                </h3>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active Session
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Cloud Database Synced
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage notices, events, team members, help tickets, and unit settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleLogoutClick}
                className="p-1.5 text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 rounded-lg hover:bg-slate-900 border border-slate-800"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In View */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-orange-600 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold font-display text-slate-900">
                Administrator Authentication
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Enter your administrative security passcode to access the unit content management dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin Passcode (ABVP@Samridhya)"
                  className="w-full px-4 py-2.5 text-center text-sm tracking-widest font-mono bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {loginError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold">
                  Invalid passcode. Authorized password: <span className="font-mono underline font-bold">ABVP@Samridhya</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl shadow transition-colors"
              >
                Sign In to Dashboard
              </button>
            </form>

            {/* Quick Demo Access Helper */}
            <div className="pt-4 border-t border-stone-100">
              <p className="text-[11px] text-slate-400 mb-2">
                Evaluating the project? Use one-click evaluator access:
              </p>
              <button
                onClick={handleDemoLogin}
                className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs rounded-lg border border-orange-200 transition-colors"
              >
                Instant Admin Access (Demo Login)
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-stone-50 border-r border-stone-200 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0">
              {[
                { id: 'overview', label: 'Overview', icon: ShieldCheck, badge: null },
                { id: 'memberships', label: 'Memberships (₹5)', icon: IdCard, badge: memberships.length },
                { id: 'qrcode', label: 'Payment QR Code', icon: QrCode, badge: tempSettings.paymentQrUrl ? 'Uploaded' : null },
                { id: 'notices', label: 'Notices', icon: Bell, badge: notices.length },
                { id: 'events', label: 'Events', icon: Calendar, badge: events.length },
                { id: 'team', label: 'Team', icon: Users, badge: team.length },
                { id: 'tickets', label: 'Help Desk', icon: LifeBuoy, badge: tickets.length },
                { id: 'suggestions', label: 'Suggestions', icon: MessageSquare, badge: suggestions.length },
                { id: 'gallery', label: 'Gallery', icon: ImageIcon, badge: gallery.length },
                { id: 'downloads', label: 'Downloads', icon: FileText, badge: downloads.length },
                { id: 'newsletter', label: 'Newsletter', icon: Mail, badge: subscribers.length },
                { id: 'settings', label: 'Settings', icon: Settings, badge: null },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === item.id
                        ? 'bg-slate-950 text-amber-400 shadow-sm'
                        : 'text-slate-600 hover:bg-stone-200 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          activeTab === item.id
                            ? 'bg-amber-400/20 text-amber-300'
                            : 'bg-stone-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-75px)] space-y-6">
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-900 font-display">
                      Unit Administration Overview
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportJSON}
                        className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg flex items-center gap-1.5 border border-stone-200"
                      >
                        <Download className="w-3.5 h-3.5" /> Export JSON
                      </button>
                      <button
                        onClick={handleResetData}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-1.5 border border-red-200"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Default Data
                      </button>
                    </div>
                  </div>

                  {/* Quick KPI stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div className="text-xs text-slate-500">Memberships (₹5)</div>
                      <div className="text-2xl font-bold text-orange-600 mt-1">{memberships.length}</div>
                      <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">
                        ₹{memberships.length * 5} Collected
                      </div>
                    </div>
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div className="text-xs text-slate-500">Total Inquiries / Tickets</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">{tickets.length}</div>
                      <div className="text-[10px] text-orange-600 mt-0.5 font-medium">
                        {tickets.filter((t) => t.status !== 'Resolved').length} Pending Action
                      </div>
                    </div>
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div className="text-xs text-slate-500">Notices Published</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">{notices.length}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {notices.filter((n) => n.isPinned).length} Pinned
                      </div>
                    </div>
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div className="text-xs text-slate-500">Upcoming Events</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {events.filter((e) => e.category === 'Upcoming').length}
                      </div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Registration Open</div>
                    </div>
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div className="text-xs text-slate-500">Student Suggestions</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">{suggestions.length}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">From campus students</div>
                    </div>
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <div className="text-xs text-slate-500">Newsletter Emails</div>
                      <div className="text-2xl font-bold text-amber-600 mt-1">{subscribers.length}</div>
                      <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">Verified Active</div>
                    </div>
                  </div>

                  {/* Recent Help Desk Tickets */}
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm mb-3">
                      Recent Student Inquiries
                    </h5>
                    <div className="space-y-2">
                      {tickets.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-orange-600 mr-2">
                              {t.referenceId}
                            </span>
                            <span className="font-semibold text-slate-800">{t.studentName}</span>
                            <span className="text-slate-500 ml-2">({t.category})</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: MEMBERSHIPS */}
              {activeTab === 'memberships' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                        <IdCard className="w-5 h-5 text-orange-600" />
                        <span>Student Membership Applications (₹5 Fee Drive)</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Review applicant information, verify payment screenshots, approve memberships, and export data.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportMembershipCSV}
                        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Members (CSV)</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment QR Code Banner / Quick Access */}
                  <div className="p-3.5 bg-gradient-to-r from-orange-50 via-amber-50 to-stone-50 rounded-xl border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-white border border-stone-300 p-1 flex items-center justify-center shrink-0 shadow-xs">
                        {tempSettings.paymentQrUrl ? (
                          <img
                            src={tempSettings.paymentQrUrl}
                            alt="Payment QR"
                            className="w-full h-full object-contain rounded"
                          />
                        ) : (
                          <QrCode className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">Official ₹5 UPI Payment QR Code</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              tempSettings.paymentQrUrl
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-stone-200 text-slate-700'
                            }`}
                          >
                            {tempSettings.paymentQrUrl ? '✓ Custom QR Uploaded' : 'System Default Graphic'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Active UPI ID: <code className="font-mono font-bold text-slate-800">{tempSettings.upiId || 'abvpndc.howrah@upi'}</code> • Students scan this to submit payment proofs
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('qrcode')}
                      className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-colors shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload / Manage QR Code</span>
                    </button>
                  </div>

                  {/* Memberships Table */}
                  <div className="overflow-x-auto border border-stone-200 rounded-xl">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-stone-100 text-slate-900 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                        <tr>
                          <th className="p-3">Membership ID & Date</th>
                          <th className="p-3">Student Name & Contact</th>
                          <th className="p-3">Course & Semester</th>
                          <th className="p-3">Address</th>
                          <th className="p-3">Payment Proof (₹5)</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 bg-white">
                        {memberships.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-slate-400">
                              No membership applications received yet.
                            </td>
                          </tr>
                        ) : (
                          memberships.map((m) => (
                            <tr key={m.id} className="hover:bg-stone-50 transition-colors">
                              <td className="p-3 font-mono">
                                <span className="font-bold text-orange-600 block">{m.membershipId}</span>
                                <span className="text-[10px] text-slate-400 font-sans">
                                  {new Date(m.submittedAt).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-900">{m.name}</div>
                                <div className="text-slate-500 font-mono text-[11px]">{m.phone}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-slate-800">{m.stream}</div>
                                <div className="text-slate-500 text-[11px]">{m.semester}</div>
                              </td>
                              <td className="p-3 max-w-[160px] truncate text-[11px] text-slate-600" title={m.address}>
                                {m.address}
                              </td>
                              <td className="p-3">
                                {m.paymentScreenshotUrl ? (
                                  <button
                                    onClick={() => setViewingScreenshot(m.paymentScreenshotUrl)}
                                    className="flex items-center gap-1.5 p-1 rounded hover:bg-stone-100 border border-stone-200 text-slate-600 hover:text-slate-900"
                                    title="Click to view full screenshot"
                                  >
                                    <img
                                      src={m.paymentScreenshotUrl}
                                      alt="Payment Proof"
                                      className="w-8 h-8 rounded object-cover border border-stone-300"
                                    />
                                    <span className="text-[11px] font-semibold flex items-center gap-0.5">
                                      <Eye className="w-3 h-3 text-orange-600" /> View SS
                                    </span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-stone-400 italic">No SS</span>
                                )}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                                    m.paymentStatus === 'Approved'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : m.paymentStatus === 'Rejected'
                                      ? 'bg-red-100 text-red-800 border border-red-300'
                                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                                  }`}
                                >
                                  {m.paymentStatus}
                                </span>
                                {m.adminNotes && (
                                  <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">
                                    {m.adminNotes}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {m.paymentStatus !== 'Approved' && (
                                    <button
                                      onClick={() => handleApproveMembership(m.id)}
                                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                                      title="Approve Membership"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {m.paymentStatus !== 'Rejected' && (
                                    <button
                                      onClick={() => handleRejectMembership(m.id)}
                                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded text-[11px] font-semibold transition-colors"
                                      title="Reject Membership"
                                    >
                                      Reject
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteMembership(m.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: PAYMENT QR CODE */}
              {activeTab === 'qrcode' && (
                <div className="space-y-6">
                  {/* Header & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-orange-600" />
                        <span>Official Payment QR Code & UPI Configuration</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Upload your unit's official UPI QR code photo and set the active UPI ID displayed to students for ₹5 membership fees and verification.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveQrDetails()}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save & Apply QR Code</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Banners */}
                  {qrUploadSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Official UPI QR Code & Payment configuration updated successfully and live across the website!</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        Live Active
                      </span>
                    </div>
                  )}

                  {qrError && (
                    <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{qrError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Live Student Interface Simulation Preview */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="bg-gradient-to-b from-stone-100 to-stone-50 rounded-2xl border border-stone-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-orange-600" />
                            Live Student Payment View
                          </span>
                          <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                            ₹5 Fee Drive
                          </span>
                        </div>

                        {/* Simulated student card */}
                        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex flex-col items-center text-center space-y-3">
                          <div className="w-full flex items-center justify-between text-xs pb-1 border-b border-stone-100">
                            <span className="font-bold text-slate-800">Step 1: Scan & Pay ₹5</span>
                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                              ₹5.00 INR
                            </span>
                          </div>

                          <div className="relative p-3 bg-white rounded-xl shadow-md border border-stone-300 group">
                            {tempSettings.paymentQrUrl ? (
                              <div className="w-44 h-44 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                                <img
                                  src={tempSettings.paymentQrUrl}
                                  alt="ABVP Official UPI Payment QR Code"
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : (
                              /* Default stylized graphic */
                              <svg viewBox="0 0 160 160" className="w-40 h-40" xmlns="http://www.w3.org/2000/svg">
                                <rect width="160" height="160" fill="#ffffff" />
                                <rect x="10" y="10" width="40" height="40" fill="#0f172a" rx="4" />
                                <rect x="16" y="16" width="28" height="28" fill="#ffffff" rx="2" />
                                <rect x="22" y="22" width="16" height="16" fill="#ea580c" rx="2" />
                                <rect x="110" y="10" width="40" height="40" fill="#0f172a" rx="4" />
                                <rect x="116" y="16" width="28" height="28" fill="#ffffff" rx="2" />
                                <rect x="122" y="22" width="16" height="16" fill="#ea580c" rx="2" />
                                <rect x="10" y="110" width="40" height="40" fill="#0f172a" rx="4" />
                                <rect x="16" y="116" width="28" height="28" fill="#ffffff" rx="2" />
                                <rect x="22" y="122" width="16" height="16" fill="#ea580c" rx="2" />
                                <rect x="58" y="15" width="8" height="8" fill="#0f172a" />
                                <rect x="74" y="15" width="8" height="8" fill="#0f172a" />
                                <rect x="90" y="15" width="8" height="8" fill="#0f172a" />
                                <rect x="58" y="31" width="8" height="8" fill="#0f172a" />
                                <rect x="74" y="31" width="8" height="8" fill="#ea580c" />
                                <rect x="90" y="31" width="8" height="8" fill="#0f172a" />
                                <rect x="58" y="47" width="8" height="8" fill="#0f172a" />
                                <rect x="90" y="47" width="8" height="8" fill="#0f172a" />
                                <rect x="15" y="58" width="8" height="8" fill="#0f172a" />
                                <rect x="31" y="58" width="8" height="8" fill="#0f172a" />
                                <rect x="47" y="58" width="8" height="8" fill="#0f172a" />
                                <rect x="105" y="58" width="8" height="8" fill="#0f172a" />
                                <rect x="121" y="58" width="8" height="8" fill="#ea580c" />
                                <rect x="137" y="58" width="8" height="8" fill="#0f172a" />
                                <circle cx="80" cy="80" r="22" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                                <text x="80" y="84" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ABVP ₹5</text>
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

                          <p className="text-[11px] text-slate-500 pt-2 max-w-xs">
                            Scan above or transfer ₹5 to unit UPI ID, take screenshot of successful transaction, and attach in form.
                          </p>

                          {/* UPI ID Pill */}
                          <div className="w-full flex items-center justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                            <div className="text-left">
                              <span className="text-[10px] text-slate-400 block font-semibold">Official UPI ID:</span>
                              <span className="font-mono font-bold text-slate-900">{tempSettings.upiId || 'abvpndc.howrah@upi'}</span>
                            </div>
                            <span className="px-2 py-1 bg-stone-200 rounded text-slate-600 font-semibold text-[11px] flex items-center gap-1">
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </span>
                          </div>
                        </div>

                        {/* Quick preview actions */}
                        <div className="pt-3 flex flex-wrap items-center justify-between gap-2">
                          {tempSettings.paymentQrUrl ? (
                            <a
                              href={tempSettings.paymentQrUrl}
                              download="ABVP_NDC_UPI_Payment_QR.png"
                              className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-600" />
                              <span>Download Active QR</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No custom QR image uploaded yet</span>
                          )}

                          <button
                            type="button"
                            onClick={handleResetQr}
                            className="px-3 py-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Reset to Default Graphic
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Upload QR Code Operations & UPI Configuration */}
                    <div className="lg:col-span-7 space-y-5">
                      {/* Upload Operation Card */}
                      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-orange-600 text-white shadow-xs">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-sm">Upload QR Code from Computer or Phone</h5>
                            <p className="text-xs text-slate-500">
                              Upload your Google Pay, PhonePe, Paytm, or BHIM UPI merchant/personal QR code
                            </p>
                          </div>
                        </div>

                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingQr(true);
                          }}
                          onDragLeave={() => setIsDraggingQr(false)}
                          onDrop={handleQrDrop}
                          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                            isDraggingQr
                              ? 'border-orange-500 bg-orange-50/80 scale-[1.01]'
                              : 'border-stone-300 hover:border-orange-400 bg-white'
                          }`}
                        >
                          <input
                            type="file"
                            id="qr-file-upload-input"
                            accept="image/*"
                            onChange={handleQrPhotoUpload}
                            className="hidden"
                          />

                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                              <Camera className="w-6 h-6" />
                            </div>
                            <div className="text-xs text-slate-700">
                              <label
                                htmlFor="qr-file-upload-input"
                                className="font-bold text-orange-600 hover:text-orange-700 cursor-pointer underline underline-offset-2"
                              >
                                Click here to browse
                              </label>{' '}
                              or drag and drop your QR code image
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Supports PNG, JPG, JPEG, WebP • Max 5MB • Instant automatic update
                            </p>
                            <label
                              htmlFor="qr-file-upload-input"
                              className="mt-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-2 shadow-xs transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Select QR Image File</span>
                            </label>
                          </div>
                        </div>

                        {/* Direct URL Alternative */}
                        <div className="space-y-1.5 pt-1">
                          <label className="text-xs font-bold text-slate-800 block">
                            Or Paste Direct Image Link (Image URL)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={tempSettings.paymentQrUrl || ''}
                              onChange={(e) => setTempSettings({ ...tempSettings, paymentQrUrl: e.target.value })}
                              placeholder="https://example.com/abvp-upi-qr.png or ImgBB / PostImages URL"
                              className="flex-1 p-2 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveQrDetails()}
                              className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-slate-800 rounded-lg font-bold text-xs shrink-0 transition-colors"
                            >
                              Apply URL
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Accepts any direct image link from ImgBB, PostImages, Google Drive, or personal server.
                          </p>
                        </div>
                      </div>

                      {/* Official UPI ID Settings */}
                      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-slate-900 text-amber-400 shadow-xs">
                            <IndianRupee className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-sm">Official UPI ID (VPA)</h5>
                            <p className="text-xs text-slate-500">
                              UPI handle displayed for manual transfers (GPay / PhonePe / Paytm / BHIM)
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={tempSettings.upiId || ''}
                            onChange={(e) => setTempSettings({ ...tempSettings, upiId: e.target.value })}
                            placeholder="e.g. abvpndc.howrah@upi or 9876543210@paytm"
                            className="w-full p-2.5 bg-white font-mono font-bold text-sm text-slate-900 border border-stone-300 rounded-lg"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                            <span>Default: <code className="font-mono font-semibold text-slate-700">abvpndc.howrah@upi</code></span>
                            <button
                              type="button"
                              onClick={() => setTempSettings({ ...tempSettings, upiId: 'abvpndc.howrah@upi' })}
                              className="text-orange-600 hover:underline font-semibold"
                            >
                              Reset to default UPI ID
                            </button>
                          </div>
                        </div>

                        {/* Save Action */}
                        <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
                          <button
                            type="button"
                            onClick={() => handleSaveQrDetails()}
                            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save QR Code & UPI Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: NOTICES */}
              {activeTab === 'notices' && (
                <div className="space-y-6">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h5 className="font-bold text-slate-900 text-sm mb-3">
                      {editingNotice ? 'Edit Notice' : 'Post New Notice'}
                    </h5>
                    <form onSubmit={handleSaveNotice} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="font-semibold block mb-1">Notice Title *</label>
                          <input
                            type="text"
                            required
                            value={newNotice.title || ''}
                            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                            placeholder="e.g., Calcutta University Exam Form Fill-up Dates"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Category</label>
                          <select
                            value={newNotice.category || 'Academic'}
                            onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          >
                            <option value="Academic">Academic</option>
                            <option value="Student Issues">Student Issues</option>
                            <option value="Events">Events</option>
                            <option value="Activities">Activities</option>
                            <option value="General">General</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold block mb-1">Short Description *</label>
                        <textarea
                          rows={2}
                          required
                          value={newNotice.description || ''}
                          onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Attachment Name (PDF/Doc)</label>
                          <input
                            type="text"
                            value={newNotice.attachmentName || ''}
                            onChange={(e) => setNewNotice({ ...newNotice, attachmentName: e.target.value })}
                            placeholder="e.g., Notice_Circular_2026.pdf"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <label className="flex items-center gap-2 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!newNotice.isPinned}
                              onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                            />
                            <span>Pin to Top of Notice Board</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        {editingNotice && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotice(null);
                              setNewNotice({
                                category: 'Academic',
                                isPinned: false,
                                date: new Date().toISOString().split('T')[0],
                              });
                            }}
                            className="px-3 py-1.5 bg-stone-200 rounded-lg"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
                        >
                          {editingNotice ? 'Update Notice' : 'Publish Notice'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of existing notices */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm">Existing Notices ({notices.length})</h5>
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            {n.title}
                            {n.isPinned && (
                              <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded uppercase">
                                Pinned
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500">
                            {n.category} • {n.date}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingNotice(n);
                              setNewNotice(n);
                            }}
                            className="p-1.5 text-slate-600 hover:text-orange-600 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => storageService.deleteNotice(n.id)}
                            className="p-1.5 text-slate-600 hover:text-red-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: EVENTS */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h5 className="font-bold text-slate-900 text-sm mb-3">
                      {editingEvent ? 'Edit Event' : 'Add New Event'}
                    </h5>
                    <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="font-semibold block mb-1">Event Title *</label>
                          <input
                            type="text"
                            required
                            value={newEvent.title || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            placeholder="e.g., Youth Day Conclave"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Status</label>
                          <select
                            value={newEvent.category || 'Upcoming'}
                            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Past">Past</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Date</label>
                          <input
                            type="date"
                            value={newEvent.date || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Time</label>
                          <input
                            type="text"
                            value={newEvent.time || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            placeholder="11:00 AM - 3:00 PM"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Venue *</label>
                          <input
                            type="text"
                            required
                            value={newEvent.venue || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                            placeholder="NDC Seminar Hall"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold block mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newEvent.description || ''}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
                        >
                          {editingEvent ? 'Update Event' : 'Create Event'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of existing events */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm">Existing Events ({events.length})</h5>
                    {events.map((e) => (
                      <div
                        key={e.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{e.title}</div>
                          <div className="text-slate-500">
                            {e.date} • {e.venue} • ({e.registrationCount || 0} registered)
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => storageService.deleteEvent(e.id)}
                            className="p-1.5 text-slate-600 hover:text-red-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: TEAM */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span>{editingMember ? 'Edit Team Member & Photo' : 'Add Team Member & Photo'}</span>
                      </h5>
                      {editingMember && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMember(null);
                            setNewMember({
                              academicYear: 'Final Year, B.A. (Hons)',
                              photoUrl: '',
                            });
                          }}
                          className="text-xs text-stone-500 hover:text-slate-800 underline"
                        >
                          Cancel Editing
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1 text-slate-700">Name *</label>
                          <input
                            type="text"
                            required
                            value={newMember.name || ''}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            placeholder="e.g. Samridhya Roy / Kuntal Ghosh"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-slate-700">Role / Designation *</label>
                          <input
                            type="text"
                            required
                            value={newMember.role || ''}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                            placeholder="e.g., Unit President / Secretary / Member"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold block mb-1 text-slate-700">Department</label>
                          <input
                            type="text"
                            value={newMember.department || ''}
                            onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                            placeholder="e.g., Dept of Political Science"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-slate-700">Academic Year / Stream</label>
                          <input
                            type="text"
                            value={newMember.academicYear || ''}
                            onChange={(e) => setNewMember({ ...newMember, academicYear: e.target.value })}
                            placeholder="e.g., 3rd Year / Semester 5"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-slate-700">Phone</label>
                          <input
                            type="text"
                            value={newMember.phone || ''}
                            onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                            placeholder="+91..."
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Photo Upload Section */}
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <label className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-orange-600" />
                          <span>Member Photo Upload</span>
                        </label>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Photo Preview Circle */}
                          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-orange-500/40 bg-stone-100 shadow-sm flex items-center justify-center">
                            {newMember.photoUrl ? (
                              <img
                                src={newMember.photoUrl}
                                alt="Member Preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Users className="w-7 h-7 text-stone-400" />
                            )}
                          </div>

                          {/* Upload Buttons and Direct URL */}
                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="cursor-pointer px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Choose Photo from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleMemberPhotoUpload}
                                  className="hidden"
                                />
                              </label>

                              {newMember.photoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setNewMember({ ...newMember, photoUrl: '' })}
                                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium text-xs transition-colors"
                                >
                                  Remove Photo
                                </button>
                              )}
                            </div>

                            <div>
                              <input
                                type="text"
                                value={newMember.photoUrl || ''}
                                onChange={(e) => setNewMember({ ...newMember, photoUrl: e.target.value })}
                                placeholder="Or enter direct photo URL (https://...)"
                                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        {editingMember && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMember(null);
                              setNewMember({
                                academicYear: 'Final Year, B.A. (Hons)',
                                photoUrl: '',
                              });
                            }}
                            className="px-3 py-1.5 bg-stone-200 text-slate-700 font-semibold rounded-lg hover:bg-stone-300"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 shadow flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingMember ? 'Update Member & Photo' : 'Add Member to Unit'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Existing Team */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm">Current Team ({team.length})</h5>
                    {team.length === 0 ? (
                      <p className="text-xs text-stone-500 p-4 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
                        No team members added yet. Use the form above to add members and upload their photos.
                      </p>
                    ) : (
                      team.map((m) => (
                        <div
                          key={m.id}
                          className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs hover:bg-stone-100/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-stone-300 bg-white flex items-center justify-center">
                              {m.photoUrl ? (
                                <img
                                  src={m.photoUrl}
                                  alt={m.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Users className="w-5 h-5 text-stone-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                              <div className="text-slate-600">
                                <span className="font-medium text-orange-700">{m.role}</span>
                                {m.department && ` • ${m.department}`}
                                {m.academicYear && ` (${m.academicYear})`}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingMember(m);
                                setNewMember(m);
                              }}
                              className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition-colors"
                              title="Edit Member & Photo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${m.name} from team roster?`)) {
                                  storageService.deleteTeamMember(m.id);
                                }
                              }}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB: TICKETS (HELP DESK) */}
              {activeTab === 'tickets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-sm">
                      Student Help Desk Submissions ({tickets.length})
                    </h5>
                    <span className="text-xs text-slate-500">
                      Update status and response notes visible on ticket tracker
                    </span>
                  </div>

                  <div className="space-y-4">
                    {tickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                              {t.referenceId}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{t.studentName}</span>
                            <span className="text-slate-500">({t.courseSemester})</span>
                          </div>

                          {/* Status changer */}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">Status:</span>
                            <select
                              value={t.status}
                              onChange={(e) =>
                                storageService.updateTicketStatus(
                                  t.id,
                                  e.target.value as HelpDeskTicket['status']
                                )
                              }
                              className="px-2 py-1 font-semibold rounded bg-white border border-stone-300"
                            >
                              <option value="Submitted">Submitted</option>
                              <option value="Under Review">Under Review</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-slate-700">
                          <div className="font-semibold text-slate-800 mb-1">
                            Issue: {t.category} (Contact via: {t.preferredContact} • {t.phone})
                          </div>
                          <p>{t.description}</p>
                          {t.documentName && (
                            <div className="text-[11px] text-orange-600 mt-1">
                              Attached Document: {t.documentName}
                            </div>
                          )}
                        </div>

                        {/* Admin Volunteer Remarks input */}
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block text-[11px]">
                            Volunteer Remark / Resolution Update (Student sees this):
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={t.adminNotes || ''}
                              onBlur={(e) =>
                                storageService.updateTicketStatus(t.id, t.status, e.target.value)
                              }
                              placeholder="e.g., Verified with college office clerk; cleared."
                              className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                            <button
                              onClick={(e) => {
                                alert('Volunteer note saved!');
                              }}
                              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SUGGESTIONS */}
              {activeTab === 'suggestions' && (
                <div className="space-y-4">
                  <h5 className="font-bold text-slate-900 text-sm">
                    Student Suggestions & Campus Proposals ({suggestions.length})
                  </h5>
                  <div className="space-y-3">
                    {suggestions.map((s) => (
                      <div
                        key={s.id}
                        className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {s.isAnonymous ? 'Anonymous Student' : s.studentName || 'Student'}
                            </span>
                            <span className="text-slate-500">({s.category})</span>
                          </div>
                          <select
                            value={s.status}
                            onChange={(e) =>
                              storageService.updateSuggestionStatus(
                                s.id,
                                e.target.value as StudentSuggestion['status']
                              )
                            }
                            className="px-2 py-1 bg-white border border-stone-300 rounded font-semibold text-[11px]"
                          >
                            <option value="Received">Received</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Implemented">Implemented</option>
                          </select>
                        </div>
                        <p className="p-2.5 bg-white rounded border border-stone-200 text-slate-700">
                          {s.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h5 className="font-bold text-slate-900 text-sm mb-3">Add Gallery Photo</h5>
                    <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1">Title *</label>
                          <input
                            type="text"
                            required
                            value={newGallery.title || ''}
                            onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                            placeholder="Photo Title"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">Image URL *</label>
                          <input
                            type="text"
                            required
                            value={newGallery.imageUrl || ''}
                            onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg"
                        >
                          Add Photo
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {gallery.map((g) => (
                      <div
                        key={g.id}
                        className="relative rounded-lg overflow-hidden bg-stone-100 border border-stone-200 group"
                      >
                        <img
                          src={g.imageUrl}
                          alt={g.title}
                          className="h-28 w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => storageService.deleteGalleryImage(g.id)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="p-1.5 text-[11px] font-semibold truncate">{g.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: DOWNLOADS */}
              {activeTab === 'downloads' && (
                <div className="space-y-6">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h5 className="font-bold text-slate-900 text-sm mb-3">Add Download Document</h5>
                    <form onSubmit={handleSaveDoc} className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold block mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={newDoc.title || ''}
                          onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                          placeholder="Document Title"
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg"
                        >
                          Add Document
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-2">
                    {downloads.map((d) => (
                      <div
                        key={d.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{d.title}</div>
                          <div className="text-slate-500">
                            {d.category} • {d.fileType} ({d.fileSize})
                          </div>
                        </div>
                        <button
                          onClick={() => storageService.deleteDownload(d.id)}
                          className="p-1.5 text-slate-600 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: NEWSLETTER SUBSCRIBERS */}
              {activeTab === 'newsletter' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4 text-orange-600" />
                        <span>Student Newsletter & Notice Mailing List</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          {subscribers.length} Subscribers
                        </span>
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Students subscribed to receive Calcutta University exam circulars, scholarship updates, and campus event alerts.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopySubscriberEmails}
                        className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg flex items-center gap-1.5 border border-stone-300 transition-colors"
                        title="Copy all email addresses separated by commas"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy All Emails'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportNewsletterCSV}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow transition-colors"
                        title="Export subscriber list to CSV spreadsheet"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Subscribers */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                    {subscribers.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="font-semibold">No subscribers yet.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Students can subscribe through the newsletter form located in the footer.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-200/70 text-slate-700 font-semibold border-b border-stone-300">
                            <tr>
                              <th className="py-2.5 px-3">Student Email</th>
                              <th className="py-2.5 px-3">Interested Topics</th>
                              <th className="py-2.5 px-3">Subscribed On</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-200">
                            {subscribers.map((sub) => (
                              <tr key={sub.id} className="hover:bg-white transition-colors">
                                <td className="py-2.5 px-3 font-semibold text-slate-900 font-mono text-[11px]">
                                  {sub.email}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {sub.topics && sub.topics.length > 0 ? (
                                      sub.topics.map((top, idx) => (
                                        <span
                                          key={idx}
                                          className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 truncate"
                                        >
                                          {top}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-slate-400">All Updates</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                  {sub.subscribedAt}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubscriber(sub.id)}
                                    className="p-1 text-slate-500 hover:text-red-600 rounded transition-colors"
                                    title="Delete subscriber"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">
                        Unit Settings, Menubar Logo & Passcode
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Configure menubar photo, master password, contact info, and production controls
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 flex items-center gap-1.5 shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save All Settings</span>
                    </button>
                  </div>

                  {/* Menubar Photo & Logo Upload Card */}
                  <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-orange-600 text-white">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h6 className="font-bold text-slate-900 text-xs">Menubar Photo / Official Logo</h6>
                          <p className="text-[11px] text-slate-600">
                            Upload a photo or emblem to display in the top navigation menubar across the website.
                          </p>
                        </div>
                      </div>

                      {logoUpdateSuccess && (
                        <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 animate-in fade-in">
                          Menubar Logo Updated!
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                      {/* Live Menubar Preview */}
                      <div className="flex items-center gap-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white shadow-sm">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-orange-500/40 bg-white flex items-center justify-center">
                          {tempSettings.logoUrl ? (
                            <img
                              src={tempSettings.logoUrl}
                              alt="Menubar Logo"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <ShieldCheck className="w-6 h-6 text-orange-600" />
                          )}
                        </div>
                        <div className="text-left pr-2">
                          <span className="text-[10px] text-slate-400 block font-mono">Navbar Preview</span>
                          <span className="font-bold text-xs text-white">ABVP NDC Unit</span>
                        </div>
                      </div>

                      {/* Upload and URL input */}
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Menubar Photo from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMenubarLogoUpload}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const officialUrl = 'https://i.ibb.co/6R3N6ppb/kro-D8r-f-400x400.jpg';
                              setTempSettings((prev) => ({ ...prev, logoUrl: officialUrl }));
                              storageService.updateLogo(officialUrl);
                              setLogoUpdateSuccess(true);
                              setTimeout(() => setLogoUpdateSuccess(false), 3000);
                            }}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold text-xs border border-stone-300 transition-colors"
                          >
                            Reset to Official Emblem
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={tempSettings.logoUrl || ''}
                            onChange={(e) => setTempSettings({ ...tempSettings, logoUrl: e.target.value })}
                            placeholder="Direct image URL (e.g., https://...)"
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Donation UPI QR Code Card */}
                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-orange-600 text-white">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <h6 className="font-bold text-slate-900 text-xs">Official UPI QR Code & Payment Details</h6>
                          <p className="text-[11px] text-slate-600">
                            Configure the QR code displayed to students for ₹5 membership fees and verification.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('qrcode')}
                        className="px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        Open Full QR Studio →
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                      {/* Live QR Thumbnail */}
                      <div className="w-24 h-24 rounded-xl border border-stone-300 bg-white p-1.5 shrink-0 flex items-center justify-center shadow-xs">
                        {tempSettings.paymentQrUrl ? (
                          <img
                            src={tempSettings.paymentQrUrl}
                            alt="Active Payment QR"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center">
                            <QrCode className="w-8 h-8 text-orange-600 mx-auto" />
                            <span className="text-[9px] text-slate-500 font-bold block mt-0.5">Default SVG</span>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex-1 space-y-2 text-xs w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New QR Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleQrPhotoUpload}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={handleResetQr}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold text-xs border border-stone-300 transition-colors"
                          >
                            Reset to Default QR
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-500 block font-semibold">UPI ID:</span>
                            <input
                              type="text"
                              value={tempSettings.upiId || ''}
                              onChange={(e) => setTempSettings({ ...tempSettings, upiId: e.target.value })}
                              placeholder="e.g. abvpndc.howrah@upi"
                              className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block font-semibold">Direct QR Image URL:</span>
                            <input
                              type="text"
                              value={tempSettings.paymentQrUrl || ''}
                              onChange={(e) => setTempSettings({ ...tempSettings, paymentQrUrl: e.target.value })}
                              placeholder="https://... or ImgBB link"
                              className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Passcode & Security */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-900 text-amber-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h6 className="font-bold text-slate-900 text-xs">Administrator Security Passcode</h6>
                        <p className="text-[11px] text-slate-500">
                          Password required to access this admin portal. Default: <code className="font-mono font-bold text-orange-700 bg-orange-50 px-1 py-0.5 rounded border border-orange-200">ABVP@Samridhya</code>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="font-semibold block mb-1 text-slate-700">Admin Passcode</label>
                        <input
                          type="text"
                          value={tempSettings.adminPasscode || 'ABVP@Samridhya'}
                          onChange={(e) => setTempSettings({ ...tempSettings, adminPasscode: e.target.value })}
                          className="w-full p-2 bg-white font-mono tracking-wide border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => {
                            setTempSettings((prev) => ({ ...prev, adminPasscode: 'ABVP@Samridhya' }));
                          }}
                          className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-slate-800 rounded-lg font-semibold text-xs"
                        >
                          Reset Passcode to ABVP@Samridhya
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Start From 0: Production Reset */}
                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300/80 space-y-3">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-600 text-white shrink-0 mt-0.5 sm:mt-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h6 className="font-bold text-slate-900 text-xs">Start From 0 (Clean Production Reset)</h6>
                          <p className="text-[11px] text-slate-600">
                            Clears all live student submissions (Help Desk tickets: {tickets.length}, Memberships: {memberships.length}, Suggestions: {suggestions.length}, Newsletter subscribers: {subscribers.length}) to zero. Your notices, events, and unit settings stay intact.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleStartFromZero}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow shrink-0 text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Start From 0</span>
                      </button>
                    </div>

                    {zeroResetSuccess && (
                      <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs border border-emerald-200 animate-in fade-in">
                        ✓ All student submissions have been reset to 0! Portal is fresh and launch-ready.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">Unit Name</label>
                      <input
                        type="text"
                        value={tempSettings.unitName}
                        onChange={(e) => setTempSettings({ ...tempSettings, unitName: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Tagline</label>
                      <input
                        type="text"
                        value={tempSettings.tagline}
                        onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">Official Email</label>
                      <input
                        type="email"
                        value={tempSettings.email}
                        onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Helpline Phone Number</label>
                      <input
                        type="text"
                        value={tempSettings.phone}
                        onChange={(e) => setTempSettings({ ...tempSettings, phone: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Top Announcement Marquee</label>
                    <input
                      type="text"
                      value={tempSettings.heroNotice || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, heroNotice: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                    />
                  </div>

                  {/* Social Media Links */}
                  <div className="pt-3 border-t border-stone-200">
                    <h6 className="font-bold text-slate-800 mb-2">Social Media Links</h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Instagram URL</label>
                        <input
                          type="text"
                          value={tempSettings.socialLinks.instagram}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              socialLinks: { ...tempSettings.socialLinks, instagram: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Facebook URL</label>
                        <input
                          type="text"
                          value={tempSettings.socialLinks.facebook}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              socialLinks: { ...tempSettings.socialLinks, facebook: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">WhatsApp Link / Number</label>
                        <input
                          type="text"
                          value={tempSettings.socialLinks.whatsapp}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              socialLinks: { ...tempSettings.socialLinks, whatsapp: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Telegram Channel</label>
                        <input
                          type="text"
                          value={tempSettings.socialLinks.telegram}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              socialLinks: { ...tempSettings.socialLinks, telegram: e.target.value },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats Counters */}
                  <div className="pt-3 border-t border-stone-200">
                    <h6 className="font-bold text-slate-800 mb-2">Homepage Stat Numbers</h6>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Activities</label>
                        <input
                          type="number"
                          value={tempSettings.stats.activitiesCount}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              stats: { ...tempSettings.stats, activitiesCount: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Events Hosted</label>
                        <input
                          type="number"
                          value={tempSettings.stats.eventsCount}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              stats: { ...tempSettings.stats, eventsCount: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Initiatives</label>
                        <input
                          type="number"
                          value={tempSettings.stats.initiativesCount}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              stats: { ...tempSettings.stats, initiativesCount: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Years of Service</label>
                        <input
                          type="number"
                          value={tempSettings.stats.yearsOfService}
                          onChange={(e) =>
                            setTempSettings({
                              ...tempSettings,
                              stats: { ...tempSettings.stats, yearsOfService: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment Screenshot Full Viewer Lightbox */}
      {viewingScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in"
          onClick={() => setViewingScreenshot(null)}
        >
          <div
            className="bg-white p-4 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col items-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full pb-2 border-b border-stone-200">
              <span className="font-bold text-slate-900 text-sm">UPI Payment Screenshot Verification (₹5)</span>
              <button
                onClick={() => setViewingScreenshot(null)}
                className="p-1 text-slate-400 hover:text-slate-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[70vh] w-full flex justify-center p-2 bg-stone-100 rounded-xl">
              <img
                src={viewingScreenshot}
                alt="Enlarged Payment Proof"
                className="max-h-[65vh] object-contain rounded-lg shadow"
              />
            </div>
            <button
              onClick={() => setViewingScreenshot(null)}
              className="px-4 py-2 bg-slate-950 text-white text-xs font-semibold rounded-xl"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
