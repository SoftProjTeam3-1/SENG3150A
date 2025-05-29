import React from 'react';

const SessionList = ({ sessions, selectedSessions, onNewActivity, onSessionClick }) => {
    return (
        <div id="verticalBar" className="w-full sm:w-1/4 bg-gray-600 text-2xl flex flex-col items-center">
            <ul className="text-center flex flex-col items-center relative top-[10px]">
                {sessions.map(({ id, date }) => {
                    if (!date) return null;

                    const [month, day] = date.split(' ');
                    const isClicked = selectedSessions.includes(id);
                    return (
                        <button
                            key={id}
                            className={`h-20 w-20 border-4 rounded-2xl flex flex-col items-center justify-center leading-none transition-transform duration-200 ease-in-out hover:scale-110 shadow-lg
                            ${isClicked ? 'bg-orange-400 border-orange-600 text-white' : 'bg-white border-gray-600 text-gray-800'}`}
                            onClick={() => onSessionClick(id)}
                        >
                            <div className="font-bold text-lg">{month}</div>
                            <div className="text-sm">{day}</div>
                        </button>
                    );
                })}
            </ul>

            <button
                className="relative top-[10px] text-6xl h-20 w-20 bg-white border-5 border-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                onClick={onNewActivity}
            >
                <div className="leading-none -mt-2 text-center">+</div>
            </button>
        </div>
    );
};

export default SessionList;