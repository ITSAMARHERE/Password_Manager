import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:3000";

const Login = ({ onLogin, switchToRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin(data.user);
      
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl shadow-purple-900/20 p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-purple-500">&lt;</span>
          <span className="text-gray-100">Pass</span>
          <span className="text-purple-500">VAULT/&gt;</span>
        </h1>
        <p className="text-purple-400 text-lg">Secure your digital life</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 rounded-lg px-8 py-3 w-full border-none shadow-lg shadow-purple-900/30 text-white font-medium transition-all duration-200 disabled:bg-purple-800 disabled:opacity-70"
          >
            {loading ? "Logging in..." : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Don't have an account?{" "}
          <button 
            onClick={switchToRegister}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

const Register = ({ onRegister, switchToLogin }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onRegister(data.user);
      
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl shadow-purple-900/20 p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-purple-500">&lt;</span>
          <span className="text-gray-100">Pass</span>
          <span className="text-purple-500">VAULT/&gt;</span>
        </h1>
        <p className="text-purple-400 text-lg">Create your secure vault</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="name">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength="6"
                className="rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200"
                placeholder="Create a strong password (min. 6 characters)"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 rounded-lg px-8 py-3 w-full border-none shadow-lg shadow-purple-900/30 text-white font-medium transition-all duration-200 disabled:bg-purple-800 disabled:opacity-70"
          >
            {loading ? "Creating account..." : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{" "}
          <button 
            onClick={switchToLogin}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

const PasswordManager = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [passwordArray, setPasswordArray] = useState([]);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [passwordLength, setPasswordLength] = useState(12);
  const [passwordOptions, setPasswordOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  
  const passwordRef = useRef();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      
      if (token && savedUser) {
        try {

          const response = await fetch(`${API_URL}/api/profile`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            setUser(JSON.parse(savedUser));
          } else {

            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Auth error:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  

  useEffect(() => {
    if (user) {
      getPasswords();
    }
  }, [user]);
  
  const getPasswords = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/passwords`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch passwords");
      }
      
      const passwords = await response.json();
      setPasswordArray(passwords);
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const handleLogin = (userData) => {
    setUser(userData);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPasswordArray([]);
  };
  
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
    });
  };
  
  const togglePasswordVisibility = () => {

    if (passwordRef.current) {
      const newType = passwordRef.current.type === "password" ? "text" : "password";
      passwordRef.current.type = newType;
      

      setShowPasswordField(newType === "text");
    }
  };
  
  const savePassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      try {
        const token = localStorage.getItem("token");
        

        if (form.id) {

          const response = await fetch(`${API_URL}/api/passwords`, { 
            method: "PUT", 
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }, 
            body: JSON.stringify(form) 
          });
          
          if (!response.ok) {
            throw new Error("Failed to update password");
          }
          

          setPasswordArray(
            passwordArray.map(item => 
              item.id === form.id ? form : item
            )
          );
          
          toast.success('Password updated!', {
            theme: "dark",
          });
        } else {

          const newPassword = { ...form, id: uuidv4() };
          

          const response = await fetch(`${API_URL}/api/passwords`, { 
            method: "POST", 
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }, 
            body: JSON.stringify(newPassword) 
          });
          
          if (!response.ok) {
            throw new Error("Failed to save password");
          }
          
     
          setPasswordArray([...passwordArray, newPassword]);
          
          toast.success('Password saved!', {
            theme: "dark",
          });
        }
        
       
        setForm({ site: "", username: "", password: "" });
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error('Error: All fields must be at least 4 characters!', {
        theme: "dark"
      });
    }
  };
  
  const deletePassword = async (id) => {
    const confirmDelete = window.confirm("Do you really want to delete this password?");
    
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/passwords`, { 
          method: "DELETE", 
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }, 
          body: JSON.stringify({ id }) 
        });
        
        if (!response.ok) {
          throw new Error("Failed to delete password");
        }
        
        setPasswordArray(passwordArray.filter(item => item.id !== id));
        
        toast.success('Password deleted!', {
          theme: "dark",
        });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  
  const editPassword = (id) => {

    const passwordToEdit = passwordArray.find(item => item.id === id);
    if (passwordToEdit) {
    
      setForm({ ...passwordToEdit });
      
     
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const generateRandomPassword = () => {
    setIsGeneratingPassword(true); 
  };
  
  const handleCreatePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+{}[]|:;<>,.?/~";
    
    let charSet = "";
    if (passwordOptions.uppercase) charSet += uppercaseChars;
    if (passwordOptions.lowercase) charSet += lowercaseChars;
    if (passwordOptions.numbers) charSet += numberChars;
    if (passwordOptions.symbols) charSet += symbolChars;
    
    if (charSet === "") {
      toast.error("Please select at least one character type");
      return;
    }
    
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      password += charSet[randomIndex];
    }
    
    setForm({ ...form, password });
    setIsGeneratingPassword(false);
    
    toast.success("Password generated!", {
      theme: "dark"
    });
  };
  
  const filteredPasswords = passwordArray.filter(item => 
    item.site.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  

  if (!user) {
    return (
      <>
        <ToastContainer />
        <div className="absolute inset-0 -z-10 h-full w-full bg-gray-950 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-900 opacity-20 blur-[100px]"></div>
        </div>
        <div className="min-h-screen flex items-center justify-center p-4">
          {authMode === 'login' ? (
            <Login 
              onLogin={handleLogin} 
              switchToRegister={() => setAuthMode('register')} 
            />
          ) : (
            <Register 
              onRegister={handleLogin} 
              switchToLogin={() => setAuthMode('login')} 
            />
          )}
        </div>
      </>
    );
  }
  

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 -z-10 h-full w-full bg-gray-950 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-900 opacity-20 blur-[100px]"></div>
      </div>
      
      <div className="min-h-screen p-4 md:p-6">
        <header className="container mx-auto flex flex-col md:flex-row justify-between items-center mb-6 bg-gray-900 rounded-xl shadow-lg shadow-purple-900/20 p-4">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-2 bg-purple-600 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="text-purple-500">&lt;</span>
                <span className="text-gray-100">Pass</span>
                <span className="text-purple-500">VAULT/&gt;</span>
              </h1>
              <p className="text-purple-400 text-sm">Secure Password Manager</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-right hidden md:block">
              <p className="text-gray-200 font-medium">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 text-gray-200 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>
        
        <main className="container mx-auto">
          {/* Password Form */}
          <div className="bg-gray-900 rounded-xl shadow-2xl shadow-purple-900/20 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {form.id ? 'Update Password' : 'Add New Password'}
            </h2>
            
            <div className="flex flex-col p-4 gap-6 items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input 
                  value={form.site} 
                  onChange={handleChange} 
                  placeholder='Enter website URL (e.g. https://example.com)' 
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
                    placeholder='Enter username or email' 
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
                    placeholder='Enter password' 
                    className='rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-4 py-3 pl-10 pr-24 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200' 
                    type="password" 
                    name="password" 
                    id="password" 
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-purple-400 focus:outline-none p-2"
                    >
                      {showPasswordField ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-gray-400 hover:text-purple-400 focus:outline-none p-2"
                      title="Generate Password"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {isGeneratingPassword && (
                <div className="w-full bg-gray-800 p-4 rounded-lg mt-4 border border-gray-700">
                  <h3 className="text-lg text-gray-200 mb-3">Password Generator</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-gray-300 block mb-2">Password Length: {passwordLength}</label>
                      <input 
                        type="range" 
                        min="8" 
                        max="32" 
                        value={passwordLength} 
                        onChange={e => setPasswordLength(parseInt(e.target.value))} 
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={passwordOptions.uppercase} 
                          onChange={e => setPasswordOptions({...passwordOptions, uppercase: e.target.checked})} 
                          className="w-4 h-4 accent-purple-500"
                        />
                        Uppercase (A-Z)
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={passwordOptions.lowercase} 
                          onChange={e => setPasswordOptions({...passwordOptions, lowercase: e.target.checked})} 
                          className="w-4 h-4 accent-purple-500"
                        />
                        Lowercase (a-z)
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={passwordOptions.numbers} 
                          onChange={e => setPasswordOptions({...passwordOptions, numbers: e.target.checked})} 
                          className="w-4 h-4 accent-purple-500"
                        />
                        Numbers (0-9)
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={passwordOptions.symbols} 
                          onChange={e => setPasswordOptions({...passwordOptions, symbols: e.target.checked})} 
                          className="w-4 h-4 accent-purple-500"
                        />
                        Symbols (!@#$...)
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={handleCreatePassword}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex-1"
                      >
                        Generate
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsGeneratingPassword(false)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row w-full gap-4">
                <button 
                  onClick={savePassword}
                  className="flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 rounded-lg px-8 py-3 w-full border-none shadow-lg shadow-purple-900/30 text-white font-medium transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {form.id ? 'Update Password' : 'Save Password'}
                </button>
                {form.id && (
                  <button 
                    onClick={() => setForm({ site: "", username: "", password: "" })}
                    className="flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 rounded-lg px-8 py-3 w-full border-none text-white font-medium transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Password List */}
          <div className="bg-gray-900 rounded-xl shadow-2xl shadow-purple-900/20 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4 md:mb-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Saved Passwords ({filteredPasswords.length})
              </h2>
              
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search passwords..."
                  className="rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 w-full p-2 pl-10 text-gray-200 placeholder-gray-500 outline-none transition-all duration-200"
                />
              </div>
            </div>
            
            {filteredPasswords.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-medium text-gray-300 mb-1">No passwords found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try a different search term" : "Add your first password using the form above"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="text-left bg-gray-800 rounded-lg">
                    <tr>
                      <th className="px-4 py-3 text-gray-300 font-medium rounded-tl-lg">Website</th>
                      <th className="px-4 py-3 text-gray-300 font-medium">Username</th>
                      <th className="px-4 py-3 text-gray-300 font-medium">Password</th>
                      <th className="px-4 py-3 text-gray-300 font-medium rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPasswords.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-800/30'}>
                        <td className="px-4 py-3 text-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                              {item.site.startsWith('http') ? (
                                <img 
                                  src={`https://www.google.com/s2/favicons?domain=${item.site}`} 
                                  alt="" 
                                  className="w-4 h-4"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'%3E%3C/path%3E%3C/svg%3E";
                                  }}
                                />
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                              )}
                            </div>
                            <div className="truncate max-w-[12rem]">{item.site}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="truncate max-w-[12rem]">{item.username}</div>
                            <button 
                              onClick={() => copyText(item.username)}
                              className="text-gray-400 hover:text-purple-400 focus:outline-none p-1"
                              title="Copy username"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="font-mono tracking-wide">••••••••</div>
                            <button 
                              onClick={() => copyText(item.password)}
                              className="text-gray-400 hover:text-purple-400 focus:outline-none p-1"
                              title="Copy password"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-200">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => editPassword(item.id)}
                              className="p-1 text-gray-400 hover:text-blue-400 focus:outline-none"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => deletePassword(item.id)}
                              className="p-1 text-gray-400 hover:text-red-400 focus:outline-none"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
        
        <footer className="container mx-auto mt-8 pb-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PassVAULT. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default PasswordManager;