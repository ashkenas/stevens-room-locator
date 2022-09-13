import "./Popup.css";

function renderTime(time) {
    const hour = +time.substring(0, 2);
    const minute = time.substring(2);
    return (hour % 12 || 12).toString().padStart(2, '0') + ':' + minute + (hour >= 12 ? ' PM' : ' AM');
}

function Popup({ data }) {
    if (!data)
        return <></>;

    return (
        <div className="popup" style={{ bottom: data.y, left: data.x }}>
            <div>{data.course}</div>
            <div>{data.prof}</div>
            <div>{data.students}/{data.classCap} Students</div>
            <div>{renderTime(data.startString)} &ndash; {renderTime(data.stopString)}</div>
        </div>
    )
}

export default Popup;