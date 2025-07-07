import { useState } from 'react';
import './App.css';

export default function App() {
  const [feedFrequency, setFeedFrequency] = useState('');

  return(
    <div className="App">
      <h1>Pet Feeder</h1>
      <p>Welcome to the Pet Feeder application!</p>
      <p>Please select how often would you like to feed your pet</p>
      <form>
        <select name="feedFrequency" id="feedFrequency" onChange={(e) => setFeedFrequency(e.target.value)} value={feedFrequency}>
          <option value="1">Once a day</option>
          <option value="2">Twice a day</option>
          <option value="3">Every Other Day</option>
          <option value="4">Every Three Days</option>
          <option value="5">Once a week</option>
          <option value="6">Twice a week</option>
          <option value="7">Every Two Weeks</option>
          <option value="8">Once a month</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {feedFrequency ?
        <>
          <h5>Great you selected {feedFrequency} as your option</h5>
          <h5>Feel free to change this setting as you wish</h5>
        </>
        : <p className="error">Please select a feed frequency</p>}
    </div>
  )
}