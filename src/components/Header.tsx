import {Link, Outlet} from "react-router-dom";
import {axiosCall, pathNames} from "../utils/common.ts";
import {API_INFO} from "../configs.ts";
import {useEffect, useState} from "react";


export const Header = () => {
    const [menuAccessable, setMenuAccessable] = useState<{[key: string]: string}>({});

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
            console.error(e);
        })
    }, []);


    return (
        <>
            <header>
                <ul>
                    {menuAccessable["MENU1_1"] === 'Y'
                        ? <li>
                            <Link to={pathNames.carBooking.url}>
                                <label>{pathNames.carBooking.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                    {menuAccessable["MENU1_2"] === 'Y'
                        ? <li>
                            <Link to={pathNames.carSchedule.url}>
                                <label>{pathNames.carSchedule.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                    {menuAccessable["MENU1_3"] === 'Y'
                        ? <li>
                            <Link to={pathNames.drivingInfo.url}>
                                <label>{pathNames.drivingInfo.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                    {menuAccessable["MENU2_1"] === 'Y'
                        ? <li>
                            <Link to={pathNames.carManage.url}>
                                <label>{pathNames.carManage.title}</label>
                            </Link>
                        </li>
                        : null
                    }
                </ul>
            </header>
            <Outlet />
        </>

    )
}

