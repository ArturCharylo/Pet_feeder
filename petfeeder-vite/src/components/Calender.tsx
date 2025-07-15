// FrequencyCalendar.tsx
import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import DayDetails from './CalendarPopup';
import '../styles/Calendar.css';
import { requestNotificationPermission, sendNotification } from '../hooks/useNotifications';


interface Props {
  feedFrequency: string;
}

const FrequencyCalendar: React.FC<Props> = ({ feedFrequency }) => {
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number } | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [feedingData, setFeedingData] = useState<
  { id: number; date: Date; wasFed: boolean; foodType: string; amount: number }[]
  >([]);
  const [nextId, setNextId] = useState(1);
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ id: number; date: Date; wasFed: boolean; foodType: string; amount: number } | null>(null);


  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Set up daily notification at 18:00
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const now = new Date();
      const targetHour = 18;

      const millisTillTarget = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        targetHour,
        0,
        0
      ).getTime() - now.getTime();

      const checkAndNotify = () => {
        const todayStr = new Date().toDateString();
        const isHighlighted = highlightedDates.some(date => date.toDateString() === todayStr);

        if (isHighlighted) {
          const wasFedToday = feedingData.some(
            record => record.date.toDateString() === todayStr && record.wasFed === true
          );

          if (!wasFedToday) {
            sendNotification('Przypomnienie', {
              body: 'Pora nakarmić zwierzaka! 🐱',
              icon: '/Pet_feeder.png',
            });
          }
        }
      };

      const timeout = setTimeout(() => {
        checkAndNotify();
        // repeat every 24h
        setInterval(() => {
          checkAndNotify();
        }, 24 * 60 * 60 * 1000);
      }, millisTillTarget > 0 ? millisTillTarget : 0); // if the te=arget time is in the past, set to 0

      return () => clearTimeout(timeout);
    }
  }, [highlightedDates, feedingData]);



  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
  const storedData = localStorage.getItem('feedingData');
  if (storedData) {
    // Refactoring string to object
    const parsed = JSON.parse(storedData).map((item: { id: number; date: string; wasFed: boolean; foodType: string; amount: number }) => ({
      ...item,
      date: new Date(item.date)
    }));
    setFeedingData(parsed);
    if (parsed.length > 0) {
      // Set nextId to the maximum id + 1
      setNextId(Math.max(...parsed.map((d: { id: number; date: Date; wasFed: boolean; foodType: string; amount: number }) => d.id)) + 1);
    }
  }
}, []);



  useEffect(() => {
    if (!feedFrequency) return;

    const today = new Date();
    const dates: Date[] = [];
    let currentDate = new Date(today);

    // map feedFrequency to interval in days
    let interval = 0;
    switch (feedFrequency) {
      case 'Once a day':
        interval = 1;
        break;
      case 'Twice a day':
        interval = 0.5; // specjal case - twice a day
        break;
      case 'Every Other Day':
        interval = 2;
        break;
      case 'Every Three Days':
        interval = 3;
        break;
      case 'Once a week':
        interval = 7;
        break;
      case 'Twice a week':
        interval = 3.5; // 2 times a week is every 3.5 days
        break;
      case 'Every Two Weeks':
        interval = 14;
        break;
      case 'Once a month':
        interval = 30;
        break;
    }
    

    // Handling the special case for "Twice a day"
    if (interval === 0.5) {
      // Add dates for twice a day
      for (let i = 0; i < 60; i++) {
        dates.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000); // every 12 hours
      }
    } else if (interval > 0) {
      for (let i = 0; i < 30; i++) {
        dates.push(new Date(currentDate));
        currentDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000);
      }
    }

    setHighlightedDates(dates);
  }, [feedFrequency]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    }

    if (selectedDate) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
  };}, [selectedDate]);

  const getDate = (date: Date) => {
    setSelectedDate(date)
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  }

  const closePopup = () => {
    setSelectedDate(null);
    setPopupPosition(null);
  };

