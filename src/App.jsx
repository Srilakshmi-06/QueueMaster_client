import React from 'react'
import Header from './Components/Header.jsx'
import Footer from './Components/Footer.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import UserDashboard from './Pages/UserDashboard.jsx'
import AdminDashboard from './Pages/AdminDashboard.jsx'
import Profile from './Pages/Profile.jsx'
import Announcements from './Pages/Announcements.jsx'
import Services from './Pages/Services.jsx'
import QueueStatus from './Pages/Queuestatus.jsx'
import Tickets from './Pages/Tickets.jsx'
import Login from './Pages/Login.jsx'
import Signup from './Pages/Signup.jsx'
import Notification from './Pages/Notification.jsx'
import Todo from './Pages/Todo.jsx'
import LandingPage from './Pages/LandingPage.jsx'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation();
  const hide = ['/', '/signup', '/login'];
  const hideLayout = hide.includes(location.pathname);
  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/todo' element={<Todo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/services" element={<Services />} />
        <Route path="/queuestatus" element={<QueueStatus />} />
        <Route path="/tickets" element={<Tickets />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  )
}
const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App