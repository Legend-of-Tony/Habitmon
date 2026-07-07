import React,{useState} from 'react'

const Register = () => {
    const [email,setEmail] = useState('')
    const [username,setUsername] = useState('')
    const [password,setPassword]= useState('')
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='bg-amber-50 flex flex-col justify-center items-center w-2/3 h-2/3'>
                <h1>Register</h1>
                <form className='flex flex-col'>
                    <label>
                        Email:
                        <input type="text" name="email" id="email"placeholder="Email"/>
                    </label>
                    <label>
                        Username:
                        <input type="text" placeholder="Username" />
                    </label>
                    <label>
                        Password:
                        <input type="password" placeholder="Password" />
                    </label>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
}
export default Register
