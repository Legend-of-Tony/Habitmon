import Header from "../nav/Header.tsx";
import Navbar from "../nav/Navbar.tsx";
import {Outlet} from "react-router";
import AccountMenu from "../menus/AccountMenu.tsx";


const Layout = () => {
    return (
        <div className="grid grid-cols-12 grid-rows-12 w-auto h-screen">
            <div className="col-start-1 col-span-full row-start-1 row-span-1 z-10 ">
                <Header />
            </div>
            <div className="col-start-12 col-span-1 row-start-2 row-span-4 z-10 ">
                <AccountMenu/>
            </div>
            <div className="grid col-start-1 col-span-full row-span-full row-start-1  z-0">
                <Outlet/>
            </div>
            <div className="col-start-1 col-span-full row-start-12 row-span-1 z-10 flex justify-center">
                <Navbar/>
            </div>
        </div>
    )
}
export default Layout
