/*
    This component is a test
*/
import "./SessionWindowFrameCss.css";
import "../Dashboard/Header.jsx";

const SessionWindowFrameComponent = () => {
    return (
      <>
      <div className="session-window-frame">
        <button className="category-button">
          <p className="text-3">Warm Ups</p>
        </button>
        <div className="square-add-activity">
          <p className="text-4">+</p>
        </div>
      </div>
      </>
    )
  }
  
  export default SessionWindowFrameComponent;
