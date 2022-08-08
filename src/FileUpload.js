import * as XLSX from 'xlsx/xlsx.mjs';

const maxCell = (worksheet) => {
    const cells = Object.keys(worksheet).filter((k) => /^[A-Z][0-9]+$/.test(k));
    const maxCol = String.fromCharCode(cells.map((cell) => cell.match(/[A-Z]/)[0].charCodeAt(0)).sort((a, b) => b - a)[0]);
    const maxRow = cells.map((cell) => +cell.match(/[0-9]+/)[0]).sort((a, b) => b - a)[0];
    return `${maxCol}${maxRow}`;
};

function FileUpload({ callback }) {
    const readFile = async (event) => {
        if (!event.target.files.length)
            return;

        const workbook = XLSX.read(await event.target.files[0].arrayBuffer());
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        if (worksheet['!ref'].length < 3)
            worksheet['!ref'] += ':' + maxCell(worksheet);

        const data = XLSX.utils.sheet_to_json(worksheet, { range: 2 });
        const courses = data.map((classRow) => {
            if (!classRow['Meeting Patterns'])
                return false;

            const timeSlots = classRow['Meeting Patterns'].split('\n').filter((timeSlot) => timeSlot);
            const meetings = timeSlots.map((timeSlot) => {
                let [fm, days, start, stop, room] = timeSlot.match(/^(.*?) \| (.*?) - (.*?) \| (.*?)$/);
                return {
                    start: start,
                    stop: stop,
                    room: room,
                    days: days.split('/')
                };
            });

            return {
                section: classRow['Section'].split(' - ')[0],
                meetings: meetings
            };
        }).filter((course) => course);

        callback(courses);
    };

    return <input type="file" onChange={readFile} />;
}

export default FileUpload;
