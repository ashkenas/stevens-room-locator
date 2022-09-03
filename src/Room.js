import { useState } from "react";
import Schedule from "./Schedule";
import "./Room.css";

function Room({ room, capacity, schedule }) {
    const [showContents, setShowContents] = useState(false);

    return (
        <div className={`room${showContents ? ' expanded' : ''}`} onClick={() => setShowContents(!showContents)}>
            <div className='summary'>
                <span>{room}</span>
                <span>Capacity: {capacity}</span>
            </div>
            {showContents && <Schedule schedule={schedule} />}
        </div>
    )
}

export default Room;