import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import LoginImg from "../assets/login.png";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(email, password);
            const formData = { email, password };
            const { data } = await axiosInstance.post('/auth/login', formData);
            console.log(data);
            
            if (data?.accessToken && !data.error) {
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/', { replace: true });
            } else {
                console.log('Login failed:', data.error);
            }
        } catch (err) {
            if (err?.response?.status == 401) {
                alert('Invalid credentials')
            } else if (err?.response) {
                console.log(err.response?.data);
            } else {
                console.log(err.message);
            }
        }

    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-blue-500 mb-2">Task Manager</h1>
                        <p className="text-gray-800 font-semibold">Welcome Back! Please sign in to continue</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <p className="text-gray-600">
                            Don't have an account?&nbsp;
                            <a href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
                                Sign up now
                            </a>
                        </p>
                        <a href="/forgot-password" className="text-blue-500 hover:text-blue-600 font-medium block">
                            Forgot password?
                        </a>
                    </div>
                </div>

                
                <div className="hidden lg:flex justify-center items-center">
                    <img src={LoginImg} alt="Task Manager Illustration" className="max-w-full h-auto" />
                </div>
            </div>
        </div>
     );
}
 
export default Login;