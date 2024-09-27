import React, { useEffect, useState} from "react";
import { gridIndexSig, gridInit, reloadGrid } from "../utils/commTuiGrid.ts";
import "../style/tui-grid.css";
import { BookingModal } from "./BookingModal.tsx";
import {API_INFO} from "../configs.ts";

const defaultDate = (daysFromToday: number): string => {
    const targetDay: Date = new Date();
    targetDay.setDate(targetDay.getDate() + daysFromToday);
    return String(targetDay.getFullYear()) + "-" + String(targetDay.getMonth() + 1).padStart(2, '0') + "-" + String(targetDay.getDate());
}

export interface BookingParamType {
    startDate: string;
    startTimeCd: string,
    endDate: string,
    endTimeCd: string,
    carNumber: string,
    carModel: string,
    fuelType: string,
    fuelTypeCd: string,
    parkingLocation: string,
    submitter: string,
    driver: string,
    passengers: string | null | undefined,
    destination: string,
    usePropose: string | null | undefined,
    rmrk: string | null,
}

const initBookingParam: BookingParamType = {
    startDate: defaultDate(0),
    startTimeCd: "TDC1",
    endDate: defaultDate(1),
    endTimeCd: "TDC2",
    carNumber: "",
    carModel: "",
    fuelType: "",
    fuelTypeCd: "FLT0",
    parkingLocation: "",
    submitter: "", //TODO: 현재 사용자명으로 대체
    driver: "", //TODO: 현재 사용자명으로 대체
    passengers: "",
    destination: "",
    usePropose: "",
    rmrk: "",
}

const CarBookingCore = () => {
    const [bookingParam, setBookingParam] = useState<BookingParamType>({...initBookingParam});

    return (
        <div className={"carBookingCore"}>
            <DaySelectPhase bookingParam={bookingParam} setBookingParam={setBookingParam}/>
            <CarSelectPhase bookingParam={bookingParam} setBookingParam={setBookingParam}/>
        </div>
    )
}

const DaySelectPhase = (props: {
    bookingParam: BookingParamType,
    setBookingParam: React.Dispatch<React.SetStateAction<BookingParamType>>
}) => {
    const [singleDayUse, setSingDayUse] = useState(false);

    const onChangeParam = (event: any) => {
        const {id, value} = event.target;

        props.setBookingParam({...props.bookingParam, [id as keyof BookingParamType] : value})
    }

    return (
        <div className={"car-booking daySelectPhase"}>
            <div className={"datePicker"}>
                <p>시작일</p>
                <input type={"date"} id={"startDate"}
                       value={props.bookingParam.startDate} onChange={onChangeParam}/>
                <select id={"startTimeCd"} value={props.bookingParam.startTimeCd} onChange={onChangeParam}>
                    <option value={'TDC0'}>종일</option>
                    <option value={'TDC1'}>오전</option>
                    <option value={'TDC2'}>오후</option>
                </select>
            </div>
            <label className={"singleDay"}>
                <input type={"checkbox"} checked={singleDayUse} onChange={() => {
                    setSingDayUse(!singleDayUse);
                    props.setBookingParam({
                        ...props.bookingParam,
                        endDate : props.bookingParam.startDate,
                        endTimeCd : props.bookingParam.startTimeCd,
                    })
                }}/>
                <span>시작 종료 동일</span>
            </label>
            <div className={"datePicker"}>
                <p>종료일</p>
                <input type={"date"} id={"endDate"} disabled={singleDayUse}
                       value={props.bookingParam.endDate} onChange={onChangeParam} />
                <select id={"endTimeCd"} value={props.bookingParam.endTimeCd} disabled={singleDayUse}
                        onChange={onChangeParam}>
                    <option value={'TDC0'}>종일</option>
                    <option value={'TDC1'}>오전</option>
                    <option value={'TDC2'}>오후</option>
                </select>
            </div>
        </div>
    )
}

const CarSelectPhase = (props: {
    bookingParam: BookingParamType,
    setBookingParam: React.Dispatch<React.SetStateAction<BookingParamType>>
}) => {
    const [_carGrid, setCarGrid] = useState<gridIndexSig>();
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [clickData, setClickData] = useState({
        carNumber: props.bookingParam.carNumber,
        carModel: props.bookingParam.carModel,
        fuelType: props.bookingParam.fuelType,
        fuelTypeCd: props.bookingParam.fuelTypeCd,
        parkingLocation: props.bookingParam.parkingLocation
    });

    const columns = [
        { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 150, align: "center"},
        { header : '차량모델', name : 'CAR_MODEL', sortable: true, resizeable: true, width: 120, align: "center"},
        { header : '연료타입', name : 'FUEL_TYPE', sortable: true, resizeable: true, width: 80, align: "center"},
        { header : '주차위치', name : 'PARK_LOC', sortable: true, resizeable: true, align: "center"},
    ]

    const gridClick = (rowData: any) => {
        setClickData({
            carNumber : rowData.CAR_NUM,
            carModel : rowData.CAR_MODEL,
            fuelType: rowData.FUEL_TYPE,
            fuelTypeCd: rowData.FUEL_TYPE_CD,
            parkingLocation: rowData.PARK_LOC
        })
        setBookingModalOpen(true);
    };

    useEffect(() => {
        const grid = gridInit("carGrid", columns, gridClick);
        grid && reloadGrid(grid, "GET", API_INFO+"api/car", props.bookingParam);

        setCarGrid(grid);
    }, []);

    useEffect(() => {
        props.setBookingParam({...props.bookingParam, ...clickData});
    }, [clickData]);

    return (
        <>
            <div className={"car-booking carSelectPhase"}>
                <div className={"car-booking carGrid"} id={"carGrid"}></div>
            </div>
            <BookingModal isModalOpen={bookingModalOpen} setIsModalOpen={setBookingModalOpen}
                          bookingParam={props.bookingParam} setBookingParam={props.setBookingParam}/>
        </>

    )
}



export const CarBooking = React.memo(CarBookingCore);
