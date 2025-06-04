import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header.jsx";
import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';


const HomeDashboard = () => {


    // Temporary session which holds data before creation to db
    const [temporarySession, setTemporarySession] = useState({ id:null, date:null, type:null, activities:{ left: [], right: [] }, notes:""});

    // Stores sessions from the database
    const [sessions, setSessions] = useState([]);

    // Stores selected local sessions the user has clicked
    const [selectedSessions, setSelectedSessions] = useState([]);



    // Temporary category which holds data before being added to categories list
    const [temporaryCategory, setTemporaryCategory] = useState({name:null, activities:[]});

    //Stores the categories
    const [Categories, setCategories] = useState([]);



    // Temporary activity to be stored inside categories
    const [temporaryActivity, setTemporaryActivity] = useState({name: null, description: null, time: null, category: null, duration: 0, row: null});



    // Used to show user menus
    const [showActivityScreen, setShowActivityScreen] = useState(false);
    const [showEditDurationScreen, setShowEditDurationScreen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSessionTypeScreen, setSessionTypeScreen] = useState(false);
    const [showActivityDetails, setShowActivityDetails] = useState(false)


    // Used to determine if user clicks off menu
    const sessionRef = useRef(null);
    const activityRef = useRef(null);
    const editRef = useRef(null);
    const activityDetailsRef = useRef(null);


    // Category Menu Functions
    const [openCategory, setOpenCategory] = useState(null);

    const toggleCategory = (categoryName) => {
        console.log(categoryName);
        setOpenCategory(prev => (prev === categoryName ? null : categoryName));
        console.log(categoryName);
        console.log(Categories);
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
        const newSession = { ...session, activities: { left: [], right: [] } };
        setSessions(prev => [...prev, newSession]);

        // Reset the temp session so no previous data is saved
        setTemporarySession({
            id: null,
            date: null,
            type: null,
            activities: { left: [], right: [] },
            notes: "",
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

    // Helper to ensure every activity has a unique id
    function ensureActivityId(activity) {
        if (activity.id) return activity;
        return { ...activity, id: crypto.randomUUID() };
    }

    const handleClickActivity = (activity, column = 'left') => {
        setSessions(prevSessions =>
            prevSessions.map(session => {
                if (session.id === singleSelectedSession) {
                    // Add to the specified column, ensure id
                    return {
                        ...session,
                        activities: {
                            ...session.activities,
                            [column]: [...session.activities[column], ensureActivityId(activity)]
                        }
                    };
                }
                return session;
            })
        );
    };


    // Handles Duration of Activity Functions

    const [durationInput, setDurationInput] = useState(0);

    const handleEditDuration = () => {
        setShowEditDurationScreen(prev => !prev);
    }

    const handleRemoveActivityFromSession = (sessionId, activity, column) => {
        setSessions(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? {
                        ...session,
                        activities: {
                            ...session.activities,
                            [column]: session.activities[column].filter(
                                a => !(a.name === activity.name && a.row === activity.row)
                            )
                        }
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
                    { name: "Jogging", description: "Light jogging to warm up", duration: 30, category:"Warm Up" },
                    { name: "Dynamic Stretches", description: "Full body stretches", duration: 20, category:"Warm Up" },
                ]
            },
            {
                name: "Skills Practice",
                activities: [
                    { name: "Passing", description: "Short and long passes", duration: 20, category:"Skills Practice" },
                    { name: "Dribbling", description: "Cone dribbling drills", duration: 30, category:"Skills Practice" },
                ]
            },
            {
                name: "Games",
                activities: [
                    { name: "Small-sided Game", description: "4v4 half-pitch game", duration: 15, category:"Games" },
                    { name: "Scrimmage", description: "Full team practice match", duration: 30, category:"Games" },
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
            if(
                showActivityDetails &&
                activityDetailsRef.current &&
                !activityDetailsRef.current.contains(event.target)
            ) {
                setShowActivityDetails(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSessionTypeScreen, showActivityScreen, showActivityDetails]);


    // Calculate total minutes (sum both columns)
    const calculateTotalSessionMinutes = (session) => {
        if (!session.activities) return 0;
        const allActivities = [...(session.activities.left || []), ...(session.activities.right || [])];
        if (allActivities.length === 0) return 0;
        return allActivities.reduce((sum, a) => sum + (a.duration || 0), 0);
    };

    useEffect(() => {
        populateDefaultCategories();
    }, []);


    return(
        <div className="w-full m-0 p-0">
            <Header headerLabel={"Mayfield Soccer Team - Dashboard"}/>
            <div id="middleSegment" className="bg-white min-h-screen flex flex-col sm:flex-row">
                {/* Sidebar for sessions */}
                <div id="verticalBar" className="lg:max-w-50 w-full sm:w-1/5 bg-gray-600 text-lg sm:text-2xl flex flex-row sm:flex-col items-center sm:items-center py-2 sm:py-0 overflow-x-auto sm:overflow-x-visible">
                    <ul className="flex flex-row sm:flex-col items-center w-full justify-center gap-2 sm:gap-0">
                        {sessions.map(({id, date, type}) => {
                            if (!date) return null;
                            const [month, day] = date.split(' ');
                            const isClicked = selectedSessions.includes(id);
                            return (
                                <button
                                    key={id}
                                    className={`min-w-[4rem] sm:w-32 p-3 h-16 sm:h-20 mt-0 sm:mt-2 rounded-2xl flex flex-col items-center justify-center leading-none transition-transform duration-200 ease-in-out hover:scale-105 ${isClicked ? 'bg-orange-300 ' : 'bg-white '}`}
                                    onClick={() => handleClickSelectedSessions(id)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        handleRemoveDate(id);
                                    }}>
                                    <div className="leading-none font-bold">{month} {day}</div>
                                    <div className="leading-none text-xs sm:text-sm">{type} session</div>
                                </button>
                            );
                        })}
                    </ul>
                    <button
                        className="ml-2 sm:ml-0 mt-0 sm:mt-2  sm:text-6xl min-w-[4rem] sm:w-32 h-16 sm:h-20 bg-white border-4 border-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={() => handleNewActivity()}
                    >
                        <div className="leading-none font-bold text-base">New Session</div>
                    </button>
                </div>
                {/* Main user display */}
                <div id="userDisplay" className="flex-1 w-full overflow-x-auto">
                    <div className="h-4 sm:h-8" /> {/* Add vertical spacing above activities for all screens */}
                    <DragDropContext
                        onDragEnd={result => {
                            const { source, destination } = result;
                            if (!destination) return;
                            // droppableId format: 'left-<sessionId>' or 'right-<sessionId>'
                            const [srcCol, ...srcIdParts] = source.droppableId.split('-');
                            const [destCol, ...destIdParts] = destination.droppableId.split('-');
                            const srcSessionId = srcIdParts.join('-');
                            const destSessionId = destIdParts.join('-');
                            setSessions(prevSessions => prevSessions.map(session => {
                                if (String(session.id) !== srcSessionId) return session;
                                // Only support moving within the same session
                                if (srcSessionId === destSessionId) {
                                    const newActivities = { ...session.activities };
                                    const srcList = Array.from(newActivities[srcCol]);
                                    const [removed] = srcList.splice(source.index, 1);
                                    if (!removed) return session;
                                    if (srcCol === destCol) {
                                        srcList.splice(destination.index, 0, removed);
                                        newActivities[srcCol] = srcList;
                                    } else {
                                        const destList = Array.from(newActivities[destCol]);
                                        destList.splice(destination.index, 0, removed);
                                        newActivities[srcCol] = srcList;
                                        newActivities[destCol] = destList;
                                    }
                                    return { ...session, activities: newActivities };
                                }
                                return session;
                            }));
                        }}
                    >
                        {sessions.filter(dateObj => selectedSessions.includes(dateObj.id)).length > 1 ? (
                            // Responsive: side by side on desktop, stacked on mobile
                            <div className="flex flex-col sm:flex-row w-full gap-8 justify-center">
                                {sessions.filter(dateObj => selectedSessions.includes(dateObj.id)).map((session) => {
                                    const { id, date, type, notes } = session;
                                    const [month, day] = date.split(' ');
                                    return (
                                        <div key={id} className="flex flex-col gap-y-3 w-full max-w-xl items-center px-2 sm:px-0">
                                            {type === 'game' ? (
                                                <div className="border-gray-600 border-2 rounded-2xl w-full min-h-[380px] sm:min-h-[480px] flex flex-col justify-between mx-auto">
                                                    <div
                                                        key={id}
                                                        className="w-full bg-white rounded-2xl flex flex-col items-center text-black h-full flex-1"
                                                    >
                                                        <div className="text-lg sm:text-xl w-full text-center py-2 sm:py-3 font-bold">{month} {day}</div>
                                                        <div
                                                            className="text-base py-2 sm:py-3 w-full h-full flex-1 bg-white rounded-2xl flex flex-col items-center text-black overflow-y-auto"
                                                        >
                                                            <div className="font-bold">Notes</div>
                                                            <div className="w-full flex-1 flex flex-col">
                                                                <textarea
                                                                    className="w-full h-full min-h-[200px] sm:min-h-[300px] resize-none py-2 sm:py-3 border rounded flex-1"
                                                                    placeholder="Write something here..."
                                                                    value={notes}
                                                                    onChange={(e) => updateNotesForSession(id, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="gap-y-2 w-full min-h-[380px] sm:min-h-[480px] bg-gray-600 rounded-2xl flex flex-col items-center text-black pb-2 sm:pb-3 py-2 border-gray-600 border-2 justify-between mx-auto">
                                                        <div className="text-lg sm:text-xl w-full text-center text-white font-bold">{month} {day}</div>
                                                        <div className="w-full py-2 sm:py-3 flex-1 flex flex-row gap-4 justify-center">
                                                            {['left', 'right'].map(col => (
                                                                <Droppable droppableId={`${col}-${id}`} direction="vertical" key={col}>
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.droppableProps}
                                                                            className="flex flex-col gap-3 w-full max-w-xs mx-2"
                                                                            style={{ minHeight: 200, background: '#f8fafc', borderRadius: 8, padding: 8 }}
                                                                        >
                                                                            {session.activities && session.activities[col] && session.activities[col].map((activity, index) => (
                                                                                <Draggable
                                                                                    key={activity.id}
                                                                                    draggableId={activity.id}
                                                                                    index={index}
                                                                                >
                                                                                    {(dragProvided, snapshot) => (
                                                                                        <div
                                                                                            ref={dragProvided.innerRef}
                                                                                            {...dragProvided.draggableProps}
                                                                                            {...dragProvided.dragHandleProps}
                                                                                            className={`relative bg-orange-100 px-6 py-4 rounded shadow text-center select-none transition-transform duration-200 ease-in-out hover:scale-105 w-full mb-2 ${snapshot.isDragging ? 'opacity-50' : ''} group`}
                                                                                            style={dragProvided.draggableProps.style}
                                                                                        >
                                                                                            <button
                                                                                                className="absolute top-0 right-1 text-red-600 transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-auto"
                                                                                                onClick={() => handleRemoveActivityFromSession(session.id, activity, col)}
                                                                                            >
                                                                                                ×
                                                                                            </button>

                                                                                            <div className="font-bold text-base">{activity.name}</div>
                                                                                            <div className="text-xs italic">{activity.category}</div>
                                                                                            <div className="font-bold text-base">{activity.duration} min</div>
                                                                                        </div>
                                                                                    )}
                                                                                </Draggable>
                                                                            ))}
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Droppable>
                                                            ))}
                                                        </div>
                                                        <div className="w-full flex items-center justify-center mt-2">
                                                            <button
                                                                className="text-4xl sm:text-6xl min-w-[4rem] sm:w-32 h-16 sm:h-20 bg-orange-400 text-white shadow-emerald-50 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                                onClick={() => handleActivityScreenClick(id)}
                                                            >
                                                                <div className="leading-none text-base font-bold">New Activity</div>
                                                            </button>
                                                        </div>
                                                        <div className="text-center mt-auto pt-2 sm:pt-3 text-white font-bold text-xs sm:text-base">
                                                            Total Time: {calculateTotalSessionMinutes(session)} Minutes
                                                        </div>
                                                    </div>
                                                    <div className="text-base py-2 sm:py-3 w-full min-h-[140px] sm:min-h-[200px] bg-white rounded-2xl flex flex-col items-center text-black border-gray-600 border-2 flex-1 mx-auto">
                                                        <div className="font-bold">Notes</div>
                                                        <div className="w-full flex-1 flex flex-col">
                                                            <textarea
                                                                className="w-full h-full min-h-[100px] sm:min-h-[160px] resize-none py-2 sm:py-3 border rounded flex-1"
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
                        ) : (
                            // Mobile or only one selected: show as before
                            <div className="p-2 sm:p-5 flex flex-col gap-4 items-center">
                                {sessions.filter(dateObj => selectedSessions.includes(dateObj.id))
                                    .map((session) => {
                                        const { id, date, type, notes } = session;
                                        const [month, day] = date.split(' ');
                                        return (
                                            <div className="flex flex-col gap-y-3 w-full max-w-2xl items-center px-2 sm:px-0">
                                                {type === 'game' ? (
                                                    <div className="border-gray-600 border-2 rounded-2xl w-full min-h-[380px] sm:min-h-[480px] flex flex-col justify-between mx-auto">
                                                        <div
                                                            key={id}
                                                            className="w-full bg-white rounded-2xl flex flex-col items-center text-black h-full flex-1"
                                                        >
                                                            <div className="text-lg sm:text-xl w-full text-center py-2 sm:py-3 font-bold">{month} {day}</div>
                                                            <div
                                                                className="text-base py-2 sm:py-3 w-full h-full flex-1 bg-white rounded-2xl flex flex-col items-center text-black overflow-y-auto"
                                                            >
                                                                <div className="font-bold">Notes</div>
                                                                <div className="w-full flex-1 flex flex-col">
                                                                    <textarea
                                                                        className="w-full h-full min-h-[200px] sm:min-h-[300px] resize-none py-2 sm:py-3 border rounded flex-1"
                                                                        placeholder="Write something here..."
                                                                        value={notes}
                                                                        onChange={(e) => updateNotesForSession(id, e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="gap-y-2 w-full min-h-[380px] sm:min-h-[480px] bg-gray-600 rounded-2xl flex flex-col items-center text-black pb-2 sm:pb-3 py-2 border-gray-600 border-2 justify-between mx-auto">
                                                            <div className="text-lg sm:text-xl w-full text-center text-white font-bold">{month} {day}</div>
                                                            <div className="w-full py-2 sm:py-3 flex-1 flex flex-row gap-4 justify-center">
                                                                {['left', 'right'].map(col => (
                                                                    <Droppable droppableId={`${col}-${id}`} direction="vertical" key={col}>
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.droppableProps}
                                                                                className="flex flex-col gap-3 w-1/2 max-w-xs mx-2"
                                                                                style={{ minHeight: 200, background: '#f8fafc', borderRadius: 8, padding: 8 }}
                                                                            >
                                                                                {session.activities && session.activities[col] && session.activities[col].map((activity, index) => (
                                                                                    <Draggable
                                                                                        key={activity.id}
                                                                                        draggableId={activity.id}
                                                                                        index={index}
                                                                                    >
                                                                                        {(dragProvided, snapshot) => (
                                                                                            <div
                                                                                                ref={dragProvided.innerRef}
                                                                                                {...dragProvided.draggableProps}
                                                                                                {...dragProvided.dragHandleProps}
                                                                                                className={`relative bg-orange-100 px-6 py-4 rounded shadow text-center select-none transition-transform duration-200 ease-in-out hover:scale-105 w-full mb-2 ${snapshot.isDragging ? 'opacity-50' : ''} group`}
                                                                                                style={dragProvided.draggableProps.style}
                                                                                            >
                                                                                                <button
                                                                                                    className="absolute top-0 right-1 text-red-600 transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-auto"
                                                                                                    onClick={() => handleRemoveActivityFromSession(session.id, activity, col)}
                                                                                                    tabIndex={-1}
                                                                                                >
                                                                                                    ×
                                                                                                </button>
                                                                                                <div className="font-bold text-base">{activity.name}</div>
                                                                                                <div className="text-xs italic">{activity.category}</div>
                                                                                                <div className="font-bold text-base">{activity.duration} min</div>
                                                                                            </div>
                                                                                        )}
                                                                                    </Draggable>
                                                                                ))}
                                                                                {provided.placeholder}
                                                                            </div>
                                                                        )}
                                                                    </Droppable>
                                                                ))}
                                                            </div>
                                                            <div className="w-full flex items-center justify-center mt-2">
                                                                <button
                                                                    className="text-4xl sm:text-6xl min-w-[4rem] sm:w-32 h-16 sm:h-20 bg-orange-400 text-white shadow-emerald-50 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                                    onClick={() => handleActivityScreenClick(id)}
                                                                >
                                                                    <div className="leading-none text-base font-bold">New Activity</div>
                                                                </button>
                                                            </div>
                                                            <div className="text-center mt-auto pt-2 sm:pt-3 text-white font-bold text-xs sm:text-base">
                                                                Total Time: {calculateTotalSessionMinutes(session)} Minutes
                                                            </div>
                                                        </div>
                                                        <div className="text-base py-2 sm:py-3 w-full min-h-[140px] sm:min-h-[200px] bg-white rounded-2xl flex flex-col items-center text-black border-gray-600 border-2 flex-1 mx-auto">
                                                            <div className="font-bold">Notes</div>
                                                            <div className="w-full flex-1 flex flex-col">
                                                                <textarea
                                                                    className="w-full h-full min-h-[100px] sm:min-h-[160px] resize-none py-2 sm:py-3 border rounded flex-1"
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
                        )}
                    </DragDropContext>
                </div>
            </div>
            {showEditDurationScreen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 ">
                    <div className="bg-gray-600 shadow p-5 rounded-xl text-white text-lg sm:text-2xl text-center flex flex-col items-center w-11/12 max-w-xs sm:max-w-md" ref={editRef}>
                        <div className="mb-2">Edit Duration (Minutes):</div>
                        <input
                            type="number"
                            className="w-20 h-10 rounded text-white text-center border-2 border-white mb-4"
                            value={durationInput}
                            onChange={(e) => setDurationInput(e.target.value)}
                        />
                        <button
                            className="bg-white text-gray-800 rounded px-4 py-2 hover:bg-gray-300"
                            onClick={() => {
                                handleEditDuration()
                                const activityWithDuration = { ...temporaryActivity, duration: durationInput };
                                handleClickActivity(activityWithDuration);
                                setTemporaryActivity({name: null, description: null, time: null, category: null, duration: 0, row: null});
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
            {showActivityScreen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" ref={activityRef}>
                    <div className="bg-gray-600 w-11/12 max-w-xs sm:max-w-md shadow p-5 rounded-xl text-gray-600 text-lg sm:text-2xl flex flex-col items-center space-y-4 h-auto max-h-[90vh] overflow-y-auto">
                        <div className="mb-2 text-white">Select Activity:</div>
                        <ul className="w-full text-center flex flex-col items-center gap-2">
                            {Categories.map((category) => (
                                <div key={category.name} className="w-full">
                                    <button
                                        className="w-full h-12 sm:h-20 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                        onClick={() => toggleCategory(category.name)}
                                    >
                                        <div>{category.name}</div>
                                    </button>
                                    {openCategory === category.name && (
                                        category.activities.length > 0 ? (
                                            <div className="flex flex-col gap-2 mt-2 w-full">
                                                {category.activities.map((activity) => (
                                                    <div key={crypto.randomUUID()} className="w-full h-10 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">
                                                        <button className="text-xs select-none"
                                                                onClick={() => {
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
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {showActivityDetails && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-600 shadow p-5 rounded-xl text-white text-lg sm:text-2xl text-center flex flex-col items-center w-11/12 max-w-xs sm:max-w-md" ref={activityDetailsRef}>
                    </div>
                </div>
            )}
            {showCalendar && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-11/12 max-w-xs sm:max-w-md">
                        <DatePicker
                            inline
                            onChange={(date) => {
                                const formatted = format(date, 'MMM dd');
                                setTemporarySessionDate(formatted);
                                const fullSession = {
                                    ...temporarySession,
                                    date: formatted};
                                setTemporarySession(fullSession);
                                createSession(fullSession);
                                setShowCalendar(false);
                            }}
                        />
                    </div>
                </div>
            )}
            {showSessionTypeScreen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" ref={sessionRef}>
                    <div className="bg-gray-600 p-4 rounded-xl shadow-lg w-11/12 max-w-xs sm:max-w-md flex flex-col gap-4 items-center">
                        <button
                            onClick={() => handleSessionSelect('training')}
                            className="w-full py-3 sm:py-4 bg-white rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 text-base sm:text-2xl"
                        >
                            Training Session
                        </button>
                        <button
                            onClick={() => handleSessionSelect('game')}
                            className="w-full py-3 sm:py-4 bg-white rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 text-base sm:text-2xl"
                        >
                            Game Session
                        </button>
                        <button
                            onClick={() => setSessionTypeScreen(false)}
                            className="mt-2 text-sm text-gray-300 hover:text-white self-end"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeDashboard;