
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

export async function fetchSessions() {
    const res = await fetch('/api/session/fetchSessions', {
        method: 'GET',
        credentials: 'include',
    });
    if (!res.ok) throw new Error(res.status);
    return res.json();
}


export async function syncSession(sessions) {
    try {
        const response = await fetch("api/session/updateSessions", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(sessions)
        });

        if (!response.ok) {
            throw new Error("Failed to update sessions");
        }

        const data = await response.text();
        console.log("Update success:", data);
        return data;
    } catch (err) {
        console.error("Error syncing sessions:", err);
        return null;
    }
}

export async function fetchCategoriesAndActivities() {
    try {
        const response = await fetch('/api/session/fetchCategoriesAndActivities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        return await response.json(); // This will be a List<FetchSessionsResponse> from the backend
    } catch (error) {
        console.error("Error fetching sessions from backend:", error);
        return null;
    }
}

