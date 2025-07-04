import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axiosInstance.post('/auth/forgot-password', { email });
            console.log(data);
            setSubmitted(true);
        } catch (err) {
            if (err?.response?.data) {
                console.log(err.response.data);
            } else {
                console.log(err.message);
            }
        }
    }
    return ( 
        <div>
            {!submitted ? (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="johndoe@gmail.com" /><br />
                    <button type="submit">Send reset link</button>
                </form>
            ) : (
                <div>
                    <p>
                        We've sent a password reset link to <span>{email}</span>
                    </p>
                    <p>
                        Didn't receive the email? Check your spam folder or 
                    </p>
                    <button 
                        onClick={() => setSubmitted(false)} 
                    >
                        try again
                    </button>
                </div>
            )}
        </div>
     );
}
 
export default ForgotPassword;