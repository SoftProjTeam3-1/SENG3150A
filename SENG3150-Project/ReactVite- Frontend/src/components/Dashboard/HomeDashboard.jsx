import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";



import Header from "./Header.jsx";
import VerticalBar_Mobile from "./VerticalBar_Mobile.jsx";
import VerticalBar_Laptop from "./VerticalBar_Laptop.jsx";
import SessionContainer_Laptop from "./SessionContainer_Laptop.jsx";
import SessionContainer_Mobile from "./SessionContainer_Mobile.jsx";
import EditDurationScreen from "./screens/EditDurationScreen.jsx";
import ActivityScreen from "./screens/ActivityScreen.jsx";
import ActivityDetailScreen from "./screens/ActivityDetailScreen.jsx";
import CalendarScreen from "./screens/CalendarScreen.jsx";
import SessionTypeScreen from "./screens/SessionTypeScreen.jsx";

import {populateDefaultCategories} from "./logic/PopulatingLogic.js";
import {fetchSessions, syncSession} from "./logic/hooks.js";
import {transformSessionsToBack, transformSessionsToFront} from "./logic/CleanInputs.js";



const HomeDashboard = () => {
    // Temporary session which holds data before creation to db
    const [temporarySession, setTemporarySession] = useState({ id:null, shortDate:null, date:null, type:null, activities:[], notes:""});

    // Stores sessions from the database
    const [sessions, setSessions] = useState([]);

    // Stores selected local sessions the user has clicked
    const [selectedSessions, setSelectedSessions] = useState([]);

    // Temporary category which holds data before being added to categories list: NOT USED, but good to see
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


    // Handles Adding the Activity to the session
    const [singleSelectedSession, setSingleSelectedSession] = useState(); // Sets session ID in order to know where to add the activity to


    // Handles Duration of Activity Functions
    const [durationInput, setDurationInput] = useState(0);

    useEffect(() => {
        if (sessions && sessions.length > 0) {
            const fetchAndClean = async () => {
                const cleanedSessions = await transformSessionsToBack(sessions);
                await syncSession(cleanedSessions)
                    .then(data => {
                        console.log("Sessions synced:", data);
                    })
                    .catch(err => {
                        console.error("Error syncing sessions:", err);
                    });
            }
            fetchAndClean();
        }
    }, [sessions]); // runs only when `sessions` changes

    // Show sessions in console for debugging
    useEffect(() => {
        console.log("Sessions updated:", sessions);
    }, [sessions]);

    // After User Logs in
    useEffect(() => {
        fetchSessions()
            .then((sessions) => {
                console.log("Fetched sessions:", sessions);
                if (sessions === null) {
                    console.warn("Returned Sessions list is null");
                } else {
                    const fetchAndClean = async () => {
                        const rawSessions = await fetchSessions();
                        const cleanedSessions = await transformSessionsToFront(rawSessions);
                        console.log("Cleaned Sessions: ", cleanedSessions);
                        setSessions(cleanedSessions);
                    };
                    fetchAndClean();
                }
            })
            .catch((err) => {
                console.error("Failed to fetch sessions", err);
                // optionally redirect to login if 403
            });
    }, []);


    // When a User clicks away from a menu, the pop-up screen disappears
    useEffect(() => {
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


    // POPULATES DASHBOARD -- REMOVE WHEN HOOKS WORK
    useEffect(() => {
        populateDefaultCategories({setCategories});
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

            // Intra-row reorder
            if (srcSessionId === dstSessionId && srcRow === dstRow) {
                //const rowItems = srcActivities.filter(a => a.row === srcRow);

                //const rowActivity = rowItems[source.index];
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
        <div className="w-full m-0 p-0 max-w-full">

            <Header headerLabel={"Mayfield Soccer Team - Dashboard"}/>

            <div id="middleSegment" style={{display: 'flex', backgroundColor: '#AFD2BB' }} className="flex flex-col sm:flex-row bg-white min-h-screen max-w-full">


                <VerticalBar_Mobile
                    sessions={sessions}
                    selectedSessions={selectedSessions}
                    setSessionTypeScreen={setSessionTypeScreen}
                    setSelectedSessions={setSelectedSessions}
                    setTemporarySession={setTemporarySession}
                />

                <VerticalBar_Laptop
                    sessions={sessions}
                    selectedSessions={selectedSessions}
                    setSessionTypeScreen={setSessionTypeScreen}
                    setSelectedSessions={setSelectedSessions}
                    setTemporarySession={setTemporarySession}
                />


                <SessionContainer_Laptop
                    sessions={sessions}
                    setSessions={setSessions}
                    selectedSessions={selectedSessions}
                    DragDropContext={DragDropContext}
                    Droppable={Droppable}
                    Draggable={Draggable}
                    setShowActivityScreen={setShowActivityScreen}
                    setSingleSelectedSession={setSingleSelectedSession}
                />

                <SessionContainer_Mobile
                    sessions={sessions}
                    selectedSessions={selectedSessions}
                />

            </div>

            {showEditDurationScreen && (
                <EditDurationScreen
                    editRef={editRef}
                    durationInput={durationInput}
                    setDurationInput={setDurationInput}
                    temporaryActivity={temporaryActivity}
                    setTemporaryActivity={setTemporaryActivity}
                    setShowEditDurationScreen={setShowEditDurationScreen}
                    setSessions={setSessions}
                    singleSelectedSession={singleSelectedSession}
                />
            )}

            {showActivityScreen && (
                <ActivityScreen
                    activityRef={activityRef}
                    openCategory={openCategory}
                    Categories={Categories}
                    setShowActivityScreen={setShowActivityScreen}
                    setTemporaryActivity={setTemporaryActivity}
                    setOpenCategory={setOpenCategory}
                    setShowEditDurationScreen={setShowEditDurationScreen}/>
            )}

            {showActivityDetails && (
                <ActivityDetailScreen/>
            )}

            {showCalendar && (
                <CalendarScreen
                    DatePicker={DatePicker}
                    format={format}
                    temporarySession={temporarySession}
                    setTemporarySession={setTemporarySession}
                    setSessions={setSessions}
                    setShowCalendar={setShowCalendar}/>
            )}

            {showSessionTypeScreen && (
                <SessionTypeScreen
                    sessionRef={sessionRef}
                    setSessionTypeScreen={setSessionTypeScreen}
                    setShowCalendar={setShowCalendar}
                    setTemporarySession={setTemporarySession}/>
            )}
        </div>
    );
};

export default HomeDashboard;