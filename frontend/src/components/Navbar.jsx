import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                const { data } = await axiosInstance.get('/user/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(data);
                setUser(data?.name);
                localStorage.setItem('user', data?.name);
            } catch (err) {
                if (err?.response?.status === 403) {
                    logout();
                } else if (err?.response?.data) {
                    console.log(err.response.data);
                    toast.error('Error fetching user data');
                } else {
                    console.log(err.message);
                    toast.error('Error fetching user data');
                }
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    }

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            fetchUserData();
            console.log('hi');
        } else {
            setUser(localStorage.getItem('user'))
        }
    }, [])

    return ( 
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <a href="/" className="text-xl font-bold text-gray-900">Task Manager</a>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">                    
                        <a href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                            Profile
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user && (
                            <span className="text-gray-700 hidden sm:block font-medium">Welcome, {user}</span>
                        )}
                        <button
                            onClick={logout}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
     );
}
 
export default Navbar;