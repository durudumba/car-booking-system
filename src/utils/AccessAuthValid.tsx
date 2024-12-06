import {useEffect, useState} from "react";
import {axiosCall} from "./common.ts";
import {API_INFO} from "./configs.ts";
import {errorHandler} from "./errorHandler.ts";
import {AxiosError} from "axios";

export const AccessAuthValid = (props: {
    children: any,
    menuId: string
}) => {
    const [accessAuth, setAccessAuth] = useState(true);

    useEffect(() => {
        const param = {
            userId: localStorage.getItem("id"),
            menuId: props.menuId
        }
        axiosCall("post", API_INFO+"api/users/getPageAccessAuth", param, (data: any) => {
            if(data.DENY_USE_YN === "Y") {
                errorHandler(new AxiosError("", "ERR_DENIED_USER"));
                return ;
            }
            setAccessAuth(data.PRMT_YN === "Y");
        }, (e: any) => {
            errorHandler(e);
        })
    }, [props.menuId]);

    return (
        <div className={"content-body"}>
            { accessAuth? props.children: PageAccessDenied()}
        </div>
    )
}

const PageAccessDenied = () => {
    return (
        <div className={"pageAccessDenied"}>
            <h2>접근이 제한된 페이지입니다</h2>
        </div>
    )
}