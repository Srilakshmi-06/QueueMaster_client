import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';   // ✅ add

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    // ✅ alert states
    const [status, setStatus] = useState(false)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(
                'http://localhost:5000/queuemaster/login',
                { email, password }
            )

            localStorage.setItem('qmToken', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))

            // ✅ success alert
            setStatus(true)
            setMessage("Login successful 🎉")

            // redirect after short delay
            setTimeout(() => {
                setStatus(false)
                navigate('/dashboard')
            }, 1500)

        } catch (err) {
            setError(true)
            setMessage(err.response?.data?.message || "Login failed")
            setTimeout(() => setError(false), 3000)
        }
    }

    return (
        <div>
            {/* ✅ Success Alert */}
            {status && (
                <div className="fixed top-5 right-5 z-50">
                    <Alert severity="success">
                        {message}
                    </Alert>
                </div>
            )}

            {/* ❌ Error Alert */}
            {error && (
                <div className="fixed top-5 right-5 z-50">
                    <Alert severity="error">
                        {message}
                    </Alert>
                </div>
            )}

            <div className='flex flex-col justify-center items-center m-10'>
                <h1 className='text-4xl font-bold font-serif mb-10'>Login</h1>
                <div className='border-2 shadow-2xl shadow-gray-600 rounded-2xl flex flex-row h-150'>
                    <div className='basis-120 flex flex-col justify-center items-center'>
                        <h1 className=' mt-10 text-1xl font-bold'>Hello,friend!</h1>

                        <form
                            className='flex flex-col justify-center items-center p-5 gap-4'
                            onSubmit={handleLogin}
                        >
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full p-3 border rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className='flex w-full gap-2'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-90 p-3 border rounded-md"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type='button'
                                    className='h-10 w-10 px-2 gap-1 border bg-violet-300 rounded-2xl'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <LuEyeClosed /> : <LuEye />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-100 bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800"
                            >
                                Login
                            </button>
                        </form>

                        <div className='flex flex-row justify-center items-center gap-2 mt-2'>
                            <p>Don't have an account?</p>
                            <button 
                                onClick={() => navigate('/signup')}
                                className='text-blue-800 hover:underline'
                            >
                                Create an account
                            </button>
                        </div>
                    </div>

                    <div className='basis-150 rounded-r-2xl bg-linear-to-br from-purple-800 to-blue-900 text-white flex flex-col justify-center'>
                        <h3 className='text-1xl font-bold px-10'>Welcome Back!</h3>
                        <p className='font-light px-10'>
                            Log in to continue managing your queues effortlessly with QueueMaster.
                            We're excited to help you streamline your workflow—let’s get you back in!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
