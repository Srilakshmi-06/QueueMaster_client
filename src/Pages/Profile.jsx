import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Avatar, TextField, Button, Grid } from "@mui/material";
import axios from 'axios'

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    ph_No: "",
    role: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        ph_No: parsedUser.ph_No || '',
        role: parsedUser.role || ''
      })
    }
  }, [])

  const updateProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('qmToken')
      const res = await axios.put('http://localhost:5000/queuemaster/profile', 
        { name: user.name, email: user.email, ph_No: user.ph_No },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update localStorage with new data
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error updating profile: ' + err.response?.data?.message)
      setTimeout(() => setMessage(''), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="p-30 bg-gray-100 min-h-screen flex justify-center">
      <Card className="w-full max-w-3xl p-6 shadow-lg">
        <CardContent>
          {/* Page Title */}
          <Typography variant="h5" className="font-bold mb-6">
            Profile
          </Typography>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <Avatar
              src="https://via.placeholder.com/150"
              alt="Profile Picture"
              sx={{ width: 100, height: 100, border: "3px solid #3B82F6" }}
            />
            <div className="flex-1 space-y-1">
              <Typography variant="h6">{user.name}</Typography>
              <Typography color="text.secondary">Email: {user.email}</Typography>
              <Typography color="text.secondary">Phone: {user.ph_No}</Typography>
              <Typography color="text.secondary">Role: {user.role === 'admin' ? 'Administrator' : 'Public User'}</Typography>
            </div>
          </div>

          {/* Edit Profile Form */}
          <Typography variant="h6" className="font-semibold mb-4">
            Edit Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={user.ph_No}
                onChange={(e) => setUser({ ...user, ph_No: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                value={user.role === 'admin' ? 'Administrator' : 'Public User'}
                variant="outlined"
                disabled
              />
            </Grid>
          </Grid>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded text-center ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={updateProfile}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
