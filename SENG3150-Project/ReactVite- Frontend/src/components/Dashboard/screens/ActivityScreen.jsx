import EditDurationScreen from "./EditDurationScreen.jsx";

const ActivityScreen = ({activityRef, openCategory, Categories, toggleCategory, setShowActivityScreen, setTemporaryActivity, handleEditDuration, setOpenCategory}) => {
    return (
        <>
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" ref={activityRef}>
                <div className="bg-gray-600 w-11/12 max-w-xs sm:max-w-md shadow p-5 rounded-xl text-gray-600 text-lg sm:text-2xl flex flex-col items-center space-y-4 h-auto max-h-[90vh] overflow-y-auto">
                    <div className="mb-2 text-white">Select Activity:</div>
                    <ul className="w-full text-center flex flex-col items-center gap-2">
                        {openCategory === null ? (
                            // Show all categories when no category is selected
                            Categories.map((category) => (
                                <div key={category.name} className="w-full">
                                    <button
                                        className="w-full h-20 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                        onClick={() => toggleCategory(category.name)}
                                    >
                                        <div>{category.name}</div>
                                    </button>
                                </div>
                            ))
                        ) : (
                            // Show only the selected category dropdown
                            <div className="w-full">
                                <button
                                    className="w-full h-20 bg-white text-gray-600 rounded-2xl flex flex-col items-center justify-center"
                                    onClick={() => toggleCategory(null)}  // allow collapsing back
                                >
                                    <div>Back to Categories</div>
                                </button>

                                <div className="flex flex-col gap-2 mt-2 w-full">
                                    {Categories.find(c => c.name === openCategory)?.activities.map((activity, index) => (
                                        <button
                                            key={index}
                                            className="w-full h-10 bg-white text-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 text-xs select-none"
                                            onClick={() => {
                                                setShowActivityScreen(false);
                                                setTemporaryActivity(activity);
                                                handleEditDuration();
                                                setOpenCategory(null);
                                            }}
                                        >
                                            {activity.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ul>

                    <button
                        onClick={() => {
                            setShowActivityScreen(false);
                            setOpenCategory(null);
                        }}
                        className="mt-2 text-sm text-gray-300 hover:text-white self-end"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    )
}

export default ActivityScreen;