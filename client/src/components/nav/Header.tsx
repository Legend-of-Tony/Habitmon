
import {Link} from "react-router";

const Header = () => {
    return (
        <div className='w-full h-auto flex justify-between'>
            <Link to="/">
                <img src="logo.png"/>
            </Link>
            <div>
                <div className='border-2 rounded-2xl'>
                    <h1>Account</h1>
                </div>
            </div>
        </div>
    )
}
export default Header
