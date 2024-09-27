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
