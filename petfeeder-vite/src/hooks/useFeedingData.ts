// src/hooks/useFeedingData.ts
import { useState, useEffect } from 'react';
import type  { FeedingRecord, StoredFeedingRecord } from '../types/FeedingData';

export const useFeedingData = () => {
  const [feedingData, setFeedingData] = useState<FeedingRecord[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const storedData = localStorage.getItem('feedingData');
    if (storedData) {
      // Refactoring string to object
      const parsed: FeedingRecord[] = JSON.parse(storedData).map((item: StoredFeedingRecord) => ({
        ...item,
        date: new Date(item.date)
      }));
      
      setFeedingData(parsed);
      
      if (parsed.length > 0) {
        // Set nextId to the maximum id + 1
        setNextId(Math.max(...parsed.map((d: FeedingRecord) => d.id)) + 1);
      }
    }
  }, []);

  const handleSaveFeeding = (data: Omit<FeedingRecord, 'id'>) => {
    const newData = { ...data, id: nextId };
    setFeedingData((prev) => {
      const updated = [...prev, newData];
      localStorage.setItem('feedingData', JSON.stringify(updated));
      return updated;
    });
    setNextId((prev) => prev + 1);
  };

  // Delete function
  const handleDelete = (id: number) => {
    const updated = feedingData.filter(item => item.id !== id);
    setFeedingData(updated);
    localStorage.setItem('feedingData', JSON.stringify(updated));
  };

  // Edition function 
  const handleEdit = (data: FeedingRecord) => {
    const updated = feedingData.map(item => item.id === data.id ? data : item);
    setFeedingData(updated);
    localStorage.setItem('feedingData', JSON.stringify(updated));
  };

  return { feedingData, handleSaveFeeding, handleDelete, handleEdit };
};