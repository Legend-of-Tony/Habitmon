import React from 'react'

const Navbar = () => {
    return (
        <nav className='w-auto h-auto '>
                <ul className='flex flex-row gap-4 border-2 rounded-3xl p-3'>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
        </nav>
    )
}
export default Navbar
