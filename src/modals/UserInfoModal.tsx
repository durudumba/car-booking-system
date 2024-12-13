import Modal from "react-modal";
import {useEffect, useState} from "react";
import {axiosCall} from "../utils/common.ts";
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
        width: "280px",
        height: "265px",
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

export const UserInfoModal = (props: {
    isModalOpen: boolean,
    setIsModalOpen: (isModalOpen: boolean) => void
    data: any,
    setData: (data: any) => void,
    reloadFunc: () => void
}) => {
    const [userData, setUserData] = useState({...props.data});
    const buttonElement = useEnterBtnClick();

    const onChangeUserInfo = (event: any) => {
        const {id, value} = event.target;
        const cvrtValue = Number(value)? Number(value): value;

        setUserData({...userData, [id as keyof typeof userData]: cvrtValue});
    }
    const deleteUser = () => {
        if(window.confirm("사용자의 정보가 완전히 삭제됩니다")) {
            axiosCall("DELETE", API_INFO+"api/users/deleteUserInfo", userData, (_data: any) => {
                alert("사용자 정보 삭제 완료!");
                props.reloadFunc();
                props.setData({});
                props.setIsModalOpen(false);
            }, (e: any) => {
                errorHandler(e);
            })
        }
    }

    const modalSave = () => {
        axiosCall("POST", API_INFO+"api/users/updateUserInfo", userData, (_data: any) => {
            if(userData.denyUseYN === "Y" &&
                !window.confirm("사용제한된 사용자의 운행일정은 삭제됩니다")) {
                    return ;
            }

            alert("사용자 정보 수정 완료!");
            props.reloadFunc();
            props.setData({});
            props.setIsModalOpen(false);
        }, (e: any) => {
            errorHandler(e);
        });
    }
    const modalClose = () => {
        props.setIsModalOpen(false);
    }

    useEffect(() => {
        setUserData({...props.data})
    }, [props.data]);

    return (
        <Modal
            isOpen={props.isModalOpen}
            style={customModalStyles}
            onRequestClose={modalClose}
            ariaHideApp={false}
            contentLabel={"Pop up Message"}
            shouldCloseOnOverlayClick={false}>
            <div className={"modal-dialog popup_userInfo"} role={"document"}>
                <div className={"modal-content"}>
                    <div className={"modal-header"}>
                        <h2>사용자 정보</h2>
                    </div>

                    <div className={"popcontent content2"}>
                        <div className={"paddingbox"}>
                            <table className={"poptable"}>
                                <tbody>
                                <tr>
                                    <th>사용자 ID</th>
                                    <td>
                                        <input type={"text"} id={"userId"} value={userData.userId ?? ''}
                                               readOnly={true}/>
                                        <button className={"deleteUser"} onClick={deleteUser}>삭제</button>
                                    </td>
                                </tr>
                                <tr>
                                <th>사용자명</th>
                                    <td>
                                        <input type={"text"} id={"userName"} value={userData.userName ?? ''}
                                               readOnly={true}/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용자등급</th>
                                    <td>
                                        <select id={"userRank"} value={userData.userRank ?? 1}
                                                onChange={onChangeUserInfo}>
                                            <option key={0} value={0}>관리자</option>
                                            <option key={1} value={1}>사용자</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용제한</th>
                                    <td>
                                        <select id={"denyUseYN"} value={userData.denyUseYN ?? 'N'}
                                                onChange={onChangeUserInfo}>
                                            <option key={'N'} value={'N'}>없음</option>
                                            <option key={'Y'} value={'Y'}>제한</option>
                                        </select>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={"buttonset"}>
                            <button className={"modal_save"} onClick={modalSave} ref={buttonElement}>저장</button>
                            <button className={"modal-cancel"} onClick={modalClose}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}