import React, { useState } from 'react';
import '../styles/CalendarPopup.css';

interface DayDetailsProps {
  date: Date;
  onClose: () => void;
  onSave: (data: {date: Date; wasFed: boolean; foodType: string; amount: number }) => void;
}

const DayDetails: React.FC<DayDetailsProps> = ({ date, onClose, onSave }) => {
  const [wasFed, setWasFed] = useState(false);
  const [foodType, setFoodType] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSave = () => {
    onSave({ date, wasFed, foodType, amount });
    onClose(); // Close popup after saving
  };

  return (
    <div className="day-details">
      <button className="close-button" onClick={onClose}>×</button>
      <div className="day-details-content">
        <div className="day-details-column">
          <p>Wybrana data: {date.toLocaleDateString()}</p>
          <div className="checkbox-row">
            <label htmlFor="was-fed">Was the pet fed this day?</label>
            <input
              type="checkbox"
              className="was-fed-button"
              name="was-fed"
              id="was-fed"
              checked={wasFed}
              onChange={(e) => setWasFed(e.target.checked)}
            />
          </div>
        </div>
        <div className="day-details-column">
          <label htmlFor="food-type">Food type:</label>
          <input
            type="text"
            className="food-type-input"
            name="food-type"
            id="food-type"
            placeholder="Enter food type"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
          />
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            className="amount-input"
            name="amount"
            id="amount"
            placeholder="Enter amount in grams"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>
      <button className="save-button" onClick={handleSave}>Save</button>
    </div>
  );
};
export default DayDetails;
