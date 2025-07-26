
// When User clicks new activity on session box
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
