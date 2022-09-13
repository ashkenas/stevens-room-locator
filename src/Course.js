import "./Course.css";

function Course({ course, firstHour }) {
    const offset = `${(course.start - firstHour) * 100}%`;
    const height = `${(course.stop - course.start) * 100}%`;
    const extraOffsetPixels = Math.floor(course.start) - firstHour;
    const extraHeightPixels = Math.floor(course.stop) - Math.floor(course.start);

    return (
        <div className="course" style={{ top: `calc(${offset} + ${extraOffsetPixels}px)`, height: `calc(${height} + ${extraHeightPixels}px)` }}>
            <p className="course-section">{course.course}</p>
        </div>
    );
}

export default Course;
