import { useState } from 'react';

function App() {
    const [data, setData] = useState(null);

    if (!data) {
        fetch('http://jacobashkenas.com/cors/?u=https://web.stevens.edu/roomsched/wdprod/', { mode: 'cors' })
            .then(res => res.text())
            .then(text => {
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const newData = {};
                newData.rooms = [...doc.querySelectorAll('a > b')].map(el => el.innerText.split('_')[0]);
                newData.buildings = newData.rooms.map(room => room.split('-')[0]).filter((v, i, a) => a.indexOf(v) === i);
                setData(newData);
            });
    } else {
        console.log(data);
    }
}

export default App;
