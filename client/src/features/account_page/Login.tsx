import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { validateLoginFormData } from "../../components/functions/FormDataValidation"
import { API_URL } from "../../config"
import { useAuth } from "../../context/useAuth"

const Login = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { refreshAuth} = useAuth()
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const msg = validateLoginFormData({ email, password })
        if (msg) {
            setError(msg)
            return
        }

        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        })

        if (!response.ok){
            const msg = await response.text()
            setError(msg)
            return
        }
        
        if (!response.ok) {
            const msg = await response.text()
            setError(msg)
            return
        }
        await refreshAuth()
        navigate('/')
    }
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <div className='bg-amber-50 flex flex-col justify-center items-center w-2/3 h-2/3'>
            <h1>Login</h1>
            <form className='flex flex-col' action="" onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                {error && <p className="text-red-500">{error}</p>}
                <p><Link to="/register">Register</Link> new account</p>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login