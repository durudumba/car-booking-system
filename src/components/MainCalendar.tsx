import Calendar from "react-calendar";

function MainCalendar() {

    return (
        <Calendar
            showNeighboringMonth={false}
            calendarType={"hebrew"}
            minDetail={"decade"}
        />
    )
}

export default MainCalendar