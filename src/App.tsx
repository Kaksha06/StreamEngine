import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Watch from './pages/Watch';
import Upload from './pages/Upload';
import Search from './pages/Search';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="watch/:id" element={<Watch />} />
              <Route path="upload" element={<Upload />} />
              <Route path="search" element={<Search />} />
              <Route path="subscriptions" element={<div className="text-center py-12 text-gray-500 dark:text-gray-400">Subscriptions page - Coming soon!</div>} />
              <Route path="history" element={<div className="text-center py-12 text-gray-500 dark:text-gray-400">History page - Coming soon!</div>} />
              <Route path="liked" element={<div className="text-center py-12 text-gray-500 dark:text-gray-400">Liked videos page - Coming soon!</div>} />
              <Route path="your-videos" element={<div className="text-center py-12 text-gray-500 dark:text-gray-400">Your videos page - Coming soon!</div>} />
              <Route path="channel/:username" element={<div className="text-center py-12 text-gray-500 dark:text-gray-400">Channel page - Coming soon!</div>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;