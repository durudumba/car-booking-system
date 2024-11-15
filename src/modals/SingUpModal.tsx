import Modal from "react-modal";
import React, {useEffect, useState} from "react";
import {axiosCall} from "../utils/common.ts";
import {API_INFO} from "../configs.ts";

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        zIndex: "10",
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

const SetSignUpParam = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void,
}) => {
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

    const modalSave = () => {
        const checkSignUpForm =
            String(signUpParam.userId) && String(signUpParam.userName) && String(signUpParam.userPw) && String(signUpParam.userPwDoubleCheck);

        if(!checkSignUpForm) {
            alert("필수 작성항목을 작성해주세요");
            return ;
        }

        if(signUpParam.userPw !== signUpParam.userPwDoubleCheck) {
            alert("비밀번호를 동일하게 입력해주세요.");
            return ;
        }

        axiosCall("POST", API_INFO+"api/users/sign-up", signUpParam, (_data: any) => {
            console.log(_data);
            alert("회원가입 성공!");
        }, (_e: any) => {
            console.log(_e);
            alert("회원가입 실패!");
        });
        // setSignUpParam({userId: '', userPw: '', userName: '', userPwDoubleCheck: ''});
        props.setIsModalOpen(false);
    }
    const modalClose = () => {
        // setSignUpParam({userId: '', userPw: '', userName: '', userPwDoubleCheck: ''});
        props.setIsModalOpen(false);
    }

    useEffect(() => {
        const onTabKeyDown = (event: KeyboardEvent) => {
            if(event.key !== 'Tab') return ;

            const focusElems: HTMLCollectionOf<Element> = document.getElementsByClassName('signUpInput');
            const curFocuesdElem: Element | null = document.querySelector(':focus');

            if(!curFocuesdElem) {
                (focusElems.item(0) as HTMLElement)?.focus();
            } else {
                for(let i=0; i<focusElems.length; i++) {
                    if(focusElems.item(i) === curFocuesdElem) {
                        (focusElems.item((i+1)%focusElems.length) as HTMLElement)?.focus();
                    }
                }
            }
        }

        document.addEventListener("keydown", onTabKeyDown);

        return () => {
            document.removeEventListener("keydown", onTabKeyDown);
        }
    }, [props.isModalOpen]);


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
                                               value={signUpParam.userId} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용자명</th>
                                    <td>
                                        <input type={"text"} id={"userName"} className={"signUpInput"}
                                               value={signUpParam.userName} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>비밀번호</th>
                                    <td>
                                        <input type={"password"} id={"userPw"} className={"signUpInput"}
                                               value={signUpParam.userPw} onChange={onChangeParam}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>비밀번호 재확인</th>
                                    <td>
                                        <input type={"password"} id={"userPwDoubleCheck"} className={"signUpInput"}
                                               value={signUpParam.userPwDoubleCheck} onChange={onChangeParam}/>
                                    </td>
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

export const SignUpModal = React.memo(SetSignUpParam);