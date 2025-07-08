// FrequencyCalendar.tsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../index.css';

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

    // Mapowanie feedFrequency na liczbę dni odstępu
    let interval = 0;
    switch (feedFrequency) {
      case 'Once a day':
        interval = 1;
        break;
      case 'Twice a day':
        interval = 0.5; // Specjalny przypadek – 2 razy dziennie
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
        interval = 3.5; // 2 razy w tygodniu → co ~3–4 dni
        break;
      case 'Every Two Weeks':
        interval = 14;
        break;
      case 'Once a month':
        interval = 30;
        break;
    }

    // Obsługa specjalnego przypadku "Twice a day"
    if (interval === 0.5) {
      // Dodajemy dwie daty na każdy dzień (np. rano i wieczorem)
      for (let i = 0; i < 30; i++) {
        dates.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000); // co 12h
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
      tileClassName={({ date, view }) => {
        if (view === 'month') {
          const found = highlightedDates.find(d =>
            d.toDateString() === date.toDateString()
          );
          return found ? 'highlight' : null;
        }
      }}
    />
  );
};

export default FrequencyCalendar;
