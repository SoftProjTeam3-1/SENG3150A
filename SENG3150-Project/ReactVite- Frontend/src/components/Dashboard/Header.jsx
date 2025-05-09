
import optionsIMG from "../../assets/options.png";


// The header needs references to the const iconRef and handleOptionsClick function to work.
// iconRef is a reference to the to options
const Header = ({ handleOptionsClick, iconRef }) => {

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
        </>
    )
}

export default Header