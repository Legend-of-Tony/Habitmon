
import Navbar from "../nav/Navbar.tsx";
import {Outlet} from "react-router";



const Layout = () => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[#6FB4FD] px-4 py-4 sm:px-8 sm:py-6 lg:h-screen lg:overflow-hidden lg:px-10 lg:py-8">
            <div className="flex shrink-0">
                <Navbar/>
            </div>
            <main className="flex flex-1 lg:min-h-0">
                <Outlet/>
            </main>
        </div>
    )
}
export default Layout
