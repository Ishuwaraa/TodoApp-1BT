import ErrorGif from '../assets/error404.gif';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
            <img 
                src={ErrorGif}
                alt="404 Animation" 
                className="w-full max-w-md mb-8"
            />
            
            <p className="text-4xl font-bold text-gray-800 mb-4">
                Oops! Page Not Found
            </p>
            
            <p className="text-gray-600 mb-8 max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link 
                to="/" 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Back to Home
            </Link>
        </div>
     );
}
 
export default NotFound;