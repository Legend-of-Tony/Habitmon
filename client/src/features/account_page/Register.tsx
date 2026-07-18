import React,{useState} from 'react'
import {API_URL} from '../../config'
import { validateFormData } from '../../components/functions/FormDataValidation'
import { useNavigate } from 'react-router'

const Register = () => {

    const navigate = useNavigate()
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [username,setUsername] = useState('')
    const [password,setPassword]= useState('')
    const [error,setError] = useState('')

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const msg = validateFormData({firstName,lastName,email,username,password})
        if (msg){
            setError(msg)
            return
        }

        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({first_name:firstName,last_name:lastName,email,username,password}),
        })

        if(!response.ok){
            const msg = await response.text()
            setError(msg)
            return
        }

        const data = await response.json()
        console.log('registered',data)
        navigate('/login')
    }



    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='bg-amber-50 flex flex-col justify-center items-center w-2/3 h-2/3'>
                <h1>Register</h1>
                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}placeholder="First Name"/>
                    </label>
                    <label>
                        Last Name:
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}placeholder="Last Name"/>
                    </label>
                    <label>
                        Email:
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}placeholder="Email"/>
                    </label>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </label>
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
}
export default Register
