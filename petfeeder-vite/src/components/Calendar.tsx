// src/components/Calendar.tsx
import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import DayDetails from './CalendarPopup';
import FeedingHistoryModal from './FeedingHistoryModal';
import '../styles/Calendar.css';

import { requestNotificationPermission, sendNotification } from '../hooks/useNotifications';
import { useFeedingData } from '../hooks/useFeedingData';
import { useHighlightedDates } from '../hooks/useHighlightedDates';

interface Props {
  feedFrequency: string;
}

const FrequencyCalendar: React.FC<Props> = ({ feedFrequency }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number } | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);
  
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Custom Hooks managing business logic
  const highlightedDates = useHighlightedDates(feedFrequency);
  const { feedingData, handleSaveFeeding, handleDelete, handleEdit } = useFeedingData();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Set up daily notification at 18:00
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const now = new Date();
      const targetHour = 18;
      let intervalId: number; // Capture interval ID to prevent memory leaks

      const millisTillTarget = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        targetHour, 0, 0
      ).getTime() - now.getTime();

      const checkAndNotify = () => {
        const todayStr = new Date().toDateString();
        const isHighlighted = highlightedDates.some(date => date.toDateString() === todayStr);

        if (isHighlighted) {
          const wasFedToday = feedingData.some(
            record => record.date.toDateString() === todayStr && record.wasFed === true
          );

          if (!wasFedToday) {
            sendNotification('Przypomnienie', {
              body: 'Pora nakarmić zwierzaka! 🐱',
              icon: '/Pet_feeder.png',
            });
          }
        }
      };

      const timeout = setTimeout(() => {
        checkAndNotify();
        // Repeat every 24h
        intervalId = window.setInterval(checkAndNotify, 24 * 60 * 60 * 1000);
      }, Math.max(millisTillTarget, 0)); // If the target time is in the past, set to 0

      // Cleanup function for timeouts and intervals
      return () => {
        clearTimeout(timeout);
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [highlightedDates, feedingData]);

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closePopup();
      }
    }
    if (selectedDate) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDate]);

  const getDate = (date: Date) => {
    setSelectedDate(date);
    return date.toISOString().split('T')[0];
  };

  const closePopup = () => {
    setSelectedDate(null);
    setPopupPosition(null);
  };

  return (
    <>
      <Calendar
        calendarType="iso8601"
        locale="pl-PL"
        minDetail="month"
        onClickDay={(date, event) => {
          getDate(date);
          if (isSmallScreen) {
            setPopupPosition(null); 
          } else {
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            setPopupPosition({
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX
            });
          }
        }}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const count = highlightedDates.filter(d => d.toDateString() === date.toDateString()).length;
            if (count === 2) return 'highlight-twice';
            if (count === 1) return 'highlight-once';
          }
          return null;
        }}
      />

      {/* Popup details for a specific day */}
      {selectedDate && (
        <div
          className={`popup-wrapper ${isSmallScreen ? 'popup-small-screen' : 'popup-large-screen'}`}
          ref={popupRef}
          style={!isSmallScreen && popupPosition ? { top: popupPosition.top - 15, left: popupPosition.left } : undefined}
        >
          <DayDetails date={selectedDate} onClose={closePopup} onSave={handleSaveFeeding}/>
        </div>
      )}
      
      {/* Feeding history button */}
      {!showPopup && (
        <button className="show-popup-button top-right" onClick={() => setShowPopup(true)}>
          Show Feeding history
        </button>
      )}

      {/* Feeding History and Edit/Delete Modals extracted to external component */}
      {showPopup && (
        <FeedingHistoryModal 
          feedingData={feedingData}
          onClose={() => setShowPopup(false)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </>
  );
};

export default FrequencyCalendar;