import {pathNames} from "../utils/common.ts";
import {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {gridIndexSig, gridInit, reloadGrid} from "../utils/commTuiGrid.ts";
import {API_INFO} from "../utils/configs.ts";

const schdGridColumn = [
    { header : '예약번호', name : 'BOOK_ID', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '연료타입', name : 'FUEL_TYPE', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운전자', name : 'CAR_DRVR', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '현 주차위치', name : 'PARK_LOC', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '최근 사용자', name: 'RCNT_USER', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '시작일', name : 'STRT_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
]

const norcGridColumn = [
    { header : '예약번호', name : 'BOOK_ID', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '신청자', name : 'SBMT_NAME', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '목적지', name : 'DEST', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '종료시간', name : 'END_TM', sortable: true, resizeable: true, width: 100, align: 'center'},
]

const histGridColumn = [
    { header : '예약번호', name : 'BOOK_ID', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운행여부', name : 'DRIV_YN', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운전자', name : 'CAR_DRVR', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '시작일', name : 'STRT_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '작성한 주차위치', name : 'INPT_PARK_LOC', sortable: true, width: 150, resizeable: true, align: 'center'},
]

export const DrivingManage = () => {
    const [grid, setGrid] = useState<{
        schdGrid: gridIndexSig | undefined,
        norcGrid: gridIndexSig | undefined,
        histGrid: gridIndexSig | undefined}>();
    const [tabName, setTabName] = useState("scheduleTab")


    const onClickSchdGrid = (e: any) => {
        console.log(e);
    }
    const onClickNorcGrid = (e: any) => {
        console.log(e);
    }
    const onClickHistGrid = (e: any) => {
        console.log(e);
    }

    const onChangeTabName = (e: any) => {
        setTabName(e.target.id);
    }

    useEffect(() => {
        if(tabName === "scheduleTab") {
            const schdGrid = gridInit("schdGrid", schdGridColumn, onClickSchdGrid);
            reloadGrid(schdGrid, "get", API_INFO+"api/book/getDrivingSchedule", null);
            setGrid({schdGrid: schdGrid, norcGrid: grid?.norcGrid, histGrid: grid?.histGrid});

        } else if(tabName === "historyTab") {
            const histGrid = gridInit("histGrid", histGridColumn, onClickHistGrid);
            reloadGrid(histGrid, "get", API_INFO+"api/book/getDrivingHistory", null);
            setGrid({schdGrid: grid?.schdGrid, norcGrid: grid?.norcGrid, histGrid: histGrid});
        }

        const norcGrid = gridInit("norcGrid", norcGridColumn, onClickNorcGrid);
        reloadGrid(norcGrid, "get", API_INFO+"api/book/getUnrecordedBooking", null, (data: any) => {
            if(data.length > 0 && !toast.isActive("notice")) {
                toast.info("주차위치 미작성 예약이 있습니다",{
                    toastId : "notice",
                    onClick : () => setTabName("noRecordedTab")
                })
            }
        });
        setGrid({schdGrid: grid?.schdGrid, norcGrid: norcGrid, histGrid: grid?.histGrid});
    }, [tabName]);

    return (
        <div className={"drivingManageCore"} id={pathNames.drivingManage.id}>
            <div className={"tab"}>
                <ul>
                    <li>
                        <div className={"driving-schedule" + (tabName === "scheduleTab" ? " click" : "")}
                             id={"scheduleTab"} onClick={onChangeTabName}>
                            <span id={"scheduleTab"}>전체<br/>운행일정</span>
                        </div>
                    </li>
                    <li>
                        <div className={"driving-noRecorded" + (tabName === "noRecordedTab" ? " click" : "")}
                            id={"noRecordedTab"} onClick={onChangeTabName}>
                            <span id={"noRecordedTab"}>주차위치<br/>미작성</span>
                        </div>
                    </li>
                    <li>
                        <div className={"driving-history" + (tabName === "historyTab" ? " click" : "")}
                             id={"historyTab"} onClick={onChangeTabName}>
                            <span id={"historyTab"}>전체<br/>운행기록</span>
                        </div>
                    </li>
                </ul>
            </div>
            {
                tabName === "scheduleTab"
                ?
                <div className={"driving-schedule"}>
                    <div className={"schdGrid"} id={"schdGrid"}/>

                </div>
                : tabName === "noRecordedTab" ?
                    <div className={"driving-noRecorded"}>
                        <div className={"norcGrid"} id={"norcGrid"}/>

                    </div>
                : tabName === "historyTab" ?
                    <div className={"driving-history"}>
                        <div className={"histGrid"} id={"histGrid"}/>
                    </div>
                : null
            }
            <ToastContainer position={"bottom-right"} limit={5} pauseOnFocusLoss={false}
                            autoClose={false} closeOnClick={false} draggable={false}
                            toastStyle={{alignItems: "center"}}/>
        </div>
    )
}