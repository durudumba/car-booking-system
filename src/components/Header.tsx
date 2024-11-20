import {Link} from "react-router-dom";
import {axiosCall, pathNames} from "../utils/common.ts";
import {API_INFO} from "../configs.ts";
import {useEffect, useState} from "react";
import {errorHandler} from "../utils/errorHandler.ts";


export const Header = () => {
    const [menuAccessable, setMenuAccessable] = useState<{[key: string]: string}>({});
    const logout = () => {
        localStorage.clear();
    }

    useEffect(() => {
        axiosCall("GET", API_INFO+"api/users/getAccessableMenuList", {
            user_id: localStorage.getItem("id")
        }, (data: any) => {
            const obj: any = {};

            data.map((v: any) => {
                obj[v.MENU_ID] = v.PRMT_ACCS;
            })

            setMenuAccessable(obj);
        }, (e: any) => {
            errorHandler(e);
        })
    }, []);

    return (
        <>
            <header>
                <ul>
                    {menuAccessable[pathNames.carBooking.id] === 'Y'
                        ? <li>
                            <Link to={pathNames.carBooking.url}>
                                <label>{pathNames.carBooking.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.carSchedule.id] === 'Y'
                        ? <li>
                            <Link to={pathNames.carSchedule.url}>
                                <label>{pathNames.carSchedule.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.drivingInfo.id] === 'Y'
                        ? <li>
                            <Link to={pathNames.drivingInfo.url}>
                                <label>{pathNames.drivingInfo.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.carManage.id] === 'Y'
                        ? <li>
                            <Link to={pathNames.carManage.url}>
                                <label>{pathNames.carManage.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.userManage.id] === 'Y'
                        ? <li>
                            <Link to={pathNames.userManage.url}>
                                <label>{pathNames.userManage.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                    <li>
                        <Link to={pathNames.login.url} onClick={logout}>
                            <label>로그아웃</label>
                        </Link>
                    </li>
                </ul>

            </header>
        </>

    )
}

