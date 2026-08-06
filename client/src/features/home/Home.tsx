import {useState, useCallback} from 'react'
import CanvasInit from "../../threeJS/CanvasInit.tsx";
import TaskList from "./components/TaskList.tsx"
import Timer from "./components/Timer.tsx"
import type { Task } from './types/taskTypes.ts';

import { API_URL } from '../../config.ts';

type ApiResponse<T> = {
    status: string
    message?: string
    data: T
}

type UpdatedTask = {
    title: string
    completed: boolean
    sessions: number
    progress: number
    updated_at: string
}

const Home = () => {

    const [tasks, setTasks] = useState<Task[]>([]) 

    const activeTask = tasks[0] ?? null

    const recordPomodoro = useCallback(async (task: Task) => {
        if (task.progress >= task.sessions) {
            return
        }

        const nextProgress = task.progress + 1
        const completed = nextProgress >= task.sessions

        const response = await fetch(`${API_URL}/tasks/${task.id}`,
            {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    progress: nextProgress, completed,
                }),
            },
        )

        if (!response.ok) {
            const message = await response.text()
            throw new Error(message || "Failed to update task progress",)
        }

        const result: ApiResponse<UpdatedTask> = await response.json()
        setTasks((currentTasks) => currentTasks.map((currentTask) =>
            currentTask.id === task.id ? {...currentTask, ...result.data,} : currentTask,
            ),
        )
    },[])
    return (
        <div className="grid grid-cols-12 grid-rows-12 w-full h-full">

            <section className='col-start-5 col-span-8 row-start-2 row-span-full rounded-2xl overflow-hidden inset-shadow-sm'>
                <CanvasInit/>
            </section>

            <section className='col-start-1 col-span-3 row-start-3 row-span-5 flex flex-col gap-4'>
                <Timer task={activeTask} onPomodoroComplete={recordPomodoro} key={activeTask?.id ?? "no-task"}/>
                <TaskList tasks={tasks} setTasks={setTasks}/>
            </section>

        </div>
    )
}
export default Home
