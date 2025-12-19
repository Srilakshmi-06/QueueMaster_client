import React, { useState, useEffect } from "react";
import { AiOutlineInfoCircle, AiOutlineWarning, AiOutlinePlus } from "react-icons/ai";
import axios from 'axios'

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', priority: 'medium' })
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetchAnnouncements()
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }

        // Auto-refresh announcements every 10 seconds
        const interval = setInterval(() => {
            fetchAnnouncements()
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('qmToken')
            const res = await axios.get('https://queuemaster-server-1.onrender.com/announcements', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAnnouncements(res.data)
        } catch (err) {
            console.error('Error fetching announcements:', err)
        }
    }

    const createAnnouncement = async () => {
        try {
            const token = localStorage.getItem('qmToken')
            await axios.post('https://queuemaster-server-1.onrender.com/announcements', newAnnouncement, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setShowCreateModal(false)
            setNewAnnouncement({ title: '', message: '', priority: 'medium' })
            fetchAnnouncements()
        } catch (err) {
            alert('Error creating announcement: ' + err.response?.data?.message)
        }
    }

    return (
        <div className="p-30 bg-gray-100 min-h-screen">

            {/* Page Title */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
                {user && user.role === 'admin' && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <AiOutlinePlus /> Create Announcement
                    </button>
                )}
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.length > 0 ? announcements.map((announcement) => {
                    const isHigh = announcement.priority === "high";
                    const isMedium = announcement.priority === "medium";

                    return (
                        <div key={announcement._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    {isHigh ? (
                                        <AiOutlineWarning className="text-red-500 text-xl" />
                                    ) : isMedium ? (
                                        <AiOutlineWarning className="text-yellow-500 text-xl" />
                                    ) : (
                                        <AiOutlineInfoCircle className="text-blue-500 text-xl" />
                                    )}
                                    <h2 className="text-lg font-semibold text-gray-800">{announcement.title}</h2>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{announcement.message}</p>

                            <div className="flex justify-between items-center">
                                <span className={`inline-block px-3 py-1 text-sm rounded-full ${isHigh ? "bg-red-100 text-red-700" :
                                    isMedium ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                                    }`}>
                                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                                </span>
                                {announcement.createdBy && (
                                    <span className="text-xs text-gray-400">
                                        By: {announcement.createdBy.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <p className="text-gray-500">No announcements available</p>
                    </div>
                )}
            </div>

            {/* Create Announcement Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Create New Announcement</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    placeholder="Announcement title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea
                                    value={newAnnouncement.message}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                                    className="w-full p-2 border rounded h-24"
                                    placeholder="Announcement message"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Priority</label>
                                <select
                                    value={newAnnouncement.priority}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={createAnnouncement}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
