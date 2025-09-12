import { getAccessToken } from '../../Auth/AuthProvider';

function authHeaders(extra = {}){
    const token = getAccessToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra
    };
}

function handleUnauthorized(response){
    if(response.status === 401){
        console.warn('Unauthorized – redirecting to login');
        // Force logout style redirect
        window.location.href = '/';
        return true;
    }
    return false;
}

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
            headers: authHeaders(),
            credentials: 'include',
            body: JSON.stringify(sanitisedSession)
        });

        if (handleUnauthorized(response)) return null;
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
            headers: authHeaders(),
            credentials: 'include',
            body: JSON.stringify({ session : selectedSessions })
        });

        if (handleUnauthorized(response)) return null;
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
            headers: authHeaders(),
            credentials: 'include',
            body: JSON.stringify(activity)
        });

        if (handleUnauthorized(response)) return null;
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
            headers: authHeaders(),
            credentials: 'include',
            body: JSON.stringify(activity)
        });
        if (handleUnauthorized(response)) return null;
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        await response.json();
    }
    catch(error){
        console.error("Error deleting session Activity:", error);
    }
}

export async function fetchSessions() {
    try {
        const response = await fetch('/api/session/fetchSessions', {
            method: 'POST',
            headers: authHeaders(),
            credentials: 'include'
        });

        if (handleUnauthorized(response)) return null;
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        return await response.json(); // This will be a List<FetchSessionsResponse> from the backend
    } catch (error) {
        console.error("Error fetching sessions from backend:", error);
        return null;
    }
}

export async function syncSession(sessions) {
    try {
        const response = await fetch("api/session/updateSessions", {
            method: "PUT",
            headers: authHeaders(),
            credentials: "include",
            body: JSON.stringify(sessions)
        });

        if (handleUnauthorized(response)) return null;
        if (!response.ok) {
            throw new Error("Failed to update sessions");
        }

        const data = await response.text(); // or json() depending on backend
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
            headers: authHeaders(),
            credentials: "include"
        });

        if (handleUnauthorized(response)) return null;
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        return await response.json(); // This will be a List<FetchSessionsResponse> from the backend
    } catch (error) {
        console.error("Error fetching sessions from backend:", error);
        return null;
    }
}

