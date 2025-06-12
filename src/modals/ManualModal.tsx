import Modal from "react-modal";
import {useEffect, useState} from "react";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "998",
        top: "0",
        left: "0",
    },
    content: {
        width: "420px",
        height: "480px",
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

export const ManualModal = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
}) => {

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
        >
            <div className="modal-dialog popup_manual" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>사용안내</h2>
                    </div>

                    <div className="popcontent content2">
                        <div className={"popcontenttext"}>
                            <div className={"tab"}>
                                <ul>
                                    <li>
                                        <div><span>주의사항</span></div>
                                    </li>
                                    <li>
                                        <div><span>차량예약</span></div>
                                    </li>
                                    <li>
                                        <div><span>운행기록</span></div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"poptextcontent"}>

                            </div>
                        </div>
                        <div className="buttonset">
                            <button className={"modal-cancel"} onClick={modalClose}>닫기</button>
                        </div>
                        {/*<div className="paddingbox">*/}
                        {/*    <table className="poptable">*/}
                        {/*        <tbody>*/}
                        {/*        <tr>*/}
                        {/*            <td>1.시작일과 종료일을 지정합니다.</td>*/}
                        {/*        </tr>*/}
                        {/*        <tr>*/}
                        {/*            <td>2.선택가능한 차량 목록에서 사용할 차량 하나를 선택합니다.</td></tr>*/}
                        {/*            <tr><td>3.양식에 맞춰</td></tr>*/}
                        {/*            <tr><td>1. 시작일과 종료일을 지정합니다.</td></tr>*/}
                        {/*        </tbody>*/}

                        {/*    </table>*/}
                        {/*</div>*/}

                    </div>
                </div>
            </div>
        </Modal>
    )
}
