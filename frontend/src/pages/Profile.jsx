import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { Lock } from 'lucide-react';
import Navbar from "../components/Navbar";

const Profile = () => {
    const navigate = useNavigate();
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [currentPass, setCurrentPass] = useState('');

    const logout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
    }

    const updatePassword = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');

        if(newPass !== confirmPass) {
            alert('passwords do not match');
            return
        }

        if (token) {
            try {
                const { data } = await axiosInstance.put('/user/change-password', { currentPassword: currentPass, newPassword: newPass }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(data);
                alert(data);
                setNewPass('');
                setConfirmPass('');
                setCurrentPass('');
            } catch (err) {
                if (err?.response?.status === 403) {
                    logout();
                } else if (err?.response.status === 400) {
                    alert('Incorrect password');
                } else if (err?.response?.data) {
                    console.log(err.response.data);
                } else {
                    console.log(err.message);
                }
            }
        }
    }

    return ( 
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                            <p className="text-gray-600">Update your account password</p>
                        </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="max-w-md mx-auto">                    
                            <form onSubmit={(e) => updatePassword(e)} className="space-y-4">                                
                                <div>
                                    <label htmlFor="currentPass" className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="currentPass"
                                            value={currentPass}
                                            onChange={(e) => setCurrentPass(e.target.value)}
                                            required
                                            placeholder="Enter current password"
                                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="newPass" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="newPass"
                                            value={newPass}
                                            onChange={(e) => setNewPass(e.target.value)}
                                            required
                                            placeholder="Enter new password"
                                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="confirmPass"
                                            value={confirmPass}
                                            onChange={(e) => setConfirmPass(e.target.value)}
                                            required
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>                            

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Profile;