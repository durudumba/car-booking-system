// import './App.css'
import './style/style.css'
import './style/m_style.css'

import {Routes, Route, BrowserRouter} from "react-router-dom";
import {CarBooking} from "./components/CarBooking.tsx";
import {Login} from "./components/Login.tsx";
import {pathNames} from "./utils/common.ts";
import {CarSchedule} from "./components/CarSchedule.tsx";
import {CarManage} from "./components/CarManage.tsx";
import {DrivingInfo} from "./components/DrivingInfo.tsx";
import {UserManage} from "./components/UserManage.tsx";
import {LoginOutlet} from "./components/LoginOutlet.tsx";
import {AccessAuthValid} from "./utils/AccessAuthValid.tsx";
import {DrivingManage} from "./components/DrivingManage.tsx";

function App() {


  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path={pathNames.login.url} element={<Login/>}/>
                <Route element={<LoginOutlet/>}>
                    <Route path={pathNames.carBooking.url} element={
                        <AccessAuthValid menuId={pathNames.carBooking.id}><CarBooking/></AccessAuthValid>}/>
                    <Route path={pathNames.carSchedule.url} element={
                        <AccessAuthValid menuId={pathNames.carSchedule.id}><CarSchedule/></AccessAuthValid>}/>
                    <Route path={pathNames.drivingInfo.url} element={
                        <AccessAuthValid menuId={pathNames.drivingInfo.id}><DrivingInfo/></AccessAuthValid>}/>
                    <Route path={pathNames.carManage.url} element={
                        <AccessAuthValid menuId={pathNames.carManage.id}><CarManage/></AccessAuthValid>}/>
                    <Route path={pathNames.userManage.url} element={
                        <AccessAuthValid menuId={pathNames.userManage.id}><UserManage/></AccessAuthValid>}/>
                    <Route path={pathNames.drivingManage.url} element={
                        <AccessAuthValid menuId={pathNames.drivingManage.id}><DrivingManage/></AccessAuthValid>}/>
                </Route>
            </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
