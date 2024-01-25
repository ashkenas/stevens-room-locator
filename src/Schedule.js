import { useEffect, useRef } from "react";
import Course from "./Course";
import "./Schedule.css";

function Schedule({ schedule, setData }) {
    const tdRef = useRef(null);
    const courses = schedule.flat();
    const firstHour = courses.reduce((earliest, course) => {
        return earliest > Math.floor(course.start) ? Math.floor(course.start) : earliest;
    }, 24);
    const lastHour = courses.reduce((latest, course) => {
        return latest < Math.ceil(course.stop) ? Math.ceil(course.stop) : latest;
    }, 0);

    useEffect(() => {
        if (tdRef.current)
            window.borderWidth = tdRef.current.computedStyleMap().get('border-top-width').value;
    }, [tdRef])

    const rows = [
        <tr key="headers">
            <td></td>
            <td data-mobile="Mon" data-desktop="Monday"></td>
            <td data-mobile="Tue" data-desktop="Tuesday"></td>
            <td data-mobile="Wed" data-desktop="Wednesday"></td>
            <td data-mobile="Thu" data-desktop="Thursday"></td>
            <td data-mobile="Fri" data-desktop="Friday"></td>
            <td data-mobile="Sat" data-desktop="Saturday"></td>
        </tr>,
        <tr key={firstHour}>
            <td className="time">{firstHour > 12 ? firstHour % 12 : firstHour} {firstHour > 11 ? 'P' : 'A'}M</td>
            <td ref={tdRef}>{schedule[0].map(course => <Course key={course.course} course={course} firstHour={firstHour} setData={setData} />)}</td>
            <td>{schedule[1].map(course => <Course key={course.course} course={course} firstHour={firstHour} setData={setData} />)}</td>
            <td>{schedule[2].map(course => <Course key={course.course} course={course} firstHour={firstHour} setData={setData} />)}</td>
            <td>{schedule[3].map(course => <Course key={course.course} course={course} firstHour={firstHour} setData={setData} />)}</td>
            <td>{schedule[4].map(course => <Course key={course.course} course={course} firstHour={firstHour} setData={setData} />)}</td>
            <td>{schedule[5].map(course => <Course key={course.course} course={course} firstHour={firstHour} setData={setData} />)}</td>
        </tr>
    ];
    for (let i = firstHour + 1; i < lastHour; i++) {
        rows.push(
            <tr key={i}>
                <td className="time">{i > 12 ? i % 12 : i} {i > 11 ? 'P' : 'A'}M</td>
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
        <div className="center">
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
}

export default Schedule;