const handleSaveFeeding = (data: { date: Date; wasFed: boolean; foodType: string; amount: number }) => {
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
    setSelectedRecord(null);
  };

  // Edition function 
  const handleEdit = (data: typeof feedingData[0]) => {
    const updated = feedingData.map(item => item.id === data.id ? data : item);
    setFeedingData(updated);
    localStorage.setItem('feedingData', JSON.stringify(updated));
    setEditData(null);
    setSelectedRecord(null); // <-- Close the delete/edit modal after saving
  };



  return (
    <>
      <Calendar
        calendarType="iso8601"
        locale="pl-PL"
        minDetail="month"
        onClickDay={(date, event) => {
          getDate(date);
            if (isSmallScreen) {
              setPopupPosition(null); // If the position is null, it will appear in the center
            } else {
              const rect = (event.target as HTMLElement).getBoundingClientRect();
              setPopupPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
              });
            }
        }}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const count = highlightedDates.filter(d =>
              d.toDateString() === date.toDateString()
            ).length;
            if (count === 2) return 'highlight-twice';
            if (count === 1) return 'highlight-once';
          }
          return null;
        }}
      />
      {selectedDate && (
        <div
          className="popup-wrapper"
          ref={popupRef}
          style={(() => {
            if (isSmallScreen) {
              return {
                position: 'fixed',
                top: '75%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
              };
            } else if (popupPosition) {
              return {
                position: 'absolute',
                top: popupPosition.top - 15,
                left: popupPosition.left,
                zIndex: 1000
              };
            } else {
              return {};
            }
          })()}
        >
          <DayDetails date={selectedDate} onClose={closePopup} onSave={handleSaveFeeding}/>
        </div>
      )}
      {/* Feeding history button in top-right corner */}
      <button
        className="show-popup-button top-right"
        onClick={() => setShowPopup(true)}
        style={{ display: showPopup ? 'none' : 'block' }}
      >
        Show Feeding history
      </button>

      {/* Modal overlay for feeding history */}
      {showPopup && (
        <div className="feeding-modal-overlay">
          <div className="feeding-modal-window">
            <button
              className="close-modal-button"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
            <table className="feeding-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Was Fed</th>
                  <th>Food Type</th>
                  <th>Amount (g)</th>
                </tr>
              </thead>
              <tbody>
                {feedingData.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedRecord(item.id)}>
                    <td>{item.id}</td>
                    <td>{item.date.toLocaleDateString()}</td>
                    <td>{item.wasFed ? 'Yes' : 'No'}</td>
                    <td>{item.foodType}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for deletion/edition */}
      {selectedRecord !== null && (
        <div className="feeding-modal-overlay">
          <div className="feeding-modal-window">
            <button className="close-modal-button" onClick={() => setSelectedRecord(null)}>×</button>
            <p>Czy chcesz usunąć lub edytować ten rekord?</p>
            <button className="feeding-modal-delete-button"onClick={() => handleDelete(selectedRecord)}>Usuń</button>
            <button className='feeding-modal-edit-button' onClick={() => {
              const record = feedingData.find(item => item.id === selectedRecord);
              if (record) setEditData(record);
            }}>Edytuj</button>
          </div>
        </div>
      )}

      {/* Modal for edition */}
      {editData && (
        <div className="feeding-modal-overlay">
          <div className="feeding-modal-window day-details">
            <button className="close-button" onClick={() => setEditData(null)}>×</button>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEdit(editData);
              }}
              className="day-details-content"
            >
              <div className="day-details-column">
                <p>Date of data for edit:<br/>{editData.date.toLocaleDateString()}</p>
                <p>
                  <strong>Current Data:</strong><br/>
                  Was Fed: {editData.wasFed ? 'Yes' : 'No'}<br/>
                  Food Type: {editData.foodType}<br/>
                  Amount: {editData.amount} g
                </p>
                <p>Edit Feeding Record</p>
              </div>
              <div className="day-details-column">
                <label>
                <div className="checkbox-row">
                  <label>Was Fed?<input
                      className="was-fed-button"
                      type="checkbox"
                      checked={editData.wasFed}
                      onChange={e => setEditData({ ...editData, wasFed: e.target.checked })}
                    />
                  </label>
                </div>
                  Food Type:<input
                    type="text"
                    value={editData.foodType}
                    onChange={e => setEditData({ ...editData, foodType: e.target.value })}
                  />
                </label>
                <label>
                  Amount (g):<input
                    type="number"
                    value={editData.amount}
                    onChange={e => setEditData({ ...editData, amount: Number(e.target.value) })}
                  />
                </label>
                <button className="save-button" type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FrequencyCalendar;
