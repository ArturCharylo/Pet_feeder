// src/hooks/useHighlightedDates.ts
import { useState, useEffect } from 'react';

export const useHighlightedDates = (feedFrequency: string) => {
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

  // Load highlighted dates from localStorage on initial render
  useEffect(() => {
    const storedDates = localStorage.getItem('highlightedDates');
    if (storedDates) {
      const parsedDates = JSON.parse(storedDates).map((isoString: string) => new Date(isoString));
      setHighlightedDates(parsedDates);
    }
  }, []);

  useEffect(() => {
    if (!feedFrequency) return;

    const today = new Date();
    const dates: Date[] = [];
    let currentDate = new Date(today);

    // Map feedFrequency to interval in days
    let interval = 0;
    switch (feedFrequency) {
      case 'Once a day': interval = 1; break;
      case 'Twice a day': interval = 0.5; break; // Special case - twice a day
      case 'Every Other Day': interval = 2; break;
      case 'Every Three Days': interval = 3; break;
      case 'Once a week': interval = 7; break;
      case 'Twice a week': interval = 3.5; break; // 2 times a week is every 3.5 days
      case 'Every Two Weeks': interval = 14; break;
      case 'Once a month': interval = 30; break;
    }
    
    // Handling the special case for "Twice a day"
    if (interval === 0.5) {
      // Add dates for twice a day
      for (let i = 0; i < 60; i++) {
        dates.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000); // Every 12 hours
      }
    } else if (interval > 0) {
      for (let i = 0; i < 30; i++) {
        dates.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000);
      }
    }

    setHighlightedDates(dates);
    localStorage.setItem('highlightedDates', JSON.stringify(dates.map(date => date.toISOString())));
  }, [feedFrequency]);

  return highlightedDates;
};