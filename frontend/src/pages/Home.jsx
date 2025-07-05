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
                }
                else if (err?.response?.data) {
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
                }
                else if (err?.response?.data) {
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
                if (err?.response?.status == 404) {
                alert('No task found')
            } else if (err?.response) {
                console.log(err.response?.data);
            } else {
                console.log(err.message);
            }
            }
        }
    }

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
                    todos.map((todo, index) => {
                        const createdAt = new Date(todo?.createdAt);
                        const dueDate = new Date(todo?.dueDate);
                        const today = new Date();

                        const isDueToday = dueDate.toDateString() === today.toDateString();

                        return (
                            <div key={index} style={{ color: isDueToday ? 'red' : 'black' }}>
                                <p>{todo?.title}</p>
                                <p>{todo?.description}</p>
                                <p>due date: {dueDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                                <p>time : {todo?.dueTime?.slice(0, 5)}</p>
                                <p>created at: {createdAt.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                                <div>
                                    <button onClick={() => handleOpenEditTaskModal(todo)}>Edit</button> |&nbsp; 
                                    <button onClick={() => deleteTodo(todo?.id)}>Delete</button>
                                </div>
                                <p>---------</p>
                            </div>
                        )
                    })
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
                    fetchTodos={fetchToDos}
                />
            )}
        </div>
     );
}
 
export default Home;