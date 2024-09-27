import Calendar from "react-calendar";

function MainCalendar() {


    const dayFormat = (_locale: string | undefined, date: Date): string => {
        return date.getDate().toString();
    }

    return (
        <>
            <Calendar
                prev2Label={null}
                next2Label={null}

                showNeighboringMonth={false}
                calendarType={"hebrew"}
                minDetail={"decade"}


                formatDay={dayFormat}
            />
        </>

    )
}

export default MainCalendar