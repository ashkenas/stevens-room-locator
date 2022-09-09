import { useState } from 'react';
import Room from './Room';
import "./App.css";
import Spinner from './Spinner';

const dayLetterToNumber = {
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4,
    S: 5
};

function App() {
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState({});
    const setFilter = (filter, { target }) => {
        if (target === undefined)
            return;

        const newFilters = { ...filters };
        newFilters[filter] = target.value === 'undefined' ? undefined : target.value;
        setFilters(newFilters);
    };

    if (!data) {
        fetch('https://cors-go-away.herokuapp.com/?u=https://web.stevens.edu/roomsched/wdprod/', { mode: 'cors' })
            .then(res => res.text())
            .then(text => {
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const newData = {
                    rooms: [],
                    capacity: {},
                    schedule: {}
                };

                const rooms = [...doc.querySelectorAll('a > b')];
                for (const room of rooms) {
                    const [, roomName, roomCapacity] = /^(.*?)_\((.*?)\)/.exec(room.innerText);
                    newData.rooms.push(roomName);
                    newData.capacity[roomName] = +roomCapacity;

                    const schedule = [[], [], [], [], [], []];
                    [...doc.querySelectorAll(`b[id="${room.innerText}"] + a + table tr`)].slice(1).forEach((row) => {
                        const dayLetter = row.firstElementChild.innerText;
                        [...row.querySelectorAll('td[bgcolor]')].forEach(timeBlock => {
                            const [, course, start, stop] = /^(.*?)\(.*?\[(.*?)-(.*?)\]/.exec(timeBlock.innerText);
                            schedule[dayLetterToNumber[dayLetter]].push({
                                course: course,
                                start: +start.substring(0, 2) + (+start.substring(2) / 60),
                                stop: +stop.substring(0, 2) + (+stop.substring(2) / 60)
                            });
                        });
                    });

                    newData.schedule[roomName] = schedule;
                }

                newData.buildings = newData.rooms.map(room => room.split('-')[0]).filter((v, i, a) => a.indexOf(v) === i);
                newData.maxCap = Math.max(...Object.values(newData.capacity));
                newData.minCap = Math.min(...Object.values(newData.capacity));

                setData(newData);
                setFilters({ capacity: newData.minCap });
            });

        return <Spinner />;
    } else {
        if (filters.capacity && filters.capacity > data.maxCap)
            setFilters({ ...filters, capacity: data.maxCap });
        if (filters.capacity && filters.capacity < data.minCap)
            setFilters({ ...filters, capacity: data.minCap });

        let validRooms = Object.keys(data.capacity);
        if (filters.building)
            validRooms = validRooms.filter(room => room.startsWith(`${filters.building}-`));
        if (filters.capacity)
            validRooms = validRooms.filter(room => data.capacity[room] >= filters.capacity);

        return (<>
            <div className="controls">
                <div className="field">
                    <button disabled>Building</button>
                    <select onChange={setFilter.bind(null, 'building')}>
                        <option value="undefined">Any Building</option>
                        {data.buildings.map(building => <option key={building} value={building}>{building}</option>)}
                    </select>
                </div>
                <div className="field">
                    <button disabled>Min Capacity</button>
                    <input onChange={setFilter.bind(null, 'capacity')} type="number" min={data.minCap} max={data.maxCap} step={1} value={filters.capacity} />
                </div>
            </div>
            {validRooms.map(room => <Room key={room} room={room} capacity={data.capacity[room]} schedule={data.schedule[room]} /> )}
        </>);
    }
}

export default App;
