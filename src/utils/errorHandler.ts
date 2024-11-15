import {AxiosError} from "axios";

export const errorHandler = (errMsg: AxiosError) => {
    alert(errMsg.response?.data);
}