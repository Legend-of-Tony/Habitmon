import OptionsMenu from "../../../assets/options-svgrepo-com.svg"
import PlusIcon from "../../../assets/plus-circle-svgrepo-com.svg"
import BurgerMenu from "../../../assets/hamburger-menu-svgrepo-com.svg"
import { useCallback, useEffect, useState} from 'react'
import type {FormEvent, Dispatch, DragEvent, SetStateAction} from "react"
import { API_URL } from "../../../config"
import type {Task} from "../types/taskTypes"
import { fetchWithTransientRetry } from "../../../api/fetchWithTransientRetry"


type ApiResponse<T> = {
    status: string
    message?: string
    data: T
}

type TaskListProps = {
    tasks: Task[]
    setTasks: Dispatch<SetStateAction<Task[]>>
}

const TaskList = ( {tasks, setTasks}: TaskListProps) => {


    const [title, setTitle] = useState("")
    const [sessions, setSessions] = useState(1)

    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)


    const loadTasks = useCallback(async () => {
        setLoading(true)
        setError("")

        try {
            const response = await fetchWithTransientRetry(`${API_URL}/tasks/`, {
                method: "GET",
                credentials: "include",
            })

            if (!response.ok){
                const message = await response.text()
                throw new Error(message || "Failed to load tasks")
            }

            const result: ApiResponse<Task[]> = await response.json()
            setTasks(result.data)
        } catch (error) {
            const message = 
            error instanceof Error ? error.message : "Failed to load tasks"

            setError(message)
            setTasks([])
        } finally {
            setLoading(false)
        }
    }, [setTasks])

    useEffect(() => {
        void loadTasks()
    }, [loadTasks])

    const handleCreateTask = async ( 
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault()

        if (title.trim() === "") {
            setError("Title cannot be blank")
            return
        }

        setSubmitting(true)
        setError("")

        try {
            const response = await fetch(`${API_URL}/tasks/`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: title.trim(), sessions,
                }),
            })

            if (!response.ok){
                const message = await response.text()
                throw new Error(message || "Failed to create task")
            }

            setTitle("")
            setSessions(1)
            setShowForm(false)

            await loadTasks()
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create task" 

            setError(message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDragStart = (
        event: DragEvent<HTMLButtonElement>,
        taskId: number,
    ) => {
        setDraggedTaskId(taskId)

        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", String(taskId))
    }

    const handleDrop = (targetTaskId: number) => {
        if (
            draggedTaskId === null || 
            draggedTaskId === targetTaskId
        ) {
            return
        }

        setTasks((currentTasks) => {
            const draggedIndex = currentTasks.findIndex(
                (task) => task.id === draggedTaskId,
            )

            const targetIndex = currentTasks.findIndex(
                (task) => task.id === targetTaskId,
            )

            if (draggedIndex === -1 || targetIndex === -1){
                return currentTasks
            }

            const reorderedTasks = [...currentTasks]
            const [draggedTask] = reorderedTasks.splice(draggedIndex, 1)

            reorderedTasks.splice(targetIndex, 0, draggedTask)
            return reorderedTasks
        })
        setDraggedTaskId(null)
    }
  return (
    <section className="flex min-w-0 flex-col rounded-3xl border-2 border-slate-900 bg-[#3999FF]/55 shadow-[5px_5px_0_#0f172a]">
        <div className="flex items-center justify-between gap-6 p-4">
            <h2 className="font-black tracking-wide text-slate-900">TASKS</h2>
            <img src={OptionsMenu} alt="Options Menu" className='w-4 h-4'></img>
        </div>
        <hr className='border-3 w-5/6 rounded-xl border-amber-50 mx-auto'/>
        <ul className="flex min-w-0 flex-col gap-2 p-4">
            {loading && <li>Loading tasks...</li>}

                {!loading && tasks.length === 0 && (
                    <li>No tasks yet</li>
            )}

            {tasks.map((task) => (
                <li key={task.id} className={`flex min-w-0 items-center justify-between gap-2 rounded-2xl border-2 border-slate-900/10 bg-amber-50 p-2 shadow-sm ${
                draggedTaskId === task.id ? "opacity-50" : ""}`} 
                    onDragOver={(event) => event.preventDefault()} onDrop={() => handleDrop(task.id)}>

                    

                    <button 
                        type="button" 
                        draggable 
                        onDragStart={(event) => {handleDragStart(event, task.id)}} 
                        onDragEnd={() => setDraggedTaskId(null)}
                        aria-label={`Reorder ${task.title}`}
                        className="cursor-grab active:cursor-grabbing">
                            <img src={BurgerMenu} alt="" className="w-4 h-4" draggable={false}/>
                    </button>

                    <span className="min-w-0 flex-1 truncate font-semibold">
                        {task.title}
                    </span>
                    <span className="shrink-0 text-sm font-bold">
                        {task.progress}/{task.sessions}
                    </span>
                    <img src={OptionsMenu} alt="Task options" className="w-4 h-4"/>
                </li>
            ))}
            {/* <li className='flex justify-between items-center bg-amber-50 rounded-2xl p-2 shadow-lg'>
                <img src={BurgerMenu} alt="menu" className='w-4 h-4'></img>
                <h3>Task</h3>
                <h3>1/4</h3>
                <img src={OptionsMenu} alt="Options Menu" className='w-4 h-4'></img>
            </li> */} 
            {showForm && (
                <li className="bg-amber-50 rounded-2xl p-3 shadow-lg">
                    <form onSubmit={handleCreateTask} className="flex flex-col gap-3">
                        <label className="text-sm font-bold">
                            Task Title
                            <input className="mt-1 w-full rounded-xl border-2 border-slate-900 px-3 py-2 outline-none focus:shadow-[2px_2px_0_#0f172a]" type="text" value={title} onChange={(event) => { setTitle(event.target.value)}} required/>
                        </label>

                        <label className="text-sm font-bold">
                            Sessions
                            <input className="mt-1 w-full rounded-xl border-2 border-slate-900 px-3 py-2 outline-none focus:shadow-[2px_2px_0_#0f172a]" type="number" min={1} value={sessions} onChange={(event) => { setSessions(Number(event.target.value))}} required/>
                        </label>

                        <div className="flex gap-2">
                            <button className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white disabled:opacity-60" type="submit" disabled={submitting}>
                                {submitting ? "saving..." : "Save"}
                            </button>
                            <button className="rounded-xl px-4 py-2 font-bold hover:bg-slate-900/10" type="button" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </li>
            )}
            <li>
                <button type="button" onClick={() => setShowForm(true)} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-50/35 p-2 font-bold text-slate-900 transition-colors hover:bg-amber-50/60">
                    <img src={PlusIcon} alt="" className="w-4 h-4"/>
                    <span>ADD NEW TASK</span>
                </button>
            </li>
        </ul>
        {error && (
            <p className="px-4 pb-4 text-red-600">
                {error}
            </p>
        )}
    </section>
  )
}

export default TaskList
