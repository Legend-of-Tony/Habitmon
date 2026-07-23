import React from 'react'

const Navbar = () => {
    return (
        <nav className='w-auto h-auto '>
                <ul className='flex flex-row gap-4 border-2 rounded-3xl p-3'>
                    <li><a href="/timer">Timer</a></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/tasks">Tasks</a></li>
                </ul>
        </nav>
    )
}
export default Navbar
