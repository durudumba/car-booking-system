import Modal from "react-modal";
import {useState} from "react";
import {axiosCall} from "../utils/common.ts";
import {API_INFO} from "../configs.ts";
import {errorHandler} from "../utils/errorHandler.ts";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "149",
        top: "0",
        left: "0",
    },
    content: {
        width: "400px",
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
    reloadFunc: () => void
}) => {
    const [drive, setDrive] = useState(false);
    const [parkingLocation, setParkingLocation] = useState('');

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
            ...props.data,
            DRIV_YN: drive? 'Y': 'N',
            PARK_LOC: drive? parkingLocation: props.data.PARK_LOC,
            USER_ID: localStorage.getItem("id")
        };

        axiosCall("POST", API_INFO+"api/book/postDrivingRecord", param, (_data: any) => {
            alert("저장 완료!");
            props.reloadFunc();
            props.setData({});
            props.setIsModalOpen(false);
        }, (e: any) => {
            errorHandler(e);
        })
    }

    const modalClose = () => {
        props.setIsModalOpen(false);
    }

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
                        <h2>모달 제목</h2>
                    </div>

                    <div className={"popcontent content2"}>
                        <div className={"paddingbox"}>
                            <table className={"poptable"}>
                                <tbody>
                                <tr>
                                    <th>운행여부</th>
                                    <td>
                                        <label>
                                            미운행
                                            <input type={"checkbox"} className={"driveCheckbox"} checked={!drive}
                                                onChange={onChangeDrive}/>
                                        </label>
                                        <label>
                                            운행
                                            <input type={"checkbox"} className={"driveCheckbox"} checked={drive}
                                                onChange={onChangeDrive}/>
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
                            <button className={"modal_save"} onClick={modalSave}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}