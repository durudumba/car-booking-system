import {useEffect, useState} from "react";
import {gridIndexSig, gridInit, reloadGrid} from "../utils/commTuiGrid.ts";
import {API_INFO} from "../utils/configs.ts";
import {UserInfoModal} from "../modals/UserInfoModal.tsx";
import {pathNames} from "../utils/common.ts";

const userColumns = [
    { header : '사용자 ID', name : 'USER_ID', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '사용자명', name : 'USER_NAME', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '사용자등급', name : 'USER_RANK_NAME', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '사용제한', name : 'DENY_USE', sortable: true, resizeable: true, width: 100, align: 'center'},
    { header : '등록일자', name : 'REG_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
    { header : '수정일자', name : 'UPD_DT', sortable: true, resizeable: true, width: 120, align: 'center'},
]

export const UserManage = () => {
    const [userGrid, setUserGrid] = useState<gridIndexSig>();
    const [selectedUserInfo, setSelectedUserInfo] = useState({});
    const [userModalOpen, setUserModalOpen] = useState(false);

    const onClickUserGrid = (rowData: any) => {
        setSelectedUserInfo({
            userId: rowData.USER_ID,
            userName: rowData.USER_NAME,
            userRank: rowData.USER_RANK,
            denyUseYN: rowData.DENY_USE_YN,
            regDt: rowData.REG_DT,
            updDt: rowData.UPD_DT
        })
        setUserModalOpen(true);
    }

    const reloadUserGrid = () => {
        reloadGrid(userGrid, "get", API_INFO+"api/users/selectUserList", null);

        setUserGrid(userGrid);
    }

    useEffect(() => {
        const grid = gridInit("userGrid", userColumns, onClickUserGrid);

        reloadGrid(grid, "get", API_INFO+"api/users/selectUserList", null);

        setUserGrid(grid);
    }, []);

    return (
        <div className={"userManageCore"} id={pathNames.userManage.id}>
            <div className={"user-manage buttonset"}>

            </div>
            <div className={"user-manage userGrid"} id={"userGrid"}/>
            <UserInfoModal isModalOpen={userModalOpen} setIsModalOpen={setUserModalOpen}
                            data={selectedUserInfo} setData={setSelectedUserInfo}
                            reloadFunc={reloadUserGrid}/>
        </div>
    )
}