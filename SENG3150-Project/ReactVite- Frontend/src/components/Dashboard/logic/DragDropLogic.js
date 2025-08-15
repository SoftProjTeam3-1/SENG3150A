
const parseDroppableId = (id) => {
    const [sessionId, rowStr] = id.split('__row-');
    return {
        sessionId,
        rowIndex: parseInt(rowStr, 10)
    };
};
const parseDraggableId = (id) => {
    return { activityId: id };
};


export const onDragStart = (start) => {
    console.log("Drag started:");
    console.log("Draggable ID:", start.draggableId);
    console.log("Source Droppable ID:", start.source.droppableId);
};

//Hook, remove session activity and add session activity
const handleActivityMove = ({ draggableId, source, destination, setSessions }) => {
    const { sessionId: srcSessionId, rowIndex: srcRow } = parseDroppableId(source.droppableId);
    const { sessionId: dstSessionId, rowIndex: dstRowOriginal } = parseDroppableId(destination.droppableId);
    const { activityId } = parseDraggableId(draggableId);  // now parsing activityId directly

    if (
        srcSessionId === dstSessionId &&
        srcRow === dstRowOriginal &&
        source.index === destination.index
    ) return;

    setSessions(prevSessions => {
        const updatedSessions = [...prevSessions];

        const srcSessionIndex = updatedSessions.findIndex(s => s.id === srcSessionId);
        const dstSessionIndex = updatedSessions.findIndex(s => s.id === dstSessionId);
        if (srcSessionIndex === -1 || dstSessionIndex === -1) return prevSessions;

        const srcSession = { ...updatedSessions[srcSessionIndex] };
        const dstSession = srcSessionId === dstSessionId ? srcSession : { ...updatedSessions[dstSessionIndex] };

        const srcActivities = [...srcSession.activities];
        const dstActivities = srcSessionId === dstSessionId ? srcActivities : [...dstSession.activities];

        // Intra-row reorder
        if (srcSessionId === dstSessionId && srcRow === dstRowOriginal) {
            const globalIndices = srcActivities.reduce((acc, a, i) => {
                if (a.row === srcRow) acc.push(i);
                return acc;
            }, []);

            const [removed] = srcActivities.splice(globalIndices[source.index], 1);
            srcActivities.splice(globalIndices[destination.index], 0, removed);

            updatedSessions[srcSessionIndex] = { ...srcSession, activities: srcActivities };
            return updatedSessions;
        }

        // Inter-row or inter-session move
        const srcIdx = srcActivities.findIndex(a => a.id === activityId);
        if (srcIdx === -1) return prevSessions;

        const [movedItem] = srcActivities.splice(srcIdx, 1);

        let finalTargetRow = dstRowOriginal;

        const countInTargetRow = dstActivities.filter(a => a.row === dstRowOriginal).length;

        // If row is full → shift below rows down and place into next row
        if (countInTargetRow >= 2) {
            dstActivities.forEach(activity => {
                if (activity.row >= dstRowOriginal + 1) {
                    activity.row += 1;
                }
            });
            finalTargetRow = dstRowOriginal + 1;
        }

        movedItem.row = finalTargetRow;

        const insertAt = dstActivities.reduce(
            (acc, a, i) => (a.row === finalTargetRow && acc.count++ === destination.index ? { idx: i, found: true, count: acc.count } : acc),
            { idx: dstActivities.length, count: 0, found: false }
        ).idx;

        dstActivities.splice(insertAt, 0, movedItem);

        updatedSessions[srcSessionIndex] = { ...srcSession, activities: srcActivities };
        if (srcSessionId !== dstSessionId) {
            updatedSessions[dstSessionIndex] = { ...dstSession, activities: dstActivities };
        }

        return updatedSessions;
    });
};


export const getOnDragEnd = (result, setSessions) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
        console.warn("Dropped outside a valid droppable.");
        return;
    }

    handleActivityMove({ draggableId, source, destination, setSessions});
};


