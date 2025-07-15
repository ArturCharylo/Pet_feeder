import React, { useState } from 'react';
import '../styles/CalendarPopup.css';
import { validateFoodType, validateAmount } from '../validation/Rules';

interface DayDetailsProps {
  date: Date;
  onClose: () => void;
  onSave: (data: {date: Date; wasFed: boolean; foodType: string; amount: number }) => void;
}

const DayDetails: React.FC<DayDetailsProps> = ({ date, onClose, onSave }) => {
  const [wasFed, setWasFed] = useState(false);
  const [foodType, setFoodType] = useState('');
  const [amount, setAmount] = useState(''); // store as string to handle empty input
  const [error, setError] = useState<string>(''); // State for error message

  const handleSave = () => {
        const numericAmount = Number(amount);

    if (!validateFoodType(foodType)) {
      setError('Invalid food type! Only letters, spaces and dashes, 2-30 characters.');
      return;
    }
    if (!validateAmount(numericAmount)) {
      setError('Invalid amount! Must be a positive number.');
      return;
    }
    setError(''); // Clear error on successful validation
    onSave({ date, wasFed, foodType, amount: numericAmount });
    onClose(); // Close popup after saving
  };

  return (
    <div className="day-details-popup">
      <button className="close-button-popup" onClick={onClose}>×</button>
      <div className="day-details-content-popup">
        <div className="day-details-column-popup">
          <p>Wybrana data: {date.toLocaleDateString()}</p>
          <div className="checkbox-row-popup">
            <label htmlFor="was-fed" className='was-fed-popup'>Was the pet fed this day?</label>
            <input
              type="checkbox"
              className="was-fed-button-popup"
              name="was-fed"
              id="was-fed"
              checked={wasFed}
              onChange={(e) => setWasFed(e.target.checked)}
            />
          </div>
        </div>
        <div className="day-details-column-popup">
          <label htmlFor="food-type" className='popup-label'>Food type:</label>
          <input
            type="text"
            className="food-type-input-popup"
            name="food-type"
            id="food-type"
            placeholder="Enter food type"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
          />
          <label htmlFor="amount" >Amount:</label>
          <input
            type="number"
            className="amount-input-popup"
            name="amount"
            id="amount"
            placeholder="Enter amount in grams"
            value={amount}
            onChange={(e) => setAmount((e.target.value))}
          />
        </div>
      </div>
      <button className="save-button-popup" onClick={handleSave}>Save</button>
      {error && <p style={{ color: "#ff2e2ed0", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};
export default DayDetails;
