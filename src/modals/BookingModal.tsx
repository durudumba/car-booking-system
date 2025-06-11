import Modal from "react-modal";
import React from "react";
import {axiosCall, BookingParamType, pathNames} from "../utils/common.ts";
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

const SetBookingParam = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
    bookingParam: BookingParamType,
    setBookingParam: React.Dispatch<React.SetStateAction<BookingParamType>>,
    initBookingParam: () => void
    reloadFunc: () => void
}) => {
    const buttomElement = useEnterBtnClick();
    const onChangeParam = (event: any) => {
        const {id, value} = event.target;

        props.setBookingParam({...props.bookingParam, [id as keyof BookingParamType] : value})
    }

    const modalSave = () => {
        const checkAppForm =
            String(props.bookingParam.driver) && String(props.bookingParam.destination);

        if(!checkAppForm) {
            alert("필수 작성항목을 작성해주세요");
            return ;
        }
        axiosCall("PUT", API_INFO+"api/book", props.bookingParam, (_data: any) => {
            alert("차량 사용 신청 완료!");
            props.initBookingParam();
            props.setIsModalOpen(false);
            props.reloadFunc();
            window.location.replace(pathNames.drivingInfo.url);
        }, (e: any) => {
            errorHandler(e);
        });
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
        >
            <div className="modal-dialog popup_booking" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>예약 정보</h2>
                    </div>

                    <div className="popcontent content2">
                        <div className="paddingbox">
                            <table className="poptable">
                                <tbody>
                                <tr>
                                    <th>시작일</th>
                                    <td>
                                        <label>{props.bookingParam.startDate}{/*{ props.bookingParam.startTimeCd==='TDC0' ? "종일" : props.bookingParam.startTimeCd==='TDC1' ? "오전" : "오후" }*/}</label>
                                    </td>
                                    <th>종료일</th>
                                    <td>
                                        <label>{props.bookingParam.endDate} {/*{props.bookingParam.endTimeCd === 'TDC0' ? "종일" : props.bookingParam.endTimeCd === 'TDC1' ? "오전": "오후"}*/}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <th>차량<br/>번호</th>
                                    <td>
                                        <label>{props.bookingParam.carNumber}</label>
                                    </td>
                                    <th>차량<br/>정보</th>
                                    <td>
                                        <label>{props.bookingParam.carModel} / {props.bookingParam.fuelType}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <th>운전자</th>
                                    <td>
                                        <input type={"text"} id={"driver"} value={props.bookingParam.driver}
                                               placeholder={"필수 입력항목"} onChange={onChangeParam}/>
                                    </td>
                                    <th>동승자</th>
                                    <td>
                                        <input type={"text"} id={"passengers"}
                                               value={props.bookingParam.passengers ?? ''} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>목적지</th>
                                    <td>
                                        <input type={"text"} id={"destination"} value={props.bookingParam.destination}
                                               placeholder={"필수 입력항목"} onChange={onChangeParam}/>
                                    </td>
                                    <th>사용<br/>목적</th>
                                    <td>
                                        <input type={"text"} id={"usePropose"}
                                               value={props.bookingParam.usePropose ?? ''} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>신청자</th>
                                    <td>
                                        <label>{props.bookingParam.submitter}</label>
                                    </td>
                                    <th>비고</th>
                                    <td>
                                        <input type={"text"} id={"rmrk"}
                                               value={props.bookingParam.rmrk ?? ''} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                </tbody>

                            </table>
                        </div>
                        <div className="buttonset">
                            <button className={"modal-save"} onClick={modalSave} ref={buttomElement}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export const BookingModal = React.memo(SetBookingParam);