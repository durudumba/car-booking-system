import {axiosCall, pathNames} from "../utils/common.ts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {EventSourceInput} from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko"
import {useContext, useEffect, useState} from "react";
import {API_INFO} from "../utils/configs.ts";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import {MenuContext} from "./MenuContext.tsx";


const eventColorList = ["#d97777", "#e5e534", "#6363ec", "#63e063", "#d566d5"];
const eventColorMap: any = {}


export const CarSchedule = () => {
    const [schdList, setSchdList] = useState<EventSourceInput>();
    const {setMenuName} = useContext(MenuContext);

    useEffect(() => {
        setMenuName(pathNames.carSchedule.id);
    });

    useEffect(() => {
        axiosCall("GET", API_INFO+"api/book/getDrivingSchedule", null, (data: any) => {
            const schdListTemp: EventSourceInput = []

            for(const schd of data) {
                const customClassNames: string[] = []

                if(!eventColorMap[schd.CAR_NUM as keyof object]) {
                    eventColorMap[schd.CAR_NUM] = eventColorList.shift();
                }

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
                });
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
                    contentHeight={380}

                    eventContent={eventContentFormatter}
                    dayHeaderContent={dayHeaderContentFormatter}
                    eventMouseEnter={customEventMouseEnter}
                    expandRows={true}

                />
            </div>
        </div>
    )
}

const dayHeaderContentFormatter = (args: any) => {
    const dayInfoVec: string[] = args.text.split(".");
    console.log(dayInfoVec)

    return `${dayInfoVec[0].trim()}/${dayInfoVec[1].trim()}\n${dayInfoVec[2].trim()}`
}

const eventContentFormatter = (args: any) => {
    return args.event._def.title.replace(" ", "\n");
}

const customEventMouseEnter = (args: any) => {
    const eventInfo: any = args.event._def.extendedProps;
    const content =
        `예약번호 ${eventInfo.BOOK_ID}<br/>
        차량 : [ ${eventInfo.CAR_MODL} ] ${eventInfo.CAR_NUM}<br/>
        신청자 : ${eventInfo.SBMT_NAME}<br/>
        목적지 : ${eventInfo.DEST}`

    tippy(args.el, {
        content: content,
        placement: "bottom",
        allowHTML: true,
        theme: "tomato"
    })
}
