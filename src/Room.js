import { useState } from "react";
import Schedule from "./Schedule";
import "./Room.css";

function Room({ room, capacity, schedule }) {
    const [showContents, setShowContents] = useState(false);

    return (
        <div className={`room${showContents ? ' expanded' : ''}`}>
            <div className='summary' onClick={() => setShowContents(!showContents)}>
                <span>{room}</span>
                <span>Capacity: {capacity}</span>
            </div>
            {showContents && <Schedule schedule={schedule} />}
        </div>
    )
}

export default Room;