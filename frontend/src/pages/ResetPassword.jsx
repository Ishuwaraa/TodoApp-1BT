import { useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(newPass !== confirmPass) {
            toast.error('Passwords do not match');
            return
        }

        if (!token) {
            toast.error('No token found');
            return;
        }

        try {
            const { data } = await axiosInstance.post('/auth/reset-password', { password: newPass, token });
            console.log(data);
            setSubmitted(true);
            // toast.success('Password reset successfully');
        } catch (err) {
            if (err.response.status === 404) {
                toast.error('No user found');
            } else if (err?.response?.data) {
                console.log(err.response.data);
                toast.error('Error resetting password. Password must be atleast 6 characters long');
            } else {
                console.log(err.message);
                toast.error('Error resetting your password. Try again later');
            }
        }
    }


    return ( 
        <div className="min-h-screen flex items-center justify-center bg-opacity-75 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md p-8">
                {!submitted ? (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-blue-500">Create New Password</h2>
                        <p className="text-gray-600 mt-2">Please enter and confirm your new password</p>
                    </div>
                                        
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!token}
                        className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                            !token 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Reset Password
                    </button>                    
                </form>
                ) : (
                <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-blue-500">Password Reset Successful</h2>
                    <p className="mt-2 text-gray-600">
                        Your password has been updated successfully.
                    </p>
                    <div className="mt-6">
                        <a href="/login" className="text-blue-500 hover:text-blue-600 px-4 py-2 rounded-lg transition duration-200 font-medium">
                            Back to Login
                        </a>
                    </div>
                </div>
                )}
            </div>
        </div>
     );
}
 
export default ResetPassword;