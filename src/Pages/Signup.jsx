import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu"
import { useNavigate , Link} from 'react-router-dom'
import axios from 'axios'
import Alert from '@mui/material/Alert'   // ✅ add

const Signup = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showconfirmPassword, setShowConfirmPassword] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // ✅ alert states
    const [status, setStatus] = useState(false)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError(true)
            setMessage("Passwords do not match")
            setTimeout(() => setError(false), 3000)
            return
        }

        try {
            const res = await axios.post(
                'https://queuemaster-server-1.onrender.com/queuemaster/signup',
                {
                    name,
                    email,
                    ph_No: phoneNo,
                    password
                }
            )

            localStorage.setItem('qmToken', res.data.token)

            // ✅ success alert
            setStatus(true)
            setMessage("Signup successful 🎉 Redirecting to login...")

            // redirect to login after short delay
            setTimeout(() => {
                setStatus(false)
                navigate('/login')
            }, 2000)

        } catch (err) {
            setError(true)
            setMessage(err.response?.data?.message || "Signup failed")
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
                <h1 className='text-4xl font-bold font-serif mb-10'>Signup</h1>
                <div className='border-2 shadow-2xl shadow-gray-600 rounded-2xl flex flex-row h-150'>
                    <div className='basis-120 flex flex-col justify-center items-center'>
                        <h1 className=' text-1xl font-bold'>Hello,friend!</h1>

                        <form
                            className='flex flex-col justify-center items-center p-5 gap-4'
                            onSubmit={handleSubmit}
                        >
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full p-3 border rounded-md"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full p-3 border rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="w-full p-3 border rounded-md"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
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
                                    className='h-10 w-10 px-2 border bg-violet-300 rounded-2xl hover:bg-violet-500'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <LuEyeClosed /> : <LuEye />}
                                </button>
                            </div>

                            <div className='flex w-full gap-2'>
                                <input
                                    type={showconfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="w-90 p-3 border rounded-md"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type='button'
                                    className='h-10 w-10 px-2 border bg-violet-300 rounded-2xl hover:bg-violet-500'
                                    onClick={() => setShowConfirmPassword(!showconfirmPassword)}
                                >
                                    {showconfirmPassword ? <LuEyeClosed /> : <LuEye />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className='flex flex-row justify-center items-center gap-2 mt-2'>
                            <p>Already have an account?</p>
                            <Link to="/login">
                                <p className='text-blue-800'>Login</p>
                            </Link>
                        </div>
                    </div>

                    <div className='basis-150 rounded-r-2xl bg-linear-to-br from-purple-800 to-blue-900 text-white flex flex-col justify-center'>
                        <h3 className='text-1xl font-bold px-10'>Glad to have you on board!</h3>
                        <p className='font-light px-10'>
                            By signing up, you're taking the first step towards transforming your queue management experience with QueueMaster. Let's get started!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
