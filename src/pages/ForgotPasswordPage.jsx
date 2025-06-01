import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://backend-bjq5.onrender.com/user/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/verify-reset', { state: { email } })
      } else {
        setError(data.detail || 'Error sending reset code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full h-full space-y-6"
      >
        <h2 className="text-black text-2xl font-bold">Forgot Password</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Sending...' : 'Send Code'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full border border-gray-400 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Back
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordPage
