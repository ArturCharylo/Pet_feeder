// FrequencyCalendar.tsx
import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import DayDetails from './CalendarPopup';
import '../styles/Calendar.css';

interface Props {
  feedFrequency: string;
}

const FrequencyCalendar: React.FC<Props> = ({ feedFrequency }) => {
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number } | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (!feedFrequency) return;

    const today = new Date();
    const dates: Date[] = [];
    let currentDate = new Date(today);

    // map feedFrequency to interval in days
    let interval = 0;
    switch (feedFrequency) {
      case 'Once a day':
        interval = 1;
        break;
      case 'Twice a day':
        interval = 0.5; // specjal case - twice a day
        break;
      case 'Every Other Day':
        interval = 2;
        break;
      case 'Every Three Days':
        interval = 3;
        break;
      case 'Once a week':
        interval = 7;
        break;
      case 'Twice a week':
        interval = 3.5; // 2 times a week is every 3.5 days
        break;
      case 'Every Two Weeks':
        interval = 14;
        break;
      case 'Once a month':
        interval = 30;
        break;
    }
    

    // Handling the special case for "Twice a day"
    if (interval === 0.5) {
      // Add dates for twice a day
      for (let i = 0; i < 60; i++) {
        console.log(`Adding date: ${currentDate.toISOString()}`);
        dates.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000); // every 12 hours
      }
    } else if (interval > 0) {
      for (let i = 0; i < 30; i++) {
        dates.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000);
      }
    }

    setHighlightedDates(dates);
  }, [feedFrequency]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    }

    if (selectedDate) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
  };}, [selectedDate]);

  const getDate = (date: Date) => {
    setSelectedDate(date)
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  }

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
          const rect = (event.target as HTMLElement).getBoundingClientRect();
          setPopupPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
          });
        }}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const count = highlightedDates.filter(d =>
              d.toDateString() === date.toDateString()
            ).length;
            if (count === 2) return 'highlight-twice';
            if (count === 1) return 'highlight-once';
          }
          return null;
        }}
      />
      {selectedDate && popupPosition && (
        <div
          className="popup-wrapper"
          ref={popupRef}
          style={{
            position: 'absolute',
            top: popupPosition.top - 15,
            left: popupPosition.left,
            zIndex: 1000
          }}
        >
          <DayDetails date={selectedDate} onClose={closePopup} />
        </div>
      )}

    </>
  );
};

export default FrequencyCalendar;
