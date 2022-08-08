import Course from "./Course";
import "./Schedule.css";

function Schedule({ courses }) {
    const firstHour = courses.reduce((earliest, course) => {
        return course.meetings.reduce((_earliest, meeting) => {
            return _earliest > Math.floor(meeting.start) ? Math.floor(meeting.start) : _earliest;
        }, earliest);
    }, 24);
    const lastHour = courses.reduce((latest, course) => {
        return course.meetings.reduce((_latest, meeting) => {
            return _latest < Math.ceil(meeting.stop) ? Math.ceil(meeting.stop) : _latest;
        }, latest);
    }, 0);

    const rows = [];
    for (let i = firstHour; i < lastHour; i++) {
        const coursesNow = courses.reduce((now, course) => {
            return course.meetings.reduce((_now, meeting) => {
                if (Math.floor(meeting.start) === i) {
                    return meeting.days.reduce((days, day) => {
                        if (days[day]) {
                            days[day].push(
                                <Course key={course.section + day} course={course} meeting={meeting} />
                            );
                        } else {
                            days[day] = [
                                <Course key={course.section + day} course={course} meeting={meeting} />
                            ];
                        }

                        return days;
                    }, _now);
                } else {
                    return _now;
                }
            }, now);
        }, {});

        rows.push(
            <tr key={i}>
                <td className="time">{i > 12 ? i % 12 : i}:00 {i > 11 ? 'P' : 'A'}M</td>
                <td>{coursesNow.Monday !== undefined && coursesNow.Monday}</td>
                <td>{coursesNow.Tuesday !== undefined && coursesNow.Tuesday}</td>
                <td>{coursesNow.Wednesday !== undefined && coursesNow.Wednesday}</td>
                <td>{coursesNow.Thursday !== undefined && coursesNow.Thursday}</td>
                <td>{coursesNow.Friday !== undefined && coursesNow.Friday}</td>
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
