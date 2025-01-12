import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login.css'; // Poți adăuga stiluri în acest fișier CSS separat
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                username,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem("numeUtilizator",response.data.username);
                navigate(response.data.redirectUrl);  // Redirecționare spre pagina jocului
            }
        } catch (error) {
            alert('Invalid credentials!');
        }
    };

    return (
        <div className="login-container">
            <div className="login_box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="register-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
