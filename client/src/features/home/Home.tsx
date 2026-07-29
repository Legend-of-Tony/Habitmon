import React from 'react'
import CanvasInit from "../../threeJS/CanvasInit.tsx";
import OptionsMenu from "../../assets/options-svgrepo-com.svg"

const Home = () => {
    return (
        <div className="grid grid-cols-12 grid-rows-12 gap-2 w-full h-full">
            <div className='col-start-5 col-span-8 row-start-2 row-span-full rounded-2xl overflow-hidden inset-shadow-sm'>
                <CanvasInit/>
            </div>
            <div className='col-start-1 col-span-3 row-start-3 row-span-5 rounded-2xl bg-[#3999FF]/50'>
                <h1>Welcome to the Home Page</h1>
            </div>
            <div className='col-start-1 col-span-3 row-start-9 row-span-2 rounded-2xl bg-[#3999FF]/50 flex flex-col'>
                <div>
                    <h3>TASKS</h3>
                    <img src={OptionsMenu} alt="Options Menu" className='w-4 h-4'></img>
                </div>
            </div>
        
        </div>
    )
}
export default Home
