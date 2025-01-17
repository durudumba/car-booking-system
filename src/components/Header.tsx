import {Link, useNavigate} from "react-router-dom";
import {axiosCall, pathNames} from "../utils/common.ts";
import {API_INFO} from "../utils/configs.ts";
import {useEffect, useState} from "react";
import {errorHandler} from "../utils/errorHandler.ts";


export const Header = () => {
    const [clickMenu, setClickMenu] = useState(pathNames.carBooking.id);
    const [menuAccessable, setMenuAccessable] = useState<{[key: string]: string}>({});
    const movePage = useNavigate();
    const userName = localStorage.getItem("user_name")==='undefined' || localStorage.getItem("user_name")==='null' ?
                        "알 수 없음" : localStorage.getItem("user_name");

    const logout = () => {
        localStorage.clear();
    }

    const onClickMenu = (e: any) => {
        if(e.target.id === clickMenu) {
            window.location.reload();
            return;
        }

        if(e.target.tagName == "DIV")
            movePage(e.target.firstChild.pathname);

        setClickMenu(e.target.id);
    }

    const checkMenuActive = () => {
        const pageId = (document.querySelector(".content-body")?.firstChild as HTMLElement)
            .getAttribute("id");

        setClickMenu(pageId ?? '');
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

    useEffect(() => {
        window.addEventListener("load", checkMenuActive)
        window.addEventListener("popstate", checkMenuActive);

        return () => {
            window.removeEventListener("load", checkMenuActive)
            window.removeEventListener("popstate", checkMenuActive);
        }
    });

    return (
        <>
            <header>
                <h1>차량관리</h1>
                <div className={"loginUserName"}>
                    <span>{userName} 님 접속</span>
                        <Link to={pathNames.login.url} onClick={logout}>
                            로그아웃
                        </Link>
                </div>
                <ul>
                    {menuAccessable[pathNames.carBooking.id] === 'Y'
                        ? <li>
                            <div className={"menuTab " + (clickMenu === pathNames.carBooking.id ? "tabClick" : "")}
                                 id={pathNames.carBooking.id} onClick={onClickMenu}>
                                <Link to={pathNames.carBooking.url} id={pathNames.carBooking.id} onClick={onClickMenu}
                                >
                                    {pathNames.carBooking.title}
                                </Link>
                            </div>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.carSchedule.id] === 'Y'
                        ? <li>
                            <div className={"menuTab" + (clickMenu === pathNames.carSchedule.id ? " tabClick" : "")}
                                 id={pathNames.carSchedule.id} onClick={onClickMenu}>
                                <Link to={pathNames.carSchedule.url} id={pathNames.carSchedule.id}>
                                    {pathNames.carSchedule.title}
                                </Link>
                            </div>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.drivingInfo.id] === 'Y'
                        ? <li>
                            <div className={"menuTab" + (clickMenu === pathNames.drivingInfo.id ? " tabClick" : "")}
                                 id={pathNames.drivingInfo.id} onClick={onClickMenu}>
                                <Link to={pathNames.drivingInfo.url} id={pathNames.drivingInfo.id}>
                                    {pathNames.drivingInfo.title}
                                </Link>
                            </div>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.drivingManage.id] === 'Y'
                        ? <li>
                            <div className={"menuTab" + (clickMenu === pathNames.drivingManage.id ? " tabClick" : "")}
                                 id={pathNames.drivingManage.id} onClick={onClickMenu}>
                                <Link to={pathNames.drivingManage.url} id={pathNames.drivingManage.id}>
                                    {pathNames.drivingManage.title}
                                </Link>
                            </div>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.carManage.id] === 'Y'
                        ? <li>
                            <div className={"menuTab" + (clickMenu === pathNames.carManage.id ? " tabClick" : "")}
                                 id={pathNames.carManage.id} onClick={onClickMenu}>
                                <Link to={pathNames.carManage.url} id={pathNames.carManage.id}>
                                    {pathNames.carManage.title}
                                </Link>
                            </div>
                        </li>
                        : null
                    }
                    {menuAccessable[pathNames.userManage.id] === 'Y'
                        ? <li>
                            <div className={"menuTab" + (clickMenu === pathNames.userManage.id ? " tabClick" : "")}
                                 id={pathNames.userManage.id} onClick={onClickMenu}>
                                <Link to={pathNames.userManage.url} id={pathNames.userManage.id}>
                                    {pathNames.userManage.title}
                                </Link>
                            </div>
                        </li>
                        : null
                    }
                </ul>
            </header>
        </>

    )
}

