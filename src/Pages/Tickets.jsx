import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Tickets = () => {
    const navigate = useNavigate()
    const [selectedService, setSelectedService] = useState('')
    const [notes, setNotes] = useState('')
    const [preferredTime, setPreferredTime] = useState('')
    const [generatedTicket, setGeneratedTicket] = useState(null)
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('qmToken')
            const res = await axios.get('https://queuemaster-server-1.onrender.com/services', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setServices(res.data.filter(service => service.isActive))
        } catch (err) {
            // Fallback to default services if API fails
            setServices([
                { _id: '1', name: 'Consultation', description: 'General consultation services' },
                { _id: '2', name: 'Documentation', description: 'Document processing' },
                { _id: '3', name: 'Support', description: 'Customer support' }
            ])
        }
    }

    useEffect(() => {
        fetchServices()

        // Auto-refresh services every 10 seconds for ticket generation
        const interval = setInterval(() => {
            fetchServices()
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    const generateTicket = async () => {
        if (!selectedService) {
            alert('Please select a service first')
            return
        }

        setLoading(true)
        try {
            const token = localStorage.getItem('qmToken')
            const res = await axios.post('https://queuemaster-server-1.onrender.com/queue/generate',
                { service: selectedService },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setGeneratedTicket(res.data.ticket)
        } catch (err) {
            alert('Error: ' + err.response?.data?.message)
        }
        setLoading(false)
    }

    return (
        <div className="p-30 bg-gray-100 min-h-screen">

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Take a Ticket
            </h1>

            {/* Service Selection */}
            <section className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    Select a Service
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((service) => (
                        <div
                            key={service._id || service}
                            onClick={() => setSelectedService(service.name || service)}
                            className={`border rounded-xl p-4 hover:shadow-lg cursor-pointer transition ${selectedService === (service.name || service) ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                        >
                            <h3 className="text-md font-bold text-gray-800">{service.name || service}</h3>
                            <p className="text-sm text-gray-500 mt-2">{service.description || 'Available now'}</p>
                            <span className="inline-block mt-3 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                                Open
                            </span>
                        </div>
                    ))}
                </div>
            </section>


            {/* Optional Details */}
            <section className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    Additional Details (Optional)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Preferred Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Preferred Time Slot
                        </label>
                        <input
                            type="time"
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Notes / Reason
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Enter your concern..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        ></textarea>
                    </div>

                </div>
            </section>


            {/* Generate Ticket Button */}
            <section className="mb-6">
                <button
                    onClick={generateTicket}
                    disabled={loading || !selectedService}
                    className="
      w-full md:w-1/2 mx-auto block
      bg-blue-600 text-white
      py-3 rounded-xl
      text-lg font-semibold
      hover:bg-blue-700
      active:scale-95
      transition
      shadow-md
      disabled:bg-gray-400
    "
                >
                    {loading ? 'Generating...' : 'Generate Token'}
                </button>

                <p className="text-sm text-gray-500 text-center mt-3">
                    Please select a service before generating a token
                </p>
            </section>


            {/* Token Confirmation */}
            {generatedTicket && (
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-green-700">
                        🎉 Token Generated Successfully
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500">Token Number</p>
                            <p className="text-xl font-bold text-gray-800">{generatedTicket.tokenNumber}</p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500">Queue Position</p>
                            <p className="text-xl font-bold text-gray-800">{generatedTicket.position}</p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500">Estimated Wait Time</p>
                            <p className="text-xl font-bold text-gray-800">{generatedTicket.estimatedWaitTime} minutes</p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500">Selected Service</p>
                            <p className="text-xl font-bold text-gray-800">{generatedTicket.service}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/queuestatus')}
                        className="
          mt-6 w-full md:w-1/2
          bg-green-600 text-white
          py-3 rounded-xl
          font-semibold
          hover:bg-green-700
          transition
        "
                    >
                        Go to Queue Status
                    </button>
                </section>
            )}


        </div>
    );
};

export default Tickets;
