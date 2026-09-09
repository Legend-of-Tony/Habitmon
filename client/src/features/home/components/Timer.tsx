import {useState,useEffect} from 'react'
import type { Task } from "../types/taskTypes";

type TimerProps = {
    task: Task | null
    onPomodoroComplete: (task: Task) => Promise<void>
    
}

const Timer = ({task, onPomodoroComplete}: TimerProps) => {
    type Mode = 'pomodoro' | 'shortBreak' |'longBreak'

    const [mode, setMode] = useState<Mode>('pomodoro')
    const [secondsLeft, setSecondsLeft] = useState(25 * 60)
    const [isRunning, setIsrunning] = useState(false)
    const [pomodoroCount, setPomodoroCount] = useState(0)
    const [durations] = useState<Record<Mode, number>>({
        pomodoro: 25*60, shortBreak: 5*60, longBreak: 15*60,
    })

    const [progressError, setProgressError] = useState("")

    useEffect(() => {
        if (!isRunning) return
        const id = setInterval(() => setSecondsLeft(s => s -1), 1000)
        return () => clearInterval(id)
    },[isRunning])

    useEffect(()=>{
        if (secondsLeft > 0) return
        setIsrunning(false)

        if (mode === 'pomodoro') {
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
        } else {
            if (mode === 'longBreak') setPomodoroCount(0)
            setMode('pomodoro')
            setSecondsLeft(durations.pomodoro)
        }
    }, [secondsLeft, mode, pomodoroCount, durations, task, onPomodoroComplete])

    const formatTime = (totalSeconds: number) => {
            let minutes = Math.floor(totalSeconds / 60)
            let seconds = totalSeconds % 60
            return `${minutes}:${String(seconds).padStart(2,'0')}`
    }
  return (
    <section className='flex flex-col gap-6 rounded-2xl bg-[#3999FF]/50 p-4'>
        <ul className='flex text-xs gap-4 justify-between items-center '>
            <li className={`${mode === 'pomodoro' ? 'bg-amber-50/30 p-2 rounded-xl' : ''}`}>
                POMODORO
            </li>
            <li className={`${mode === 'shortBreak' ? 'bg-amber-50/30 p-2 rounded-xl' : ''}`}>
                SHORT BREAK
            </li>
            <li className={`${mode === 'longBreak' ? 'bg-amber-50/30 p-2 rounded-xl' : ''}`}>
                LONG BREAK
            </li>
        </ul>
        <h1 className='flex justify-center text-8xl'>{formatTime(secondsLeft)}</h1>
        <div className="flex  justify-between items-center p-2 ">
            <h3 className="text-3xl">{task ? task.title : "No active task"}</h3>
            <h2 className="text-3xl">{task ? `${task.progress}/${task.sessions}` : "0/0"}</h2>
        </div>
        {progressError && (
            <p className="text-red-600">
                {progressError}
            </p>
        )}
        <button onClick={() => setIsrunning(prev => !prev)} className='flex-1 justify-center text-4xl bg-amber-50 p-2 rounded-2xl items-center shadow-lg h-full w-full'>
            {isRunning ? "PAUSE" : "START"}
        </button>



         

{/* 
        <button className="flex justify justify-between items-center">
            <img src={SkipBack} className="w-1/2 h-1/2 bg-amber-50 p-1 rounded-4xl"/>
            <img src={PlayButton} className="w-1/2 h-1/2 bg-amber-50 p-1 rounded-4xl"/>
            <img src={SkipForward} className="w-1/2 h-1/2 bg-amber-50 p-1 rounded-4xl"/>
        </button>
*/}
    </section>
  )
}

export default Timer