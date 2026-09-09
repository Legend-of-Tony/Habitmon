
import Navbar from "../nav/Navbar.tsx";
import {Outlet} from "react-router";



const Layout = () => {
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#6FB4FD] px-4 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
            <div className="flex shrink-0">
                <Navbar/>
            </div>
            <main className="flex min-h-0 flex-1">
                <Outlet/>
            </main>
        </div>
    )
}
export default Layout
