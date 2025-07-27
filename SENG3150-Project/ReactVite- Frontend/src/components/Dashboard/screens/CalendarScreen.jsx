
import {createSession, setTemporarySessionDate} from '../logic/VerticalBarSessionLogic.js'

const CalendarScreen = ({DatePicker, format, temporarySession, setTemporarySession, setShowCalendar, setSessions}) => {
    return (
        <>
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-11/12 max-w-xs sm:max-w-md flex justify-center items-center">
                    <DatePicker
                        inline
                        onChange={(date) => {
                            const formatted = format(date, 'MMM dd');
                            setTemporarySessionDate({date: formatted, setTemporarySession});
                            const fullSession = {
                                ...temporarySession,
                                date: formatted};
                            setTemporarySession(fullSession);
                            createSession({session: fullSession, setSessions: setSessions, setTemporarySession: setTemporarySession});
                            setShowCalendar(false);
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default CalendarScreen;