import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '@progress/kendo-theme-default/dist/all.css';
import { X } from 'lucide-react';

const TileBody = ({ categoryName }) => {

  // State variables for updating the activity list
  const [updateSwitch, setUpdateSwitch] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/activity/getByActivityType', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ activityType: categoryName }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const parsedData = await response.json();
        const activities = parsedData.activities;

        const activityNames = activities.map((a) => a.name);
        const activityDescriptions = activities.map((a) => a.description);
        const activityTimes = activities.map((a) => a.duration);
        const activityPeopleRequired = activities.map((a) => a.peopleRequired);
        setActivityList(activityNames);
        setActivityDescriptionList(activityDescriptions);
        setActivityTimeList(activityTimes);
        setActivityPeopleRequiredList(activityPeopleRequired);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [updateSwitch]);

  const [activityList, setActivityList] = useState([]);
  const [activityDescriptionList, setActivityDescriptionList] = useState([]);
  const [activityTimeList, setActivityTimeList] = useState([]);
  const [activityPeopleRequiredList, setActivityPeopleRequiredList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showActivityInfo, setShowActivityInfo] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [newActivityDescription, setNewActivityDescription] = useState('');
  const [newActivityTime, setNewActivityTime] = useState(0);
  const [newActivityPeopleRequired, setNewActivityPeopleRequired] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedActivityDescription, setSelectedActivityDescription] = useState(null);
  const [selectedActivityTime, setSelectedActivityTime] = useState(null);
  const [selectedActivityPeopleRequired, setSelectedActivityPeopleRequired] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [activityToDelete, setActivityToDelete] = useState(null);

  const handleClick = (item) => {
    setSelectedActivity(item);
    setSelectedActivityDescription(activityDescriptionList[activityList.indexOf(item)]);
    setSelectedActivityTime(activityTimeList[activityList.indexOf(item)]);
    setSelectedActivityPeopleRequired(activityPeopleRequiredList[activityList.indexOf(item)]);
    setShowActivityInfo(true);
  };

  async function handleAddActivity() {
    if (newActivity.trim() !== '') {
      try {
        const response = await fetch('/api/activity/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newActivity.trim(),
            description: newActivityDescription.trim(),
            duration: newActivityTime,
            peopleRequired: newActivityPeopleRequired,
            activityType: {
              name: categoryName,
              description: null,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        await response.json();
        // updates the activity list
        setUpdateSwitch(!updateSwitch);
        //reload
      } catch (error) {
        console.error('Error adding activity:', error);
      }

      setNewActivity('');
      setNewActivityDescription('');
      setNewActivityTime(0);
      setNewActivityPeopleRequired(0);
      setShowForm(false);
    } else {
      alert('Please enter a valid activity name.');
    }
  }

  async function handleUpdateActivity() {
    console.log("hook reached for updating activity")
    console.log(selectedActivity, 
      selectedActivityDescription, 
      selectedActivityTime, 
      selectedActivityPeopleRequired, 
      categoryName);
      
    if (newActivity.trim() !== '') {
      try {
        const response = await fetch('/api/activity/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: selectedActivity.trim(),
            description: selectedActivityDescription.trim(),
            duration: selectedActivityTime,
            peopleRequired: selectedActivityPeopleRequired,
            activityType: {
              name: categoryName,
              description: null,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        await response.json();
        location.reload();
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    }
    setNewActivity('');
    setNewActivityDescription('');
    setNewActivityTime(0);
    setNewActivityPeopleRequired(0);
  }

  async function handleDeleteActivity() {
    try {
      const response = await fetch('/api/activity/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: activityToDelete,
          description: null,
          duration: 0,
          peopleRequired: 0,
          activityType: {
            name: categoryName,
            description: null,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      // update the activity list
      setUpdateSwitch(!updateSwitch);
      //location.reload();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  }

  return (
    <>
      {/* Scrollable Div */}
      <div className="max-h-auto overflow-y-auto p-2 rounded h-[80%]">
        {/* List of Activities */}
        <ul className="list-none p-0 m-0">
          {activityList.map((item, index) => (
            <li
              key={index}
              onClick={() => handleClick(item)}
              className="mb-1 bg-white rounded cursor-pointer"
            >
              <div className="relative group px-4 py-2 text-align-left">
                <span>{item}</span>
                <button
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmation(true);
                    setConfirmationMessage(`Are you sure you want to delete "${item}"?`);
                    setActivityToDelete(item);
                  }}
                  title="Remove"
                >
                  <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
              {showConfirmation &&
                ReactDOM.createPortal(
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
                    <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                      <h3 className="mb-4 text-lg font-semibold text-gray-800">{confirmationMessage}</h3>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirmation(false);
                          }}
                          className="bg-[#202C39] hover:bg-[#8C9195] transition-colors duration-200 text-white border-none rounded px-3 py-1 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteActivity();
                            setShowConfirmation(false);
                          }}
                          className="hover:bg-[#8C9195] transition-colors duration-200 text-[#202C39] border-none rounded px-4 py-2 cursor-pointer"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>,
                  document.getElementById('form-root')
                )}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Activity Button */}
      <div className="text-center pb-1">
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#202C39] hover:bg-[#8C9195] transition-colors duration-200 text-white border-none rounded px-3 py-1 cursor-pointer"
        >
          Add Activity
        </button>
      </div>

      {/* Edit Activity Popup */}
        {showActivityInfo &&
          ReactDOM.createPortal(
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
          <form
              className="bg-white rounded shadow-lg p-6 w-full max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                if (newActivity.trim() === '') {
                  alert('Please enter a valid activity name.');
                  return;
                }
                // TODO: Update the activity details
                handleUpdateActivity();
                alert('Updating the activity details.');
              }}
            >
              <h3 className="text-lg font-semibold mb-4">Edit Activity Details</h3>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Activity Name:
              </label>
              <input
                type="text"
                defaultValue={selectedActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Enter activity name"
                required
                className="block w-full rounded border border-gray-300 p-2 mb-2"
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Activity Description:
              </label>
              <textarea
                placeholder="Enter activity description"
                onChange={(e) => setNewActivityDescription(e.target.value)}
                defaultValue={selectedActivityDescription}
                className="block w-full rounded border border-gray-300 p-2 mb-2"
                rows="4"
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                People Required:
              </label>
              <input
                type="number"
                placeholder="Enter the number of people required"
                onChange={(e) => setNewActivityPeopleRequired(e.target.value)}
                defaultValue={selectedActivityPeopleRequired === 0 ? '' : selectedActivityPeopleRequired}
                className="block w-full rounded border border-gray-300 p-2 mb-2"
                min="1"
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Time Required (in minutes):
              </label>
              <input
                type="number"
                placeholder="Enter time in minutes"
                onChange={(e) => setNewActivityTime(e.target.value)}
                defaultValue={selectedActivityTime === 0 ? '' : selectedActivityTime}
                className="block w-full rounded border border-gray-300 p-2 mb-2"
                min="1"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowActivityInfo(false)}
                  className="hover:bg-[#8C9195] transition-colors duration-200 text-[#202C39] border-none rounded px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#202C39] hover:bg-[#8C9195] transition-colors duration-200 text-white border-none rounded px-3 py-1 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
            </div>,
            document.getElementById('form-root')
          )}

        {/* Add Activity Popup */}
      {showForm &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
            <form
              className="bg-white rounded shadow-lg p-6 w-full max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                if (newActivity.trim() === '') {
                  alert('Please enter a valid activity name.');
                  return;
                }
                handleAddActivity();
              }}
            >
              <h3 className="text-lg font-semibold mb-4">Add New Activity</h3>
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Enter activity name"
                required
                className="block w-full rounded border border-gray-300 p-2 mb-2"
              />
              <textarea
                placeholder="Enter activity description"
                onChange={(e) => setNewActivityDescription(e.target.value)}
                value={newActivityDescription}
                className="block w-full rounded border border-gray-300 p-2 mb-2"
                rows="4"
              />
              <input
                type="number"
                placeholder="Enter the number of people required"
                onChange={(e) => setNewActivityPeopleRequired(e.target.value)}
                value={newActivityPeopleRequired === 0 ? '' : newActivityPeopleRequired}
                className="block w-full rounded border border-gray-300 p-2 mb-2"
                min="1"
              />
              <input
                type="number"
                placeholder="Enter time in minutes"
                onChange={(e) => setNewActivityTime(e.target.value)}
                value={newActivityTime === 0 ? '' : newActivityTime}
                className="block w-full rounded border border-gray-300 p-2 mb-2"
                min="1"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="hover:bg-[#8C9195] transition-colors duration-200 text-[#202C39] border-none rounded px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#202C39] hover:bg-[#8C9195] transition-colors duration-200 text-white border-none rounded px-3 py-1 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>,
          document.getElementById('form-root')
        )}
    </>
  );
};

export default TileBody;
