import React, { useEffect, useState} from "react";
import { gridIndexSig, gridInit, reloadGrid } from "../utils/commTuiGrid.ts";
import "../style/tui-grid.css";
import { BookingModal } from "../modals/BookingModal.tsx";
import {API_INFO} from "../utils/configs.ts";
import {pathNames} from "../utils/common.ts";

const defaultDate = (daysFromToday: number): string => {
    const targetDay: Date = new Date();
    targetDay.setDate(targetDay.getDate() + daysFromToday);
    return String(targetDay.getFullYear()) + "-" + String(targetDay.getMonth() + 1).padStart(2, '0') + "-" + String(targetDay.getDate()).padStart(2, '0');
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
    startDate: defaultDate(1),
    startTimeCd: "TDC1",
    endDate: defaultDate(2),
    endTimeCd: "TDC2",
    carNumber: "",
    carModel: "",
    fuelType: "",
    fuelTypeCd: "FLT0",
    parkingLocation: "",
    submitter: localStorage.getItem("user_name") ?? '',
    driver: localStorage.getItem("user_name") ?? '',
    passengers: "",
    destination: "",
    usePropose: "",
    rmrk: "",
}

const CarBookingCore = () => {
    const [bookingParam, setBookingParam] = useState<BookingParamType>({...initBookingParam});

    return (
        <div className={"carBookingCore"} id={pathNames.carBooking.id}>
            <DaySelectPhase bookingParam={bookingParam} setBookingParam={setBookingParam}/>
            <CarSelectPhase bookingParam={bookingParam} setBookingParam={setBookingParam}
                            initBookingParam={() => setBookingParam(initBookingParam)}/>
        </div>
    )
}

const DaySelectPhase = (props: {
    bookingParam: BookingParamType,
    setBookingParam: React.Dispatch<React.SetStateAction<BookingParamType>>
}) => {
    const [singleDayUse, setSingDayUse] = useState(false);

    const onChangeDateParam = (event: any) => {
        const {id, value}: {id: string, value: any} = event.target;

        // 검증용 파라미터
        let validParam = {...props.bookingParam, [id as keyof BookingParamType] : value}

        // 신청일 검증
        const now = new Date();
        const stdt = new Date(validParam.startDate + (validParam.startTimeCd == "TDC2" ? " 14:00:00" : " 00:00:00"));
        const eddt = new Date(validParam.endDate + (validParam.endTimeCd == "TDC1" ? " 13:59:59" : " 23:59:59"));

        if(stdt < now || eddt < now) {
            alert("신청일자가 과거입니다!\n 신청에 유의하세요");
        }

        if(singleDayUse) {
            validParam = {
                ...validParam,
                endDate : validParam.startDate,
                endTimeCd : validParam.startTimeCd,
            };
        } else if(stdt > eddt) {
            if(id === "startDate" || id === "startTimeCd") {
                eddt.setDate(stdt.getDate()+1);
                validParam = {
                    ...validParam,
                    endDate : `${String(eddt.getFullYear())}-${String(eddt.getMonth()+1).padStart(2, "0")}-${String(eddt.getDate()).padStart(2, "0")}`,
                    endTimeCd : validParam.startTimeCd,
                }
            } else if(id == "endDate" || id === "endTimeCd"){
                alert("종료일이 시작일보다 빠를 수 없습니다");
                return;
            }
        }

        props.setBookingParam(validParam);
    }

    const onChangeSingleDayUse = () => {
        setSingDayUse(!singleDayUse);
        props.setBookingParam({
            ...props.bookingParam,
            endDate : props.bookingParam.startDate,
            endTimeCd : props.bookingParam.startTimeCd,
        })
    };

    return (
        <div className={"car-booking daySelectPhase"}>
            <div className={"datePicker"}>
                <p>시작일</p>
                <input type={"date"} id={"startDate"}
                       value={props.bookingParam.startDate} onChange={onChangeDateParam}/>
                <select id={"startTimeCd"} value={props.bookingParam.startTimeCd} onChange={onChangeDateParam}>
                    <option value={'TDC0'}>종일</option>
                    <option value={'TDC1'}>오전</option>
                    <option value={'TDC2'}>오후</option>
                </select>
            </div>
            <label className={"singleDay"}>
                <input type={"checkbox"} checked={singleDayUse} onChange={onChangeSingleDayUse}/>
                <span>시작 종료 동일</span>
            </label>
            <div className={"datePicker"}>
                <p>종료일</p>
                <input type={"date"} id={"endDate"} disabled={singleDayUse}
                       value={props.bookingParam.endDate} onChange={onChangeDateParam} />
                <select id={"endTimeCd"} value={props.bookingParam.endTimeCd} disabled={singleDayUse}
                        onChange={onChangeDateParam}>
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
    setBookingParam: React.Dispatch<React.SetStateAction<BookingParamType>>,
    initBookingParam: () => void
}) => {
    const [carGrid, setCarGrid] = useState<gridIndexSig>();
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [clickData, setClickData] = useState({
        carNumber: props.bookingParam.carNumber,
        carModel: props.bookingParam.carModel,
        fuelType: props.bookingParam.fuelType,
        fuelTypeCd: props.bookingParam.fuelTypeCd,
        parkingLocation: props.bookingParam.parkingLocation
    });

    const columns = [
        { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, align: "center"},
        { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, align: "center"},
        { header : '연료타입', name : 'FUEL_TYPE', sortable: true, resizeable: true, align: "center"},
    ]

    const gridClick = (rowData: any) => {
        setClickData({
            carNumber : rowData.CAR_NUM,
            carModel : rowData.CAR_MODL,
            fuelType: rowData.FUEL_TYPE,
            fuelTypeCd: rowData.FUEL_TYPE_CD,
            parkingLocation: rowData.PARK_LOC
        })
        setBookingModalOpen(true);
    };

    const reloadCarGrid = () => {
        carGrid && reloadGrid(carGrid, "GET", API_INFO+"api/car/selectCarList", {
            stdt : props.bookingParam.startDate + " " + (props.bookingParam.startTimeCd=="TDC2" ? "140000" : "000000"),
            eddt : props.bookingParam.endDate + " " + (props.bookingParam.endTimeCd=="TDC1" ? "135959" : "235959")
        });
    }

    useEffect(() => {
        const grid = gridInit("carGrid", columns, gridClick);

        grid && reloadGrid(grid, "GET", API_INFO+"api/car/selectCarList", {
                stdt : props.bookingParam.startDate + " " + (props.bookingParam.startTimeCd=="TDC2" ? "140000" : "000000"),
                eddt : props.bookingParam.endDate + " " + (props.bookingParam.endTimeCd=="TDC1" ? "135959" : "235959")
        });

        setCarGrid(grid);
    }, []);

    useEffect(() => {
        props.setBookingParam({...props.bookingParam, ...clickData});
    }, [clickData]);

    useEffect(() => {
        reloadCarGrid();
    }, [props.bookingParam]);

    return (
        <>
            <div className={"car-booking carSelectPhase"}>
                <div className={"car-booking carGrid"} id={"carGrid"}></div>
            </div>
            <BookingModal isModalOpen={bookingModalOpen} setIsModalOpen={setBookingModalOpen}
                          bookingParam={props.bookingParam} setBookingParam={props.setBookingParam}
                          initBookingParam={props.initBookingParam} reloadFunc={reloadCarGrid}
            />
        </>

    )
}



export const CarBooking = React.memo(CarBookingCore);
