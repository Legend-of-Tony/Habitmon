import PauseButton from "../../../assets/pause-fill-svgrepo-com.svg"
import PlayButton from "../../../assets/play-1003-svgrepo-com.svg"
import SkipForward from "../../../assets/skip-next-svgrepo-com.svg"
import SkipBack from "../../../assets/skip-previous-svgrepo-com.svg"
import {Link} from "react-router";

const Timer = () => {
  return (
    <section className='flex flex-col gap-6 rounded-2xl bg-[#3999FF]/50 p-4'>
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
        <div className="flex  justify-between items-center p-2 ">
            <h3 className="text-3xl">Sessions</h3>
            <h2 className="text-3xl">1/4</h2>
        </div>

        <section className="flex gap-2 justify-center items-center h-auto w-full">
            <button className='flex-1 justify-center text-4xl bg-amber-50 p-2 rounded-2xl items-center shadow-lg h-full w-full'>START</button>


        </section>

         

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