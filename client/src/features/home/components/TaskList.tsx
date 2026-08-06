import OptionsMenu from "../../../assets/options-svgrepo-com.svg"
import PlusIcon from "../../../assets/plus-circle-svgrepo-com.svg"
import BurgerMenu from "../../../assets/hamburger-menu-svgrepo-com.svg"
import { useCallback, useEffect, useState} from 'react'
import type {FormEvent, Dispatch, DragEvent, SetStateAction} from "react"
import { API_URL } from "../../../config"
import type {Task} from "../types/taskTypes"


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
            const response = await fetch(`${API_URL}/tasks/`, {
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
    <section className=' rounded-2xl bg-[#3999FF]/50 flex flex-col'>
        <div className='flex justify-between p-4 gap-6'>
            <h2>TASKS</h2>
            <img src={OptionsMenu} alt="Options Menu" className='w-4 h-4'></img>
        </div>
        <hr className='border-3 w-5/6 rounded-xl border-amber-50 mx-auto'/>
        <ul className='p-4 flex flex-col gap-2'>
            {loading && <li>Loading tasks...</li>}

                {!loading && tasks.length === 0 && (
                    <li>No tasks yet</li>
            )}

            {tasks.map((task) => (
                <li key={task.id} className={`flex justify-between items-center bg-amber-50 rounded-2xl p-2 shadow-lg ${
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

                    <span >
                        {task.title}
                    </span>
                    <span>
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
                    <form onSubmit={handleCreateTask} className="flex flex-col gap-2">
                        <label>
                            Task Title
                            <input type="text" value={title} onChange={(event) => { setTitle(event.target.value)}} required/>
                        </label>

                        <label> 
                            Sessions
                            <input type="number" min={0} value={sessions} onChange={(event) => { setSessions(Number(event.target.value))}} required/>
                        </label>

                        <div className="flex gap-2">
                            <button type="submit" disabled={submitting}>
                                {submitting ? "saving..." : "Save"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </li>
            )}
            <li>
                <button type="button" onClick={() => setShowForm(true)} className="w-full flex justify-center items-center gap-4 bg-amber-50/30 p-2 rounded-2xl shadow-lg">
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