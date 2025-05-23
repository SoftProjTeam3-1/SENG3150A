
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
                    // Determine the max existing row number
                    const maxRow = session.activities.length > 0
                        ? Math.max(...session.activities.map(act => act.row ?? 0))
                        : 0;

                    // Create the new activity with the next available row
                    const newActivity = {
                        ...activity,
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
                        activities: session.activities.filter(
                            a => !(a.name === activity.name && a.row === activity.row)
                        )
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
        const [sessionId, rest] = id.split('__');
        const [activityName, indexStr] = rest.split('-');
        return {
            sessionId,
            activityName,
            index: parseInt(indexStr, 10)
        };
    };

    const onDragStart = (start) => {
        console.log("Drag started:");
        console.log("Draggable ID:", start.draggableId);
        console.log("Source Droppable ID:", start.source.droppableId);
    };

    const handleActivityMove = ({ draggableId, source, destination }) => {
        const { sessionId: srcSessionId, rowIndex: srcRow } = parseDroppableId(source.droppableId);
        const { sessionId: dstSessionId, rowIndex: dstRow } = parseDroppableId(destination.droppableId);
        const { activityName } = parseDraggableId(draggableId);

        // If dropped in same spot, do nothing
        if (
            srcSessionId === dstSessionId &&
            srcRow === dstRow &&
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

            // === Intra-row reorder ===
            if (srcSessionId === dstSessionId && srcRow === dstRow) {
                const rowItems = srcActivities.filter(a => a.row === srcRow);

                const rowActivity = rowItems[source.index];
                const globalIndices = srcActivities.reduce((acc, a, i) => {
                    if (a.row === srcRow) acc.push(i);
                    return acc;
                }, []);

                const [removed] = srcActivities.splice(globalIndices[source.index], 1);
                srcActivities.splice(globalIndices[destination.index], 0, removed);

                updatedSessions[srcSessionIndex] = { ...srcSession, activities: srcActivities };
                return updatedSessions;
            }

            // === Inter-row or inter-session move ===
            const srcIdx = srcActivities.findIndex(
                (a) => a.name === activityName && a.row === srcRow
            );
            if (srcIdx === -1) return prevSessions;

            const [movedItem] = srcActivities.splice(srcIdx, 1);
            movedItem.row = dstRow;

            // Find global insert index
            const insertAt = dstActivities.reduce(
                (acc, a, i) => (a.row === dstRow && acc.count++ === destination.index ? { idx: i, found: true, count: acc.count } : acc),
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
        <div className="w-full m-0 p-0">

            <Header/>

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
                                                    <div className="gap-y-3 w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black pb-3 py-2">
                                                        <div className="text-xl w-full text-center ">{month} {day}</div>
                                                        <div className="overflow-y-auto flex flex-wrap w-full justify-center py-3">

                                                            <div>
                                                                {/* Drag Zones for Each Row */}
                                                                {Object.keys(groupedActivities)
                                                                    .sort((a, b) => parseInt(a) - parseInt(b))
                                                                    .map((rowKey) => (
                                                                        <Droppable
                                                                            droppableId={`${id}__row-${rowKey}`}
                                                                            //direction="horizontal"
                                                                            key={rowKey}
                                                                            o
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
                                                                                                    className="relative group bg-blue-100 px-4 py-2 rounded shadow text-center select-none transition-transform duration-200 ease-in-out hover:scale-105"
                                                                                                >
                                                                                                    <button
                                                                                                        className="absolute top-0 right-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                                                        onClick={() => handleRemoveActivityFromSession(session.id, activity)}
                                                                                                    >
                                                                                                        ×
                                                                                                    </button>
                                                                                                    <div>{activity.name}</div>
                                                                                                    <div>{activity.duration} minutes</div>
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
                                                                    className="text-6xl w-70 h-24 bg-emerald-100 shadow-emerald-50 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                                    onClick={() => handleActivityScreenClick(id)}
                                                                >
                                                                    <div className="leading-none -mt-2">+</div>
                                                                </button>
                                                            </div>


                                                        </div>
                                                            {/* Total Time */}
                                                            <div className="text-center mt-auto pt-3">
                                                                Total Time: {calculateTotalSessionMinutes(session)} Minutes
                                                            </div>


                                                    </div>


                                                    {/* Notes */}
                                                    <div className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black">
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
                    </DragDropContext>
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
                            setTemporaryActivity({name: null, description: null, time: null, category: null, duration: 0, row: null});
                        }}
                    >
                        Confirm
                    </button>

                </div>
            )}

            {showActivityScreen && (
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center"
                     ref={activityRef}>
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
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center"
                     ref={sessionRef}>
                    <button onClick={() => handleSessionSelect('training')} className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">Training Session</button><br></br>
                    <button onClick={() => handleSessionSelect('game')} className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">Game Session</button><br></br>
                </div>
            )}

        </div>
            );
};

export default HomeDashboard;