import { useAuth } from "../../context/useAuth";
import {Link} from "react-router";

const Navbar = () => {
    const {user, loading} = useAuth()
    return (
        <nav className='w-full h-auto flex justify-between'>
                <Link to="/">
                    <img src="logo.png"/>
                </Link>
                <ul className='flex gap-4 border-2 rounded-3xl p-2'>
                    <li><Link to="/stats">Stats</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>
                    <li>
                        {loading ? (
                            <span>Loading...</span>
                        ) : user ? (
                            <Link to="/account">Account</Link>
                        ) : (
                            <Link to="/Login">Login</Link>
                        )}
                    </li>
                </ul>
        </nav>
    )
}
export default Navbar
