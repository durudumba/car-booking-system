import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosCall, pathNames} from "../utils/common.ts";
import {API_INFO} from "../configs.ts";
import {SignUpModal} from "../modals/SingUpModal.tsx";
import moment from 'moment';
import 'moment/locale/ko'
import UseEnterBtnClick from "../utils/useEnterBtnClick.tsx";

export const Login = () => {
    const movePage = useNavigate();
    const loginID = useRef<HTMLInputElement>(null);
    const loginPW = useRef<HTMLInputElement>(null);
    const [signUpModalOpen, setSignUpModalOpen] = useState(false);

    const buttonElement = UseEnterBtnClick();

    const onClickSignIn = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(loginID.current?.value === '' || loginPW.current?.value === '') {
            alert("아이디 혹은 비밀번호를 입력하세요");
            return ;
        }

        axiosCall("POST", API_INFO + "api/users/login", {
            userId: loginID.current?.value,
            userPw: loginPW.current?.value
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
            }, (_e: any) => {
                console.error("사용자 정보 조회 에러!");
                return ;
            });
            movePage(pathNames.carBooking.url);
        }, (_e: any) => {
            alert("로그인에 실패했습니다 !")
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
                <button className={"login-signUp"} onClick={() => {setSignUpModalOpen(true)}}>회원가입</button>
                <button className={"login-signIn"} onClick={onClickSignIn} ref={buttonElement}>로그인</button>
            </div>
            <SignUpModal isModalOpen={signUpModalOpen} setIsModalOpen={setSignUpModalOpen} />
        </div>
    )
}