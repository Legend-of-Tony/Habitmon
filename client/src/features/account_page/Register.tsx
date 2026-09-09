import {useState} from 'react'
import type { FormEvent } from 'react'
import {API_URL} from '../../config'
import { validateRegisterFormData } from '../../components/functions/FormDataValidation'
import { Link, useNavigate } from 'react-router'
import AccountShell, { accountButtonClass, accountInputClass } from './components/AccountShell'

const Register = () => {

    const navigate = useNavigate()
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [username,setUsername] = useState('')
    const [password,setPassword]= useState('')
    const [error,setError] = useState('')
    const [submitting,setSubmitting] = useState(false)

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const msg = validateRegisterFormData({firstName,lastName,email,username,password})
        if (msg){
            setError(msg)
            return
        }

        setSubmitting(true)
        setError('')
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({first_name:firstName,last_name:lastName,email,username,password}),
            })

            if(!response.ok){
                const msg = await response.text()
                setError(msg || 'Unable to create account')
                return
            }
            navigate('/login')
        } catch {
            setError('Unable to reach the server. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }



    return (
        <AccountShell
            eyebrow="Meet your Habitmon"
            title="Create your account"
            description="Start a focus routine and receive a one-of-a-kind companion generated just for you."
            footer={<>Already have an account? <Link className="font-black text-blue-600 hover:underline" to="/login">Log in</Link></>}
        >
                <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
                    <label className="text-sm font-bold text-slate-800">
                        First name
                        <input className={accountInputClass} autoComplete="given-name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Avery"/>
                    </label>
                    <label className="text-sm font-bold text-slate-800">
                        Last name
                        <input className={accountInputClass} autoComplete="family-name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Morgan"/>
                    </label>
                    <label className="text-sm font-bold text-slate-800 sm:col-span-2">
                        Email
                        <input className={accountInputClass} autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"/>
                    </label>
                    <label className="text-sm font-bold text-slate-800 sm:col-span-2">
                        Username
                        <input className={accountInputClass} autoComplete="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="focus_friend" />
                    </label>
                    <label className="text-sm font-bold text-slate-800 sm:col-span-2">
                        Password
                        <input className={accountInputClass} autoComplete="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
                    </label>
                    {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-700 sm:col-span-2">{error}</p>}
                    <button className={`${accountButtonClass} sm:col-span-2`} type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</button>
                </form>
        </AccountShell>
    )
}
export default Register
