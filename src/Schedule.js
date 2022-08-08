import Course from "./Course";

function Schedule({ courses }) {
    return <>{courses.map((course) => <Course key={course.section} course={course} />)}</>;
}

export default Schedule;
