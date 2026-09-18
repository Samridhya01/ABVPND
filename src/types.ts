export interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'Academic' | 'Student Issues' | 'Events' | 'Activities' | 'General';
  description: string;
  details?: string;
  isPinned?: boolean;
  attachmentName?: string;
  attachmentSize?: string;
}

export interface UnitEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: 'Upcoming' | 'Past';
  description: string;
  posterUrl: string;
  isRegistrationOpen?: boolean;
  registrationCount?: number;
  contactPerson?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  academicYear: string;
  photoUrl: string;
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  date: string;
  category: 'Welfare' | 'Education' | 'Social Service' | 'Cultural' | 'Awareness' | 'Campus';
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  keyOutcomes?: string[];
}

export interface HelpDeskTicket {
  id: string;
  referenceId: string;
  studentName: string;
  email: string;
  phone: string;
  courseSemester: string;
  category: 'Academic' | 'Examination' | 'Scholarship' | 'College Administration' | 'Student Facilities' | 'Fees' | 'Hostel/Transport' | 'Other';
  description: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
  documentName?: string;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';
  adminNotes?: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface StudentSuggestion {
  id: string;
  isAnonymous: boolean;
  studentName?: string;
  courseSemester?: string;
  category: 'Campus Infrastructure' | 'Library & Academics' | 'Cultural & Sports' | 'Canteen & Facilities' | 'General Student Life';
  suggestion: string;
  contactInfo?: string;
  submittedAt: string;
  status: 'Received' | 'Reviewed' | 'Implemented';
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Events' | 'Programmes' | 'Campaigns' | 'Social Activities' | 'College Life';
  imageUrl: string;
  date: string;
  description?: string;
}

export interface DownloadDocument {
  id: string;
  title: string;
  category: 'Notices' | 'Forms' | 'Scholarships' | 'Academic' | 'Reports' | 'Guidelines';
  fileType: 'PDF' | 'DOC' | 'ZIP';
  fileSize: string;
  uploadDate: string;
  description: string;
  url?: string;
}

export interface UnitSettings {
  unitName: string;
  parentOrg: string;
  collegeName: string;
  collegeAddress: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phone: string;
  helplineTiming: string;
  tagline: string;
  heroNotice?: string;
  bannerAlertActive: boolean;
  logoUrl?: string;
  adminPasscode?: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    x: string;
    youtube: string;
    telegram: string;
    whatsapp: string;
  };
  stats: {
    activitiesCount: number;
    eventsCount: number;
    initiativesCount: number;
    yearsOfService: number;
    activeVolunteers: number;
  };
  disclaimer: string;
}

export interface MembershipApplication {
  id: string;
  membershipId: string; // e.g. ABVP-NDC-MEM-2026-0042
  name: string;
  phone: string;
  address: string;
  semester: string; // e.g. 1st Sem, 2nd Sem, etc.
  stream: string; // e.g. B.A. (Hons), B.Sc. (Gen), B.Com
  paymentAmount: number; // 5
  paymentScreenshotUrl: string; // base64 or receipt image URL
  paymentStatus: 'Pending Verification' | 'Approved' | 'Rejected';
  submittedAt: string;
  adminNotes?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  interests?: string[];
  status: 'Active' | 'Unsubscribed';
}
