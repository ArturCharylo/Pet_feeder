import React, {useState} from 'react';

export const Menu: React.FC = () => {
    const [feedFrequency, setFeedFrequency] = useState('');

    return(
        <div className="App">
        <h1>Pet Feeder</h1>
        <p>Welcome to the Pet Feeder application!</p>
        <p>Please select how often would you like to feed your pet</p>
        <select name="feedFrequency" id="feedFrequency" onChange={(e) => setFeedFrequency(e.target.value)} value={feedFrequency}>
            <option value="Once a day">Once a day</option>
            <option value="Twice a day">Twice a day</option>
            <option value="Every Other Day">Every Other Day</option>
            <option value="Every Three Days">Every Three Days</option>
            <option value="Once a week">Once a week</option>
            <option value="Twice a week">Twice a week</option>
            <option value="Every Two Weeks">Every Two Weeks</option>
            <option value="Once a month">Once a month</option>
        </select>
        {feedFrequency ?
            <>
            <h5>Great you selected {feedFrequency} as your option</h5>
            <h5>Feel free to change this setting as you wish</h5>
            </> : <p>Please select feeding frequency</p>
            }
        </div>
    )
}   


