import {useEffect, useState} from "react";
import {gridIndexSig, gridInit, reloadGrid} from "../utils/commTuiGrid.ts";
import {API_INFO} from "../configs.ts";
import {DrivingRecordModal} from "../modals/DrivingRecordModal.tsx";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {pathNames} from "../utils/common.ts";

const schdGridColumn = [
    { header : '예약번호', name : 'BOOK_ID', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '연료타입', name : 'FUEL_TYPE', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '운전자', name : 'CAR_DRVR', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '주차위치', name : 'PARK_LOC', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '최근 사용자', name: 'RCNT_USER', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '시작일', name : 'STRT_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
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
        const timer = setTimeout(() => {
            if(!targetGrid) {
                return ;
            }
            const gridData: any[] = targetGrid?.getData();

            gridData.map((row: any) => {
                if(row.RQIR_INPT_PARK_LOC === 'Y') {
                    // ALERT
                    if(!toast.isActive(row.BOOK_ID)) {
                        toast.warn(`예약번호 ${row.BOOK_ID} 번 주차위치 작성필요`, {
                            toastId : row.BOOK_ID,
                            onClick : () => onClickSchdGrid(row)})
                    }
                }
            })
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }

    const modalReloadFunction = (bookId: number = 0) => {
        reloadSchdGrid();
        reloadHistGrid();
        toast.done(bookId);
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

        const schdGrid = gridInit("schdGrid", schdGridColumn, onClickSchdGrid);
        const histGrid = gridInit("histGrid", histGridColumn, onClickHistGrid);

        reloadGrid(schdGrid, "get", API_INFO+"api/book/getDrivingSchedule", param, () => {
            noticeExpiredBooking(schdGrid);
        });
        reloadGrid(histGrid, "get", API_INFO+"api/book/getDrivingHistory", param);

        setGrid({schdGrid: schdGrid, histGrid: histGrid})
    }, []);

    return(
        <div className={"drivingInfoCore"} id={pathNames.drivingInfo.id}>
            <div className={"driving-schedule"}>
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
                    ? <>
                        <div className={"schdGrid"} id={"schdGrid"}/>
                        <ToastContainer position={"bottom-right"} limit={5} pauseOnFocusLoss={false}
                                        autoClose={false} closeOnClick={false} draggable={false}
                                        toastStyle={{alignItems: "center"}}/>
                    </>
                    :
                        <div className={"driving-history"}>
                            <div className={"histGrid"} id={"histGrid"}/>
                        </div>

                }

            </div>


            <DrivingRecordModal isModalOpen={drivRcrdModalOpen} setIsModalOpen={setDrivRcrdModalOpen}
                data={selectedRowData} setData={setSelectedRowData}
                reloadFunc={modalReloadFunction}/>
        </div>
    )
}