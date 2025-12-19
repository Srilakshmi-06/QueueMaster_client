import React, { useState, useEffect } from "react";
import { AiOutlineBell, AiOutlineCheckCircle } from "react-icons/ai";
import axios from 'axios'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [userTickets, setUserTickets] = useState([])
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    fetchNotifications()

    // Auto-refresh notifications every 8 seconds
    const interval = setInterval(() => {
      fetchNotifications()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('qmToken')

      // Fetch user tickets for ticket-related notifications
      const ticketsRes = await axios.get('https://queuemaster-server-1.onrender.com/queue/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserTickets(ticketsRes.data)

      // Fetch announcements for announcement notifications
      const announcementsRes = await axios.get('https://queuemaster-server-1.onrender.com/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(announcementsRes.data)

      // Generate notifications based on data
      generateNotifications(ticketsRes.data, announcementsRes.data)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  const generateNotifications = (tickets, announcements) => {
    const notifs = []

    // Ticket notifications
    tickets.forEach(ticket => {
      if (ticket.status === 'active') {
        notifs.push({
          id: `ticket-${ticket._id}`,
          message: `Your token ${ticket.tokenNumber} is now being served!`,
          time: getTimeAgo(ticket.calledAt || ticket.createdAt),
          type: 'success'
        })
      } else if (ticket.status === 'waiting') {
        notifs.push({
          id: `ticket-${ticket._id}`,
          message: `Your token ${ticket.tokenNumber} is in queue. Position: ${ticket.position}`,
          time: getTimeAgo(ticket.createdAt),
          type: 'info'
        })
      }
    })

    // Announcement notifications
    announcements.slice(0, 3).forEach(announcement => {
      notifs.push({
        id: `announcement-${announcement._id}`,
        message: `New announcement: ${announcement.title}`,
        time: getTimeAgo(announcement.createdAt),
        type: announcement.priority === 'high' ? 'warning' : 'info'
      })
    })

    setNotifications(notifs)
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} mins ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  const markAsRead = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  return (
    <div className="p-30 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>

      {/* Notification List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {notifications.length > 0 ? notifications.map((notification) => {
          const isWarning = notification.type === "warning"
          const isSuccess = notification.type === "success"

          return (
            <div
              key={notification.id}
              className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition relative"
            >
              <AiOutlineBell
                className={`text-xl mt-1 ${isSuccess ? "text-green-500" :
                  isWarning ? "text-yellow-500" : "text-blue-500"
                  }`}
              />
              <div className="flex-1">
                <p className="text-gray-800 text-sm pr-8">{notification.message}</p>
                <span className="text-gray-500 text-xs">{notification.time}</span>
              </div>
              <button
                onClick={() => markAsRead(notification.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                title="Mark as read"
              >
                <AiOutlineCheckCircle className="text-lg" />
              </button>
            </div>
          )
        }) : (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <AiOutlineBell className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No new notifications</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setNotifications([])}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Mark All as Read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
