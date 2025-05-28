/*
    This file is the head of the tile for the category.
    This file has the header name as the activity category name.
    It also has a button to delete the activity category.
    When the button is clicked, it will ask for confirmation before deleting the activity category.
*/
import React, { useState, useEffect, act } from 'react';
import ReactDOM from 'react-dom';
import '@progress/kendo-theme-default/dist/all.css';
import './TileLayoutContainer.css';
import { X } from 'lucide-react'; // You can use any icon you prefer

const TileHead = ({ categoryName }) => {
    useEffect(() => {
    }, []);

    //state for the confirmation window
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [confirmationMessage, setConfirmationMessage] = React.useState('');

    async function handleDeleteActivityType(){
        try{
        console.log("you reached the front end sender function for deleting activity type");
        const response = await fetch('/api/activityType/delete',{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: categoryName,
                description: null,
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const parsedData = await response.json();
        console.log(parsedData.response);

        location.reload();
        }
        catch(error){
        console.error('Error deleting activity:', error);
        }        
    }

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

    return (
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
                            handleDeleteActivityType();
                            //handleConfirmationResponse(true);
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
    );
};  
export default TileHead;