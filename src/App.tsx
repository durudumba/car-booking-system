import './App.css'
import './style/style.css'

import {Routes, Route, BrowserRouter} from "react-router-dom";
import {CarBooking} from "./components/CarBooking.tsx";
import {Login} from "./components/Login.tsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Login/>}/>
                <Route path={"/booking"} element={<CarBooking/>}/>
            </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
