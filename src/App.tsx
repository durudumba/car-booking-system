import './App.css'
import './style/style.css'

import {Routes, Route, BrowserRouter} from "react-router-dom";
import {CarBooking} from "./components/CarBooking.tsx";
import {Login} from "./components/Login.tsx";
import {Header} from "./components/Header.tsx";
import {pathNames} from "./utils/common.ts";
import {CarSchedule} from "./components/CarSchdule.tsx";
import {CarManage} from "./components/CarManage.tsx";
import {DrivingInfo} from "./components/DrivingInfo.tsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Login/>}/>
                <Route element={<Header/>}>
                    <Route path={pathNames.carBooking.url} element={<CarBooking/>}/>
                    <Route path={pathNames.carSchedule.url} element={<CarSchedule/>}/>
                    <Route path={pathNames.drivingInfo.url} element={<DrivingInfo/>}/>
                    <Route path={pathNames.carManage.url} element={<CarManage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
