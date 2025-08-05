
export async function createSessionInBackend(newSession){
    try{
        // need to sanitise newSession here. 
        var sanitisedSession = {
            sessionid : newSession.id,
            date : newSession.date,
            session_typeid : newSession.type,
            userid : null,
            rollid : null
        };

        const response = await fetch('/api/session/create',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sanitisedSession)
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            await response.json();
    }
    catch(error){
        console.error("Error creating session in backend:", error);
    }
};

export async function deleteSession(selectedSessions){
    try{
        const response = await fetch('/api/session/deleteSessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session : selectedSessions })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        await response.json();
    }
    catch(error){
        console.error("Error deleting session in backend:", error);
    }
};


export async function addSessionActivity(activity){
    try{
        const response = await fetch('/api/sessionActivity/addSessionActivity',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        await response.json();

    }
    catch(error){
        console.error("Error adding session Activity:", error);
    }
}

export async function deleteSessionActivity(activity){
    try{
        const response = await fetch('/api/sessionActivity/deleteSessionActivity',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        await response.json();
    }
    catch(error){
        console.error("Error deleting session Activity:", error);
    }
}

