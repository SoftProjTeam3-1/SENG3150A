/*
    This component is just a big button for the user to click on to view the activities they have created.
    It will be used in the ManageActivities component to display a category of activities.
*/
import React, { useState } from 'react';

const CategoryComponent = ({Category}) => {
    //TODO: Below is testing variables for the activity list
    const activity = ['Run Laps', 'Stretches', 'Hurdles', 'Other'];

    // // State to manage the visibility of the form
    // const [showForm, setShowForm] = useState(false);

    // // State to manage the new activity input
    // const [newActivity, setNewActivity] = useState('');
    
    // Method handler for when an activity is clicked
    const handleClick = (item) => {
        alert(`You clicked: ${item}`); //TODO: Replace with actual functionality
    };

    // Method to handle adding a new activity
    // const handleAddActivity = () => {
    //     // Check if the input is not empty
    //     // If not empty, add the activity to the list
    //     if (newActivity.trim() !== '') {
    //       setActivityList([...activityList, newActivity.trim()]);
    //       setNewActivity('');
    //       // Close the form
    //       setShowForm(false);
    //     }
    //     else {
    //         alert('Please enter a valid activity name.'); //TODO: Replace with actual functionality
    //     }
    // };

    // Tile component creation
    const tile = {
        defaultPosition: {colSpan: 1, rowSpan: 1},
        // Header is the category name
        header: (
            <>
                {Category}
            </>
        ),
        body: 
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
                    {activity.map((item, index) => (
                    // The actual activity item
                    <li
                      key={index}
                      // The method to call when the activity is clicked
                      //onClick={() => handleClick(item)}
                      style={{
                        cursor: 'pointer',
                        padding: '8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                        marginBottom: '6px',
                        transition: 'background-color 0.2s',
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
                //onClick={() => setShowForm(true)} // Show the form when clicked
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
        </>, 
        reorderable: false,
        resizable: true,
    };
    return tile;
};

export default CategoryComponent;
