import axios from 'axios';
import qs from 'qs';

export async function axiosCall(requsetType: string, url: string, data: any, _callbackFunction ?: ((data: any) => void) | null, _errorCallback ?: ((data: any) => void) | null) {
    const options = {
        url: url,
        method: requsetType,
        params: data,
        headers: {
            Authorization: localStorage.getItem("token")
        },
        paramsSerializer: (params: any) => {
            return qs.stringify(params, {arrayFormat: "comma"});
        },
    }

    await axios(options).then(response => {
        if (response.data != null) {
            _callbackFunction && _callbackFunction(response.data);
        }
    }).catch(error => {
        if (error?.response?.status === 401) {
            alert("로그인 토큰이 만료되어 로그인 페이지로 이동합니다.");
            window.location.href = "/";
        } else {
            if (_errorCallback != null) _errorCallback(error);
        }

    })
}

export const pathNames = {
    login: {
        title: "로그인",
        url: "/"
    },
    drivingInfo: {
        title: "운행정보",
        url: "/drivingInfo"
    },
    carBooking: {
        title: "차량예약",
        url: "/CarBooking"
    },
    carSchedule: {
        title: "차량일정",
        url: "/CarSchedule"
    },
    carManage: {
        title: "차량관리",
        url: "/CarManage"
    }
}

