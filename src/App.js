import { useState } from 'react';
import Room from './Room';

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

                setData(newData);
            });

        return <></>;
    } else {
        return (<>
            {Object.keys(data.schedule).map(room => <Room key={room} room={room} capacity={data.capacity[room]} schedule={data.schedule[room]} /> )}
        </>);
    }
}

export default App;
