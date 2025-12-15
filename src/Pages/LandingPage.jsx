import React from 'react'
import logo from '../assets/logo.png';
import { MdEmail } from "react-icons/md";
import { GoClockFill } from "react-icons/go";
import { FaPhoneVolume, FaLocationDot } from "react-icons/fa6";
import GradientText from './GradientText/GradientText';
import { Link } from 'react-router-dom';
import img1 from '../assets/img1.png';
import Contact from './Contact.jsx';
import Prism from './Prism/Prism.jsx';


const LandingPage = () => {
    return (
        <div>
            <header className="bg-linear-to-br from-purple-800 to-blue-900 text-white font-serif fixed w-full top-0 z-10 shadow-md rounded-b-2xl">
                <div className="max-w-7xl mx-auto flex items-center p-4 justify-between">
                    <div className="flex items-center space-x-3">
                        <img src={logo} alt="QueueMaster Logo" className="h-15 w-15" />
                        <h1 className="text-1xl font-serif italic font-bold">QueueMaster</h1>
                    </div>
                    <nav>
                        <ul class="flex space-x-6">
                            <li><a href="#home" class="hover:text-gray-300">Home</a></li>
                            <li><a href="#about" class="hover:text-gray-300">About</a></li>
                            <li><a href="#contact" class="hover:text-gray-300">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <section id="home" class="flex flex-col items-center justify-center text-center h-screen ">
                <div className="absolute inset-0 -z-10">
                    <Prism
                        animationType="rotate"
                        timeScale={0.5}
                        height={3.5}
                        baseWidth={5.5}
                        scale={3.6}
                        hueShift={0}
                        colorFrequency={1}
                        noise={0.5}
                        glow={1}
                    />
                </div>
                <GradientText
                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                    animationSpeed={3}
                    showBorder={false}
                    className="custom-class text-7xl font-bold leading-[1.3]"
                >
                    Integrated Queue
                </GradientText><h2 class="text-7xl font-bold mb-6 w-170 text-black"> and Appointment Booking System</h2>
                <p className="text-xl pb-8 text-gray-500 w-200">Reduce wait times by 35% and scale quickly. QueueMaster is the leading platform for queue management, appointment scheduling, and advanced analytics reports to maximize your ROI.</p>
                <Link to='/signup'>
                    <button className="bg-violet-500 text-blue-900 px-6 py-3 rounded-full font-semibold transition duration-700 hover:-translate-y-2">Get Started</button>
                </Link>
            </section>
             
            <section id="about" className="py-20 bg-white text-gray-800 text-center">
                <div className='bg-blue-100 p-10 rounded-lg shadow-md w-6xl mx-auto flex flex-row gap-20'>
                    <div className=''>
                        <h3 class="text-3xl font-bold mb-6">About QueueMaster</h3>
                        <p class="max-w-xl mx-auto mb-4">QueueMaster is a cutting-edge queue management and appointment booking system designed to streamline operations and enhance customer experiences. Our platform leverages advanced technology to reduce wait times, optimize resource allocation, and provide real-time analytics.</p>
                        <p class="max-w-xl mx-auto">With QueueMaster, businesses can easily manage customer flow, schedule appointments, and gain insights through comprehensive reports. Our user-friendly interface ensures that both staff and customers can navigate the system with ease, making it the ideal solution for various industries including healthcare, retail and hospitality.</p>
                    </div>
                    <div>
                        <img className='pt-10' src={img1} alt="demo img" />
                    </div>
                </div>
                
                <div className='mt-20 w-5xl mx-auto'>
                    <h1 className='text-4xl font-bold text-center mb-20'>Key Features of QueueMaster</h1>
                    <div class="grid grid-cols-3 gap-10">
                        <div className='bg-gray-200 rounded-2xl hover:shadow-lg hover:bg-gray-300'>
                            <h4 class="text-2xl font-semibold my-2">Key Features</h4>
                            <ul class="list-disc list-inside text-left p-5">
                                <li>Real-time Queue Monitoring</li>
                                <li>Online Appointment Booking</li>
                                <li>Automated Notifications</li>
                                <li>Comprehensive Analytics</li>
                                <li>Customizable Interface</li>
                            </ul>
                        </div>
                        <div className='bg-gray-200 rounded-2xl hover:shadow-lg hover:bg-gray-300'>
                            <h4 class="text-2xl font-semibold my-2">Benefits</h4>
                            <ul class="list-disc list-inside text-left p-5">
                                <li>Reduce Wait Times by 35%</li>
                                <li>Enhance Customer Satisfaction</li>
                                <li>Optimize Staff Efficiency</li>
                                <li>Increase Appointment Bookings</li>
                                <li>Data-Driven Decision Making</li>
                            </ul>
                        </div>
                        <div className='bg-gray-200 rounded-2xl hover:shadow-lg hover:bg-gray-300'>
                            <h4 class="text-2xl font-semibold my-2">Industries Served</h4>
                            <ul class="list-disc list-inside text-left p-5">
                                <li>Healthcare</li>
                                <li>Retail</li>
                                <li>Hospitality</li>
                                <li>Government Services</li>
                                <li>Banking & Finance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section >
            <section id="contact" class="py-10  text-gray-800 text-center">
                <Contact />
                <div class="mt-10 flex justify-center space-x-8 text-3xl text-gray-600" >
                    <button onClick={() => {
                        alert("Email:QueueMaster@gmail.com")
                    }}><MdEmail /></button>
                    <button onClick={() => {
                        alert("Phone:9876543210")
                    }}><FaPhoneVolume /></button>
                    <button onClick={() => {
                        alert("Location:123, Main Street, City, Country")
                    }}><FaLocationDot /></button>
                    <button onClick={() => {
                        alert("Our working hours are 9 AM to 6 PM, Monday to Friday.")
                    }}><GoClockFill /></button>
                </div>
            </section>

            <footer class="bg-blue-900 text-white text-center py-6">
                &copy; 2025 QueueMaster. All rights reserved.
            </footer>
        </div >
    )
}

export default LandingPage