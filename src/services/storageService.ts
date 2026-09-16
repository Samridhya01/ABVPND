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
} from '../types';
import {
  initialSettings,
  initialNotices,
  initialEvents,
  initialTeamMembers,
  initialActivities,
  initialTickets,
  initialSuggestions,
  initialGallery,
  initialDownloads,
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'abvp_ndc_settings',
  NOTICES: 'abvp_ndc_notices',
  EVENTS: 'abvp_ndc_events',
  TEAM: 'abvp_ndc_team',
  ACTIVITIES: 'abvp_ndc_activities',
  TICKETS: 'abvp_ndc_tickets',
  SUGGESTIONS: 'abvp_ndc_suggestions',
  GALLERY: 'abvp_ndc_gallery',
  DOWNLOADS: 'abvp_ndc_downloads',
  MEMBERSHIPS: 'abvp_ndc_memberships',
  ADMIN_AUTH: 'abvp_ndc_admin_auth',
};

const initialMemberships: MembershipApplication[] = [
  {
    id: 'mem-1',
    membershipId: 'ABVP-NDC-MEM-2026-0108',
    name: 'Debasish Banerjee',
    phone: '+91 98301 22419',
    address: '42, Netaji Subhas Road, Howrah',
    semester: '3rd Semester',
    stream: 'B.A. Political Science (Hons)',
    paymentAmount: 5,
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    paymentStatus: 'Approved',
    submittedAt: '2026-09-12T10:30:00.000Z',
    adminNotes: 'Payment verified via UPI. Physical badge issued.',
  },
  {
    id: 'mem-2',
    membershipId: 'ABVP-NDC-MEM-2026-0109',
    name: 'Priyanka Mukherjee',
    phone: '+91 94330 88214',
    address: '18/A, Belilious Lane, Kadamtala, Howrah',
    semester: '1st Semester',
    stream: 'B.Sc. Chemistry (Hons)',
    paymentAmount: 5,
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    paymentStatus: 'Pending Verification',
    submittedAt: '2026-09-15T14:15:00.000Z',
    adminNotes: 'New 1st Year member application.',
  },
];

