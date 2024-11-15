import Modal from "react-modal";
import React from "react";
import { BookingParamType } from '../components/CarBooking.tsx';
import {axiosCall} from "../utils/common.ts";
import {API_INFO} from "../configs.ts";
import {errorHandler} from "../utils/errorHandler.ts";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "998",
        top: "0",
        left: "0",
    },
    content: {
        width: "550px",
        height: "600px",
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
                                    <th>시작일</th>
                                    <td>
                                        <input type={"date"} id={"startDate"} readOnly={true}
                                               value={props.bookingParam.startDate}/>
                                        <select id={"startTimeCd"} disabled={true}
                                                value={props.bookingParam.startTimeCd}>
                                            <option value={'TDC0'}>종일</option>
                                            <option value={'TDC1'}>오전</option>
                                            <option value={'TDC2'}>오후</option>
                                        </select>
                                    </td>
                                    <th>종료일</th>
                                    <td>
                                    <input type={"date"} id={"endDate"} readOnly={true}
                                               value={props.bookingParam.endDate}/>
                                        <select id={"endTimeCd"} disabled={true}
                                                value={props.bookingParam.endTimeCd}>
                                            <option value={'TDC0'}>종일</option>
                                            <option value={'TDC1'}>오전</option>
                                            <option value={'TDC2'}>오후</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                <th>차량 번호</th>
                                    <td><input type={"text"} id={"carNumber"} readOnly={true}
                                               value={props.bookingParam.carNumber}/></td>
                                    <th>주차 위치</th>
                                    <td><input type={"text"} id={"parkingLocation"} readOnly={true}
                                               value={props.bookingParam.parkingLocation}/></td>
                                </tr>
                                <tr>
                                    <th>차종</th>
                                    <td><input type={"text"} id={"carModel"} readOnly={true}
                                               value={props.bookingParam.carModel}/></td>
                                    <th>연료타입</th>
                                    <td><input type={"text"} id={"fuelType"} readOnly={true}
                                               value={props.bookingParam.fuelType}/></td>
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
                                    <th>사용목적</th>
                                    <td>
                                        <input type={"text"} id={"usePropose"}
                                               value={props.bookingParam.usePropose ?? ''} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>신청자</th>
                                    <td><input type={"text"} id={"submitter"} readOnly={true}
                                               value={props.bookingParam.submitter}/></td>
                                </tr>
                                <tr>
                                    <th>비고</th>
                                    <td><input type={"text"} id={"rmrk"}
                                        value={props.bookingParam.rmrk ?? ''} onChange={onChangeParam}/></td>
                                </tr>
                                </tbody>

                            </table>
                        </div>
                        <div className="buttonset">
                            <button className={"modal-save"} onClick={modalSave}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export const BookingModal = React.memo(SetBookingParam);