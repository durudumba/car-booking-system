import Modal from "react-modal";
import React from "react";

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
        height: "500px",
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

type ParentProps = {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void
}

const setBooking = (props: ParentProps) => {

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
            <div className="modal-dialog popup_booking" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>모달 제목</h2>
                        {/*TODO: X표 이미지 추가하거나 삭제*/}
                        {/*<button type="button" className="close" data-dismiss="modal"*/}
                        {/*    onClick={modalClose}>닫기*/}
                        {/*</button>*/}
                    </div>

                    <div className="popcontent content2">
                        <div className="paddingbox">
                            <table className="poptable">
                                <tbody>
                                <tr>
                                    <th>컨텐츠 1</th>
                                    <td>
                                        <input type={"text"}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>컨텐츠 2</th>
                                    <td>
                                        <input type={"text"}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>컨텐츠 3</th>
                                    <td>
                                        <input type={"text"}/>
                                    </td>
                                </tr>
                                </tbody>

                            </table>
                        </div>
                        <div className="buttonset">
                            <button className={"modal-save"}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export const BookingModal = React.memo(setBooking);