import {useEffect, useState} from "react";
import {gridIndexSig, gridInit, reloadGrid} from "../utils/commTuiGrid.ts";
import {API_INFO} from "../configs.ts";

const setInputParkingLocation = (rowData: any) => {
    if(rowData.value === 'Y') {
        return "작성";
    } else if(rowData.value === 'N') {
        return "미작성";
    }
}

const schdGridColumn = [
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운전자', name : 'CAR_DRVR', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '주차위치', name : 'PARK_LOC', sortable: true, resizeable: true, align: 'center'},
    { header : '시작일', name : 'STRT_DT', sortable: true, resizeable: true, align: 'center'},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, align: 'center'},
]

const histGridColumn = [
    { header : '주차기록', name : 'INPT_PARK_LOC_YN', sortable: true, resizeable: true, align: 'center', formatter: setInputParkingLocation},
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운전자', name : 'CAR_DRVR', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '주차위치', name : 'INPT_PARK_LOC', sortable: true, resizeable: true, align: 'center'},
    { header : '시작일', name : 'STRT_DT', sortable: true, resizeable: true, align: 'center'},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, align: 'center'},
]

export const DrivingInfo = () => {
    const [grid, setGrid] = useState<{
        schdGrid: gridIndexSig | undefined,
        histGrid: gridIndexSig | undefined}>();

    const onClickSchdGrid = (e: any) => {
    }
    const onClickHistGrid = (e: any) => {
    }

    const reloadSchdGrid = () => {
        reloadGrid(grid?.schdGrid, "get", API_INFO+"api/book/getDrivingSchedule", {userId: localStorage.getItem("id")});
    }
    const reloadHistGrid = () => {
        reloadGrid(grid?.histGrid, "get", API_INFO+"api/book/getDrivingHistory", {userId: localStorage.getItem("id")});
    }

    useEffect(() => {
        const param = {
            userId: localStorage.getItem("id")
        }

        const schdGrid = gridInit("schdGrid", schdGridColumn, onClickSchdGrid);
        const histGrid = gridInit("histGrid", histGridColumn, onClickHistGrid);

        reloadGrid(schdGrid, "get", API_INFO+"api/book/getDrivingSchedule", param);
        reloadGrid(histGrid, "get", API_INFO+"api/book/getDrivingHistory", param, (data: any) => {
            console.log(data);
        });

        setGrid({schdGrid: schdGrid, histGrid: histGrid})
    }, []);

    return(
        <div className={"drivingInfoCore"}>
            <div className={"driving-schedule"}>
                <h2>운행 일정</h2>
                <div className={"schdGrid"} id={"schdGrid"}/>
            </div>

            <div className={"driving-history"}>
                <h2>운행 기록</h2>
                <div className={"histGrid"} id={"histGrid"}/>
            </div>
        </div>
    )
}