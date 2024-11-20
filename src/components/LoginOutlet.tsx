import {Header} from "./Header.tsx";
import {Navigate, Outlet} from "react-router-dom";
import {pathNames} from "../utils/common.ts";

export const LoginOutlet = () => {
    const isAuthenticate = () => {
        const token = localStorage.getItem("token");
        const expireIn = Number(localStorage.getItem("expireIn"));

        if (token === null) {
            // 토큰 없는 경우
            return false;
        } else if (expireIn < new Date().getTime()) {
            // 만료시간을 초과한 경우
            return false;
        }

        return true;
    }

    return isAuthenticate() ? (
        <>
            <Header/>
            <Outlet/>
        </>
    ) : (
        <Navigate to={pathNames.login.url} replace={true}/>
    )
}