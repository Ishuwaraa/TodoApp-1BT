import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useEffect, useState } from "react";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import BannerImg from "../assets/banner.png";
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Home = () => {    
    const navigate = useNavigate();    
    const [todos, setTodos] = useState([]);
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [openEditTaskModal, setOpenEditTaskModal] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [sortBy, setSortBy] = useState('dueDate');
    const [loading, setLoading] = useState(false);

    const handleOpenAddTaskModal = () => setOpenAddTaskModal(true);
    const handleCloseAddTaskModal = () => setOpenAddTaskModal(false);
    
    const handleOpenEditTaskModal = (todo) => {
        setSelectedTodo(todo);
        setOpenEditTaskModal(true);
    };
    const handleCloseEditTaskModal = () => {
        setOpenEditTaskModal(false);
        setSelectedTodo(null);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    }

    const fetchToDos = async () => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get('/tasks/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(data);
                setTodos(data);
            } catch (err) {
                if (err?.response?.status === 403) {
                    logout();
                } else if (err?.response?.data) {
                    console.log(err.response.data);
                    toast.error('Error fetching tasks');
                } else {
                    console.log(err.message);
                    toast.error('Error fetching tasks');
                }
            } finally {
                setLoading(false);
            }
        }
    }

    const deleteTodo = async (id) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            if (confirm('Are you sure you want to delee this task?')) {
                try {
                    const { data } = await axiosInstance.delete(`/tasks/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    toast.success(data);
                    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
                } catch (err) {
                    if (err?.response?.status === 403) {
                        logout();
                    } else if (err?.response?.status == 404) {
                        toast.error('No task found')
                    } else if (err?.response) {
                        console.log(err.response?.data);
                        toast.error('Error deleting the task');
                    } else {
                        console.log(err.message);
                        toast.error('Error deleting the task');
                    }
                }
            }
        }
    }

    const getTaskStatus = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
                
        const todayString = today.toDateString();
        const dueString = due.toDateString();
        
        if (dueString === todayString) {
            return { text: 'Due Today', color: 'bg-orange-500' };
        } else if (due < today) {
            return { text: 'Overdue', color: 'bg-red-500' };
        } else {
            return { text: 'Pending', color: 'bg-green-500' };
        }
    };

    const sortedTodos = [...todos].sort((a, b) => {
        if (sortBy === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });    

    useEffect(() => {
        fetchToDos();
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">            
            <Navbar />
           
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-blue-50 rounded-2xl p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Stay on Top of Your Tasks
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Manage your to-do list, keep track of progress, and never miss a deadline.
                                Let's make productivity simple.
                            </p>
                            <button
                                onClick={handleOpenAddTaskModal}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                Add New Task
                            </button>
                            <AddTaskModal open={openAddTaskModal} handleClose={handleCloseAddTaskModal} setTodos={setTodos}/>
                        </div>
                        <div className="hidden lg:block">
                            <img 
                                src={BannerImg}
                                alt="Task Managemer Banner" 
                                className="max-w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Your Tasks</h3>
                                                                                   
                            <div className="flex items-center space-x-2">
                                <label htmlFor="sortBy" className="text-gray-700 font-medium">
                                    Sort By:
                                </label>
                                <select
                                    id="sortBy"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value='dueDate'>Due Date</option>
                                    <option value='createdDate'>Created Date</option>                                    
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <div className="text-gray-500 text-lg mt-4">Loading tasks...</div>
                            </div>
                        ) : sortedTodos.length > 0 ? (
                            <div className="h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedTodos.map((todo, index) => {
                                        const createdAt = new Date(todo?.createdAt);
                                        const dueDate = new Date(todo?.dueDate);
                                        const today = new Date();
                                        const status = getTaskStatus(todo?.dueDate);
                                        const isDueToday = dueDate.toDateString() === today.toDateString();

                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{todo?.title}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-600 max-w-xs">{todo?.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm ${isDueToday ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                                                        {dueDate.toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {todo?.dueTime?.slice(0, 5)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs text-white font-semibold rounded-full ${status.color}`}>
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className='text-sm text-gray-900'>
                                                        {createdAt.toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleOpenEditTaskModal(todo)}
                                                            className="text-blue-600 hover:text-blue-800 p-1"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteTodo(todo?.id)}
                                                            className="text-red-600 hover:text-red-800 p-1"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            </div>
                        ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">No tasks found</div>
                            <p className="text-gray-400 mt-2">Create your first task to get started!</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>            

            {selectedTodo && (
                <EditTaskModal
                    open={openEditTaskModal}
                    handleClose={handleCloseEditTaskModal}
                    taskId={selectedTodo.id}
                    taskTitle={selectedTodo.title}
                    taskDesc={selectedTodo.description}
                    taskDate={selectedTodo.dueDate}
                    taskTime={selectedTodo.dueTime}
                    fetchTodos={fetchToDos}
                />
            )}
        </div>
    );
}

export default Home;