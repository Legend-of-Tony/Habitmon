import { useAuth } from "../../context/useAuth";

const Account = () => {
    const {user, loading} = useAuth()
    if (loading){
        return <p>Loading...</p>
    }
    if (!user){
        return <p>Not logged in</p>
    }
    return (
        <div>
            <h1>Account</h1>
            <p>Welcome, {user.username}</p>
        </div>
    );
};

export default Account;