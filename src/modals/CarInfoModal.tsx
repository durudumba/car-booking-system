import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {CarInfoParamType} from "../components/CarManage.tsx";
import {axiosCall, showAlert} from "../utils/common.ts";
import {API_INFO} from "../utils/configs.ts";
import {errorHandler} from "../utils/errorHandler.ts";
import useEnterBtnClick from "../utils/useEnterBtnClick.tsx";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "998",
        top: "0",
        left: "0",
    },
    content: {
        width: "360px",
        height: "360px",
        zIndex: "999",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "10px",
        boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
        justifyContent: "center",
        overflow: "auto",
        padding: "0px",
        border: ""
    },
};

const SetCarParam = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
    data: CarInfoParamType,
    setData: React.Dispatch<React.SetStateAction<CarInfoParamType>>,
    reloadGridFunc: () => void,
    useType: string,
}) => {
    const [modCarNumber, setModCarNumber] = useState(false);
    const [commCdList, setCommCdList] = useState<{fuelTypeList: object[], carStatusList: object[]}>();
    const [modalData, setModalData] = useState({...props.data});
    const [isActive, setIsActive] = useState(false);
    const buttonElement = useEnterBtnClick();

    const onChangeParam = (event: any) => {
        const {id, value} = event.target;

        setModalData({...modalData, [id as keyof CarInfoParamType]: value})
    }

    const modalSave = () => {
        const checkAppForm =
            String(modalData.carNumber) && String(modalData.carModel) && (!modCarNumber || String(modalData.newCarNumber));

        if(!checkAppForm) {
            showAlert("필수 작성항목을 작성해주세요");
            return ;
        }
        const carNumReg = /\d{2,3}[가-힣]{1} \d{4}/gm
        if(!carNumReg.test(modalData.carNumber)) {
            showAlert("차량번호 형식이 다릅니다<br/>00가 0000 형식으로 작성하세요");
            return false
        }

        if(props.useType === "add") {
            axiosCall("post", API_INFO + "api/car/insertCarInfo", modalData, (_data: any) => {
                showAlert("저장완료");
                props.setData(modalData);
                props.reloadGridFunc();
                modalClose();
            }, (e: any) => {
                errorHandler(e);
            })
        } else if( props.useType === "mod") {
            axiosCall("post", API_INFO + "api/car/updateCarInfo", {
                ...modalData,
                modCarNumber: modCarNumber,
                adminId: localStorage.getItem("id"),
            }, (_data: any) => {
                showAlert("저장완료");
                props.setData(modalData);
                props.reloadGridFunc();
                modalClose();
            }, (e: any) => {
                errorHandler(e)
            })
        }
    }
    const modalClose = () => {
        setModCarNumber(false);
        setIsActive(false);
        props.setIsModalOpen(false);
    }

    useEffect(() => {
        axiosCall("get", API_INFO + "api/comm/getCommCodeList", null, (data: any) => {
            setCommCdList({
                fuelTypeList: data.fuelTypeList,
                carStatusList: data.carStatusList
            })
        });
    }, []);

    useEffect(() => {
        setModalData(props.data);
    }, [props.data])

    return (
        <Modal
            isOpen={props.isModalOpen}
            style={customModalStyles}
            onRequestClose={modalClose}
            ariaHideApp={false}
            contentLabel={"Pop up Message"}
            shouldCloseOnOverlayClick={false}>

            <div className={"modal-dialog popup_carInfo"} role={"document"}>
                <div className={"modal-content"}>
                    <div className={"modal-header"}>
                        <h2>차량 정보</h2>
                    </div>

                    <div className={"popcontent content2"}>
                        <div className={"paddingbox"}>
                            <table className={"poptable"}>
                                <tbody>
                                <tr>
                                    <th>차량번호</th>
                                    <td>
                                        {
                                            props.useType === "add"
                                                ? <input type={"text"} id={"carNumber"} value={modalData.carNumber}
                                                        onChange={onChangeParam} placeholder={"필수 입력항목"}/>
                                                : modCarNumber
                                                    ? <input type={"text"} id={"newCarNumber"}
                                                             value={modalData.newCarNumber} onChange={onChangeParam}
                                                            placeholder={"필수 입력항목"}/>

                                                    : <input type={"text"} id={"carNumber"} disabled={true}
                                                             value={modalData.carNumber}/>
                                        }
                                        <button className={"modifyCarNumber" + (isActive? " active": "")}
                                                onClick={() => {setModCarNumber(!modCarNumber); setIsActive(!isActive);}}
                                                hidden={props.useType==="add"}>수정</button>
                                    </td>
                                </tr>
                                <tr>
                                    <th>차량모델</th>
                                    <td>
                                        <input type={"text"} id={"carModel"} value={modalData.carModel}
                                               onChange={onChangeParam} placeholder={"필수 입력항목"}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>연료타입</th>
                                    <td>
                                        <select id={"fuelTypeCd"} value={modalData.fuelTypeCd ?? 'FTC0'} onChange={onChangeParam}>
                                            {
                                                commCdList &&
                                                commCdList.fuelTypeList.map((v: any) => (
                                                    <option key={v.COMM_CD} value={v.COMM_CD}>{v.COMM_CD_NAME}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>차량상태</th>
                                    <td>
                                        <select id={"carStatusCd"} value={modalData.carStatusCd ?? 'CST0'} onChange={onChangeParam}>
                                            {
                                                commCdList &&
                                                commCdList.carStatusList.map((v: any) => (
                                                    <option key={v.COMM_CD} value={v.COMM_CD}>{v.COMM_CD_NAME}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>주차위치</th>
                                    <td>
                                        <input id={"parkingLocation"} value={modalData.parkingLocation}
                                               onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>비고</th>
                                    <td>
                                        <input id={"rmrk"} value={modalData.rmrk?? ""} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className={"buttonset"}>
                            <button className={"modal_save"} onClick={modalSave} ref={props.isModalOpen? buttonElement: null}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export const CarInfoModal = React.memo(SetCarParam);