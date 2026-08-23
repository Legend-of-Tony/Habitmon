
import Navbar from "../nav/Navbar.tsx";
import {Outlet} from "react-router";



const Layout = () => {
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#6FB4FD] px-10 py-8">
            <div className="flex shrink-0">
                <Navbar/>
            </div>
            <div className="flex min-h-0 flex-1">
                <Outlet/>
            </div>
        </div>
    )
}
export default Layout
