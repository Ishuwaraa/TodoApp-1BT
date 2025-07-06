import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/auth/forgot-password', { email });
            console.log(data);
            setSubmitted(true);
            toast.success('Password reset link sent to your email');
        } catch (err) {
            if (err.response.status === 404) {
                toast.error('Email not found');
            } else if (err?.response?.data) {
                console.log(err.response.data);
                toast.error('Error sending email. Try again later');
            } else {
                console.log(err.message);
                toast.error('Error sending email. Try again later');
            }
        } finally {
            setLoading(false);
        }
    }
    return ( 
        <div className="min-h-screen flex items-center justify-center bg-opacity-75 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md p-8">
                {!submitted ? (
                <>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-blue-500">Reset Password</h2>
                        <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
                    </div>
                    
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="johndoe@gmail.com"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                                loading 
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                    : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        
                    </form>
                    <div className="text-center mt-4">
                        <a href="/login" className="text-blue-500 hover:text-blue-600">
                            Back to Login
                        </a>
                    </div>
                </>
                ) : (
                <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-blue-500">Check Your Email</h2>
                    <p className="mt-2 text-gray-600">
                        We've sent a password reset link to <span className="font-medium">{email}</span>
                    </p>
                    <p className="mt-4 text-gray-600">
                        Didn't receive the email? Check your spam folder or 
                    <button 
                        onClick={() => setSubmitted(false)} 
                        className="text-blue-500 hover:text-blue-800 ml-1"
                    >
                        try again
                    </button>
                    </p>
                </div>
                )}
            </div>
        </div>
     );
}
 
export default ForgotPassword;