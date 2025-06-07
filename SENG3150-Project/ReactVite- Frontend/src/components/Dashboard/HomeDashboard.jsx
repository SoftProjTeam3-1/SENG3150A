
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
        setSessions(prevSessions =>
            prevSessions.map(session => {
                if (session.id === singleSelectedSession) {
<<<<<<< HEAD
=======
                    // Determine the max existing row number
>>>>>>> origin/main
                    const maxRow = session.activities.length > 0
                        ? Math.max(...session.activities.map(act => act.row ?? 0))
                        : 0;

<<<<<<< HEAD
                    const newActivity = {
                        ...activity,
                        id: crypto.randomUUID(),
=======
                    // Create the new activity with the next available row
                    const newActivity = {
                        ...activity,
>>>>>>> origin/main
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


<<<<<<< HEAD

=======
>>>>>>> origin/main
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
<<<<<<< HEAD
                        activities: session.activities.filter(a => a.id !== activity.id)
=======
                        activities: session.activities.filter(
                            a => !(a.name === activity.name && a.row === activity.row)
                        )
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
                    { name: "Jogging", description: "Light jogging to warm up", duration: 30, category:"Warm Up" },
                    { name: "Dynamic Stretches", description: "Full body stretches", duration: 20, category:"Warm Up" },
>>>>>>> origin/main
                ]
            },
            {
                name: "Skills Practice",
                activities: [
<<<<<<< HEAD
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
=======
                    { name: "Passing", description: "Short and long passes", duration: 20, category:"Skills Practice" },
                    { name: "Dribbling", description: "Cone dribbling drills", duration: 30, category:"Skills Practice" },
>>>>>>> origin/main
                ]
            },
            {
                name: "Games",
                activities: [
<<<<<<< HEAD
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

=======
                    { name: "Small-sided Game", description: "4v4 half-pitch game", duration: 15, category:"Games" },
                    { name: "Scrimmage", description: "Full team practice match", duration: 30, category:"Games" },
                ]
            }
        ];

        setCategories(defaultCategories);
    };
>>>>>>> origin/main

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
<<<<<<< HEAD
        return { activityId: id };
    };


=======
        const [sessionId, rest] = id.split('__');
        const [activityName, indexStr] = rest.split('-');
        return {
            sessionId,
            activityName,
            index: parseInt(indexStr, 10)
        };
    };

