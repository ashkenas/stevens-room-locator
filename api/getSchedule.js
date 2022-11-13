import fetch from "node-fetch";

export default async function handler(request, response) {
    const current = new Date();
    const term = current.getFullYear() + (current.getMonth() > 6 ? 'F' : 'S');
    const res = await fetch(`https://web.stevens.edu/roomsched/wdprod/?term=${term}`, { mode: 'cors' })
    const text = await res.text();
    return response.send(text);
};
