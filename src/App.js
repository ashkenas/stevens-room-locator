import { useState } from 'react';
import FileUpload from './FileUpload';
import Schedule from './Schedule';

function App() {
    const [file, setFile] = useState(null);

    if (!file)
        return <FileUpload callback={setFile} />

    return <Schedule file={file} />
}

export default App;
