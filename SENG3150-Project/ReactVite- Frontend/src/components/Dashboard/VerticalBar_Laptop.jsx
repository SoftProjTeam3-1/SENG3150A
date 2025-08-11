

// sessions = The dates that have been made.
// selectedSessions = The sessions selected the user wants to see (highlighted orange)
// handleClickSelectedSessions = The function that is called when a user clicks a session. It adds it to selectedSessions
// handleRemoveDate = The function that is called when a user clicks a session. It removes it from selectedSessions
// handleNewSession = Creates a new session.

import {handleNewSession, handleRemoveDate, handleClickSelectedSessions} from "./logic/VerticalBarSessionLogic.js"

const VerticalBar_Laptop = ({sessions, selectedSessions, setSessionTypeScreen, setSelectedSessions, setTemporarySession}) => {

    return(
        <>

            {/*Laptop Display*/}
            <div id="verticalBar" className="lg:max-w-50 w-1/5 bg-gray-600 text-2xl flex flex-col items-center py-0 overflow-x-visible hidden sm:flex max-w-full">
                <ul className="text-center flex flex-col items-center relative top-[10px]">
                    {sessions.map(({id, shortDate, type}) => {
                        if (!shortDate) return null;
                        const [month, day] = shortDate.split(' ');
                        const isClicked = selectedSessions.includes(id);
                        return (
                            <button
                                key={id}
                                className={`w-32 h-20 mt-2 rounded-2xl flex flex-col items-center justify-center leading-none transition-transform duration-200 ease-in-out hover:scale-105 ${isClicked ? 'bg-orange-300' : 'bg-white'}`}
                                onClick={() => handleClickSelectedSessions({id: id, setSelectedSessions})}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    handleRemoveDate({id: id, setSelectedSessions, selectedSessions});
                                }}>
                                <div className="font-bold">{month} {day}</div>
                                <div className="text-sm">{type} session</div>
                            </button>
                        );
                    })}
                </ul>

                <button
                    className="mt-4 text-6xl w-32 h-20 bg-white border-4 border-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                    onClick={() => handleNewSession({setSessionTypeScreen, setTemporarySession})}
                >
                    <div className="font-bold text-base">New Session</div>
                </button>
            </div>

        </>
    )
}

export default VerticalBar_Laptop;
