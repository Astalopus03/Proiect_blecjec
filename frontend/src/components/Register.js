import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/auth/register', {
                username,
                password
            });
            alert('User registered successfully');
            navigate('/login');
        } catch (error) {
            alert('Registration failed: ' + error.response.data.message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
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
                    <button type="submit" className="register-btn">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
