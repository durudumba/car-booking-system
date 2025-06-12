import {useEffect, useState} from "react";
import {gridIndexSig, gridInit, reloadGrid} from "../utils/commTuiGrid.ts";
import {API_INFO} from "../utils/configs.ts";
import {DrivingRecordModal} from "../modals/DrivingRecordModal.tsx";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {axiosCall, emptyCellFormatter, pathNames} from "../utils/common.ts";
import {errorHandler} from "../utils/errorHandler.ts";

const schdGridColumn = [
    { header : '예약번호', name : 'BOOK_ID', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '시작일', name : 'STRT_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '현 주차위치', name : 'PARK_LOC', sortable: true, resizeable: true, width: 100, align: 'center', formatter: emptyCellFormatter},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '연료타입', name : 'FUEL_TYPE', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운전자', name : 'CAR_DRVR', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '최근 사용자', name: 'RCNT_USER', sortable: true, resizeable: true, width: 120, align: 'center', formatter: emptyCellFormatter},
]

const histGridColumn = [
    { header : '예약번호', name : 'BOOK_ID', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운행여부', name : 'DRIV_YN', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운전자', name : 'CAR_DRVR', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '시작일', name : 'STRT_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '작성한 주차위치', name : 'INPT_PARK_LOC', sortable: true, width: 150, resizeable: true, align: 'center', formatter: emptyCellFormatter},
    { header : '비고', name : 'RMRK', sortable: true, resizeable: true, width: 150, align: 'center', formatter: emptyCellFormatter}
]

export const DrivingInfo = () => {
    const [grid, setGrid] = useState<{
        schdGrid: gridIndexSig | undefined,
        histGrid: gridIndexSig | undefined}>();
    const [drivRcrdModalOpen, setDrivRcrdModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState({});
    const [tabName, setTabName] = useState("scheduleTab");

    const onClickSchdGrid = (rowData: any) => {
        setSelectedRowData(rowData);
        setDrivRcrdModalOpen(true);
    }
    const onClickHistGrid = () => {
    }

    const reloadSchdGrid = () => {
        reloadGrid(grid?.schdGrid, "get", API_INFO+"api/book/getDrivingSchedule", {userId: localStorage.getItem("id")}, () => {
            noticeExpiredBooking(grid?.schdGrid);
        });
    }
    const reloadHistGrid = () => {
        reloadGrid(grid?.histGrid, "get", API_INFO+"api/book/getDrivingHistory", {userId: localStorage.getItem("id")});
    }

    const noticeExpiredBooking = (targetGrid: gridIndexSig | undefined) => {
        if(!targetGrid) {
            return ;
        }

        const gridData: any[] = targetGrid?.getData();
        const tommorow = new Date().getTime() + (60 * 60 * 24 * 1000);

        gridData.map((row: any) => {
            // 주차위치 작성알림
            if(row.RQIR_INPT_PARK_LOC === 'Y') {
                targetGrid?.addRowClassName(row?.rowKey, "tui-grid-row-err")
                if(!toast.isActive(row.BOOK_ID)) {
                    toast.warn(
                        `[ 예약번호 ${row.BOOK_ID} ]\n주차위치 작성필요`, {
                        toastId : row.BOOK_ID,
                        onClick : () => onClickSchdGrid(row)
                        }
                    )
                }
            }

            // 주차위치 미등록차량 알림
            if(tommorow >= new Date(row.STRT_DT).getTime()) {

                axiosCall("GET", API_INFO+"api/book/getUnrecordedBooking", {
                    carNumber: row.CAR_NUM
                }, (data: any) => {
                    if(data.length > 0 && !toast.isActive(data.BOOK_ID)) {
                        targetGrid?.addRowClassName(row?.rowKey, "tui-grid-row-warn");
                        const prevBookInfo = data[data.length-1];
                        toast.info(
                            `[ 예약번호 ${row.BOOK_ID} ]\n이전 사용자가 차량 사용 후 주차위치를 등록하지 않았습니다. 이곳을 클릭해 이전 예약정보를 확인하세요.`, {
                            toastId : row.BOOK_ID,
                            style : {whiteSpace: "pre-wrap", textAlign: "left"},
                            onClick : () => {
                                alert(`[이전 예약정보]\n예약번호 : ${prevBookInfo.BOOK_ID} 번\n운전자(예약자) : ${prevBookInfo.CAR_DRVR}(${prevBookInfo.SBMT_NAME})\n사용기간 : ${prevBookInfo.STRT_DT} ~ ${prevBookInfo.END_DT} \n목적지 : ${prevBookInfo.DEST}\n운행목적 : ${String(prevBookInfo.USE_PRPS)? prevBookInfo.USE_PRPS: '-'}`)
                                }
                            }
                        )
                    }
                }, (e: any) => {
                    errorHandler(e);
                })
            }
        })
    }

    const modalReloadFunction = (bookId: number | null) => {
        reloadSchdGrid();
        reloadHistGrid();
        bookId && toast.done(bookId);
    }

    const onChangeTabName = (e: any) => {
        const tabName = e.target.id;
        setTabName(tabName);
        if(tabName === "scheduleTab") {
            reloadSchdGrid();
        } else if(tabName === "historyTab") {
            reloadHistGrid();
        }
    }

    useEffect(() => {
        const param = {
            userId: localStorage.getItem("id")
        }

        if(tabName === "scheduleTab") {
            const schdGrid = gridInit("schdGrid", schdGridColumn, onClickSchdGrid);
            reloadGrid(schdGrid, "get", API_INFO+"api/book/getDrivingSchedule", param, () => {
                noticeExpiredBooking(schdGrid);
            });

            setGrid({schdGrid: schdGrid, histGrid: grid?.histGrid});
        } else if(tabName === "historyTab") {
            const histGrid = gridInit("histGrid", histGridColumn, onClickHistGrid);
            reloadGrid(histGrid, "get", API_INFO+"api/book/getDrivingHistory", param);
            setGrid({schdGrid: grid?.schdGrid, histGrid: histGrid});
        }
    }, [tabName]);

    return(
        <div className={"drivingInfoCore"} id={pathNames.drivingInfo.id}>
            <div className={"tab"}>
                <ul>
                    <li>
                        <div className={"driving-schedule" + (tabName==="scheduleTab"? " click": "")}
                             id={"scheduleTab"} onClick={onChangeTabName}>
                            <span id={"scheduleTab"}>운행일정</span>
                        </div>
                    </li>
                    <li>
                        <div className={"driving-history" + (tabName==="historyTab"? " click": "")}
                             id={"historyTab"} onClick={onChangeTabName}>
                            <span id={"historyTab"}>운행기록</span>
                        </div>
                    </li>
                </ul>
            </div>
            {
                tabName==="scheduleTab"
                ?
                <div className={"driving-schedule"}>
                    <div className={"schdGrid"} id={"schdGrid"}/>
                    <ToastContainer position={"bottom-right"} limit={5} pauseOnFocusLoss={false}
                                    autoClose={false} closeOnClick={false} draggable={false}
                                    toastStyle={{alignItems: "center"}}/>

                </div>
                : tabName === "historyTab" ?
                    <div className={"driving-history"}>
                        <div className={"histGrid"} id={"histGrid"}/>
                    </div>
                    : null
            }

            <DrivingRecordModal isModalOpen={drivRcrdModalOpen} setIsModalOpen={setDrivRcrdModalOpen}
                data={selectedRowData} setData={setSelectedRowData}
                reloadFunc={modalReloadFunction}/>
        </div>
    )
}