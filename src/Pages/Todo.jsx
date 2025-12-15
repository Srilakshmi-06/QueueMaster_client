import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import axios from 'axios';

const Todo = () => {
    const [todo, setTodo] = useState('')
    const [status, setStatus] = useState(false)
    const [todoArray, setTodoArray] = useState([]);

    useEffect(() => {
        getTodo()
    }, [])

    const postTodo = async () => {
        if (!todo.trim()) {
            alert("Enter Something!!")
            return;
        }
        await axios.post("http://localhost:5000/todo/addtodo", { todo });
        setTodo('')
        getTodo()
        setStatus(true)
        setTimeout(() => setStatus(false), 3000)
    }

    const getTodo = async () => {
        const res = await axios.get("http://localhost:5000/todo/gettodo")
        setTodoArray(res.data)
    }

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/todo/deletetodo/${id}`)
        getTodo()
    }

    const newTodo = (id, data) => {
        const newdata = prompt("Enter new Data:", data);
        if (!newdata || !newdata.trim()) return;
        updateTodo(id, newdata);
    };

    const updateTodo = async (id, data) => {
        await axios.put(
            `http://localhost:5000/todo/updatetodo/${id}`,
            { todo: data }
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
                            <span className="text-gray-800 font-medium">
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
