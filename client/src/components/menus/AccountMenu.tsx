import {Link} from "react-router";


const AccountMenu = () => {
    return (
        <div className='bg-amber-50 rounded-2xl w-full h-full'>
            <ul className='flex flex-col justify-around items-center h-full w-full'>
                <li><Link to="/register">Register</Link></li>
                <li>Login</li>
            </ul>
        </div>
    )
}
export default AccountMenu
