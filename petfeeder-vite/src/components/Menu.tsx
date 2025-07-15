// Menu.tsx
import React, { useState, useEffect } from 'react';
import FrequencyCalendar from './Calender';
import '../styles/Menu.css'

export const Menu: React.FC = () => {
    const [feedFrequency, setFeedFrequency] = useState<string>('');

    useEffect(() => {
        const storedFrequency = localStorage.getItem('feedFrequency');
        if (storedFrequency) {
            setFeedFrequency(storedFrequency);
        }
    }, []);

    useEffect(() => {
        if (feedFrequency) {
            localStorage.setItem('feedFrequency', feedFrequency);
        }
    }, [feedFrequency]);


    return (
        <div className="App">
            <h1 className='Title'>Pet Feeder</h1>
            <p className='Welcome-text'>Welcome to the Pet Feeder application!<br/>
            Please select how often would you like to feed your pet</p>
            <select className='feedFrequency' name="feedFrequency" id="feedFrequency"
                onChange={(e) => setFeedFrequency(e.target.value)}
                value={feedFrequency}>
                <option value="">-- select frequency --</option>
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
                    <h5 className='Calendar-text'>Great you selected {feedFrequency} as your option<br/>
                    Feel free to change this setting as you wish</h5>
                    <FrequencyCalendar feedFrequency={feedFrequency} />
                </>
                : <p>Please select feeding frequency</p>
            }
        </div>
    )
}
