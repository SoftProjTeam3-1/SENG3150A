import {calculateTotalSessionMinutes, updateNotesForSession} from "./logic/SessionContainerLogic.js";


const SessionContainer_Mobile = ({sessions, selectedSessions, setSessions}) => {

    return (
        <>

        {/*Mobile Display*/}
        <div className="block sm:hidden">
            <div className="p-5 flex flex-wrap gap-4">
                {sessions.filter(dateObj => selectedSessions.includes(dateObj.id))
                    .map((session) => {
                        const { id, date, type, notes } = session;
                        const [month, day] = date.split(' ');

                        const groupedActivities = {};
                        session.activities.forEach((activity) => {
                            const row = activity.row || 0;
                            if (!groupedActivities[row]) groupedActivities[row] = [];
                            groupedActivities[row].push(activity);
                        });

                        return (
                            <div className="flex flex-col gap-y-5 items-center justify-center">

                                {/* Determines if game or training was selected */}
                                {type === 'game' ? (
                                    <>
                                        <div className="border-white border-2 rounded-2xl">
                                            <div
                                                key={id}
                                                className="w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black "
                                            >
                                                <div className="text-xl w-full text-center py-3 font-bold">{month} {day}</div>

                                                <div
                                                    className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black overflow-y-auto"
                                                >
                                                    <div className="font-bold">Notes</div>
                                                    <div>
                                                                <textarea
                                                                    className="w-65 h-110 resize-none py-3 outline-none focus:outline-none"
                                                                    placeholder="Write something here..."
                                                                    value={notes}
                                                                    onChange={(e) => updateNotesForSession({id:id, newNotes:e.target.value, setSessions})}
                                                                />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="gap-y-3 w-75 h-140 bg-gray-600 rounded-2xl flex flex-col items-center text-black pb-3 py-2 border-gray-600 border-2">
                                            <div className="text-xl w-full text-center text-white font-bold">{month} {day}</div>
                                            <div className="overflow-y-auto flex flex-wrap w-full justify-center py-3">

                                                <div>
                                                    {/* Drag Zones for Each Row */}
                                                    {Object.keys(groupedActivities)
                                                        .sort((a, b) => parseInt(a) - parseInt(b))
                                                        .map((rowKey) => (
                                                            <div className="flex gap-2 mb-2 px-3">
                                                                {groupedActivities[rowKey].map((activity) => (
                                                                    <div key={activity.id} className="flex-1 basis-0 relative group bg-orange-100 px-4 py-2 rounded shadow">
                                                                        <div className="font-bold !k-text-center">{activity.name}</div>
                                                                        <div className="text-sm !k-font-style-italic !k-text-center">{activity.category}</div>
                                                                        <div className="font-bold !k-text-center">{activity.duration} minutes</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                </div>

                                            </div>
                                            {/* Total Time */}
                                            <div className="text-center mt-auto pt-3 text-white font-bold">
                                                Total Time: {calculateTotalSessionMinutes(session)} Minutes
                                            </div>


                                        </div>


                                        {/* Notes */}
                                        <div className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black border-white border-2">
                                            <div className="font-bold">Notes</div>
                                            <div>
                                                                <textarea
                                                                    className="w-65 h-110 resize-none py-3 outline-none focus:outline-none"
                                                                    placeholder="Write something here..."
                                                                    value={notes}
                                                                    onChange={(e) => updateNotesForSession({id:id, newNotes:e.target.value, setSessions})}
                                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>

        </>
    )
}

export default SessionContainer_Mobile;