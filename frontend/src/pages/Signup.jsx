import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(name, email, password);
            const formData = { name, email, password };
            const { data } = await axiosInstance.post('/auth/register', formData);
            console.log(data);
            navigate('/login', { replace: true });
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
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" /><br />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="johndoe@gmail.com" /><br />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="****"/><br />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? &nbsp; <a href="/login">Log in now</a></p>
        </div>
     );
}
 
export default SignUp;