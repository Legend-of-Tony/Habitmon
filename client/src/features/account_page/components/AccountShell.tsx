import type { ReactNode } from 'react'
import { Link } from 'react-router'

type AccountShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

const AccountShell = ({ eyebrow, title, description, children, footer }: AccountShellProps) => (
  <section className="relative flex min-h-0 w-full items-start justify-center overflow-y-auto py-8 sm:py-12">
    <div className="pointer-events-none absolute left-[8%] top-[14%] size-24 rounded-full bg-cyan-300/45 blur-2xl" />
    <div className="pointer-events-none absolute bottom-[12%] right-[10%] size-36 rounded-full bg-violet-300/40 blur-3xl" />

    <div className="relative my-auto w-full max-w-lg rounded-[2rem] border-2 border-slate-900 bg-amber-50 p-6 shadow-[8px_8px_0_#0f172a] sm:p-9">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-slate-950">
        <span aria-hidden="true">←</span> Back home
      </Link>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
      <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
      <div className="mt-8">{children}</div>
      <div className="mt-7 border-t-2 border-slate-900/10 pt-6 text-center text-sm text-slate-600">{footer}</div>
    </div>
  </section>
)

export const accountInputClass = 'mt-2 w-full rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 text-slate-950 outline-none transition-shadow placeholder:text-slate-400 focus:shadow-[3px_3px_0_#0f172a]'
export const accountButtonClass = 'mt-2 w-full rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-3.5 font-black text-white shadow-[4px_4px_0_#60a5fa] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60'

export default AccountShell
