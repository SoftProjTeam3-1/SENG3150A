
import optionsIMG from '../../assets/options.png'
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';



const HomeDashboard = () => {

    //Need to add variables for category's and activities
    //Sync to user when they log in

    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState(null);
    //const [notes, setNotes] = useState({});

    const [showCalendar, setShowCalendar] = useState(false);
    const [newDate, setNewDate] = useState(null);

    const [dateSelected, setDateSelected] = useState([])
    const [dateClicked, setDateClicked] = useState([])

    const [showOptions, setShowOptions] = useState(false);
    const [showSessionType, setSessionType] = useState(false);

    const optionsRef = useRef(null);
    const sessionRef = useRef(null);
    const iconRef = useRef(null);

    const toAttendancePage = () => {
        const navigate = useNavigate();

        return (
            <button
                className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center"
                onClick={() => navigate('/')}
            >
                Attendance
            </button>
        );
    };

    // Functionality for when the + button is clicked
    const handleAddDate = (newDate) =>{
        const newId = crypto.randomUUID();  //Generate an ID for a date
        setDateSelected(prev => [...prev, {id: newId, value: newDate}])
    }

    // Functionality for when a date box is clicked
    const handleClickAddDate = (id) =>{

        setDateClicked(prev =>
            prev.includes(id)
                ? prev.filter(clickedId => clickedId !== id) // unselect
                : [...prev, id] // select
        );
    }

    // Functionality for when date box is right-clicked to be removed
    const handleRemoveDate = (id) =>{
        setDateSelected(prev => prev.filter(dateObj => dateObj.id !== id));
        setDateClicked(prev => prev.filter(clickedId => clickedId !== id));
    }

    const handleOptionsClick = () =>{
        setShowOptions(prev => !prev);
    }

    const handleNewActivity = () =>{
        setSessionType(prev => !prev);
    }

    const handleSessionSelect = (type) => {
        setSelectedType(type);
        setSessionType(false);
        setShowCalendar(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showOptions &&
                optionsRef.current &&
                !optionsRef.current.contains(event.target) &&
                iconRef.current &&
                !iconRef.current.contains(event.target)
            ) {
                setShowOptions(false);
            }

            if (
                showSessionType &&
                sessionRef.current &&
                !sessionRef.current.contains(event.target)
            ) {
                setSessionType(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showOptions, showSessionType]);

    return(
        <div className="w-full m-0 p-0">

            <div id="header" className="bg-orange-400 shadow text-white p-3 h-20 w-screen text-3xl flex items-center">
                <div style={{display: 'flex'}}>
                    <img
                        src={optionsIMG}
                        ref={iconRef}
                        alt={'Options'}
                        className="w-20 h-20 mr-10 transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={handleOptionsClick}
                    />
                    <h1 className="flex items-center mr-4">Select Date</h1>
                </div>
            </div>

            <div id="middleSegment" style={{display: 'flex'}} className="bg-emerald-100 min-h-screen">
                <div id="verticalBar" className=" w-25 bg-gray-600  text-2xl flex flex-col items-center ">
                    <ul className="text-center flex flex-col items-center relative top-[10px]">
                        {dateSelected.map(({id, value}) => {
                            const [month, day] = value.split(' ');
                            const isClicked = dateClicked.includes(id);
                            return (
                            <button
                                key={id}
                                className={`h-20 w-20 border-5 rounded-2xl flex flex-col items-center justify-center leading-none transition-transform duration-200 ease-in-out hover:scale-105
                                ${isClicked ? 'bg-orange-300 border-orange-600' : 'bg-white border-gray-600'}`}
                                onClick={() => handleClickAddDate(id)}
                                onContextMenu={(e) => {
                                    e.preventDefault(); // prevent browser context menu
                                    handleRemoveDate(id);
                                }}>

                                <div className="leading-none">{month}</div>
                                <br/>
                                <div className="leading-none -mt-5">{day}</div>
                            </button>
                        );
                        })}
                    </ul>

                    <button
                        className="relative top-[10px] text-6xl h-20 w-20 bg-white border-5 border-gray-600 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={() => handleNewActivity()}
                    >
                        <div className="leading-none -mt-2 text-center">
                            +
                        </div>
                    </button>
                </div>

                <div id="userDisplay">
                    <div className="p-5 flex flex-wrap gap-4">
                        {dateSelected
                            .filter(dateObj => dateClicked.includes(dateObj.id))
                            .map(({ id, value }) => {
                                const [month, day] = value.split(' ');

                                return (
                                    <div className="flex flex-col gap-y-5">
                                        <div
                                            key={id}
                                            className="w-75 h-140 bg-white rounded-2xl flex flex-col items-center text-black"
                                        >
                                            <div className="text-xl w-full text-center py-3">{month} {day}</div>

                                            <div id="activities" className="w-full h-24 flex items-center justify-center">
                                                <button
                                                    className=" text-6xl w-70 h-24 bg-emerald-100 shadow-lg rounded-2xl flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                                                    onClick={handleNewActivity}
                                                >
                                                    <div className="leading-none -mt-2">
                                                        +
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <div
                                            className="text-l py-3 w-75 h-125 bg-white rounded-2xl flex flex-col items-center text-black"
                                        >
                                            Notes
                                            <div>
                                                <textarea
                                                    className="w-65 h-110 resize-none py-3"
                                                    placeholder="Write something here...">
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>

            {showCalendar && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl scale-150">
                        <DatePicker
                            inline
                            selected={newDate}
                            onChange={(date) => {
                                setNewDate(date);
                                const formatted = format(date, 'MMM dd');
                                handleAddDate(formatted);
                                setShowCalendar(false); // close after picking
                            }}
                        />
                    </div>
                </div>
            )}

            {showOptions && (
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center " ref={optionsRef}>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                            onClick={() => navigate('/manage-activities')}>Manage Activities</button><br></br>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                    onClick={() => navigate('/attendance')}>Attendance</button><br></br>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">Logout</button>
                </div>
            )}

            {showSessionType &&(
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center" ref={sessionRef}>
                    <button onClick={() => handleSessionSelect('training')} className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">Training Session</button><br></br>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">Game Session</button><br></br>
                </div>
            )}
        </div>
            );
};

export default HomeDashboard;