// Dispatch custom event for cross-component reactive updates
function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('abvp_data_updated'));
  }
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyChange();
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const storageService = {
  // --- Settings ---
  getSettings(): UnitSettings {
    return getItem<UnitSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  },
  updateSettings(newSettings: UnitSettings): void {
    setItem(STORAGE_KEYS.SETTINGS, newSettings);
  },

  // --- Notices ---
  getNotices(): Notice[] {
    return getItem<Notice[]>(STORAGE_KEYS.NOTICES, initialNotices);
  },
  saveNotice(notice: Notice): void {
    const list = this.getNotices();
    const index = list.findIndex((n) => n.id === notice.id);
    if (index >= 0) {
      list[index] = notice;
    } else {
      list.unshift(notice);
    }
    setItem(STORAGE_KEYS.NOTICES, list);
  },
  deleteNotice(id: string): void {
    const list = this.getNotices().filter((n) => n.id !== id);
    setItem(STORAGE_KEYS.NOTICES, list);
  },

  // --- Events ---
  getEvents(): UnitEvent[] {
    return getItem<UnitEvent[]>(STORAGE_KEYS.EVENTS, initialEvents);
  },
  saveEvent(event: UnitEvent): void {
    const list = this.getEvents();
    const index = list.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      list[index] = event;
    } else {
      list.unshift(event);
    }
    setItem(STORAGE_KEYS.EVENTS, list);
  },
  deleteEvent(id: string): void {
    const list = this.getEvents().filter((e) => e.id !== id);
    setItem(STORAGE_KEYS.EVENTS, list);
  },
  registerForEvent(eventId: string): boolean {
    const list = this.getEvents();
    const event = list.find((e) => e.id === eventId);
    if (event) {
      event.registrationCount = (event.registrationCount || 0) + 1;
      setItem(STORAGE_KEYS.EVENTS, list);
      return true;
    }
    return false;
  },

  // --- Team ---
  getTeam(): TeamMember[] {
    return getItem<TeamMember[]>(STORAGE_KEYS.TEAM, initialTeamMembers);
  },
  saveTeamMember(member: TeamMember): void {
    const list = this.getTeam();
    const index = list.findIndex((m) => m.id === member.id);
    if (index >= 0) {
      list[index] = member;
    } else {
      list.push(member);
    }
    setItem(STORAGE_KEYS.TEAM, list);
  },
  deleteTeamMember(id: string): void {
    const list = this.getTeam().filter((m) => m.id !== id);
    setItem(STORAGE_KEYS.TEAM, list);
  },

  // --- Activities ---
  getActivities(): ActivityItem[] {
    return getItem<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, initialActivities);
  },
  saveActivity(activity: ActivityItem): void {
    const list = this.getActivities();
    const index = list.findIndex((a) => a.id === activity.id);
    if (index >= 0) {
      list[index] = activity;
    } else {
      list.unshift(activity);
    }
    setItem(STORAGE_KEYS.ACTIVITIES, list);
  },
  deleteActivity(id: string): void {
    const list = this.getActivities().filter((a) => a.id !== id);
    setItem(STORAGE_KEYS.ACTIVITIES, list);
  },

  // --- Help Desk Tickets ---
  getTickets(): HelpDeskTicket[] {
    return getItem<HelpDeskTicket[]>(STORAGE_KEYS.TICKETS, initialTickets);
  },
  submitTicket(ticketData: Omit<HelpDeskTicket, 'id' | 'referenceId' | 'status' | 'submittedAt'>): HelpDeskTicket {
    const list = this.getTickets();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `ABVP-NDC-2026-${randomNum}`;
    const newTicket: HelpDeskTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      referenceId,
      status: 'Submitted',
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };
    list.unshift(newTicket);
    setItem(STORAGE_KEYS.TICKETS, list);
    return newTicket;
  },
  updateTicketStatus(id: string, status: HelpDeskTicket['status'], adminNotes?: string): void {
    const list = this.getTickets();
    const ticket = list.find((t) => t.id === id);
    if (ticket) {
      ticket.status = status;
      if (adminNotes !== undefined) ticket.adminNotes = adminNotes;
      ticket.updatedAt = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      setItem(STORAGE_KEYS.TICKETS, list);
    }
  },
  findTicketByReference(refId: string): HelpDeskTicket | undefined {
    const clean = refId.trim().toUpperCase();
    return this.getTickets().find((t) => t.referenceId.toUpperCase() === clean);
  },

  // --- Suggestions ---
  getSuggestions(): StudentSuggestion[] {
    return getItem<StudentSuggestion[]>(STORAGE_KEYS.SUGGESTIONS, initialSuggestions);
  },
  submitSuggestion(data: Omit<StudentSuggestion, 'id' | 'submittedAt' | 'status'>): StudentSuggestion {
    const list = this.getSuggestions();
    const newSug: StudentSuggestion = {
      ...data,
      id: `sug-${Date.now()}`,
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'Received',
    };
    list.unshift(newSug);
    setItem(STORAGE_KEYS.SUGGESTIONS, list);
    return newSug;
  },
  updateSuggestionStatus(id: string, status: StudentSuggestion['status']): void {
    const list = this.getSuggestions();
    const sug = list.find((s) => s.id === id);
    if (sug) {
      sug.status = status;
      setItem(STORAGE_KEYS.SUGGESTIONS, list);
    }
  },

  // --- Gallery ---
  getGallery(): GalleryImage[] {
    return getItem<GalleryImage[]>(STORAGE_KEYS.GALLERY, initialGallery);
  },
  saveGalleryImage(image: GalleryImage): void {
    const list = this.getGallery();
    const index = list.findIndex((g) => g.id === image.id);
    if (index >= 0) {
      list[index] = image;
    } else {
      list.unshift(image);
    }
    setItem(STORAGE_KEYS.GALLERY, list);
  },
  deleteGalleryImage(id: string): void {
    const list = this.getGallery().filter((g) => g.id !== id);
    setItem(STORAGE_KEYS.GALLERY, list);
  },

  // --- Downloads ---
  getDownloads(): DownloadDocument[] {
    return getItem<DownloadDocument[]>(STORAGE_KEYS.DOWNLOADS, initialDownloads);
  },
  saveDownload(doc: DownloadDocument): void {
    const list = this.getDownloads();
    const index = list.findIndex((d) => d.id === doc.id);
    if (index >= 0) {
      list[index] = doc;
    } else {
      list.unshift(doc);
    }
    setItem(STORAGE_KEYS.DOWNLOADS, list);
  },
  deleteDownload(id: string): void {
    const list = this.getDownloads().filter((d) => d.id !== id);
    setItem(STORAGE_KEYS.DOWNLOADS, list);
  },

  // --- Memberships (₹5 Student Drive) ---
  getMemberships(): MembershipApplication[] {
    return getItem<MembershipApplication[]>(STORAGE_KEYS.MEMBERSHIPS, initialMemberships);
  },
  submitMembership(
    data: Omit<MembershipApplication, 'id' | 'membershipId' | 'paymentAmount' | 'paymentStatus' | 'submittedAt'>
  ): MembershipApplication {
    const list = this.getMemberships();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newMembership: MembershipApplication = {
      ...data,
      id: `mem-${Date.now()}`,
      membershipId: `ABVP-NDC-MEM-2026-${randomSuffix}`,
      paymentAmount: 5,
      paymentStatus: 'Pending Verification',
      submittedAt: new Date().toISOString(),
    };
    list.unshift(newMembership);
    setItem(STORAGE_KEYS.MEMBERSHIPS, list);
    return newMembership;
  },
  updateMembershipStatus(
    id: string,
    status: MembershipApplication['paymentStatus'],
    adminNotes?: string
  ): void {
    const list = this.getMemberships().map((m) => {
      if (m.id === id) {
        return {
          ...m,
          paymentStatus: status,
          adminNotes: adminNotes !== undefined ? adminNotes : m.adminNotes,
        };
      }
      return m;
    });
    setItem(STORAGE_KEYS.MEMBERSHIPS, list);
  },
  deleteMembership(id: string): void {
    const list = this.getMemberships().filter((m) => m.id !== id);
    setItem(STORAGE_KEYS.MEMBERSHIPS, list);
  },

  // --- Admin Authentication (Client-side Session) ---
  isAdminLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },
  setAdminLoggedIn(status: boolean): void {
    if (typeof window === 'undefined') return;
    if (status) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
    notifyChange();
  },

  // --- Reset & Export ---
  resetAllToDefault(): void {
    setItem(STORAGE_KEYS.SETTINGS, initialSettings);
    setItem(STORAGE_KEYS.NOTICES, initialNotices);
    setItem(STORAGE_KEYS.EVENTS, initialEvents);
    setItem(STORAGE_KEYS.TEAM, initialTeamMembers);
    setItem(STORAGE_KEYS.ACTIVITIES, initialActivities);
    setItem(STORAGE_KEYS.TICKETS, initialTickets);
    setItem(STORAGE_KEYS.SUGGESTIONS, initialSuggestions);
    setItem(STORAGE_KEYS.GALLERY, initialGallery);
    setItem(STORAGE_KEYS.DOWNLOADS, initialDownloads);
    setItem(STORAGE_KEYS.MEMBERSHIPS, initialMemberships);
  },

  exportDatabaseJSON(): string {
    const dump = {
      settings: this.getSettings(),
      notices: this.getNotices(),
      events: this.getEvents(),
      team: this.getTeam(),
      activities: this.getActivities(),
      tickets: this.getTickets(),
      suggestions: this.getSuggestions(),
      gallery: this.getGallery(),
      downloads: this.getDownloads(),
      memberships: this.getMemberships(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(dump, null, 2);
  },
};
