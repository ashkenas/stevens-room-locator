function Course({ course }) {
    const meetings = [];

    for (const meeting of course.meetings) {
        for (const day of meeting.days) {
            meetings.push(
                <div key={meeting.room + day} className="course" style={{ backgroundColor: course.color }}>
                    <p className="course-section">{course.section}</p>
                    <p className="course-room">{meeting.room}</p>
                </div>
            );
        }
    }

    return <>{meetings}</>
}

export default Course;
