import React, { useState, useEffect } from "react";
import axios from 'axios'

const Queuestatus = () => {
  const [queueData, setQueueData] = useState([])
  const [userTickets, setUserTickets] = useState([])
  const [currentToken, setCurrentToken] = useState(null)

  useEffect(() => {
    fetchQueueData()
    fetchUserTickets()
    const interval = setInterval(() => {
      fetchQueueData()
      fetchUserTickets()
    }, 3000) // Refresh every 3 seconds for queue status
    return () => clearInterval(interval)
  }, [])

  const fetchQueueData = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('http://localhost:5000/queue/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setQueueData(res.data)
      setCurrentToken(res.data.find(ticket => ticket.status === 'active'))
    } catch (err) {
      console.error('Error fetching queue:', err)
    }
  }

  const fetchUserTickets = async () => {
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.get('http://localhost:5000/queue/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserTickets(res.data.filter(ticket => ticket.status !== 'completed'))
    } catch (err) {
      console.error('Error fetching user tickets:', err)
    }
  }

  const userActiveTicket = userTickets.find(ticket => ['waiting', 'active'].includes(ticket.status))
  const totalTokens = queueData.length
  const completedTokens = queueData.filter(ticket => ticket.status === 'completed').length
  const progress = totalTokens > 0 ? (completedTokens / totalTokens) * 100 : 0

  return (
    <div className="p-30 bg-gray-100 min-h-screen">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Queue Status
      </h1>

      {/* Current Token Summary */}
      <section className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Current Token</h2>
        <div className="flex flex-col items-center justify-center h-24 bg-gray-100 rounded-lg">
          {userActiveTicket ? (
            <>
              <p className="text-3xl font-bold text-gray-800">{userActiveTicket.tokenNumber}</p>
              <p className={`text-sm font-medium ${
                userActiveTicket.status === 'active' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {userActiveTicket.status === 'active' ? 'Being Served' : 'Waiting'}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No active token</p>
          )}
        </div>
      </section>

      {/* Queue Progress */}
      <section className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Queue Progress</h2>
        <div className="h-6 w-full bg-gray-200 rounded-full">
          <div 
            className="h-6 bg-blue-500 rounded-full text-right text-white text-sm flex items-center justify-end pr-2"
            style={{ width: `${progress}%` }}
          >
            {Math.round(progress)}%
          </div>
        </div>
        <p className="mt-2 text-gray-600 text-sm">{completedTokens} of {totalTokens} tokens served</p>
      </section>

      {/* Current Queue */}
      <section className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Queue</h2>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {queueData.length > 0 ? queueData.map((ticket) => (
            <li key={ticket._id} className={`flex justify-between p-3 rounded-lg shadow-sm ${
              userActiveTicket && ticket._id === userActiveTicket._id 
                ? 'bg-blue-100 border-2 border-blue-300' 
                : 'bg-gray-100'
            }`}>
              <span className="font-medium">{ticket.tokenNumber}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{ticket.service}</span>
                <span className={`text-sm font-medium ${
                  ticket.status === 'active' ? 'text-green-600' : 
                  ticket.status === 'waiting' ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {ticket.status === 'active' ? 'Being Served' : 
                   ticket.status === 'waiting' ? 'Waiting' : ticket.status}
                </span>
              </div>
            </li>
          )) : (
            <li className="text-center text-gray-500 py-4">No tokens in queue</li>
          )}
        </ul>
      </section>

      {/* Status Update */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Status Update</h2>
        <div className="h-16 flex items-center justify-center bg-gray-100 rounded-lg">
          {userActiveTicket ? (
            <p className="text-gray-700 font-medium text-center">
              {userActiveTicket.status === 'active' 
                ? 'Your token is being served. Please proceed to the counter.' 
                : `You are position ${userActiveTicket.position} in the queue. Estimated wait: ${userActiveTicket.estimatedWaitTime} minutes.`
              }
            </p>
          ) : (
            <p className="text-gray-500 text-center">No active token. Generate a new ticket to join the queue.</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default Queuestatus;
