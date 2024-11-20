import {AxiosError} from "axios";

export const errorHandler = (errMsg: AxiosError) => {
    if(errMsg.code === "ERR_NETWORK") {
        alert("네트워크 에러발생! 로그인 페이지로 이동합니다")
        localStorage.clear();
        window.location.replace("/");
    } else {
        alert(errMsg.response?.data);
    }
}