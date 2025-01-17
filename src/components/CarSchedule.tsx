import {axiosCall, pathNames} from "../utils/common.ts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {EventSourceInput} from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko"
import {useEffect, useState} from "react";
import {API_INFO} from "../utils/configs.ts";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";


const eventColorList = ["#d97777", "#e5e534", "#6363ec", "#63e063", "#d566d5"];
const eventColorMap: any = {}


export const CarSchedule = () => {
    const [schdList, setSchdList] = useState<EventSourceInput>();

    useEffect(() => {
        axiosCall("GET", API_INFO+"api/book/getDrivingSchedule", null, (data: any) => {
            const schdListTemp: EventSourceInput = []

            for(const schd of data) {
                const customClassNames: string[] = []

                if(!eventColorMap[schd.CAR_NUM as keyof object]) {
                    eventColorMap[schd.CAR_NUM] = eventColorList.shift();
                }




                // if(schd.CAR_NUM === "334마 1630") {
                //     const stdt = new Date(schd.STRT_DT);
                //     const eddt = new Date(schd.END_DT);
                //
                //     // 일정이 주를 넘어가는 경우 : 이전 주
                //     if(stdt.getDay() + (eddt.getDate() - stdt.getDate()) > 6) {
                //     }
                //
                // }




                if(schd.STRT_TMCD == "TDC2") customClassNames.push("fc-event-left-half");
                if(schd.END_TMCD == "TDC1") customClassNames.push("fc-event-right-half");

                schdListTemp.push({
                    id : schd.BOOK_ID,
                    title : schd.CAR_NUM,
                    start : schd.STRT_DT,
                    end : schd.STRT_DT == schd.END_DT ? undefined : new Date(schd.END_DT),
                    color : eventColorMap[schd.CAR_NUM],
                    classNames: customClassNames,
                    extendedProps: schd,
                })
            }
            setSchdList(schdListTemp);
        })
    }, []);

    return (
        <div className={"carScheduleCorebody"}>
            <div className={"carScheduleCore"} id={pathNames.carSchedule.id}>
                <FullCalendar
                    plugins={[ dayGridPlugin ]}
                    initialView={"dayGridWeek"}
                    locale={koLocale}

                    headerToolbar={{
                        left: "prev",
                        center: "title",
                        right: "next",
                    }}
                    events={schdList}
                    eventContent={eventContentFormatter}
                    contentHeight={200}
                    dayHeaderContent={dayHeaderContentFormatter}
                    eventMouseEnter={customEventMouseEnter}
                />
            </div>
        </div>
    )
}

const dayHeaderContentFormatter = (args: any) => {
    const dayInfoVec: string[] = args.text.split(".");

    return `${dayInfoVec[0].trim()}.${dayInfoVec[1].trim()} ${dayInfoVec[2].trim()}`
}

const eventContentFormatter = (args: any) => {
    return args.event._def.title;
}

const customEventMouseEnter = (args: any) => {
    const eventInfo: any = args.event._def.extendedProps;
    const content = `예약번호 : ${eventInfo.BOOK_ID}<br/>
                    차종 : ${eventInfo.CAR_MODL}<br/>
                    운전자(예약자) : ${eventInfo.CAR_DRVR}(${eventInfo.SBMT_NAME})<br/>
                    목적지 : ${eventInfo.DEST}`

    tippy(args.el, {
        content: content,
        placement: "bottom",
        allowHTML: true,
        theme: "tomato"
    })
}
