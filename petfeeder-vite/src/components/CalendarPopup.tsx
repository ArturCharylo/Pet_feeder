import '../styles/CalendarPopup.css';

interface DayDetailsProps {
  date: Date;
  onClose: () => void;
}
const DayDetails: React.FC<DayDetailsProps> = ({ date, onClose }) => (
  <div className="day-details">
    <button className="close-button" onClick={onClose}>×</button>
    <div className="day-details-content">
      <div className="day-details-column">
        <p>Wybrana data: {date.toLocaleDateString()}</p>
        <label htmlFor="was-fed">Was the pet fed this day?</label>
        <input type="checkbox" className="was-fed-button" name="was-fed" id="was-fed"/>
      </div>
      <div className="day-details-column">
        <label htmlFor="food-type">Food type:</label>
        <input type="text" className="food-type-input" name="food-type" id="food-type" placeholder="Enter food type"/>
        <label htmlFor="amount">Amount:</label>
        <input type="number" className="amount-input" name="amount" id="amount" placeholder="Enter amount in grams"/>
      </div>
    </div>
    <button className="save-button">Save</button>
  </div>
);
export default DayDetails;
