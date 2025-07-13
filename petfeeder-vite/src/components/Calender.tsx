// FrequencyCalendar.tsx
import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import DayDetails from './CalendarPopup';
import '../styles/Calendar.css';

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
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
  const storedData = localStorage.getItem('feedingData');
  if (storedData) {
    // Musisz przekształcić stringi na daty
    const parsed = JSON.parse(storedData).map((item: { id: number; date: string; wasFed: boolean; foodType: string; amount: number }) => ({
      ...item,
      date: new Date(item.date)
    }));
    setFeedingData(parsed);
    if (parsed.length > 0) {
      // Ustaw nextId na kolejny numer
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
        console.log(`Adding date: ${currentDate.toISOString()}`);
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
    console.log('Saved feeding data:', localStorage.getItem('feedingData'));
  };

  // Funkcja usuwania
  const handleDelete = (id: number) => {
    const updated = feedingData.filter(item => item.id !== id);
    setFeedingData(updated);
    localStorage.setItem('feedingData', JSON.stringify(updated));
    setSelectedRecord(null);
  };

  // Funkcja edycji (przykład: zmiana ilości)
  const handleEdit = (data: typeof feedingData[0]) => {
    const updated = feedingData.map(item => item.id === data.id ? data : item);
    setFeedingData(updated);
    localStorage.setItem('feedingData', JSON.stringify(updated));
    setEditData(null);
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
              setPopupPosition(null); // nie ustawiamy pozycji – pojawi się na środku
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
    <div className="feeding-modal-window">
      <button className="close-modal-button" onClick={() => setEditData(null)}>×</button>
      <form onSubmit={e => {
        e.preventDefault();
        handleEdit(editData);
      }}>
    <div className="checkbox-row">
      <input
        className="was-fed-button"
        type="checkbox"
        checked={editData.wasFed}
        onChange={e => setEditData({ ...editData, wasFed: e.target.checked })}
      />
      <span>Was Fed?</span>
    </div>

    <label>
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

    <button className="save-button" type="submit">Zapisz</button>

      </form>
    </div>
  </div>
)}
    </>
  );
};

export default FrequencyCalendar;
