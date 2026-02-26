// src/components/FeedingHistoryModal.tsx
import React, { useState } from 'react';
import type { FeedingRecord } from '../types/FeedingData';

interface Props {
  feedingData: FeedingRecord[];
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (data: FeedingRecord) => void;
}

const FeedingHistoryModal: React.FC<Props> = ({ feedingData, onClose, onDelete, onEdit }) => {
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [editData, setEditData] = useState<FeedingRecord | null>(null);

  const handleDeleteClick = (id: number) => {
    onDelete(id);
    setSelectedRecord(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      onEdit(editData);
      setEditData(null);
      setSelectedRecord(null); // Close the delete/edit modal after saving
    }
  };

  return (
    <>
      <div className="feeding-modal-overlay">
        <div className="feeding-modal-window">
          <button className="close-modal-button" onClick={onClose}>×</button>
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

      {/* Modal for deletion/edition */}
      {selectedRecord !== null && (
        <div className="feeding-modal-overlay">
          <div className="feeding-modal-window">
            <button className="close-modal-button" onClick={() => setSelectedRecord(null)}>×</button>
            <p>Czy chcesz usunąć lub edytować ten rekord?</p>
            <button className="feeding-modal-delete-button" onClick={() => handleDeleteClick(selectedRecord)}>Usuń</button>
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
            <form onSubmit={handleEditSubmit} className="day-details-content">
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

export default FeedingHistoryModal;