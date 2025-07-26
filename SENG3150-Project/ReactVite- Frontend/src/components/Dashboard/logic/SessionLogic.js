
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
