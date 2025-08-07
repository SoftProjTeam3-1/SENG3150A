export async function transformSessions(rawSessions) {
    return rawSessions.map(session => ({
        id: `session-${session.sessionID}`, // or a UUID from backend if exists
        date: formatDate(session.date),     // e.g., 'Aug 14'
        type: session.sessionTypeId.toLowerCase(), // normalize case
        notes: "", // add notes if you have it
        activities: (session.activities || []).map(sa => {
            const a = sa.activity || {};  // Access nested activity
            return {
                id: sa.id?.toString() || `activity-${a.id}`,
                name: a.name || "Unnamed Activity",
                description: a.description || "",
                duration: parseInt(a.duration) || "0",
                category: a.category || "General"
            };
        })
    }));
}

// Helper to format dates (to "Aug 14")
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}
