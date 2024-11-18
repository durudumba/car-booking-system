import {useEffect, useState} from "react";
import {gridIndexSig, gridInit, reloadGrid} from "../utils/commTuiGrid.ts";
import {API_INFO} from "../configs.ts";
import {DrivingRecordModal} from "../modals/DrivingRecordModal.tsx";

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
    { header : '최근 사용자', name: 'RCNT_USER', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '시작일', name : 'STRT_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '종료일', name : 'END_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
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
    const [drivRcrdModalOpen, setDrivRcrdModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState({});

    const onClickSchdGrid = (rowData: any) => {
        setSelectedRowData(rowData);
        setDrivRcrdModalOpen(true);
    }
    const onClickHistGrid = (e: any) => {
    }

    const reloadSchdGrid = () => {
        reloadGrid(grid?.schdGrid, "get", API_INFO+"api/book/getDrivingSchedule", {userId: localStorage.getItem("id")}, () => {
            noticeOnGrid(grid?.schdGrid);
        });
    }
    const reloadHistGrid = () => {
        reloadGrid(grid?.histGrid, "get", API_INFO+"api/book/getDrivingHistory", {userId: localStorage.getItem("id")});
    }

    const noticeOnGrid = (targetGrid: gridIndexSig | undefined) => {
        const timer = setTimeout(() => {
            if(!targetGrid) {
                return ;
            }

            const gridData: any[] = targetGrid?.getData();

            gridData.map((row: any, index: number) => {
                if(row.RQIR_INPT_PARK_LOC === 'Y') {
                    const elems: NodeListOf<HTMLElement> = document.querySelectorAll('.schdGrid td[data-row-key="' + index + '"]');

                    elems.forEach((elem: HTMLElement) => {
                        elem.setAttribute("class", elem.getAttribute("class") + " tui-grid-cell-notice");
                    })
                }
            })
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }

    useEffect(() => {
        const param = {
            userId: localStorage.getItem("id")
        }

        const schdGrid = gridInit("schdGrid", schdGridColumn, onClickSchdGrid);
        const histGrid = gridInit("histGrid", histGridColumn, onClickHistGrid);

        reloadGrid(schdGrid, "get", API_INFO+"api/book/getDrivingSchedule", param, () => {
            noticeOnGrid(schdGrid);
        });
        reloadGrid(histGrid, "get", API_INFO+"api/book/getDrivingHistory", param);

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

            <DrivingRecordModal isModalOpen={drivRcrdModalOpen} setIsModalOpen={setDrivRcrdModalOpen}
                data={selectedRowData} setData={setSelectedRowData}
                reloadFunc={()=>{reloadSchdGrid(); reloadHistGrid()}}/>
        </div>
    )
}