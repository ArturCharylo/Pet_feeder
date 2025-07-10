import '../styles/CalendarPopup.css';

interface DayDetailsProps {
  date: Date;
}
const DayDetails: React.FC<DayDetailsProps> = ({ date }) => (
  <div className="day-details">
    <p>Wybrana data: {date.toLocaleDateString()}</p>
    <label htmlFor="was-fed">Was the pet fed this day?</label>
    <input type="checkbox" className="was-fed-button" name="was-fed" id="was-fed"/>
    <br/>
    <label htmlFor="food-type">Food type:</label>
    <input type="text" className="food-type-input" name="food-type" id="food-type" placeholder="Enter food type"/>
    <br/>
    <label htmlFor="amount">Amount:</label>
    <input type="number" className="amount-input" name="amount" id="amount" placeholder="Enter amount in grams"/>
    <br/>
    <button className="save-button">Save</button>
  </div>
);
export default DayDetails;
