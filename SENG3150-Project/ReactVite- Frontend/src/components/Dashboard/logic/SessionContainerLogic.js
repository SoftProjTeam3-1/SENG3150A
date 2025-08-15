
// Calculate total minutes
export const calculateTotalSessionMinutes = (session) => {
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


// When a User clicks new activity on session box
export const handleClickActivity = ({activity, setSessions, singleSelectedSession}) => {
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



export const handleRemoveActivityFromSession = ({sessionId, activity, setSessions}) => {
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


export const handleActivityScreenClick = ({id, setShowActivityScreen, setSingleSelectedSession}) => {
    setShowActivityScreen(prev => ! prev);
    // Sets the ID so we know which box to add the activity to
    setSingleSelectedSession(id);
}

// TO DO: Hook this up to the backend to update the notes for the session
export const updateNotesForSession = ({id, newNotes, setSessions}) => {
    //set session
    setSessions(prev =>
        //map through the sessions saved in state
        prev.map(session =>
            //if the session ID is found, the notes within that sessuion specifically are updated. 
            session.id === id ? { ...session, notes: newNotes } : session
        )
    );
};