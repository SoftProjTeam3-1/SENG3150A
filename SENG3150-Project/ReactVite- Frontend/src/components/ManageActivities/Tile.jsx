/*
    This file makes a tile for the tile layout of the Manage Activities page.
    Each tile is a category.
    The body of the tile is a list of activities in that category.
*/
import React from 'react';
import ActivityTileBody from './TileBody';
import { X } from 'lucide-react'; // You can use any icon you prefer
import '@progress/kendo-theme-default/dist/all.css';
import ReactDOM from 'react-dom';

const createTile = (categoryName) => {

    //state for the confirmation window
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [confirmationMessage, setConfirmationMessage] = React.useState('');

    // Asks the user for confirmation before deleting the activity
    const handleConfirmation = () => {
        //Display a confirmation window
        setConfirmationMessage(`Are you sure you want to delete the activity "${categoryName}"?`);
        setShowConfirmation(true);
    };

    //TODO: Handle the confirmation response
    const handleConfirmationResponse = () => {
        // User confirmed, proceed with deletion
        alert(`Activity "${categoryName}" deleted.`);
    }

    return {
        defaultPosition: { colSpan: 1, rowSpan: 1 },
        header: (
            <>
                <div className="relative group px-2 py-1">
                    <span>{categoryName}</span>
                    <button
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={handleConfirmation}
                        title="Remove"
                    >
                        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </button>
                </div>
                {/* Show the confirmation window */}
                {/* TODO: Change to a form where user can edit and save changes */}
                {showConfirmation && ReactDOM.createPortal(
                  // Popup for activity information
                  <>
                  <div className='popup-position'>
                    <div className='popup-container'>
                        <h3
                            style={{
                                marginBottom: '10px',
                                fontSize: '18px',
                                color: '#202C39',
                            }}
                        >{confirmationMessage}</h3>
                        {/* Cancel button hides window*/}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                style={{
                                    marginRight: '40%',
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    backgroundColor: '#ccc',
                                    cursor: 'pointer',
                                }}
                            >
                            Cancel
                            </button>
                            {/* Submit button */}
                            <button
                                type="button"
                                onClick={() => {
                                    handleConfirmationResponse(true);
                                    setShowConfirmation(false);
                                }}
                                style={{
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    backgroundColor: '#202C39',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                            Confirm
                            </button>
                        </div>
                    </div>
                    </div>
                  {/* Make it pop up above everything */}
                  </>, document.getElementById('form-root')
                )}
            </>
        ),
        body: (
            <div className="group relative">
                <ActivityTileBody categoryName={categoryName} />
            </div>
        ),
        reorderable: false,
        resizable: false,
    };
};

export default createTile;