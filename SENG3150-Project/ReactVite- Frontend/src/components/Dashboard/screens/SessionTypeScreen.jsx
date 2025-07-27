import {handleSessionSelect} from '../logic/VerticalBarSessionLogic.js'

const SessionTypeScreen = ({sessionRef, setSessionTypeScreen, setShowCalendar, setTemporarySession}) => {
    return (
        <>

            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" ref={sessionRef}>
                <div className="bg-gray-600 p-4 rounded-xl shadow-lg w-11/12 max-w-xs sm:max-w-md flex flex-col gap-4 items-center">
                    <button
                        onClick={() => handleSessionSelect({type: 'training', setTemporarySession, setSessionTypeScreen, setShowCalendar})}
                        className="w-full py-3 sm:py-4 bg-white rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 text-base sm:text-2xl"
                    >
                        Training Session
                    </button>
                    <button
                        onClick={() => handleSessionSelect({type: 'game', setTemporarySession, setSessionTypeScreen, setShowCalendar})}
                        className="w-full py-3 sm:py-4 bg-white rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 text-base sm:text-2xl"
                    >
                        Game Session
                    </button>
                    <button
                        onClick={() => setSessionTypeScreen(false)}
                        className="mt-2 text-sm text-gray-300 hover:text-white self-end"
                    >
                        Cancel
                    </button>
                </div>
            </div>

        </>
    )
}

export default SessionTypeScreen;

