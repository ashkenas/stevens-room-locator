function Schedule({ file }) {
    return <pre>{JSON.stringify(file, null, 2)}</pre>;
}

export default Schedule;
