import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { TeamSection } from './components/TeamSection';
import { NoticesSection } from './components/NoticesSection';
import { EventsSection } from './components/EventsSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { HelpDeskSection } from './components/HelpDeskSection';
import { SuggestionsSection } from './components/SuggestionsSection';
import { GallerySection } from './components/GallerySection';
import { DownloadsSection } from './components/DownloadsSection';
import { ContactSection } from './components/ContactSection';
import { MembershipSection } from './components/MembershipSection';
import { Footer } from './components/Footer';

// Modals
import { TicketTrackerModal } from './components/TicketTrackerModal';
import { AdminModal } from './components/AdminModal';
import { SearchModal } from './components/SearchModal';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { EventRegisterModal } from './components/EventRegisterModal';
import { MembershipRegistrationModal } from './components/MembershipRegistrationModal';
import { VidyarthiChatbot } from './components/VidyarthiChatbot';

import { storageService } from './services/storageService';
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
} from './types';

export default function App() {
  // Application Data States
  const [settings, setSettings] = useState<UnitSettings>(storageService.getSettings());
  const [notices, setNotices] = useState<Notice[]>(storageService.getNotices());
  const [events, setEvents] = useState<UnitEvent[]>(storageService.getEvents());
  const [team, setTeam] = useState<TeamMember[]>(storageService.getTeam());
  const [activities, setActivities] = useState<ActivityItem[]>(storageService.getActivities());
  const [tickets, setTickets] = useState<HelpDeskTicket[]>(storageService.getTickets());
  const [suggestions, setSuggestions] = useState<StudentSuggestion[]>(storageService.getSuggestions());
  const [gallery, setGallery] = useState<GalleryImage[]>(storageService.getGallery());
  const [downloads, setDownloads] = useState<DownloadDocument[]>(storageService.getDownloads());

  // Auth & Modal States
  const [isAdmin, setIsAdmin] = useState<boolean>(storageService.isAdminLoggedIn());
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState<boolean>(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState<boolean>(false);
  const [trackerPrefillId, setTrackerPrefillId] = useState<string | undefined>(undefined);

  // Detail & Registration Modals
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<UnitEvent | null>(null);

  // Sync data whenever storage updates
  const reloadData = () => {
    setSettings(storageService.getSettings());
    setNotices(storageService.getNotices());
    setEvents(storageService.getEvents());
    setTeam(storageService.getTeam());
    setActivities(storageService.getActivities());
    setTickets(storageService.getTickets());
    setSuggestions(storageService.getSuggestions());
    setGallery(storageService.getGallery());
    setDownloads(storageService.getDownloads());
    setIsAdmin(storageService.isAdminLoggedIn());
  };

  useEffect(() => {
    const handleUpdate = () => reloadData();
    window.addEventListener('abvp_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('abvp_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenTracker = (refId?: string) => {
    setTrackerPrefillId(refId);
    setIsTrackerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-orange-600 selection:text-white">
      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar
        settings={settings}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenTracker={() => handleOpenTracker()}
        onOpenMembership={() => setIsMembershipModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Main Single-Page Content */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          settings={settings}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenTracker={() => handleOpenTracker()}
          onOpenMembership={() => setIsMembershipModalOpen(true)}
        />

        {/* 2. About Section */}
        <AboutSection />

        {/* 2.5. Official Membership Drive Section (₹5) */}
        <MembershipSection
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          onOpenMembershipModal={() => setIsMembershipModalOpen(true)}
        />

        {/* 3. Team & Office Bearers Section */}
        <TeamSection
          team={team}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 4. Notice Board Section */}
        <NoticesSection
          notices={notices}
          onSelectNotice={(notice) => setSelectedNotice(notice)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 5. Events Section */}
        <EventsSection
          events={events}
          onRegisterEvent={(event) => setRegisteringEvent(event)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 6. Activities & Campaigns Section */}
        <ActivitiesSection
          activities={activities}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 7. Student Help Desk & Grievance Portal */}
        <HelpDeskSection
          onOpenTracker={(refId) => handleOpenTracker(refId)}
        />

        {/* 8. Student Suggestion Box */}
        <SuggestionsSection />

        {/* 9. Photo & Activity Gallery */}
        <GallerySection
          images={gallery}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 10. Documents & Downloads */}
        <DownloadsSection
          downloads={downloads}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 11. Contact Us & Campus Location */}
        <ContactSection settings={settings} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenTracker={() => handleOpenTracker()}
      />

      {/* MODALS */}
      {/* 1. Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        notices={notices}
        events={events}
        team={team}
        activities={activities}
        downloads={downloads}
        onSelectNotice={(notice) => setSelectedNotice(notice)}
      />

      {/* 2. Ticket Status Tracker Modal */}
      <TicketTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        initialRefId={trackerPrefillId}
      />

      {/* 3. Notice Detail Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

      {/* 4. Event Registration Modal */}
      <EventRegisterModal
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        onSuccess={() => reloadData()}
      />

      {/* 5. Admin Portal Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLoginSuccess={() => reloadData()}
        onLogout={() => reloadData()}
        settings={settings}
        notices={notices}
        events={events}
        team={team}
        activities={activities}
        tickets={tickets}
        suggestions={suggestions}
        gallery={gallery}
        downloads={downloads}
      />

      {/* 6. Dedicated Membership Registration Modal */}
      <MembershipRegistrationModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        onSuccess={() => reloadData()}
      />

      {/* 7. Floating AI Vidyarthi Chatbot Assistant */}
      <VidyarthiChatbot />
    </div>
  );
}
