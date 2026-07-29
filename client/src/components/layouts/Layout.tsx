
import Navbar from "../nav/Navbar.tsx";
import {Outlet} from "react-router";



const Layout = () => {
    return (
        <div className="flex flex-col w-full h-screen px-10 py-8 bg-[#6FB4FD]">
            <div className="flex w-auto h-auto">
                <Navbar/>
            </div>
            <div className="flex w-auto h-full">
                <Outlet/>
            </div>
        </div>
    )
}
export default Layout
