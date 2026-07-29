import React from 'react'
import CanvasInit from "../../threeJS/CanvasInit.tsx";
import TaskList from "./components/TaskList.tsx"
import Timer from "./components/Timer.tsx"

const Home = () => {
    return (
        <div className="grid grid-cols-12 grid-rows-12 w-full h-full">

            <section className='col-start-5 col-span-8 row-start-2 row-span-full rounded-2xl overflow-hidden inset-shadow-sm'>
                <CanvasInit/>
            </section>

            <section className='col-start-1 col-span-3 row-start-3 row-span-5 flex flex-col gap-4'>
                <Timer/>
                <TaskList/>
            </section>

            {/*<section className='col-start-1 col-span-3 row-start-3 row-span-5 rounded-2xl bg-[#3999FF]/50 p-4 flex flex-col justify-between'>
                <ul className='flex text-xs gap-4 justify-between'>
                    <li>
                        POMODORO
                    </li>
                    <li>
                        SHORT BREAK
                    </li>
                    <li>
                        LONG BREAK
                    </li>
                </ul>
                <h1 className='flex justify-center text-8xl'>25:00</h1>
                <button className='flex justify-center text-7xl bg-amber-50 p-4 rounded-3xl items-center'>START</button>
            </section>
            */}
{/* 
            <section className='col-start-1 col-span-3 row-start-9 row-span-2 rounded-2xl bg-[#3999FF]/50 flex flex-col'>
                <div className='flex justify-between p-4 gap-6'>
                    <h2>TASKS</h2>
                    <img src={OptionsMenu} alt="Options Menu" className='w-4 h-4'></img>
                </div>
                <hr className='border-3 w-5/6 rounded-xl border-amber-50 mx-auto'/>
                <ul className='p-4 flex flex-col gap-2'>
                    <li className='flex justify-between items-center bg-amber-50 rounded-2xl p-2'>
                        <img src={BurgerMenu} alt="menu" className='w-4 h-4'></img>
                        <h3>Task</h3>
                        <h3>1/4</h3>
                        <img src={OptionsMenu} alt="Options Menu" className='w-4 h-4'></img>
                    </li>
                    <li className='flex justify-center items-center gap-4 bg-amber-50/30 p-2 rounded-2xl'>
                        <img src={PlusIcon} alt="plus" className='w-4 h-4'></img>
                        <h3>
                            ADD NEW TASK
                        </h3>
                    </li>
                </ul>
            </section>
*/}
        </div>
    )
}
export default Home
