// Interface for data parsed from JSON (dates are strings)
export interface StoredFeedingRecord {
  id: number;
  date: string;
  wasFed: boolean;
  foodType: string;
  amount: number;
}

// Interface for actual state usage (dates are Date objects)
export interface FeedingRecord {
  id: number;
  date: Date;
  wasFed: boolean;
  foodType: string;
  amount: number;
}