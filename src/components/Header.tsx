import {Link, Outlet} from "react-router-dom";
import {axiosCall} from "../utils/common.ts";
import {API_INFO} from "../configs.ts";
import {useEffect, useState} from "react";


export const Header = () => {
    const [menuAccessable, setMenuAccessable] = useState({});

    useEffect(() => {
        axiosCall("GET", API_INFO+"api/users/getAccessableMenuList", {
            user_id: localStorage.getItem("id")
        }, (data: any) => {
            const obj = {};

            data.map((v: any) => {
                obj[v.MENU_ID] = v.PRMT_ACCS
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
                    <li>
                        <Link to={"/Booking"}>
                            <label>차량예약</label>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/TEMP"}>
                            <label>테스트</label>
                        </Link>
                    </li>
                </ul>
            </header>
            <Outlet />
        </>

    )
}

