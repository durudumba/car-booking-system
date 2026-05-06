import React, { useEffect, useState, useContext} from "react";
import { gridIndexSig, gridInit, reloadGrid } from "../utils/commTuiGrid.ts";
import "../style/tui-grid.css";
import { BookingModal } from "../modals/BookingModal.tsx";
import {API_INFO} from "../utils/configs.ts";
import {BookingParamType, initBookingParam, pathNames, showAlert} from "../utils/common.ts";
import {MenuContext} from "./MenuContext.tsx";

const CarBookingCore = () => {
    const [bookingParam, setBookingParam] = useState<BookingParamType>({
        ...initBookingParam,
        submitter : localStorage.getItem("id") ?? "",
        driver : localStorage.getItem("id") ?? ""
    });
    const {setMenuName} = useContext(MenuContext);

    useEffect(() => {
        setMenuName(pathNames.carBooking.id);
    });

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
    // const [singleDayUse, setSingDayUse] = useState(false);
    const [noticePast, setNoticePast] = useState(false);

    const onChangeDateParam = (event: any) => {
        const {id, value}: {id: string, value: any} = event.target;

        // 검증용 파라미터
        let validParam = {...props.bookingParam, [id as keyof BookingParamType] : value}

        // 신청일 검증
        const stdt = new Date(validParam.startDate + (validParam.startTimeCd == "TDC2" ? " 14:00:00" : " 00:00:00"));
        const eddt = new Date(validParam.endDate + (validParam.endTimeCd == "TDC1" ? " 13:59:59" : " 23:59:59"));


        // if(singleDayUse) validParam = {...validParam, endDate : validParam.startDate, endTimeCd : validParam.startTimeCd,};

        if(stdt > eddt) {
            if(id === "startDate" || id === "startTimeCd") {
                validParam = {
                    ...validParam,
                    endDate : `${String(stdt.getFullYear())}-${String(stdt.getMonth()+1).padStart(2, "0")}-${String(stdt.getDate()).padStart(2, "0")}`,
                }
            } else if(id == "endDate" || id === "endTimeCd"){
                showAlert("종료일이 시작일보다 빠를 수 없습니다");
                return;
            }
        }

        const now = new Date().getTime();
        const valueTime = new Date(value).getTime();
        if(valueTime && !noticePast && (valueTime + ( 60 * 60 * 24 * 1000 ) < now)) {
            showAlert("선택한 일자가 과거입니다!<br/>신청에 유의하세요!");
            setNoticePast(true);
        }

        props.setBookingParam(validParam);
    }

    // const onChangeSingleDayUse = () => {
    //     setSingDayUse(!singleDayUse);
    //     props.setBookingParam({...props.bookingParam, endDate : props.bookingParam.startDate, endTimeCd : props.bookingParam.startTimeCd,})
    // };

    return (
        <div className={"car-booking daySelectPhase"}>
            <div className={"datePicker"}>
                <p>시작일</p>
                <input type={"date"} id={"startDate"}
                       value={props.bookingParam.startDate} onChange={onChangeDateParam}/>
                {/*<select id={"startTimeCd"} value={props.bookingParam.startTimeCd} onChange={onChangeDateParam}><option value={'TDC0'}>종일</option><option value={'TDC1'}>오전</option><option value={'TDC2'}>오후</option></select>*/}
            </div>
            {/*<label className={"singleDay"}><input type={"checkbox"} checked={singleDayUse} onChange={onChangeSingleDayUse}/><span>시작 종료 동일</span></label>*/}
            <div className={"datePicker"}>
                <p>종료일</p>
                <input type={"date"} id={"endDate"} value={props.bookingParam.endDate} onChange={onChangeDateParam} />
                {/*<select id={"endTimeCd"} value={props.bookingParam.endTimeCd} disabled={singleDayUse} onChange={onChangeDateParam}><option value={'TDC0'}>종일</option><option value={'TDC1'}>오전</option><option value={'TDC2'}>오후</option></select>*/}
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
        const param ={
            stdt : props.bookingParam.startDate + " " + (props.bookingParam.startTimeCd=="TDC2" ? "140000" : "000000"),
            eddt : props.bookingParam.endDate + " " + (props.bookingParam.endTimeCd=="TDC1" ? "135959" : "235959")
        }
        carGrid && reloadGrid(carGrid, "GET", API_INFO+"api/car/selectCarList", param);
    }

    useEffect(() => {
        const grid = gridInit("carGrid", columns, gridClick);

        const param ={
            stdt : props.bookingParam.startDate + " " + (props.bookingParam.startTimeCd=="TDC2" ? "140000" : "000000"),
            eddt : props.bookingParam.endDate + " " + (props.bookingParam.endTimeCd=="TDC1" ? "135959" : "235959")
        }
        grid && reloadGrid(grid, "GET", API_INFO+"api/car/selectCarList", param);

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
