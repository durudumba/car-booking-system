import {useEffect, useState} from "react";
import {axiosCall} from "./common.ts";
import {API_INFO} from "../configs.ts";
import {errorHandler} from "./errorHandler.ts";

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
            setAccessAuth(data);
        }, (e: any) => {
            errorHandler(e);
        })
    }, [props.menuId]);

    return (
        <>
            { accessAuth? props.children: PageAccessDenied()}
        </>
    )
}

const PageAccessDenied = () => {
    return (
        <div className={"pageAccessDenied"}>
            <h2>접근이 제한된 페이지입니다</h2>
        </div>
    )
}