import { useAuth } from "../../context/useAuth";
import {Link} from "react-router";

const Navbar = () => {
    const {user, loading} = useAuth()
    return (
        <nav className="flex w-full items-center justify-between" aria-label="Main navigation">
                <Link to="/" className="group flex items-center gap-3" aria-label="Habitmon home">
                    <span className="grid size-10 place-items-center rounded-2xl border-2 border-slate-900 bg-amber-50 shadow-[3px_3px_0_#0f172a] transition-transform group-hover:-translate-y-0.5" aria-hidden="true">
                        <span className="size-5 rounded-[45%_55%_48%_52%] bg-cyan-400" />
                    </span>
                    <span className="text-xl font-black tracking-tight text-slate-900">Habitmon</span>
                </Link>
                <ul className="flex items-center rounded-full border-2 border-slate-900 bg-white/30 p-1 text-sm font-bold text-slate-900 shadow-[2px_2px_0_#0f172a]">
                    <li>
                        {loading ? (
                            <span className="block px-4 py-2 text-slate-700">Loading…</span>
                        ) : user ? (
                            <Link className="block rounded-full px-4 py-2 transition-colors hover:bg-amber-50" to="/account">Account</Link>
                        ) : (
                            <Link className="block rounded-full bg-amber-50 px-4 py-2 transition-colors hover:bg-white" to="/login">Log in</Link>
                        )}
                    </li>
                </ul>
        </nav>
    )
}
export default Navbar
