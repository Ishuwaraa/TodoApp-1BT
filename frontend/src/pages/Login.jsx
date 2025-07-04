import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

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
            console.log(err?.response?.data);
        }

    }

    return ( 
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="johndoe@gmail.com" /><br />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="****"/><br />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account yet? &nbsp; <a href="/signup">Sign up now</a></p>
            <a href="/forgot-password">Forgot password</a>
        </div>
     );
}
 
export default Login;