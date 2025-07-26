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

    // Creates a new session
    const createSession = async (session) => {

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





    // Handles Duration of Activity Functions

    const [durationInput, setDurationInput] = useState(0);

    const handleEditDuration = () => {
        setShowEditDurationScreen(prev => !prev);
    }




    // Show sessions in console for debugging
    useEffect(() => {
        console.log("Sessions updated:", sessions);
    }, [sessions]);


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
                    sessions={sessions}
                    setSessions={setSessions}
                    selectedSessions={selectedSessions}
                    updateNotesForSession={updateNotesForSession}
                    handleActivityScreenClick={handleActivityScreenClick}
                    DragDropContext={DragDropContext}
                    Droppable={Droppable}
                    Draggable={Draggable}
                />

                <SessionContainer_Mobile
                sessions={sessions}
                selectedSessions={selectedSessions}
                updateNotesForSession={updateNotesForSession}
                />

            </div>

            {showEditDurationScreen && (
                <EditDurationScreen
                editRef={editRef}
                durationInput={durationInput}
                setDurationInput={setDurationInput}
                handleEditDuration={handleEditDuration}
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
                toggleCategory={toggleCategory}
                setShowActivityScreen={setShowActivityScreen}
                setTemporaryActivity={setTemporaryActivity}
                handleEditDuration={handleEditDuration}
                setOpenCategory={setOpenCategory}/>
            )}

            {showActivityDetails && (
                <ActivityDetailScreen/>
            )}

            {showCalendar && (
                <CalendarScreen
                DatePicker={DatePicker}
                format={format}
                setTemporarySessionDate={setTemporarySessionDate}
                temporarySession={temporarySession}
                setTemporarySession={setTemporarySession}
                createSession={createSession}
                setShowCalendar={setShowCalendar}/>
            )}

            {showSessionTypeScreen && (
                <SessionTypeScreen
                sessionRef={sessionRef}
                handleSessionSelect={handleSessionSelect}
                setSessionTypeScreen={setSessionTypeScreen}/>
            )}
        </div>
    );
};

export default HomeDashboard;