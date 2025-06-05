import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple hard-coded auth
    if ((username === 'admin' && password === 'admin') ||
        (username === 'user' && password === 'password')) {
      const isAdmin = username === 'admin';
      const stored = localStorage.getItem('users');
      const users = stored ? JSON.parse(stored) : {};
      if (!users[username]) {
        users[username] = { balance: 100 };
      }
      localStorage.setItem('users', JSON.stringify(users));
      const user = { username, isAdmin, balance: users[username].balance };
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin(user);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <div className="text-red-500">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        />
        <button type="submit" className="w-full bg-yellow-500 text-black py-2 rounded">Login</button>
      </form>
    </div>
  );
}

export default Login;
