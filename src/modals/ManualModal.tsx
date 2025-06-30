import Modal from "react-modal";
import {useState} from "react";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "998",
        top: "0",
        left: "0",
    },
    content: {
        width: "440px",
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
    const [tabName, setTabName] = useState("carbooktab");

    const modalClose = () => {
        props.setIsModalOpen(false);
        // setTabName("carbooktab");
    }

    const onClickTab = (e: any) => setTabName(e.target.id);

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
                                        <div className={"carbook-tab" + (tabName==="carbooktab"?" click":"")} onClick={onClickTab}
                                        id={"carbooktab"}><span id={"carbooktab"}>차량예약</span></div>
                                    </li>
                                    <li>
                                        <div className={"drivingrecord-tab" + (tabName==="drivingrecordtab"?" click":"")} onClick={onClickTab}
                                        id={"drivingrecordtab"}><span id={"drivingrecordtab"}>운행기록</span></div>
                                    </li>
                                </ul>
                            </div>
                            <div className={"poptextcontent"}>
                                <div className={"carbook-content"} hidden={tabName != "carbooktab"}>
                                    <h3>예약방법</h3>
                                    <div>
                                        <label>①</label><p>차량예약 메뉴에서 시작일과 종료일을 지정합니다.</p>
                                    </div>
                                    <div>
                                        <label>②</label><p>선택가능한 차량 목록에서 사용할 차량을 선택합니다.</p>
                                    </div>
                                    <div>
                                        <label>③</label><p>예약 정보를 작성하고 저장하면 차량예약이 완료됩니다.</p>
                                    </div>

                                    <h3>예약확인</h3>
                                    <div>
                                        <label>①</label><p>운행정보 메뉴에서 운행일정 탭으로 이동합니다.</p>
                                    </div>
                                    <div>
                                        <label>②</label><p>예약한 차량 일정이 목록에 있는지 확인합니다.</p>
                                    </div>
                                    <div>
                                        <label>③</label><p>예약한 일정 정보, 현 주차위치 등 운행 정보를 확인합니다.</p>
                                    </div>

                                    <h3>주의사항</h3>
                                    <div>
                                        <label>ⓐ</label><p>선택한 일정에 사용 불가능한 차량은 표시되지 않습니다.</p>
                                    </div>
                                    <div>
                                        <label>ⓑ</label>
                                        <p>차량의 현 주차위치는 마지막으로 등록된 주차위치 현황으로 예약 시작 전 날까지 변경될 수 있습니다.
                                        <p style={{fontWeight:"bold", color:"red"}}>예약 사용일 당일 주차위치 재확인이 필요합니다.</p>
                                        </p>
                                    </div>
                                    <div>
                                        <label>ⓒ</label>
                                        <p>이전 사용자가 주차위치를 등록하지 않은 경우, 해당 일정이 파란색으로 표시되며
                                            이전 사용자 정보를 확인할 수 있는 알림이 표시됩니다.</p>
                                    </div>
                                </div>
                                <div className={"drivingrecord-content"} hidden={tabName != "drivingrecordtab"}>
                                    <h3>운행완료 후</h3>
                                    <div>
                                        <label>①</label><p>운행정보 메뉴에서 운행일정 탭으로 이동합니다.</p>
                                    </div>
                                    <div>
                                        <label>②</label><p>완료한 운행일정을 선택합니다.</p>
                                    </div>
                                    <div>
                                        <label>③</label>
                                        <p>운행여부를 선택한 후 주차위치를 작성합니다. 미운행/취소의 경우 주차위치를 작성하지 않아도 작성가능 합니다.</p>
                                    </div>

                                    <h3>주의사항</h3>
                                    <div>
                                        <label>ⓐ</label>
                                        <p style={{fontWeight:"bold", color:"red"}}>차량예약 후 종료일 23시 59분 이전에 운행기록을 작성!!
                                        <br/>미작성 시 해당 차량이 예약불가 상태로 변경됩니다.</p>
                                    </div>
                                    <div>
                                        <label>ⓑ</label>
                                        <p>운행정보 메뉴 운행일정에 노란색으로 표시된 예약은 반드시 운행기록을 작성해야하는 예약입니다.</p>
                                    </div>
                                    <div>
                                        <label>ⓒ</label>
                                        <p>관리자가 직접 운행기록을 처리한 경우 운행정보 메뉴 운행기록 탭 비고란에 표시됩니다.</p>
                                    </div>
                                </div>
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
