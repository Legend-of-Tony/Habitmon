import {useState,useEffect, useCallback} from 'react'
import type { Task } from "../types/taskTypes";
import SkipForward from "../../../assets/skip-next-svgrepo-com.svg"

type TimerProps = {
    task: Task | null
    onPomodoroComplete: (task: Task) => Promise<void>
    
}

const Timer = ({task, onPomodoroComplete}: TimerProps) => {
    type Mode = 'pomodoro' | 'shortBreak' |'longBreak'

    const [mode, setMode] = useState<Mode>('pomodoro')
    const [secondsLeft, setSecondsLeft] = useState(25 * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [pomodoroCount, setPomodoroCount] = useState(0)
    const [durations] = useState<Record<Mode, number>>({
        pomodoro: 25*60, shortBreak: 5*60, longBreak: 15*60,
    })

    const [progressError, setProgressError] = useState("")

    const completePomodoro = useCallback(() => {
        setIsRunning(false)

        if (task) {
            void onPomodoroComplete(task).then(() => {
                setProgressError("")
            }).catch((error: unknown) => {
                const message = error instanceof Error ? error.message : "Failed to record pomodoro"
                setProgressError(message)
            })
        }

        const next = pomodoroCount + 1
        setPomodoroCount(next)
        const nextMode: Mode = next % 4 === 0 ? 'longBreak' : 'shortBreak'
        setMode(nextMode)
        setSecondsLeft(durations[nextMode])
    }, [durations, onPomodoroComplete, pomodoroCount, task])

    useEffect(() => {
        if (!isRunning) return
        const id = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
        return () => clearInterval(id)
    },[isRunning])

    useEffect(()=>{
        if (secondsLeft > 0) return

        if (mode === 'pomodoro') {
            completePomodoro()
        } else {
            setIsRunning(false)
            if (mode === 'longBreak') setPomodoroCount(0)
            setMode('pomodoro')
            setSecondsLeft(durations.pomodoro)
        }
    }, [secondsLeft, mode, durations, completePomodoro])

    const formatTime = (totalSeconds: number) => {
            const minutes = Math.floor(totalSeconds / 60)
            const seconds = totalSeconds % 60
            return `${minutes}:${String(seconds).padStart(2,'0')}`
    }

    const handleRestart = () => {
        setIsRunning(false)
        setSecondsLeft(durations[mode])
        setProgressError("")
    }

    const handleSkip = () => {
        setIsRunning(false)
        setProgressError("")

        if (mode === 'pomodoro') {
            completePomodoro()
            return
        }

        if (mode === 'longBreak') setPomodoroCount(0)
        setMode('pomodoro')
        setSecondsLeft(durations.pomodoro)
    }

  return (
    <section className="flex flex-col gap-5 rounded-3xl border-2 border-slate-900 bg-[#3999FF]/55 p-4 shadow-[5px_5px_0_#0f172a] sm:p-5">
        <ul className="grid grid-cols-3 gap-1 rounded-2xl bg-blue-300/30 p-1 text-center text-[0.65rem] font-black tracking-wide text-slate-800 sm:text-xs">
            <li className={`rounded-xl px-1 py-2 ${mode === 'pomodoro' ? 'bg-amber-50 shadow-sm' : ''}`}>
                POMODORO
            </li>
            <li className={`rounded-xl px-1 py-2 ${mode === 'shortBreak' ? 'bg-amber-50 shadow-sm' : ''}`}>
                SHORT BREAK
            </li>
            <li className={`rounded-xl px-1 py-2 ${mode === 'longBreak' ? 'bg-amber-50 shadow-sm' : ''}`}>
                LONG BREAK
            </li>
        </ul>
        <p className="text-center text-6xl font-black tabular-nums tracking-tight text-slate-950 sm:text-7xl lg:text-6xl xl:text-7xl" aria-live="off">{formatTime(secondsLeft)}</p>
        <div className="flex min-w-0 items-center justify-between gap-4 px-1">
            <h2 className="truncate text-xl font-bold text-slate-900">{task ? task.title : "No active task"}</h2>
            <p className="shrink-0 rounded-full bg-white/35 px-3 py-1 text-sm font-black text-slate-900">{task ? `${task.progress}/${task.sessions}` : "0/0"}</p>
        </div>
        {progressError && (
            <p role="alert" className="rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                {progressError}
            </p>
        )}
        <div className="grid grid-cols-[3.25rem_1fr_3.25rem] gap-3">
            <button type="button" onClick={handleRestart} aria-label="Restart current timer" title="Restart" className="grid aspect-square place-items-center rounded-2xl border-2 border-slate-900 bg-amber-50 text-2xl font-black text-slate-900 shadow-[3px_3px_0_#0f172a] transition-transform hover:-translate-y-0.5">
                <span aria-hidden="true">↺</span>
            </button>
            <button type="button" onClick={() => setIsRunning(prev => !prev)} className="rounded-2xl border-2 border-slate-900 bg-amber-50 px-4 py-2 text-xl font-black text-slate-900 shadow-[3px_3px_0_#0f172a] transition-transform hover:-translate-y-0.5">
                {isRunning ? "PAUSE" : "START"}
            </button>
            <button type="button" onClick={handleSkip} aria-label="Skip current timer" title="Skip" className="grid aspect-square place-items-center rounded-2xl border-2 border-slate-900 bg-amber-50 shadow-[3px_3px_0_#0f172a] transition-transform hover:-translate-y-0.5">
                <img src={SkipForward} alt="" className="size-5" />
            </button>
        </div>
    </section>
  )
}

export default Timer
