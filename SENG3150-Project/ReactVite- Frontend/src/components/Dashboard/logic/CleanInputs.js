export async function transformSessionsToFront(rawSessions) {
    return rawSessions.map(session => ({
        id: `session-${session.sessionID}`, // or a UUID from backend if exists
        shortDate: formatDate(session.date),     // e.g., 'Aug 14'
        date: session.date,
        type: session.sessionTypeId.toLowerCase(), // normalize case
        notes: "", // add notes if you have it
        activities: (session.activities || []).map(sa => {
            const a = sa.activity || {};  // Access nested activity
            return {
                id: sa.id?.toString() || `activity-${a.id}`,
                name: a.name || "Unnamed Activity",
                description: a.description || "",
                duration: parseInt(a.duration) || "0",
                category: a.activityType?.name || a.category || "General",
                row: sa.row || 0
            };
        })
    }));
}

function normalizeSessionTypeId(v) {
    if (v == null) return null;
    if (typeof v === "number") return v > 0 ? v : null;

    const t = String(v).trim().toLowerCase();
    if (t === "training") return 1;
    if (t === "game") return 2;

    const n = parseInt(t, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
}


// Helper to format dates (to "Aug 14")
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

const pick = (...xs) => xs.find(v => v !== undefined && v !== null);


// main transform function
export function transformSessionsToBack(transformedSessions) {
    return transformedSessions.map(session => {
        const rawType = pick(
            session.sessionTypeId,
            session.sessionTypeID,
            session.sessionType,
            session.type,
            session.typeId,
            session.type_id,
            session.type?.id,
            session.type?.name
        );

        return {
            sessionID: parseInt(session.id.toString().replace("session-", "")),
            date: new Date(session.date),
            sessionTypeId: normalizeSessionTypeId(rawType),
            rollID: parseInt(session.id.toString().replace("session-", "")),
            notes: session.notes || "",
            activities: (session.activities || []).map(a => ({
                id: parseInt(a.id.toString().replace("activity-", "")),
                name: a.name,
                description: a.description,
                duration: a.duration.toString(),
                category: a.category,
                row: a.row || 0
            }))
        };
    });
}

export function transformCategoriesToFront(payload) {
    // payload is the whole response object
    const list = payload?.fetchSpecificCategoriesAndActivitiesResponseList ?? [];

    return list.map(({ activityType, activities }) => ({
        name: activityType,                            // <-- your category name
        activities: (activities ?? []).map(a => ({
            name: a.name ?? "",
            description: a.description ?? "",
            duration: Number.parseInt(a.duration ?? 0, 10) || 0,
            category: activityType
        })),
    }));
}
