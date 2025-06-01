import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const VerifyResetCodePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://backend-bjq5.onrender.com/user/verify-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/reset-password', { state: { email } })
      } else {
        setError(data.detail || 'Invalid code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return <p className="text-center text-red-500 mt-10">Email not provided. Please restart the flow.</p>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Verify Reset Code</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          maxLength={5}
          placeholder="Enter 5-letter code"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </div>
  )
}

export default VerifyResetCodePage
