// FrequencyCalendar.tsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../styles/Calendar.css';

interface Props {
  feedFrequency: string;
}

const FrequencyCalendar: React.FC<Props> = ({ feedFrequency }) => {
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

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

  return (
    <Calendar
      calendarType="iso8601"
      locale="pl-PL"
      minDetail="month"
      tileClassName={({ date, view }) => {
        if (view === 'month') {
          const count = highlightedDates.filter(d =>
            d.toDateString() === date.toDateString()
          ).length;

          if (count === 2) return 'highlight-twice';
          if (count === 1) return 'highlight-once';
          return null;
        }
      }}
    />
  );
};

export default FrequencyCalendar;
