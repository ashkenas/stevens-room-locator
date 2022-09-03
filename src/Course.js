import "./Course.css";

function Course({ course, firstHour }) {
    const offset = `${(course.start - firstHour) * 100}%`;
    const height = `${(course.stop - course.start) * 100}%`;

    return (
        <div className="course" style={{ top: offset, height: height }}>
            <p className="course-section">{course.course}</p>
        </div>
    );
}

export default Course;