>>>>>>> origin/main
    const onDragStart = (start) => {
        console.log("Drag started:");
        console.log("Draggable ID:", start.draggableId);
        console.log("Source Droppable ID:", start.source.droppableId);
    };

    const handleActivityMove = ({ draggableId, source, destination }) => {
        const { sessionId: srcSessionId, rowIndex: srcRow } = parseDroppableId(source.droppableId);
<<<<<<< HEAD
        const { sessionId: dstSessionId, rowIndex: dstRowOriginal } = parseDroppableId(destination.droppableId);
        const { activityId } = parseDraggableId(draggableId);  // now parsing activityId directly

        if (
            srcSessionId === dstSessionId &&
            srcRow === dstRowOriginal &&
=======
        const { sessionId: dstSessionId, rowIndex: dstRow } = parseDroppableId(destination.droppableId);
        const { activityName } = parseDraggableId(draggableId);

        // If dropped in same spot, do nothing
        if (
            srcSessionId === dstSessionId &&
            srcRow === dstRow &&
>>>>>>> origin/main
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
<<<<<<< HEAD
            if (srcSessionId === dstSessionId && srcRow === dstRowOriginal) {
=======
            if (srcSessionId === dstSessionId && srcRow === dstRow) {
                //const rowItems = srcActivities.filter(a => a.row === srcRow);

                //const rowActivity = rowItems[source.index];
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
            const srcIdx = srcActivities.findIndex(
                (a) => a.name === activityName && a.row === srcRow
            );
            if (srcIdx === -1) return prevSessions;

            const [movedItem] = srcActivities.splice(srcIdx, 1);
            movedItem.row = dstRow;

            // Find global insert index
            const insertAt = dstActivities.reduce(
                (acc, a, i) => (a.row === dstRow && acc.count++ === destination.index ? { idx: i, found: true, count: acc.count } : acc),
>>>>>>> origin/main
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




<<<<<<< HEAD
=======


>>>>>>> origin/main
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            console.warn("Dropped outside a valid droppable.");
            return;
        }

        handleActivityMove({ draggableId, source, destination });
    };



    return(
<<<<<<< HEAD
        <div className="w-full m-0 p-0 max-w-full">

            <Header headerLabel={"Mayfield Soccer Team - Dashboard"}/>

            <div id="middleSegment" style={{display: 'flex', backgroundColor: '#AFD2BB' }} className="flex flex-col sm:flex-row bg-white min-h-screen max-w-full">

                {/*Mobile Display*/}
                <div className="w-full bg-gray-600 text-lg flex items-center py-2 overflow-x-auto sm:hidden px-4">
                    <div className="flex flex-nowrap items-center gap-2">
                        {sessions.map(({ id, date, type }) => {
                            if (!date) return null;
                            const [month, day] = date.split(' ');
                            const isClicked = selectedSessions.includes(id);
                            return (
                                <button
                                    key={id}
                                    className={`min-w-[5rem] w-[5rem] h-18 px-2 py-2 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 ${isClicked ? 'bg-orange-300' : 'bg-white'}`}
                                    onClick={() => handleClickSelectedSessions(id)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        handleRemoveDate(id);
                                    }}
                                >
                                    <div className="font-bold text-sm">{month} {day}</div>
                                    <div className="text-xs text-center break-words">{type} session</div>
                                </button>
                            );
                        })}

                        <button
                            className="min-w-[5rem] w-[5rem] px-2 py-2 h-20 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 bg-white border-4 border-gray-600"
                            onClick={() => handleNewActivity()}
                        >
                            <div className="font-bold text-xs">New Session</div>

                        </button>
                    </div>
                </div>


                {/*Laptop Display*/}
                <div id="verticalBar" className="lg:max-w-50 w-1/5 bg-gray-600 text-2xl flex flex-col items-center py-0 overflow-x-visible hidden sm:flex max-w-full">
                    <ul className="text-center flex flex-col items-center relative top-[10px]">
                        {sessions.map(({id, date, type}) => {
                            if (!date) return null;
=======
        <div className="w-full m-0 p-0">

            <Header headerLabel={"Mayfield Soccer Team - Dashboard"}/>

            <div id="middleSegment" style={{display: 'flex'}} className="bg-white min-h-screen">
                <div id="verticalBar" className="w-2/3 sm:w-1/6 bg-gray-600 text-2xl flex flex-col items-center ">
                    <ul className="text-center flex flex-col items-center relative top-[10px]">
                        {sessions.map(({id, date, type}) => {
                            if (!date) return null;

>>>>>>> origin/main
                            const [month, day] = date.split(' ');
                            const isClicked = selectedSessions.includes(id);
                            return (
                                <button
                                    key={id}
<<<<<<< HEAD
                                    className={`w-32 h-20 mt-2 rounded-2xl flex flex-col items-center justify-center leading-none transition-transform duration-200 ease-in-out hover:scale-105 ${isClicked ? 'bg-orange-300' : 'bg-white'}`}
                                    onClick={() => handleClickSelectedSessions(id)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        handleRemoveDate(id);
                                    }}>
                                    <div className="font-bold">{month} {day}</div>
                                    <div className="text-sm">{type} session</div>
=======
                                    className={`mt-2 h-20 w-35 rounded-2xl flex flex-col items-center justify-center leading-none transition-transform duration-200 ease-in-out hover:scale-105
                                ${isClicked ? 'bg-orange-300 ' : 'bg-white '}`}
                                    onClick={() => handleClickSelectedSessions(id)}
                                    onContextMenu={(e) => {
                                        e.preventDefault(); // prevent browser context menu
                                        handleRemoveDate(id);
                                    }}>

                                    <div className="leading-none font-bold">{month} {day}</div>
                                    <br/>
                                    <div className="leading-none -mt-5 text-sm">{type} session</div>
>>>>>>> origin/main
                                </button>
                            );
                        })}
                    </ul>

                    <button
<<<<<<< HEAD
                        className="mt-4 text-6xl w-32 h-20 bg-white border-4 border-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={() => handleNewActivity()}
                    >
                        <div className="font-bold text-base">New Session</div>
                    </button>
                </div>


                {/*Laptop Display*/}
                {/*Main Display*/}
                <div id="userDisplay" className="hidden sm:block">

=======
                        className="mt-2 relative top-[10px] text-6xl h-20 w-20 bg-white border-5 border-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={() => handleNewActivity()}
                    >
                        <div className="leading-none -mt-2 text-center">
                            +
                        </div>
                    </button>
                </div>

                <div id="userDisplay">
>>>>>>> origin/main
                    {/* Drag Drop Container */}
                    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                        <div className="p-5 flex flex-wrap gap-4">
                            {sessions.filter(dateObj => selectedSessions.includes(dateObj.id))
                                .map((session) => {
                                    const { id, date, type, notes } = session;
                                    const [month, day] = date.split(' ');

                                    const groupedActivities = {};
                                    session.activities.forEach((activity) => {
                                        const row = activity.row || 0;
                                        if (!groupedActivities[row]) groupedActivities[row] = [];
                                        groupedActivities[row].push(activity);
                                    });

                                    return (
                                        <div className="flex flex-col gap-y-5 ">

                                            {/* Determines if game or training was selected */}
                                            {type === 'game' ? (
                                                <>
<<<<<<< HEAD
                                                    <div className="border-white border-2 rounded-2xl">
=======
                                                    <div className="border-gray-600 border-2 rounded-2xl">
>>>>>>> origin/main
                                                        <div
                                                            key={id}
                                                            className="w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black "
                                                        >
                                                            <div className="text-xl w-full text-center py-3 font-bold">{month} {day}</div>

                                                            <div
                                                                className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black overflow-y-auto"
                                                            >
                                                                <div className="font-bold">Notes</div>
                                                                <div>
                                                            <textarea
<<<<<<< HEAD
                                                                className="w-65 h-110 resize-none py-3 outline-none focus:outline-none"
=======
                                                                className="w-65 h-110 resize-none py-3"
>>>>>>> origin/main
                                                                placeholder="Write something here..."
                                                                value={notes}
                                                                onChange={(e) => updateNotesForSession(id, e.target.value)}
                                                            />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="gap-y-3 w-75 h-140 bg-gray-600 rounded-2xl flex flex-col items-center text-black pb-3 py-2 border-gray-600 border-2">
                                                        <div className="text-xl w-full text-center text-white font-bold">{month} {day}</div>
                                                        <div className="overflow-y-auto flex flex-wrap w-full justify-center py-3">

                                                            <div>
                                                                {/* Drag Zones for Each Row */}
<<<<<<< HEAD
                                                                {Object.keys(groupedActivities).length === 0 ? (
                                                                    // Handle empty session case (no rows yet)
                                                                    <Droppable droppableId={`${id}__row-0`} key={"row-0"}>
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.droppableProps}
                                                                                className="flex gap-2 mb-2 px-3 justify-center border-2 border-dashed border-gray-400 rounded-lg py-6"
                                                                            >
                                                                                <div className="text-gray-400 italic">Drop activity here</div>
                                                                                {provided.placeholder}
                                                                            </div>
                                                                        )}
                                                                    </Droppable>
                                                                ) : (
                                                                    Object.keys(groupedActivities)
                                                                        .sort((a, b) => parseInt(a) - parseInt(b))
                                                                        .map((rowKey) => (
                                                                            <Droppable
                                                                                droppableId={`${id}__row-${rowKey}`}
                                                                                key={rowKey}
                                                                            >
                                                                                {(provided) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.droppableProps}
                                                                                        className="flex gap-2 mb-2 px-3"
                                                                                    >
                                                                                        {groupedActivities[rowKey].map((activity, index) => (
                                                                                            <Draggable
                                                                                                key={activity.id}
                                                                                                draggableId={activity.id}
                                                                                                index={index}
                                                                                            >
                                                                                                {(dragProvided) => (
                                                                                                    <div
                                                                                                        ref={dragProvided.innerRef}
                                                                                                        {...dragProvided.draggableProps}
                                                                                                        {...dragProvided.dragHandleProps}
                                                                                                        className="flex-1 basis-0 relative group bg-orange-100 px-4 py-2 rounded shadow text-center select-none transition-transform duration-200 ease-in-out hover:scale-105"
                                                                                                    >
                                                                                                        <button
                                                                                                            className="absolute top-0 right-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                                                            onClick={() => handleRemoveActivityFromSession(session.id, activity)}
                                                                                                        >
                                                                                                            ×
                                                                                                        </button>

                                                                                                        <div className="font-bold">{activity.name}</div>
                                                                                                        <div className="text-sm !k-font-style-italic">{activity.category}</div>
                                                                                                        <div className="font-bold">{activity.duration} minutes</div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </Draggable>
                                                                                        ))}
                                                                                        {provided.placeholder}
                                                                                    </div>
                                                                                )}
                                                                            </Droppable>
                                                                        ))
                                                                )}
                                                            </div>


                                                            {/* Plus Button */}
                                                            <div className="w-64 h-24 flex items-center justify-center">
                                                                <button
                                                                    className="text-4xl sm:text-6xl min-w-[4rem] sm:w-32 h-16 sm:h-20 bg-orange-400 text-white shadow-emerald-50 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                                    onClick={() => handleActivityScreenClick(id)}
                                                                >
                                                                    <div className="leading-none text-base font-bold">New Activity</div>
                                                                </button>
                                                            </div>

=======
                                                                {Object.keys(groupedActivities)
                                                                    .sort((a, b) => parseInt(a) - parseInt(b))
                                                                    .map((rowKey) => (
                                                                        <Droppable
                                                                            droppableId={`${id}__row-${rowKey}`}
                                                                            //direction="horizontal"
                                                                            key={rowKey}
                                                                        >
                                                                            {(provided) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.droppableProps}
                                                                                    className="flex gap-2 mb-2"
                                                                                >
                                                                                    {groupedActivities[rowKey].map((activity, index) => (
                                                                                        <Draggable
                                                                                            key={`${id}__${activity.name}-${index}`}
                                                                                            draggableId={`${id}__${activity.name}-${index}`}
                                                                                            index={index}

                                                                                        >
                                                                                            {(dragProvided) => (
                                                                                                <div
                                                                                                    ref={dragProvided.innerRef}
                                                                                                    {...dragProvided.draggableProps}
                                                                                                    {...dragProvided.dragHandleProps}
                                                                                                    className="relative group bg-orange-100 px-4 py-2 rounded shadow text-center select-none transition-transform duration-200 ease-in-out hover:scale-105"
                                                                                                >
                                                                                                    <button
                                                                                                        className="absolute top-0 right-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                                                        onClick={() => handleRemoveActivityFromSession(session.id, activity)}
                                                                                                    >
                                                                                                        ×
                                                                                                    </button>
                                                                                                    <div className="font-bold">{activity.name}</div>
                                                                                                    <div className="text-sm !k-font-style-italic">{activity.category}</div>
                                                                                                    <div className="font-bold">{activity.duration} minutes</div>
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

                                                            {/* Plus Button */}
                                                            <div className="w-64 h-24 flex items-center justify-center">
                                                                <button
                                                                    className="text-6xl w-20 h-20 bg-orange-400 text-white shadow-emerald-50 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                                    onClick={() => handleActivityScreenClick(id)}
                                                                >
                                                                    <div className="leading-none -mt-2">+</div>
                                                                </button>
                                                            </div>


>>>>>>> origin/main
                                                        </div>
                                                        {/* Total Time */}
                                                        <div className="text-center mt-auto pt-3 text-white font-bold">
                                                            Total Time: {calculateTotalSessionMinutes(session)} Minutes
                                                        </div>
<<<<<<< HEAD
                                                    </div>
                                                    {/* Notes */}
                                                    <div className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black border-white border-2">
                                                        <div className="font-bold">Notes</div>
                                                        <div>
                                                            <textarea
                                                                className="w-65 h-110 resize-none py-3 outline-none focus:outline-none"
=======


                                                    </div>


                                                    {/* Notes */}
                                                    <div className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black border-gray-600 border-2">
                                                        <div className="font-bold">Notes</div>
                                                        <div>
                                                            <textarea
                                                                className="w-65 h-110 resize-none py-3"
>>>>>>> origin/main
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
                    </DragDropContext>
                </div>
<<<<<<< HEAD

                {/*Mobile Display*/}
                <div className="block sm:hidden">
                    <div className="p-5 flex flex-wrap gap-4">
                        {sessions.filter(dateObj => selectedSessions.includes(dateObj.id))
                            .map((session) => {
                                const { id, date, type, notes } = session;
                                const [month, day] = date.split(' ');

                                const groupedActivities = {};
                                session.activities.forEach((activity) => {
                                    const row = activity.row || 0;
                                    if (!groupedActivities[row]) groupedActivities[row] = [];
                                    groupedActivities[row].push(activity);
                                });

                                return (
                                    <div className="flex flex-col gap-y-5 items-center justify-center">

                                        {/* Determines if game or training was selected */}
                                        {type === 'game' ? (
                                            <>
                                                <div className="border-white border-2 rounded-2xl">
                                                    <div
                                                        key={id}
                                                        className="w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black "
                                                    >
                                                        <div className="text-xl w-full text-center py-3 font-bold">{month} {day}</div>

                                                        <div
                                                            className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black overflow-y-auto"
                                                        >
                                                            <div className="font-bold">Notes</div>
                                                            <div>
                                                                <textarea
                                                                    className="w-65 h-110 resize-none py-3 outline-none focus:outline-none"
                                                                    placeholder="Write something here..."
                                                                    value={notes}
                                                                    onChange={(e) => updateNotesForSession(id, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="gap-y-3 w-75 h-140 bg-gray-600 rounded-2xl flex flex-col items-center text-black pb-3 py-2 border-gray-600 border-2">
                                                    <div className="text-xl w-full text-center text-white font-bold">{month} {day}</div>
                                                    <div className="overflow-y-auto flex flex-wrap w-full justify-center py-3">

                                                        <div>
                                                            {/* Drag Zones for Each Row */}
                                                            {Object.keys(groupedActivities)
                                                                .sort((a, b) => parseInt(a) - parseInt(b))
                                                                .map((rowKey) => (
                                                                    <div className="flex gap-2 mb-2 px-3">
                                                                        {groupedActivities[rowKey].map((activity) => (
                                                                            <div key={activity.id} className="flex-1 basis-0 relative group bg-orange-100 px-4 py-2 rounded shadow">
                                                                                <div className="font-bold !k-text-center">{activity.name}</div>
                                                                                <div className="text-sm !k-font-style-italic !k-text-center">{activity.category}</div>
                                                                                <div className="font-bold !k-text-center">{activity.duration} minutes</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                        </div>

                                                    </div>
                                                    {/* Total Time */}
                                                    <div className="text-center mt-auto pt-3 text-white font-bold">
                                                        Total Time: {calculateTotalSessionMinutes(session)} Minutes
                                                    </div>


                                                </div>


                                                {/* Notes */}
                                                <div className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black border-white border-2">
                                                    <div className="font-bold">Notes</div>
                                                    <div>
                                                                <textarea
                                                                    className="w-65 h-110 resize-none py-3 outline-none focus:outline-none"
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
=======
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
                            setTemporaryActivity({name: null, description: null, time: null, category: null, duration: 0, row: null});
                        }}
                    >
                        Confirm
                    </button>

                </div>
            )}

            {showActivityScreen && (
                <div  className="hidden sm:block absolute top-20 left-0 bg-gray-600 w-2/3 sm:w-1/6 shadow p-5 text-gray-600 text-2xl flex flex-col items-center space-y-4 h-auto sm:h-full"
                      ref={activityRef}>
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
                                                {category.activities.map((activity) => (

                                                    <div key={crypto.randomUUID()} className="w-full h-10 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">
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

            {showActivityDetails && (
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-white text-2xl text-center flex flex-col items-center"
                     ref={activityDetailsRef}>

                </div>
            )}

            {showCalendar && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl scale-150">
>>>>>>> origin/main
                        <DatePicker
                            inline
                            onChange={(date) => {
                                const formatted = format(date, 'MMM dd');
                                setTemporarySessionDate(formatted);
                                const fullSession = {
                                    ...temporarySession,
                                    date: formatted};
<<<<<<< HEAD
                                setTemporarySession(fullSession);
                                createSession(fullSession);
                                setShowCalendar(false);
=======
                                setTemporarySession(fullSession); // store latest version
                                createSession(fullSession);
                                setShowCalendar(false); // close after picking
>>>>>>> origin/main
                            }}
                        />
                    </div>
                </div>
            )}
<<<<<<< HEAD
            {showSessionTypeScreen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" ref={sessionRef}>
                    <div className="bg-gray-600 p-4 rounded-xl shadow-lg w-11/12 max-w-xs sm:max-w-md flex flex-col gap-4 items-center">
                        <button
                            onClick={() => handleSessionSelect('training')}
                            className="w-full py-3 sm:py-4 bg-white rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 text-base sm:text-2xl"
=======

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
>>>>>>> origin/main
                        >
                            Training Session
                        </button>
                        <button
                            onClick={() => handleSessionSelect('game')}
<<<<<<< HEAD
                            className="w-full py-3 sm:py-4 bg-white rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 text-base sm:text-2xl"
=======
                            className="
          w-full py-4 bg-white rounded-2xl 
          flex items-center justify-center 
          transition-transform duration-200 ease-in-out hover:scale-105
        "
>>>>>>> origin/main
                        >
                            Game Session
                        </button>
                        <button
                            onClick={() => setSessionTypeScreen(false)}
<<<<<<< HEAD
                            className="mt-2 text-sm text-gray-300 hover:text-white self-end"
=======
                            className="mt-2 text-sm text-gray-300 hover:text-white"
>>>>>>> origin/main
                        >
                            Cancel
                        </button>
                    </div>
<<<<<<< HEAD
                </div>
            )}
=======

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


>>>>>>> origin/main
        </div>
    );
};

export default HomeDashboard;