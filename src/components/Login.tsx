import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosCall, pathNames, showAlert} from "../utils/common.ts";
import {API_INFO} from "../utils/configs.ts";
import moment from 'moment';
import 'moment/locale/ko'
import UseEnterBtnClick from "../utils/useEnterBtnClick.tsx";
import {errorHandler} from "../utils/errorHandler.ts";
import {useCookies} from "react-cookie";

export const Login = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["userId"]);

    const movePage = useNavigate();
    const [loginId, setLoginId] = useState(cookies.userId ?? "");
    const [loginPw, setLoginPw] = useState("");

    const [isIdSave, setIsIdSave] = useState(!!cookies.userId);

    const buttonElement = UseEnterBtnClick();

    const onChangeIdSave = (e: any) => {
        const {checked}: any = e.target;

        setIsIdSave(checked);
    }

    const onClickSignIn = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(loginId === '' || loginPw === '') {
            showAlert("아이디 혹은 비밀번호를 입력하세요");
            return ;
        }

        axiosCall("POST", API_INFO + "api/users/login", {
            userId: loginId,
            userPw: loginPw
        }, (data: any) => {
            localStorage.setItem("token", `Bearer ${data.accessToken}`);
            localStorage.setItem("id", data.userId);
            localStorage.setItem("conn_dt", moment().format('YYYY-MM-DD'));
            localStorage.setItem("conn_tm", moment().format('HH:mm:ss'));
            localStorage.setItem("expireIn", data.tokenExpiresIn);

            axiosCall("post", API_INFO + "api/users/selectUserInfo", {
                user_id: data.userId
            }, (userInfo: any) => {
                localStorage.setItem("user_name", userInfo.USER_NAME);

                if (isIdSave) {
                    setCookie("userId", data.userId, {maxAge: 60 * 60 * 24})
                } else {
                    removeCookie("userId");
                }

                movePage(pathNames.carBooking.url);
            }, (e: any) => {
                errorHandler(e);
                localStorage.clear();
            });
        }, (e: any) => {
            errorHandler(e);
        })
    }

    return (
        <div className={"login"}>
            <div className={"loginTitle"}>
                <h2>법인차량예약</h2>
            </div>
                <div className={"login-id"}>
                    <input type={"text"} className={"login-id"} placeholder={"ID"} value={loginId}
                    onChange={(e: any) => setLoginId(e.target.value)}/>
                </div>
                <div className={"login-pw"}>
                    <input type={"password"} className={"login-pw"} placeholder={"PASSWORD"} value={loginPw}
                    onChange={(e: any) => setLoginPw(e.target.value)}/>
                </div>
                <div className={"rememberId"}>
                    <label>
                        <input type={"checkbox"} checked={isIdSave} onChange={onChangeIdSave}/>
                        <span>아이디 저장</span>
                    </label>
                </div>
                <div className={"buttonSet"}>
                    <button className={"login-signIn"} onClick={onClickSignIn}
                            ref={buttonElement}>로그인
                    </button>
                </div>
        </div>
    )
}