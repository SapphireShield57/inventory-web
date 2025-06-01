import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const VerifyPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, password } = location.state || {}

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Missing registration data. Please register again.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://backend-bjq5.onrender.com/user/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, code }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/')
      } else {
        setError(data.detail || 'Verification failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-black">Enter Verification Code</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="5-letter Code"
          maxLength={5}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring text-center tracking-widest uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full border border-gray-400 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Back
        </button>
      </form>
    </div>
  )
}

export default VerifyPage
