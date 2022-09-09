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
    const [filters, setFilters] = useState({ day: '0' });
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
                setFilters({ ...filters, capacity: newData.minCap });
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
        if (filters.start && filters.stop) {
            const start = +filters.start.substring(0, 2) + (+filters.start.substring(3, 5) / 60);
            const stop = +filters.stop.substring(0, 2) + (+filters.stop.substring(3, 5) / 60);
            validRooms = validRooms.filter(room => {
                const schedule = data.schedule[room][+filters.day];
                if (!schedule.length)
                    return true;

                if (schedule[0].start > stop || schedule[schedule.length - 1].stop < start)
                    return true;

                for (let i = 0; i < schedule.length - 1; i++) {
                    if (schedule[i].stop < start && schedule[i + 1].start > stop)
                        return true;
                }

                return false;
            });
        }


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
                <div className="field">
                    <button disabled>Day</button>
                    <select onChange={setFilter.bind(null, 'day')}>
                        <option value="0">Mon</option>
                        <option value="1">Tue</option>
                        <option value="2">Wed</option>
                        <option value="3">Thu</option>
                        <option value="4">Fri</option>
                        <option value="5">Sat</option>
                    </select>
                </div>
                <div className="field">
                    <button disabled>Start Time</button>
                    <input onChange={setFilter.bind(null, 'start')} type="time" />
                </div>
                <div className="field">
                    <button disabled>End Time</button>
                    <input onChange={setFilter.bind(null, 'stop')} type="time" />
                </div>
            </div>
            {validRooms.map(room => <Room key={room} room={room} capacity={data.capacity[room]} schedule={data.schedule[room]} /> )}
        </>);
    }
}

export default App;
