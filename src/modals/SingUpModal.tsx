import Modal from "react-modal";
import React, {useState} from "react";
import {axiosCall} from "../utils/common.ts";
import {API_INFO} from "../utils/configs.ts";
import {errorHandler} from "../utils/errorHandler.ts";
import useEnterBtnClick from "../utils/useEnterBtnClick.tsx";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "10",
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

const SetSignUpParam = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
}) => {
    const buttonElement = useEnterBtnClick();
    const [signUpParam, setSignUpParam] = useState({
        userId: '',
        userName: '',
        userPw: '',
        userPwDoubleCheck: '',
    })

    const onChangeParam = (event: any) => {
        const {id, value} = event.target;

        setSignUpParam({...signUpParam, [id as keyof object] : value});
    }

    const signUpValid = (signUpParam: any) => {
        const korean: RegExp = /^[ㄱ-ㅎ|가-힣]+$/;

        const result = korean.test(signUpParam.userName);

        if(!result) {
            alert("사용자명은 한글로만 등록가능합니다(실명사용 권장)");
            return false;
        } else if(signUpParam.userName.length < 2 || signUpParam.userName.length > 7) {
            alert("사용자명은 2~7자 이내로 등록가능합니다");
            return false;
        } else if(signUpParam.userId.length < 2 || signUpParam.userId.length > 15) {
            alert("사용자 ID는 2~15자 이내로 등록가능합니다")
            return false;
        } else if(signUpParam.userPw !== signUpParam.userPwDoubleCheck) {
            alert("비밀번호를 동일하게 입력해주세요.");
            return false;
        } else {
            return true;
        }
    }

    const modalSave = () => {
        const checkSignUpForm =
            String(signUpParam.userId) && String(signUpParam.userName) && String(signUpParam.userPw) && String(signUpParam.userPwDoubleCheck);

        if(!checkSignUpForm) {
            alert("필수 작성항목을 작성해주세요");
            return ;
        }

        if(!signUpValid(signUpParam)) {
            return ;
        }

        axiosCall("POST", API_INFO+"api/users/sign-up", signUpParam, (_data: any) => {
            alert("회원가입 완료");
            setSignUpParam({userId: '', userPw: '', userName: '', userPwDoubleCheck: ''});
            props.setIsModalOpen(false);
        }, (e: any) => {
            errorHandler(e);
        });
    }
    const modalClose = () => {
        // setSignUpParam({userId: '', userPw: '', userName: '', userPwDoubleCheck: ''});
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
            <div className="modal-dialog popup_signup" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>회원 가입</h2>
                    </div>

                    <div className="popcontent content2">
                        <div className="paddingbox">
                            <table className="poptable">
                                <tbody>
                                <tr>
                                    <th>아이디</th>
                                    <td>
                                        <input type={"text"} id={"userId"} className={"signUpInput"} autoFocus={true}
                                               placeholder={"필수 작성항목"}
                                               value={signUpParam.userId} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용자명</th>
                                    <td>
                                        <input type={"text"} id={"userName"} className={"signUpInput"}
                                               placeholder={"필수 작성항목"}
                                               value={signUpParam.userName} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용자 암호</th>
                                    <td>
                                        <input type={"password"} id={"userPw"} className={"signUpInput"}
                                               placeholder={"필수 작성항목"}
                                               value={signUpParam.userPw} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>암호 재입력</th>
                                    <td>
                                        <input type={"password"} id={"userPwDoubleCheck"} className={"signUpInput"}
                                               placeholder={"필수 작성항목"}
                                               value={signUpParam.userPwDoubleCheck} onChange={onChangeParam}/>
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

export const SignUpModal = React.memo(SetSignUpParam);