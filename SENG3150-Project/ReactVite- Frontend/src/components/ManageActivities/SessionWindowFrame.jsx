/*
    This component is a test
*/
import "./SessionWindowFrameCss.css";

const SessionWindowFrameComponent = () => {
    return (
      <div className="session-window-frame">
        <div className="search">
          <p className="text-1">    Search</p>
          <img src="" />
        </div>
        <button className="category-button">
          <p className="text-3">Warm Ups</p>
        </button>
        <div className="square-add-activity">
          <p className="text-4">+</p>
        </div>
      </div>
    )
  }
  
  export default SessionWindowFrameComponent;
