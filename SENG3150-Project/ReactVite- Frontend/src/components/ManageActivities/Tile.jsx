import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ActivityTileBody from './TileBody';
import { X } from 'lucide-react';
import '@progress/kendo-theme-default/dist/all.css';

const createTile = (categoryName) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmation = () => setShowConfirmation(true);
  const handleCancel = () => setShowConfirmation(false);
  const handleConfirm = () => {
    alert(`Activity "${categoryName}" deleted.`);
    setShowConfirmation(false);
  };

  return {
    defaultPosition: { colSpan: 1, rowSpan: 1 },
    header: (
      <div className="flex items-center justify-between p-4 bg-white rounded-t-lg shadow-md">
        <span className="text-base font-semibold truncate">{categoryName}</span>
        <button
          onClick={handleConfirmation}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-mint-500"
          title="Remove"
        >
          <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
        </button>

        {showConfirmation && ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Are you sure you want to delete "{categoryName}"?
              </h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>,
          document.getElementById('form-root')
        )}
      </div>
    ),
    body: (
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <ActivityTileBody categoryName={categoryName} />
      </div>
    ),
    reorderable: false,
    resizable: false,
  };
};

export default createTile;
