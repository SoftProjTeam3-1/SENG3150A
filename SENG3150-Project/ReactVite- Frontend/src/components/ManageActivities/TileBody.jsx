/*
    This file is the body of the tile for the category.
    Has the code for activity input form.
    Also holds the list of activities in that category.
    The body of the tile is a list of activities in that category and a button to add a new activity.
*/
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '@progress/kendo-theme-default/dist/all.css';
import './TileLayoutContainer.css';

const TileBody = ({ categoryName }) => {

  //TODO: Below is testing variables for the activity list
  const [activityList, setActivityList] = useState([
    'Run Laps', 'Stretches', 'Hurdles', 'Other',
  ]);
  //Stored activity description and time for each activity
  const [activityDescriptionList, setActivityDescriptionList] = useState([
    'Activity description goes here',
    'Activity description goes here',
    'Activity description goes here',
    'Activity description goes here',
  ]);
  const [activityTimeList, setActivityTimeList] = useState([
    10,
    20,
    30,
    40,
  ]);

  // State to manage the visibility of the form
  const [showForm, setShowForm] = useState(false);
  // State to manage the visibility of the activity information
  const [showActivityInfo, setShowActivityInfo] = useState(false);
  
  // State to manage the new activity input
  const [newActivity, setNewActivity] = useState('');
  // State to manage the new activity description input
  const [newActivityDescription, setNewActivityDescription] = useState('');
  // State to manage the new activity time input
  const [newActivityTime, setNewActivityTime] = useState(0);

  //Variables to store selected activity
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedActivityDescription, setSelectedActivityDescription] = useState(null);
  const [selectedActivityTime, setSelectedActivityTime] = useState(null);

  // Method handler for when an activity is clicked
  const handleClick = (item) => {
    // Set the selected activity and its description
    setSelectedActivity(item);
    setSelectedActivityDescription(activityDescriptionList[activityList.indexOf(item)]);
    setSelectedActivityTime(activityTimeList[activityList.indexOf(item)]);
    // Show the activity information
    setShowActivityInfo(true);
  }
  // Method to handle adding a new activity
  const handleAddActivity = () => {
        // Check if the input is not empty
        // If not empty, add the activity to the list
        if (newActivity.trim() !== '') {
          //TODO: Add the new activity to the list with POST
          setActivityList([...activityList, newActivity.trim()]);
          setActivityDescriptionList([...activityDescriptionList, newActivityDescription.trim()]);
          setActivityTimeList([...activityTimeList, newActivityTime]);
          setNewActivity('');// Clear the input
          setNewActivityDescription('');// Clear the input
          setNewActivityTime(0);// Clear the input
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
      
      {/* Show activity information */}
      {/* TODO: Change to a form where user can edit and save changes */}
      {showActivityInfo && ReactDOM.createPortal(
        // Popup for activity information
        <>
        <div className='popup-position'>
          <div className='popup-container'>
            <h3>{selectedActivity}</h3>
            <p>{selectedActivityDescription}</p>
            <p>Time: {selectedActivityTime} minutes</p>
            <button
              onClick={() => setShowActivityInfo(false)}
              style={{
                marginRight: '10px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#ccc',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
          </div>
        {/* Make it pop up above everything */}
        </>, document.getElementById('form-root')
      )}

      {showForm && ReactDOM.createPortal(
      <form className='popup-position'
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page refresh
        
          if (newActivity.trim() === '') {
            alert('Please enter a valid activity name.');
            return;
          }
        
          // TODO: Add the new activity to the list with POST
          handleAddActivity();
        }}>     
        <div className='popup-container'>
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
            onChange={(e) => setNewActivityDescription(e.target.value)}
            value={newActivityDescription}
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
            onChange={(e) => setNewActivityTime(e.target.value)}
            value={newActivityTime}
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
      </form>, document.getElementById('form-root')
      )}
    </>
  );
};  
export default TileBody;