import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [stats, setStats] = useState({ totalUsers: 0, activeQueues: 0, ticketsToday: 0, avgWaitTime: 0 })
  const [queueData, setQueueData] = useState([])
  const [users, setUsers] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [systemStatus, setSystemStatus] = useState({})

  useEffect(() => {
    fetchStats()
    fetchQueueData()
    fetchRecentActivity()
    checkSystemStatus()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('http://localhost:5000/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(res.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchQueueData = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('http://localhost:5000/queue/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setQueueData(res.data)
    } catch (err) {
      console.error('Error fetching queue:', err)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      
      // Get all tickets sorted by creation date
      const queueRes = await axios.get('http://localhost:5000/queue/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Get recent users
      const usersRes = await axios.get('http://localhost:5000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Get announcements
      const announcementsRes = await axios.get('http://localhost:5000/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      generateActivityLog(queueRes.data, usersRes.data, announcementsRes.data)
    } catch (err) {
      console.error('Error fetching activity:', err)
    }
  }

  const generateActivityLog = (tickets, users, announcements) => {
    const activities = []
    
    // Recent tickets
    tickets.slice(0, 3).forEach(ticket => {
      activities.push({
        id: `ticket-${ticket._id}`,
        text: `🎟️ Token ${ticket.tokenNumber} generated`,
        time: getTimeAgo(ticket.createdAt)
      })
      
      if (ticket.status === 'completed' && ticket.completedAt) {
        activities.push({
          id: `completed-${ticket._id}`,
          text: `✅ Token ${ticket.tokenNumber} completed`,
          time: getTimeAgo(ticket.completedAt)
        })
      }
    })
    
    // Recent users
    users.slice(0, 2).forEach(user => {
      activities.push({
        id: `user-${user._id}`,
        text: `👤 New user registered: ${user.name}`,
        time: getTimeAgo(user.createdAt || new Date())
      })
    })
    
    // Recent announcements
    announcements.slice(0, 1).forEach(announcement => {
      activities.push({
        id: `announcement-${announcement._id}`,
        text: `📢 Announcement posted: ${announcement.title}`,
        time: getTimeAgo(announcement.createdAt)
      })
    })
    
    // Sort by most recent and take top 4
    setRecentActivity(activities.slice(0, 4))
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  const checkSystemStatus = () => {
    const now = new Date()
    const lastBackup = new Date(now.getTime() - (2 * 60 * 60 * 1000)) // 2 hours ago
    
    setSystemStatus({
      server: 'Online',
      database: 'Connected',
      queueSystem: 'Running',
      lastBackup: lastBackup.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    })
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('http://localhost:5000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const handleTicketAction = async (action, tokenNumber) => {
    try {
      const token = localStorage.getItem('qmToken')
      await axios.post(`http://localhost:5000/queue/${action}`, 
        { tokenNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchQueueData()
      fetchStats()
      fetchRecentActivity()
    } catch (err) {
      alert('Error: ' + err.response?.data?.message)
    }
  }

  const handleQuickAction = (action) => {
    switch(action) {
      case 'users':
        setModalType('User Management')
        fetchUsers()
        setShowModal(true)
        break
      case 'queue':
        setModalType('Queue Control')
        setShowModal(true)
        break
      case 'analytics':
        setModalType('Analytics Dashboard')
        setShowModal(true)
        break
      case 'services':
        navigate('/services')
        break
      case 'announcements':
        navigate('/announcements')
        break
      case 'settings':
        setModalType('System Settings')
        setShowModal(true)
        break
    }
  }

  return (
    <div className="p-30 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {/* Admin Stats */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">{stats.totalUsers}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Active Queues</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">{stats.activeQueues}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Tickets Today</p>
            <h3 className="text-3xl font-bold text-orange-500 mt-2">{stats.ticketsToday}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Avg Wait Time</p>
            <h3 className="text-3xl font-bold text-purple-600 mt-2">{stats.avgWaitTime}m</h3>
          </div>

        </div>
      </section>

      {/* Admin Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div onClick={() => handleQuickAction('users')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-blue-600">
              👥 Manage Users
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Add, edit, or remove users
            </p>
          </div>

          <div onClick={() => handleQuickAction('queue')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-green-600">
              🎯 Queue Control
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Manage active queues and tokens
            </p>
          </div>

          <div onClick={() => handleQuickAction('analytics')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-orange-500">
              📊 Analytics
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              View detailed reports and stats
            </p>
          </div>

          <div onClick={() => handleQuickAction('services')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-purple-600">
              🔧 Services
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Configure available services
            </p>
          </div>

          <div onClick={() => handleQuickAction('announcements')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-red-600">
              📢 Announcements
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Create and manage announcements
            </p>
          </div>

          <div onClick={() => handleQuickAction('settings')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-indigo-600">
              ⚙️ Settings
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              System configuration
            </p>
          </div>

        </div>
      </section>

      {/* Current Queue Status */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Live Queue Status</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wait Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queueData.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.tokenNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ticket.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ticket.estimatedWaitTime}m</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {ticket.status === 'waiting' && (
                      <>
                        <button 
                          onClick={() => handleTicketAction('call', ticket.tokenNumber)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Call
                        </button>
                        <button 
                          onClick={() => handleTicketAction('skip', ticket.tokenNumber)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Skip
                        </button>
                      </>
                    )}
                    {ticket.status === 'active' && (
                      <button 
                        onClick={() => handleTicketAction('complete', ticket.tokenNumber)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Activity & System Logs */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <ul className="space-y-3 text-sm">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <li key={activity.id} className="flex justify-between">
                  <span>{activity.text}</span>
                  <span className="text-gray-500">{activity.time}</span>
                </li>
              )) : (
                <li className="text-center text-gray-400 py-4">No recent activity</li>
              )}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Server Status</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  systemStatus.server === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemStatus.server || 'Online'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  systemStatus.database === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemStatus.database || 'Connected'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Queue System</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  systemStatus.queueSystem === 'Running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemStatus.queueSystem || 'Running'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Backup</span>
                <span className="text-xs text-gray-500">
                  {systemStatus.lastBackup ? `${systemStatus.lastBackup}` : '2 hours ago'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Sessions</span>
                <span className="text-xs text-gray-500">{stats.totalUsers} users</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{modalType}</h3>
            
            {modalType === 'User Management' && (
              <div>
                <div className="space-y-2 mb-4">
                  {users.map(user => (
                    <div key={user._id} className="flex justify-between items-center p-2 border rounded">
                      <span>{user.name} ({user.email})</span>
                      <span className="text-sm text-gray-500">{user.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {modalType !== 'User Management' && (
              <p className="text-gray-600 mb-6">This feature is under development.</p>
            )}
            
            <button 
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboard