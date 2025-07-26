




const SessionContainer_Laptop = ({DragDropContext, Droppable, Draggable, onDragStart, onDragEnd, sessions, selectedSessions, updateNotesForSession, handleRemoveActivityFromSession, handleActivityScreenClick, calculateTotalSessionMinutes}) => {

    return (
        <>

            {/*Laptop Display*/}
            {/*Main Display*/}
            <div id="userDisplay" className="hidden sm:block">

                {/* Drag Drop Container */}
                <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
                                    <div className="flex flex-col gap-y-5 ">

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
                                                                onChange={(e) => updateNotesForSession(id, e.target.value)}
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
                                                            {Object.keys(groupedActivities).length === 0 ? (
                                                                // Handle empty session case (no rows yet)
                                                                <Droppable droppableId={`${id}__row-0`} key={"row-0"}>
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.droppableProps}
                                                                            className="flex gap-2 mb-2 px-3 justify-center border-2 border-dashed border-gray-400 rounded-lg py-6"
                                                                        >
                                                                            <div className="text-gray-400 italic">Drop activity here</div>
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Droppable>
                                                            ) : (
                                                                Object.keys(groupedActivities)
                                                                    .sort((a, b) => parseInt(a) - parseInt(b))
                                                                    .map((rowKey) => (
                                                                        <Droppable
                                                                            droppableId={`${id}__row-${rowKey}`}
                                                                            key={rowKey}
                                                                        >
                                                                            {(provided) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.droppableProps}
                                                                                    className="flex gap-2 mb-2 px-3"
                                                                                >
                                                                                    {groupedActivities[rowKey].map((activity, index) => (
                                                                                        <Draggable
                                                                                            key={activity.id}
                                                                                            draggableId={activity.id}
                                                                                            index={index}
                                                                                        >
                                                                                            {(dragProvided) => (
                                                                                                <div
                                                                                                    ref={dragProvided.innerRef}
                                                                                                    {...dragProvided.draggableProps}
                                                                                                    {...dragProvided.dragHandleProps}
                                                                                                    className="flex-1 basis-0 relative group bg-orange-100 px-4 py-2 rounded shadow text-center select-none transition-transform duration-200 ease-in-out hover:scale-105"
                                                                                                >
                                                                                                    <button
                                                                                                        className="absolute top-0 right-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                                                        onClick={() => handleRemoveActivityFromSession(session.id, activity)}
                                                                                                    >
                                                                                                        ×
                                                                                                    </button>

                                                                                                    <div className="font-bold">{activity.name}</div>
                                                                                                    <div className="text-sm !k-font-style-italic">{activity.category}</div>
                                                                                                    <div className="font-bold">{activity.duration} minutes</div>
                                                                                                </div>
                                                                                            )}
                                                                                        </Draggable>
                                                                                    ))}
                                                                                    {provided.placeholder}
                                                                                </div>
                                                                            )}
                                                                        </Droppable>
                                                                    ))
                                                            )}
                                                        </div>


                                                        {/* Plus Button */}
                                                        <div className="w-64 h-24 flex items-center justify-center">
                                                            <button
                                                                className="text-4xl sm:text-6xl min-w-[4rem] sm:w-32 h-16 sm:h-20 bg-orange-400 text-white shadow-emerald-50 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                                onClick={() => handleActivityScreenClick(id)}
                                                            >
                                                                <div className="leading-none text-base font-bold">New Activity</div>
                                                            </button>
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
                                                                onChange={(e) => updateNotesForSession(id, e.target.value)}
                                                            />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </DragDropContext>
            </div>

        </>
    )
}

export default SessionContainer_Laptop;