import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const ResetPassword = () => {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(newPass !== confirmPass) {
            alert('passwords do not match');
            return
        }

        if (!token) {
            return;
        }

        try {
            const { data } = await axiosInstance.post('/auth/reset-password', { password: newPass, token });
            console.log(data);
            // navigate('/login', { replace: true });
            setSubmitted(true);
        } catch (err) {
            if (err?.response?.data) {
                console.log(err.response.data);
            }

            console.log(err.message);
        }
    }


    return ( 
        <div>
            {!submitted ? (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <p>Create New Password</p>
                    <p>Please enter and confirm your new password</p>


                    <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required placeholder="Enter new password" /><br />
                    <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required placeholder="Confirm new password" /><br />

                    <button type="submit" disabled={!token}>Reset password</button>
                </form>
            ) : (
                <div>
                    <p>Password reset sucessful</p>
                    <p>Your password has been updated successfully</p>
                    <a href="/login">Back to Login</a>
                </div>
            )}
        </div>
     );
}
 
export default ResetPassword;