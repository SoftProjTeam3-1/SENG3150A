import optionsIMG from "../../assets/options.png";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = (headerLabel) => {
    headerLabel = headerLabel.headerLabel || "Dashboard";

    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);

    const handleOptionsClick = () => {
        setShowOptions((prev) => !prev);
    };

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
            <div
                id="header"
                className="bg-orange-400 shadow text-white p-3 h-20 w-screen text-2xl sm:text-3xl flex items-center justify-between"
            >
                <div className="flex items-center">
                    <img
                        src={optionsIMG}
                        ref={iconRef}
                        alt={"Options"}
                        className="w-12 h-12 sm:w-20 sm:h-20 mr-4 sm:mr-10 transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={handleOptionsClick}
                    />
                    <h1 className="flex items-center">{headerLabel}</h1>
                </div>
            </div>

            {showOptions && (
                <div
                    className="absolute w-3/4 sm:w-1/6 min-h-screen top-20 left-0 bg-gray-600 shadow p-5 text-gray-600 text-lg sm:text-2xl text-center flex flex-col items-center z-50"
                    ref={optionsRef}
                >
                    <button
                        className="w-full h-12 sm:h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={() => navigate("/manage-activities")}
                    >
                        Manage Activities
                    </button>
                    <br />
                    <button
                        className="w-full h-12 sm:h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={() => navigate("/attendance")}
                    >
                        Attendance
                    </button>
                    <br />
                    <button
                        className="w-full h-12 sm:h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>
                    <br />
                    <button className="w-full h-12 sm:h-20 bg-white rounded-2xl flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105">
                        Logout
                    </button>
                </div>
            )}
        </>
    );
};

export default Header;