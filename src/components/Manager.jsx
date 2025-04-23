import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eyecross.png"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            // If form has an id, it means we're editing an existing password
            if (form.id) {
                // Update existing password in database
                await fetch("http://localhost:3000/", { 
                    method: "PUT", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify(form) 
                });
                
                // Update the state by replacing the old password with the edited one
                setPasswordArray(
                    passwordArray.map(item => 
                        item.id === form.id ? form : item
                    )
                );
                
                toast('Password updated!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                // Create a new password with a new ID
                const newPassword = { ...form, id: uuidv4() };
                
                // Save to database
                await fetch("http://localhost:3000/", { 
                    method: "POST", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify(newPassword) 
                });
                
                // Add the new password to the state
                setPasswordArray([...passwordArray, newPassword]);
                
                toast('Password saved!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
    
            // Clear the form
            setform({ site: "", username: "", password: "" });
        } else {
            toast.error('Error: All fields must be at least 4 characters!', {
                theme: "dark"
            });
        }
    };

    const deletePassword = async (id) => {
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            
            await fetch("http://localhost:3000/", { 
                method: "DELETE", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ id }) 
            })

            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true, 
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const editPassword = (id) => {
        // Find the password to edit
        const passwordToEdit = passwordArray.find(item => item.id === id);
        if (passwordToEdit) {
            // Set the form with the password data
            setform({ ...passwordToEdit });
        }
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer />
            <div className="absolute inset-0 -z-10 h-full w-full bg-gray-950 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-900 opacity-20 blur-[100px]"></div>
            </div>
            
            <div className="p-3 md:container mx-auto min-h-[88.2vh]">
                <div className="bg-gray-900 rounded-xl shadow-2xl shadow-purple-900/20 p-6 mb-8">
                    <h1 className='text-4xl font-bold text-center mb-2'>
                        <span className='text-purple-500'> &lt;</span>
                        <span className="text-gray-100">Pass</span>
                        <span className='text-purple-500'>VAULT/&gt;</span>
                    </h1>
                    <p className='text-purple-400 text-lg text-center'>Your secure password vault</p>

                    <div className="flex flex-col p-4 gap-6 items-center mt-4">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <input 
                                value={form.site} 
                                onChange={handleChange} 
                                placeholder='Enter website URL' 
                                className='rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200' 
                                type="text" 
                                name="site" 
                                id="site" 
                            />
                        </div>
                        
                        <div className="flex flex-col md:flex-row w-full justify-between gap-6">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input 
                                    value={form.username} 
                                    onChange={handleChange} 
                                    placeholder='Enter Username' 
                                    className='rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200' 
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                />
                            </div>
                            
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input 
                                    ref={passwordRef} 
                                    value={form.password} 
                                    onChange={handleChange} 
                                    placeholder='Enter Password' 
                                    className='rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200' 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                />
                                <span className='absolute right-3 top-3 cursor-pointer' onClick={showPassword}>
                                    <img ref={ref} className='p-1 opacity-70 hover:opacity-100 transition-opacity' width={26} src="icons/eye.png" alt="eye" />
                                </span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={savePassword} 
                            className='flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 rounded-lg px-8 py-3 w-fit border-none shadow-lg shadow-purple-900/30 text-white font-medium transition-all duration-200 transform hover:scale-105'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {form.id ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl shadow-2xl shadow-purple-900/20 p-6">
                    <h2 className='font-bold text-2xl py-4 text-gray-100 flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Your Passwords
                    </h2>
                    
                    {passwordArray.length === 0 && 
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p>No passwords saved yet</p>
                            <p className="text-sm mt-2">Add your first password using the form above</p>
                        </div>
                    }
                    
                    {passwordArray.length > 0 && 
                        <div className="overflow-x-auto rounded-lg">
                            <table className="table-auto w-full rounded-lg overflow-hidden mb-6">
                                <thead className='bg-gray-800 text-gray-200'>
                                    <tr>
                                        <th className='py-3 px-4 text-left'>Site</th>
                                        <th className='py-3 px-4 text-left'>Username</th>
                                        <th className='py-3 px-4 text-left'>Password</th>
                                        <th className='py-3 px-4 text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-gray-800 bg-opacity-50'>
                                    {passwordArray.map((item, index) => {
                                        return <tr key={index} className={index % 2 === 0 ? 'bg-gray-800 bg-opacity-30' : ''}>
                                            <td className='py-3 px-4 border-b border-gray-700'>
                                                <div className='flex items-center'>
                                                    <a href={item.site} target='_blank' className="text-purple-400 hover:text-purple-300 truncate max-w-xs">{item.site}</a>
                                                    <div className='ml-2 cursor-pointer text-gray-400 hover:text-white transition-colors' onClick={() => { copyText(item.site) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4 border-b border-gray-700'>
                                                <div className='flex items-center'>
                                                    <span className="text-gray-300 truncate max-w-xs">{item.username}</span>
                                                    <div className='ml-2 cursor-pointer text-gray-400 hover:text-white transition-colors' onClick={() => { copyText(item.username) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4 border-b border-gray-700'>
                                                <div className='flex items-center'>
                                                    <span className="text-gray-400">{"•".repeat(item.password.length)}</span>
                                                    <div className='ml-2 cursor-pointer text-gray-400 hover:text-white transition-colors' onClick={() => { copyText(item.password) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4 border-b border-gray-700 text-center'>
                                                <div className="flex justify-center space-x-3">
                                                    <button 
                                                        onClick={() => { editPassword(item.id) }}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-gray-700"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => { deletePassword(item.id) }}
                                                        className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-gray-700"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
             
            </div>
        </>
    )
}

export default Manager