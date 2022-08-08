import "./Course.css";

function Course({ course, meeting }) {
    const offset = `${(meeting.start - Math.floor(meeting.start)) * 100}%`;
    const height = `${(meeting.stop - meeting.start) * 100}%`;

    return (
        <div className="course" style={{ backgroundColor: course.color, top: offset, height: height }}>
            <p className="course-section">{course.section}</p>
            <p className="course-room">{meeting.room}</p>
        </div>
    );
}

export default Course;
