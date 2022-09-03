import Course from "./Course";
import "./Schedule.css";

function Schedule({ schedule }) {
    const courses = schedule.flat();
    const firstHour = courses.reduce((earliest, course) => {
        return earliest > Math.floor(course.start) ? Math.floor(course.start) : earliest;
    }, 24);
    const lastHour = courses.reduce((latest, course) => {
        return latest < Math.ceil(course.stop) ? Math.ceil(course.stop) : latest;
    }, 0);

    const rows = [
        <tr key={firstHour}>
            <td className="time">{firstHour > 12 ? firstHour % 12 : firstHour}:00 {firstHour > 11 ? 'P' : 'A'}M</td>
            <td>{schedule[0].map(course => <Course course={course} firstHour={firstHour} />)}</td>
            <td>{schedule[1].map(course => <Course course={course} firstHour={firstHour} />)}</td>
            <td>{schedule[2].map(course => <Course course={course} firstHour={firstHour} />)}</td>
            <td>{schedule[3].map(course => <Course course={course} firstHour={firstHour} />)}</td>
            <td>{schedule[4].map(course => <Course course={course} firstHour={firstHour} />)}</td>
            <td>{schedule[5].map(course => <Course course={course} firstHour={firstHour} />)}</td>
        </tr>
    ];
    for (let i = firstHour + 1; i < lastHour; i++) {
        rows.push(
            <tr key={i}>
                <td className="time">{i > 12 ? i % 12 : i}:00 {i > 11 ? 'P' : 'A'}M</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        );
    }

    return (
        <table>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default Schedule;
