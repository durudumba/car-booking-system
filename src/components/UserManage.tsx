import {useEffect, useState} from "react";
import {gridIndexSig, gridInit, reloadGrid} from "../utils/commTuiGrid.ts";
import {API_INFO} from "../utils/configs.ts";
import {UserInfoModal} from "../modals/UserInfoModal.tsx";
import {axiosCall, emptyCellFormatter, pathNames} from "../utils/common.ts";
import {errorHandler} from "../utils/errorHandler.ts";

const userColumns = [
    { header : '사용자 ID', name : 'USER_ID', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '사용자등급', name : 'USER_RANK_NAME', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '사용제한', name : 'DENY_USE', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '등록일자', name : 'REG_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '수정일자', name : 'UPD_DT', sortable: true, resizeable: true, width: 120, align: 'center', formatter: emptyCellFormatter},
]

export interface UserInfoParamType {
    userId: string,
    userRank: number,
    denyUseYN: string,
}

const initUserInfoParam: UserInfoParamType = {
    userId: "",
    userRank: 1,
    denyUseYN: 'N',
}

export const UserManage = () => {
    const [userInfo, setUserInfo] = useState<UserInfoParamType>({...initUserInfoParam})
    const [selectedUserInfo, setSelectedUserInfo] = useState<UserInfoParamType>({...initUserInfoParam});

    const [userGrid, setUserGrid] = useState<gridIndexSig>();
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [modalUseType, setModalUseType] = useState("add");

    const onClickUserGrid = (rowData: any) => {
        setSelectedUserInfo({
            ...selectedUserInfo,
            userId: rowData.USER_ID,
            userRank: rowData.USER_RANK,
            denyUseYN: rowData.DENY_USE_YN,
        })
    }

    const onClickBtn = (e: any) => {
        const id: string = e.target.id;

        if(id === "add") {
            setModalUseType("add");
            setUserInfo(initUserInfoParam);
            setUserModalOpen(true);
        } else if(id === "mod") {
            if(userGrid!["_srk"] === -1 || selectedUserInfo.userId === '') {
                alert("수정할 사용자를 선택하세요");
                return ;
            }
            setModalUseType("mod");
            setUserInfo(selectedUserInfo);
            setUserModalOpen(true);
        } else if(id === "del") {
            if(userGrid!["_srk"] === -1 || selectedUserInfo.userId === '') {
                alert("삭제할 사용자를 선택하세요");
                return ;
            }
            if(window.confirm("해당 사용자가 삭제됩니다")) {
                axiosCall("delete", API_INFO + "api/users/deleteUserInfo", selectedUserInfo, (_data: any) => {
                    alert("삭제 완료");
                    reloadUserGrid();
                }, (e: any) => {
                    errorHandler(e);
                });
            }
        }
    }

    const reloadUserGrid = () => {
        userGrid && reloadGrid(userGrid, "get", API_INFO+"api/users/selectUserList", null);
        setUserGrid(userGrid);
    }

    useEffect(() => {
        const grid = gridInit("userGrid", userColumns, onClickUserGrid);

        grid && reloadGrid(grid, "get", API_INFO+"api/users/selectUserList", null);
        setUserGrid(grid);
    }, []);

    return (
        <div className={"userManageCore"} id={pathNames.userManage.id}>
            <div className={"user-manage buttonset"}>
                <button className={"addBtn"} id={"add"} onClick={onClickBtn}>추가</button>
                <button className={"modBtn"} id={"mod"} onClick={onClickBtn}>수정</button>
                <button className={"delBtn"} id={"del"} onClick={onClickBtn}>삭제</button>
            </div>
            <div className={"user-manage userGrid"} id={"userGrid"}/>
            <UserInfoModal isModalOpen={userModalOpen} setIsModalOpen={setUserModalOpen}
                           data={userInfo} setData={setUserInfo}
                           reloadFunc={reloadUserGrid} useType={modalUseType}/>
        </div>
    )
}