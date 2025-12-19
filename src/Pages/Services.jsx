import React, { useState, useEffect } from "react";
import { FaUserAlt, FaHeadset, FaMoneyBillWave, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios'

const Services = () => {
  const [services, setServices] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true })
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchServices()
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Auto-refresh services every 15 seconds
    const interval = setInterval(() => {
      fetchServices()
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('https://queuemaster-server-1.onrender.com/services', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setServices(res.data)
    } catch (err) {
      // If services endpoint doesn't exist, use default services
      setServices([
        { _id: '1', name: 'Consultation', description: 'General consultation services', isActive: true },
        { _id: '2', name: 'Documentation', description: 'Document processing and verification', isActive: true },
        { _id: '3', name: 'Support', description: 'Technical and customer support', isActive: true }
      ])
    }
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      if (editingService) {
        await axios.put(`https://queuemaster-server-1.onrender.com/services/${editingService._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('https://queuemaster-server-1.onrender.com/services', formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setShowModal(false)
      setEditingService(null)
      setFormData({ name: '', description: '', isActive: true })
      fetchServices()
    } catch (err) {
      alert('Error: ' + err.response?.data?.message)
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({ name: service.name, description: service.description, isActive: service.isActive })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const token = localStorage.getItem('qmToken')
        await axios.delete(`https://queuemaster-server-1.onrender.com/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchServices()
      } catch (err) {
        alert('Error: ' + err.response?.data?.message)
      }
    }
  }

  const getServiceIcon = (name) => {
    if (name.toLowerCase().includes('consultation')) return <FaUserAlt className="text-blue-500 text-2xl mr-3" />
    if (name.toLowerCase().includes('support')) return <FaHeadset className="text-green-500 text-2xl mr-3" />
    return <FaMoneyBillWave className="text-yellow-500 text-2xl mr-3" />
  }

  return (
    <div className="p-30 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Services</h1>
        {user && user.role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> Add Service
          </button>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 relative">
            <div className="flex items-center mb-2">
              {getServiceIcon(service.name)}
              <h2 className="text-lg font-semibold">{service.name}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>

            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 text-xs rounded-full ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>

              {user && user.role === 'admin' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Service name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded h-20"
                  placeholder="Service description"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Active Service</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingService ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingService(null)
                  setFormData({ name: '', description: '', isActive: true })
                }}
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

export default Services;
