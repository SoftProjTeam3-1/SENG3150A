
import optionsIMG from '../../assets/options.png'
import { useState, useEffect, useRef } from "react";



const HomeDashboard = () => {

    const [dateSelected, setDateSelected] = useState([])
    const [dateClicked, setDateClicked] = useState([])
    const [showOptions, setShowOptions] = useState(false);
    const [showSessionType, setSessionType] = useState(false);

    const optionsRef = useRef(null);
    const sessionRef = useRef(null);
    const iconRef = useRef(null);

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

            <div id="header" className="bg-orange-400 text-white p-10 h-32 w-screen text-3xl flex items-center">
                <div style={{display: 'flex'}}>
                    <img
                        src={optionsIMG}
                        ref={iconRef}
                        alt={'Options'}
                        className="w-20 h-20 mr-10"
                        onClick={handleOptionsClick}

                    />
                    <h1 className="flex items-center mr-4">Select Date</h1>
                </div>

            </div>

            {showOptions && (
                <div className="absolute w-1/6 min-h-screen top-32 left-0 bg-gray-600 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center" ref={optionsRef}>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center">Manage Activities</button><br></br>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center">Laptop</button><br></br>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center">Logout</button>
                </div>
            )}

            {showSessionType &&(
                <div className="absolute w-1/6 min-h-screen top-32 left-0 bg-gray-600 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center" ref={sessionRef}>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center">Training Session</button><br></br>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center">Game Session</button><br></br>
                </div>
            )}

            <div id="middleSegment" style={{display: 'flex'}} className="bg-emerald-100 min-h-screen">
                <div id="verticalBar" className=" w-40 bg-gray-600 p-5 text-2xl">
                    <ul className="text-center flex flex-col items-center">

                        {dateSelected.map(({id, value}) => {
                            const [month, day] = value.split(' ');
                            const isClicked = dateClicked.includes(id);

                            return (
                            <button
                                key={id}
                                className={`h-24 w-24 border-5 rounded-2xl flex flex-col items-center justify-center leading-none
                                ${isClicked ? 'bg-orange-300 border-orange-600' : 'bg-white border-gray-600'}`}

                                onClick={() => handleClickAddDate(id)}
                                onContextMenu={(e) => {
                                    e.preventDefault(); // prevent browser context menu
                                    handleRemoveDate(id);
                                }}
                            >
                                <div className="leading-none">{month}</div>
                                <br/>
                                <div className="leading-none -mt-3">{day}</div>
                            </button>
                        );
                        })}
                    </ul>
                    <button
                        className="mx-auto block text-6xl h-24 w-24 bg-white border-5 border-gray-600 rounded-2xl flex flex-col items-center justify-center "
                        onClick={() => handleAddDate('April 28')}>+</button>
                </div>

                <div id="userDisplay">
                    <div className="p-5 flex flex-wrap gap-4">
                        {dateSelected
                            .filter(dateObj => dateClicked.includes(dateObj.id))
                            .map(({ id, value }) => {
                                const [month, day] = value.split(' ');
                                return (
                                    <div
                                        key={id}
                                        className="w-75 h-300 bg-white rounded-2xl flex flex-col items-center text-black"
                                    >
                                        <div className="text-xl w-full text-center py-3">{month} {day}</div>

                                        <div id="activities" className="w-full h-24">
                                            <button
                                                className="mx-auto text-6xl w-70 h-full bg-emerald-100 shadow-lg rounded-2xl flex flex-col items-center justify-center "
                                                onClick={handleNewActivity}
                                            >+</button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>


        </div>
            );
};

export default HomeDashboard;