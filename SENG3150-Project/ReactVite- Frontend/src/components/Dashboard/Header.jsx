
import optionsIMG from "../../assets/options.png";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";


// The header needs references to the const iconRef and handleOptionsClick function to work.
// iconRef is a reference to the to options
const Header = () => {

    const navigate = useNavigate();

    // Used to show user menus
    const [showOptions, setShowOptions] = useState(false);


    // True or false value determines if options menu is open
    const handleOptionsClick = () =>{
        setShowOptions(prev => !prev);
    }

    // Used to determine if user clicks off menu
    const iconRef = useRef(null);
    const optionsRef = useRef(null);

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
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showOptions]);

    return (
        <>
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

            {showOptions && (
                <div className="absolute w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-gray-600 text-2xl text-center flex flex-col items-center z-50" ref={optionsRef}>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                            onClick={() => navigate('/manage-activities')}>Manage Activities</button><br></br>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                            onClick={() => navigate('/attendance')}>Attendance</button><br></br>
                    <button className="w-full h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">Logout</button>
                </div>
            )}

        </>

    )
}

export default Header