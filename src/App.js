import { useState } from 'react';
import FileUpload from './FileUpload';
import Schedule from './Schedule';

function App() {
    const [courses, setCourses] = useState(null);

    if (!courses)
        return <FileUpload callback={setCourses} />

    return <Schedule courses={courses} />
}

export default App;
