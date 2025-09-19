import { api } from '../../../lib/api';

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

        await api.post('/api/session/create', sanitisedSession);
    }
    catch(error){
        console.error("Error creating session in backend:", error);
    }
};

export async function deleteSession(selectedSessions){
    try{
        await api.post('/api/session/deleteSessions', { session : selectedSessions });
    }
    catch(error){
        console.error("Error deleting session in backend:", error);
    }
};


export async function addSessionActivity(activity){
    try{
        await api.post('/api/sessionActivity/addSessionActivity', activity);
    }
    catch(error){
        console.error("Error adding session Activity:", error);
    }
}

export async function deleteSessionActivity(activity){
    try{
        await api.post('/api/sessionActivity/deleteSessionActivity', activity);
    }
    catch(error){
        console.error("Error deleting session Activity:", error);
    }
}

export async function fetchSessions() {
    try {
        return await api.post('/api/session/fetchSessions', {});
    } catch (error) {
        console.error("Error fetching sessions from backend:", error);
        return null;
    }
}

export async function syncSession(sessions) {
    try {
        const data = await api.put("api/session/updateSessions", sessions);
        console.log("Update success:", data);
        return data;
    } catch (err) {
        console.error("Error syncing sessions:", err);
        return null;
    }
}

export async function fetchCategoriesAndActivities() {
    try {
        return await api.post('/api/session/fetchCategoriesAndActivities', {});
    } catch (error) {
        console.error("Error fetching sessions from backend:", error);
        return null;
    }
}

