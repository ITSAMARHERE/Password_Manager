import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env?.VITE_API_URL || 
               (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 
               'http://localhost:3000';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [passwordLength, setPasswordLength] = useState(12)
    const [showPasswordOptions, setShowPasswordOptions] = useState(false)
    const [passwordOptions, setPasswordOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    })

    const getPasswords = async () => {
        try {
            let req = await fetch(`${API_URL}/`)
            let passwords = await req.json()
            setPasswordArray(passwords)
        } catch (error) {
            console.error("Error fetching passwords:", error)
            toast.error("Failed to fetch passwords")
        }
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        toast.success('Copied to clipboard!', {
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

    const generatePassword = () => {
        setIsGenerating(true)
        
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
        const numberChars = "0123456789"
        const symbolChars = "!@#$%^&*()_-+=[]{}|:;<>,.?/"
        
        let validChars = ""
        if (passwordOptions.uppercase) validChars += uppercaseChars
        if (passwordOptions.lowercase) validChars += lowercaseChars
        if (passwordOptions.numbers) validChars += numberChars
        if (passwordOptions.symbols) validChars += symbolChars
        
        if (validChars === "") {
            toast.error("Please select at least one character type")
            setIsGenerating(false)
            return
        }
        
        let generatedPassword = ""
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * validChars.length)
            generatedPassword += validChars[randomIndex]
        }
        
        setform({ ...form, password: generatedPassword })
        setIsGenerating(false)
        
        toast.success('Strong password generated!', {
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

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            try {
                // If any such id exists in the db, delete it 
                if (form.id) {
                    await fetch(`${API_URL}/`, { 
                        method: "DELETE", 
                        headers: { "Content-Type": "application/json" }, 
                        body: JSON.stringify({ id: form.id }) 
                    })
                }

                const newPasswordItem = { ...form, id: uuidv4() }
                setPasswordArray([...passwordArray, newPasswordItem])
                
                await fetch(`${API_URL}/`, { 
                    method: "POST", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify(newPasswordItem) 
                })

                // Clear the form and show toast
                setform({ site: "", username: "", password: "" })
                toast.success('Password saved successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } catch (error) {
                console.error("Error saving password:", error)
                toast.error("Failed to save password")
            }
        }
        else {
            toast.error('Error: All fields must be longer than 3 characters.');
        }
    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            try {
                setPasswordArray(passwordArray.filter(item => item.id !== id))
                
                await fetch(`${API_URL}/`, { 
                    method: "DELETE", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify({ id }) 
                })

                toast.success('Password deleted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true, 
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } catch (error) {
                console.error("Error deleting password:", error)
                toast.error("Failed to delete password")
            }
        }
    }

    const editPassword = (id) => {
        const passwordToEdit = passwordArray.find(i => i.id === id)
        if (passwordToEdit) {
            setform({ ...passwordToEdit, id: id })
            setPasswordArray(passwordArray.filter(item => item.id !== id))
        }
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handlePasswordOptionChange = (option) => {
        setPasswordOptions({
            ...passwordOptions,
            [option]: !passwordOptions[option]
        })
    }

    return (
        <div className="min-h-screen relative">
            <div className="fixed inset-0 bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 m-auto h-64 w-64 rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
            </div>
            
            <ToastContainer />
            <div className="p-3 container mx-auto min-h-[88.2vh] max-w-6xl relative z-10">
                <div className="mb-8 pt-4">
                    <h1 className='text-4xl md:text-5xl font-bold text-center mb-2'>
                        <span className='text-green-500'> &lt;</span>
                        <span className="bg-gradient-to-r from-neutral-800 to-neutral-600 text-transparent bg-clip-text">Pass</span>
                        <span className='text-green-500'>Vault</span>
                        <span className='text-green-500'>/&gt;</span>
                    </h1>
                    <p className='text-green-900 text-lg text-center'>Your own secure Password Manager</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg shadow-green-900/10 border border-green-100 mb-10">
                    <h2 className="text-xl font-semibold mb-6 text-green-800 border-b border-green-200 pb-2">Add New Password</h2>
                    
                    <div className="flex flex-col p-4 text-black gap-6">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="site" className="text-sm font-medium text-gray-700">Website URL</label>
                            <input 
                                value={form.site} 
                                onChange={handleChange} 
                                placeholder='Enter website URL (e.g. example.com)' 
                                className='rounded-lg border border-green-200 w-full p-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300' 
                                type="text" 
                                name="site" 
                                id="site" 
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username / Email</label>
                                <input 
                                    value={form.username} 
                                    onChange={handleChange} 
                                    placeholder='Enter username or email' 
                                    className='rounded-lg border border-green-200 w-full p-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300' 
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                />
                            </div>
                            
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input 
                                        ref={passwordRef} 
                                        value={form.password} 
                                        onChange={handleChange} 
                                        placeholder='Enter password' 
                                        className='rounded-lg border border-green-200 w-full p-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300' 
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                    />
                                    <span className='absolute right-4 top-2.5 cursor-pointer' onClick={showPassword}>
                                        <img ref={ref} className='p-1' width={24} src="icons/eye.png" alt="eye" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            <button 
                                onClick={() => setShowPasswordOptions(!showPasswordOptions)} 
                                className='flex justify-center cursor-pointer items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 border border-gray-300'
                            >
                                {showPasswordOptions ? 'Hide Options' : 'Password Options'}
                            </button>
                            
                            <button 
                                onClick={generatePassword} 
                                disabled={isGenerating}
                                className='flex justify-center cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300 disabled:bg-blue-300'
                            >
                                {isGenerating ? 'Generating...' : 'Generate Strong Password'}
                            </button>
                            
                            <button 
                                onClick={savePassword} 
                                className='flex justify-center cursor-pointer items-center gap-2 bg-green-500 hover:bg-green-600 rounded-lg px-6 py-2 text-sm font-medium text-white transition-all duration-300 ml-auto'
                            >
                                Save Password
                            </button>
                        </div>
                        
                        {showPasswordOptions && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Password Generator Options</h3>
                                
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="length" className="text-sm text-gray-600">Length: {passwordLength}</label>
                                        <input 
                                            type="range" 
                                            id="length" 
                                            min="8" 
                                            max="32" 
                                            value={passwordLength} 
                                            onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                                            className="w-2/3" 
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                checked={passwordOptions.uppercase} 
                                                onChange={() => handlePasswordOptionChange('uppercase')}
                                                className="rounded text-green-500 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-600">Uppercase (A-Z)</span>
                                        </label>
                                        
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                checked={passwordOptions.lowercase} 
                                                onChange={() => handlePasswordOptionChange('lowercase')}
                                                className="rounded text-green-500 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-600">Lowercase (a-z)</span>
                                        </label>
                                        
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                checked={passwordOptions.numbers} 
                                                onChange={() => handlePasswordOptionChange('numbers')}
                                                className="rounded text-green-500 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-600">Numbers (0-9)</span>
                                        </label>
                                        
                                        <label className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                checked={passwordOptions.symbols} 
                                                onChange={() => handlePasswordOptionChange('symbols')}
                                                className="rounded text-green-500 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-600">Symbols (!@#$)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg shadow-green-900/10 border border-green-100 mb-10">
                    <div className="flex items-center justify-between mb-6 border-b border-green-200 pb-2">
                        <h2 className="text-xl font-semibold text-green-800">Your Passwords</h2>
                        <div className="text-sm text-gray-500">
                            {passwordArray.length} {passwordArray.length === 1 ? 'password' : 'passwords'} stored
                        </div>
                    </div>
                    
                    {passwordArray.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-lg font-medium">No passwords yet</p>
                            <p className="text-sm text-center max-w-md mt-2">Add your first password using the form above to keep your accounts secure and easily accessible.</p>
                        </div>
                    )}
                    
                    {passwordArray.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full rounded-lg overflow-hidden">
                                <thead className='bg-green-700 text-white'>
                                    <tr>
                                        <th className='py-3 px-4 text-left'>Website</th>
                                        <th className='py-3 px-4 text-left'>Username</th>
                                        <th className='py-3 px-4 text-left'>Password</th>
                                        <th className='py-3 px-4 text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-green-100'>
                                    {passwordArray.map((item, index) => {
                                        return (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-green-50' : 'bg-white'}>
                                                <td className='py-3 px-4'>
                                                    <div className='flex items-center'>
                                                        <a 
                                                            href={item.site.startsWith('http') ? item.site : `https://${item.site}`} 
                                                            target='_blank'
                                                            rel="noopener noreferrer"
                                                            className="text-green-600 hover:text-green-800 hover:underline transition-colors duration-300 truncate max-w-[180px] flex-1"
                                                        >
                                                            {item.site || ''}
                                                        </a>
                                                        <button 
                                                            className='ml-2 p-1 hover:bg-green-100 rounded-full transition-colors duration-300' 
                                                            onClick={() => { copyText(item.site || '') }}
                                                            title="Copy to clipboard"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='flex items-center'>
                                                        <span className="truncate max-w-[180px] flex-1">{item.username || ''}</span>
                                                        <button 
                                                            className='ml-2 p-1 hover:bg-green-100 rounded-full transition-colors duration-300' 
                                                            onClick={() => { copyText(item.username || '') }}
                                                            title="Copy to clipboard"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='flex items-center'>
                                                        <span className="font-mono">{item.password ? "•".repeat(Math.min(12, item.password.length)) : ''}</span>
                                                        <button 
                                                            className='ml-2 p-1 hover:bg-green-100 rounded-full transition-colors duration-300' 
                                                            onClick={() => { copyText(item.password || '') }}
                                                            title="Copy to clipboard"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className='py-3 px-4'>
                                                    <div className='flex items-center justify-center space-x-2'>
                                                        <button 
                                                            className='p-1.5 bg-blue-50 hover:bg-blue-100 cursor-pointer text-blue-600 rounded-lg transition-colors duration-300' 
                                                            onClick={() => { editPassword(item.id) }}
                                                            title="Edit password"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            className='p-1.5 bg-red-50 hover:bg-red-100 cursor-pointer text-red-600 rounded-lg transition-colors duration-300' 
                                                            onClick={() => { deletePassword(item.id) }}
                                                            title="Delete password"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Manager