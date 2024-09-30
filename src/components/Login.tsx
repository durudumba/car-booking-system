import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosCall} from "../utils/common.ts";
import {API_INFO} from "../configs.ts";

export const Login = () => {
    const movePage = useNavigate();
    const loginID = useRef<HTMLInputElement>(null);
    const loginPW = useRef<HTMLInputElement>(null);


    const submitLogin = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(loginID.current?.value === '' || loginPW.current?.value === '') {
            alert("아이디 혹은 비밀번호를 입력하세요");
            return ;
        }

        axiosCall("POST", API_INFO + "api/login", {
            id: loginID.current?.value,
            pw: loginPW.current?.value
        }, (data: any) => {
            movePage("/booking");
        }, (e: any) => {
            return ;
        })
    }

    return (
        <div className={"login"}>
            <div className={"login-id"}>
                <input type={"text"} className={"login-id"} placeholder={"ID"} ref={loginID}/>
            </div>
            <div className={"login-pw"}>
                <input type={"password"} className={"login-pw"} placeholder={"PASSWORD"} ref={loginPW}/>
            </div>
            <div>
                <button className={"login-submit"} onClick={submitLogin}>로그인</button>
            </div>
        </div>
    )
}