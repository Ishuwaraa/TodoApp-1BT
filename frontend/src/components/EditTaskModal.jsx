import { Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditTaskModal = ({ open, handleClose, taskId, taskTitle, taskDesc, taskDate, taskTime, fetchTodos }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [dueTime, setDueTime] = useState('');
    const [loading, setLoading] = useState(false);

    const logout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        
        if (token) {
            try {
                setLoading(true);
                const formattedDate = dueDate.toISOString().split('T')[0];
                const formData = { title, description, dueDate: formattedDate, dueTime };
                const { data } = await axiosInstance.put(`/tasks/${taskId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(data);
                toast.success('Task updated successfully');
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
                    toast.error('No task found')
                } else if (err?.response) {
                    console.log(err.response?.data);
                    toast.error('Error updating the task');
                } else {
                    console.log(err.message);
                    toast.error('Error updating the task');
                }
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
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
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>                
                </div>
                
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">                    
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input 
                            type="text" 
                            id="title"
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            placeholder="Enter title"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea 
                            id="description"
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows={4} 
                            placeholder="Enter description"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">                        
                                Due Date
                            </label>
                            <DatePicker
                                showIcon
                                required
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                className="w-full h-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-2">
                                Due Time
                            </label>
                            <input 
                                type="time" 
                                id="dueTime"
                                value={dueTime} 
                                onChange={(e) => setDueTime(e.target.value)}
                                className="w-full h-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={`px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors font-medium
                                ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Task'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
     );
}
 
export default EditTaskModal;