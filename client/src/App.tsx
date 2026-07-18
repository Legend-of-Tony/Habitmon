

import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./components/layouts/Layout.tsx";
import Home from "./features/home/Home.tsx";
import Account from "./features/account_page/Account.tsx";
import Register from "./features/account_page/Register.tsx";
import Login from "./features/account_page/Login.tsx";

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
            </Route>
        </Routes>

    </BrowserRouter>
  )
}

export default App