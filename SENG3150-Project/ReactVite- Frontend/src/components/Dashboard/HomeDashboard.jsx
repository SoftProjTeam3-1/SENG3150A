
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header.jsx";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import VerticalBar_Mobile from "./VerticalBar_Mobile.jsx";
import VerticalBar_Laptop from "./VerticalBar_Laptop.jsx";
import SessionContainer_Laptop from "./SessionContainer_Laptop.jsx";
import SessionContainer_Mobile from "./SessionContainer_Mobile.jsx";


const HomeDashboard = () => {


    // Temporary session which holds data before creation to db
    const [temporarySession, setTemporarySession] = useState({ id:null, date:null, type:null, activities:[], notes:""});

    // Stores sessions from the database
    const [sessions, setSessions] = useState([]);

    // Stores selected local sessions the user has clicked
    const [selectedSessions, setSelectedSessions] = useState([]);



    // Temporary category which holds data before being added to categories list
    //const [temporaryCategory, setTemporaryCategory] = useState({name:null, activities:[]});

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
    const handleNewSession = () =>{
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
        setSessions(prevSessions =>
            prevSessions.map(session => {
                if (session.id === singleSelectedSession) {
                    const maxRow = session.activities.length > 0
                        ? Math.max(...session.activities.map(act => act.row ?? 0))
                        : 0;

                    const newActivity = {
                        ...activity,
                        id: crypto.randomUUID(),
                        row: maxRow + 1
                    };

                    return {
                        ...session,
                        activities: [...session.activities, newActivity]
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

    const handleRemoveActivityFromSession = (sessionId, activity) => {
        setSessions(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? {
                        ...session,
                        activities: session.activities.filter(a => a.id !== activity.id)
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
                    { name: "Light Jogging", description: "Jog slowly for 5 minutes", duration: 5, category: "Warm Up" },
                    { name: "Arm Circles", description: "Loosen shoulders and arms", duration: 3, category: "Warm Up" },
                    { name: "High Knees", description: "Dynamic high knees warm up", duration: 3, category: "Warm Up" },
                    { name: "Butt Kicks", description: "Jog with heels to glutes", duration: 3, category: "Warm Up" },
                    { name: "Lunges", description: "Forward walking lunges", duration: 5, category: "Warm Up" },
                    { name: "Leg Swings", description: "Hip mobility leg swings", duration: 3, category: "Warm Up" },
                    { name: "Side Shuffles", description: "Lateral movement warm up", duration: 3, category: "Warm Up" },
                    { name: "Jumping Jacks", description: "Full body activation", duration: 3, category: "Warm Up" },
                    { name: "Dynamic Stretches", description: "Whole body dynamic stretching", duration: 5, category: "Warm Up" },
                    { name: "Skipping", description: "Rope skipping to elevate heart rate", duration: 5, category: "Warm Up" }
                ]
            },
            {
                name: "Skills Practice",
                activities: [
                    { name: "Short Passing", description: "Short accurate ground passes", duration: 15, category: "Skills Practice" },
                    { name: "Long Passing", description: "Driven long passes across field", duration: 15, category: "Skills Practice" },
                    { name: "First Touch Drills", description: "Control and settle incoming balls", duration: 15, category: "Skills Practice" },
                    { name: "1v1 Dribbling", description: "Offensive dribbling against defender", duration: 10, category: "Skills Practice" },
                    { name: "Cone Dribbling", description: "Close control around cones", duration: 10, category: "Skills Practice" },
                    { name: "Shooting Drills", description: "Shots from different angles", duration: 20, category: "Skills Practice" },
                    { name: "Crossing Practice", description: "Accurate crosses into box", duration: 15, category: "Skills Practice" },
                    { name: "Volley Finishing", description: "First-time volley shots", duration: 10, category: "Skills Practice" },
                    { name: "Heading Drills", description: "Offensive and defensive headers", duration: 10, category: "Skills Practice" },
                    { name: "Penalty Kicks", description: "Spot kick practice", duration: 10, category: "Skills Practice" }
                ]
            },
            {
                name: "Games",
                activities: [
                    { name: "Small-Sided Game", description: "4v4 small pitch", duration: 20, category: "Games" },
                    { name: "Scrimmage", description: "Full team match", duration: 30, category: "Games" },
                    { name: "Positional Game", description: "Maintain shape under pressure", duration: 20, category: "Games" },
                    { name: "Attack vs Defense", description: "Offense vs defensive unit", duration: 20, category: "Games" },
                    { name: "Counter Attack Game", description: "Quick transition play", duration: 20, category: "Games" },
                    { name: "Finishing Game", description: "Focus on scoring goals", duration: 15, category: "Games" },
                    { name: "First Touch Game", description: "Limit touches during play", duration: 15, category: "Games" },
                    { name: "Keep Away", description: "Maintain possession under pressure", duration: 10, category: "Games" },
                    { name: "Rondo", description: "Quick one-touch passing in circle", duration: 10, category: "Games" },
                    { name: "Golden Goal", description: "Sudden death game", duration: 10, category: "Games" }
                ]
            },
            {
                name: "Conditioning",
                activities: [
                    { name: "Sprints", description: "Short distance high intensity runs", duration: 10, category: "Conditioning" },
                    { name: "Shuttle Runs", description: "Acceleration and direction changes", duration: 10, category: "Conditioning" },
                    { name: "Interval Running", description: "Alternating sprint and jog", duration: 20, category: "Conditioning" },
                    { name: "Beep Test", description: "Multi-stage fitness test", duration: 20, category: "Conditioning" },
                    { name: "Hill Runs", description: "Uphill sprint training", duration: 15, category: "Conditioning" },
                    { name: "Agility Ladder", description: "Foot speed & coordination", duration: 10, category: "Conditioning" },
                    { name: "Box Jumps", description: "Explosive power training", duration: 10, category: "Conditioning" },
                    { name: "Medicine Ball Throws", description: "Core power conditioning", duration: 10, category: "Conditioning" },
                    { name: "Resistance Band Drills", description: "Speed and resistance", duration: 10, category: "Conditioning" },
                    { name: "Stair Sprints", description: "Explosive stair running", duration: 10, category: "Conditioning" }
                ]
            },
            {
                name: "Tactics",
                activities: [
                    { name: "Set Piece Practice", description: "Corners, free kicks, penalties", duration: 20, category: "Tactics" },
                    { name: "Offside Trap", description: "Defensive line coordination", duration: 15, category: "Tactics" },
                    { name: "Pressing System", description: "High press strategy", duration: 20, category: "Tactics" },
                    { name: "Zonal Marking", description: "Defensive zone coverage", duration: 15, category: "Tactics" },
                    { name: "Build-Up Play", description: "Slow controlled attack building", duration: 20, category: "Tactics" },
                    { name: "Counter Press", description: "Immediate press after loss of ball", duration: 15, category: "Tactics" },
                    { name: "Formation Drill", description: "Position-specific movement", duration: 20, category: "Tactics" },
                    { name: "Switching Play", description: "Moving ball across field quickly", duration: 15, category: "Tactics" },
                    { name: "Overlap Runs", description: "Full-back overlaps & crosses", duration: 15, category: "Tactics" },
                    { name: "Defensive Shape", description: "Compact team defending", duration: 15, category: "Tactics" }
                ]
            }
        ];
        setCategories(defaultCategories);
    }


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


    // Calculate total minutes
    const calculateTotalSessionMinutes = (session) => {
        if (!session.activities || session.activities.length === 0) return 0;

        // Group activities by their row
        const rowMap = {};

        session.activities.forEach(activity => {
            const row = activity.row ?? 0;
            if (!rowMap[row]) rowMap[row] = [];
            rowMap[row].push(activity.duration || 0);
        });

        // Sum the maximum duration per row
        let total = 0;
        Object.values(rowMap).forEach(durations => {
            total += Math.max(...durations);
        });

        return total;
    };

    useEffect(() => {
        populateDefaultCategories();
    }, []);


    const parseDroppableId = (id) => {
        const [sessionId, rowStr] = id.split('__row-');
        return {
            sessionId,
            rowIndex: parseInt(rowStr, 10)
        };
    };
    const parseDraggableId = (id) => {
        return { activityId: id };
    };


    const onDragStart = (start) => {
        console.log("Drag started:");
        console.log("Draggable ID:", start.draggableId);
        console.log("Source Droppable ID:", start.source.droppableId);
    };

    const handleActivityMove = ({ draggableId, source, destination }) => {
        const { sessionId: srcSessionId, rowIndex: srcRow } = parseDroppableId(source.droppableId);
        const { sessionId: dstSessionId, rowIndex: dstRowOriginal } = parseDroppableId(destination.droppableId);
        const { activityId } = parseDraggableId(draggableId);  // now parsing activityId directly

        if (
            srcSessionId === dstSessionId &&
            srcRow === dstRowOriginal &&
            source.index === destination.index
        ) return;

        setSessions(prevSessions => {
            const updatedSessions = [...prevSessions];

            const srcSessionIndex = updatedSessions.findIndex(s => s.id === srcSessionId);
            const dstSessionIndex = updatedSessions.findIndex(s => s.id === dstSessionId);
            if (srcSessionIndex === -1 || dstSessionIndex === -1) return prevSessions;

            const srcSession = { ...updatedSessions[srcSessionIndex] };
            const dstSession = srcSessionId === dstSessionId ? srcSession : { ...updatedSessions[dstSessionIndex] };

            const srcActivities = [...srcSession.activities];
            const dstActivities = srcSessionId === dstSessionId ? srcActivities : [...dstSession.activities];

            // Intra-row reorder
            if (srcSessionId === dstSessionId && srcRow === dstRowOriginal) {
                const globalIndices = srcActivities.reduce((acc, a, i) => {
                    if (a.row === srcRow) acc.push(i);
                    return acc;
                }, []);

                const [removed] = srcActivities.splice(globalIndices[source.index], 1);
                srcActivities.splice(globalIndices[destination.index], 0, removed);

                updatedSessions[srcSessionIndex] = { ...srcSession, activities: srcActivities };
                return updatedSessions;
            }

            // Inter-row or inter-session move
            const srcIdx = srcActivities.findIndex(a => a.id === activityId);
            if (srcIdx === -1) return prevSessions;

            const [movedItem] = srcActivities.splice(srcIdx, 1);

            let finalTargetRow = dstRowOriginal;

            const countInTargetRow = dstActivities.filter(a => a.row === dstRowOriginal).length;

            // If row is full → shift below rows down and place into next row
            if (countInTargetRow >= 2) {
                dstActivities.forEach(activity => {
                    if (activity.row >= dstRowOriginal + 1) {
                        activity.row += 1;
                    }
                });
                finalTargetRow = dstRowOriginal + 1;
            }

            movedItem.row = finalTargetRow;

            const insertAt = dstActivities.reduce(
                (acc, a, i) => (a.row === finalTargetRow && acc.count++ === destination.index ? { idx: i, found: true, count: acc.count } : acc),
                { idx: dstActivities.length, count: 0, found: false }
            ).idx;

            dstActivities.splice(insertAt, 0, movedItem);

            updatedSessions[srcSessionIndex] = { ...srcSession, activities: srcActivities };
            if (srcSessionId !== dstSessionId) {
                updatedSessions[dstSessionIndex] = { ...dstSession, activities: dstActivities };
            }

            return updatedSessions;
        });
    };




    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            console.warn("Dropped outside a valid droppable.");
            return;
        }

        handleActivityMove({ draggableId, source, destination });
    };



    return(
        <div className="w-full m-0 p-0 max-w-full">

            <Header headerLabel={"Mayfield Soccer Team - Dashboard"}/>

            <div id="middleSegment" style={{display: 'flex', backgroundColor: '#AFD2BB' }} className="flex flex-col sm:flex-row bg-white min-h-screen max-w-full">


                <VerticalBar_Mobile
                sessions={sessions}
                selectedSessions={selectedSessions}
                handleClickSelectedSessions={handleClickSelectedSessions}
                handleRemoveDate={handleRemoveDate}
                handleNewSession={handleNewSession}
                />

                <VerticalBar_Laptop
                sessions={sessions}
                selectedSessions={selectedSessions}
                handleClickSelectedSessions={handleClickSelectedSessions}
                handleRemoveDate={handleRemoveDate}
                handleNewSession={handleNewSession}
                />


                <SessionContainer_Laptop
                    DragDropContext={DragDropContext}
                    Droppable={Droppable}
                    Draggable={Draggable}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    sessions={sessions}
                    selectedSessions={selectedSessions}
                    updateNotesForSession={updateNotesForSession}
                    handleRemoveActivityFromSession={handleRemoveActivityFromSession}
                    handleActivityScreenClick={handleActivityScreenClick}
                    calculateTotalSessionMinutes={calculateTotalSessionMinutes}
                />

                <SessionContainer_Mobile
                sessions={sessions}
                selectedSessions={selectedSessions}
                updateNotesForSession={updateNotesForSession}
                calculateTotalSessionMinutes={calculateTotalSessionMinutes}
                />

            </div>



            {showEditDurationScreen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 ">
                    <div className="bg-gray-600 shadow p-5 rounded-xl text-white text-lg sm:text-2xl text-center flex flex-col items-center w-11/12 max-w-xs sm:max-w-md" ref={editRef}>
                        <div className="mb-2">Edit Duration (Minutes):</div>
                        <input
                            type="number"
                            min="1"
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
                                setDurationInput(0);
                            }}
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setShowEditDurationScreen(false)}
                            className="mt-2 text-sm text-gray-300 hover:text-white self-end"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {showActivityScreen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" ref={activityRef}>
                    <div className="bg-gray-600 w-11/12 max-w-xs sm:max-w-md shadow p-5 rounded-xl text-gray-600 text-lg sm:text-2xl flex flex-col items-center space-y-4 h-auto max-h-[90vh] overflow-y-auto">
                        <div className="mb-2 text-white">Select Activity:</div>
                        <ul className="w-full text-center flex flex-col items-center gap-2">
                            {openCategory === null ? (
                                // Show all categories when no category is selected
                                Categories.map((category) => (
                                    <div key={category.name} className="w-full">
                                        <button
                                            className="w-full h-20 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                            onClick={() => toggleCategory(category.name)}
                                        >
                                            <div>{category.name}</div>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                // Show only the selected category dropdown
                                <div className="w-full">
                                    <button
                                        className="w-full h-20 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center"
                                        onClick={() => toggleCategory(null)}  // allow collapsing back
                                    >
                                        <div>Back to Categories</div>
                                    </button>

                                    <div className="flex flex-col gap-2 mt-2 w-full">
                                        {Categories.find(c => c.name === openCategory)?.activities.map((activity, index) => (
                                            <button
                                                key={index}
                                                className="w-full h-10 bg-white text-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 text-xs select-none"
                                                onClick={() => {
                                                    setShowActivityScreen(false);
                                                    setTemporaryActivity(activity);
                                                    handleEditDuration();
                                                    setOpenCategory(null);
                                                }}
                                            >
                                                {activity.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </ul>

                        <button
                            onClick={() => {
                                setShowActivityScreen(false);
                                setOpenCategory(null);
                            }}
                            className="mt-2 text-sm text-gray-300 hover:text-white self-end"
                        >
                            Cancel
                        </button>
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
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-11/12 max-w-xs sm:max-w-md flex justify-center items-center">
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