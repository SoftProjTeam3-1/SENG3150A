import optionsIMG from '../../assets/options.png'
import { useState, useEffect, useRef } from "react";

const ActivityComponent = () => {
    const optionsRef = useRef(null);
    const sessionRef = useRef(null);
    const iconRef = useRef(null);
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
        <div>
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
            <div>Hello</div>
        </div>
    );
}

export default ActivityComponent;