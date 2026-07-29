import React from 'react'
import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className='w-full h-auto flex justify-between'>
                <Link to="/">
                    <img src="logo.png"/>
                </Link>
                <ul className='flex gap-4 border-2 rounded-3xl p-2'>
                    <li><a href="/timer">Timer</a></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/tasks">Tasks</a></li>
                </ul>
        </nav>
    )
}
export default Navbar
