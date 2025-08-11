

// sessions = The dates that have been made.
// selectedSessions = The sessions selected the user wants to see (highlighted orange)
// handleClickSelectedSessions = The function that is called when a user clicks a session. It adds it to selectedSessions
// handleRemoveDate = The function that is called when a user clicks a session. It removes it from selectedSessions
// handleNewSession = Creates a new session.

import {handleNewSession, handleRemoveDate, handleClickSelectedSessions} from "./logic/VerticalBarSessionLogic.js";


const VerticalBar_Mobile = ({sessions, selectedSessions, setSessionTypeScreen,setSelectedSessions, setTemporarySession}) => {

    return(
        <>

            {/*Mobile Display*/}
            <div className="w-full bg-gray-600 text-lg flex items-center py-2 overflow-x-auto sm:hidden px-4">
                <div className="flex flex-nowrap items-center gap-2">
                    {sessions.map(({ id, shortDate, type }) => {
                        if (!shortDate) return null;
                        const [month, day] = shortDate.split(' ');
                        const isClicked = selectedSessions.includes(id);
                        return (
                            <button
                                key={id}
                                className={`min-w-[5rem] w-[5rem] h-18 px-2 py-2 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 ${isClicked ? 'bg-orange-300' : 'bg-white'}`}
                                onClick={() => handleClickSelectedSessions({id: id, setSelectedSessions})}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    handleRemoveDate({id: id, setSelectedSessions, selectedSessions});
                                }}
                            >
                                <div className="font-bold text-sm">{month} {day}</div>
                                <div className="text-xs text-center break-words">{type} session</div>
                            </button>
                        );
                    })}

                    <button
                        className="min-w-[5rem] w-[5rem] px-2 py-2 h-20 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 bg-white border-4 border-gray-600"
                        onClick={() =>  handleNewSession({setSessionTypeScreen, setTemporarySession})}
                    >
                        <div className="font-bold text-xs">New Session</div>

                    </button>
                </div>
            </div>

        </>
    )
}

export default VerticalBar_Mobile;
