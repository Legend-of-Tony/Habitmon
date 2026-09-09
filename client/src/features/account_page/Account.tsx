import { useAuth } from "../../context/useAuth";
import { Link } from "react-router";
import AccountShell from "./components/AccountShell";

const Account = () => {
    const {user, loading, error, refreshAuth} = useAuth()
    if (loading){
        return <div className="grid w-full place-items-center text-sm font-bold text-slate-700" role="status">Loading your account…</div>
    }
    if (error){
        return <div className="grid w-full place-items-center"><div role="alert" className="rounded-2xl border-2 border-slate-900 bg-amber-50 p-6 text-center shadow-[5px_5px_0_#0f172a]"><p>{error}</p><button className="mt-4 font-black text-blue-600 hover:underline" onClick={() => void refreshAuth()}>Try again</button></div></div>
    }
    if (!user){
        return <AccountShell eyebrow="Account" title="You’re signed out" description="Log in to see your profile and reconnect with your Habitmon." footer={<Link className="font-black text-blue-600 hover:underline" to="/register">Create a new account</Link>}><Link className="block w-full rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-3.5 text-center font-black text-white shadow-[4px_4px_0_#60a5fa]" to="/login">Go to login</Link></AccountShell>
    }
    const initials = `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase()
    return (
        <AccountShell eyebrow="Your profile" title={`Hi, ${user.first_name}`} description="Your account keeps your tasks, progress, and Habitmon together." footer={<>Signed in as <span className="font-bold text-slate-900">@{user.username}</span></>}>
            <div className="flex flex-col items-center gap-5 rounded-3xl border-2 border-slate-900/10 bg-white/70 p-5 sm:flex-row">
                <div className="grid size-20 shrink-0 place-items-center rounded-3xl border-2 border-slate-900 bg-cyan-300 text-2xl font-black text-slate-900 shadow-[4px_4px_0_#0f172a]">{initials}</div>
                <dl className="min-w-0 flex-1 space-y-3 text-sm">
                    <div><dt className="font-bold text-slate-500">Name</dt><dd className="truncate text-base font-black text-slate-900">{user.first_name} {user.last_name}</dd></div>
                    <div><dt className="font-bold text-slate-500">Email</dt><dd className="truncate font-semibold text-slate-800">{user.email}</dd></div>
                </dl>
            </div>
            <Link className="mt-6 block w-full rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-3.5 text-center font-black text-white shadow-[4px_4px_0_#60a5fa] transition-transform hover:-translate-y-0.5" to="/">Return to your Habitmon</Link>
        </AccountShell>
    );
};

export default Account;
