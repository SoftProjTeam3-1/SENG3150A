
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header.jsx";






const HomeDashboard = () => {


    // Temporary session which holds data before creation to db
    const [temporarySession, setTemporarySession] = useState({ id:null, date:null, type:null, activities:[], notes:""});

    // Stores sessions from the database
    const [sessions, setSessions] = useState([]);

    // Stores selected local sessions the user has clicked
    const [selectedSessions, setSelectedSessions] = useState([]);



    // Temporary category which holds data before being added to categories list
    const [temporaryCategory, setTemporaryCategory] = useState({name:null, activities:[]});

    //Stores the categories
    const [Categories, setCategories] = useState([]);



    // Temporary activity to be stored inside categories
    const [temporaryActivity, setTemporaryActivity] = useState({name: null, description: null, time: null, category: null, duration: 0});



    // Used to show user menus
    const [showActivityScreen, setShowActivityScreen] = useState(false);
    const [showEditDurationScreen, setShowEditDurationScreen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSessionTypeScreen, setSessionTypeScreen] = useState(false);


    // Used to determine if user clicks off menu
    const sessionRef = useRef(null);
    const activityRef = useRef(null);
    const editRef = useRef(null);


    // Category Menu Functions
    const [openCategory, setOpenCategory] = useState(null);

    const toggleCategory = (categoryName) => {
        console.log(categoryName);
        setOpenCategory(prev => (prev === categoryName ? null : categoryName));
        console.log(categoryName);
        console.log(Categories);
    };


    // Sets the temporary category name
    const setTemporaryCategoryName = (name) => {
        setTemporaryCategory(prev => ({...prev, name}));
    }

    // Creates a category and adds it to the category collections
    const createCategory = () => {
        const newCategory = {...temporaryCategory};
        setCategories(prev => [...prev, newCategory]);

        setTemporaryCategory({name:null, activities:[]});
    }

    // Adds an activity to category based on the name given\
    const addActivityToCategory = (categoryName, activity) => {
        setCategories(prevCategories =>
            prevCategories.map(category => {
                if (category.name === categoryName){
                    return {
                        ...category, activities: [...category.activities, activity]
                    };
                }
                return category;
            })
        );
    };

    //Functions for setting a temporary session
    const setTemporarySessionID = () => {
        setTemporarySession(prev => ({ ...prev, id: crypto.randomUUID() }));
    };

    const setTemporarySessionType = (type) => {
        setTemporarySession(prev => ({ ...prev, type }));
    };

    const setTemporarySessionDate = (date) => {
        setTemporarySession(prev => ({ ...prev, date }));
    };

    // Creates a new session on the db
    const createSession = async (session) => {
        // const res = await fetch('http://localhost:8080/api/sessions', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(session)
        // });
        // const newSession = await res.json();

        const newSession = { ...session }; // this creates a shallow copy
        setSessions(prev => [...prev, newSession]);

        // Reset teh temp session so no previous data is saved
        setTemporarySession({
            id: null,
            date: null,
            type: null,
            activities: [],
            notes: ""
        });
    };


    // Functionality for when a date box is clicked
    const handleClickSelectedSessions = (id) =>{
        setSelectedSessions(prev =>
            prev.includes(id)
                ? prev.filter(clickedId => clickedId !== id) // unselect
                : [...prev, id] // select
        );
    }

    // Functionality for when date box is right-clicked to be removed
    const handleRemoveDate = (id) =>{
        setSelectedSessions(prev => prev.filter(dateObj => dateObj.id !== id));
        setSelectedSessions(prev => prev.filter(clickedId => clickedId !== id));
    }

    // Sets the session ID
    const handleNewActivity = () =>{
        setTemporarySessionID();
        setSessionTypeScreen(prev => !prev);
    }

    // Sets the Session type and opens calendar
    const handleSessionSelect = (type) => {
        setTemporarySessionType(type);
        setSessionTypeScreen(false);
        setShowCalendar(true);
    };

    const updateNotesForSession = (id, newNotes) => {
        setSessions(prev =>
            prev.map(session =>
                session.id === id ? { ...session, notes: newNotes } : session
            )
        );
    };

    const handleActivityScreenClick = (id) => {
        setShowActivityScreen(prev => ! prev);
        // Sets the ID so we know which box to add the activity to
        setSingleSelectedSession(id);
    }

    // Handles Adding the Activity to the session

    const [singleSelectedSession, setSingleSelectedSession] = useState(); // Sets session ID in order to know where to add the activity to

    const handleClickActivity = (activity) => {

        setSessions(prev =>
        prev.map(session =>
        session.id === singleSelectedSession ? { ...session, activities: [...session.activities, activity]} : session
            )
        );

    };


    // Handles Duration of Activity Functions

    const [durationInput, setDurationInput] = useState(0);

    const handleEditDuration = () => {
        setShowEditDurationScreen(prev => !prev);
    }

    const handleRemoveActivityFromSession = (sessionId, activityIndex) => {
        setSessions(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? {
                        ...session,
                        activities: session.activities.filter((_, i) => i !== activityIndex),
                    }
                    : session
            )
        );
    };



    useEffect(() => {
        console.log("Sessions updated:", sessions);
    }, [sessions]);

    // Populates the categories
    const populateDefaultCategories = () => {
        const defaultCategories = [
            {
                name: "Warm Up",
                activities: [
                    { name: "Jogging", description: "Light jogging to warm up", duration: 30 },
                    { name: "Dynamic Stretches", description: "Full body stretches", duration: 20 },
                ]
            },
            {
                name: "Skills Practice",
                activities: [
                    { name: "Passing", description: "Short and long passes", duration: 20 },
                    { name: "Dribbling", description: "Cone dribbling drills", duration: 30 },
                ]
            },
            {
                name: "Games",
                activities: [
                    { name: "Small-sided Game", description: "4v4 half-pitch game", duration: 15 },
                    { name: "Scrimmage", description: "Full team practice match", duration: 30 },
                ]
            }
        ];

        setCategories(defaultCategories);
    };

    useEffect(() => {
        // fetch('http://localhost:8080/api/sessions')
        //     .then(res => res.json())
        //     .then(data => setSessions(data))
        //     .catch(err => console.error("Error loading sessions", err));

        const handleClickOutside = (event) => {
            if (
                showSessionTypeScreen &&
                sessionRef.current &&
                !sessionRef.current.contains(event.target)
            ) {
                setSessionTypeScreen(false);
            }
            if (
                showActivityScreen &&
                activityRef.current &&
                !activityRef.current.contains(event.target)
            ) {
                setShowActivityScreen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSessionTypeScreen, showActivityScreen]);


    useEffect(() => {
        populateDefaultCategories();
    }, []);

    return(
        <div className="w-full m-0 p-0">

            <Header headerLabel={"Home"}/>

            <div id="middleSegment" style={{display: 'flex'}} className="bg-emerald-100 min-h-screen">
                <div id="verticalBar" className=" w-25 bg-gray-600  text-2xl flex flex-col items-center ">
                    <ul className="text-center flex flex-col items-center relative top-[10px]">
                        {sessions.map(({id, date}) => {
                            if (!date) return null;

                            const [month, day] = date.split(' ');
                            const isClicked = selectedSessions.includes(id);
                            return (
                            <button
                                key={id}
                                className={`h-20 w-20 border-5 rounded-2xl flex flex-col items-center justify-center leading-none transition-transform duration-200 ease-in-out hover:scale-105
                                ${isClicked ? 'bg-orange-300 border-orange-600' : 'bg-white border-gray-600'}`}
                                onClick={() => handleClickSelectedSessions(id)}
                                onContextMenu={(e) => {
                                    e.preventDefault(); // prevent browser context menu
                                    handleRemoveDate(id);
                                }}>

                                <div className="leading-none">{month}</div>
                                <br/>
                                <div className="leading-none -mt-5">{day}</div>
                            </button>
                        );
                        })}
                    </ul>

                    <button
                        className="relative top-[10px] text-6xl h-20 w-20 bg-white border-5 border-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={() => handleNewActivity()}
                    >
                        <div className="leading-none -mt-2 text-center">
                            +
                        </div>
                    </button>
                </div>

                <div id="userDisplay">
                    <div className="p-5 flex flex-wrap gap-4">
                        {sessions.filter(dateObj => selectedSessions.includes(dateObj.id))
                            .map(({ id, date, type, notes }) => {
                                const [month, day] = date.split(' ');
                                return (
                                    <div className="flex flex-col gap-y-5 ">

                                        {/* Determines if game or training was selected */}
                                        {type === 'game' ? (
                                            <>
                                            <div
                                                key={id}
                                                className="w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black "
                                            >
                                                <div className="text-xl w-full text-center py-3">{month} {day}</div>

                                                <div
                                                    className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black overflow-y-auto"
                                                >
                                                    Notes
                                                    <div>
                                                        <textarea
                                                            className="w-65 h-110 resize-none py-3"
                                                            placeholder="Write something here..."
                                                            value={notes}
                                                            onChange={(e) => updateNotesForSession(id, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    key={id}
                                                    className="gap-y-3 w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black  pb-3 overflow-y-auto"
                                                >
                                                    <div className="text-xl w-full text-center py-3">{month} {day}</div>


                                                    {/* Display Activities Selected */}
                                                    <div className="w-68 ">
                                                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 w-full ">
                                                            {sessions.find(s => s.id === id)?.activities.map((activity, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="relative group bg-blue-100 px-4 py-2 rounded shadow text-center select-none transition-transform duration-200 ease-in-out hover:scale-105"
                                                                >
                                                                    {/* Remove button (hidden until hover) */}
                                                                    <button
                                                                        className="absolute top-0 right-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                        onClick={() => handleRemoveActivityFromSession(id, index)}
                                                                    >
                                                                        ×
                                                                    </button>

                                                                    <div>{activity.name}</div>
                                                                    <div>{activity.duration + " minutes"}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Plus Button */}
                                                    <div id={`$activities-{id}$`} className="w-64 h-24 flex items-center justify-center ">
                                                        <button
                                                            className=" text-6xl w-70 h-24 bg-emerald-100 shadow-lg rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                            onClick={() => handleActivityScreenClick(id)}
                                                        >
                                                            <div className="leading-none -mt-2">
                                                                +
                                                            </div>
                                                        </button>
                                                    </div>

                                                </div>

                                                {/* Notes */}
                                                <div
                                                    className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black"
                                                >
                                                    Notes
                                                    <div>
                                                        <textarea
                                                            className="w-65 h-110 resize-none py-3"
                                                            placeholder="Write something here..."
                                                            value={notes}
                                                            onChange={(e) => updateNotesForSession(id, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>

            {showEditDurationScreen && (
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-white text-2xl text-center flex flex-col items-center"
                     ref={editRef}>
                    <div className="text-m"> Edit Duration (Minutes): </div>

                    <input
                        type="number"
                        className="w-20 h-10 rounded text-white text-center border-2 border-white"
                        value={durationInput}
                        onChange={(e) => setDurationInput(e.target.value)}
                    />
                    <button
                        className="mt-4 bg-white text-gray-800 rounded px-4 py-2 hover:bg-gray-300"
                        onClick={() => {

                            handleEditDuration()

                            const activityWithDuration = { ...temporaryActivity, duration: durationInput };

                            handleClickActivity(activityWithDuration);

                            // Resets the temporary Category
                            setTemporaryActivity({name: null, description: null, time: null, category: null, duration: 0});
                        }}
                    >
                        Confirm
                    </button>

                </div>
            )}

            {showActivityScreen && (
 <div  className="hidden sm:block absolute top-20 left-0 bg-gray-600 w-2/3 sm:w-1/6 shadow p-5 text-gray-600 text-2xl flex flex-col items-center space-y-4 h-auto sm:h-full">                     ref={activityRef}
                    <div className="text-m"> Select Activity: </div>
                    <ul className="w-full text-center flex flex-col items-center relative space-y-4">
                        {Categories.map((category) => (

                            <div key={category.name} className="w-full">
                                <button
                                    className="w-full h-20 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                    onClick={() => toggleCategory(category.name)}
                                >
                                    <div>{category.name}</div>
                                </button>

                                {/* Drop Down Menu */}
                                {openCategory === category.name && (
                                    category.activities.length > 0 ? (
                                        <div className="flex flex-col gap-2 mt-2 w-full">
                                            {category.activities.map((activity, aIndex) => (
                                            <div key={`$aIndex-activity.name$`} className="w-full h-10 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">
                                                <button className="text-xs select-none"
                                                onClick={() => {

                                                    // Sets the activity to the temporary var to hold
                                                    setShowActivityScreen(false);
                                                    setTemporaryActivity(activity);
                                                    handleEditDuration();

                                                }}>{activity.name}</button>

                                            </div>
                                        ))}
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )
                        )
                        }
                    </ul>
                </div>
            )}

            {showCalendar && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl scale-150">
                        <DatePicker
                            inline
                            onChange={(date) => {
                                const formatted = format(date, 'MMM dd');
                                setTemporarySessionDate(formatted);
                                const fullSession = {
                                    ...temporarySession,
                                    date: formatted};
                                setTemporarySession(fullSession); // store latest version
                                createSession(fullSession);
                                setShowCalendar(false); // close after picking
                            }}
                        />
                    </div>
                </div>
            )}

{showSessionTypeScreen && (
  <div ref={sessionRef}>

    {/* Desktop / tablet sidebar */}
    <div
      className="
        hidden sm:absolute sm:top-20 sm:left-0 
        sm:w-64 sm:h-auto sm:bg-gray-600 sm:shadow sm:p-5 
        sm:text-gray-600 sm:text-2xl sm:flex sm:flex-col sm:items-center sm:space-y-4
      "
    >
      <button
        onClick={() => handleSessionSelect('training')}
        className="
          w-full py-4 bg-white rounded-2xl 
          flex items-center justify-center 
          transition-transform duration-200 ease-in-out hover:scale-105
        "
      >
        Training Session
      </button>
      <button
        onClick={() => handleSessionSelect('game')}
        className="
          w-full py-4 bg-white rounded-2xl 
          flex items-center justify-center 
          transition-transform duration-200 ease-in-out hover:scale-105
        "
      >
        Game Session
      </button>
      <button
        onClick={() => setSessionTypeScreen(false)}
        className="mt-2 text-sm text-gray-300 hover:text-white"
      >
        Cancel
      </button>
    </div>

    {/* Mobile full‐screen modal */}
    <div className="absolute inset-0 flex items-center justify-center sm:hidden">
      <div
        className="bg-gray-600 text-gray-600 p-4 rounded-xl shadow-lg w-11/12 mx-4 flex flex-col gap-4"
      >
        <button
          onClick={() => handleSessionSelect('training')}
          className="w-full py-4 bg-white rounded-2xl text-base flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
        >
          Training Session
        </button>
        <button
          onClick={() => handleSessionSelect('game')}
          className="w-full py-4 bg-white rounded-2xl text-base flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
        >
          Game Session
        </button>
        <button
          onClick={() => setSessionTypeScreen(false)}
          className="mt-2 self-end text-sm text-gray-300 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>

)}


        </div>
            );
};

export default HomeDashboard;