
import CanvasInit from './threeJS/CanvasInit'
import Navbar from "./components/nav/Navbar.tsx";
import Header from "./components/nav/Header.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./components/layouts/Layout.tsx";
import Home from "./features/home/Home.tsx";
import Account from "./features/account_page/Account.tsx";
import Register from "./features/account_page/Register.tsx";

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/register" element={<Register/>}/>
            </Route>
        </Routes>

    </BrowserRouter>
  )
}

export default App