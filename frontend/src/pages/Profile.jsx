import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

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
                } else if (err?.response?.data) {
                    console.log(err.response.data);
                } else {
                    console.log(err.message);
                }
            }
        }
    }

    return ( 
        <div>
            <p>Change password</p>

            <form onSubmit={(e) => updatePassword(e)}>
                <input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} required placeholder="Enter current password" /><br />
                <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required placeholder="Enter new password" /><br />
                <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required placeholder="Confirm new password" /><br />

                <button type="submit">Change Password</button>
            </form>
        </div>
     );
}
 
export default Profile;