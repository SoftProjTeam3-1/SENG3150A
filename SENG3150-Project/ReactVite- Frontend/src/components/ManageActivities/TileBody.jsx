/*
    This file is the body of the tile for the category.
    Has the code for activity input form.
    Also holds the list of activities in that category.
    The body of the tile is a list of activities in that category and a button to add a new activity.
*/
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '@progress/kendo-theme-default/dist/all.css';

const TileBody = ({ categoryName }) => {

  //TODO: Below is testing variables for the activity list
  const [activityList, setActivityList] = useState([
    'Run Laps', 'Stretches', 'Hurdles', 'Other',
  ]);

  // State to manage the visibility of the form
  const [showForm, setShowForm] = useState(false);
  // State to manage the new activity input
  const [newActivity, setNewActivity] = useState('');

  // Method handler for when an activity is clicked
  const handleClick = (item) => alert(`You clicked: ${item}`);
  // Method to handle adding a new activity
  const handleAddActivity = () => {
        // Check if the input is not empty
        // If not empty, add the activity to the list
        if (newActivity.trim() !== '') {
          //TODO: Add the new activity to the list with POST
          setActivityList([...activityList, newActivity.trim()]);
          setNewActivity('');// Clear the input
          // Close the form
          setShowForm(false);
        }
        else {
            alert('Please enter a valid activity name.'); //TODO: Replace with actual functionality
        }
  };

  return (
    <>
      {/* Scrollable Div */}
      <div
      style={{
        maxHeight: 'auto',
        overflowY: 'auto',
        padding: '8px',
        borderRadius: '4px',
        height: '80%',
      }}>
        {/* List of Activities */}
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {activityList.map((item, index) => (
            // The actual activity item
            <li
              key={index}
              // The method to call when the activity is clicked
              onClick={() => handleClick(item)}
              style={{
                padding: '8px',
                marginBottom: '4px',
                background: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              // Adding hover effect
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      {/* TODO: Button below shows the add activity form */}
      <div style={{ textAlign: 'center', paddingBottom: '5px' }}>
        <button 
          onClick={() => setShowForm(true)}
          style={{
                    backgroundColor: '#202C39',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 12px',
                    cursor: 'pointer',
          }}>
            Add Activity
        </button> 
      </div>

      {showForm && ReactDOM.createPortal(
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page refresh
        
          if (newActivity.trim() === '') {
            alert('Please enter a valid activity name.');
            return;
          }
        
          // TODO: Add the new activity to the list with POST
          handleAddActivity();
        }}
        style={{ //Styles for the form to be displayed and hover
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>     
        <div
          style={{ //Styles for the form container
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* The form inputs */}
          <h3>Add New Activity</h3>
          <input
            type="text"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="Enter activity name"
            required
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />

          {/* Textbox input for a description */}
          <textarea
            placeholder="Enter activity description"
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
            rows="4"
          ></textarea>
          {/* Number input for time in mins */}
          <input
            type="number"
            placeholder="Enter time in minutes"
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
            min="1"
          />
          
          {/* Cancel form button that hides the form */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                marginRight: '10px',
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
              type="submit"
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#202C39',
                color: 'white',
                cursor: 'pointer',
              }}
            >
            Add
            </button>
          </div>
        </div>
      </form>, document.getElementById('form-root'))}
    </>
  );
};  
export default TileBody;