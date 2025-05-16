
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header.jsx";






const HomeDashboard = () => {

    //Need to add variables for category's and activities
    //Sync to user when they log in



    // Temporary session which holds data before creation to db
    const [temporarySession, setTemporarySession] = useState({ id:null, date:null, type:null, activities:[], notes:""});

    // Stores sessions from the database
    const [sessions, setSessions] = useState([]);

    // Stores selected local sessions the user has clicked
    const [selectedSessions, setSelectedSessions] = useState([]);

    // Used to show user menus
    const [showActivitieScreen, setShowActivitieScreen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSessionTypeScreen, setSessionTypeScreen] = useState(false);


    // Used to determine if user clicks off menu
    const sessionRef = useRef(null);


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

    const handleActivitieScreenClick = () => {
        setShowActivitieScreen(prev => ! prev);
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
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSessionTypeScreen]);

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
                                    <div className="flex flex-col gap-y-5">

                                        {type === 'game' ? (
                                            <>
                                            <div
                                                key={id}
                                                className="w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black"
                                            >
                                                <div className="text-xl w-full text-center py-3">{month} {day}</div>

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
                                            </div>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    key={id}
                                                    className="w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black"
                                                >
                                                    <div className="text-xl w-full text-center py-3">{month} {day}</div>

                                                    <div id="activities" className="w-full h-24 flex items-center justify-center">
                                                        <button
                                                            className=" text-6xl w-70 h-24 bg-emerald-100 shadow-lg rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                            onClick={() => handleActivitieScreenClick()}
                                                        >
                                                            <div className="leading-none -mt-2">
                                                                +
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>

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

            {showActivitieScreen && (
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-red-400 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center">
                    hello
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

            {showSessionTypeScreen &&(
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center" ref={sessionRef}>
                    <button onClick={() => handleSessionSelect('training')} className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">Training Session</button><br></br>
                    <button onClick={() => handleSessionSelect('game')} className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">Game Session</button><br></br>
                </div>
            )}
        </div>
            );
};

export default HomeDashboard;