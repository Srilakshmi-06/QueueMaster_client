import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className='font-mono flex justify-around bg-gray-800 text-white w-full'>
                <div className='py-5'>
                    <h1>QueueMaster</h1>
                </div>
                <ul className='py-5 justify-center flex gap-x-10'>
                    <li className='hover:underline'>Rules and Regulation</li>
                    <li className='hover:underline'>Terms of Service</li>
                    <li className='hover:underline'>Help</li>
                </ul>
            </footer>
        </div>
    )
}

export default Footer