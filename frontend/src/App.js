import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';  // Importă stilurile din App.css
import Login from './components/Login';
import Register from './components/Register';
import GamePage from "./components/GamePage";
function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<h1>Welcome to Blackjack</h1>} />
              <Route path="/game" element={<GamePage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
