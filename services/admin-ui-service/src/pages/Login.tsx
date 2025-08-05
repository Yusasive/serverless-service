import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserController } from '../controllers/UserController'
import LoadingOverlay from '../components/common/LoadingOverlay'
import { useUser } from '../context/UserContext'
import { User, UserType } from '../types/user.type'
export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const userController = UserController.getInstance()
  const { setUser } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const result = await userController.login(formData.email, formData.password);
      console.log("Login result 2029:", JSON.stringify(result, null, 2));
      if (result.success && result.data) {
        console.log("Navigating to dashboard 2029");
        // Transform LoginResponse to User type and update the user context
        const userData: User = {
          user_id: parseInt(result.data._id),
          email: result.data.email,
          first_name: result.data.firstName,
          last_name: result.data.lastName,
          phone: result.data.phone,
          user_type: result.data.userType as UserType,
          userType: result.data.userType,
          verified: true,
          is_active: true,
          address: []
        }
        setUser(userData)
        navigate('/dashboard', { replace: true })
      } else {
        setError(result.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingOverlay isLoading={isLoading} message="Signing in..." />
      <div className="w-[460px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-8">
        <div className="flex flex-col items-center">
          <img
            src="/images/litf_logo.png"
            alt="LCCI Logo"
            className="h-16 w-auto mb-6"
          />
          <h2 className="text-2xl font-medium text-primary-600">
            Admin Login
          </h2>
        </div>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 