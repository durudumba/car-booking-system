import {pathNames} from "../utils/common.ts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {EventSourceInput} from "@fullcalendar/core";

export const CarSchedule = (props: any) => {

    const eventList: EventSourceInput = [
        { title: 'event 1', start: '2024-12-01 23:00:00', end : '2024-12-05 00:00:01'},
    ]

    return (
        <div className={"carScheduleCore"} id={pathNames.carSchedule.id}>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView={"dayGridWeek"}
                headerToolbar={{
                    left: "prev",
                    center: "title",
                    right: "next"
                }}
                events={eventList}
                dayHeaderContent={(args: any) => {
                    return dayContentFormatter(args.text);
                }}
                weekNumberContent={(args: any) => {
                    console.log(args);
                    return "dd"
                }}
                titleFormat={{
                    year: 'numeric', month: 'short', day: 'numeric'
                }}

            />
        </div>
    )
}

const dayContentFormatter = (dayInfo: string) => {
    const dayObj = {
        "Mon":"월","Tue":"화","Wed":"수","Thu":"목","Fri":"금","Sat":"토","Sun":"일"
    }
    const dateVec: string[] = dayInfo.split(" ");

    const mon: string = dateVec[1].split("/")[0].padStart(2, '0');
    const date: string = dateVec[1].split("/")[1].padStart(2, '0');
    const day: string = dayObj[dateVec[0] as keyof object]

    return `${date}일 ${day}`
}

