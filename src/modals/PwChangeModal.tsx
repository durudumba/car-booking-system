import Modal from "react-modal";
import React, {useState} from "react";
import {axiosCall, showAlert} from "../utils/common.ts";
import {API_INFO} from "../utils/configs.ts";
import {errorHandler} from "../utils/errorHandler.ts";
import useEnterBtnClick from "../utils/useEnterBtnClick.tsx";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "15",
        top: "0",
        left: "0",
    },
    content: {
        width: "316px",
        height: "300px",
        zIndex: "150",
        position: "absolute",
        top: "30%",
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

interface pwChangeParamInterface  {
    userId: string,
    curPw: string,
    newPw: string,
    checkNewPw: string
}

const PwChange = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
}) => {
    const buttonElement = useEnterBtnClick();
    const [pwChangeParam, setPwChangeParam] = useState<pwChangeParamInterface>({
        userId: localStorage.getItem("id") ?? "",
        curPw: '',
        newPw: '',
        checkNewPw: '',
    })

    const onChangeParam = (event: any) => {
        const {id, value} = event.target;

        setPwChangeParam({...pwChangeParam, [id as keyof object] : value});
    }

    const pwChangeValid = (param: pwChangeParamInterface) => {
        const checkForm =
            String(param.curPw) && String(param.newPw) && String(param.checkNewPw);

        if(!checkForm) {
            showAlert("필수 작성항목을 작성해주세요.");
            return false;
        } else if(param.curPw === param.newPw) {
            showAlert("이전 비밀번호와 동일합니다.<br/>다른 비밀번호를 입력하세요.");
            return false;
        } else if(param.newPw !== param.checkNewPw) {
            showAlert("비밀번호를 동일하게 입력하세요.");
            return false;
        } else {
            return true;
        }
    }

    const modalSave = () => {
        if(!pwChangeValid(pwChangeParam)) return false;

        axiosCall("POST", API_INFO+"api/users/userPwChange", pwChangeParam, (_data: any) => {
            showAlert("비밀번호 변경 완료");
            setPwChangeParam({userId: pwChangeParam.userId, curPw: '', newPw: '', checkNewPw: ''});
            props.setIsModalOpen(false);
        }, (e: any) => {
            errorHandler(e);
        });
    }
    const modalClose = () => {
        setPwChangeParam({userId: pwChangeParam.userId, curPw: '', newPw: '', checkNewPw: ''});
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
            <div className="modal-dialog popup_pwchange" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>비밀번호 변경</h2>
                    </div>

                    <div className="popcontent content2">
                        <div className="paddingbox">
                            <table className="poptable">
                                <tbody>
                                <tr>
                                    <th>아이디</th>
                                    <td>
                                        <input type={"text"} id={"userId"} className={"pwChangeInput"} autoFocus={true}
                                               placeholder={"필수 작성항목"}
                                               value={pwChangeParam.userId} readOnly={true}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>현재 암호</th>
                                    <td>
                                        <input type={"password"} id={"curPw"} className={"pwChangeInput"}
                                               placeholder={"필수 작성항목"}
                                               value={pwChangeParam.curPw} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>신규 암호</th>
                                    <td>
                                        <input type={"password"} id={"newPw"} className={"pwChangeInput"}
                                               placeholder={"필수 작성항목"}
                                               value={pwChangeParam.newPw} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>신규 암호 재입력</th>
                                    <td>
                                        <input type={"password"} id={"checkNewPw"} className={"pwChangeInput"}
                                               placeholder={"필수 작성항목"}
                                               value={pwChangeParam.checkNewPw} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                </tbody>

                            </table>
                        </div>
                        <div className="buttonset">
                            <button className={"modal-save"} onClick={modalSave} ref={props.isModalOpen? buttonElement: null}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export const PwChangeModal = React.memo(PwChange);