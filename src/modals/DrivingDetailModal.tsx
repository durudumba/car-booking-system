import Modal from "react-modal";
import {useEffect, useState} from "react";
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
        width: "400px",
        height: "350px",
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

export const DrivingDetailModal = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
    data: any,
    parentModalClose: () => void
}) => {
    const [modalData, setModalData] = useState({...props.data});
    const buttonElement = useEnterBtnClick();
    
    const onChangeData = (event: any) => {
        const {id, value} = event.target;
        modalData[id] = value;

        setModalData({...modalData});
    }
    const modalSave = () => {
        const startTime = new Date(modalData.STRT_DT).getTime();
        const now = new Date().getTime();

        if(startTime < now) {
            showAlert("시작일이 이미 지난 일정은 수정할 수 없습니다.")
            return ;
        }

        axiosCall("POST", API_INFO+"api/book/updateDrivingInfo", modalData, (_data: any) => {
            showAlert("수정되었습니다");
            modalClose();
        }, (e: any) => {
            errorHandler(e);
        });
    }
    
    const modalClose = () => {
        props.setIsModalOpen(false);
    }

    useEffect(() => {
        setModalData(props.data);
    }, [props.data]);
    return (
        <Modal
            isOpen={props.isModalOpen}
            style={customModalStyles}
            onRequestClose={modalClose}
            ariaHideApp={false}
            contentLabel="Pop up Message"
            shouldCloseOnOverlayClick={false}
        >
            <div className="modal-dialog popup_booking" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>운행일정 정보</h2>
                    </div>

                    <div className="popcontent content2">
                        <div className="paddingbox">
                            <table className="poptable">
                                <tbody>
                                <tr>
                                    <th>시작일</th>
                                    <td>
                                        {/*<label>{modalData.STRT_DT} {modalData.STRT_TM} </label>*/}
                                        <label>{modalData.STRT_DT}</label>
                                    </td>
                                    <th>종료일</th>
                                    <td>
                                        {/*<label>{modalData.END_DT} {modalData.END_TM} </label>*/}
                                        <label>{modalData.END_DT}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <th>차량번호</th>
                                    <td>
                                        <label>{modalData.CAR_NUM}</label>
                                    </td>
                                    <th>차량정보</th>
                                    <td>
                                        <label>{modalData.CAR_MODL} / {modalData.FUEL_TYPE}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <th>운전자</th>
                                    <td>
                                        <input type={"text"} id={"CAR_DRVR"} value={modalData.CAR_DRVR}
                                               placeholder={"필수 입력항목"} onChange={onChangeData}/>
                                    </td>
                                    <th>동승자</th>
                                    <td>
                                        <input type={"text"} id={"CAR_PSGR"}
                                               value={modalData.CAR_PSGR ?? ''} onChange={onChangeData}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>목적지</th>
                                    <td>
                                        <input type={"text"} id={"DEST"} value={modalData.DEST}
                                               placeholder={"필수 입력항목"} onChange={onChangeData}/>
                                    </td>
                                    <th>사용목적</th>
                                    <td>
                                        <input type={"text"} id={"USE_PRPS"}
                                               value={modalData.USE_PRPS ?? ''} onChange={onChangeData}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>신청자</th>
                                    <td>
                                        <label>{modalData.SBMT_NAME}</label>
                                    </td>
                                    <th>비고</th>
                                    <td>
                                        <input type={"text"} id={"RMRK"}
                                               value={modalData.RMRK ?? ''} onChange={onChangeData}/>
                                    </td>
                                </tr>
                                </tbody>

                            </table>
                        </div>
                        <div className="buttonset">
                            <button className={"modal-save"} onClick={modalSave} ref={props.isModalOpen? buttonElement: null}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>닫기</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
