import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { validateLoginFormData } from "../../components/functions/FormDataValidation"
import { API_URL } from "../../config"
import { useAuth } from "../../context/useAuth"
import AccountShell, { accountButtonClass, accountInputClass } from "./components/AccountShell"

const Login = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const { refreshAuth} = useAuth()
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const msg = validateLoginFormData({ email, password })
        if (msg) {
            setError(msg)
            return
        }

        setSubmitting(true)
        setError("")
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            })

            if (!response.ok){
                const msg = await response.text()
                setError(msg || "Unable to log in")
                return
            }
            await refreshAuth()
            navigate('/')
        } catch {
            setError("Unable to reach the server. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }
  return (
    <AccountShell
        eyebrow="Welcome back"
        title="Log in to your den"
        description="Pick up your focus session and check in with your Habitmon."
        footer={<>New around here? <Link className="font-black text-blue-600 hover:underline" to="/register">Create an account</Link></>}
    >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <label className="text-sm font-bold text-slate-800">
                    Email
                    <input className={accountInputClass} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label className="text-sm font-bold text-slate-800">
                    Password
                    <input className={accountInputClass} type="password" autoComplete="current-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
                <button className={accountButtonClass} type="submit" disabled={submitting}>{submitting ? "Logging in…" : "Log in"}</button>
            </form>
    </AccountShell>
  )
}

export default Login
