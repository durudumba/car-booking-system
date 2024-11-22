import {useEffect, useState} from "react";
import {gridIndexSig, gridInit, reloadGrid} from "../utils/commTuiGrid.ts";
import {API_INFO} from "../configs.ts";
import {CarInfoModal} from "../modals/CarInfoModal.tsx";
import {axiosCall, pathNames} from "../utils/common.ts";
import {errorHandler} from "../utils/errorHandler.ts";

const carInfoColumns = [
    { header : '차량번호', name : 'CAR_NUM', sortable: true, resizeable: true, width: 150, align: 'center'},
    { header : '차량모델', name : 'CAR_MODL', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '연료타입', name : 'FUEL_TYPE', sortable: true, resizeable: true, width: 80, align: 'center'},
    { header : '차량상태', name : 'CAR_STTS', sortable: true, resizeable: true, align: 'center'},
    { header : '주차위치', name : 'PARK_LOC', sortable: true, resizeable: true, align: 'center'},
]

export interface CarInfoParamType {
    carNumber: string,
    newCarNumber: string,
    carModel: string,
    fuelType: string,
    fuelTypeCd: string,
    carStatus: string,
    carStatusCd: string,
    parkingLocation: string,
    rmrk: string | null,
}

const initCarInfoParam: CarInfoParamType = {
    carNumber: "",
    newCarNumber: "",
    carModel: "",
    fuelType: "",
    fuelTypeCd: "FTC0",
    carStatus: "",
    carStatusCd: "CST0",
    parkingLocation: "",
    rmrk: null,
}
export const CarManage = () => {
    const [carInfoParam, setCarInfoParam] = useState<CarInfoParamType>({...initCarInfoParam});
    const [selectedCarInfo, setSelectedCarInfo] = useState<CarInfoParamType>({...initCarInfoParam});

    const [carGrid, setCarGrid] = useState<gridIndexSig>();
    const [carInfoModalOpen, setCarInfoModalOpen] = useState(false);
    const [modalUseType, setModalUseType] = useState("add");

    const gridClick = (rowData: any) => {
        setSelectedCarInfo({
            ...selectedCarInfo,
            carNumber: rowData.CAR_NUM,
            newCarNumber: rowData.CAR_NUM,
            carModel: rowData.CAR_MODL,
            fuelType: rowData.FUEL_TYPE,
            fuelTypeCd: rowData.FUEL_TYPE_CD,
            carStatus: rowData.CAR_STTS,
            carStatusCd: rowData.CAR_STTS_CD,
            parkingLocation: rowData.PARK_LOC,
        });
    }

    const onClickBtn = (e: any) => {
        const id: string = e.target.id;

        if(id === "add") {
            setModalUseType("add");
            setCarInfoParam(initCarInfoParam);
            setCarInfoModalOpen(true);
        } else if(id === "mod") {
            setModalUseType("mod");
            setCarInfoParam(selectedCarInfo);
            setCarInfoModalOpen(true);
        } else if(id === "del") {
            if(carGrid!["_srk"] === -1 || selectedCarInfo.carNumber === '') {
                alert("삭제할 차량을 선택하세요");
                return ;
            }
            if(window.confirm("해당 차량이 삭제됩니다")) {
                axiosCall("post", API_INFO + "api/car/deleteCarInfo", selectedCarInfo, (_data: any) => {
                    alert("삭제 완료");
                    reloadCarGrid();
                }, (e: any) => {
                    errorHandler(e);
                });
            }
        }
    }

    const reloadCarGrid = () => {
        carGrid && reloadGrid(carGrid, "GET", API_INFO + "api/car/getCarsInfo", null);
        setCarGrid(carGrid);
    }

    useEffect(() => {
        const grid = gridInit("carGrid", carInfoColumns, gridClick);

        grid && reloadGrid(grid, "GET", API_INFO + "api/car/getCarsInfo", null);
        setCarGrid(grid);
    }, []);


    return (
        <div className={"carManageCore"} id={pathNames.carManage.id}>
            <CarInfoModal isModalOpen={carInfoModalOpen} setIsModalOpen={setCarInfoModalOpen}
                    data={carInfoParam} setData={setCarInfoParam} reloadGridFunc={reloadCarGrid}
                    useType={modalUseType}/>
            <div className={"car-manage buttonset"}>
                <button className={"addBtn"} id={"add"} onClick={onClickBtn}>추가</button>
                <button className={"modBtn"} id={"mod"} onClick={onClickBtn}>수정</button>
                <button className={"delBtn"} id={"del"} onClick={onClickBtn}>삭제</button>
            </div>
            <div className={"car-manage carGrid"} id={"carGrid"}/>
        </div>
    )
}