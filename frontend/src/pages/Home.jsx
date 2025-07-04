import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
    }

    return ( 
        <div>
            <p className="text-lg">Home page</p>
            <button onClick={logout}>Logout</button>
        </div>
     );
}
 
export default Home;