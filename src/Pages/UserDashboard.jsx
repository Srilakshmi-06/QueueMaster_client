import React from 'react'

const UserDashboard = () => {
  return (
    <div className="p-30 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Client Dashboard
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
              A12
            </h3>
          </div>

          {/* Queue Position */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Queue Position</p>
            <h3 className="text-xl font-bold text-green-600 mt-2">
              You are 5th in line
            </h3>
          </div>

          {/* Estimated Wait Time */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Estimated Wait Time</p>
            <h3 className="text-xl font-bold text-orange-500 mt-2">
              Approx. 15 minutes
            </h3>
          </div>

          {/* Selected Service */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Selected Service</p>
            <h3 className="text-xl font-bold text-purple-600 mt-2">
              Consultation
            </h3>
          </div>

          {/* Queue Status */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="text-sm text-gray-500">Queue Status</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
              Active
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

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-blue-600">
              🎟️ Take Ticket
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Generate a new queue token
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-green-600">
              📊 Track Queue
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              View live queue status
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
            <h3 className="text-lg font-semibold text-orange-500">
              🔔 Notifications
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Check recent alerts
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition">
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

          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Current Token</p>
              <h3 className="text-xl font-bold text-blue-600">A10</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Your Token</p>
              <h3 className="text-xl font-bold text-green-600">A12</h3>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: "70%" }}
            ></div>
          </div>

          <p className="text-sm text-gray-500">
            Almost there! Please be ready.
          </p>

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
              <li>🎟️ Token A12 generated (10:30 AM)</li>
              <li>📊 Checked queue status</li>
              <li>📝 Added a task to To-Do list</li>
              <li>🔔 Viewed notification</li>
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
              <li>
                📢 <strong>New Counter Added</strong><br />
                <span className="text-xs text-gray-400">
                  Service speed has been improved.
                </span>
              </li>

              <li>
                📢 <strong>Holiday Notice</strong><br />
                <span className="text-xs text-gray-400">
                  Office closed on Friday.
                </span>
              </li>

              <li>
                <span className="text-blue-600 text-sm cursor-pointer">
                  View all announcements →
                </span>
              </li>
            </ul>
          </div>

        </div>

      </section>

    </div>
  )
}

export default UserDashboard