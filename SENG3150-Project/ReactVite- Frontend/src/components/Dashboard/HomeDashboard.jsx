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
import {fetchSessions} from "./logic/hooks.js";
import {transformSessions} from "./logic/CleanInputs.js";


const HomeDashboard = () => {
    // Temporary session which holds data before creation to db
    const [temporarySession, setTemporarySession] = useState({ id:null, date:null, type:null, activities:[], notes:""});

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
                        const cleanedSessions = await transformSessions(rawSessions);
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