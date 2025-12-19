import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import axios from 'axios';

const Todo = () => {
    const [todo, setTodo] = useState('')
    const [status, setStatus] = useState(false)
    const [todoArray, setTodoArray] = useState([]);

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("qmToken")}`
        }
    };

    useEffect(() => {
        getTodo()
    }, [])

    const postTodo = async () => {
        if (!todo.trim()) {
            alert("Enter Something!!")
            return;
        }
        await axios.post("https://queuemaster-server-1.onrender.com/todo/addtodo", { todo }, config);
        setTodo('')
        getTodo()
        setStatus(true)
        setTimeout(() => setStatus(false), 3000)
    }

    const getTodo = async () => {
        const res = await axios.get("https://queuemaster-server-1.onrender.com/todo/gettodo", config)
        setTodoArray(res.data)
    }

    const deleteTodo = async (id) => {
        await axios.delete(`https://queuemaster-server-1.onrender.com/todo/deletetodo/${id}`, config)
        getTodo()
    }

    const newTodo = (id, data) => {
        const newdata = prompt("Enter new Data:", data);
        if (!newdata || !newdata.trim()) return;
        updateTodo(id, newdata);
    };

    const updateTodo = async (id, data) => {
        await axios.put(
            `https://queuemaster-server-1.onrender.com/todo/updatetodo/${id}`,
            { todo: data }, config
        );
        getTodo();
    };

    const toggleTodo = async (id) => {
        await axios.patch(
            `https://queuemaster-server-1.onrender.com/todo/toggle/${id}`,
            {},
            config
        );
        getTodo();
    };


    return (
        <div className="min-h-screen bg-white flex justify-center items-start py-30">
            <div className="bg-amber-100 w-full max-w-2xl rounded-2xl shadow-xl p-8">

                {/* Heading */}
                <Typography variant="h4" className="text-center font-bold text-gray-800 mb-8">
                    Todo List
                </Typography>

                {/* Input Section */}
                <div className="flex gap-4 mb-6">
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            fullWidth
                            label="Enter your task"
                            value={todo}
                            onChange={(e) => setTodo(e.target.value)}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        onClick={postTodo}
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        Add
                    </Button>
                </div>

                {/* Success Alert */}
                {status && (
                    <div className="fixed top-5 right-5 z-50">
                        <Alert severity="success">
                            Todo added successfully
                        </Alert>
                    </div>
                )}

                {/* Todo List */}
                <ul className="space-y-4">
                    {todoArray.map((r) => (
                        <li
                            key={r._id}
                            className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-200 transition"
                        >
                            <button
                                onClick={() => toggleTodo(r._id)}
                                className={`transition ${r.completed
                                    ? "text-green-600"
                                    : "text-gray-400 hover:text-green-600"
                                    }`}
                            >
                                <FaCheckCircle size={18} />
                            </button>

                            <span
                                className={`font-medium ${r.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-800"
                                    }`}
                            >
                                {r.todo}
                            </span>


                            <div className="flex gap-3">
                                <button
                                    onClick={() => newTodo(r._id, r.todo)}
                                    className="text-blue-600 hover:text-blue-800 transition"
                                >
                                    <FaEdit size={18} />
                                </button>

                                <button
                                    onClick={() => deleteTodo(r._id)}
                                    className="text-red-600 hover:text-red-800 transition"
                                >
                                    <RiDeleteBin6Line size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Empty State */}
                {todoArray.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">
                        No todos yet. Add one 👆
                    </p>
                )}
            </div>
        </div>
    )
}

export default Todo
