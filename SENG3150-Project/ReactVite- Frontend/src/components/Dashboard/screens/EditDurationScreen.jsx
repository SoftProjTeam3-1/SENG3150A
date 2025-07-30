import {handleEditDuration} from "../logic/ActivityLogic.js";
import {handleClickActivity} from "../logic/SessionContainerLogic.js";

const EditDurationScreen = ({editRef, durationInput, setDurationInput, temporaryActivity, setTemporaryActivity, setShowEditDurationScreen, setSessions, singleSelectedSession}) => {
    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 ">
            <div className="bg-gray-600 shadow p-5 rounded-xl text-white text-lg sm:text-2xl text-center flex flex-col items-center w-11/12 max-w-xs sm:max-w-md" ref={editRef}>
                <div className="mb-2">Edit Duration (Minutes):</div>
                <input
                    type="number"
                    min="1"
                    className="w-20 h-10 rounded text-white text-center border-2 border-white mb-4"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                />
                <button
                    //NOTE: This button statically changes the duration of the activity for that particular session. 
                    //we may need to add durationt to sessionactivity in the backend. If that is the case, we will need to put a hook here
                    className="bg-white text-gray-800 rounded px-4 py-2 hover:bg-gray-300"
                    onClick={() => {
                        handleEditDuration(setShowEditDurationScreen)
                        const activityWithDuration = { ...temporaryActivity, duration: durationInput };
                        handleClickActivity({activity: activityWithDuration, setSessions, singleSelectedSession});
                        setTemporaryActivity({name: null, description: null, time: null, category: null, duration: 0, row: null});
                        setDurationInput(0);
                    }}
                >
                    Confirm
                </button>
                <button
                    onClick={() => setShowEditDurationScreen(false)}
                    className="mt-2 text-sm text-gray-300 hover:text-white self-end"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default EditDurationScreen;
