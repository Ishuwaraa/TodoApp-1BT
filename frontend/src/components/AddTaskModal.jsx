import { Modal } from '@mui/material';
import { useState } from 'react';
import { axiosInstance } from '../lib/axios';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AddTaskModal = ({ open, handleClose, todos, setTodos }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [dueTime, setDueTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        
        if (token) {
            try {
                const formattedDate = dueDate.toISOString().split('T')[0];
                const formData = { title, description, dueDate: formattedDate, dueTime };
                const { data } = await axiosInstance.post('/tasks/', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(data);
                alert('Task added successfully');
                setTodos(prevTodos => [...prevTodos, data]);
                setTitle('');
                setDescription('');
                setDueDate(new Date());
                handleClose();
            } catch (err) {
                if (err?.response) {
                    console.log(err.response?.data);
                } else {
                    console.log(err.message);
                }
            }
        }
    }

    return ( 
        <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center"
        >
            <div className="bg-white w-[500px] p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Add Task</h2>
                
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
                    <button type='button' onClick={() => console.log(dueTime)}>click</button>
                    <button type='button' onClick={handleClose}>Close</button>
                    <button type="submit">Add Task</button>
                </form>
            </div>
        </Modal>
     );
}
 
export default AddTaskModal;