import { useState } from "react";
import Schedule from "./Schedule";
import "./Room.css";

function Room({ room, capacity, schedule, setData }) {
    const [showContents, setShowContents] = useState(false);

    return (
        <div className={`room${showContents ? ' expanded' : ''}`}>
            <div className='summary' onClick={() => setShowContents(!showContents)}>
                <img src="/arrow.svg" />
                <span>{room}</span>
                <span>Capacity: {capacity}</span>
            </div>
            {showContents && <Schedule schedule={schedule} setData={setData} />}
        </div>
    )
}

export default Room;