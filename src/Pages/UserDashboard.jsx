import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserDashboard = () => {
  const navigate = useNavigate()
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [selectedService, setSelectedService] = useState('Consultation')
  const [userTickets, setUserTickets] = useState([])
  const [queueStatus, setQueueStatus] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchUserTickets()
    fetchQueueStatus()
    fetchAnnouncements()
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchUserTickets()
      fetchQueueStatus()
      fetchAnnouncements()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchUserTickets = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('http://localhost:5000/queue/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserTickets(res.data)
    } catch (err) {
      console.error('Error fetching tickets:', err)
    }
  }

  const fetchQueueStatus = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('http://localhost:5000/queue/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setQueueStatus(res.data)
    } catch (err) {
      console.error('Error fetching queue:', err)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('http://localhost:5000/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(res.data.slice(0, 3))
    } catch (err) {
      console.error('Error fetching announcements:', err)
    }
  }

  useEffect(() => {
    if (userTickets.length > 0) {
      generateRecentActivity()
    }
  }, [userTickets])

  const generateRecentActivity = () => {
    const activities = []
    
    userTickets.slice(0, 3).forEach(ticket => {
      activities.push({
        id: ticket._id,
        text: `🎟️ Token ${ticket.tokenNumber} generated`,
        time: new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      })
      
      if (ticket.calledAt) {
        activities.push({
          id: `${ticket._id}-called`,
          text: `📞 Token ${ticket.tokenNumber} called`,
          time: new Date(ticket.calledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        })
      }
    })
    
    activities.push({
      id: 'queue-check',
      text: '📊 Checked queue status',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    })
    
    setRecentActivity(activities.slice(0, 4))
  }

  const handleQuickAction = (action) => {
    switch(action) {
      case 'ticket':
        navigate('/tickets')
        break
      case 'queue':
        navigate('/queuestatus')
        break
      case 'notifications':
        navigate('/notification')
        break
      case 'todo':
        navigate('/todo')
        break
    }
  }

  const generateTicket = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.post('http://localhost:5000/queue/generate', 
        { service: selectedService },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert(res.data.message)
      setShowTicketModal(false)
      fetchUserTickets()
      fetchQueueStatus()
      fetchAnnouncements()
    } catch (err) {
      alert('Error generating ticket: ' + err.response?.data?.message)
    }
  }

  return (
    <div className="p-30 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Public Dashboard
      </h1>

      {/* Status Cards Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Current Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

          {/* Active Token */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Active Token</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-2">
              {userTickets.length > 0 ? userTickets[0].tokenNumber : 'None'}
            </h3>
          </div>

          {/* Queue Position */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Queue Position</p>
            <h3 className="text-xl font-bold text-green-600 mt-2">
              {userTickets.length > 0 ? `Position ${userTickets[0].position}` : 'No active ticket'}
            </h3>
          </div>

          {/* Estimated Wait Time */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Estimated Wait Time</p>
            <h3 className="text-xl font-bold text-orange-500 mt-2">
              {userTickets.length > 0 ? `${userTickets[0].estimatedWaitTime} min` : 'N/A'}
            </h3>
          </div>

          {/* Selected Service */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Selected Service</p>
            <h3 className="text-xl font-bold text-purple-600 mt-2">
              {userTickets.length > 0 ? userTickets[0].service : 'None'}
            </h3>
          </div>

          {/* Queue Status */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Queue Status</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${
              userTickets.length > 0 && userTickets[0].status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : userTickets.length > 0 && userTickets[0].status === 'waiting'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {userTickets.length > 0 ? userTickets[0].status : 'No ticket'}
            </span>
          </div>

        </div>

      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div onClick={() => handleQuickAction('ticket')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-blue-600">
              🎟️ Take Ticket
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Generate a new queue token
            </p>
          </div>

          <div onClick={() => handleQuickAction('queue')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-green-600">
              📊 Track Queue
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              View live queue status
            </p>
          </div>

          <div onClick={() => handleQuickAction('notifications')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-orange-500">
              🔔 Notifications
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Check recent alerts
            </p>
          </div>

          <div onClick={() => handleQuickAction('todo')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-purple-600">
              📝 My To-Do List
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Manage your tasks
            </p>
          </div>

        </div>

      </section>

      {/* Queue Progress */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Queue Progress
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          {userTickets.length > 0 && userTickets[0].status !== 'completed' ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Current Serving</p>
                  <h3 className="text-xl font-bold text-blue-600">
                    {queueStatus.find(t => t.status === 'active')?.tokenNumber || 'None'}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Your Token</p>
                  <h3 className="text-xl font-bold text-green-600">{userTickets[0].tokenNumber}</h3>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.max(10, Math.min(90, ((queueStatus.length - userTickets[0].position + 1) / queueStatus.length) * 100))}%` 
                  }}
                ></div>
              </div>

              <p className="text-sm text-gray-500">
                {userTickets[0].status === 'active' 
                  ? 'Your turn! Please proceed to the counter.' 
                  : `${userTickets[0].position - 1} people ahead of you.`
                }
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active ticket. Generate a new ticket to see progress.</p>
            </div>
          )}
        </div>
      </section>

      {/* Activity & Announcements */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <h2 className="text-lg font-semibold mb-3">
            Recent Activity
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

            <ul className="space-y-3 text-sm text-gray-600">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <li key={activity.id} className="flex justify-between">
                  <span>{activity.text}</span>
                  <span className="text-gray-400">({activity.time})</span>
                </li>
              )) : (
                <li className="text-center text-gray-400 py-4">No recent activity</li>
              )}
            </ul>
          </div>

        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">
            Announcements
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Announcements</h3>

            <ul className="space-y-3 text-sm text-gray-600">
              {announcements.length > 0 ? announcements.map((announcement) => (
                <li key={announcement._id}>
                  📢 <strong>{announcement.title}</strong><br />
                  <span className="text-xs text-gray-400">
                    {announcement.message.substring(0, 50)}...
                  </span>
                </li>
              )) : (
                <li className="text-center text-gray-400 py-4">No announcements</li>
              )}
              
              <li>
                <span 
                  onClick={() => navigate('/announcements')}
                  className="text-blue-600 text-sm cursor-pointer hover:underline"
                >
                  View all announcements →
                </span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* Ticket Generation Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Generate New Ticket</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Service:</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="Consultation">Consultation</option>
                <option value="Documentation">Documentation</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={generateTicket}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Generate Ticket
              </button>
              <button 
                onClick={() => setShowTicketModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default UserDashboard