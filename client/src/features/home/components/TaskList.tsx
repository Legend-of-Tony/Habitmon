import OptionsMenu from "../../../assets/options-svgrepo-com.svg"
import PlusIcon from "../../../assets/plus-circle-svgrepo-com.svg"
import BurgerMenu from "../../../assets/hamburger-menu-svgrepo-com.svg"

const TaskList = () => {
  return (
    <section className=' rounded-2xl bg-[#3999FF]/50 flex flex-col'>
        <div className='flex justify-between p-4 gap-6'>
            <h2>TASKS</h2>
            <img src={OptionsMenu} alt="Options Menu" className='w-4 h-4'></img>
        </div>
        <hr className='border-3 w-5/6 rounded-xl border-amber-50 mx-auto'/>
        <ul className='p-4 flex flex-col gap-2'>
            <li className='flex justify-between items-center bg-amber-50 rounded-2xl p-2 shadow-lg'>
                <img src={BurgerMenu} alt="menu" className='w-4 h-4'></img>
                <h3>Task</h3>
                <h3>1/4</h3>
                <img src={OptionsMenu} alt="Options Menu" className='w-4 h-4'></img>
            </li>
            <li className='flex justify-center items-center gap-4 bg-amber-50/30 p-2 rounded-2xl shadow-lg'>
                <img src={PlusIcon} alt="plus" className='w-4 h-4'></img>
                <h3>
                    ADD NEW TASK
                </h3>
            </li>
        </ul>
    </section>
  )
}

export default TaskList