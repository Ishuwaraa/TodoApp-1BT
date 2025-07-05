import { Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

const EditTaskModal = ({ open, handleClose, taskId, taskTitle, taskDesc, taskDate, taskTime, fetchTodos }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [dueTime, setDueTime] = useState('');

    const logout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        
        if (token) {
            try {
                const formattedDate = dueDate.toISOString().split('T')[0];
                const formData = { title, description, dueDate: formattedDate, dueTime };
                const { data } = await axiosInstance.put(`/tasks/${taskId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(data);
                alert('Task updated successfully');
                setTitle('');
                setDescription('');
                setDueDate(new Date());
                setDueTime('');
                handleClose();
                fetchTodos();
            } catch (err) {
                if (err?.response?.status === 403) {
                    logout();
                } else if (err?.response?.status === 404) {
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
        console.log(taskTitle, taskDesc, taskDate)
        if (taskTitle) setTitle(taskTitle);
        if (taskDesc) setDescription(taskDesc);
        if (taskDate) setDueDate(new Date(taskDate));
        if (taskTime) setDueTime(taskTime);
    }, [taskTitle, taskDesc, taskDate, taskTime]);

    return ( 
        <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center"
        >
            <div className="bg-white w-[500px] p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Task</h2>
                
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} required placeholder='Enter title' /><br />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder='Enter description' /><br />

                    <DatePicker
                        showIcon
                        required
                        selected={dueDate}
                        onChange={(date) => setDueDate(date)}
                    />
                    <input 
                        type='time' 
                        value={dueTime} 
                        onChange={(e) => setDueTime(e.target.value)}
                        placeholder='Select time'
                    /><br />
                    <button type='button' onClick={handleClose}>Close</button>
                    <button type="submit">Update Task</button>
                </form>
            </div>
        </Modal>
     );
}
 
export default EditTaskModal;