import {Link} from "react-router";
import { useAuth } from "../../context/useAuth";


const AccountMenu = () => {
    const {user, loading} = useAuth()
    if (loading){
        return <p>Loading...</p>
    }
    return (
        <div className='bg-amber-50 rounded-2xl w-full h-full'>

            <ul className='flex flex-col justify-around items-center h-full w-full'>
                {user ? (
                    <Link to="/account">Account</Link>
                ) : (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
            </ul>
        </div>
    )
}
export default AccountMenu
