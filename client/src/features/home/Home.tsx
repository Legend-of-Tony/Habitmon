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
        <div className="flex w-full flex-col gap-5 pb-8 pt-5 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:grid-rows-12 lg:gap-4 lg:pb-0 lg:pt-0">

            <section aria-label="Your Habitmon" className="h-[42svh] min-h-72 w-full overflow-hidden rounded-3xl border-2 border-slate-900 bg-blue-300/30 shadow-[5px_5px_0_#0f172a] lg:col-start-5 lg:col-span-8 lg:row-start-2 lg:row-span-11 lg:h-auto lg:min-h-0">
                <CanvasInit/>
            </section>

            <section aria-label="Focus controls" className="flex min-w-0 flex-col gap-5 lg:col-start-1 lg:col-span-3 lg:row-start-2 lg:row-span-11 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
                <Timer task={activeTask} onPomodoroComplete={recordPomodoro} key={activeTask?.id ?? "no-task"}/>
                <TaskList tasks={tasks} setTasks={setTasks}/>
            </section>

        </div>
    )
}
export default Home
