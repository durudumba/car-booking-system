import './App.css'
import './style/style.css'

import {Routes, Route, BrowserRouter} from "react-router-dom";
import {CarBooking} from "./components/CarBooking.tsx";
import {Login} from "./components/Login.tsx";
import {Header} from "./components/Header.tsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Login/>}/>
                <Route element={<Header/>}>
                    <Route path={"/Booking"} element={<CarBooking/>}/>
                </Route>
            </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
