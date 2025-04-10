import Modal from "react-modal";
import {useEffect, useState} from "react";
import {axiosCall} from "../utils/common.ts";
import {API_INFO} from "../utils/configs.ts";
import {errorHandler} from "../utils/errorHandler.ts";
import {DrivingDetailModal} from "./DrivingDetailModal.tsx";
import useEnterBtnClick from "../utils/useEnterBtnClick.tsx";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "149",
        top: "0",
        left: "0",
    },
    content: {
        width: "315px",
        height: "300px",
        zIndex: "150",
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

export const DrivingRecordModal = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
    data: any,
    setData: (data: any) => void,
    reloadFunc: (bookId: number | null) => void
}) => {
    const [drive, setDrive] = useState(true);
    const [modalData, setModalData] = useState({...props.data});
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [parkingLocation, setParkingLocation] = useState('');

    const buttonElement = useEnterBtnClick();

    const onChangeDrive = () => {
        setParkingLocation('');
        setDrive(!drive);
    }

    const modalSave = () => {
        if(drive && parkingLocation === '') {
            alert("주차위치를 입력하세요");
            return ;
        }

        const param = {
            ...modalData,
            DRIV_YN: drive? 'Y': 'N',
            PARK_LOC: drive? parkingLocation: modalData.PARK_LOC,
        };

        axiosCall("POST", API_INFO+"api/book/postDrivingRecord", param, (_data: any) => {
            alert("저장 완료!");
            setDrive(true);
            props.reloadFunc(modalData.BOOK_ID);
            props.setData({});
            props.setIsModalOpen(false);
        }, (e: any) => {
            errorHandler(e);
        })
    }

    const onClickDetailInfo = () => {
        setIsDetailModalOpen(true);
    }

    const modalClose = () => {
        props.reloadFunc(null);
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
            shouldFocusAfterRender={true}
        >
            <div className={"modal-dialog popup_drivingRecord"} role={"document"}>
                <div className={"modal-content"}>
                    <div className={"modal-header"}>
                        <h2>운행 일정 기록</h2>
                    </div>

                    <div className={"popcontent content2"}>
                        <div className={"paddingbox"}>
                            <table className={"poptable"}>
                                <tbody>
                                <tr>
                                    <th>예약번호</th>
                                    <td>
                                        <label>{modalData.BOOK_ID}</label>
                                        <button className={"detailInfo"} onClick={onClickDetailInfo}>상세정보</button>
                                    </td>
                                </tr>
                                <tr>
                                    <th>차량정보</th>
                                    <td>
                                        <label>{modalData.CAR_MODL} / {modalData.CAR_NUM}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용기간</th>
                                    <td>
                                        <label>{modalData.STRT_DT} {modalData.STRT_TM} ~
                                            {modalData.END_DT} {modalData.END_TM}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <th>운행여부</th>
                                    <td>
                                        <label>
                                            운행
                                            <input type={"checkbox"} className={"driveCheckbox"} checked={drive}
                                                   style={{marginLeft:5}} onChange={onChangeDrive}/>
                                        </label>
                                        <label style={{paddingLeft: 15}}>
                                            미운행/취소
                                            <input type={"checkbox"} className={"driveCheckbox"} checked={!drive}
                                                   style={{marginLeft:5}} onChange={onChangeDrive}/>
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <th>주차위치</th>
                                    <td>
                                        <input type={"text"} id={"parkingLocation"} value={parkingLocation}
                                               disabled={!drive}
                                               onChange={(e: any) => setParkingLocation(e.target.value)}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className={"buttonset"}>
                            <button className={"modal_save"} onClick={modalSave} ref={!isDetailModalOpen? buttonElement: null}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
            <DrivingDetailModal
                isModalOpen={isDetailModalOpen} setIsModalOpen={setIsDetailModalOpen}
                data={modalData} parentModalClose={modalClose}/>
        </Modal>
    )
}