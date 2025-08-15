import { createSessionInBackend, deleteSession } from './hooks.js';

//Functions for setting a temporary session. A temporary session is made first before being added to the sessions list
export const setTemporarySessionID = ({setTemporarySession}) => {
    setTemporarySession(prev => ({ ...prev, id: crypto.randomUUID() }));
};

export const setTemporarySessionType = ({type, setTemporarySession}) => {
    setTemporarySession(prev => ({ ...prev, type }));
};

export const setTemporarySessionDate = ({date, setTemporarySession}) => {
    setTemporarySession(prev => ({ ...prev, date }));
};



// Sets the session ID
export const handleNewSession = ({setSessionTypeScreen, setTemporarySession}) =>{
    setTemporarySessionID({setTemporarySession});
    setSessionTypeScreen(prev => !prev);
}


// Sets the Session type and opens calendar
export const handleSessionSelect = ({type, setSessionTypeScreen, setShowCalendar, setTemporarySession}) => {
    setTemporarySessionType({type: type, setTemporarySession});
    setSessionTypeScreen(false);
    setShowCalendar(true);
};

// Creates a new session
//TODO: Hook this up to the backend. This is the creation second of the session
export const createSession = async ({session, setSessions, setTemporarySession}) => {

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

    //hook below, the function location is in hooks.js::
    await createSessionInBackend(newSession); // This function would handle the backend logic
};

// Functionality for when a date box is clicked
export const handleClickSelectedSessions = ({id, setSelectedSessions}) =>{
    setSelectedSessions(prev =>
        prev.includes(id)
            ? prev.filter(clickedId => clickedId !== id) // unselect
            : [...prev, id] // select
    );
}

// Functionality for when date box is right-clicked to be removed
//TODO: Hook this up to the backend DELETE SESSION
export const handleRemoveDate = ({id, setSelectedSessions, selectedSessions}) =>{
    setSelectedSessions(prev => prev.filter(dateObj => dateObj.id !== id));
    setSelectedSessions(prev => prev.filter(clickedId => clickedId !== id));

   deleteSession(selectedSessions);
}

