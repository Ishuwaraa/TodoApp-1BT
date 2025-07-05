import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useEffect, useState } from "react";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [todos, setTodos] = useState([]);
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [openEditTaskModal, setOpenEditTaskModal] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);

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
        navigate('/login', { replace: true });
    }

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
                setUser(data);
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

    const fetchToDos = async () => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
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
                } else {
                    console.log(err.message);
                }
            }
        }
    }

    const deleteTodo = async (id) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                const { data } = await axiosInstance.delete(`/tasks/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert(data);
                setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
            } catch (err) {
                if (err?.response?.status === 403) {
                    logout();
                } else if (err?.response?.status == 404) {
                    alert('No task found')
                } else if (err?.response) {
                    console.log(err.response?.data);
                } else {
                    console.log(err.message);
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
            return { text: 'Due Today', color: 'red' };
        } else if (due < today) {
            return { text: 'Overdue', color: 'darkred' };
        } else {
            return { text: 'Pending', color: 'green' };
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchToDos();
    }, [])

    return ( 
        <div>
            <p className="text-lg">
                Welcome back {user?.name && <span>{user.name}</span>}
            </p>
            <button onClick={logout}>Logout</button><br />

            <a href="/profile">Profile</a><br />

            <div>
                <button onClick={handleOpenAddTaskModal}>Add Task</button>
                <AddTaskModal open={openAddTaskModal} handleClose={handleCloseAddTaskModal} setTodos={setTodos}/>
            </div>
            
            <div>
                <p>Your ToDos</p><br /><br />

                {todos.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Due date</th>
                                <th>Status</th>
                                <th>Created date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {todos.map((todo, index) => {
                                const createdAt = new Date(todo?.createdAt);
                                const dueDate = new Date(todo?.dueDate);
                                const today = new Date();
                                const status = getTaskStatus(todo?.dueDate);

                                const isDueToday = dueDate.toDateString() === today.toDateString();

                                return (
                                    <tr key={index}>
                                        <th>{todo?.title}</th>
                                        <th>{todo?.description}</th>
                                        <th style={{ color: isDueToday ? 'red' : 'black' }}>
                                            {dueDate.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} at {todo?.dueTime?.slice(0, 5)}
                                        </th>
                                        <td style={{ color: status.color }}>
                                            {status.text}
                                        </td>
                                        <th>
                                            {createdAt.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </th>
                                        <th>
                                            <button onClick={() => handleOpenEditTaskModal(todo)}>Edit</button> |&nbsp; 
                                            <button onClick={() => deleteTodo(todo?.id)}>Delete</button>
                                        </th>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
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